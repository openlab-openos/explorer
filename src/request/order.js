export function order(url) {
    let asioxUrl = "http://198.177.124.16:9527/" + url;
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
                return response.json();
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