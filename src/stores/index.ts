import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        rate: 0,//BTG
        datarate: {},//rate
        pubbley: 0, //Active Stake
        stubly: 0, //BTG Supply
        stuBlys: 0,//StuBly
        btgcount: 0,//btgcount
        Validators: [], //Validators
        Transaction: [], //Transaction
        stake: 0,//stake
        part: 0,//part
        country: {},//country
    }),
    getters: {
        rateData: (state) => {
            return state.rate; // 直接返回 state 中的 rate  
        },
        pubbleyData: (state) => {
            return state.pubbley; // 直接返回 state 中的 pubbley  
        },
        stublyData: (state) => {
            return state.stubly; // 直接返回 state 中的 stubly  
        },
        btgcountData: (state) => {
            return state.btgcount; // 直接返回 state 中的 btgcount  
        },
        stuBlysData: (state) => {
            return state.stuBlys; // 直接返回 state 中的 stuBlys  
        },
        ValidatorsData: (state) => {
            return state.Validators; // 直接返回 state 中的 Validators  
        },
        TransactionData: (state) => {
            return state.Transaction; // 直接返回 state 中的 Transaction  
        },
        getRate: (state) => {
            return state.datarate; // 直接返回 state 中的 datarate  
        },
        getStake: (state) => {
            return state.stake; // 直接返回 state 中的 stake  
        },
        getPart: (state) => {
            return state.part; // 直接返回 state 中的 part  
        },
        getCountry: (state) => {
            return state.country; // 直接返回 state 中的 country  
        },
    },
    actions: {
        setRate(newRate: any) {
            this.rate = JSON.parse(newRate); // 在 actions 中设置 rate 的值  
        },
        setPubbley(newPubbley: any) {
            this.pubbley = JSON.parse(newPubbley); // 在 actions 中设置 pubbley 的值  
        },
        setStubly(newStubly: any) {
            this.stubly = JSON.parse(newStubly); // 在 actions 中设置 stubly 的值  
        },
        setBtgcount(newBtgcount: any) {
            this.btgcount = JSON.parse(newBtgcount); // 在 actions 中设置 btgcount 的值  
        },
        setStuBlys(newStuBlys: any) {
            this.stuBlys = JSON.parse(newStuBlys); // 在 actions 中设置 stuBlys 的值  
        },
        setValidators(newValidators: any) {
            this.Validators = JSON.parse(newValidators); // 在 actions 中设置 Validators 的值  
        },
        setTransaction(newTransaction: any) {
            this.Transaction = JSON.parse(newTransaction); // 在 actions 中设置 Transaction 的值  
        },
        getRateData(data: any) {
            return this.datarate = data; // 直接返回 state 中的 rate  
        },
        getStakeData(data: any) {
            return this.stake = data; // 直接返回 state 中的 stake  
        },
        getPartData(data: any) {
            return this.part = data; // 直接返回 state 中的 part  
        },
        getCountryData(data: any) {
            return this.country = data; // 直接返回 state 中的 country  
        },
    },
    persist: {
        enabled: true,
        storage: sessionStorage,
    }
});