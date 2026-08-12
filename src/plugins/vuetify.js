import Vue from 'vue';
import Vuetify from 'vuetify/lib'
import es from 'vuetify/es5/locale/es'
//import sv from './i18n/vuetify/sv'
import colors from 'vuetify/lib/util/colors'
import tema from '../service/tema'
Vue.use(Vuetify, {
    iconfont: 'mdi'
});

export default new Vuetify({
  // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: tema.getTema(),
      themes: {
        light: {
          primary: '#0D519D',
          secondary: colors.grey.darken1,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
        dark: {
          primary: colors.blue.lighten3,
        },
      },
    },
    lang: {
      locales: { es },
      current: 'es'
    },
    customProperties: true,
});
