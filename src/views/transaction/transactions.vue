<template>
  <div style="width: 100%">
    <orderVue :boolean="false" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const orderVue = defineAsyncComponent(() =>
  import("../../components/dashboard/order.vue")
);
</script>
