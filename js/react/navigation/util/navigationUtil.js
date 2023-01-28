import angular from 'angular';
import {
    EventStream,
    RealTime,
    EmailVerificationService
} from 'Roblox';
import {
    urlService
} from 'core-utilities';
import {
    authenticatedUser
} from 'header-scripts';
import {
    cryptoUtil
} from 'core-roblox-utilities';
import navigationService from '../services/navigationService';
import layoutConstants from '../constants/layoutConstants';
import urlConstants from '../constants/urlConstants';
import links from '../constants/linkConstants';

const {
    universalSearchUrls,
    newUniversalSearchUrls,
    avatarSearchLink
} = links;

const {
    getQueryParam,
    parseUrl,
    composeQueryString
} = urlService;
const {
    getSignupRedirUrl,
    getLoginUrl,
    getWebsiteUrl,
    getRootUrl
} = urlConstants;

const {
    unverifiedEmailGracePeriodInDaysBeforeNotification,
    logoutEvent
} = layoutConstants;
const isGuest = !authenticatedUser.isAuthenticated;

const isEmailNotificationEnabled = (userCreatedDate, isEmailVerified) => {
    const now = new Date();
    const created = new Date(userCreatedDate);
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffInDays > unverifiedEmailGracePeriodInDaysBeforeNotification && !isEmailVerified;
};

const getAccountNotificationCount = () => {
    const {
        created
    } = authenticatedUser;
    return navigationService
        .getEmailStatus()
        .then(({
            data: {
                verified: isEmailVerified
            }
        }) => {
            return +isEmailNotificationEnabled(created, isEmailVerified);
        })
        .catch(error => {
            console.debug(error);
        });
};

const getSignupUrl = () => {
    // return from the current page if there is no returnUrl param, except it is from login page.
    let returnUrl = getQueryParam('returnUrl') || window.location.href;
    returnUrl = returnUrl === getLoginUrl() ? '' : returnUrl;
    const signupUrl = getSignupRedirUrl();
    return `${signupUrl}?${composeQueryString({ returnUrl })}`;
};

const getLoginLinkUrl = () => {
    // return from the current page if there is no returnUrl param
    const returnUrl = getQueryParam('returnUrl') || window.location.href;
    const loginUrl = getLoginUrl();
    return `${loginUrl}?${composeQueryString({ returnUrl })}`;
};

const logoutAndRedirect = () => {
    const userId = authenticatedUser.id;
    return navigationService.logout().then(async () => {
        try {
            await cryptoUtil.deleteUserCryptoKeyPairUponLogout(userId.toString());
        } catch (e) {
            console.debug(e);
        }
        window.location.href = getRootUrl();
    });
};

const logoutUser = e => {
    e.stopPropagation();
    e.preventDefault();
    document.dispatchEvent(new CustomEvent(logoutEvent.name));

    if (!angular.isUndefined(angular.element('#chat-container').scope())) {
        const scope = angular.element('#chat-container').scope();
        scope.$digest(scope.$broadcast('Roblox.Chat.destroyChatCookie'));
    }
    EmailVerificationService ? .handleUserEmailUpsellAtLogout(logoutAndRedirect).then(data => {
        // if user is not in test group or has email on file already, logout directly
        if (!data || data.emailAddress) {
            logoutAndRedirect();
        }
    });
};

const sendClickEvent = eventName => {
    if (EventStream) {
        EventStream.SendEventWithTarget(eventName, 'click', {}, EventStream.TargetTypes.WWW);
    }
};

const subscribeToFriendsNotifications = handleFriendsEvent => {
    if (isGuest || !RealTime) {
        return () => {};
    }
    document.addEventListener(layoutConstants.friendEvents.requestCountChanged, handleFriendsEvent);
    const realTimeClient = RealTime.Factory.GetClient();
    realTimeClient.Subscribe(
        layoutConstants.friendEvents.friendshipNotifications,
        handleFriendsEvent
    );
    return () => {
        document.removeEventListener(
            layoutConstants.friendEvents.requestCountChanged,
            handleFriendsEvent
        );
        realTimeClient.Unsubscribe(
            layoutConstants.friendEvents.friendshipNotifications,
            handleFriendsEvent
        );
    };
};

const subscribeToMessagesNotifications = handleMessagesEvent => {
    if (isGuest || !RealTime) {
        return () => {};
    }
    document.addEventListener(layoutConstants.messagesCountChangeEvent, handleMessagesEvent);
    return () => {
        document.removeEventListener(layoutConstants.messagesCountChangeEvent, handleMessagesEvent);
    };
};

const isInMobileSize = () => {
    return window ? .innerWidth < 543 ? false; // breakpoint for mobile size
};

const isLoginLinkAvailable = () => {
    const {
        pathname
    } = window ? .location;
    const currentPath = pathname ? .toLowerCase() ? '';

    return !currentPath.startsWith('/login') && !currentPath.startsWith('/newlogin');
};

const getUniversalSearchLinks = () => {
    const linksCopy = [...universalSearchUrls];
    linksCopy.sort(({
        pageSort
    }) => {
        const isRelevant = pageSort.reduce((r, keyword) => {
            return r || window.location.href.indexOf(keyword) > -1;
        }, false);
        if (isRelevant) {
            return -1;
        }
        return 1;
    });
    return linksCopy;
};

const getNewUniversalSearchLinks = () => {
    const urls = [...newUniversalSearchUrls];
    const relevantUrls = urls.filter(({
            pageSort
        }) =>
        pageSort.some(keyword => window.location.pathname.indexOf(keyword) > -1)
    );
    const unRelevantUrls = urls.filter(({
            pageSort
        }) =>
        pageSort.every(keyword => window.location.pathname.indexOf(keyword) === -1)
    );
    return [...relevantUrls, ...unRelevantUrls];
};

const getAvatarAutocompleteSearchLinks = () => {
    return avatarSearchLink.pageSort.some(keyword => window.location.pathname.indexOf(keyword) > -1);
};

const getThemeClass = () => {
    return (
        document.getElementById('navigation-container') &&
        document.getElementById('navigation-container').className
    );
};

const parseQuery = queryString => {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    pairs.forEach(pair => {
        if (pair.includes('=')) {
            const [key, value] = pair.split('=');
            query[decodeURIComponent(key) ? .toLowerCase()] = decodeURIComponent(value);
        }
    });
    return query;
};

export default {
    getAccountNotificationCount,
    getSignupUrl,
    getLoginLinkUrl,
    logoutUser,
    logoutAndRedirect,
    sendClickEvent,
    subscribeToFriendsNotifications,
    subscribeToMessagesNotifications,
    isInMobileSize,
    isLoginLinkAvailable,
    getUniversalSearchLinks,
    getNewUniversalSearchLinks,
    getAvatarAutocompleteSearchLinks,
    getThemeClass,
    parseQuery
};