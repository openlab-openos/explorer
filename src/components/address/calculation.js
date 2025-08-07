import { ref, computed, watch } from 'vue';

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
function formatDate(date) {
    const month = months[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const year = date.getFullYear();
    // return `${month} ${day}${suffix}, ${year}`;
    return `${month} ${day}${suffix}`;
}
function formatDates(date) {
    const month = months[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const year = date.getFullYear();
    return `${month} ${day}${suffix}, ${year}`;
    // return `${month} ${day}${suffix}`;
}

/**
 * 计算时间范围
 */
const dateRange = computed(() => {
    const now = new Date();

    if (currentView.value === 'month') {
        // 月视图：过去20天至未来10天
        const start = new Date(now);
        start.setDate(start.getDate() - 20);

        const end = new Date(now);
        end.setDate(end.getDate() + 10);

        return { start, end };
    } else {
        // 年视图：过去8个月至未来4个月
        const start = new Date(now);
        start.setMonth(start.getMonth() - 8); // 过去8个月

        const end = new Date(now);
        end.setMonth(end.getMonth() + 4); // 未来4个月

        return { start, end };
    }
});

/**
 * 格式化显示的时间范围
 */
const formattedRange = computed(() => {
    return `${formatDate(dateRange.value.start)} —— ${formatDate(dateRange.value.end)}`;
});

/**
 * 生成时间段数组
 * 月视图：以天为单位
 * 年视图：以月为单位
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
            // current.setDate(current.getDate() + 1);
        }
    } else {
        // 年视图：按月生成
        const current = new Date(start);
        while (current <= end) {
            const year = current.getFullYear();
            const month = months[current.getMonth()];
            // segments.push(`${month} ${year}`);
            // segment.push(`${month} ${year}`);
            segments.push(formatDate(new Date(current)));
            segment.push(formatDates(new Date(current)));
            current.setMonth(current.getMonth() + 1);
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
    console.log(newSegments);

    newSegment.value = newSegments.segments;
    newSegmented.value = newSegments.segment;
    console.log(newSegmented.value);

}, { immediate: true });

export { currentView, toggleView, timeSegments, formattedRange, newSegment, dateRange, newSegmented };