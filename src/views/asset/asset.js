import axios from 'axios';

function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
    return !hostname.startsWith('test.')  || hostname.startsWith('test-devnet.');
}
const UtlDevnetType = isProductionDomain();
// console.log('UtlDevnetType',UtlDevnetType);

export function tokenList(page,number) {
    return new Promise((resolve, reject) => {
        axios.get(UtlDevnetType ? `https://open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}&page_size=${number}` : `https://test-open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}&page_size=200`, {
        // axios.get(UtlDevnetType ? `https://test-open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}&page_size=200` : `https://open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}&page_size=200`, {
            // axios.get(`https://test-open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}&page_size=200`, {
            // axios.get(`https://open.openverse.live/api/token/some?net=${urlType ? 'mainnet' : 'devnet'}`,data,{
            // axios.get("https://open.openverse.live/api/token/web",data,{
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            // return res.data.data;
            resolve(res.data);

        }).catch(err => {
            reject(err);
        })
    })
}