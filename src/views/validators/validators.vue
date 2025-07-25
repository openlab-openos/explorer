<template>
  <div>
    <div v-show="shoeType" class="row">
      <div class="col-xl-3 col-lg-6" v-for="(item, index) in Vaildators" :key="index">
        <!-- BEGIN card -->
        <card class="mb-3">
          <card-body>
            <div class="d-flex fw-bold small mb-3">
              <span class="flex-grow-1">{{ $t(item.name) }} </span>

              <card-expand-toggler />
            </div>
            <h5>
              <span class="text-theme">{{ item.value }}</span>
            </h5>
          </card-body>
        </card>
        <!-- END card -->
      </div>

      <div class="col-xl-6" style="width: 100%">
        <validatorsVue  :type="false" />
      </div>
    </div>
    <div v-show="!shoeType">{{ $t("loading") }}</div>
  </div>
</template>


<script setup>
import { useAppStore } from "../../stores/index";
import { ref, watchEffect,defineAsyncComponent } from "vue";
import i18n from "@/i18n"
import { useRouter } from "vue-router";
const validatorsVue = defineAsyncComponent(() =>
  import("../../components/validators/validators_list.vue")
);

const router = useRouter();
const appStore = useAppStore();

const shoeType = ref(false);

const Vaildators = ref([
  {
    name: "validators.title",
    value: 0,
  },
  {
    name: "validators.weighted_skip_rate",
    value: 0,
  },
  {
    name: "validators.nominal_staking_apy",
    value: 0,
  },
  {
    name: "validators.node_versions",
    value: 0,
  },
]);

// 语言
function selectLanguage(indexValue) {


  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
})

const ActivityLogData = ref([]);
ActivityLogData.value = appStore.Validators;

// console.log(ActivityLogData.value);

if(ActivityLogData.value.length == 0){
  router.push({
    name: "dashboard",
  });
}

Vaildators.value[0].value = ActivityLogData.value.length;

Vaildators.value[1].value = (appStore.part * 100).toFixed(2) + "%";
Vaildators.value[2].value = appStore.stake + "%";
Vaildators.value[3].value = ActivityLogData.value[0].version;



const toFexedStake = (num) => {
  if (num) {
    return (num / 1000000000).toFixed(0);
  }
};

const countLog = ref(1);

for (let i in ActivityLogData.value) {
  countLog.value += ActivityLogData.value[i].activatedStake;
}



shoeType.value = true;


</script>
