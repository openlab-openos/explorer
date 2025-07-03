import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

const chainStorg = JSON.parse(sessionStorage.getItem("app"));
const chainData = chainStorg ? chainStorg.chain : '';
function isProductionDomain() {
    const hostname = window.location.hostname;
    // 检测是否包含 'devnet.' 前缀
  return !hostname.startsWith('devnet.');
}
console.log(isProductionDomain());

const solanaApiUrl = isProductionDomain() ? "https://api.mainnet.openverse.network" : "https://api.devnet.openverse.network";


export async function parseNFTMetadata(adress) {
    const connection = new Connection(solanaApiUrl, "confirmed");
    const metadataAccount = new PublicKey(adress);

    // 1. 获取账户数据
    const accountInfo = await connection.getAccountInfo(metadataAccount);
    if (!accountInfo) throw new Error('账户不存在');
    // console.log(accountInfo);

    // 2. 直接使用 Uint8Array 数据，无需 Base58 解码
    const data = accountInfo.data;

    // 3. 验证数据长度是否符合预期
    if (data.length < 300) {
        console.warn(`数据长度异常：${data.length} 字节，可能不是有效的 NFT 元数据`);
    }

    // 4. 手动解析元数据结构
    const metadata = {
        // 版本（第 0 字节）
        version: data[0],

        // Mint 地址（第 2-33 字节，共 32 字节）
        mint: new PublicKey(data.slice(2, 34)).toBase58(),

        // 更新权限地址（第 34-65 字节，共 32 字节）
        updateAuthority: new PublicKey(data.slice(34, 66)).toBase58(),

        // 提取名称字段
        name: extractString(data, 70),

        // 提取符号字段
        symbol: extractString(data, 70 + 2 + Buffer.byteLength(extractString(data, 70))),

        // 提取 URI 字段
        uri: extractString(data, 70 + 2 + Buffer.byteLength(extractString(data, 70)) + 2 + Buffer.byteLength(extractString(data, 70 + 2 + Buffer.byteLength(extractString(data, 70))))),

        // 提取版税百分比
        sellerFeeBasisPoints: (data[146] << 8) | data[145], // 小端序 u16
    };

    // console.log('解析结果:', metadata);
    return metadata;
}

// 辅助函数：从字节数组中提取 UTF-8 字符串
function extractString(data, offset) {
    // 前 2 字节是字符串长度（小端序 u16）
    const length = (data[offset + 1] << 8) | data[offset];

    // 验证长度是否合理
    if (offset + 2 + length > data.length) {
        console.warn(`字符串长度超出数据范围：偏移=${offset}，长度=${length}，数据总长=${data.length}`);
        return '';
    }

    return Buffer.from(data.slice(offset + 2, offset + 2 + length)).toString('utf8');
}