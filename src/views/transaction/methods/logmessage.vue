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
                    <div  class="marginTOP-20"  v-for="(item, index) in data.transaction.message.instructions" :key="index">
                        <div style="display:flex;">
                            <span style="color:#26E97E;background-color:#116939;" class="dage">
                                # {{ index + 1 }}
                            </span>
                            {{ titleUrl(item.programId) }} Instruction
                        </div>
                        <div>
                            <ul >
                                <li  v-for="(items, indexs) in liList(data.meta.logMessages,item.programId)" :key="indexs" :class="dataDeal(items, item.programId).type == 'success' ? 'text-theme' : ''
                                    ">
                                    {{ dataDeal(items, item.programId).name }}
                                    &nbsp;{{ dataDeal(items, item.programId).value }}
                                    &nbsp;{{ dataDeal(items, item.programId).type
                                    }}
                                </li>
                                <!-- <li>
                                    {{ liList(data.meta.logMessages,item.programId) }}
                                </li> -->
                            </ul>
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
import { ref } from "vue";
import { titleUrl } from "../../../components/method/title_url";
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});
const raw = ref(true);
const dataDeal = (item) => {
    if (/^\d+$/.test(item.split(" ")[1])) {
        return {
            name: item.split(" ")[0],
            value: "System Program",
            type: item.split(" ")[2],
        };
    } else {
        return {
            name: item.split(" ")[0],
            value: item.split(" ")[1],
            type: item.split(" ")[2],
        };
    }
};
const liList = (data,item)=>{
    const listData =  extractLogsBetweenFirstAndLast(data, item);
    return listData;
}
function extractLogsBetweenFirstAndLast(data, item) {
    let startIndex = -1;
    let endIndex = -1;

    // 找到第一个和最后一个匹配项的索引
    data.forEach((entry, index) => {
        const parts = entry.split(' ');
        if (parts.length > 1 && parts[1] === item) {
            if (startIndex === -1) {
                // 第一次找到匹配项时设置起始索引
                startIndex = index;
            }
            // 每次找到匹配项时更新结束索引
            endIndex = index;
        }
    });

    // 如果找到了至少一个匹配项，则提取并返回中间的所有值
    // if (startIndex !== -1 && endIndex !== -1) {
    //     return data.slice(startIndex, endIndex + 1);
    // }
    if (startIndex !== -1 && endIndex !== -1) {
        return data.slice(startIndex, endIndex + 1).filter(entry => !entry.includes("invoke"));
    }

    // 如果没有找到任何匹配项，返回空数组
    return [];
}

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