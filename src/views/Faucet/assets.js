import axios from "axios";

export function tokenList(data){
    return new Promise((resolve,reject)=>{
        // axios.post("https://faucet.devnet.openverse.network/airdrop/getAirdrop",data,{
        axios.post("https://faucet.devnet.openverse.network/airdrop/getAirdrop",data,{
        // axios.post("https://198.18.0.1:8080/api/transfer",data,{
        // axios.post("/airdrop/getAirdrop",data,{
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