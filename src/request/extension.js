import { getMint } from 'open-token-web3';

import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
const currentUrl = window.location.href;
// console.log(currentUrl);

import solanaApiUrl from "./axiosUrl"

// import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const chainStorg = JSON.parse(sessionStorage.getItem("app"))
const chainData = chainStorg ? chainStorg.chain : '';
const connection = new Connection(chainData ? chainData : "https://api.mainnet.openverse.network", "confirmed");
// function isProductionDomain() {
//   const hostname = window.location.hostname;
//   // 检测是否包含 'devnet.' 前缀
// return !hostname.startsWith('devnet.');
// }
// // console.log(isProductionDomain());

// const solanaApiUrl = isProductionDomain() ? "https://api.mainnet.openverse.network" : "https://api.devnet.openverse.network";
export function AccountPublicKey(AccountPublicKey, Program) {

    return (async () => {
        // const connection = new Connection("https://api.mainnet.openverse.network", "confirmed");
        // const connection = new Connection("https://api.mainnet.openverse.network/api", "confirmed");
        const connection = new Connection(solanaApiUrl, "confirmed");

        const mintAccountPublicKey = new PublicKey(
            AccountPublicKey
        );

        const mintProgram = new PublicKey(
            Program
        )

        let mintAccount = await getMint(connection, mintAccountPublicKey, undefined, mintProgram);

        return mintAccount;
    })();
}
export async function getAccountState(accountAddress) {
    try {
        const publicKey = new PublicKey(accountAddress);
        const accountInfo = await connection.getAccountInfo(publicKey);

        if (!accountInfo) {
            return 'uninitialized';
        }

        // 检查账户是否被冻结（对于代币账户）
        try {
            const tokenAccount = await Token.getAccount(connection, publicKey);
            if (tokenAccount.isFrozen) {
                return 'frozen';
            } else {
                return 'initialized';
            }
        } catch (error) {
            // 如果不是代币账户，默认为已初始化的系统账户
            return 'initialized';
        }
    } catch (error) {
        console.error('获取账户状态时出错:', error);
        throw error;
    }
}
// 检查账户是否支持转账
// export async function checkAccountTransferability(accountAddress) {
//     try {
//         const state = await getAccountState(accountAddress);

//         if (state === 'frozen') {
//             // console.log(`账户 ${accountAddress} 被冻结，不支持转账`);
//             return 'frozen';
//         }

//         if (state === 'uninitialized') {
//             // console.log(`账户 ${accountAddress} 未初始化，不支持转账`);
//             return 'uninitialized';
//         }

//         // 检查账户余额是否足够支付手续费
//         const publicKey = new PublicKey(accountAddress);
//         const balance = await connection.getBalance(publicKey);
//         const fee = await getTransactionFee();

//         if (balance < fee) {
//             // console.log(`账户 ${accountAddress} 余额不足，无法支付转账手续费`);
//             return false;
//         }

//         // console.log(`账户 ${accountAddress} 支持转账`);
//         return true;
//     } catch (error) {
//         console.error('检查账户转账能力时出错:', error);
//         return false;
//     }
// }

// 手续上限
// export async function getTokenTransferFeeMax(url) {
//     // try {
//     // USDC 代币地址 (主网)
//     const tokenAddress = new PublicKey(url);

//     // 获取代币的转账手续费配置
//     const transferFeeConfig = getTransferFeeConfig(connection, tokenAddress);
//     // console.log(transferFeeConfig);

//     if (transferFeeConfig) {
//         // console.log(`代币 ${tokenAddress.toBase58()} 的转账手续费上限:`);
//         // console.log(`- 基础手续费: ${transferFeeConfig.feeBasisPoints} 基点`);
//         // console.log(`- 最大手续费: ${transferFeeConfig.maxFee / LAMPORTS_PER_SOL} SOL`);
//         return transferFeeConfig.maxFee;
//     } else {
//         // console.log(`代币 ${tokenAddress.toBase58()} 没有设置转账手续费上限`);
//         return null;
//     }
//     // } catch (error) {
//     //     console.error('获取代币手续费上限时出错:', error);
//     //     throw error;
//     // }
// }

//  获取代币的永久委托人
export async function getTokenPermanentDelegate(tokenAddress, Program) {
    try {
        const publicKey = new PublicKey(tokenAddress);
        const mintProgram = new PublicKey(
            Program
        )
        // 获取代币的铸币信息
        const mintInfo = await getMint(connection, publicKey, undefined, mintProgram);
        if (mintInfo.permanentDelegate) {
            return mintInfo.permanentDelegate.toBase58();
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

// 获取手续费

export async function getAddressTransactionFees(address, limit = 1000) {
  try {
    const publicKey = new PublicKey(address);
    let totalFee = 0;
    let transactionCount = 0;
    
    // 获取该地址的所有签名交易
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit });
    
    
    // 遍历每笔交易，获取并累加手续费
    for (const signature of signatures) {
      const tx = await connection.getTransaction(signature.signature);
      
      if (tx && tx.meta && tx.meta.fee) {
        totalFee += tx.meta.fee;
        transactionCount++;
        
        if (transactionCount % 50 === 0) {
          // console.log(`已处理 ${transactionCount} 笔交易，累计手续费: ${totalFee} 拉普特`);
        }
      }
    }
    return {
      totalFee,
      totalFeeSol: totalFee / LAMPORTS_PER_SOL,
      transactions: transactionCount
    };
  } catch (error) {
    console.error('获取地址手续费时出错:', error);
    throw error;
  }
}