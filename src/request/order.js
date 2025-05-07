import axios from "axios";

export function order(url) {
    return new Promise((resolve, reject) => {
        axios
            // .get(url, {
            // .get('/dataapi/' + url, {
            .get('/dataapi/' + url, {
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
                reject(error);
                console.error("Error fetching data:", error);
            });
    })
}