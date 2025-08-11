import {watch} from 'vue'
function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
return !hostname.startsWith('devnet.');
}
// console.log(isProductionDomain());
const ArchiveType = sessionStorage.getItem('ArchiveType');
console.log(ArchiveType);
const ArchiveUrl = ArchiveType == 'Archive2' ? 'https://archive2.openverse.network/': 'https://archive1.openverse.network/';


const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://api.devnet.openverse.network";
console.log(solanaApiUrl);


export default solanaApiUrl;