function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
return !(hostname.startsWith('devnet.') || hostname.startsWith('test-devnet.'))
}
// console.log(isProductionDomain());
const ArchiveType = sessionStorage.getItem('ArchiveType');
const ArchiveUrl = ArchiveType == 'Archive3' ? 'https://archive2.openverse.network/': ( ArchiveType == 'RPC' ? 'https://rpc.openverse.network/' : 'https://api.mainnet.openverse.network/');
// const ArchiveUrl = ArchiveType == 'Archive3' ? 'https://archive2.openverse.network/': 'https://api.mainnet.openverse.network/';


const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://api.devnet.openverse.network";


export default solanaApiUrl;