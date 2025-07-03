import axios from 'axios';

const currentUrl = window.location.href;
console.log(currentUrl);


// import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
return !hostname.startsWith('devnet.');
}
console.log(isProductionDomain());

const solanaApiUrl = isProductionDomain() ? "https://api.mainnet.openverse.network" : "https://api.devnet.openverse.network";

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
