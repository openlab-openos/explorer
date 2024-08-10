import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [{
      'text': 'Navigation',
      'is_header': true
    }, {
      'url': '/',
      'icon': 'bi bi-house-door',
      'text': 'Dashboard',
      'type': false
    }, {
      'url': 'validators',
      'icon': 'bi bi-bar-chart',
      'text': 'Validators',
      'type': false

    }, {
      'url': 'blocks',
      'icon': 'bi bi-bar-chart',
      'text': 'Blocks',
      'type': false
    },
    {
      'url': "transactions",
      'icon': 'bi bi-bar-chart',
      'text': 'Transactions',
      'type': false

    },
    {
      'text': 'Links',
      'is_header': true
    }, {
      'url': 'https://www.openverse.network',
      'icon': 'fas fa-lg fa-fw me-2 fa-home',
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