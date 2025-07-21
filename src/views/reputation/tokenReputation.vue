<template>
    <div class="box">
        <div style="display: flex;justify-content: center;">
            <h2>{{ $t('reputation.title') }}</h2>
        </div>
        <div class="center">
            {{ $t('reputation.center') }}
        </div>
        <div class="Reputation">
            <div class="ReputationItem" v-for="item, index in array" :key="index">
                <div class="displayJustifyCenter">
                    <img :src="item.img" alt="" width="50">
                </div>
                <div class="alignCenter marginTop20">
                    <h5>{{ $t(item.text) }}</h5>
                </div>
                <div class="alignCenter marginTop20">
                    {{ $t(item.center) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/i18n';
import { watchEffect, ref } from 'vue';
import { useAppStore } from '@/stores/index';
import Official from "@/assets/icon/Official.png"
import StableCoin from "@/assets/icon/StableCoin.png"
import VRC10 from "@/assets/icon/VRC10.png"
import VRC11 from "@/assets/icon/VRC11.png"
import VRC12 from "@/assets/icon/VRC12.png"
import Verified from "@/assets/icon/Verified.png"
function selectLanguage(indexValue) {
    i18n.global.locale = indexValue;
}
const appStore = useAppStore();
watchEffect(() => {
    selectLanguage(appStore.$state.language);
})
const array = ref([
    {
        "text": 'reputation.offical',
        "img": Official,
        "center": "reputation.officalCenter"
    },
    {
        "text": 'reputation.Verified',
        "img": Verified,
        "center": "reputation.VerifiedCenter"
    },
    {
        "text": 'reputation.StableCoin',
        "img": StableCoin,
        "center": "reputation.StableCoinCenter"
    },
    {
        "text": 'reputation.VRC10',
        "img": VRC10,
        "center": "reputation.VRC10Center"
    },
    {
        "text": 'reputation.VRC11',
        "img": VRC11,
        "center": "reputation.VRC11Center"
    },
    {
        "text": 'reputation.VRC12',
        "img": VRC12,
        "center": "reputation.VRC12Center"
    },
])
</script>

<style scoped>
.box {
    width: 90%;
    margin: auto;
}

.center {
    margin-top: 30px;
    text-align: center;
}

.Reputation {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.ReputationItem {
    width: 30rem;
    border-radius: 10px;
    /* background-color: #28303B; */
    background-color: rgba(255, 255, 255, 0.05);
    margin: 18px;
    padding: 30px 26px 36px;
    box-shadow:28px  28px 30px rgba(0, 0, 0, 0.25);
}

.displayJustifyCenter {
    display: flex;
    justify-content: center;
}

.alignCenter {
    text-align: center;
}
.marginTop20{
    margin-top: 20px;
}
</style>