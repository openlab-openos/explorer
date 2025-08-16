<template>
    <div class="container"> 
        1
    </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch,
} from 'vue';

import LoadingVue from '../../../../components/block/loading.vue';

const loading = ref(true);

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  paramsId: {
    type: String,
    default: '',
  },
});
</script>

<style scoped></style>
