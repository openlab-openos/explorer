import axios from "axios";

export function tokenList(data){
    return new Promise((resolve,reject)=>{
        axios.get("https://open.openverse.live/api/token/web",data,{
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