<script setup lang="ts">
import {
  nextTick,
  ref,
  watch,
  watchEffect,
} from 'vue';

import {
  RouterLink,
  useRoute,
  useRouter,
} from 'vue-router';

import i18n from '@/i18n';
import { useAppStore } from '@/stores/index';

const appStore = useAppStore();
const isExpandedFunction = ref(true);

const route = useRoute();
const router = useRouter();
const expandedMenus = ref<Set<string>>(new Set());

const props = defineProps<{
  menu: {
    icon?: string;
    text: string;
    url: string;
    highlight?: boolean;
    children?: Record<string, unknown>[];
    key?: number;
    img?: string;
    checkedImg?: string;
    type?: boolean;
  };
}>();

const newRouteText = ref();
watch(
  () => route,
  (newRoute) => {
    newRouteText.value = newRoute.name;
    if (props.menu.children) {
      isExpandedFunction.value = subIsActive(props.menu.children);
    } else {
      isExpandedFunction.value = false;
    }
  },
  { deep: true },
);

watch(
  () => appStore.activeTab,
  (newTab) => {
    if (newTab) {
      newRouteText.value = newTab;
      if (props.menu.children) {
        isExpandedFunction.value = subIsActive(props.menu.children);
      }
    }
  },
);

function selectLanguage(indexValue: string) {
  i18n.global.locale = indexValue;
}

watchEffect(() => {
  selectLanguage(appStore.$state.language);
});

watch(
  () => route.path,
  () => {
    expandedMenus.value = new Set();
    nextTick(() => {
      if (props.menu.url == route.name) {
        isExpandedFunction.value = true;
      } else {
        isExpandedFunction.value = false;
      }
    });
  },
  { immediate: false },
);

// function subIsActive(urls: { url?: string }[]) {
//   const currentRoute = route.name;
//   return urls.some((item) => item.url && currentRoute.includes(item.url));
// }

function subIsActive(urls: { url?: string }[]) {
  const currentRoute = route.name;
  const currentTab = appStore.activeTab;

  if (props.menu.url == currentRoute) {
    return true;
  } else {
    return urls.some((item) => {
      if (!item.url) return false;
      if (currentRoute && currentRoute.includes(item.url)) return true;
      if (currentTab && currentTab === item.url) return true;
      return false;
    });
  }
}

function isActive(url?: string) {
  if (!url) return false;
  return url === "/" ? route.path === "/" : route.path.includes(url);
}

function getText(text?: string): string {
  return text || "";
}

function handleSubmenuClick(
  submenu: Record<string, unknown>,
  parentMenu: Record<string, unknown>,
) {
  const url = submenu.url as string;
  const tabType = parentMenu.tabType;
  
  if (url && !submenu.type) {
    if (tabType) {
      appStore.activeTab = url;
    }
  }
}

function toggleExpand(
  menuText: string,
  children?: Record<string, unknown>[],
  menu?: Record<string, unknown>,
) {
  isExpandedFunction.value = !isExpandedFunction.value;

  if (expandedMenus.value.has(menuText)) {
    expandedMenus.value.delete(menuText);
  } else {
    expandedMenus.value.add(menuText);
    if (children && children.length > 0 && menu?.tabType) {
      const firstChild = children[0] as { url?: string; type?: boolean };
      if (firstChild.url && !firstChild.type) {
        appStore.activeTab = 'All';
        nextTick(() => {
          router.push({
            name: firstChild.url === "/" ? "dashboard" : menu.url,
          });
        });
      }
    }
  }
  expandedMenus.value = new Set(expandedMenus.value);
}
function isExpanded(menuText: any): boolean {
  return menuText.children && menuText.children.length > 0;
}
</script>

<template>
  <div
    v-if="menu.children && menu.children.length > 0"
    class="menu-item has-sub"
    :class="{ active: subIsActive(menu.children), expand: isExpanded(menu) }"
  >
    <a
      href="javascript:;"
      class="menu-link"
      @click="toggleExpand(menu.text, menu.children, menu)"
    >
      <!-- <img
        v-if="menu.img"
        :src="subIsActive(menu.children) ? menu.checkedImg : menu.img"
        width="20"
        alt=""
      /> -->
      <img
        v-if="menu.img"
        :src="isExpandedFunction ? menu.checkedImg : menu.img"
        width="20"
        alt=""
      />
      &nbsp;
      <!-- <span
        class="menu-text"
        :class="subIsActive(menu.children) ? 'text-theme' : ''"
        >{{ $t(menu.text) }}</span
      > -->
      <span class="menu-text" :class="isExpandedFunction ? 'text-theme' : ''">{{
        $t(menu.text)
      }}</span>
      <span class="menu-caret"><b class="caret"></b></span>
    </a>
    <div v-if="isExpandedFunction" class="menu-submenu">
      <!-- <div class="menu-submenu"> -->
      <template v-for="(submenu, index) in menu.children" :key="index">
        <div
          v-if="!(submenu as { type?: boolean }).type"
          class="menu-item menu-item-parent"
          :class="{ active: isActive((submenu as { url?: string }).url) }"
          @click="handleSubmenuClick(submenu, menu)"
        >
          <img
            v-if="(submenu as { img?: string }).img"
            :src="
              (submenu as { url?: string }).url == newRouteText
                ? (submenu as { checkedImg?: string }).checkedImg
                : (submenu as { img?: string }).img
            "
            width="20"
            alt=""
          />
          &nbsp;
          <span
            class="menu-text"
            :class="
              (submenu as { url?: string }).url == newRouteText
                ? 'text-theme'
                : ''
            "
            >{{ $t(getText((submenu as { text?: string }).text)) }}</span
          >
        </div>
        <div v-else class="menu-item">
          <a
            :href="(submenu as { url?: string }).url"
            class="menu-link"
            target="_blank"
          >
            <img
              v-if="(submenu as { img?: string }).img"
              :src="(submenu as { img?: string }).img"
              width="20"
              alt=""
            />
            &nbsp;
            <span class="menu-text">{{
              $t(getText((submenu as { text?: string }).text))
            }}</span>
          </a>
        </div>
      </template>
    </div>
  </div>

  <router-link
    v-else
    :to="{ name: menu.url === '/' ? 'dashboard' : menu.url }"
    custom
    v-slot="{ navigate, href, isActive }"
  >
    <div class="menu-item" :class="{ active: isActive }">
      <a :href="href" @click="navigate" class="menu-link">
        <img
          v-if="menu.img"
          :src="isActive ? menu.checkedImg : menu.img"
          width="20"
          alt=""
        />
        &nbsp;
        <span class="menu-text" :class="isActive ? 'text-theme' : ''">{{
          $t(getText(menu.text))
        }}</span>
      </a>
    </div>
  </router-link>
</template>

<style scoped>
.menu-text {
  font-size: 12px !important;
}
.menu-item-parent {
  padding: 0.2rem 0;
  cursor: pointer;
}
</style>
