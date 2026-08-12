<template>
  <v-stepper
    v-model="nivel"
    vertical
    
  >
    <v-stepper-step
      :complete="nivel > 1"
      step="1"
      color="success"
    >
      Elegir Rutero
      <small>Selecciona un rutero para continuar con el flujo</small>
    </v-stepper-step>

    <v-stepper-content step="1">
     <usuario @usuario="usuarioS" />
      
      <!-- <v-btn text>
        Cancelar
      </v-btn> -->
      <v-btn
        color="success"
        @click="nivel = 2"
        :disabled="continuar1()"
      >
        Continuar
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="nivel > 2"
      step="2"
      color="success"
    >
      Seleccionar Punto de venta
    </v-stepper-step>

    <v-stepper-content step="2">
      <p-d-v v-if="nivel == 2" :ruta="!continuar1()?parseInt(this.usuarioSeleccionado[0].route_id):null" :code="!continuar1()?parseInt(this.usuarioSeleccionado[0].code):null" @puntodventa="puntoS" />
      
      <v-btn text @click="nivel = 1">
        Cambiar de rutero
      </v-btn>
      <v-btn
        color="success"
        @click="nivel = 3; ultima()"
        :disabled="continuar2()"
      >
        Continuar
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="nivel > 3"
      step="3"
      color="success"
    >
      Agrega la maquina
    </v-stepper-step>

    <v-stepper-content step="3">
      <maquinas v-if="nivel == 3" :punto="!continuar2()?parseInt(this.puntoSeleccionado[0].id):null" :nombrepunto="!continuar2()?this.puntoSeleccionado[0].pos_name:null" :ruta="!continuar2()?parseInt(this.usuarioSeleccionado[0].code):null" :route_id="!continuar2()?parseInt(this.usuarioSeleccionado[0].route_id):null" />
      
      <v-btn text @click="nivel=2" >
        Cambiar punto de venta
      </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
import {_} from 'vue-underscore'
import Usuario from '../Tablas/Usuarios'
import PDV from '../Tablas/PDV'
import Maquinas from '../Tablas/Maquinas'
export default {
  name:'Catalogos',
  data: () => ({
    show: false,
    nivel: 1,
    usuarioSeleccionado: [],
    puntoSeleccionado: []
  }),
  components: {
    Usuario,
    PDV,
    Maquinas
  },
  mounted(){
    console.log(_.isEmpty(this.usuarioSeleccionado[0]))
    this.continuar1()
    this.continuar2()
  },
  methods:{
    continuar1(){
      if(_.isEmpty(this.usuarioSeleccionado[0])){
        return true
      } else{
        return this.usuarioSeleccionado.length==0?true:false

      }
    },
    continuar2(){
      if(this.puntoSeleccionado!=null){
        if(_.isEmpty(this.puntoSeleccionado[0])){
          return true
        } else{
          return this.puntoSeleccionado.length==0?true:false

        }
      }
    },
    usuarioS(evento){
      this.usuarioSeleccionado=evento
    },
    puntoS(evento){
      this.puntoSeleccionado=evento
    },
  }
}
</script>