import { struct, ns64 } from "@solana/buffer-layout";
import { u64, bool, publicKey } from "@solana/buffer-layout-utils";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";


const lockAccountLayout = struct([
    publicKey("mint"),
    publicKey("owner"),
    u64("amount"),
    u64("serialNumber"),
    ns64("startTime"),
    ns64("endTime"),
    bool("isUnlocked")
]);

export function decodeLockAccount(encodedData) {
    try {
        const buffer = bs58.decode(encodedData);

        // 检查并跳过可能的头部（例如 8 字节 discriminator）
        const dataWithoutHeader = buffer.slice(8); // 根据实际账户结构调整

        const decoded = lockAccountLayout.decode(dataWithoutHeader);

        return {
            mint: new PublicKey(decoded.mint).toBase58(),
            owner: new PublicKey(decoded.owner).toBase58(),
            amount: decoded.amount.toString(),
            serialNumber: decoded.serialNumber.toString(),
            startTime: decoded.startTime.toString(), // 保留为字符串避免精度丢失
            endTime: decoded.endTime.toString(),
            isUnlocked: decoded.isUnlocked
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`反序列化失败: ${error.message}`);
        }
        throw new Error('反序列化失败: Unknown error');
    }
}