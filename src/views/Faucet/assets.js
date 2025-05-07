import axios from "axios";

export function tokenList(data){
    return new Promise((resolve,reject)=>{
        axios.post("https://faucet.devnet.openverse.network/airdrop/getAirdrop",data,{
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