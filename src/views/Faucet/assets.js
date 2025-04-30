import axios from "axios";

export function tokenList(data){
    return new Promise((resolve,reject)=>{
        axios.post("http://109.123.230.163:8099/airdrop/getAirdrop",data,{
        // axios.post("/airdrop/getAirdrop",data,{

            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>{
            console.log(res);
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
    })
}