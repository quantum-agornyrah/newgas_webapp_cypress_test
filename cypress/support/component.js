import { mount } from 'cypress/vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createRouter, createMemoryHistory } from 'vue-router'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Create a single Vuetify instance for component tests
const vuetify = createVuetify({ components, directives })

Cypress.Commands.add('mount', (component, options = {}) => {
  // Create a fresh Pinia instance per test to isolate state
  const pinia = createPinia()

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div></div>' } }
    ],
  })

  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []
  options.global.plugins.push(vuetify, pinia)

  return mount(component, options)
})