function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
  return !(hostname.startsWith('devnet.') || hostname.startsWith('test-devnet.'))
}
console.log(isProductionDomain());
const ArchiveType = sessionStorage.getItem('ArchiveType');
console.log(ArchiveType);
console.log();

const ArchiveUrl = ArchiveType == 'Archive3' ? 'https://archive2.openverse.network/' : (!ArchiveType ? 'https://rpc.openverse.network/' : (ArchiveType == 'Betanet Archive 1' ? 'https://rpc.openverse.network/' : 'https://api.mainnet.openverse.network/'));
// const ArchiveUrl = ArchiveType == 'Archive3' ? 'https://archive2.openverse.network/': 'https://api.mainnet.openverse.network/';

console.log(ArchiveUrl);
// ( ArchiveType == 'Betanet Archive 1' ? 'https://rpc.openverse.network/' : 'https://api.mainnet.openverse.network/')
const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://api.devnet.openverse.network";
// const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://rpc.openverse.network/";


export default solanaApiUrl;