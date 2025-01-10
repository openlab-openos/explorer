<script setup>
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';


// 创建一个新的连接实例，指向主网-beta 或测试网
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed'); // 也可以是 'testnet' 或 'devnet'

async function getUserStakeAccounts(userPublicKey) {
    try {
        // 将用户的公钥转换为 PublicKey 对象
        const userPubKey = new PublicKey(userPublicKey);

        // 查询用户的质押账户
        const stakeAccounts = await connection.getStakeAccounts(userPubKey);

        // 如果需要更详细的信息，可以进一步处理每个质押账户
        const detailedStakeInfo = await Promise.all(
            stakeAccounts.value.map(async (account) => {
                const activationInfo = await connection.getStakeActivation(account.pubkey);
                return {
                    pubkey: account.pubkey.toBase58(),
                    lamports: account.account.lamports,
                    owner: account.account.owner.toBase58(),
                    data: account.account.data,
                    activation: activationInfo
                };
            })
        );

        console.log('User stake accounts:', detailedStakeInfo);
        return detailedStakeInfo;
    } catch (err) {
        console.error('Error fetching user stake accounts:', err);
        throw err;
    }
}

// 示例调用，假设有一个用户的公钥字符串
const userPublicKey = '11111111111111111111111111111111'; // 替换为实际的用户公钥
getUserStakeAccounts(userPublicKey);
</script>