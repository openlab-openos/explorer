import axios from "axios";

export function order(url) {
    console.log(url);
    console.log("http://192.168.1.149:9527/transactions" + '/'  + url);
    
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
                console.log(response);
                
                return axiosdata;
            })
            .then((jsonResponse) => {
                console.log(123);
                
                resolve(jsonResponse);
            })
            .catch((error) => {
                console.log(error);
                
                reject(error);
                console.error("Error fetching data:", error);
            });
    })
}