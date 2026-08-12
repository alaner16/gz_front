import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import './registerServiceWorker'
import EventBus from '@/plugins/bus'
if(screen.width>560){
  import('primevue/resources/themes/mdc-dark-indigo/theme.css')
}else{
  import('primevue/resources/themes/mdc-light-indigo/theme.css')
}
import('primevue/resources/primevue.min.css')
import('primeicons/primeicons.css')
import VueGtag from "vue-gtag";
import VUppercase from 'v-uppercase'
Vue.use(VUppercase)
Vue.use(VueGtag, {
  config: { id: 'G-77MD3W5JDS' },
  appName: 'GamezoneApp',
  pageTrackerScreenviewEnabled: true
});
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
Vue.use(EventBus)
