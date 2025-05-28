<template>
    <ul>
        <li v-for="(item, index) in liList(props.data, props.programId, props.index, props.instructions)" :key="index"
            :class="[dataDeal(item.log).type == 'success' ? 'text-theme' : ''
                , item.children.length != 0 ? 'color27-181-197' : 'colord1']">

            {{ dataDeal(item.log).type == "invoke" ? dataDeal(item.log).name + ' ' +
                titleUrl(dataDeal(item.log).value).url : (dataDeal(item.log).type == "success" ? dataDeal(item.log).name
                    + ' ' +
                    'returned' + ' ' + dataDeal(item.log).type : item.log) }}
            <ul>
                <li v-for="(items, indexs) in item.children" :key="indexs" :class="dataDeal(items.log).type == 'success' ? 'text-theme' : 'colord1'
                    ">
                    {{ dataDeal(items.log).type == "invoke" ? dataDeal(items.log).name + ' ' +
                        titleUrl(dataDeal(items.log).value).url : (dataDeal(items.log).type == "success" ?
                            dataDeal(items.log).name + ' ' +
                            'returned' + ' ' + dataDeal(items.log).type  : items.log)}}
                </li>
            </ul>
        </li>
    </ul>
</template>
<script setup>
import { end } from '@popperjs/core';

import { titleUrl } from '../../../components/method/title_url';

const props = defineProps({
    data: {
        typeof: Array,
        default: []
    },
    innerInstructions: {
        typeof: Array,
        default: []
    },
    programId: {
        typeof: String,
        default: ''
    },
    index: {
        typeof: Number,
        default: 0
    },
    instructions: {
        typeof: String,
        default: ''
    }
})

const dataDeal = (item) => {
    return {
        name: item.split(" ")[0],
        value: item.split(" ")[1],
        type: item.split(" ")[2],
    };
};


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

        for (let i = 1; i < data.length; i++) {
            // console.log(data);

            const parts = data[i].split(' ');


            if (parts.length > 1 && parts[1] === item && parts[2] == 'success') {
                endIndex = i;
                break; // 找到最后一个匹配项后退出循环
            }
        }

        const matchedLogs = data.slice(startIndex+1, endIndex + 1);
        // 如果没有找到任何匹配项，返回空数组
        return matchedLogs;
    } else {
        for (let i = 0; i < data.length; i++) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === lastprogramId && parts[2] == 'success') {
                startIndex = i+1;
                break;
            }
        }
        // console.log(startIndex);

        for (let i = startIndex; i < data.length; i++) {
            const parts = data[i].split(' ');
            if (parts.length > 1 && parts[1] === item && parts[2] == 'success') {
                endIndex = i;
                break; // 找到最后一个匹配项后退出循环
            }
        }
  
        const matchedLogs = data.slice(startIndex +1, endIndex + 1);
        return matchedLogs;
    }

};

// 使用 liList 函数来展示如何调用 extractLogsBetweenFirstAndLast
const liList = (data, item, index, lastprogramId) => {
    // console.log(data, item, index, lastprogramId);

    const listData = extractLogsBetweenFirstAndLast(data, item, index, lastprogramId);

    const parsedData = buildLogTree(listData);

    return parsedData;
};

function buildLogTree(logs) {
    let stack = [];
    let result = [];

    logs.forEach((log, index) => {
        const logObj = {
            log,
            index,
            children: [],
            type: 'other' // 默认类型为 other
        };

        if (log.includes('invoke')) {
            logObj.type = 'invoke';
            // 如果有之前的 invoke 没有关闭（即栈不为空），则将其作为子元素添加
            if (stack.length > 0) {
                stack[stack.length - 1].children.push(logObj);
            } else {
                // 否则作为顶级元素添加
                result.push(logObj);
            }
            stack.push(logObj); // 新的 invoke 成为当前的上下文
        } else if (log.includes('success') && stack.length > 0) {
            logObj.type = 'success';
            const lastInvoke = stack.pop();
            lastInvoke.children.push(logObj);

            // 如果栈不为空，则将这个成功的调用作为上一级调用的子元素
            if (stack.length > 0) {
                stack[stack.length - 1].children.push(lastInvoke);
            } else {
                // 确保不会重复添加到结果列表中
                if (!result.some(r => r.index === lastInvoke.index)) {
                    result.push(lastInvoke);
                }
            }
        } else {
            // 处理其他类型的日志条目，作为最近一次 invoke 的子元素或直接添加到结果列表
            if (stack.length > 0) {
                stack[stack.length - 1].children.push(logObj);
            } else {
                // 如果没有 invoke 上下文，也作为顶级元素添加
                result.push(logObj);
            }
        }
    });

    // 确保所有未关闭的 invoke 都被添加到结果中，但要避免重复
    while (stack.length > 0) {
        const lastInvoke = stack.pop();
        if (!result.some(r => r.index === lastInvoke.index)) {
            result.push(lastInvoke);
        }
    }

    return result;
}


</script>