<template>
    <card class="md-3 marginTOP-50">
        <card-body class="card-bodys ">
            <table class="w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <th>
                <th>{{ $t("account.account_authorization") }}</th>
                <th class="text-end"></th>
                </th>
                <tbody v-if="tokenData">
                    <tr>
                        <td>{{ $t("account.foundry_license") }} </td>
                        <td class="text-end text-theme">
                            <text :style="pubbleys ? 'cursor: pointer' : ''" @click="pubbtx(pubbleys)">{{
                                !pubbleys ? "N/A" : titleUrl(pubbleys).url }}</text>
                            <img v-if="titleUrl(pubbleys).type"
                                v-for="(datas, indexs) in titleUrl(pubbleys).certificates" :key="indexs"
                                :src="datas.img" height="24" class="marginRight8" alt="">

                        </td>
                    </tr>
                    <tr>
                        <td>{{ $t("account.freeze_authorization") }} </td>
                        <td class="text-end"> {{ tokenData.freezeAuthority == null ? "N/A" :
                            titleUrl(tokenData.freezeAuthority).url }}
                            <img v-if="titleUrl(tokenData.freezeAuthority).type"
                                v-for="(datas, indexs) in titleUrl(tokenData.freezeAuthority).certificates"
                                :key="indexs" :src="datas.img" height="24" class="marginRight8" alt="">
                        </td>
                    </tr>
                </tbody>
            </table>
        </card-body>
    </card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const pubbtx = (url) => {
    if (url) {
        router.push({
            name: "address",
            params: {
                url: url,
            },
        })
    }
};
const data = ref();
</script>