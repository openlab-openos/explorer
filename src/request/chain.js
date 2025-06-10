import axios from 'axios';

const currentUrl = window.location.href;

let urlType = currentUrl.includes('?cluster=devnet')
const chainStorg = JSON.parse(sessionStorage.getItem("app"))
const GeturlType = JSON.parse(sessionStorage.getItem("urlType"));
// const urlTypeData = urlType ? 'Test' : (GeturlType ? GeturlType.urlType : (urlType ?  'Test' :  'Formal'));
// const urlTypeData = GeturlType ? GeturlType.urlType : (urlType ?  'Test' :  'Formal');
const urlTypeData = GeturlType ? GeturlType.urlType : (urlType ?  'Test' :  'Formal');

console.log(urlTypeData);
console.log(chainStorg);

if (urlTypeData === 'Test') {
  if (chainStorg) {
    chainStorg.chain = ('https://api.devnet.openverse.network');
    chainStorg.chainType = ('Test')
  }
  sessionStorage.setItem("urlType", JSON.stringify({
    urlType: 'Test',
    url: 'https://api.devnet.openverse.network'
  }));

} else {
  if (chainStorg) {
    chainStorg.chain = ('https://api.mainnet.openverse.network');
    chainStorg.chainType = ('Formal')
  }
  sessionStorage.setItem("urlType", JSON.stringify({
    urlType: 'Formal',
    url: 'https://api.mainnet.openverse.network'
  }));
}
sessionStorage.setItem("app", JSON.stringify(chainStorg));
const chainData = chainStorg ? chainStorg.chain : '';

const solanaApiUrl = urlTypeData === 'Test' ? "https://api.devnet.openverse.network" : (chainData ? chainData : "https://api.mainnet.openverse.network");
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
