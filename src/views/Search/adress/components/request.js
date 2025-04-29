import axios from 'axios';

export function tokenList(data) {
    console.log(data);
    
    return new Promise((resolve, reject) => {
        axios.get(`https://liveapi.imboss.cloud/api/token/detail?address=${data}`)
           .then(res => {
                console.log(res);
                resolve(res.data);
            })
           .catch(err => {
                reject(err);
            });
    });
}