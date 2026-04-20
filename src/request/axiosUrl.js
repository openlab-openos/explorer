function isProductionDomain() {
  const hostname = window.location.hostname;
  // 检测是否包含 'devnet.' 前缀
  return !(hostname.startsWith('devnet.') || hostname.startsWith('test-devnet.'))
}
console.log(isProductionDomain());
const ArchiveType = sessionStorage.getItem('ArchiveType');
console.log(ArchiveType);
console.log();

const ArchiveUrl = ArchiveType == 'Archive3' ? import.meta.env.VITE_ARCHIVE_TWO_API_URL : (!ArchiveType ? import.meta.env.VITE_RPC_API_URL : (ArchiveType == 'Mainnet Archive 1' ? import.meta.env.VITE_RPC_API_URL : import.meta.env.VITE_MAINNET_API_URL));
// const ArchiveUrl = ArchiveType == 'Archive3' ? import.meta.env.VITE_ARCHIVE_TWO_API_URL: import.meta.env.VITE_MAINNET_API_URL;

console.log(ArchiveUrl);
// ( ArchiveType == 'Mainnet Archive 1' ? import.meta.env.VITE_RPC_API_URL : import.meta.env.VITE_MAINNET_API_URL)
const solanaApiUrl = isProductionDomain() ? ArchiveUrl : "https://api.devnet.openverse.network";
// const solanaApiUrl = isProductionDomain() ? ArchiveUrl : import.meta.env.VITE_RPC_API_URL;


export default solanaApiUrl;