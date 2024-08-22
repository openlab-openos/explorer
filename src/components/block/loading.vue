<template>
    <div class="loading">
        <div class="wave-loading">
            <span style="--time:1">l</span>
            <span style="--time:2">o</span>
            <span style="--time:3">a</span>
            <span style="--time:4">d</span>
            <span style="--time:5">i</span>
            <span style="--time:6">n</span>
            <span style="--time:7">g</span>
            <span style="--time:8">.</span>
            <span style="--time:9">.</span>
            <span style="--time:10">.</span>
        </div>
    </div>
</template>

<style scoped>
.loading {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
}

.wave-loading {
    width: 400px;
    height: 100px;
    /* position: absolute; */
    
    /* left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); */
}

.wave-loading span {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    animation: wave-loading 1s ease-in-out infinite;
    animation-delay: calc(0.1s * var(--time));
}

@keyframes wave-loading {
    0% {
        transform: translateY(0px);
    }

    25% {
        transform: translateY(-20px);
    }

    50%,
    100% {
        transform: translateY(0px);
    }
}
</style>