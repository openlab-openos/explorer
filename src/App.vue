<script setup lang="ts">
import { getCurrentInstance, onMounted, watchEffect, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useAppOptionStore } from "@/stores/app-option";
import { ProgressFinisher, useProgress } from "@marcoschulte/vue3-progress";
import AppSidebar from "@/components/app/Sidebar.vue";
import AppHeader from "@/components/app/Header.vue";
import AppTopNav from "@/components/app/TopNav.vue";
import AppFooter from "@/components/app/Footer.vue";
// import AppThemePanel from "@/components/app/ThemePanel.vue";
import router from "./router";
import { useAppStore } from "@/stores/index";
import axios from "axios";

const appOption = useAppOptionStore();
const internalInstance = getCurrentInstance();
const appStore = useAppStore();

const progresses = [] as ProgressFinisher[];

const mediaMarginLeft = ref();


router.beforeEach(async (to, from) => {
  progresses.push(useProgress().start());
  appOption.appSidebarMobileToggled = false;
  appOption.appSidebarToggled = false;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  var targetElm = [].slice.call(
    document.querySelectorAll(".app-sidebar .menu-submenu")
  );
  targetElm.map(function (elm) {
    elm.style.display = "";
  });
});
router.afterEach(async (to, from) => {
  progresses.pop()?.finish();
});

document.querySelector("body").classList.add("app-init");

const mediaQueryString = "(min-width: 2000px)";
const medMAxstyle = "(max-width:700px)"

const mediaQueryList = window.matchMedia(mediaQueryString);
const mediaQueryStyle = window.matchMedia(medMAxstyle);

if (!mediaQueryList.matches) {
  if (mediaQueryStyle.matches) {
    mediaMarginLeft.value = '0%'
  } else {
    mediaMarginLeft.value = '12%'
  }
} else {
  mediaMarginLeft.value = '16.875rem'
}

window.onresize = () => {
  //屏幕尺寸变化就重新赋值   
  return (() => {
    if (!mediaQueryList.matches) {
      if (mediaQueryStyle.matches) {
        mediaMarginLeft.value = '0%'
      } else {
        mediaMarginLeft.value = '12%'
      }
    } else {
      mediaMarginLeft.value = '16.875rem'
    }
  })()
}



watchEffect(() => {
  if (appOption.appSidebarCollapsed) {
    mediaMarginLeft.value = ''
  } else {
    if (!mediaQueryList.matches) {
      if (mediaQueryStyle.matches) {
        mediaMarginLeft.value = '0%'
      } else {
        mediaMarginLeft.value = '12%'
      }
    } else {
      mediaMarginLeft.value = '16.875rem'
    }
  }
})
</script>

<template>
  <div class="app" v-bind:class="{
    'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
    'app-sidebar-toggled':
      appOption.appSidebarToggled && !appOption.appSidebarCollapsed,
    'app-sidebar-collapsed': appOption.appSidebarCollapsed,
    'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
    'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
    'app-content-full-height': appOption.appContentFullHeight,
    'app-content-full-width': appOption.appSidebarHide,
    'app-without-sidebar': appOption.appSidebarHide,
    'app-without-header': appOption.appHeaderHide,
    'app-boxed-layout': appOption.appBoxedLayout,
    'app-with-top-nav': appOption.appTopNav,
    'app-footer-fixed': appOption.appFooterFixed,
  }">
    <vue3-progress-bar />
    <app-header v-if="!appOption.appHeaderHide" />
    <app-top-nav v-if="appOption.appTopNav" />
    <app-sidebar v-if="!appOption.appSidebarHide" />
    <div class="appContent"  v-bind:class="appOption.appContentClass" :style="{ 'margin-left': mediaMarginLeft }">
      <router-view></router-view>
    </div>
    <app-footer v-if="appOption.appFooter" />
    <app-theme-panel />
  </div>
</template>

<style>
.appContent {
  padding: 2rem 2rem;
  transition: all 0.1s;
}
</style>