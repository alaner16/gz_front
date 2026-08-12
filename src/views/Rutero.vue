<template>
  <v-app light>
    <v-navigation-drawer v-model="drawer" app>
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
      <v-icon @click="drawer=!drawer">mdi-menu</v-icon>
      <b class="ma-auto">{{$route.meta.title}}</b>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Limpieza de la semana
          </v-card-title>
          <v-card-text>¿Está seguro que desea eliminar todo el historial de subidas?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="danger darken-1"
              text
              @click="dialog = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="borrarSubidos(); dialog = false"
            >
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import idb from '@/service/idb'
import Menu from '@/components/Menu'
import Offline from "../components/Conectivity";
export default {
  name: 'VistaRutero',
  components: {
    Menu,
    Offline
  },
  data () {
    return {
      drawer: true,
      version: version,
      dialog: false,
      usuario: JSON.parse(sessionStorage.getItem('data')),
    }
  },
  mounted(){ 
    this.validadUsuario();
  },
  methods:{
    async borrarSubidos(){
      await idb.delete(null, 'salesUploaded', true)
      location.reload()
    },
    validadUsuario : function(){ 
      // let asesor1 = JSON.parse(sessionStorage.getItem('sesion'))   
      if(!this.usuario){
          window.location.href ='/'
      }
    },
  }
}
</script>
