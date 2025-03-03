import axios from "axios";

console.log(JSON.parse(sessionStorage.getItem("app")));
const chainStorg =  JSON.parse(sessionStorage.getItem("app"))
const chainData =chainStorg ? chainStorg.chain : '';
// const solanaApiUrl = "https://api.mainnet.openverse.network/api"; // 请替换为正确的 URL
// const solanaApiUrl = "https://api.mainnet.openverse.network"; // 请替换为正确的 URL
const solanaApiUrl = chainData ? chainData : "https://api.mainnet.openverse.network";
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
