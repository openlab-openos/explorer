<template>
    <div class="box-card">
        <div class="cards  marginTOP-50" v-for="item, index in list" :key="index">
            <div class="cards-image">
                <img  :src="item.imgLogo" alt="">
            </div>
            <div class="cards-text">
                <h5>{{ item.titile }}</h5>
                <br>
                <text>{{ item.content }}</text>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

import stable from '../../../../assets/assetsLogo/stable.png';
import unknown from '../../../../assets/assetsLogo/unknown.png';
import unsafe from '../../../../assets/assetsLogo/unsafe.png';
import vrc10 from '../../../../assets/assetsLogo/vrc10.png';
import vrc11 from '../../../../assets/assetsLogo/vrc11.png';
import vrc12 from '../../../../assets/assetsLogo/vrc12.png';
import vrc20 from '../../../../assets/assetsLogo/vrc20.png';
import { tokenList } from './request.js';

const props = defineProps({
    url: {
        typeof: String,
        default: ''
    }
})

const cardData = ref([])


const tokenType = ref([
    {
        titile: 'Token Reputation: OFFICIAL',
        content: 'Certified by the Openverse team, this project was released by the official team.',
        // imgLogo: vrc20,
        type: 'vrc20'
    },
    {
        titile: 'Special Token:USD StableCoin',
        content: 'Openverse Team Endorses the Project as a Stablecoin Anchored to the U.S. Dollar.',
        // imgLogo: stable,
        type: 'stable'
    },
    {
        titile: 'Token Reputation: UNSAFE',
        content: 'The Openverse team has certified that the program is not safe.',
        // imgLogo: unsafe,
        type: 'unsafe'
    },
    {
        titile: 'Special Token:VRC12',
        content: 'The Openverse team recognizes that the project meets the VRC12 protocol standards.',
        // imgLogo: vrc12,
        type: 'vrc12'
    },
    {
        titile: 'Special Token:VRC10',
        content: 'The Openverse team recognizes that the project meets the VRC10 protocol standards.',
        // imgLogo: vrc10,
        type: 'vrc10'
    },
    {
        titile: 'Special Token:VRC11',
        content: 'The Openverse team recognizes that the project meets the VRC11 protocol standards.',
        // imgLogo: vrc11,
        type: 'vrc11'
    },
    {
        titile: 'Token Reputation:Unknown',
        content: 'The Openverse team did not adequately verify the program.',
        // imgLogo: unknown,
        type: 'unknown'
    },
]);

const list = ref([])

tokenList(props.url).then(res => {

    cardData.value = res.data.certificates
    for (let i in cardData.value) {
        for (let j in tokenType.value) {
            if (cardData.value[i].certificate_code == tokenType.value[j].type) {
                list.value.push({
                titile:tokenType.value[j].titile,
                content:tokenType.value[j].titile,
                type:tokenType.value[j].type,
                imgLogo:cardData.value[i].image_url,
                })
                // list.value.push(tokenType.value[j])
            }
        }
    }

}).catch(error => {
});

</script>

<style scoped>
.box-card {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.cards {
    width: 45%;
    min-width: 500px;
    height: 9rem;
    border: 1px solid #5A5C64;
    display: flex;
}

.marginTOP-50 {
    margin-top: 50px;
}

@media (max-width: 1220px) {
    .cards {
        width: 100%;
    }
}

.cards-image {
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center
}

.cards-image img {
    /* height: 4rem; */
    width: 5rem;
}

.cards-text {
    padding: 1.5rem;
}
</style>