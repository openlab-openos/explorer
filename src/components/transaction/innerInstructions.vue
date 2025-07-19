<template>
    <h4 class="marginTOP-10">Inner Instructions</h4>
    <card class="md-3" v-for="(item, index) in instruction" :key="index"
        :class="index != 0 ? 'marginTOP-10' : 'marginTOP-20'">
        <card-body class="card-bodys">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tr>
                    <th>
                        <span class="text-theme">
                            #{{ instruction_index == 0 ? '' : instruction_index + '.' + (index + 1) }}
                        </span> {{ titleUrl(item.programId).url ? titleUrl(item.programId).url :
                            (titleUrl(item.programId).find ? 'Associated Token Program' : 'Unknown Program') }} : {{
                            item.parsed ? item.parsed.type : '' }}
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
                            <td class="text-end text-theme ">
                                <text style="cursor: pointer" @click="pubbleys(item.programId)"> {{
                                    titleUrl(item.programId).url }}</text>
                            </td>
                        </tr>
                        <tr v-for="[key, value] in Object.entries(item.parsed.info)" :key="key">
                            <td>{{ capitalize(key == "lamports" ? 'amount' : key) }}
                                {{ key == "lamports" ? '(BTG)' : '' }}
                            </td>
                            <td class="text-end"
                                :class="typeof titleUrl(value).url == 'string' ? (value.length > 43 ? 'text-theme' : '') : ''">
                                <div style="display: flex; justify-content: end;align-items: center;" >
                                    <text
                                        :style="typeof titleUrl(value).url == 'string' ? (value.length > 43 ? 'cursor: pointer' : '') : ''"
                                        @click="pubbleys(
                                            value.length > 43 ? (key == 'extensionTypes' ? '' : (key == 'lamports' ? '' : (key == 'space' ? '' : (key == 'decimals' ? '' : (key == 'tokenAmount' ? '' : value))))
                                            ) : ''
                                        )">{{ key == 'extensionTypes' ? value[0] : (key == 'lamports' ? toFexedStake(value)
                                        :
                                        (key
                                            == 'tokenAmount' ? value.uiAmount : titleUrl(value).url)) }} {{ key == 'space' ?
                                            'byts(s)' : '' }}
                                        {{ key == "lamports" ? '(BTG)' : '' }}</text>

                                    <RenderText v-if="value" :type="false" :address="value" style="margin-left: 10px;" />
                                </div>

                            </td>
                        </tr>
                    </template>
                    <template v-if="item.accounts">
                        <tr v-if="item.programId">
                            <td>ProgramId</td>
                            <td class="text-end text-theme ">
                                <text style="cursor: pointer" @click="pubbleys(item.programId)">{{
                                    titleUrl(item.programId).url }}</text>

                            </td>
                        </tr>
                        <tr v-if="item.accounts.length != 0">
                            <td>Account</td>
                            <td class="text-end text-theme ">
                                <!-- <text style="cursor: pointer" @click="item.accounts[0]">{{
                                    titleUrl(item.accounts[0]).url }}</text>
                                <img v-if="titleUrl(item.accounts[0]).type && !titleUrl(item.accounts[0]).assest"
                                    v-for="(datas, indexs) in titleUrl(item.accounts[0]).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.accounts[0]).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text> -->
                                <RenderText v-if="item.accounts[0]" :type="false" :address="item.accounts[0]" />

                            </td>
                        </tr>
                        <tr v-if="item">
                            <td>Data</td>
                            <td class="text-end">{{ titleUrl(item.data ? item.data : 'Note Data').url }}
                                <!-- <img v-if="titleUrl(item.data).type && !titleUrl(item.data).assest"
                                    v-for="(datas, indexs) in titleUrl(item.data).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.data).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text> -->
                                <RenderText v-if="item.data" :type="false" :address="item.data" />

                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </card-body>
    </card>
</template>
<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { titleUrl } from '../../components/method/title_url';
import RenderText from "../Render/text.vue"
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
