import axios from 'axios';

function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
    return !hostname.startsWith('test.');
}
const UtlDevnetType = isProductionDomain();
// console.log('UtlDevnetType',UtlDevnetType);

export function tokenList(data) {
    return new Promise((resolve, reject) => {
        // axios.get(UtlDevnetType ? `https://open.openverse.live/api/token/hot` : `https://test-open.openverse.live/api/token/hot`, data, {
        axios.get(`https://test-open.openverse.live/api/tokens?site=openverse `, {
            // axios.get(`https://open.openverse.live/api/token/some?net=${urlType ? 'mainnet' : 'devnet'}`,data,{
            // axios.get("https://open.openverse.live/api/token/web",data,{
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            console.log(res);
            console.log(res.data.data);
            // return res.data.data;
            resolve(res.data.data);

        }).catch(err => {
            reject(err);
        })
    })
}