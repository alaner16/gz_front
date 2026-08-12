<template>
  <div>
     <v-text class="text-h2 orange--text text--darken-2 font-weight-bold " >Resultados de los ultimo 7 días</v-text>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Mejores maquina por Ruta:</v-card-title>
            <v-card-text v-for="(maquina, indice) in tops.bestMachinesByRoute" :key="maquina.game_machine_id">
              <b class="text-h6 green--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{maquina.concat}} <br><small>con ${{maquina.vendido.toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Mejor recaudación por Rutero:</v-card-title>
            <v-card-text v-for="(rutero, indice) in tops.bestRoadmans" :key="rutero.user_id">
              <b class="text-h6 green--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{rutero.username}} <br><small>con ${{parseFloat(rutero.vendido).toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Mejor tipo de maquina:</v-card-title>
            <v-card-text v-for="(maquina, indice) in tops.bestTypeMachines" :key="maquina.id">
              <b class="text-h6 green--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{maquina.tipomaquina}} <br><small>con ${{parseFloat(maquina.vendido).toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Peor maquina por Ruta:</v-card-title>
            <v-card-text v-for="(maquina, indice) in tops.lessMachinesByRoute" :key="maquina.game_machine_id">
              <b class="text-h6 red--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{maquina.concat}} <br><small>con ${{maquina.vendido.toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Peor recaudación por Rutero:</v-card-title>
            <v-card-text v-for="(rutero, indice) in tops.lessRoadmans" :key="rutero.user_id">
              <b class="text-h6 red--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{rutero.username}} <br><small>con ${{parseFloat(rutero.vendido).toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card elevation="2" :loading="cargando" class="d-flex justify-center flex-column">
            <v-card-title class="">Peor recaudación por tipo de maquina:</v-card-title>
            <v-card-text v-for="(rutero, indice) in tops.lessTypeMachines" :key="rutero.user_id">
              <b class="text-h6 red--text" :class="{'text--lighten-1':1==(indice+1),'text--lighten-2':2==(indice+1),'text--lighten-3':3==(indice+1),'text--lighten-4':4==(indice+1),'text--lighten-5':5==(indice+1)}"><span>Top {{indice+1}}: </span>{{rutero.tipomaquina}} <br><small>con ${{parseFloat(rutero.vendido).toFixed(2)}} en venta</small></b>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import servicios from '../../service/apis'
  export default {
    name:'Resumen',
    data: () => ({
      show: false,
      cargando:false,
      tops:null
    }),
    mounted(){
      this.initialice()
    },
    methods:{
      initialice(){
        this.cargando=true
        servicios.getResumen().then((respuesta)=>{

          this.tops=respuesta.data
        }).finally(()=>{
          this.cargando=false
        })
      },
      
    }
  }
</script>