<template>
    <card class="md-3" v-for="(item, index) in instruction" :key="index" :class="index != 0 ? 'marginTOP-50' : ''">
        <card-body class="card-bodys">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tr>
                    <th style="white-space: nowrap;">
                        <span class="text-theme">
                            #{{ index + 1 }}
                        </span>
                        {{ titleUrl(item.programId).find ? (titleUrl(item.programId).url ? titleUrl(item.programId).url
                            : 'Associated Token Program') : 'Unknown Program' }} : {{ item.parsed ? item.parsed.type :
                            'Unknown Instruction' }}
                    </th>
                </tr>
                <tbody>
                    <template v-if="item.parsed?.info">
                        <tr v-if="item.programId">
                            <td>ProgramId</td>
                            <td class="text-end text-theme ">
                                <text style="cursor: pointer" @click="item.programId">{{
                                    titleUrl(item.programId).url }}</text>
                            </td>
                        </tr>

                        <template v-for="[key, value] in Object.entries(item.parsed.info)" :key="key">
                            <tr v-if="typeof value != 'object'">
                                <td>
                                    {{ capitalize(key == "lamports" ? 'amount' : key) }}
                                    {{ key == "lamports" ? '(BTG)' : '' }}{{ typeof value == 'object' ? '.' : '' }}
                                    <span v-if="typeof value == 'object'" v-for="[keys, values] in Object.entries(key)"
                                        :key="keys">
                                        {{ values }}
                                    </span>
                                </td>
                                <td class="text-end"
                                    :class="typeof titleUrl(value).url == 'string' ?  (value.length > 43 ? 'text-theme' : '') : ''">
                                    <text :style="typeof titleUrl(value).url == 'string' ?  (value.length > 43 ? 'cursor: pointer' : '')  : ''"
                                        @click="pubbleys(
                                            value.length > 43 ? (key == 'extensionTypes' ? '' : (key == 'lamports' ? '' : (key == 'space' ? '' : (key == 'decimals' ? '' : (key == 'tokenAmount' ? '' : value))))
                                            ) : ''
                                        )">
                                        {{ key == 'extensionTypes' ? value[0] : (key == 'lamports' ?
                                            toFexedStake(value)
                                            :
                                            (key
                                                == 'tokenAmount' ? value.uiAmount : titleUrl(value).url)) }} {{ key == 'space' ?
                                            'byts(s)' : '' }}</text>

                                    {{ key == "lamports" ? '(BTG)' : '' }}
                                    <img v-if="titleUrl(value).type && !titleUrl(value).assest"
                                        v-for="(datas, indexs) in titleUrl(value).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                    <text v-for="items, indexs in titleUrl(value).certificates" :key="indexs"
                                        :style="'background-color: ' + items.backColor"
                                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                        {{ items.code }}
                                    </text>
                                </td>
                            </tr>

                            <template v-else>
                                <template v-if="value">
                                    <tr v-for="[keys, values] in Object.entries(value)" :key="keys">
                                        <td>
                                            {{ capitalize(key == "lamports" ? 'amount' : key) }}.<span
                                                v-for="[keyChild, valuechild] in Object.entries(keys)" :key="keyChild">
                                                {{ valuechild }}
                                            </span>
                                        </td>
                                        <td class="text-end"
                                            :class="typeof titleUrl(values).url == 'string' ?  (values.length > 43 ? 'text-theme' : '') : ''">
                                            <text
                                                :style="typeof titleUrl(values).url == 'string' ?  (values.length > 43 ? 'cursor: pointer' : '')  : ''"
                                                @click="pubbleys(
                                                    values.length > 43 ? (keys == 'extensionTypes' ? '' : (keys == 'lamports' ? '' : (keys == 'space' ? '' : (keys == 'decimals' ? '' : (keys == 'tokenAmount' ? '' : values))))
                                                    ) : ''
                                                )">{{ keys ==
                                                    'space' ?
                                                    'byts(s)' : '' }}
                                                {{ keys == 'amount' ? come(values) : keys == 'extensionTypes' ?
                                                    values[0] :
                                                    (keys ==
                                                        'lamports' ?
                                                        toFexedStake(values)
                                                        :
                                                        (keys
                                                            == 'tokenAmount' ? values.uiAmount : (keys == 'lockouts' ? 'data' :
                                                                titleUrl(values).url))) }}

                                                {{ keys == "lamports" ? '(BTG)' : '' }}</text>

                                            <img v-if="titleUrl(values).type && !titleUrl(values).assest"
                                                v-for="(datas, indexs) in titleUrl(values).certificates" :key="indexs"
                                                :src="datas.img" height="24" class="marginRight8" alt="">
                                            <text v-for="items, indexs in titleUrl(values).certificates" :key="indexs"
                                                :style="'background-color: ' + items.backColor"
                                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                                {{ items.code }}
                                            </text>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                            <!-- <tr v-else>
                                    <td>1
                                    </td>
                                    <td class="text-end"
                                        :class="typeof titleUrl(value).url == 'string' ? 'text-theme' : ''"
                                        :style="typeof titleUrl(value).url == 'string' ? 'cursor: pointer' : ''" @click="pubbleys(
                                            key == 'extensionTypes' ? '' : (key == 'lamports' ? '' : (key == 'space' ? '' : (key == 'decimals' ? '' : (key == 'tokenAmount' ? '' : value))))
                                        )">
                                        2
                                    </td>
                            </tr> -->
                        </template>
                    </template>
                    <template v-if="item.accounts">
                        <tr v-if="item.programId">
                            <td>ProgramId</td>
                            <td class="text-end text-theme ">
                                <text style="cursor: pointer" @click="item.programId">{{
                                    titleUrl(item.programId).url }}</text>
                            </td>
                        </tr>

                        <tr v-if="item.accounts.length != 0">
                            <td>Account</td>
                            <!-- {{ item.accounts[0] }} -->
                            <td class="text-end text-theme ">
                                <text style="cursor: pointer" @click="item.accounts[0]">
                                    {{
                                        titleUrl(item.accounts[0]).url }}
                                </text>
                                <img v-if="titleUrl(item.accounts[0]).type && !titleUrl(item.accounts[0]).assest"
                                    v-for="(datas, indexs) in titleUrl(item.accounts[0]).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.accounts[0]).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>

                            </td>
                        </tr>
                        <tr v-if="item">
                            <td>Data</td>
                            <td class="text-end">{{ titleUrl(item.data ? item.data : 'Note Data').url }}
                                <img v-if="titleUrl(item.data).type && !titleUrl(item.data).assest"
                                    v-for="(datas, indexs) in titleUrl(item.data).certificates" :key="indexs"
                                    :src="datas.img" height="24" class="marginRight8" alt="">
                                <text v-for="items, indexs in titleUrl(item.data).certificates" :key="indexs"
                                    :style="'background-color: ' + items.backColor"
                                    style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                    {{ items.code }}
                                </text>

                            </td>
                        </tr>
                    </template>
                    <template v-if="!item.accounts && !item.parsed?.info">
                        <template v-for="[key, value] in Object.entries(item)" :key="key">
                            <tr v-if="typeof value != 'object'">
                                <td>{{ capitalize(key == "lamports" ? 'amount' : key) }}
                                    {{ key == "lamports" ? '(BTG)' : '' }}{{ typeof value == 'object' ? '.' : '' }}
                                    <span v-if="typeof value == 'object'" v-for="[keys, values] in Object.entries(key)"
                                        :key="keys">
                                        {{ values }}
                                    </span>
                                </td>
                                <td class="text-end"
                                    :class="typeof titleUrl(value).url == 'string' ?  (value.length > 43 ? 'text-theme' : '') : ''">
                                    <text :style="typeof titleUrl(value).url == 'string' ?  (value.length > 43 ? 'cursor: pointer' : '')  : ''"
                                        @click="pubbleys(
                                            value.length > 43 ? (key == 'extensionTypes' ? '' : (key == 'lamports' ? '' : (key == 'space' ? '' : (key == 'decimals' ? '' : (key == 'tokenAmount' ? '' : value))))
                                            ) : ''
                                        )"> {{ key == 'extensionTypes' ? value[0] : (key == 'lamports' ?
                                            toFexedStake(value)
                                            :
                                            (key
                                                == 'tokenAmount' ? value.uiAmount : titleUrl(value).url)) }} {{ key == 'space' ?
                                            'byts(s)' : '' }}
                                        {{ key == "lamports" ? '(BTG)' : '' }}</text>

                                    <img v-if="titleUrl(value).type && !titleUrl(value).assest"
                                        v-for="(datas, indexs) in titleUrl(value).certificates" :key="indexs"
                                        :src="datas.img" height="24" class="marginRight8" alt="">
                                    <text v-for="items, indexs in titleUrl(value).certificates" :key="indexs"
                                        :style="'background-color: ' + items.backColor"
                                        style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                        {{ items.code }}
                                    </text>
                                </td>
                            </tr>

                            <template v-else>
                                <template v-if="value">
                                    <tr v-for="[keys, values] in Object.entries(value)" :key="keys">
                                        <td>
                                            {{ capitalize(key == "lamports" ? 'amount' : key) }}<span
                                                v-for="[keyChild, valuechild] in Object.entries(keys)" :key="keyChild">
                                                {{ valuechild }}
                                            </span>
                                        </td>
                                        <td class="text-end"
                                            :class="typeof titleUrl(values).url == 'string' ?  (values.length > 43 ? 'text-theme' : '') : ''">
                                            <text
                                                :style="typeof titleUrl(values).url == 'string' ? (values.length > 43 ? 'cursor: pointer' : '') : ''"
                                                @click="pubbleys(
                                                    values.length > 43 ? (keys == 'extensionTypes' ? '' : (keys == 'lamports' ? '' : (keys == 'space' ? '' : (keys == 'decimals' ? '' : (keys == 'tokenAmount' ? '' : values))))
                                                    ) : ''
                                                )"> {{ keys == 'extensionTypes' ? values[0] : (keys == 'lamports' ?
                                                    toFexedStake(values)
                                                    :
                                                    (keys
                                                        == 'tokenAmount' ? values.uiAmount : (keys == 'lockouts' ? 'data' :
                                                            titleUrl(values).url))) }}
                                                {{ keys ==
                                                    'space' ?
                                                    'byts(s)' : '' }}
                                                {{ keys == "lamports" ? '(BTG)' : '' }}</text>

                                            <img v-if="titleUrl(values).type && !titleUrl(values).assest"
                                                v-for="(datas, indexs) in titleUrl(values).certificates" :key="indexs"
                                                :src="datas.img" height="24" class="marginRight8" alt="">
                                            <text v-for="items, indexs in titleUrl(values).certificates" :key="indexs"
                                                :style="'background-color: ' + items.backColor"
                                                style="border-radius: 5px;padding: 2px 4px;margin: 5px 5px 0 0;font-weight: 500;font-size: 14px;color: #ffff;">
                                                {{ items.code }}
                                            </text>
                                        </td>
                                    </tr>
                                </template>
                            </template>
                        </template>
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
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { titleUrl } from '../../components/method/title_url';
import innerInsterView from './innerInstructions.vue';

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
console.log(233333);
const come = (num) => {
    let reg =
        num.toString().indexOf(".") > -1
            ? /(\d)(?=(\d{3})+\.)/g
            : /(\d)(?=(\d{3})+$)/g;

    return num.toString().replace(reg, "$1,");
}

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
