<template>
    <card class="md-3" v-for="(item, index) in instruction" :key="index" :class="index != 0 ? 'marginTOP-10' : 'marginTOP-20'">
        <card-body class="card-bodys">
            <table class=" w-100 mb-0 small align-middle table table-striped table-borderless mb-2px small">
                <tr>
                    <th>
                        <span class="text-theme">
                            #{{ instruction_index == 0 ? '' :instruction_index + '.' + (index + 1) }}
                        </span> {{ titleUrl(item.programId).url ? titleUrl(item.programId).url : 'Associated Token Program' }}
                    </th>
                    <th>
                    </th>
                    <th>
                    </th>
                </tr>
                <tbody>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.extensionTypes">
                            <td>
                                {{ $t("transaction.extensionTypes") }}
                            </td>
                            <td class="text-end">
                                {{ item.parsed.info.extensionTypes[0] }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.decimals">
                            <td>
                                {{ $t("transaction.Decimals") }}
                            </td>
                            <td class="text-end">
                                {{ item.parsed.info.decimals }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.authority">
                            <td>{{ $t("transaction.authority") }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.authority)">{{
                                    titleUrl(item.parsed.info.authority).url }}</td>
                        </tr>
                    </template>
                    <template v-if="item.programId">
                        <tr>
                            <td>
                                {{ $t("transaction.program") }}
                            </td>
                            <td class="text-theme text-end" style="cursor: pointer" @click="pubbleys(item.programId)">
                                {{ titleUrl(item.programId).url }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.source">
                            <td>
                                {{ item.parsed.info.source ? $t('transaction.from_address') : $t('transaction.mint') }}
                            </td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.source)">
                                {{ titleUrl(item.parsed.info.source).url }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.mint">
                            <td>
                                {{ $t('transaction.mint') }}
                            </td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.mint)">
                                {{ titleUrl(item.parsed.info.mint).url }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.destination">
                            <td>{{ $t('transaction.to_address') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.destination)">
                                {{ titleUrl(item.parsed.info.destination).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.mintAuthority">
                            <td>{{ $t('transaction.mintAuthority') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.mintAuthority)">
                                {{ titleUrl(item.parsed.info.mintAuthority).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.account">
                            <td>{{ $t('account.accounts') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.account)">
                                {{ titleUrl(item.parsed.info.account).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.wallet">
                            <td>{{ $t('transaction.wallet') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.wallet)">
                                {{ titleUrl(item.parsed.info.wallet).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.tokenProgram">
                            <td>{{ $t('transaction.token_program') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.tokenProgram)">
                                {{ titleUrl(item.parsed.info.tokenProgram).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.systemProgram">
                            <td>{{ $t('transaction.system_program') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.systemProgram)">
                                {{ titleUrl(item.parsed.info.systemProgram).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.owner">
                            <td>{{ $t('account.Owner') }}</td>
                            <td class="text-theme text-end" style="cursor: pointer"
                                @click="pubbleys(item.parsed.info.owner)">
                                {{ titleUrl(item.parsed.info.owner).url
                                }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.tokenAmount">
                            <td>{{ $t('transaction.transfer_amount') }}</td>
                            <td class="text-theme text-end">
                                {{ item.parsed.info.tokenAmount.uiAmount }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.lamports">
                            <td>{{ $t('transaction.transfer_amount') }} (BTG)</td>
                            <td class="text-theme text-end">
                                {{ toFexedStake(item.parsed.info.lamports) }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.rentSysvar">
                            <td>{{ $t('transaction.rentsysvar') }}</td>
                            <td class="text-theme text-end">
                                {{ toFexedStake(item.parsed.info.rentSysvar) }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="item.parsed">
                        <tr v-if="item.parsed.info.space">
                            <td>
                                {{ $t("transaction.allocated_data_size") }}
                            </td>
                            <td class="text-end">
                                {{ item.parsed.info.space }}byts(s)
                            </td>
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
    index:{
        typeof:Number,
        default:0
    }
})
const instruction = ref(props.data);
const instruction_index = ref(props.index);
console.log(instruction.value);
console.log(instruction_index.value);


const toFexedStake = (num) => {
    if (num) {
        return (num / 1000000000).toFixed(2);
    }
};
const pubbleys = (url) => {
    router.push({
        name: "address",
        params: {
            url: url,
        },
    })
};
</script>
