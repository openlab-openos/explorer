<template>
    <div v-if="state === 'show'" :class="popoverClass">
        <div :class="arrowClass"></div>
        <div class="popover-body">{{ text }}</div>
    </div>
</template>

<script>
export default {
    name: 'Popover',
    props: {
        state: {
            type: String,
            required: true,
            validator: value => ['hide', 'show'].includes(value)
        },
        bottom: {
            type: Boolean,
            default: false
        },
        right: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            required: true
        }
    },
    computed: {
        popoverClass() {
            return `popover bs-popover-${this.bottom ? 'bottom' : 'top'}${this.right ? ' right' : ''} show`;
        },
        arrowClass() {
            return `arrow${this.right ? ' right' : ''}`;
        }
    }
};
</script>

<style scoped>
.popover {
    position: absolute;
    z-index: 1070;
    display: block;
    max-width: 276px;
    font-family: var(--bs-font-sans-serif);
    font-style: normal;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    white-space: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: break-word;
    font-size: 0.875rem;
    background-color: var(--bs-popover-bg);
    background-clip: padding-box;
    border: 1px solid var(--bs-popover-border-color);
    border-radius: 0.375rem;
}

.arrow {
    position: absolute;
    display: block;
    width: 1rem;
    height: 0.5rem;
}
</style>