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
                        <div style="display:flex;">
                            <span style="color:#26E97E;background-color:#116939;" class="dage">
                                # {{ index + 1 }}
                            </span>
                            {{ titleUrl(item.programId) }} Instruction
                        </div>
                        <div v-if="item.programId">
                            <!-- {{ item.programId }} -->
                            <ul>
                                <li v-for="(items, indexs) in liList(data.meta.logMessages, item.programId, index,
                                    data.transaction.message.instructions[index - 1] ?
                                        data.transaction.message.instructions[index - 1].programId : null)" :key="indexs"
                                    :class="dataDeal(items, item.programId).type == 'success' ? 'text-theme' : ''
                                        ">
                                    {{ dataDeal(items, item.programId).name }}
                                    &nbsp;{{ dataDeal(items, item.programId).value }}
                                    &nbsp;{{ dataDeal(items, item.programId).type
                                    }}
                                </li>
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
import { ref, watch } from "vue";
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
const lastindex = ref(0);//上次遍历最后一个符合项

const extractLogsBetweenFirstAndLast = (data, item, index, lastprogramId) => {
    let startIndex = 0;
    let endIndex = 0;
    if (!lastprogramId) {
        // 第一次遍历：找到第一个匹配项的索引
        for (let i = startIndex; i < data.length; i++) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === item) {
                startIndex = i;
                break; // 找到第一个匹配项后退出循环
            }
        }
        console.log(startIndex);
        for (let i = data.length - 1; i >= 0; i--) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === item) {
                endIndex = i;
                break; // 找到最后一个匹配项后退出循环
            }
        }
        // lastindex.value = endIndex;

        const matchedLogs = data.slice(startIndex + index + 1, endIndex + 1);
        // 如果没有找到任何匹配项，返回空数组
        return matchedLogs;
    } else {
        for (let i = data.length - 1; i >= 0; i--) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === lastprogramId) {
                startIndex = i;
                break; // 找到最后一个匹配项后退出循环
            }
        }
        for (let i = data.length - 1; i >= startIndex; i--) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === item) {
                endIndex = i;
                break; // 找到最后一个匹配项后退出循环
            }
        }
        const matchedLogs = data.slice(startIndex + index + 1, endIndex + 1);
        return matchedLogs;
    }

};

// 使用 liList 函数来展示如何调用 extractLogsBetweenFirstAndLast
const liList = (data, item, index, lastprogramId) => {
    const listData = extractLogsBetweenFirstAndLast(data, item, index, lastprogramId);
    return listData;
};

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