<template>
    <card class="md-3 marginTOP-50">
        <card-body class="card-bodys ">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <th>
                <th>{{ $t("account.account_authorization") }}</th>
                <th class="text-end"></th>
                </th>
                <tbody v-if="data">
                    <tr>
                        <td>{{ $t("account.foundry_license") }} </td>
                        <td class="text-end text-theme">
                            <text :style="MintData?.mintAuthority ? 'cursor: pointer' : ''"
                                @click="pubbtx(MintData?.mintAuthority)">{{
                                    !MintData?.mintAuthority ? "N/A" : titleUrl(MintData?.mintAuthority).url }}</text>
                            <img v-if="titleUrl(MintData?.mintAuthority).type"
                                v-for="(datas, indexs) in titleUrl(MintData?.mintAuthority).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">

                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.freeze_authorization") }} </td>
                        <td class="text-end text-theme">
                            <text :style="MintData?.freezeAuthority ? 'cursor: pointer' : ''"
                                @click="pubbtx(MintData?.freezeAuthority)">{{ MintData?.freezeAuthority == null ? "N/A"
                                    :
                                    titleUrl(MintData?.freezeAuthority).url }}</text>
                            <img v-if="titleUrl(MintData?.freezeAuthority).type"
                                v-for="(datas, indexs) in titleUrl(MintData?.freezeAuthority).certificates"
                                :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.update_authorization") }} </td>
                        <td class="text-end text-theme" v-if="MintData">
                            <template v-for="(item, index) in MintData.extensions" :key="index">
                                <template v-if="item.state.updateAuthority">
                                    <text>{{ item.state.updateAuthority ? titleUrl(item.state.updateAuthority).url :
                                        'N/A' }}</text>
                                    <img v-if="titleUrl(item.state.updateAuthority).type"
                                        v-for="(datas, indexs) in titleUrl(item.state.updateAuthority).certificates"
                                        :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                                </template>
                            </template>
                        </td>
                        <td class="text-end text-theme" v-else>
                            N/A
                        </td>
                    </tr>
                </tbody>
            </table>
        </card-body>
    </card>
    <card class="md-3 marginTOP-50">
        <card-body class="card-bodys ">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <th>
                <th>{{ $t("account.extensions") }}</th>
                <th class="text-end"></th>
                </th>
                <tbody v-if="data">
                    <tr>
                        <td>{{ $t("account.transfer_fees") }} </td>
                        <td class="text-end ">
                            {{ feeData?.fees }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.Maximum_fees") }} </td>
                        <td class="text-end"> {{ feeData?.maximum }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.default_state") }} </td>
                        <td class="text-end"> {{ feeData?.default ?  $t("Unfrozen")   :
                             $t("Frozen")   }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.non_transterale") }} </td>
                        <td class="text-end"> {{ feeData?.non ? $t("Disable")  : $t("Enable")  }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </card-body>
    </card>
</template>

<script setup>
import {
  onMounted,
  ref,
} from 'vue';

import { titleUrl } from '../../../../components/method/title_url/';
import { chainRequest } from '../../../../request/chain.js';
import { getExtraData } from '../../../../request/extensions.js';
import { tokenList } from './auth.js';

const data = ref();
const props = defineProps({
    url: {
        typeof: String,
        default: ''
    }
})

const MintData = ref();
const updateAuthorization = ref();

const method = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getProgramAccounts',
    params: [
        'Token9ADbPtdFC3PjxaohBLGw2pgZwofdcbj6Lyaw6c',
        {
            encoding: 'jsonParsed',
            filters: [
                {
                    memcmp: {
                        offset: 1,
                        bytes: '1'
                    }
                }
            ]
        }
    ]
}
const feeData = ref();

onMounted(async () => {
    const res = await chainRequest(method);
    let response = res.result
    const matchedToken = response.find((item) => item.pubkey === props.url)
    if (matchedToken) {
        MintData.value = matchedToken.account.data.parsed.info
    }
    const fee = await getExtraData(props.url);
    console.log(fee);
    feeData.value = fee;
})



tokenList(props.url).then(res => {
    console.log(res.data);
    data.value = res.data;
}).catch(error => {
});

</script>