import axios from "axios";

const solanaApiUrl = "https://api.mainnet.openverse.network";
// const solanaApiUrl = chainData ? chainData : "https://api.mainnet.openverse.network";
export function chainRequest(requestBody) {
  return new Promise((resolve, reject) => {
    axios
      .post(solanaApiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((jsonResponse) => {
        resolve(jsonResponse.data);
      })
      .catch((error) => {
        reject(error);
        console.error("Error fetching data:", error);
      });
  })
}
