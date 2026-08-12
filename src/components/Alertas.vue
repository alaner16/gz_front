<template>
    <v-snackbar
      v-model="alerta"
      :timeout="timeout"
      :color="color"
      outlined
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="color"
          text
          v-bind="attrs"
          @click="alerta = false"
          elevation="24"
        >
          OK
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
export default {
    name:'Alertas',
    data(){
			return{
					
			}
    },
    props:{
      text: String,
      alerta:Boolean,
      timeout:Number,
      color:String
    },
}
</script>