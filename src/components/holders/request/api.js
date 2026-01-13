import axios from 'axios';

function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
    return !hostname.startsWith('test.')  || hostname.startsWith('test-devnet.');
}
const UtlDevnetType = isProductionDomain();
// console.log('UtlDevnetType',UtlDevnetType);

export function dataObject() {
    return new Promise((resolve, reject) => {
        axios.get(!UtlDevnetType ? `https://open.openverse.live/api/token/distribute` : `https://test-open.openverse.live/api/token/distribute`, {
            // axios.get(UtlDevnetType ? `https://test-open.openverse.live/api/tokens?site=openverse&is_all=1&page=${page}` : `https://test-open.openverse.live/api/tokens?site=openverse&is_all=1`,{
            // axios.get(`https://open.openverse.live/api/token/some?net=${urlType ? 'mainnet' : 'devnet'}`,data,{
            // axios.get("https://open.openverse.live/api/token/web",data,{
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res);

            resolve(res.data.data);
        }).catch(err => {
            reject(err);
        })
    })
}