export function ustdData(url) {
    let asioxUrl = "https://www.openverse.network/api/coinprice/getLatest";
    return new Promise((resolve, reject) => {
        fetch(asioxUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let axiosdata = response.json();
                return axiosdata;
            })
            .then((jsonResponse) => {
                resolve(jsonResponse);
            })
            .catch((error) => {
                reject(error);
                console.error("Error fetching data:", error);
            });
    });
}