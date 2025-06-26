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
                            <text :style="data.mint_auth_address ? 'cursor: pointer' : ''"
                                @click="pubbtx(data.mint_auth_address)">{{
                                    !data.mint_auth_address ? "N/A" : titleUrl(data.mint_auth_address).url }}</text>
                            <img v-if="titleUrl(data.mint_auth_address).type"
                                v-for="(datas, indexs) in titleUrl(data.mint_auth_address).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">

                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.freeze_authorization") }} </td>
                        <td class="text-end text-theme">
                            <text :style="data.freeze_auth_address ? 'cursor: pointer' : ''"
                                @click="pubbtx(data.freeze_auth_address)">{{ data.freeze_auth_address == null ? "N/A" :
                                    titleUrl(data.freeze_auth_address).url }}</text>
                            <img v-if="titleUrl(data.freeze_auth_address).type"
                                v-for="(datas, indexs) in titleUrl(data.freeze_auth_address).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.update_authorization") }} </td>
                        <td class="text-end text-theme">
                            <text :style="data.update_auth_address ? 'cursor: pointer' : ''"
                                @click="pubbtx(data.update_auth_address)">{{ data.update_auth_address == null ? "N/A" :
                                    titleUrl(data.update_auth_address).url }}</text>
                            <img v-if="titleUrl(data.update_auth_address).type"
                                v-for="(datas, indexs) in titleUrl(data.update_auth_address).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
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
                            {{ data.transfer_fees ? data.transfer_fees : 'N/A' }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.Maximum_fees") }} </td>
                        <td class="text-end"> {{ data.transfer_max_fees == null ? "N/A" :
                            data.transfer_max_fees }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.default_state") }} </td>
                        <td class="text-end"> {{ data.default_account_state == null ? "N/A" :
                            data.default_account_state }}
                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.non_transterale") }} </td>
                        <td class="text-end"> {{ data.no_transferable == 0 ? "Disable" : "Enable" }}
                            <img v-if="titleUrl(data.update_auth_address).type"
                                v-for="(datas, indexs) in titleUrl(data.update_auth_address).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">
                        </td>
                    </tr>
                </tbody>
            </table>
        </card-body>
    </card>
</template>

<script setup>
import { ref } from 'vue';

import { titleUrl } from '../../../../components/method/title_url';
import { tokenList } from './auth.js';

const data = ref();
const props = defineProps({
    url: {
        typeof: String,
        default: ''
    }
})


tokenList(props.url).then(res => {
    console.log(res.data);
    data.value = res.data;
}).catch(error => {
});

</script>