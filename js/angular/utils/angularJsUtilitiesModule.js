import angular from 'angular';
import Roblox, {
    Endpoints,
    jsConsoleEnabled,
    XsrfToken
} from 'Roblox';
import {
    apiSiteRequestValidator,
    inject,
    instrumentation,
    isTracerEnabled,
    logs,
    tags,
    tracerConstants
} from 'roblox-tracer';
import {
    buildConfigBoundAuthToken,
    shouldRequestWithBoundAuthToken
} from '../../utilities/boundAuthTokens/http/boundAuthTokensHttpUtil';
import requestDuplication from '../../utilities/requestDuplicationUtilities';

// Constants for rendering a generic request challenge.
const GENERIC_CHALLENGE_LOG_PREFIX = 'Generic Challenge:';
const GENERIC_CHALLENGE_ID_HEADER = 'rblx-challenge-id';
const GENERIC_CHALLENGE_TYPE_HEADER = 'rblx-challenge-type';
const GENERIC_CHALLENGE_METADATA_HEADER = 'rblx-challenge-metadata';
const GENERIC_CHALLENGE_CONTAINER_ID = 'generic-challenge-container';

const angularJsUtilities = angular
    .module('angularJsUtilities', ['angularjsUtilitiesTemplates'])
    .config([
        '$httpProvider',
        function($httpProvider) {
            // Handle Generic Challenge headers (keep this FIRST in the chain since
            // interceptors are applied in BACKWARDS order for response errors, and
            // this handler should sit close to the business logic to avoid tampering
            // with expected schema of other error interceptors).
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                ($q, $injector) => ({
                    responseError(rejection) {
                        const {
                            [GENERIC_CHALLENGE_ID_HEADER]: challengeId, [GENERIC_CHALLENGE_TYPE_HEADER]: challengeTypeRaw, [GENERIC_CHALLENGE_METADATA_HEADER]: challengeMetadataJsonBase64
                        } = rejection.headers();

                        const anyChallengeHeaderFound =
                            challengeId !== undefined ||
                            challengeTypeRaw !== undefined ||
                            challengeMetadataJsonBase64 !== undefined;
                        const challengeAvailable =
                            challengeId !== undefined &&
                            challengeTypeRaw !== undefined &&
                            challengeMetadataJsonBase64 !== undefined;
                        if (challengeAvailable) {
                            if (Roblox && Roblox.AccountIntegrityChallengeService) {
                                return Roblox.AccountIntegrityChallengeService.Generic.interceptChallenge({
                                    retryRequest: (challengeIdInner, redemptionMetadataJsonBase64) => {
                                        // eslint-disable-next-line no-param-reassign
                                        rejection.config.headers[GENERIC_CHALLENGE_ID_HEADER] = challengeIdInner;
                                        // eslint-disable-next-line no-param-reassign
                                        rejection.config.headers[GENERIC_CHALLENGE_TYPE_HEADER] = challengeTypeRaw;
                                        // eslint-disable-next-line no-param-reassign
                                        rejection.config.headers[
                                            GENERIC_CHALLENGE_METADATA_HEADER
                                        ] = redemptionMetadataJsonBase64;
                                        const $http = $injector.get('$http');
                                        return $http(rejection.config);
                                    },
                                    containerId: GENERIC_CHALLENGE_CONTAINER_ID,
                                    challengeId,
                                    challengeTypeRaw,
                                    challengeMetadataJsonBase64
                                    // Wrap the error response in a `data` field to conform to the
                                    // expected schema in `httpService`.
                                }).catch(error => $q.reject({
                                    data: error
                                }));
                            }
                            // eslint-disable-next-line no-console
                            console.error(
                                GENERIC_CHALLENGE_LOG_PREFIX,
                                'Got challenge but challenge component not available'
                            );
                        } else if (anyChallengeHeaderFound) {
                            // eslint-disable-next-line no-console
                            console.error(GENERIC_CHALLENGE_LOG_PREFIX, 'Got only partial challenge headers');
                        }

                        return $q.reject(rejection);
                    }
                })
            ]);

            const CSRFTOKENHEADER = 'X-CSRF-TOKEN';
            const CSRFINVALIDRESPONSECODE = 403;

            const httpRetrySelector = angular.element('#http-retry-data');
            const HTTPRETRYBASETIMEOUT =
                httpRetrySelector && httpRetrySelector.data('http-retry-base-timeout') ?
                httpRetrySelector.data('http-retry-base-timeout') :
                1000;
            const HTTPRETRYMAXTIMEOUT =
                httpRetrySelector && httpRetrySelector.data('http-retry-max-timeout') ?
                httpRetrySelector.data('http-retry-max-timeout') :
                8000;
            const HTTPRETRYMAXTIMES =
                httpRetrySelector && httpRetrySelector.data('http-retry-max-times') ?
                httpRetrySelector.data('http-retry-max-times') :
                3;

            let currentToken;
            // Store the xsrfToken into XSRF-COOKIE when the main page gets loaded
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                function($q, $injector) {
                    return {
                        request(config) {
                            // if this is a post or delete
                            // add XsrfToken to header
                            if (
                                (config.method.toLowerCase() === 'post' ||
                                    config.method.toLowerCase() === 'delete' ||
                                    config.method.toLowerCase() === 'patch') &&
                                XsrfToken.getToken()
                            ) {
                                if (!currentToken) {
                                    currentToken = XsrfToken.getToken();
                                }
                                config.headers[CSRFTOKENHEADER] = currentToken;
                            }
                            return config;
                        },

                        responseError(rejection) {
                            // check if XsrfToken is not blank
                            // and Response code is 403, and there is a X-CSRF-TOKEN header
                            // Re-set XsrfToken to new value
                            // Re-issue request.
                            // otherwise, continue through regular promise error path
                            const statusCode = rejection.status;
                            const $http = $injector.get('$http');
                            // Check if XSRF token is invalid
                            if (statusCode === CSRFINVALIDRESPONSECODE && rejection.headers(CSRFTOKENHEADER)) {
                                // Get new token from response body
                                const newToken = rejection.headers(CSRFTOKENHEADER);
                                if (newToken) {
                                    currentToken = newToken;
                                    return $http(rejection.config);
                                }
                            }

                            // $q.reject creates a promise that is resolved as rejectedwith the specified reason.
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);

            // retry failed http call
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                '$log',
                'retryService',
                function($q, $injector, $log, retryService) {
                    function retryRequest(rejection) {
                        const $timeout = $injector.get('$timeout');
                        const rejectionConfig = rejection.config;

                        if (retryService.isExponentialBackOffEnabled) {
                            if (!rejectionConfig.exponentialBackOff) {
                                rejectionConfig.exponentialBackOff = retryService.exponentialBackOff();
                            }
                            const {
                                exponentialBackOff
                            } = rejectionConfig;
                            const delay = exponentialBackOff.StartNewAttempt();
                            $log.debug(
                                ` exponential back off -- GetAttemptCount ${exponentialBackOff.GetAttemptCount()}`
                            );
                            if (exponentialBackOff.GetAttemptCount() < HTTPRETRYMAXTIMES) {
                                $log.debug(` exponential back off -- delay ${delay}`);
                                return $timeout(function() {
                                    const $http = $injector.get('$http');
                                    return $http(rejectionConfig);
                                }, delay);
                            }
                            exponentialBackOff.Reset();
                            return $q.reject(rejection);
                        }
                        if (!rejectionConfig.incrementalTimeout) {
                            rejectionConfig.incrementalTimeout = HTTPRETRYBASETIMEOUT;
                        }
                        $log.debug(`---- rejection.config.url ------${rejectionConfig.url}`);
                        $log.debug(`---- incrementalTimeout ------${rejectionConfig.incrementalTimeout}`);
                        if (rejectionConfig.incrementalTimeout <= HTTPRETRYMAXTIMEOUT) {
                            $log.debug('---- retry ------');
                            return $timeout(function() {
                                rejectionConfig.incrementalTimeout *= 2;
                                const $http = $injector.get('$http');
                                return $http(rejectionConfig);
                            }, rejectionConfig.incrementalTimeout);
                        }
                        rejectionConfig.incrementalTimeout = HTTPRETRYBASETIMEOUT;
                        $log.debug('---- failure promise ------');
                        return $q.reject(rejection);
                    }
                    return {
                        response(response) {
                            const {
                                config
                            } = response;
                            if (config.retryable && config.exponentialBackOff) {
                                $log.debug(' exponential back off -- response success ');
                                const retryAttemptCount = config.exponentialBackOff.GetAttemptCount();
                                $log.debug(
                                    ` exponential back off -- response success -- retryAttemptCount${retryAttemptCount}`
                                );
                                if (retryAttemptCount > 0) {
                                    config.exponentialBackOff.Reset();
                                }
                            }
                            return response;
                        },

                        responseError(rejection) {
                            const statusCode = rejection.status;

                            if (
                                statusCode !== CSRFINVALIDRESPONSECODE &&
                                angular.isDefined(rejection.config) &&
                                rejection.config.retryable
                            ) {
                                return retryRequest(rejection);
                            }

                            // $q.reject creates a promise that is resolved as rejectedwith the specified reason.
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);

            // Use roblox.Endpoints to resolve absolute URLs - note, this code is duplicated in toolboxApp.js
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                function($q, $injector) {
                    return {
                        request(config) {
                            if (angular.isDefined(Endpoints)) {
                                const absoluteUrl = Endpoints.generateAbsoluteUrl(
                                    config.url,
                                    config.data,
                                    config.withCredentials
                                );
                                config.url = absoluteUrl;
                                if (
                                    Endpoints.addCrossDomainOptionsToAllRequests &&
                                    config.url.indexOf('rbxcdn.com') < 0 &&
                                    config.url.indexOf('s3.amazonaws.com') < 0
                                ) {
                                    config.withCredentials = true;
                                }
                            }
                            return config;
                        }
                    };
                }
            ]);

            // add roblox tracer for http workflow
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                $q => {
                    const componentName = 'angularjs';
                    return {
                        request(config) {
                            const requestConfig = config;
                            const {
                                method,
                                url,
                                headers
                            } = requestConfig;
                            if (isTracerEnabled && apiSiteRequestValidator.isApiSiteAvailableForTracing(url)) {
                                const fields = {
                                    tags: {
                                        isDuplicate: config.isDuplicate ? .toString() || 'false'
                                    }
                                };

                                const requestSpan = instrumentation.createAndGetSpan(
                                    tracerConstants.operationNames.httpRequest,
                                    fields
                                );
                                tags.setXHRRequestTags(requestSpan, {
                                    component: componentName,
                                    method,
                                    url
                                });
                                logs.setXHRRequestLogs(requestSpan);
                                const headerCarriers = inject.httpRequestCarrier(requestSpan);
                                Object.keys(headerCarriers).forEach(key => {
                                    headers[key] = headerCarriers[key];
                                });
                                requestConfig.tracerConfig = {
                                    headerCarriers,
                                    requestSpan
                                };
                            }

                            return requestConfig;
                        },
                        response(response) {
                            const {
                                status,
                                config: {
                                    url,
                                    tracerConfig
                                }
                            } = response;
                            if (tracerConfig && apiSiteRequestValidator.isApiSiteAvailableForTracing(url)) {
                                const {
                                    requestSpan
                                } = tracerConfig;
                                tags.setXHRResponseTags(requestSpan, {
                                    status
                                });
                                logs.setXHRResponseSuccessLogs(requestSpan);
                                instrumentation.finalizeSpan(requestSpan);
                            }
                            return response;
                        },

                        responseError(rejection) {
                            const {
                                status,
                                config: {
                                    url,
                                    tracerConfig
                                }
                            } = rejection;

                            if (tracerConfig && apiSiteRequestValidator.isApiSiteAvailableForTracing(url)) {
                                const {
                                    requestSpan
                                } = tracerConfig;
                                tags.setXHRResponseErrorTags(requestSpan, {
                                    status
                                });
                                logs.setXHRResponseErrorLogs(requestSpan);
                                instrumentation.finalizeSpan(requestSpan);
                            }

                            // $q.reject creates a promise that is resolved as rejectedwith the specified reason.
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);

            // Request Duplication
            $httpProvider.interceptors.push([
                '$injector',
                '$log',
                ($injector, $log) => {
                    return {
                        request(config) {
                            const {
                                url,
                                isDuplicate
                            } = config;
                            const shouldDuplicate = requestDuplication.shouldDuplicate(url, isDuplicate);

                            if (shouldDuplicate) {
                                const duplicateConfig = { ...config
                                };
                                duplicateConfig.isDuplicate = true;

                                const duplicationCount = requestDuplication.getDuplicationCount();
                                const $http = $injector.get('$http');

                                for (let i = 0; i < duplicationCount; i++) {
                                    $http(duplicateConfig).catch(e => {
                                        // log error from duplicated request, then swallow it
                                        $log.log(`~~~ duplicated request failed ~~~ ${e}`);
                                    });
                                }
                            }

                            return config;
                        }
                    };
                }
            ]);

            // Attach bound auth token into request header
            $httpProvider.interceptors.push([
                '$q',
                '$injector',
                function($q, $injector) {
                    return {
                        request(config) {
                            if (shouldRequestWithBoundAuthToken(config.url)) {
                                return buildConfigBoundAuthToken(config).then(configWithBat => {
                                    return configWithBat;
                                });
                            } else {
                                return config;
                            }
                        }
                    };
                }
            ]);
        }
    ])
    .config([
        '$logProvider',
        function($logProvider) {
            const debugEnabled = angular.isDefined(jsConsoleEnabled) ? jsConsoleEnabled : false;
            $logProvider.debugEnabled(debugEnabled);
        }
    ])
    .constant('_', window._ || {}); // so we can inject underscore to our components

export default angularJsUtilities;