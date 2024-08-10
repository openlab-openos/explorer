<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" v-if="data != undefined" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">BTG Supply</span>
          <card-expand-toggler />
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div
            style="
              width: 50%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            "
          >
            <h5 style="display: flex; height: 30px">
              <numberAnimar :count="JSON.parse(data)" />
              <div style="white-space: nowrap; line-height: 30px; height: 30px">
                &nbsp;BTG
              </div>
            </h5>
          </div>
          <div style="width: 10%; display: flex; justify-content: center">
            <div style="color: #339a81; font-size: 20px; margin-right: 10%">
              <i class="fas fa-lg fa-fw me-2 fa-exchange-alt"></i>
            </div>
          </div>

          <div style="width: 30%">
            <h5
              style="display: flex; line-height: 30px; width: 50%; height: 30px"
            >
              $
              <numberAnimar :count="data * appStore.rate" />
            </h5>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><i v-bind:class="statInfo.icon"></i> {{ statInfo.text }}</div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import numberAnimar from "../../components/CountFlop.vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import { chainRequest } from "../../request/chain";
import { ustdData } from "../../request/ustd";
import { useAppStore } from "../../stores/index";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const appStore = useAppStore();

const data = ref();

let request = {
  jsonrpc: "2.0",
  id: 1,
  method: "getSupply",
};

const convert = ref(0);

const info = ref([]);
chainRequest(request)
  .then((res) => {
    data.value = JSON.stringify(res.result.value.total).slice(0, 9);
    info.value = [
      {
        icon: "fa fa-chevron-up fa-fw me-1",
        text: "Total 200 million",
      },
      {
        icon: "far fa-hdd fa-fw me-1",
        text: "Mining allocation of total 100 million",
      },
      {
        icon: "far fa-hand-point-up fa-fw me-1",
        text:
          "Supplied output" +
          " " +
          (JSON.parse(data.value) - 100000000) +
          " " +
          "BTG",
      },
    ];
  })
  .catch((err) => {
    console.log(err);
  });
</script>

