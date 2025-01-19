import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [{
      'text': 'navigation.title',
      'is_header': true
    }, {
      'url': '/',
      'icon': 'bi bi-house-door',
      'text': 'navigation.dashboard',
      'type': false
    }, {
      'url': "assets",
      'icon': 'bi bi-x-diamond',
      'text': 'navigation.tokens',
      'type': false
    }, {
      'url': 'validators',
      'icon': 'bi bi-columns-gap',
      'text': 'navigation.validators',
      'type': false

    }, {
      'url': 'blocks',
      'icon': 'bi bi-bar-chart',
      'text': 'navigation.blocks',
      'type': false
    },
    {
      'url': "transactions",
      'icon': 'bi bi-layout-sidebar',
      'text': 'navigation.transactions',
      'type': false

    },

    {
      'text': 'navigation.links',
      'is_header': true
    }, {
      'url': 'https://www.openverse.network',
      'icon': 'bi bi-grid',
      'text': 'navigation.website',
      'type': true
    }, {
      'url': 'https://uu.cool/',
      'icon': 'bi bi-credit-card fa-fw fa-lg',
      'text': 'navigation.wallet',
      'type': true
    }, {
      'url': 'https://download.openverse.network/',
      'icon': 'bi bi-file-text',
      'text': 'navigation.document',
      'type': true
    }, {
      'url': 'https://docs.openos.info/',
      'icon': 'bi bi-person-square',
      'text': 'developer',
      'type': true
    }, {
      'url': 'https://github.com/orgs/openlab-openos/repositories',
      'icon': 'bi bi-github',
      'text': 'Github',
      'type': true
    }
    ]
  }
});