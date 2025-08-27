import {
  ref,
  watchEffect,
} from 'vue';

// 在组件 setup 函数中
const getStakingVault = async () => {
    const filters = [
        {
            memcmp: {
                offset: 8,
                bytes: addr,
            },
        },
    ];
    
    if (!program) return []; // 检查 program 是否存在
    
    try {
        const accountData = await program.account.stakingVault.all(filters);
        return accountData.map(v => ({
            user: v.account.user.toBase58(),
            btgAmount: v.account.btgAmount.toString(),
            mint: v.account.mint.toBase58(),
            tokenPrice: +divide(1, v.account.tokenPrice, 6),
            btgPrice: v.account.btgPrice,
            outputRate: +times(v.account.outputRate, 100),
            outputTokenAmount: v.account.outputTokenAmount.toString(),
            time: v.account.time.toString(),
            stakingVault: v.publicKey.toBase58()
        }));
    } catch (error) {
        console.error('获取 stakingVault 数据失败:', error);
        return [];
    }
};

// 如果需要响应式监听 program 和 addr 变化并自动更新数据
const stakingVaults = ref([]);

watchEffect(async () => {
    if (program && addr) {
        stakingVaults.value = await getStakingVault();
    }
});

// 在组件中导出需要使用的数据和方法
return {
    stakingVaults,
    getStakingVault
};
