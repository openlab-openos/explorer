<template>
  <table
    class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small"
  >
    <tbody>
      <tr>
        <th>
          {{ $t("transactions.signature") }}
        </th>
        <th>
          {{ $t("navigation.blocks") }}
        </th>
        <th>
          {{ $t("transactions.time") }}
        </th>
        <th>
          {{ $t("transaction.fee_payer") }}
        </th>
        <th>
          {{ $t("account.age") }}
        </th>
        <th>
          BTG
        </th>
      </tr>
      <template v-if="loading && type">
        <tr v-for="(item, index) in paginatedHistoryData" :key="index">
          <td class="text-theme">
            
          </td>
          <td class="text-theme">

          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
          <td>

          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <div v-if="historyData.length == 0 && loading" class="text-center">
    {{ $t("account.available") }}
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';

import LoadingVue from '../../../../components/block/loading.vue';

const loading = ref(true);

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  paramsId: {
    type: String,
    default: "",
  },
});

const historyData = ref([]);

const currentPage = ref(1);
const pageSize = ref(20);

const paginatedHistoryData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return historyData.value.slice(start, end);
});
</script>

<style scoped>

</style>
