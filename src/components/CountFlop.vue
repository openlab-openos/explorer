<template>
  <div class="content">
    <div class="count_item" v-for="(item, index) in countRender" :key="index">
      <div class="icon" v-if="isNaN(Number(item))">{{ item }}</div>

      <div v-else class="digital_wrap">
        <div :style="{
          transition: 'transform 2s',
          transform: `translateY(-${item * 10}%)`,
        }">
          <div v-for="(items, index) in currentValRef.split('')" :key="index" class="digital">
            {{ items }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  count: {
    type: String,
    default: "00000000",
  },
  initialValue: {
    type: String,
    default: "0123456789",
  },
  transitionTime: {
    type: String,
    default: "2s",
  },
});

const countRender = computed(() => {
  let number = JSON.parse(props.count).toFixed(0);
  return number.replace(/(?!^)(?=(\d{3})+$)/g, ",");
});
const currentValRef = ref(props.initialValue);
</script>


<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-size:0.9rem;
}

.icon {
  color: #fff;
  height: 30px;
  flex-direction: column;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 5px;
}

.digital_wrap {
  height: 30px;
  overflow: hidden;
}

.digital {
  width: 100%;
  color: #fff;
  height: 100%;
  line-height: 30px;
}
</style>