const solanaApiUrl = "http://84.247.191.232:8899"; // 请替换为正确的 URL

export function chainRequest(requestBody) {
  return new Promise((resolve, reject) => {
    fetch(solanaApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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


