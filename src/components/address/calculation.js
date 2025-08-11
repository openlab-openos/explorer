import {
    computed,
    ref,
    watch,
} from 'vue';

// 当前视图模式：month 或 year
const currentView = ref('month');

// 月份缩写
const months = [
    'Jan.', 'Feb.', 'Mar.', 'Apr.',
    'May.', 'Jun.', 'Jul.', 'Aug.',
    'Sep.', 'Oct.', 'Nov.', 'Dec.'
];

/**
 * 获取日期的序数词后缀
 */
function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * 格式化日期为 Jan. 1st, 2025 格式
 */
// function formatDate(date) {
//     const month = months[date.getMonth()];
//     const day = date.getDate();
//     const suffix = getOrdinalSuffix(day);
//     const year = date.getFullYear();
//     // return `${month} ${day}${suffix}, ${year}`;
//     return `${month} ${day}${suffix}`;
// }
function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}
// function formatDates(date) {
//     const month = months[date.getMonth()];
//     const day = date.getDate();
//     const suffix = getOrdinalSuffix(day);
//     const year = date.getFullYear();
//     return `${month} ${day}${suffix}, ${year}`;
//     // return `${month} ${day}${suffix}`;
// }
function formatDates(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
}
function formatMonthYear(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}/${month}`;
}

// function formatMonthYear(date) {
//     const month = months[date.getMonth()];
//     const year = date.getFullYear();
//     return `${month} ${year}`;
// }

/**
 * 计算时间范围
 */
const dateRange = computed(() => {
    const now = new Date();

    // 添加all视图的判断
    if (currentView.value === 'all') {
        // all视图：前3年至后10年
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 3);

        const end = new Date(now);
        end.setFullYear(end.getFullYear() + 10);

        return { start, end };
    } else if (currentView.value === 'month') {
        // 月视图：过去20天至未来10天
        const start = new Date(now);
        start.setDate(start.getDate() - 10);

        const end = new Date(now);
        end.setDate(end.getDate() + 20);

        return { start, end };
    } else {
        // 年视图：过去8个月至未来4个月
        const start = new Date(now);
        start.setMonth(start.getMonth() - 4); // 过去8个月

        const end = new Date(now);
        end.setMonth(end.getMonth() + 8); // 未来4个月

        return { start, end };
    }
});

/**
 * 格式化显示的时间范围
 */
const formattedRange = computed(() => {
    if (currentView.value === 'month') {
        return `${formatDate(dateRange.value.start)} —— ${formatDate(dateRange.value.end)}`;
    } else if (currentView.value === 'year') {
        // 年视图显示完整日期信息（月、日、年）
        return `${formatDates(dateRange.value.start)} —— ${formatDates(dateRange.value.end)}`;
    } else {
        // all视图显示年份范围
        return `${dateRange.value.start.getFullYear()} —— ${dateRange.value.end.getFullYear()}`;
    }
});

/**
 * 生成时间段数组
 * 月视图：以天为单位
 * 年视图：以月为单位
 * all视图：以年为单位
 */
const timeSegments = computed(() => {
    const { start, end } = dateRange.value;
    const segments = [];
    const segment = [];

    if (currentView.value === 'month') {
        // 月视图：按天生成
        const current = new Date(start);
        while (current <= end) {
            segments.push(formatDate(new Date(current)));
            segment.push(formatDates(new Date(current)));
            current.setDate(current.getDate() + 1);
        }
    } else if (currentView.value === 'year') {
        // 年视图：按月生成
        const current = new Date(start);
        while (current <= end) {
            segments.push(formatMonthYear(new Date(current)));
            segment.push(formatDates(new Date(current)));
            current.setMonth(current.getMonth() + 1);
        }
    } else {
        // all视图：按年生成
        const current = new Date(start);
        while (current <= end) {
            const year = current.getFullYear();
            segments.push(year.toString());
            segment.push(year.toString());
            segment.push(formatDates(new Date(current)));
            current.setFullYear(current.getFullYear() + 1);
        }
    }

    return { segments, segment };
});

/**
 * 切换视图模式
 */
const toggleView = (view) => {

    currentView.value = view;
};

const newSegment = ref([]);
const newSegmented = ref([]);

// 监听时间范围变化，在控制台打印时间段数组
watch(timeSegments, (newSegments) => {
    newSegment.value = newSegments.segments;
    // console.log(newSegments);
    
    const excludeDates = Object.values(newSegment.value);
    // if (currentView.value === 'all') {
    //     newSegmented.value = newSegments.segment;
    // } else {
        // newSegmented.value = newSegments.segment;
        newSegmented.value = Object.values(newSegments.segment).filter(date => {
            // 只保留不在 excludeDates 中的日期
            return !excludeDates.includes(date);
        });
    // }

    // console.log(newSegmented.value);

}, { immediate: true });

export {
    currentView,
    dateRange,
    formattedRange,
    newSegment,
    newSegmented,
    timeSegments,
    toggleView,
};