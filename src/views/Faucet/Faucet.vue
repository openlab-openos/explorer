<template>
    <div v-if="faucetType">
        <div class="margin-center background09" v-loading="loading">
            <div class="tabble-image display-flex justify-content-center align-items-center">
                <img src="../../assets/logo.png" alt="">
            </div>
            <div class="tabbleContainer margin-center borderSolid borderradius">
                <div class="display-flex justify-content-center p-6 ">
                    <el-input v-model="inputNumber" style="max-width: 600px;height:  2.5rem;" clearable
                        placeholder="Wallet Address" class="input-with-select">
                        <!-- <template #append>
                            <el-select v-model="selectAddress" placeholder="Select" style="width: 115px;">
                                <el-option label="0.5" value="1" />
                                <el-option label="1" value="2" />
                                <el-option label="2" value="3" />
                                <el-option label="3" value="4" />
                                <el-option label="4" value="5" />
                            </el-select>
                        </template> -->
                    </el-input>
                </div>
                <div class="display-flex justify-content-center p-6 ">
                    <el-select v-model="selectBTG" placeholder="Select" style="width: 50%;">
                        <el-option label="BTG" value="BTG" />
                        <el-option label="1" value="2" />
                    </el-select>
                    <el-select v-model="selectAddress" placeholder="Select" style="width: 50%;">
                        <el-option label="0.5" value="0.5" />
                        <el-option label="1" value="1" />
                        <el-option label="2" value="2" />
                        <el-option label="3" value="3" />
                        <el-option label="4" value="4" />
                    </el-select>
                </div>
                <div class="display-flex justify-content-center p-6 p-4">
                    <el-button style="width: 100%;opacity: 0.7;font-weight: 500;font-size: 0.875rem;" class="pading-5"
                        @click="handleClick" :disabled="disabledType">
                        Confirm Airdrop<el-icon class="el-icon--right">
                            <Upload />
                        </el-icon>
                    </el-button>
                </div>
            </div>
            <div class="alerts" v-if="successType"> 提交成功 </div>
            <div class="alertsError" v-if="ErrorType"> {{ errorText }} </div>
            <Vcode :show="dialogVisible" @success="onSuccess" @close="onClose" />
        </div>
    </div>
    <div v-else style="text-align: center;">
        {{ $t("switch") }}
        <!-- 请切换测试网络进行访问 -->
    </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import Vcode from "vue3-puzzle-vcode";
import { tokenList } from "../Faucet/assets.js";
import i18n from "@/i18n"
import { useAppStore } from "@/stores/index";

import { ElMessage } from 'element-plus'
const inputNumber = ref('')
const selectBTG = ref('BTG')
const selectAddress = ref('')
const dialogVisible = ref(false)
const disabledType = ref(true)
const loading = ref(false)
const successType = ref(false);
const ErrorType = ref(false);
const errorText = ref('');
const faucetType = ref(true);
const urlType = ref(JSON.parse(sessionStorage.getItem('urlType')));
const currentUrl = window.location.href;

let clusterType = currentUrl.includes('?cluster=devnet')
const appStore = useAppStore();
onMounted(() => {
    faucetType.value = urlType.value == 'Test' ? true : (clusterType ? true : false);
})

function selectLanguage(indexValue) {
    i18n.global.locale = indexValue;
    console.log(indexValue);

}

watchEffect(() => {
    selectLanguage(appStore.$state.language);
})

const handleClick = () => {
    console.log(selectAddress.value);
    return
    dialogVisible.value = true;
}

const onClose = () => {
    dialogVisible.value = false;
};

const onSuccess = () => {
    onClose();
    tokenList({
        "amount": selectAddress.value,
        "pubKey": inputNumber.value
    }).then((res) => {
        console.log(res)
        loading.value = false;
        if (res.success) {
            successType.value = true;
        } else {
            ErrorType.value = true;
            errorText.value = res.msg;
        }
        setTimeout(() => {
            successType.value = false;
            ErrorType.value = false;
        }, 3000);
    }).catch(error => {
        loading.value = false;
        ErrorType.value = true;
        errorText.value = error.msg;
        setTimeout(() => {
            successType.value = false;
            ErrorType.value = false;
        }, 3000);
        console.error('Failed to fetch token list:', error);
    });
};

watch([inputNumber, selectAddress], () => {
    disabledType.value = !inputNumber.value.length >= 44 || !selectAddress.value;
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

.tabble-container {}

.tabble-image {
    padding: 2rem;
}

::v-deep .el-select__wrapper {
    height: 2.5rem;
    box-shadow: none !important;
    border: 1px solid #29282C !important;
}

::v-deep .el-input__wrapper {
    box-shadow: none !important;
    border: 1px solid #29282C !important;
}

::v-deep .el-loading-mask {
    background-color: rgba(0, 0, 0, 0) !important;
}

::v-deep #message_2 {
    background-color: #F0F9EB !important;
    color: #67C23A !important;
}

.p-6 {
    padding: 1.5rem;
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
</style>