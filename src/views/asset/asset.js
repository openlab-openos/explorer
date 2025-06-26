import axios from 'axios';

const currentUrl = window.location.href;
let app = JSON.parse(sessionStorage.getItem('app'));

const GeturlType = JSON.parse(sessionStorage.getItem('urlType'));
let url = currentUrl.includes('?cluster=devnet')
console.log(url);
let urlType = app ? (GeturlType? (GeturlType.urlType == 'Test' ? false : (app.chainType == 'Test' ? false : true)) : true ) : (url? false : true) ;

export function tokenList(data){
    return new Promise((resolve,reject)=>{
        axios.get(`https://open.openverse.live/api/token/hot`,data,{
        // axios.get(`https://open.openverse.live/api/token/some?net=${urlType ? 'mainnet' : 'devnet'}`,data,{
        // axios.get("https://open.openverse.live/api/token/web",data,{
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>{
            
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
    })
}