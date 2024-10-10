<script setup>
import { useAppVariableStore } from "@/stores/app-variable";
import { onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import apexchart from "@/components/plugins/Apexcharts.vue";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world.js";
import "jsvectormap/dist/css/jsvectormap.min.css";
import { chainRequest } from "../../request/chain";
import CountUp from "vue-countup-v3";
import { useRouter } from "vue-router";
import { order } from "../../request/order";
import moment from "moment";
import { ustdData } from "../../request/ustd";
import { defineAsyncComponent, getCurrentInstance } from "vue";
// import blockHeightVue from "../../components/block/blockHeight.vue";
// import netWorkVue from "../../components/block/netWork.vue";
// import activeAccountVue from "../../components/block/activeAccount.vue";
// import transferVue from "../../components/block/transfer.vue";
// import supplyVue from "../../components/block/supply.vue";
// import activeVue from "../../components/block/active.vue";
// import priceVue from "../../components/block/price.vue";
// import priceBtgVue from "../../components/block/priceBtg.vue";
import { useAppStore } from "@/stores/index";
import { ipAddresses } from "./address";

const appStore = useAppStore();
const appVariable = useAppVariableStore();

const apps = getCurrentInstance();

const promaster = ref(apps?.proxy?.$progream);

const slot = ref(1);
const inepoch = ref(1);
const epoch = ref();
const solttime = ref();
const traffic = ref([]);

const pubbley = ref(1);
const stubly = ref(1);
const country = ref();
const source = ref();
const series = ref();
const countLog = ref();
const ActivityLogData = ref([]);
const orderData = ref([]);
const server = ref([]);
const mapContainer = ref();
const pageType = ref(true);

const map = ref(null);
const activeVueref = ref(null);
const networkref = ref(null);

const router = useRouter();

const timeFormatter = (time) => {
  return moment(time).fromNow();
};

const BlockHeightVue = defineAsyncComponent(() =>
  import("../../components/block/blockHeight.vue")
);
const NetWorkVue = defineAsyncComponent(() =>
  import("../../components/block/netWork.vue")
);
const ActiveAccountVue = defineAsyncComponent(() =>
  import("../../components/block/activeAccount.vue")
);
const TransferVue = defineAsyncComponent(() =>
  import("../../components/block/transfer.vue")
);
const SupplyVue = defineAsyncComponent(() =>
  import("../../components/block/supply.vue")
);
const ActiveVue = defineAsyncComponent(() =>
  import("../../components/block/active.vue")
);
const PriceVue = defineAsyncComponent(() =>
  import("../../components/block/price.vue")
);
const PriceBtgVue = defineAsyncComponent(() =>
  import("../../components/block/priceBtg.vue")
);

const pubbleys = (url) => {
  router.push({
    name: "address",
    params: {
      url: url,
    },
  });
};

ustdData().then((data) => {
  appStore.setRate(data.data.rate);
  appStore.getRateData(data.data);
});

const fetchOrderData = async () => {
  try {
    const res = await order("new_transactions");
    orderData.value = res.filter(item => item.result != null);
    console.log(orderData.value);
    
    appStore.setTransaction(JSON.stringify(orderData.value));
  } catch (err) {
    console.error("Error fetching order data:", err);
  }
};

// onMounted(() => {
//   fetchOrderData();
// });

const unnumTranstions = ref([]);
const timeName = ref([]);
const cote = ref([]);
const trueTramsatiom = ref([]);
const totalTransactions = computed(() => {
  return orderData.value.reduce(
    (total, order) => total + order.transactions,
    0
  );
});
const performanceSamples = async () => {
  let requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getRecentPerformanceSamples",
    params: [24],
  };
  await chainRequest(requestBody)
    .then((response) => {
      let res = response.result;
      for (let i in response.result) {
        timeName.value.unshift(
          JSON.parse(i) + 1 == 1
            ? "a" + "minutes ago "
            : JSON.parse(i) + 1 + "minutes ago "
        );
        cote.value.push(JSON.parse(response.result[i].numTransactions));
        trueTramsatiom.value.push(
          JSON.parse(response.result[i].numNonVoteTransactions)
        );
        unnumTranstions.value.push(
          JSON.parse(response.result[i].numTransactions) +
            JSON.parse(response.result[i].numNonVoteTransactions)
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching epoch info:", error);
    });
};

performanceSamples();

const fetchData = async () => {
  try {
    const requestBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "getEpochInfo",
      params: [],
    };
    const response = await chainRequest(requestBody);
    solttime.value = getTime(
      response.result.slotsInEpoch - response.result.slotIndex
    );
    if (slot.value === 1) {
      slot.value = response.result.slotIndex;
      inepoch.value = response.result.slotsInEpoch;
      epoch.value = response.result.epoch;
    }
  } catch (error) {
    console.error("Error fetching epoch info:", error);
  }
};

onMounted(() => {
  fetchData();
  // setTimeout(() => {
  fetchOrderData();
  // }, 1000); // 延迟1秒加载订单数据
});

const getTime = (timestamp) => {
  return moment(JSON.parse(moment().format("x")) + timestamp * 400).fromNow();
};

const toFexedStake = (num) => {
  if (num) {
    return JSON.parse((num / 1000000000).toFixed(2));
  }
};

const supplyRequest = async () => {
  await chainRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "getSupply",
  })
    .then((res) => {
      stubly.value = (
        JSON.parse(JSON.stringify(res.result.value.total).slice(0, 9)) / 1000000
      ).toFixed(1);
      appStore.setStubly(stubly.value);
      appStore.setStuBlys(res.result.value.total);
    })
    .catch((err) => {
      console.log(err);
    });
  await chainRequest({
    jsonrpc: "2.0",
    id: 1,
    method: "getVoteAccounts",
    params: [],
  })
    .then((res) => {
      let btg = res.result;
      let btgcont = 0;
      let btgcount = 0;
      if (btg) {
        for (let i in btg.current) {
          btgcont += JSON.parse(JSON.stringify(btg.current[i].activatedStake));
        }
        btgcount = btgcont;
        let num = (btgcont / 1000000000).toFixed(0);
        btgcont = (num / 1000000).toFixed(1);
      }
      pubbley.value = btgcont;
      appStore.setBtgcount(btgcount);
      appStore.setPubbley(pubbley.value);
    })
    .catch((err) => {
      console.log(err);
    });

  server.value = getServerData();
};

supplyRequest();

const getServerData = () => {
  Apex = {
    title: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: appVariable.font.bodyFontfamily,
        color: appVariable.color.bodyColor,
      },
    },
    legend: {
      fontFamily: appVariable.font.bodyFontfamily,
      labels: {
        colors: appVariable.color.bodyColor,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: appVariable.font.bodyFontfamily,
      },
    },
    grid: {
      borderColor: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
    },
    dataLabels: {
      style: {
        fontSize: "12px",
        fontFamily: appVariable.font.bodyFontfamily,
        fontWeight: "bold",
        colors: undefined,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
        color: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: -1,
      },
      axisTicks: {
        show: false,
        borderType: "solid",
        color: "rgba(" + appVariable.color.bodyColorRgb + ", .25)",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
      labels: {
        style: {
          colors: appVariable.color.bodyColor,
          fontSize: "12px",
          fontFamily: appVariable.font.bodyFontfamily,
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: appVariable.color.bodyColor,
          fontSize: "12px",
          fontFamily: appVariable.font.bodyFontfamily,
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      min: 1500,
    },
  };
  return {
    chart: {
      series: [
        {
          name: "TPM history",
          data: unnumTranstions.value,
        },
      ],
      options: {
        colors: [appVariable.color.theme],
        xaxis: {
          categories: [],
          labels: { show: false },
        },
        fill: { opacity: 0.65 },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return `<div class="custom-tooltip" style="padding:5px">  
              <div>vote: ${cote.value[dataPointIndex]}</div> 
              <div>true ${trueTramsatiom.value[dataPointIndex]}</div> 
              <div>${timeName.value[dataPointIndex]} </div> 
            </div>`;
          },
        },
        chart: {
          height: "100%",
          type: "bar",
          toolbar: { show: false },
          labels: timeName.value,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: { enabled: false },
        grid: {
          show: true,
          borderColor: "rgba(" + appVariable.color.inverseRgb + ", .15)",
        },
        stroke: { show: false },
      },
    },
    stats: [
      {
        name: "EPOCH PROGRESS",
        total: slot.value,
        totals: inepoch.value,
        unit: "",
        progress: "20%",
        time: "Last updated 1 min ago",
        info: [
          {
            title: "Epoch",
            value: epoch.value,
            class: "text-theme",
            style: "cursor: pointer",
            click: true,
          },
          {
            title: "Epoch time remaining",
            value: solttime.value,
            class: "text-theme text-opacity-50",
            style: "",
            click: false,
          },
        ],

        chart: {
          height: 50,
          options: {
            chart: { type: "donut", sparkline: { enabled: true } },
            colors: [],
            stroke: {
              show: false,
              curve: "smooth",
              lineCap: "butt",
              colors: "rgba(" + appVariable.color.blackRgb + ", .25)",
              width: 2,
              dashArray: 0,
            },
            plotOptions: { pie: { donut: { background: "transparent" } } },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `<div class="custom-tooltip" style="padding:5px">  
                <span> ${["SlotIndex", "SlotsInEpoch"][seriesIndex]} : </span> 
                <span>${series[seriesIndex] * 100} % </span> 
              </div>`;
              },
            },
          },
          series: [
            JSON.parse((slot.value / inepoch.value).toFixed(2)),
            JSON.parse((1 - slot.value / inepoch.value).toFixed(2)),
            // 0.39, 0.61,
          ],
        },
      },
      {
        name: "Active Stake (BTG)",
        total: pubbley.value,
        totals: stubly.value,
        unit: "M",

        progress: "10%",
        time: "Last updated 1 min ago",
        info: [
          {
            title: "Active Stake",
            value: pubbley.value + "M",
            class: "text-theme",
            style: "",
            click: false,
          },
          {
            title: "Total Supply",
            value: stubly.value + "M",
            class: "text-theme text-opacity-50",
            click: false,
            style: "",
          },
        ],
        chart: {
          height: 50,
          options: {
            chart: { type: "donut", sparkline: { enabled: true } },
            colors: [],
            stroke: {
              show: false,
              curve: "smooth",
              lineCap: "butt",
              colors: "rgba(" + appVariable.color.blackRgb + ", .25)",
              width: 2,
              dashArray: 0,
            },
            plotOptions: { pie: { donut: { background: "transparent" } } },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return `<div class="custom-tooltip" style="padding:5px">  
                <span> ${["BTG Supply", "Active Stake"][seriesIndex]} : </span> 
                <span>${series[seriesIndex] * 100} % </span> 
              </div>`;
              },
            },
          },
          series: [
            // JSON.parse(pubbley.value), JSON.parse(stubly.value)
            JSON.parse((pubbley.value / stubly.value).toFixed(2)),
            JSON.parse((1 - pubbley.value / stubly.value).toFixed(2)),
          ],
        },
      },
    ],
  };
};

function uniqueArrayByProperty(arr, key) {
  // 创建一个映射，其中键是key的值，值是原始数组的项（作为数组）
  const uniqueItemsMap = arr.reduce((acc, item) => {
    const keyValue = item[key];
    // 如果该key还没有在映射中，则添加一个新的数组项
    if (!acc[keyValue]) {
      acc[keyValue] = [item];
    } else {
      // 如果已经存在，则将项添加到现有数组中
      acc[keyValue].push(item);
    }
    return acc;
  }, {});

  // 将映射转换为一个数组，其中每个对象包含原始数据和它的出现次数
  return Object.entries(uniqueItemsMap).map(([key, items]) => ({
    value: key, // 如果需要key的值，可以保留这一行
    items: items[0].timezone.split("/")[0], // 这是具有相同key值的原始数据项数组
    count: items.length, // 这是该项的出现次数
    country_name: items[0].country_name,
    timezone: items[0].timezone,
  }));
}

const getTrafficData = (data) => {
  let coun = [];
  let countryArray = [];
  let chartArray = [];
  let chartName = [];
  if (data) {
    let arrayData = uniqueArrayByProperty(data, "try");
    let country = uniqueArrayByProperty(data, "code");

    for (let i = 0; i < 5; i++) {
      coun.push({
        name: arrayData[i].value,
        visits: arrayData[i].count,
        pct: (
          (JSON.parse(arrayData[i].count) / JSON.parse(data.length)) *
          100
        ).toFixed(2),
        class: 0,
        timezone: arrayData[i].items,
        country_name: arrayData[i].country_name,
      });
    }
    for (let i in country) {
      countryArray.push({
        name: country[i].value,
        visits: country[i].count,
        pct: (
          (JSON.parse(country[i].count) / JSON.parse(data.length)) *
          100
        ).toFixed(2),
        class: 0,
        timezone: country[i].items,
        country_name: country[i].country_name,
      });
      chartArray.push(
        (
          (JSON.parse(arrayData[i].count) / JSON.parse(data.length)) *
          100
        ).toFixed(2)
      );
    }
  }
  let chainArray = countryArray.sort((a, b) => a - b);
  country.value = coun;
  source.value = coun.sort((a, b) => a - b);
  appStore.getCountryData(chainArray[0]);
  series.value = chartArray.map(parseFloat);
  let array = series.value;
  for (let i in chainArray) {
    chartName.push(chainArray[i].timezone);
  }
  return {
    coun,
    chainArray,
    chart: {
      height: 70,
      options: {
        chart: { type: "donut", sparkline: { enabled: true } },
        colors: [
          "rgba(" + appVariable.color.themeRgb + ", .15)",
          "rgba(" + appVariable.color.themeRgb + ", .35)",
          "rgba(" + appVariable.color.themeRgb + ", .55)",
          "rgba(" + appVariable.color.themeRgb + ", .75)",
          "rgba(" + appVariable.color.themeRgb + ", .95)",
        ],
        stroke: {
          show: false,
          curve: "smooth",
          lineCap: "butt",
          colors: "rgba(" + appVariable.color.blackRgb + ", .25)",
          width: 2,
          dashArray: 0,
        },
        plotOptions: { pie: { donut: { background: "transparent" } } },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            console.log(series, seriesIndex);
            console.log(series[seriesIndex]);
            console.log(series);
            return `<div class="custom-tooltip" style="padding:5px">  
              <span>${chartName[seriesIndex]}: </span> 
              <span>${series[seriesIndex]} %</span> 
            </div>`;
          },
        },
      },
      series: array,
    },
  };
};

const getActivityLogData = async () => {
  let requestBody = {
    id: "35a5860e-2564-4b92-890d-dc57e9c58d75",
    jsonrpc: "2.0",
    method: "getProgramAccounts",
    params: [
      "Config1111111111111111111111111111111111111",
      {
        commitment: "processed",
        encoding: "jsonParsed",
      },
    ],
  };
  let ClusterNodes = {
    id: "d9080c36-8a4d-494f-8a5e-1ba06815e912",
    jsonrpc: "2.0",
    method: "getClusterNodes",
    params: [],
  };
  let VoteAccounts = {
    id: "35a5860e-2564-4b92-890d-dc57e9c58d75",
    jsonrpc: "2.0",
    method: "getVoteAccounts",
    params: [],
  };

  Promise.all([
    chainRequest(requestBody),
    chainRequest(ClusterNodes),
    chainRequest(VoteAccounts),
  ]).then((res) => {
    let ClusterNodes_list = res[0].result;
    let ProgramAccounts_list = res[1].result;
    let VoteAccounts_list = res[2].result;
    let list = [];

    for (let i in ProgramAccounts_list) {
      for (let j in ClusterNodes_list) {
        if (ClusterNodes_list[j].account.data.parsed) {
          for (let y in ClusterNodes_list[j].account.data.parsed.info.keys) {
            if (
              ClusterNodes_list[j].account.data.parsed.info.keys[y].signer ==
              true
            ) {
              if (
                ProgramAccounts_list[i].pubkey ==
                ClusterNodes_list[j].account.data.parsed.info.keys[y].pubkey
              ) {
                list.push({
                  ip: ProgramAccounts_list[i].gossip.split(":")[0],
                  name: ClusterNodes_list[j].account.data.parsed.info.configData
                    .name,
                  pubkey: ProgramAccounts_list[i].pubkey,
                  icon: ClusterNodes_list[j].account.data.parsed.info.configData
                    .iconUrl,
                  version: ProgramAccounts_list[i].version,

                  activatedStake: "",
                });
              }
            }
          }
        }
      }
    }
    let listCount = 0;
    for (let i in list) {
      for (let h in VoteAccounts_list.current) {
        if (VoteAccounts_list.current[h].nodePubkey == list[i].pubkey) {
          list[i].activatedStake = VoteAccounts_list.current[h].activatedStake;
        } else {
        }
      }
      listCount += list[i].activatedStake;
    }
    list.sort((a, b) => {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    countLog.value = listCount;
    console.log(list);
    
    ActivityLogData.value = list;
    appStore.setValidators(JSON.stringify(list));
    appStore
      .getPartData(
        (JSON.parse(ClusterNodes_list.length) - JSON.parse(list.length)) /
          JSON.parse(ClusterNodes_list.length)
      )
      .toFixed(2);
    sessionStorage.setItem("accout", JSON.stringify(list));
    renderMap();
  });
};

const countplount = (num) => {
  return ((num / countLog.value) * 100).toFixed(2) + "%";
};

const requestList = async (object) => {
  await chainRequest(object)
    .then((res) => {
      return res.result;
    })
    .catch((error) => {
      return [];
    });
};

const getIPLocation = async (ip) => {
  const url = `https://ipapi.co/${ip}/json`; // 使用你的访问令牌

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem(ip, JSON.stringify(data));
    return data; // 返回包含地理位置信息的对象
  } catch (error) {
    console.error("Error fetching location:", error);
    return error; // 或抛出错误
  }
};

const stringcate = (str) => {
  if (str.length < 10) {
    return str;
  } else {
    return str.slice(0, 5) + "..." + str.slice(-5);
  }
};

const randomNo = () => {
  return Math.floor(Math.random() * 60) + 30;
};

const mapData = ref([]);

const renderMap = async () => {
  let markers_data = [];
  for (let i in ActivityLogData.value) {
    if (localStorage.getItem(ActivityLogData.value[i].ip)) {
      markers_data.push({
        name: "",
        coords: [
          JSON.parse(localStorage.getItem(ActivityLogData.value[i].ip))
            .latitude,
          JSON.parse(localStorage.getItem(ActivityLogData.value[i].ip))
            .longitude,
        ],
        try: JSON.parse(localStorage.getItem(ActivityLogData.value[i].ip))
          .country,
        code: JSON.parse(localStorage.getItem(ActivityLogData.value[i].ip))
          .continent_code,
        timezone: JSON.parse(localStorage.getItem(ActivityLogData.value[i].ip))
          .timezone,
        country_name: JSON.parse(
          localStorage.getItem(ActivityLogData.value[i].ip)
        ).country_name,
      });
    } else {
      const ipData = ipAddresses.ip_addresses.find(
        (item) => item.ip == ActivityLogData.value[i].ip
      );

      if (ipData) {
        markers_data.push({
          name: "",
          coords: ipData.location,
          try: ipData.try,
          code: ipData.code,
          timezone: ipData.timezone,
          country_name: ipData.country_name,
        });
      } else {
        let loc_lat = await getIPLocation(ActivityLogData.value[i].ip);
        markers_data.push({
          name: "",
          coords: [loc_lat.latitude, loc_lat.longitude],
          try: loc_lat.country,
          code: loc_lat.continent_code,
          timezone: loc_lat.timezone,
          country_name: loc_lat.country_name,
        });
      }
    }
  }

  const coordsCounts = new Map();

  markers_data.forEach((obj) => {
    const key = obj.coords[0];
    if (coordsCounts.has(key)) {
      const currentCount = coordsCounts.get(key);
      coordsCounts.set(key, currentCount + 1);
      obj.count = currentCount + 1;
    } else {
      coordsCounts.set(key, 1);
      obj.count = 1;
    }
  });
  for (let i in markers_data) {
    if (markers_data[i].count > 1) {
      let lat = Number(markers_data[i].coords[0]); // 转换或默认为0
      let lng = Number(markers_data[i].coords[1]); // 转换或默认为0

      // 现在进行数值加法

      if (i % 2 == 0) {
        lat += 1;
      } else {
        lat -= 1;
      }
      lng += markers_data[i].count * 2; // 这可能是一个合理的经度偏移量

      // 更新coords数组
      markers_data[i].coords[0] = lat;
      markers_data[i].coords[1] = lng;
    }

    let currentLat = Number(markers_data[i].coords[0]);
    for (let j = 0; j < markers_data.length; j++) {
      if (j < markers_data.length) {
        if (i != j) {
          let compareLat = Number(markers_data[j].coords[0]); // 比较项的纬度

          if (Math.abs(currentLat - compareLat) < 1) {
            markers_data[j].coords[0] -= 1;
            markers_data[j].coords[1] += 1;
          }
        }
      }
    }
  }
  map.value.addMarkers(markers_data);

  mapData.value = markers_data;
  traffic.value = getTrafficData(markers_data);
};

const mapCreate = () => {
  map.value = new jsVectorMap({
    selector: "#map",
    map: "world",
    zoomButtons: true,
    normalizeFunction: "polynomial",
    hoverOpacity: 0.5,
    hoverColor: false,
    zoomOnScroll: false,
    focusOn: { x: 0.5, y: 0.5, scale: 1 },
    markers: mapData.value,
    markerStyle: {
      initial: { fill: appVariable.color.theme, stroke: "none", r: 4 },
      hover: { fill: appVariable.color.theme },
    },
    regionStyle: {
      initial: {
        fill: appVariable.color.inverse,
        fillOpacity: 0.35,
        stroke: "none",
        strokeWidth: 0.4,
        strokeOpacity: 1,
      },
      hover: { fillOpacity: 0.5 },
    },
    backgroundColor: "transparent",
  });
};

const textValue = (text) => {
  return text.toUpperCase();
};

onMounted(() => {
  getActivityLogData();
  mapCreate();
});

const epochSkip = (num) => {
  router.push({
    name: "epoch",
    params: {
      num: num,
    },
  });
};

const pubbtx = (item) => {
  router.push({
    name: "tx",
    params: {
      item: item,
    },
  });
};

onBeforeUnmount(() => {
  if (activeVueref.value) {
    activeVueref.value.stopTimer();
  }
});
</script>



<template>
  <div class="row">
    <blockHeightVue ref="activeVueref" />
    <netWorkVue ref="networkref" />
    <activeAccountVue />
    <transferVue />
    <supplyVue />
    <activeVue />
    <priceVue />
    <priceBtgVue />
  </div>
  <div class="row">
    <!-- BEGIN stats -->

    <!-- BEGIN server-stats -->
    <div class="col-xl-6">
      <card class="mb-3">
        <card-body style="min-height: 400px">
          <div class="d-flex fw-bold small mb-3">
            <span class="flex-grow-1"> TPM history </span>
            <!-- <card-expand-toggler /> -->
          </div>
          <div class="ratio ratio-21x9 mb-3" v-if="server.chart">
            <apexchart
              type="bar"
              width="100%"
              height="100%"
              :options="server.chart.options"
              :series="server.chart.series"
            ></apexchart>
          </div>
          <div class="row">
            <div
              class="col-lg-6 mb-3 mb-lg-0"
              v-for="(stat, index) in server.stats"
              :key="index"
            >
              <div class="d-flex align-items-center">
                <div class="w-50px h-50px">
                  <apexchart
                    :height="stat.chart.height"
                    :options="stat.chart.options"
                    :series="stat.chart.series"
                  >
                  </apexchart>
                </div>
                <div class="ps-3 flex-1">
                  <div
                    class="fs-10px fw-bold text-inverse text-opacity-50 mb-1"
                  >
                    {{ stat.name }}
                  </div>
                  <div class="mb-2 fs-5 text-truncate" style="display: flex">
                    <count-up
                      duration="3"
                      :startVal="stat.total"
                      :end-val="stat.total"
                    ></count-up>
                    {{ stat.unit }}
                    /<count-up
                      duration="3"
                      :startVal="stat.totals"
                      :end-val="stat.totals"
                    ></count-up>
                    {{ stat.unit }}
                  </div>
                  <div class="progress h-3px mb-1">
                    <div
                      class="progress-bar bg-theme"
                      v-bind:style="{
                        width:
                          JSON.parse((stat.total / stat.totals).toFixed(2)) *
                            100 +
                          '%',
                      }"
                    ></div>
                  </div>
                  <div
                    class="fs-11px text-inverse text-opacity-50 mb-2 text-truncate"
                  >
                    {{ stat.time }}
                  </div>
                  <div
                    class="d-flex align-items-center small"
                    v-for="(info, index) in stat.info"
                    :key="index"
                  >
                    <i
                      class="bi bi-circle-fill fs-6px me-2"
                      v-bind:class="info.class"
                    ></i>
                    <div
                      class="flex-1"
                      style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      {{ info.title }}
                    </div>
                    <div
                      :style="info.style"
                      @click="info.click ? epochSkip(info.value) : ''"
                      class="text-theme"
                    >
                      {{ info.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </card-body>
      </card>
    </div>
    <!-- END server-stats -->

    <!-- BEGIN traffic-analytics -->
    <div class="col-xl-6">
      <card class="mb-3">
        <card-body style="min-height: 400px">
          <div class="d-flex fw-bold small mb-3">
            <span class="flex-grow-1">NODE ANALYTICS</span>
            <!-- <card-expand-toggler /> -->
          </div>
          <div class="ratio ratio-21x9 mb-3">
            <div
              class="jvm-without-padding"
              id="map-container maps"
              ref="mapContainer"
            >
              <div id="map"></div>
            </div>
          </div>

          <div class="row gx-4" v-if="traffic.chart">
            <div class="col-lg-6 mb-3 mb-lg-0">
              <table
                class="w-100 small mb-0 text-truncate text-inverse text-opacity-60"
              >
                <thead>
                  <tr class="text-inverse text-opacity-75">
                    <th class="w-50">COUNTRY</th>
                    <th class="w-25">CODE</th>
                    <th class="w-25">VAILDATORS</th>
                    <th class="w-25 text-end">PCT%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(country, index) in traffic.coun"
                    v-bind:class="country.class"
                    :key="index"
                  >
                    <td style="text-align: left">{{ country.country_name }}</td>
                    <td style="text-align: left">{{ country.name }}</td>

                    <td style="text-align: left">{{ country.visits }}</td>
                    <td class="text-end">{{ country.pct }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="col-lg-6"
              v-if="traffic.lenght != 0"
              style="margin-top: 6px"
            >
              <card>
                <card-body class="py-2">
                  <div class="d-flex align-items-center">
                    <div class="w-70px">
                      <apexchart
                        :height="traffic.chart.height"
                        :options="traffic.chart.options"
                        :series="traffic.chart.series"
                      ></apexchart>
                    </div>
                    <div class="flex-1 ps-2">
                      <table
                        class="w-100 small mb-0 text-inverse text-opacity-60"
                      >
                        <tbody>
                          <tr
                            v-for="(source, index) in traffic.chainArray"
                            :key="index"
                          >
                            <td>
                              <div class="d-flex align-items-center">
                                <div
                                  class="w-6px h-6px rounded-pill me-2"
                                  v-bind:class="source.class"
                                ></div>
                                {{ source.timezone }}
                              </div>
                            </td>
                            <td>
                              {{ source.name }}
                            </td>
                            <td class="text-end">{{ source.pct }}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </card-body>
              </card>
            </div>
          </div>
        </card-body>
      </card>
    </div>
    <!-- END traffic-analytics -->

    <!-- BEGIN top-products -->
    <div class="col-xl-6">
      <card class="mb-3">
        <card-body>
          <div class="d-flex fw-bold small mb-3">
            <span class="flex-grow-1">New Transactions</span>
            <!-- <card-expand-toggler /> -->
          </div>
          <div class="table-responsive">
            <table
              class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small"
            >
              <tbody>
                <tr>
                  <th style="width: 20%; text-align: left">SIGNATURE</th>
                  <th style="width: 20%; text-align: left">SOURCE</th>
                  <th style="width: 20%; text-align: left">DESTINATION</th>
                  <th style="width: 10%; text-align: left">BTG</th>
                  <th style="width: 10%; text-align: left">TYPE</th>
                  <th style="width: 20%; text-align: left">TIME</th>
                </tr>

                <tr
                  v-for="(product, index) in orderData"
                  :key="index"
                  style="height: 35px"
                >
                  <td
                    style="width: 20%; text-align: left; cursor: pointer"
                    class="text-theme"
                    @click="pubbtx(product.result.transaction.signatures[0])"
                  >
                    {{
                      stringcate(
                        promaster[product.result.transaction.signatures[0]]
                          ? promaster[product.result.transaction.signatures[0]]
                              .name
                          : product.result.transaction.signatures[0]
                      )
                    }}
                  </td>
                  <td
                    style="width: 20%; text-align: left; cursor: pointer"
                    class="text-theme"
                    @click="
                      pubbleys(
                        product.result.transaction.message.instructions[0]
                          .parsed.info.source
                      )
                    "
                  >
                    {{
                      stringcate(
                        promaster[
                          product.result.transaction.message.instructions[0]
                            .parsed.info.source
                        ]
                          ? promaster[
                              product.result.transaction.message.instructions[0]
                                .parsed.info.source
                            ].name
                          : product.result.transaction.message.instructions[0]
                              .parsed.info.source
                      )
                    }}
                  </td>
                  <td
                    style="width: 20%; text-align: left; cursor: pointer"
                    class="text-theme"
                    @click="
                      pubbleys(
                        product.result.transaction.message.instructions[0]
                          .parsed.info.destination
                      )
                    "
                  >
                    {{
                      stringcate(
                        promaster[
                          product.result.transaction.message.instructions[0]
                            .parsed.info.destination
                        ]
                          ? promaster[
                              product.result.transaction.message.instructions[0]
                                .parsed.info.destination
                            ].name
                          : product.result.transaction.message.instructions[0]
                              .parsed.info.destination
                      )
                    }}
                  </td>
                  <td style="width: 10%; text-align: left">
                    {{
                      toFexedStake(
                        product.result.transaction.message.instructions[0]
                          .parsed.info.lamports
                      )
                    }}
                  </td>
                  <td style="width: 15%; text-align: left">
                    <button
                      type="button"
                      style="
                        width: 80px;
                        height: 20px;
                        padding: 0;
                        border: 1px solid #3cd2a5;
                        background-color: #212b38;
                        color: #3cd2a5;
                        border-radius: 2px;
                        line-height: 18px;
                        text-align: center;
                        cursor: auto;
                      "
                    >
                      {{
                        textValue(
                          product.result.transaction.message.instructions[0]
                            .parsed.type
                        )
                      }}
                    </button>
                  </td>
                  <td style="width: 20%; text-align: left; white-space: nowrap">
                    {{ timeFormatter(product.result.blockTime * 1000) }} &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </card-body>
      </card>
    </div>
    <!-- END top-products -->

    <!-- BEGIN activity-log -->
    <div class="col-xl-6">
      <card class="mb-3">
        <card-body>
          <div class="d-flex fw-bold small mb-3">
            <span class="flex-grow-1">All Validators</span>
            <!-- <card-expand-toggler /> -->
          </div>
          <div class="table-responsive">
            <table
              class="table table-striped table-borderless mb-2px small text-nowrap"
            >
              <tbody>
                <tr>
                  <th>NAME</th>
                  <th style="text-align: left">PUBKEY</th>
                  <th style="text-align: left">ACTIVATEDSTAKE</th>
                  <th style="text-align: left">GOSSIP</th>

                  <th style="text-align: left">STATUS</th>
                </tr>
                <tr
                  v-if="ActivityLogData"
                  v-for="(log, index) in ActivityLogData"
                  :key="index"
                >
                  <td>
                    <span class="d-flex align-items-center">
                      <img
                        :src="log.icon"
                        alt=""
                        width="20"
                        style="margin: 0px 5px"
                      />
                      {{ log.name }}
                    </span>
                  </td>
                  <td style="text-align: left">
                    <span
                      class="text-theme"
                      style="cursor: pointer"
                      @click="pubbleys(log.pubkey)"
                    >
                      {{
                        stringcate(
                          promaster[log.pubkey]
                            ? promaster[log.pubkey].name
                            : log.pubkey
                        )
                      }}
                    </span>
                  </td>
                  <td style="text-align: left; display: flex">
                    <count-up
                      :startVal="toFexedStake(log.activatedStake)"
                      :end-val="toFexedStake(log.activatedStake)"
                      duration="3"
                    ></count-up>
                    &nbsp; BTG &nbsp; (
                    {{ countplount(log.activatedStake) }}
                    )
                  </td>
                  <td style="text-align: left">
                    {{ log.ip }}
                  </td>
                  <td style="text-align: left">
                    <span
                      :style="{
                        color: log.activatedStake !== '' ? 'green' : 'yellow',
                      }"
                      class="menu-icon"
                    >
                      <font-awesome-icon
                        icon="fas fa-lg fa-fw me-2 fa-check-circle"
                        v-if="log.activatedStake !== ''"
                      />
                      <font-awesome-icon
                        icon="fas fa-lg fa-fw me-2 fa-question-circle"
                        v-if="log.activatedStake == ''"
                      />
                    </span>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="4">No records found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </card-body>
      </card>
    </div>
    <!-- END activity-log -->
  </div>
  <!-- <div>Loading……</div> -->
  <!-- END row -->
</template>

<style scoped>
td {
  text-align: center;
}

/* .table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
} */
</style>
