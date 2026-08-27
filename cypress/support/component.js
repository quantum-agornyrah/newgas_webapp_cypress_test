import { mount } from 'cypress/vue'
import { createPinia } from 'pinia'
import { createVuetify, useDisplay } from 'vuetify'
import { createRouter, createMemoryHistory } from 'vue-router'
import { h } from 'vue'
import { VApp } from 'vuetify/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  const vuetify = createVuetify({ components, directives })
  const pinia = createPinia()
  window.useDisplay = useDisplay

  // Dummy router example
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: 'div' } }
    ],
  })

  options.global.plugins.push(vuetify, pinia, router)

  const wrapperComponent = {
      render () {
          return h(components.VApp, null, {
              default: () => h(component, options.props || {}),
          })
      },
  }

  return mount(wrapperComponent, options)

})