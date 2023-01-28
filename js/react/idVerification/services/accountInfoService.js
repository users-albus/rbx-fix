import {
    httpService
} from 'core-utilities';
import {
    getAccountInfoMetadataUrlConfig
} from '../constants/urlConstants';

// eslint-disable-next-line import/prefer-default-export
export const isIDVerificationEnabled = () => {
    const urlConfig = getAccountInfoMetadataUrlConfig();
    return httpService.get(urlConfig).then(
        ({
            data
        }) => {
            return data ? .isIDVerificationEnabled;
        },
        () => {
            return false;
        }
    );
};