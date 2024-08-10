<script setup lang="ts">
import { slideToggle } from "@/composables/slideToggle.js";
import { useAppOptionStore } from "@/stores/app-option";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { chainRequest } from "../../request/chain";
import { useRouter } from "vue-router";

const router = useRouter();

const appOption = useAppOptionStore();
const notificationData = [];

const searchcontent = ref("");

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

async function requestList(object) {
  try {
    const response = await chainRequest(object);
    // 解析和处理返回的数据
    return response.result; // 现在这个函数会返回解析后的数据
  } catch (error) {
    console.error("Error fetching epoch info:", error);
    return []; // 返回一个空数组或抛出错误取决于你的需求
  }
}

Account();
async function Account() {
  let requestBody = {
    id: "35a5860e-2564-4b92-890d-dc57e9c58d75",
    jsonrpc: "2.0",
    method: "getProgramAccounts",
    params: [
      "Config1111111111111111111111111111111111111",
      {
        commitment: "processed",
        encoding: "jsonParsed",
      },
    ],
  };
  let ClusterNodes = {
    id: "d9080c36-8a4d-494f-8a5e-1ba06815e912",
    jsonrpc: "2.0",
    method: "getClusterNodes",
    params: [],
  };
  let VoteAccounts = {
    id: "35a5860e-2564-4b92-890d-dc57e9c58d75",
    jsonrpc: "2.0",
    method: "getVoteAccounts",
    params: [],
  };
  let ClusterNodes_list = await requestList(requestBody);
  let ProgramAccounts_list = await requestList(ClusterNodes);
  let VoteAccounts_list = await requestList(VoteAccounts);
  let list = [];
  for (let i in ProgramAccounts_list) {
    for (let j in ClusterNodes_list) {
      if (ClusterNodes_list[j].account.data.parsed) {
        for (let y in ClusterNodes_list[j].account.data.parsed.info.keys) {
          if (
            ClusterNodes_list[j].account.data.parsed.info.keys[y].signer == true
          ) {
            if (
              ProgramAccounts_list[i].pubkey ==
              ClusterNodes_list[j].account.data.parsed.info.keys[y].pubkey
            ) {
              list.push({
                ip: ProgramAccounts_list[i].gossip.split(":")[0],
                name: ClusterNodes_list[j].account.data.parsed.info.configData
                  .name,
                pubkey: ProgramAccounts_list[i].pubkey,
                icon: ClusterNodes_list[j].account.data.parsed.info.configData
                  .iconUrl,
                activatedStake: "",
              });
            }
          }
        }
      }
    }
  }
  return list;
}

const filter = (condition, data) => {
  return data.filter((item) => {
    return Object.keys(condition).every((key) => {
      return String(item[key])
        .toLowerCase()
        .includes(String(condition[key]).trim().toLowerCase());
    });
  });
};

async function searchMenu() {
  if (searchcontent.value == "") {
  } else {
    if (searchcontent.value.length >= 45) {
      router.push({
        name: "tx",
        params: {
          item: searchcontent.value,
        },
      });
    } else {
      let data = await Account();
      let end = filter(
        {
          pubkey: searchcontent.value,
        },
        data
      );
      if (end.length == 0) {
      } else {
        router
          .push({
            name: "阿ddress",
            params: {
              url: end[0].pubkey,
            },
          })
          .then(() => {
            searchcontent.value = "";
          });
      }
    }
  }
}

const openNewWindow = () => {
  window.open("https://www.openverse.network")
}
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
            <div class="menu-search-icon"><i class="bi bi-search"></i></div>
            <div class="menu-search-input" style="width: 80%">
              <input type="text" placeholder="Search Address Account Transaction" v-model="searchcontent"
                @keyup.enter="searchMenu" style="
                  border: none;
                  margin: 10px;
                  width: 100%;
                  outline: none;
                  height: 30px;
                  border-radius: 5px;
                  padding: 5px;
                " />
            </div>
          </div>
        </div>
      </div>
      <div class="menu-item dropdown dropdown-mobile-full" style="width: 20%">
        <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
          Openverse Mainnet
          <i class="bi bi-chevron-down" style="margin: 5px;"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <div class="dropdown-item d-flex align-items-center text-theme">Openverse Mainnet</div>
          <div class="dropdown-item d-flex align-items-center">Openverse Devnet</div>
          <div class="dropdown-item d-flex align-items-center">Openverse Testnet </div>
        </div>
      </div>
      <!-- <div class="menu-item dropdown dropdown-mobile-full phone-show">
        <a href="#" @click="openNewWindow" class="menu-link" title="Openverse Network">
          <div class="menu-img online">
            <div
              class="d-flex align-items-center justify-content-center w-100 h-100 bg-opacity-25 text-inverse text-opacity-50 rounded-circle overflow-hidden">
              <i class="fas fa-lg fa-fw me-2 fa-home"></i>
              <p>meta nate home</p>
            </div>
          </div>
        </a>
      </div> -->
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
</style>