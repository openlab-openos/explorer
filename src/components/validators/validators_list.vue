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
                            <th style="text-align: left">{{ $t("validators.gossip") }}</th>

                            <th style="text-align: left">{{ $t("validators.status") }}</th>
                        </tr>
                        <template v-if="ActivityLogData">
                            <tr v-for="(log, index) in paginatedHistoryData" :key="index">
                                <td>
                                    <span class="d-flex align-items-center">
                                        <img :src="log.icon" alt="" width="20" style="margin: 0px 5px" />
                                        {{ log.name }}
                                    </span>
                                </td>
                                <td style="text-align: left" v-if="log.pubkey">
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
                                <td style="text-align: left; display: flex">
                                    <count-up :startVal="toFexedStake(log.activatedStake)"
                                        :end-val="toFexedStake(log.activatedStake)" duration="3"></count-up>
                                    &nbsp; BTG &nbsp; (
                                    {{ countplount(log.activatedStake) }}
                                    )
                                </td>
                                <td style="text-align: left">
                                    {{ log.ip }}
                                </td>
                                <td style="text-align: left">
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
import CountUp from "vue-countup-v3";
import { ref, onMounted, computed, watchEffect } from "vue";
import { useAppStore } from "@/stores/index";
import { chainRequest } from "../../request/chain";
import { useRouter } from "vue-router";
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

const getActivityLogData = async () => {
    let res = appStore.getvaildators;
    console.log(res);
    
    let ClusterNodes_list = res[0].result;
    let ProgramAccounts_list = res[1].result;
    let VoteAccounts_list = appStore.getvoteAccount.result;
    let list = [];
    console.log(ClusterNodes_list);
    console.log(VoteAccounts_list);

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
    console.log(list);

    totalItems.value = list.length;
    appStore.setValidators(JSON.stringify(list));
    appStore
        .getPartData(
            (JSON.parse(ClusterNodes_list.length) - JSON.parse(list.length)) /
            JSON.parse(ClusterNodes_list.length)
        )
        .toFixed(2);
    sessionStorage.setItem("accout", JSON.stringify(list));
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