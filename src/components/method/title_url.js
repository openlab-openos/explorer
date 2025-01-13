import { LOADER_IDS, PROGRAM_INFO_BY_ID, SPECIAL_IDS, SYSVAR_IDS, TOKEN_IDS,Authentication } from "../../program";

export const titleUrl = (url) => {
    let auth = false;
    if (LOADER_IDS[url]) {
        return {
            url: LOADER_IDS[url],
            type: auth
        };
    }
    if (PROGRAM_INFO_BY_ID[url]) {
        return {
            url: PROGRAM_INFO_BY_ID[url].name,
            type: auth
        };
    }
    if (SPECIAL_IDS[url]) {
        return {
            url: SPECIAL_IDS[url],
            type: auth
        };
    }
    if (SYSVAR_IDS[url]) {
        return {
            url: SYSVAR_IDS[url],
            type: auth
        };
    }
    if (TOKEN_IDS[url]) {
        return {
            url: TOKEN_IDS[url],
            type: auth
        };
    }
    if (Authentication[url]) {
        return {
            url: url,
            type: Authentication[url].authentication
        };
    }
    return {
        url: url,
        type: auth
    };

};
