<template>
  <div class="col-lg-6 col-xl-3">
    <!-- BEGIN card -->
    <card class="mb-3" style="height: 160px">
      <card-body>
        <div class="d-flex fw-bold small mb-3">
          <span class="flex-grow-1">Exchange Rate</span>
        </div>
        <div class="row align-items-center mb-2" style="height: 30px">
          <div style="
              width: 60%;
              display: flex;
              justify-content: space-between;
              height: 30px;
            ">
            <h5 style="display: flex; height: 30px; font-size: 0.9rem;line-height: 30px;">
              {{ rate }} USD/BTG
            </h5>
          </div>

          <div style="width: 40%; height: 30px">
            <div>
              <apexchart :height="charts.height" :options="charts.options" :series="charts.series"></apexchart>
            </div>
          </div>
        </div>
        <div class="small text-inverse text-opacity-50 text-truncate">
          <template v-for="statInfo in info">
            <div><font-awesome-icon :icon="statInfo.icon" /> {{ statInfo.text }}</div>
          </template>
        </div>
      </card-body>
    </card>
    <!-- END card -->
  </div>
</template>

<script setup>
import { useAppStore } from "../../stores/index";
import { ref, onMounted, watchEffect } from "vue";
import { useAppVariableStore } from "@/stores/app-variable";
import apexchart from "@/components/plugins/Apexcharts.vue";

const appVariable = useAppVariableStore();


const appStore = useAppStore();
const rate = ref();

const info = ref([]);

const echartsChar = ref(null);

const charts = ref({
  height: 30,
  options: {
    chart: { type: "line", sparkline: { enabled: true } },
    colors: [appVariable.color.theme],
    stroke: {
      width: 2
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        endingShape: "rounded",
      },
    },
    yaxis: {
      min: 1500
    }
  },
  series: [
    {
      name: "Visitors",
      data: [
        1540, 1550, 1560, 1534, 1560, 1555, 1589, 1599, 1593, 1546, 1544
      ],
    },
  ],
});

onMounted(() => {
  watchEffect(() => {
    rate.value = appStore.rate;
    infoRender()
  })
})



const infoRender = () => {
  let time = null;
  time =
    appStore.datarate.updated_at == null
      ? "a day ago"
      : appStore.datarate.updated_at;
  info.value = [
    {
      icon: "fas fa-lg fa-fw me-2 fa-hourglass",
      text: "Updated at" + " " + time,
    },
    {
      icon: "fab fa-lg fa-fw me-2 fa-flickr",
      text: "Reason Words" + " " + appStore.datarate.reason_words,
    },
    { icon: "fas fa-lg fa-fw me-2 fa-money-bill-alt", text: "5 USD When Listing" },
  ];
}

const randomNo = () => {
  return Math.floor(Math.random() * 2) + 3;
};


</script>
