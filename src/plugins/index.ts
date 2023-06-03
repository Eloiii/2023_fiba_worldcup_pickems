/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import {loadFonts} from './webfontloader'
import vuetify from './vuetify'
import router from '../router'
import {VueFire, VueFireAuth} from 'vuefire'
// @ts-ignore
import {firebaseApp} from "../../firebaseConfig";

// Types
import type {App} from 'vue'

export function registerPlugins(app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(VueFire, {
      firebaseApp,
      modules: [
        VueFireAuth(),
      ]
    })
}
