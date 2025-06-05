<template>
    <card class="mb-3">
        <card-body>
            <div class="d-flex fw-bold small mb-3">
                <span class="flex-grow-1"> {{ $t("dashboard.all_validators") }} </span>
                <!-- <card-expand-toggler /> -->
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-borderless mb-2px small text-nowrap">
                    <tbody>
                        <tr>
                            <th>{{ $t("validators.name") }}</th>
                            <th style="text-align: left">{{ $t("validators.pubkey") }}</th>
                            <th style="text-align: left">{{ $t("validators.activated_stake") }}</th>
                            <!-- <th style="text-align: left">{{ $t("validators.gossip") }}</th> -->

                            <th style="text-align: left">{{ $t("validators.status") }}</th>
                        </tr>
                        <template v-if="ActivityLogData">
                            <tr v-for="(log, index) in paginatedHistoryData" :key="index">
                                <td style="height: 40px;">
                                    <span class="d-flex align-items-center">
                                        <img :src="log.icon" alt="" height="24" style="margin: 0px 5px" />
                                        {{ log.name }}
                                    </span>
                                </td>
                                <td style="text-align: left;height: 40px;" v-if="log.pubkey">
                                    <span class="text-theme" style="cursor: pointer" @click="pubbleys(log.votepubkey)">
                                        <!-- {{
                                        stringcate(
                                            promaster[log.pubkey]
                                                ? promaster[log.pubkey].name
                                                : log.pubkey
                                    )
                                    }} -->
                                        {{ stringcate(log.votepubkey) }}
                                    </span>
                                </td>
                                <td style="text-align: left; display: flex;height: 40px;">
                                    <count-up :startVal="toFexedStake(log.activatedStake)"
                                        :end-val="toFexedStake(log.activatedStake)" duration="3"></count-up>
                                    &nbsp; BTG &nbsp; (
                                    {{ countplount(log.activatedStake) }}
                                    )
                                </td>
                                <!-- <td style="text-align: left">
                                    {{ log.ip }}
                                </td> -->
                                <td style="text-align: left;height: 40px;">
                                    <span :style="{
                                        color: log.activatedStake !== '' ? 'green' : 'yellow',
                                    }" class="menu-icon">
                                        <font-awesome-icon icon="fas fa-lg fa-fw me-2 fa-check-circle"
                                            v-if="log.activatedStake !== ''" />
                                        <font-awesome-icon icon="fas fa-lg fa-fw me-2 fa-question-circle"
                                            v-if="log.activatedStake == ''" />
                                    </span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div v-if="ActivityLogData.length == 0" class="text-center">
                    {{ $t("account.available") }}
                </div>
                <div class="justify-end padding-10" v-if="ActivityLogData.length != 0">
                    <el-pagination background layout="prev, pager, next" :hide-on-single-page="true"
                        :current-page="currentPage" :page-size="pageSize" :total="totalItems"
                        @current-change="handlePageChange" />

                </div>
            </div>
        </card-body>
    </card>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watchEffect,
} from 'vue';

import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

import { useAppStore } from '@/stores/index';

const props = defineProps({
    type: {
        type: Boolean,
        default: false
    }
});
const router = useRouter();

const countLog = ref();


const ActivityLogData = ref([]);
const appStore = useAppStore();
const totalItems = ref(0);

const currentPage = ref(1);
const pageSize = ref(props.type ? 30 : 10000);
const paginatedHistoryData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return ActivityLogData.value.slice(start, end);
});
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

let VoteAccounts = {
        jsonrpc: "2.0",
        id: 1,
        method: "getVoteAccounts",
        params: [],
    };

const getActivityLogData = async () => {
    let res = appStore.getvaildators;
    
    
    if (res.length !== 0) {
        
        
        let ClusterNodes_list = res[0].result;
        let ProgramAccounts_list = res[1].result;
        let VoteAccounts_list =res[2].result;
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
                                    votepubkey: "",
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
                    list[i].votepubkey = VoteAccounts_list.current[h].votePubkey;
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

        totalItems.value = list.length;
        appStore.setValidators(JSON.stringify(list));
        appStore
            .getPartData(
                (JSON.parse(ClusterNodes_list.length) - JSON.parse(list.length)) /
                JSON.parse(ClusterNodes_list.length)
            )
            .toFixed(2);
        sessionStorage.setItem("accout", JSON.stringify(list));
    }

};
const countplount = (num) => {
    return ((num / countLog.value) * 100).toFixed(2) + "%";
};
const toFexedStake = (num) => {
    if (num) {
        return JSON.parse((num / 1000000000).toFixed(2));
    }
};
const stringcate = (str) => {
    if (str.length < 10) {
        return str;
    } else {
        return str.slice(0, 5) + "..." + str.slice(-5);
    }
};
onMounted(() => {
    watchEffect(async () => {
        await getActivityLogData();
    })
});
const pubbleys = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
};
</script>