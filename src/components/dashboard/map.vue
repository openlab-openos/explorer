<template>
    <div class="col-xl-6">
        <card class="mb-3">
            <card-body style="min-height: 400px">
                <div class="d-flex fw-bold small mb-3">
                    <span class="flex-grow-1">{{ $t("dashboard.node_analytics") }}</span>
                    <!-- <card-expand-toggler /> -->
                </div>
                <div class="ratio ratio-21x9 mb-3">
                    <div class="jvm-without-padding" id="map-container maps" ref="mapContainer">
                        <div id="map"></div>
                    </div>
                </div>

                <div class="row gx-4" v-if="traffic.chart">
                    <div class="col-lg-6 mb-3 mb-lg-0">
                        <table class="w-100 small mb-0 text-truncate text-inverse text-opacity-60">
                            <thead>
                                <tr class="text-inverse text-opacity-75">
                                    <th class="w-50">{{ $t("dashboard.country") }}</th>
                                    <th class="w-25">{{ $t('dashboard.code') }}</th>
                                    <th class="w-25">{{ $t("dashboard.vaildators") }}</th>
                                    <th class="w-25 text-end">{{ $t("dashboard.pct") }}%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(country, index) in traffic.coun" v-bind:class="country.class" :key="index">
                                    <td style="text-align: left">{{ country.country_name }}</td>
                                    <td style="text-align: left">{{ country.name }}</td>

                                    <td style="text-align: left">{{ country.visits }}</td>
                                    <td class="text-end">{{ country.pct }}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-lg-6" v-if="traffic.lenght != 0" style="margin-top: 6px">
                        <card>
                            <card-body class="py-2">
                                <div class="d-flex align-items-center">
                                    <div class="w-70px">
                                        <apexchart :height="traffic.chart.height" :options="traffic.chart.options"
                                            :series="traffic.chart.series"></apexchart>
                                    </div>
                                    <div class="flex-1 ps-2" style="overflow-x: auto;">
                                        <table class="w-100 small mb-0 text-inverse text-opacity-60">
                                            <tbody>
                                                <tr v-for="(source, index) in traffic.chainArray" :key="index">
                                                    <template v-if="source.name != 'undefined'" >
                                                        <td class="minification-size">
                                                            <div class="d-flex align-items-center">
                                                                <div class="w-6px h-6px rounded-pill me-2"
                                                                    v-bind:class="source.class"></div>
                                                                {{ source.timezone }}
                                                            </div>
                                                        </td>
                                                        <td class="minification-size">
                                                            {{ source.name }}
                                                        </td>
                                                        <td class="text-end">{{ source.pct }}%</td>
                                                    </template>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ipAddresses } from "./address";
import { useAppVariableStore } from "@/stores/app-variable";
import { chainRequest } from "../../request/minchain";
import { useAppStore } from "@/stores/index";
import apexchart from "@/components/plugins/Apexcharts.vue";
const country = ref();
const source = ref();
const series = ref();

onMounted(() => {
    getActivityLogData();
    mapCreate();
});
const traffic = ref([]);
const ActivityLogData = ref([]);
const mapData = ref([]);
const appVariable = useAppVariableStore();
const countLog = ref();
const appStore = useAppStore();
const mapArray = ref(appStore.getmarkersdata);
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
    // let VoteAccounts = {
    //     id: "35a5860e-2564-4b92-890d-dc57e9c58d75",
    //     jsonrpc: "2.0",
    //     method: "getVoteAccounts",
    //     params: [],
    // };

    Promise.all([
        chainRequest(requestBody),
        chainRequest(ClusterNodes),
        // chainRequest(VoteAccounts),
    ]).then((res) => {console.log(res);
    
        appStore.setVaildators(res);
        let ClusterNodes_list = res[0].result;
        let ProgramAccounts_list = res[1].result;
        let VoteAccounts_list = appStore.getvoteAccount;
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
            if (list[i].activatedStake) {
                listCount += JSON.parse(list[i].activatedStake);
            }
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
        ActivityLogData.value = list;
        console.log(list);

        appStore.setValidators(JSON.stringify(list));
        appStore
            .getPartData(
                (JSON.parse(ClusterNodes_list.length) - JSON.parse(list.length)) /
                JSON.parse(ClusterNodes_list.length)
            )
            .toFixed(2);
        sessionStorage.setItem("accout", JSON.stringify(list));
        if (mapArray.value.length == 0) {
            renderMap();
        } else {
            map.value.addMarkers(mapArray.value);


            mapData.value = mapArray.value;
            console.log(mapArray.value);

            traffic.value = getTrafficData(mapArray.value);
        }
        //         for(let i in aaaaa){
        //             console.log(aaaaa[i]);

        //             // console.log(JSON.parse(aaaaa[i]));
        //         }
    });
};

const renderMap = async () => {
    let markers_data = [];
    for (let i in ActivityLogData.value) {
        if (localStorage.getItem(ActivityLogData.value[i].ip)) {

        } else {
            if (ipAddresses.ip_addresses) {
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
                }
                 else {
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
            let lat = JSON.parse(markers_data[i].coords[0]); // 转换或默认为0
            let lng = JSON.parse(markers_data[i].coords[1]); // 转换或默认为0

            // 现在进行数值加法

            if (i % 2 == 0) {
                lat -= 1;
            } else {
                lat += 1;
            }
            lng += markers_data[i].count * 1.1; // 这可能是一个合理的经度偏移量
            // 更新coords数组
            markers_data[i].coords[0] = lat.toFixed(4);
            markers_data[i].coords[1] = lng.toFixed(4);
        }

        let currentLat = Number(markers_data[i].coords[0]);
        for (let j = 0; j < markers_data.length; j++) {
            if (j < markers_data.length) {
                if (i != j) {
                    let compareLat = Number(markers_data[j].coords[0]); // 比较项的纬度

                    if (Math.abs(currentLat - compareLat) < 1) {
                        // let lat = Number(markers_data[j].coords[0]) -= 1;
                        // markers_data[j].coords[0] = lat.toFixed(4);
                        let lat = (markers_data[j].coords[1] += 1);
                        markers_data[j].coords[1] = lat;
                        // markers_data[j].coords[1] += 1;
                    }
                }
            }
        }
    }
    // for (let i in markers_data) {
    //     if (markers_data[i].count > 1) {
    //         let lat = Number(markers_data[i].coords[0]);
    //         let lng = Number(markers_data[i].coords[1]);

    //         if (i % 2 == 0) {
    //             lat -= 1;
    //         } else {
    //             lat += 1;
    //         }

    //         lng += markers_data[i].count * 1.1;

    //         markers_data[i].coords[0] = parseFloat(lat.toFixed(4));
    //         markers_data[i].coords[1] = parseFloat(lng.toFixed(4));
    //     }

    //     let currentLat = Number(markers_data[i].coords[0]);

    //     for (let j = 0; j < markers_data.length; j++) {
    //         if (j !== i) {
    //             let compareLat = Number(markers_data[j].coords[0]);

    //             if (Math.abs(currentLat - compareLat) < 1) {
    //                 let newLng = Number(markers_data[j].coords[1]) + 1;
    //                 markers_data[j].coords[1] = parseFloat(newLng.toFixed(4));
    //             }
    //         }
    //     }
    // }
    console.log(markers_data);

    // appStore.setMarkersData(markers_data);
    map.value.addMarkers(markers_data);
    
    mapData.value = markers_data;
    traffic.value = getTrafficData(markers_data);

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
const getTrafficData = (data) => {
    let coun = [];
    let countryArray = [];
    let chartArray = [];
    let chartName = [];

    if (data) {
        let arrayData = uniqueArrayByProperty(data, "try");
        let country = uniqueArrayByProperty(data, "code");
        console.log(arrayData);
        
        for (let i = 0; i < 5; i++) {
            if (arrayData[i].value != undefined) {
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
    console.log(array);

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

</script>