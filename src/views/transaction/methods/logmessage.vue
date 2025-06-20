<template>
    <card class="md-3">
        <card-body class="card-bodys">
            <div>
                <div style="width:100%;display:flex;justify-content: space-between;">
                    <h4>{{ $t("transaction.LogMessages") }} </h4>
                    <div>
                        <span style="cursor: pointer" @click="raw = !raw">Raw</span>
                    </div>
                </div>
                <div v-if="raw">
                    <div class="marginTOP-20" v-for="(item, index) in (data.transaction.message.instructions)"
                        :key="index">
                        <div style="display:flex;" class="">
                            <span style="color:#26E97E;background-color:#116939;" class="dage">
                                # {{ index + 1 }}
                            </span>
                            {{ titleUrl(item.programId).url }} Instruction
                        </div>
                        <div v-if="item.programId">
                            <instructionview :data="data.meta.logMessages"
                                :innerInstructions="data.meta.innerInstructions" :programId="item.programId"
                                :index="index" :instructions="data.transaction.message.instructions[index-1] ?
                                    data.transaction.message.instructions[index-1].programId : null" />
                        </div>
                    </div>
                </div>
                <div v-if="!raw">
                    <pre style="background-color: #18202C;border:none;color:#fff;line-height:15px">
                            {{
                                data.meta.logMessages
                            }}
                        </pre>
                </div>
            </div>
        </card-body>
    </card>
</template>

<script setup>
import {
  ref,
  watch,
} from 'vue';

import { titleUrl } from '../../../components/method/title_url';
import instructionview from './instruction_list.vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});
const raw = ref(true);

</script>

<style scoped>
.dage {
    display: inline-block;
    padding: 0.33em 0.5em;
    font-size: 80%;
    font-weight: 400;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: initial;
    border-radius: 0.375rem;
    margin: 0 5px;
}
</style>