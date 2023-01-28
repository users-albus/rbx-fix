import {
    httpService
} from 'core-utilities';
import {
    setPhoneNumberConfig,
    verifyPhoneNumberConfig,
    resendCodeToPhoneNumberConfig,
    getPhonePrefixesConfig
} from '../../common/constants/urlConstants';
import {
    phoneSubmissionConstants
} from '../constants/phoneConstants';

const {
    fallbackDefaultCountryCode
} = phoneSubmissionConstants;

export const getPhonePrefixes = () => {
    const urlConfig = getPhonePrefixesConfig();
    return httpService.get(urlConfig).then(
        ({
            data
        }) => {
            let defaultPrefix;

            // prefix list may contain indicator of default prefix
            const defaultPrefixByLocation = data.find(element => {
                return element.isDefault === true;
            });

            // If no default prefix is passed in with list of prefixes, fall back to
            // constant value default country code.
            const defaultCountryCodeByLocation =
                defaultPrefixByLocation ? .code ? fallbackDefaultCountryCode;
            // Find default option and put that at the top of the list
            data.filter(p => {
                if (p.code !== defaultCountryCodeByLocation) {
                    return true;
                }
                defaultPrefix = p;
                return false;
            });

            if (defaultPrefix) {
                data.unshift(defaultPrefix);
            }
            return data;
        },
        e => {
            return false;
        }
    );
};

export const setPhoneNumber = ({
    phone,
    prefix,
    countryCode
}) => {
    const urlConfig = setPhoneNumberConfig();
    const formData = {
        countryCode,
        prefix,
        phone
    };
    return httpService.post(urlConfig, formData);
};

export const verifyWithCode = (code = '') => {
    const formData = {
        code
    };
    const urlConfig = verifyPhoneNumberConfig();
    return httpService.post(urlConfig, formData);
};

export const resendCode = formData => {
    const urlConfig = resendCodeToPhoneNumberConfig();
    return httpService.post(urlConfig, formData).then(
        ({
            data
        }) => {
            return true;
        },
        e => {
            return false;
        }
    );
};