<template>
    
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getData, on } from './event-bus.js';
import { useRouter } from "vue-router"
const router = useRouter();


const detailsData = ref(null);

// 初始获取数据
onMounted(() => {
    detailsData.value = JSON.parse(sessionStorage.getItem('details'))

    console.log(detailsData.value);
    if (!detailsData.value) {
        router.push({
            path: '/'
        })
    }
});

</script>