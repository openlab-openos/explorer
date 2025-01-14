<template>
    <card class="md-3" v-for="(item, index) in instruction" :key="index"
        :class="index != 0 ? 'marginTOP-10' : 'marginTOP-20'">
        <card-body class="card-bodys">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tr>
                    <th>
                        <span class="text-theme">
                            #{{ instruction_index == 0 ? '' : instruction_index + '.' + (index + 1) }}
                        </span> {{ titleUrl(item.programId).url ? titleUrl(item.programId).url : 'Associated Token Program' }}
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
        </card-body>
    </card>
</template>
<script setup>
import { titleUrl } from "../../components/method/title_url";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const props = defineProps({
    data: {
        typeof: Array,
        default: []
    },
    index: {
        typeof: Number,
        default: 0
    }
})
const instruction = ref(props.data);
const instruction_index = ref(props.index);


const toFexedStake = (num) => {
    if (num) {
        return (num / 1000000000).toFixed(5);
    }
};
const capitalize = ([first, ...rest]) => {
    return first.toUpperCase() + rest.join('')
}
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
</script>
