<template>
    <card class="md-3" v-for="(item, index) in instruction" :key="index" :class="index != 0 ? 'marginTOP-50' : ''">
        <card-body class="card-bodys">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tr>
                    <th>
                        <span class="text-theme">
                            #{{ index + 1 }}
                        </span> {{ titleUrl(item.programId).url ? titleUrl(item.programId).url : 'Associated Token Program' }} : {{ item.parsed ? item.parsed.type : '' }}
                    </th>
                    <th>
                    </th>
                    <th>
                    </th>
                </tr>
                <tbody>
                    <template v-if="item.parsed">
                        <tr v-if="item.programId">
                            <td>ProgramId</td>
                            <td class="text-end text-theme " style="cursor: pointer" @click="item.programId">{{
                                titleUrl(item.programId).url }}
                            </td>
                        </tr>
                        <tr v-for="[key, value] in Object.entries(item.parsed.info)" :key="key">
                            <td>{{ capitalize(key) }}</td>
                            <td class="text-end" :class="typeof titleUrl(value).url == 'string' ? 'text-theme' : ''"
                                :style="typeof titleUrl(value).url == 'string' ? 'cursor: pointer' : ''" @click="pubbleys(
                                    key == 'extensionTypes' ? '' : (key == 'lamports' ? '' : (key == 'space' ? '' : (key == 'decimals' ? '' : (key == 'tokenAmount' ?  '' :value ) )))
                                )">
                                
                                {{ key == 'extensionTypes' ? value[0] :(key == 'lamports' ? toFexedStake(value) : (key == 'tokenAmount' ? value.uiAmount : titleUrl(value).url) ) }} {{ key == 'space' ?
                                    'byts(s)' : '' }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.accounts">
                        <tr v-if="item.programId">
                            <td>ProgramId</td>
                            <td class="text-end text-theme " style="cursor: pointer" @click="item.programId">{{
                                titleUrl(item.programId).url }}
                            </td>
                        </tr>
                        <tr v-if="item.data">
                            <td>Data</td>
                            <td class="text-end">{{ titleUrl(item.data).url }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <template v-for="(child_item, child_index) in innerInstructions" :key="child_index">
                <innerInster-view v-if="index == child_item.index" :data="child_item.instructions" :index="index + 1" />
            </template>
        </card-body>
    </card>
</template>
<script setup>
import { titleUrl } from "../../components/method/title_url";
import { useRouter } from "vue-router";
import innerInsterView from "./innerInstructions.vue";
import { ref } from "vue";
const router = useRouter();
const props = defineProps({
    data: {
        typeof: Array,
        default: []
    },
    child: {
        typeof: Array,
        default: []
    }
})
const instruction = ref(props.data);
const innerInstructions = ref(props.child)


const toFexedStake = (num) => {
    if (num === undefined || num === null) {
        return null; // 或者您可以选择返回其他默认值
    }

    const value = num / 1000000000;
    const integerPart = Math.trunc(value);

    if (integerPart > 0) {
        return value.toFixed(2);
    } else {
        return value.toFixed(5);
    }
};
const pubbleys = (url) => {
    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }

};
const capitalize = ([first, ...rest]) => {
    return first.toUpperCase() + rest.join('')
}
</script>
