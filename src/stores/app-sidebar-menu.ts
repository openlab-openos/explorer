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
      'text': 'Links',
      'is_header': true
    }, {
      'url': 'https://www.openverse.network',
      'icon': 'bi bi-grid',
      'text': 'Openverse.Network',
      'type': true
    }, {
      'url': 'https://uu.cool/',
      'icon': 'bi bi-credit-card fa-fw fa-lg',
      'text': 'UU.COOL',
      'type': true
    }
    ]
  }
});