<script setup lang="ts">
import { slideToggle } from "@/composables/slideToggle.js";
import { useAppOptionStore } from "@/stores/app-option";
import { ref, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { chainRequest } from "../../request/chain";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/index";
import i18n from "@/i18n";
import um from "../../assets/24x24/um.png"
import cn from "../../assets/24x24/cn.png"
import jp from "../../assets/24x24/jp.png"
import kr from "../../assets/24x24/kr.png"
import de from "../../assets/24x24/de.png"
import ru from "../../assets/24x24/ru.png"
import my from "../../assets/24x24/my.png"
import vn from "../../assets/24x24/vn.png"

const router = useRouter();
const appStore = useAppStore();


const appOption = useAppOptionStore();
const notificationData = [];

const searchcontent = ref("");
const abbreviationLanguage = ref();
const languages = ref([
  { name: 'English', abbreviation: 'en-US', flag: um },
  { name: '简体中文', abbreviation: 'zh-CN', flag: cn },
  { name: '日本語', abbreviation: 'jp-JP', flag: jp },
  { name: '한국어', abbreviation: 'kr-KR', flag: kr },
  { name: 'Deutsch', abbreviation: 'de-DE', flag: de },
  { name: 'русский язык', abbreviation: 'ru-RU', flag: ru },
  { name: 'Bahasa Melayu', abbreviation: 'my-MY', flag: my },
  { name: 'Việt nam', abbreviation: 'vn-VN', flag: vn },
  
]);
const selectedLanguage = ref();
const sessionStorageData = ref(JSON.parse(sessionStorage.getItem('app')));
console.log(sessionStorageData.value);

if (sessionStorageData.value) {
  languages.value.map(item => {
    console.log(item.abbreviation == sessionStorageData.value.language);
    
    if (item.abbreviation == sessionStorageData.value.language) {
      selectedLanguage.value = item;
      abbreviationLanguage.value = item.abbreviation;
      return;
    }
  });
} else {
  selectedLanguage.value = { name: 'English', abbreviation: 'en-US', flag: um };
  abbreviationLanguage.value = 'en-US';
}
console.log(selectedLanguage.value);


// 语言
function selectLanguages(indexValue) {


  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguages(appStore.$state.language);
})



function toggleAppSidebarCollapsed() {
  if (!appOption.appSidebarHide) {
    if (appOption.appSidebarCollapsed) {
      appOption.appSidebarToggled = !appOption.appSidebarToggled;
    } else if (appOption.appSidebarToggled) {
      appOption.appSidebarToggled = !appOption.appSidebarToggled;
    }
    appOption.appSidebarCollapsed = !appOption.appSidebarCollapsed;
  }
}
function toggleAppSidebarMobileToggled() {
  if (!(appOption.appTopNav && appOption.appSidebarHide)) {
    appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled;
  } else {
    slideToggle(document.querySelector(".app-top-nav"));
    window.scrollTo(0, 0);
  }
}
function toggleAppHeaderSearch(event) {
  event.preventDefault();

  appOption.appHeaderSearchToggled = !appOption.appHeaderSearchToggled;
}


function searchMenu() {
  if (searchcontent.value == "") {
  } else {
    if (searchcontent.value.length >= 45) {
      router.push({
        name: "tx",
        params: {
          item: searchcontent.value,
        },
      });
      searchcontent.value = "";
      // window.location.reload()
    } else {
      router
        .push({
          name: "address",
          params: {
            url: searchcontent.value,
          },
        })
        .then(() => {
          searchcontent.value = "";
          // window.location.reload()

        });
    }
  }
}

const selectLanguage = (language, abbreviation) => {
  selectedLanguage.value = language;
  abbreviationLanguage.value = abbreviation;
  appStore.setLanguage(abbreviation);

};

</script>
<template>
  <div id="header" class="app-header">
    <!-- BEGIN desktop-toggler -->
    <div class="desktop-toggler">
      <button type="button" class="menu-toggler" v-on:click="toggleAppSidebarCollapsed">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <div class="mobile-toggler">
      <button type="button" class="menu-toggler" v-on:click="toggleAppSidebarMobileToggled">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- END mobile-toggler -->

    <!-- BEGIN brand -->
    <div class="brand">
      <RouterLink to="/" class="brand-logo">
        <!-- <span class="brand-img">
          <span class="brand-img-text text-theme">H</span>
        </span> -->
        <img width="20" src="https://cdn.openverse.network/brands/openverse/icon_128.png" alt="">
        <span class="brand-text titleBox">OPENVERSE <span class="marks">LIVE</span> </span>
      </RouterLink>
    </div>
    <!-- END brand -->

    <!-- BEGIN menu -->
    <div class="menu">
      <div style="width: 100%">
        <div style="width: 100%">
          <div class="menu-search-container" style="
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            ">

            <div class="menu-search-input" style="width: 80%">
              <input type="text" :placeholder="$t('placehold')" v-model="searchcontent" @keyup.enter="searchMenu" style="
                  border: none;
                  margin: 10px;
                  width: 100%;
                  outline: none;
                  height: 30px;
                  border-radius: 5px;
                  padding: 5px;
                " />
            </div>
            <div class="menu-search-icon" style="margin-left: 20px;cursor: pointer;" @click="searchMenu"><i
                class="bi bi-search"></i>
            </div>
          </div>
        </div>

      </div>

      <div class="menu-item dropdown dropdown-mobile-full" style="width: 20%; justify-content: end;">
        <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link scales">
          <img :src="selectedLanguage.flag" class="deopdownImage" alt="">
          <div
            style="cursor: pointer; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;display: flex;align-items: center;flex-wrap: wrap;">
            {{ selectedLanguage.name }} </div>
          <i class="bi bi-chevron-down" style="margin: 5px;"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <div class="dropdown-item align-items-center" v-for="(language, index) in languages" :key="index"
            :class="{ 'text-theme': abbreviationLanguage === language.abbreviation }"
            style="cursor: pointer; text-align: center;display: flex;justify-content: center;" @click="selectLanguage(language, language.abbreviation)">
            <div style="width: 30%;">
              <img :src="language.flag" alt="">
            </div>
            <div style="width: 60%;text-align: left;" >
              {{ language.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- 节点切换 -->
      <div class="menu-item dropdown dropdown-mobile-full" style="min-width: 10%;" >
        <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link scales">
          Openverse Mainnet
          <i class="bi bi-chevron-down" style="margin: 5px;"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <div class="dropdown-item align-items-center text-theme" style="cursor: pointer;text-align: center;">Openverse
            Mainnet
          </div>
          <div style="text-align: center;padding: 6px 16px;">Openverse Devnet</div>
          <div style="text-align: center;padding: 6px 16px;">Openverse Testnet </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.titlBox {
  position: relative;
}

.marks {
  position: absolute;
  top: 10px;
  font-size: 9px;
  background-color: rgb(254, 38, 38);
  border-radius: 4px;
  padding: 0px 4px;
}

.scales {
  transform: scale(1);
  text-align: center;
  padding: 6px 26px;
}

.deopdownImage {
  margin: 10px;
}

@media (max-width: 768px) {
  .scales {
    transform: scale(0.6);
    text-align: center;
    padding: 0 !important;
  }

  .deopdownImage {
    display: none;
  }
}
</style>