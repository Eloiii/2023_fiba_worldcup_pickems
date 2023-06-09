/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#FF6EC7',
          secondary: '#F8C8DC',
        },
      },
      dark: {
        colors: {
          primary: '#fffe3e',
          secondary: '#F8C8DC',
        },
      },
    },
  },
})
