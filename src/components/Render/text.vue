<template>
    <div>
        <img v-if="titleUrl(paramsId).type && propsType" :src="titleUrl(paramsId).img" height="20"
            class="marginRight10">
        <text v-if="propsType" style="cursor: pointer" @click="pubbtx(paramsId)" class="marginRight10">
            {{ props.transactionType ?( titleUrl(paramsId).url ? titleUrl(paramsId).url : 'N/A') : (stringcate(paramsId)) }}
        </text>
        <img v-if="titleUrl(paramsId).type && titleUrl(paramsId).assest"
            v-for="(datas, indexs) in titleUrl(paramsId).certificates" :key="indexs" :src="datas.img" height="20"
            class="marginRight8" alt="" @click="pubbley" style="cursor: pointer;">
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { titleUrl } from "../method/title_url"
import { ref } from 'vue'
const props = defineProps({
    address: {
        type: String,
        default: ""
    },
    type: {
        default: true,
        typeof: Boolean
    },
    transactionType: {
        default: true,
        typeof: Boolean
    }
})
const router = useRouter();

const paramsId = ref(props.address)
const propsType = ref(props.type)


const pubbtx = (url) => {
    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }
};

const pubbley = () => {
    router.push({
        name: "TokenReputation",
    })
};

const stringcate = (str) => {
    if (str) {
        if (str.length < 10) {
            return str;
        } else {
            return str.slice(0, 5) + "..." + str.slice(-5);
        }
    } else {
        return 'N/A'
    }
};
</script>