import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: "#000000", //black
          secondary: "#7A080D", //navbar red
          redBtn: '#D32129', //newgas red
          ngError: '#EC2028', //newgas red for error alerts
          banner: '#FFF8DA', //welcome banner bg
          card: '#F9EFEF', //select deposit card bg,
          lightYellow: '#F9F7EF',
          bgProfile: "#8A8A8A",
          cart: "#455A64"
        }
      }
    }
  },
})
