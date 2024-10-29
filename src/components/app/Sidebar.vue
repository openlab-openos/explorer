<template>
  <div id="sidebar" class="app-sidebar">
    <perfect-scrollbar class="app-sidebar-content">
      <div class="menu">
        <template v-for="(menu, index) in navigationArray" :key="index">
          <div class="menu-header" v-if="menu.is_header">{{ $t(menu.text)  }}</div>
          <div class="menu-divider" v-else-if="menu.is_divider"></div>
          <template v-else>
            <div v-if="!menu.type" class="menu-item" :class="{ active: isActive(menu.url) }"
              :style="{ display: Number(index) ? 'block' : 'none' }">
              <router-link :to="{ name: menu.url === '/' ? 'dashboard' : menu.url }" class="menu-link">
                <span class="menu-icon">
                  <i class="menu-icon" :class="menu.icon"></i>
                </span>
                <!-- <span class="menu-text">{{ $t( "navigation.validators" ) }}</span> -->
                <span class="menu-text">{{ $t(menu.text) }}</span>
                <!-- <span class="menu-text">{{ menu.text }}</span> -->
              </router-link>
            </div>
            <div v-if="menu.type" class="menu-item">
              <a :href="menu.url" class="menu-link arrs" target="_blank">
                <span class="menu-icon">
                  <i class="menu-icon" :class="menu.icon"></i>
                </span>
                <span class="menu-text">{{ menu.text }}</span>
              </a>
            </div>
          </template>
        </template>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script setup>
import { useAppSidebarMenuStore } from "@/stores/app-sidebar-menu";
import { useAppOptionStore } from "@/stores/app-option";
import { onMounted, computed,watchEffect,ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/index";
import i18n from "@/i18n";


const navigationArray = ref([]);

const appSidebarMenu = useAppSidebarMenuStore();
for(let i in appSidebarMenu){
  if(appSidebarMenu[i].text){
    navigationArray.value.push(appSidebarMenu[i]);
  }
}


const appOption = useAppOptionStore();
const appStore = useAppStore();
const route = useRoute();

function appSidebarMobileToggled() {
  appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled;
}

  // 语言
  function selectLanguage(indexValue) {
    i18n.global.locale = indexValue;
  }

  watchEffect(() => {
    selectLanguage(appStore.$state.language);
  })
  // selectLanguage('en-US');


onMounted(() => {
  const handleSidebarMenuToggle = function (menus) {
    menus.forEach(function (menu) {
      menu.onclick = function (e) {
        e.preventDefault();
        const target = this.nextElementSibling;

        menus.forEach(function (m) {
          const otherTarget = m.nextElementSibling;
          if (otherTarget !== target) {
            otherTarget.style.display = "none";
            otherTarget.closest(".menu-item").classList.remove("expand");
          }
        });

        const targetItemElm = target.closest(".menu-item");

        if (
          targetItemElm.classList.contains("expand") ||
          (targetItemElm.classList.contains("active") && !target.style.display)
        ) {
          targetItemElm.classList.remove("expand");
          target.style.display = "none";
        } else {
          targetItemElm.classList.add("expand");
          target.style.display = "block";
        }
      };
    });
  };

  const menuBaseSelector = ".app-sidebar .menu > .menu-item.has-sub";
  const submenuBaseSelector = " > .menu-submenu > .menu-item.has-sub";

  // menu
  const menuLinkSelector = menuBaseSelector + " > .menu-link";
  const menus = Array.from(document.querySelectorAll(menuLinkSelector));
  handleSidebarMenuToggle(menus);

  // submenu lvl 1
  const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
  const submenusLvl1 = Array.from(
    document.querySelectorAll(submenuLvl1Selector + " > .menu-link")
  );
  handleSidebarMenuToggle(submenusLvl1);

  // submenu lvl 2
  const submenuLvl2Selector =
    menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
  const submenusLvl2 = Array.from(
    document.querySelectorAll(submenuLvl2Selector + " > .menu-link")
  );
  handleSidebarMenuToggle(submenusLvl2);
});

const isActive = computed(() => (url) => {
  return url === '/' ? route.path === '/' : route.path === '/' + url;
});
</script>

<style scoped>
/* 添加你的样式 */
</style>