import {
    httpService
} from 'core-utilities';
import urlConstants from '../constants/urlConstants';

const {
    getEmailStatusUrl,
    getLogoutUrl,
    getSponsoredPageUrl,
    getUnreadPrivateMessagesCountUrl,
    getUserCurrencyUrl,
    getTradeStatusCountUrl,
    getFriendsRequestCountUrl,
    getAuthTokenMetaUrl
} = urlConstants;

export default {
    getUnreadPrivateMessagesCount() {
        const urlConfig = {
            url: getUnreadPrivateMessagesCountUrl(),
            withCredentials: true
        };
        return httpService.get(urlConfig);
    },

    getUserCurrency(userId) {
        const urlConfig = {
            url: getUserCurrencyUrl(userId),
            withCredentials: true
        };
        return httpService.get(urlConfig);
    },

    getTradeStatusCount() {
        const urlConfig = {
            url: getTradeStatusCountUrl(),
            withCredentials: true
        };
        return httpService.get(urlConfig);
    },

    getFriendsRequestCount() {
        const urlConfig = {
            url: getFriendsRequestCountUrl(),
            withCredentials: true
        };
        return httpService.get(urlConfig);
    },

    getEmailStatus() {
        const urlConfig = {
            url: getEmailStatusUrl(),
            withCredentials: true
        };
        return httpService.get(urlConfig);
    },

    getSponsoredPages() {
        const urlConfig = {
            url: getSponsoredPageUrl(),
            withCredentials: true
        };
        return httpService
            .get(urlConfig)
            .then(result => result ? .data)
            .catch(e => {
                console.error(e);
            });
    },
    getAuthTokenMetadata() {
        const urlConfig = {
            url: getAuthTokenMetaUrl(),
            withCredentials: true
        };
        return httpService
            .get(urlConfig)
            .then(result => result ? .data)
            .catch(e => {
                console.error(e);
            });
    },
    logout() {
        const urlConfig = {
            url: getLogoutUrl(),
            withCredentials: true
        };
        return httpService.post(urlConfig);
    }
};