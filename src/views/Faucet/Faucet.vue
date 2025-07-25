<template>
    <div v-if="faucetType">
        <div class="margin-center background09" v-loading="loading">
            <div class="tabble-image display-flex justify-content-center align-items-center">
                <img src="../../assets/logo.png" alt="">
            </div>
            <div class="tabbleContainer margin-center borderSolid borderradius">
                <div class="p-7 " style="display: flex;justify-content: space-between;">
                    <div>
                        <h5>{{ $t("Request-Airdrop") }}</h5>
                        <p>{{ $t("Requset-text") }}</p>
                    </div>
                    <div>
                        <el-input v-model="dennetType" style="width: 115px" disabled placeholder="Please input" />
                    </div>
                </div>
                <div class="display-flex justify-content-center p-9 ">

                    <el-input v-model="inputNumber" style="max-width: 600px;height:  2.5rem;" clearable
                        placeholder="Wallet Address" class="input-with-select">
                        <template #append>
                            <el-select v-model="selectAddress" placeholder="Select" style="width: 115px">
                                <el-option label="2tBTG" value="BTG" />
                                <el-option label="2tUSD" value="USD" />
                            </el-select>
                        </template>
                    </el-input>
                </div>
                <!-- <div class="p-8 lineHeight1" :style="{ color: backgroundColor }">
                    {{ $t(buttonText) }}
                </div> -->
                <div class="display-flex justify-content-center p-6 p-4">
                    <el-button type="primary" v-if="disabledType"
                        style="width: 100%;font-weight: 500;font-size: 0.875rem;border: none;color: #5A9CF8;"
                        class="pading-5" @click="handleClick" :disabled="disabledType" plain>
                        {{ $t("ConfirmAirdrop") }}
                    </el-button>
                    <el-button type="primary" v-else
                        style="width: 100%;font-weight: 500;font-size: 0.875rem;border: none;" class="pading-5"
                        @click="handleClick" :disabled="disabledType">
                        {{ $t("ConfirmAirdrop") }}
                    </el-button>
                </div>
            </div>
            <!-- <div class="alerts" v-if="successType"> 提交成功 </div> -->
            <!-- <div class="alertsError" v-if="ErrorType"> {{ errorText }} </div> -->
            <el-dialog v-model="dialogTableVisible" :show-close="false" width="500" :close-on-click-modal="false"
                :close-on-press-escape="false" align-center center
                style="background-color: rgba(00, 11, 11, 0);display: flex;justify-content: center;">
                <div class="spinner-box">
                    <div class="solar-system">
                        <div class="earth-orbit orbit">
                            <div class="planet earth"></div>
                            <div class="venus-orbit orbit">
                                <div class="planet venus"></div>
                                <div class="mercury-orbit orbit">
                                    <div class="planet mercury"></div>
                                    <div class="sun"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog v-model="successType" :show-close="false" width="300" :close-on-click-modal="false"
                :close-on-press-escape="false" align-center center
                style="background-color: rgba(00, 11, 11, 0);display: flex;justify-content: center;">
                <svg viewBox="0 0 400 400">
                    <circle class="circle" fill="none" stroke="#68E534" stroke-width="20" cx="200" cy="200" r="190"
                        stroke-linecap="round" />
                    <polyline class="tick" fill="none" stroke="#68E534" stroke-height="24"
                        points="88,214 173,284 304,138" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </el-dialog>
            <el-dialog v-model="ErrorType" :show-close="false" :width="WidthError" :close-on-click-modal="false"
                :close-on-press-escape="false" align-center center style="background-color: #fff;display: flex;">
                <template #header="{ close, titleId, titleClass }">
                    <div style="display: flex;">
                        <svg viewBox="0 0 400 400">
                            <!-- 圆形背景 -->
                            <circle class="circle" fill="none" stroke="#FF9800" stroke-width="20" cx="200" cy="200"
                                r="190" stroke-linecap="round" />

                            <!-- 感叹号 -->
                            <g class="exclamation" transform="translate(200, 200)">
                                <!-- 感叹号上半部分 -->
                                <rect x="-20" y="-120" width="40" height="160" rx="20" ry="20" fill="#FF9800" />
                                <!-- 感叹号下半部分（点） -->
                                <circle cx="0" cy="100" r="20" fill="#FF9800" />
                            </g>
                        </svg>
                        <!-- <div style="padding: 8px 12px;color: red;" :style="{'line-height':Lingheight}" >
                            {{ buttonText }}
                        </div> -->
                        <div style="display: flex;align-items: center;">
                            <div
                                style="padding: 8px 12px;color: red;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;">
                                {{ buttonText }}
                            </div>
                        </div>

                    </div>
                </template>
                <!-- <div style="display: flex;"> -->

                <!-- </div> -->

            </el-dialog>
            <Vcode :show="dialogVisible" @success="onSuccess" @close="onClose" />
        </div>
    </div>
    <div v-else style="text-align: center;">
        {{ $t("switch") }}
        <!-- 请切换测试网络进行访问 -->
    </div>
</template>

<script setup>
import {
    onMounted,
    ref,
    watch,
    watchEffect,
} from 'vue';

import Vcode from 'vue3-puzzle-vcode';

import i18n from '@/i18n';
import { useAppStore } from '@/stores/index';

import { tokenList } from '../Faucet/assets.js';

const inputNumber = ref('')
const selectAddress = ref('BTG')
const dialogVisible = ref(false)
const disabledType = ref(true)
const loading = ref(false)
const successType = ref(false);
const ErrorType = ref(false);
const faucetType = ref(true);
const urlType = ref(JSON.parse(sessionStorage.getItem('urlType')));
const currentUrl = window.location.href;
const backgroundColor = ref("");
const buttonText = ref('');
const dennetType = ref("Devent");
const dialogTableVisible = ref(true);
const Lingheight = ref();
const WidthError = ref(400);
setTimeout(() => {
    dialogTableVisible.value = false;
    // submitType.value = true
}, 2000)


let clusterType = currentUrl.includes('?cluster=devnet')
const appStore = useAppStore();
onMounted(() => {
    // faucetType.value = urlType.value == 'Test' ? true : (clusterType ? true : false);
    function isProductionDomain() {
        const hostname = window.location.hostname;
        // 检测是否包含 'devnet.' 前缀
        return !hostname.startsWith('devnet.');
    }
    faucetType.value = !isProductionDomain();
})


function selectLanguage(indexValue) {
    i18n.global.locale = indexValue;

}

watchEffect(() => {
    selectLanguage(appStore.$state.language);
})

const handleClick = () => {
    dialogVisible.value = true;
}

const onClose = () => {
    dialogVisible.value = false;
};

const onSuccess = () => {
    disabledType.value = true;
    dialogTableVisible.value = true;
    onClose();
    tokenList({
        "amount": 2,
        "pubKey": inputNumber.value,
        "coinType": selectAddress.value
    }).then((res) => {
        loading.value = false;
        dialogTableVisible.value = false;

        if (res.status = 'success' && res.data.message == 'Airdrop successful.') {
            successType.value = true;
            buttonText.value = "Submitsuccess";
            backgroundColor.value = "#67C23A";
        } else {
            ErrorType.value = true;
            // console.log(res.message);

            if (!res.data.message) {
                backgroundColor.value = "#F56C6C";
                buttonText.value = "Submitfailed";
                Lingheight.value = '50px'
            } else {
                buttonText.value = res.data.message;
                backgroundColor.value = "#F56C6C";
                Lingheight.value = '';
            }
        }
        setTimeout(() => {
            successType.value = false;
            ErrorType.value = false;
            buttonText.value = "";
            selectAddress.value = '';
            inputNumber.value = '';
            backgroundColor.value = "";
        }, 3000);
    }).catch(error => {
        // console.log(error);

        dialogTableVisible.value = false;
        loading.value = false;
        ErrorType.value = true;
        backgroundColor.value = "#F56C6C";
        if (!error.message) {
            buttonText.value = "Submitfailed";
        } else {
            buttonText.value = error.message;
        }
        setTimeout(() => {
            successType.value = false;
            ErrorType.value = false;
            buttonText.value = "";
            selectAddress.value = '';
            inputNumber.value = '';
            backgroundColor.value = "";
        }, 3000);
        console.error('Failed to fetch token list:', error);
    });
};

watch([inputNumber, selectAddress], () => {
    disabledType.value = !(inputNumber.value.length >= 44 && selectAddress.value !== "");
});

</script>

<style scoped>
#app {
    width: 100%;
    height: 97vh;
    overflow: hidden;
}
</style>

<style scoped>
.borderradius {
    border-radius: 0.5rem;
}

.margin-center {
    margin: 0 auto;
}

.display-flex {
    display: flex;
}

.flex-wrap {
    flex-wrap: wrap;
}

.borderSolid {
    border: 1px solid;
}

.justify-content-center {
    justify-content: center;
}

.align-items-center {
    align-items: center;
}

@media (min-width: 1200px) {
    .tabble-container {
        max-width: 32rem;
    }
}

@media (min-width: 1200px) {
    .tabbleContainer {
        max-width: 32rem;
    }
}

@media (max-width: 1200px) {
    .tabbleContainer {
        max-width: 25rem;
    }
}

.marginTop50 {
    margin-top: 50px;
}

/* .tabble-container {} */

.tabble-image {
    padding: 2rem;
}

::v-deep .el-select__wrapper {
    height: 2.5rem;
    /* box-shadow: none !important; */
    /* border: 1px solid #29282C !important; */
}

/* ::v-deep .el-input__wrapper {
    box-shadow: none !important;
    border: 1px solid #29282C !important;
} */

::v-deep .el-loading-mask {
    background-color: rgba(0, 0, 0, 0) !important;
}

::v-deep .el-dialog__header {
    padding: 0 !important;
}

::v-deep #message_2 {
    background-color: #F0F9EB !important;
    color: #67C23A !important;
}

.p-9 {
    padding: 1rem 1.5rem;
}

.p-6 {
    padding: 1.5rem;
}

.p-7 {
    padding: 1.5rem 1.5rem 0 1.5rem;
}

.p-8 {
    padding: 0 1.5rem;
}

.pading-5 {
    padding: 1.25rem 1rem;
}

.p-4 {
    padding-top: 0;
}

.alerts {
    position: absolute;
    top: 1.7rem;
    z-index: 1250;
    width: 100px;
    margin: auto;
    /* padding: 1.2rem !important; */
    background-color: #F0F9EB;
    color: #67C23A;
    width: 20%;
    line-height: 30px;
    text-align: center;
    margin: 0 25%;
    border-radius: 5px;
}

.alertsError {
    position: absolute;
    top: 1.7rem;
    z-index: 1250;
    width: 100px;
    margin: auto;
    /* padding: 1.2rem !important; */
    background-color: #FEF0F0;
    color: #F56C6C;
    width: 20%;
    line-height: 30px;
    text-align: center;
    margin: 0 25%;
    border-radius: 5px;
}

.lineHeight1 {
    line-height: 1rem;
    height: 1rem;
}

/* KEYFRAMES */

@keyframes spin {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(359deg);
    }
}

@keyframes configure-clockwise {
    0% {
        transform: rotate(0);
    }

    25% {
        transform: rotate(90deg);
    }

    50% {
        transform: rotate(180deg);
    }

    75% {
        transform: rotate(270deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes configure-xclockwise {
    0% {
        transform: rotate(45deg);
    }

    25% {
        transform: rotate(-45deg);
    }

    50% {
        transform: rotate(-135deg);
    }

    75% {
        transform: rotate(-225deg);
    }

    100% {
        transform: rotate(-315deg);
    }
}

@keyframes pulse {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: .25;
        transform: scale(.75);
    }
}

/* GRID STYLING */

* {
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    background-color: #37474f;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
}

.spinner-box {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
}

/* SPINNING CIRCLE */

.circle-border {
    width: 150px;
    height: 150px;
    padding: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgb(63, 249, 220);
    background: linear-gradient(0deg, rgba(63, 249, 220, 0.1) 33%, rgba(63, 249, 220, 1) 100%);
    animation: spin .8s linear 0s infinite;
}

.circle-core {
    width: 100%;
    height: 100%;
    background-color: #37474f;
    border-radius: 50%;
}

/* X-ROTATING BOXES */

.configure-border-1 {
    width: 115px;
    height: 115px;
    padding: 3px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffab91;
    animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {
    width: 115px;
    height: 115px;
    padding: 3px;
    left: -115px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(63, 249, 220);
    transform: rotate(45deg);
    animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
    width: 100%;
    height: 100%;
    background-color: #37474f;
}

/* PULSE BUBBLES */

.pulse-container {
    width: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pulse-bubble {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #3ff9dc;
}

.pulse-bubble-1 {
    animation: pulse .4s ease 0s infinite alternate;
}

.pulse-bubble-2 {
    animation: pulse .4s ease .2s infinite alternate;
}

.pulse-bubble-3 {
    animation: pulse .4s ease .4s infinite alternate;
}

/* SOLAR SYSTEM */

.solar-system {
    width: 250px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.orbit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    border-radius: 50%;
}

.earth-orbit {
    width: 165px;
    height: 165px;
    -webkit-animation: spin 12s linear 0s infinite;
}

.venus-orbit {
    width: 120px;
    height: 120px;
    -webkit-animation: spin 7.4s linear 0s infinite;
}

.mercury-orbit {
    width: 90px;
    height: 90px;
    -webkit-animation: spin 3s linear 0s infinite;
}

.planet {
    position: absolute;
    top: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #3ff9dc;
}

.sun {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #ffab91;
}

/* success */
svg {
    width: 60px;
    height: 60px;
}

h2 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 36px;
    margin-top: 20px;
    color: #333;
    opacity: 0;
    animation: 0.6s title ease-in-out;
    animation-delay: 1s;
    animation-fill-mode: forwards;
}

.circle {
    stroke-dasharray: 1194;
    stroke-dashoffset: 1194;
    animation: circle 1s ease-in-out;
    animation-fill-mode: forwards;
}

@keyframes circle {
    from {
        stroke-dashoffset: 1194;
    }

    to {
        stroke-dashoffset: 0;
    }
}

.tick {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.8s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 0.9s;
}

@keyframes tick {
    from {
        stroke-dashoffset: 350;
    }

    to {
        stroke-dashoffset: 0;
    }
}

@keyframes title {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>