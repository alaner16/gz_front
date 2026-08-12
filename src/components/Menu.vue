<template>
  <div>
    <v-img class="ma-5" src="../assets/GZ.png"></v-img>
    <v-list >
      <v-list-item v-for="ruta in (tipo?rutas:routes)" link :to="{name:ruta.name}" router exact :key="ruta.id" v-show="usuario.role==0?true:ruta.permiso">
        <v-list-item-icon><v-icon>{{ruta.icon}}</v-icon></v-list-item-icon>
        <v-list-item-content><v-list-item-title class="text-left">{{ruta.title}}</v-list-item-title></v-list-item-content>
      </v-list-item>
      <v-list-group v-show="tipo"
        :value="false"
        prepend-icon="mdi-folder"
      >
        <template v-slot:activator>
          <v-list-item-title>Catálogos</v-list-item-title>
        </template>

        <v-list-item
          v-for="(ruta, i) in subrutas"
          :key="i"
          link
          :to="{name:ruta.name}"
        >
          <v-list-item-title v-text="ruta.tittle"></v-list-item-title>
        </v-list-item>
      </v-list-group>
      <v-list-item @click="logOut">
        <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
        <v-list-item-content><v-list-item-title class="text-left">Cerrar sesíon</v-list-item-title></v-list-item-content>
      </v-list-item>
      
    </v-list>
  </div>
</template>
<script>
import {version} from '../../package'
export default {
  name: 'Menu',
    data() {
      return{
        version:version,
        drawer: true,
        // sesion: JSON.parse(sessionStorage.getItem('sesion')),
        ruta: this.$route.path,
        tipo:0,
        usuario: JSON.parse(sessionStorage.getItem('data')),
        rutas:[
          {
            name: 'Dashboard',
            icon: 'mdi-home',
            title:'Inicio',
            id:1,
            permiso:1
          },
          // {
          //   name: 'Registro',
          //   icon: 'mdi-plus-box-multiple',
          //   title:'Registro',
          //   id:2,
          //   permiso:1
          // }, 
          {
            name: 'Reportes',
            icon: 'mdi-chart-box',
            title:'Reportes',
            id:3,
            permiso:1
          },
          // {
          //   name:'Catalogo',
          //   title: 'Catalogos',
          //   icon: 'mdi-database',
          //   id:50,
          //   permiso:1
          // },
          {
            name: 'ruMovimientos',
            icon: 'mdi-cellphone-information',
            title:'Vista Rutero',
            id:4,
            permiso:1
          }, 
        ],
        routes:[
          // {
          //   name: 'inicio',
          //   icon: 'mdi-home',
          //   title:'Inicio',
          //   id:9,
          //   permiso:1
          // },
          {
            name: 'ruMovimientos',
            icon: 'mdi-cash-multiple',
            title:'Movimientos',
            id:5,
            permiso:1
          },
          
          // {
          //   name: 'ruPremios',
          //   icon: 'mdi-slot-machine',
          //   title:'Premios',
          //   id:6,
          //   permiso:1
          // }, 
          // {
          //   name: 'ruVisitas',
          //   icon: 'mdi-chart-box',
          //   title:'Visitas',
          //   id:7
          // },
          {
            name: 'resumen',
            icon: 'mdi-view-dashboard',
            title:'Vista Administrador',
            id:8,
            permiso:0
          }, 
        ],
        subrutas:[
          {
            name:'flujo',
            tittle: 'Flujo de catálogos'
          },
          {
            name:'folios',
            tittle: 'Folios por ruta'
          },{
            name:'tiposMkn',
            tittle: 'Tipo de Maquinas'
          // },{
          //   name:'pdv',
          //   tittle: 'Punto de venta'
          // },{
          //   name:'maquinas',
          //   tittle: 'Maquinas'
          },
        ]
      }
    },
    components: {
    
    },
    mounted(){
      // if(this.sesion==null)
      //   window.location.href = ''
      if(this.ruta.includes('dashboard')){
        this.tipo=1
      }else{
        this.tipo=0
      }
    },
    // updated(){
    //   this.$vuetify.theme.dark=this.tema
    // },
    methods:{
      cambiarTema(){
        //localStorage.setItem('tema', JSON.stringify(!this.tema))
        this.tema=!this.tema
          
      },
      logOut(){
        sessionStorage.removeItem('sesion')
        window.location.href = ''
      }
    }
}
</script>