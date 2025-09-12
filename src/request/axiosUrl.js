function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
return !(hostname.startsWith('devnet.') || hostname.startsWith('test-devnet.'))
}
// console.log(isProductionDomain());
const ArchiveType = sessionStorage.getItem('ArchiveType');
console.log(ArchiveType);
const ArchiveUrl = ArchiveType == 'Archive2' ? 'https://api.mainnet.openverse.network/': 'https://api.mainnet.openverse.network/';


const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://api.devnet.openverse.network";
console.log(solanaApiUrl);


export default solanaApiUrl;