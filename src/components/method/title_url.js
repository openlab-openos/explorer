import {LOADER_IDS,PROGRAM_INFO_BY_ID,SPECIAL_IDS,SYSVAR_IDS,TOKEN_IDS} from "../../program";

export const titleUrl = (url) => {
    if(LOADER_IDS[url]){
        return LOADER_IDS[url];
    }
    if(PROGRAM_INFO_BY_ID[url]){
        return PROGRAM_INFO_BY_ID[url].name;
    }
    if(SPECIAL_IDS[url]){
        return SPECIAL_IDS[url];
    }
    if(SYSVAR_IDS[url]){
        return SYSVAR_IDS[url];
    }
    if(TOKEN_IDS[url]){
        return TOKEN_IDS[url];
    }
    return url ;
};
