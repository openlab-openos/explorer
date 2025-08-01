import {
    Authentications,
    LOADER_IDS,
    PROGRAM_INFO_BY_ID,
    SPECIAL_IDS,
    SYSVAR_IDS,
    TOKEN_IDS,
} from '../../program';

export const titleUrl = (url) => {
    let auth = false;
    if (LOADER_IDS[url]) {
        return {
            url: LOADER_IDS[url],
            type: auth,
            find: true,
            assest: false
        };
    }
    if (PROGRAM_INFO_BY_ID[url]) {
        return {
            url: PROGRAM_INFO_BY_ID[url].name,
            type: auth,
            find: true,
            assest: false
        };
    }
    if (SPECIAL_IDS[url]) {
        return {
            url: SPECIAL_IDS[url],
            type: auth,
            find: true,
            assest: false
        };
    }
    if (SYSVAR_IDS[url]) {
        return {
            url: SYSVAR_IDS[url],
            type: auth,
            find: true,
            assest: false
        };
    }
    if (TOKEN_IDS[url]) {
        return {
            url: TOKEN_IDS[url],
            type: auth,
            find: true,
            assest: false
        };
    }


    try {
        if (Authentications[url]) {
            return {
                url: Authentications[url].name,
                type: true,
                find: true,
                certificates: Authentications[url].certificates,
                img: Authentications[url].img,
                symbol: Authentications[url].symbol,
                code: Authentications[url].code,
                assest: true,
                backColor: Authentications[url].backColor
            };
        }
    } catch (error) {
        return {
            url: url,
            type: auth,
            find: false
        };
    }
    if (url == 'B67JGY8hbUcNbpMufKJ4dF3egfbZuD4EkyffQ3cxZcUz') {
        return {
            url: 'Wrapped BTG',
            type: true,
            find: true,
            symbol: 'WBTG',
            certificates: [{ 'img': 'https://pic1.imgdb.cn/item/682da89b58cb8da5c80290c2.png' }],
            img: 'https://pic1.imgdb.cn/item/682da8a958cb8da5c8029118.png',
            assest: false,
        };
    }
    return {
        url: url,
        type: auth,
        find: false
    };

};
