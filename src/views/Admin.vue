<template>
  <v-app >
    <v-navigation-drawer v-model="menu" app>
      <Menu />
      <v-footer padless bottom absolute>
        <v-col
          class="text-center"
        >
          ZEE corp. — <strong>v{{version}}</strong>
        <Offline/>
        </v-col>
      </v-footer>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-icon @click="menu=!menu">mdi-menu</v-icon>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <router-view />

      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import {version} from '../../package'
import Menu from '@/components/Menu'
import Offline from "../components/Conectivity";
export default {
  name: 'Admin',
  components: {
    Menu,
    Offline
  },
  data () {
    return {
      menu: true,
      version:version,
      usuario: JSON.parse(sessionStorage.getItem('sesion')),
    }
  },
  mounted(){ 
    this.validadUsuario();
  },
  methods: {
    validadUsuario : function(){ 
      // let asesor1 = JSON.parse(sessionStorage.getItem('sesion'))   
      if(!this.usuario){
          window.location.href ='/'
      }
    },
  }
}
</script>
