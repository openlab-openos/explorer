<template>
    <div class="popover-container w-100" @mouseover="showPopover" @mouseout="hidePopover">
        <div :class="justifyClass">
            <slot></slot>
            <img src="../assets/mark.png" width="20" style="margin: 0px 10px;" alt="">
            <!-- <HelpCircle class="ms-2" size="13" /> -->
        </div>
        <Popover :bottom="bottom" :right="right" :state="state" :text="text" />
    </div>
</template>

<script>
import { ref } from 'vue';
import Popover from './Popover.vue';

// import { HelpCircle } from 'vue-feather-icons';

export default {
    name: 'InfoTooltip',
    components: {
        Popover,
        // HelpCircle
    },
    props: {
        text: {
            type: String,
            required: true
        },
        bottom: {
            type: Boolean,
            default: false
        },
        right: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const state = ref('hide');

        const showPopover = () => {
            state.value = 'show';
        };

        const hidePopover = () => {
            state.value = 'hide';
        };

        return {
            state,
            showPopover,
            hidePopover
        };
    },
    computed: {
        justifyClass() {
            return `d-flex align-items-center justify-content-${this.right ? 'end' : 'start'}`;
        }
    }
};
</script>

<style scoped>
.popover-container {
    position: relative;
}
</style>