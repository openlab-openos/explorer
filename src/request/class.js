import axios from "axios";

export function order(url) {
    
    
    return new Promise((resolve, reject) => {
        axios
            // .get(url, {
            .get("http://192.168.1.149:9527/transactions" + '/'  + url, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                let axiosdata = response.data;
                
                return axiosdata;
            })
            .then((jsonResponse) => {
                
                resolve(jsonResponse);
            })
            .catch((error) => {
                // console.log(error);
                
                reject(error);
                console.error("Error fetching data:", error);
            });
    })
}