import { LOADER_IDS, PROGRAM_INFO_BY_ID, SPECIAL_IDS, SYSVAR_IDS, TOKEN_IDS ,Authentications} from "../../program";

export const titleUrl = (url) => {
    let auth = false;
    if (LOADER_IDS[url]) {
        return {
            url: LOADER_IDS[url],
            type: auth,
            find:true
        };
    }
    if (PROGRAM_INFO_BY_ID[url]) {
        return {
            url: PROGRAM_INFO_BY_ID[url].name,
            type: auth,
            find:true
        };
    }
    if (SPECIAL_IDS[url]) {
        return {
            url: SPECIAL_IDS[url],
            type: auth,
            find:true
        };
    }
    if (SYSVAR_IDS[url]) {
        return {
            url: SYSVAR_IDS[url],
            type: auth,
            find:true
        };
    }
    if (TOKEN_IDS[url]) {
        return {
            url: TOKEN_IDS[url],
            type: auth,
            find:true
        };
    }

    if (Authentications[url]) {
        return {
            url: Authentications[url].address,
            type: true,
            find:true,
            certificates:Authentications[url].certificates,
            img:Authentications[url].img,
            symbol:Authentications[url].symbol
        };
    }
    return {
        url: url,
        type: auth,
        find:false
    };

};
