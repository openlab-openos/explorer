<template>
    <div>
        <img v-if="titleUrl(paramsId).type && propsType" :src="titleUrl(paramsId).img" height="20"
            class="marginRight10">
        <text v-if="propsType" style="cursor: pointer" @click="pubbtx(paramsId)" class="marginRight10">{{
            titleUrl(paramsId).url ? titleUrl(paramsId).url : 'N/A' }}</text>
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
</script>