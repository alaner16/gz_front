<template>
<div>
    <!-- <v-fab-transition>
      <v-btn
        color="orange"
        dark
        fixed
        bottom
        right
        fab
        @click="nuevo"
      >
        <v-icon class="text-h3">mdi-plus</v-icon>
      </v-btn>

    </v-fab-transition> -->
    <v-speed-dial
      v-model="fab"
      color="orange"
      dark
      fixed
      bottom
      right
      fab
      
      transition
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="orange"
          dark
          fab
        >
          <v-icon class="text-h3" v-if="fab">
            mdi-close
          </v-icon>
          <v-icon class="text-h3" v-else>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        dark
        large
        text
        @click="nuevo(1)"
        color="green"
        class="btnSeleccionMenu"
      > 
        <v-icon>mdi-cash-multiple</v-icon> &nbsp;
        Corte o Premio
      </v-btn>
      <v-btn
        dark
        large
        text
        class="btnSeleccionMenu"
        color="indigo"
        @click="nuevo(2)"
      > 
        <v-icon>mdi-map-clock-outline</v-icon>&nbsp;
        Visita
      </v-btn>
    </v-speed-dial>
    <v-fab-transition>
      <v-btn
        color="success"
        dark
        fixed
        bottom
        left
        fab
        @click="sincronizar"
        :loading="sincronizando"
      >
        <v-icon class="text-h3">mdi-sync</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-row class="d-flex">
      <v-switch
        v-model="sw"
        class="mx-auto mb-4"
        :label="(sw?'Movimientos subidos':'Movimientos pendientes')"
        color="orange darken-3"
        hide-details
      ></v-switch>
    </v-row>
    <div v-if="sw==false">
      <v-card v-show="movimiento.user_id ==usuario.id" v-for="movimiento in pendingToUpload" :key="movimiento.idDisplay" class=" mx-auto my-2">
        <!-- <v-carousel height="250"
        hide-delimiter-background
        show-arrows-on-hover
        >
          <v-carousel-item v-for="img in movimiento.evidences" :key="img.file[0].step" >
            <v-icon class="statusSincronizado" color="red">mdi-cloud-off-outline</v-icon>
            <v-img

              :src="img.file[0].base64File"
            ></v-img>
          </v-carousel-item>
        </v-carousel> -->

        <div class="d-flex justify-space-between aling-items flex-row pa-4">
          <div class="flex-1-1">
            <v-icon>mdi-slot-machine</v-icon>
            <span class="ml-2">{{movimiento.idDisplay}}</span>
          </div>
          <v-chip v-if="movimiento.status==1" color="success"><v-icon class="mr-1">mdi-cash</v-icon><b>Corte</b></v-chip>
          <v-chip v-else-if="movimiento.status==2" outlined color="warning"><v-icon class="mb-1 mr-1">mdi-cash-refund</v-icon><b>Premio</b></v-chip>
          <v-chip v-else outlined color="info"><v-icon class="mb-1 mr-1">mdi-crosshairs-question</v-icon><b>Visita</b></v-chip>
          <span class="float-right">{{movimiento.fecha}}</span>
        </div>
        <v-chip
          outlined
          color="red"
          class="float-left ml-5"
          small
          @click="eliminarMovimiento(movimiento.id, movimiento.idDisplay)"
        ><v-icon>mdi-delete-forever</v-icon></v-chip>
        <b class="mr-16" >{{movimiento.puntoName}}</b>
        
        <div v-if="movimiento.status!=3" class="d-flex justify-space-between aling-items flex-row pa-4">
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Calculado</p>
            <b>${{((parseInt(movimiento.input_read)-parseInt(movimiento.input_read_lr))-(parseFloat(movimiento.output_read)-parseFloat(movimiento.output_read_lr))).toFixed(2)}}</b>
          </div>
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Real</p>
            <b>${{(parseFloat(movimiento.game_machine_output)).toFixed(2)}}</b>
          </div>
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Diferencia</p>
            <b>${{(parseFloat(movimiento.game_machine_output)-((parseFloat(movimiento.input_read)-parseFloat(movimiento.input_read_lr)-(parseFloat(movimiento.output_read)-parseFloat(movimiento.output_read_lr))))).toFixed(2)}}</b>
          </div>
        </div>
        <div v-else class="pa-5">
          {{movimiento.comments}}
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-card v-show="movimiento.user_id ==usuario.id" v-for="movimiento in salesSincronized" :key="movimiento.idDisplay" class="naranja mx-auto my-2">
        <!-- <v-carousel height="250"
        hide-delimiter-background
        show-arrows-on-hover
        >
          <v-carousel-item v-for="img in movimiento.evidences" :key="img.file[0].step" >
            <v-icon class="statusSincronizado" color="info">mdi-cloud-check-outline</v-icon>
            <v-img
              :src="img.file[0].base64File"
            ></v-img>
          </v-carousel-item>
        </v-carousel> -->

        <div class="d-flex justify-space-between aling-items flex-row pa-4">
          <div class="flex-1-1">
            <v-icon>mdi-slot-machine</v-icon>
            <span class="ml-2">{{movimiento.idDisplay}}</span>
          </div>
          <v-chip v-if="movimiento.status==1" color="success"><v-icon class="mr-1">mdi-cash</v-icon><b>Corte</b></v-chip>
          <v-chip v-else-if="movimiento.status==2" outlined color="warning"><v-icon class="mb-1">mdi-cash-refund</v-icon><b>Premio</b></v-chip>
          <v-chip v-else outlined color="info"><v-icon class="mb-1">mdi-crosshairs-question</v-icon><b>Visita</b></v-chip>
          <span class="float-right">{{movimiento.fecha}}</span>
        </div>
        <b>{{movimiento.puntoName}}</b>
        <div v-if="movimiento.status!=3" class="d-flex justify-space-between aling-items flex-row pa-4">
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Calculado</p>
            <b>${{((parseInt(movimiento.input_read)-parseInt(movimiento.input_read_lr))-(parseFloat(movimiento.output_read)-parseFloat(movimiento.output_read_lr))).toFixed(2)}}</b>
          </div>
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Real</p>
            <b>${{parseInt(movimiento.game_machine_output).toFixed(2)}}</b>
          </div>
          <div class="d-flex justify-space-between aling-items flex-column">
            <p>Diferencia</p>
            <b>${{(parseFloat(movimiento.game_machine_output)-((parseFloat(movimiento.input_read)-parseFloat(movimiento.input_read_lr)-(parseFloat(movimiento.output_read)-parseFloat(movimiento.output_read_lr))))).toFixed(2)}}</b>
          </div>
        </div>
        <div v-else class="pa-5">
          {{movimiento.comments}}
        </div>
      </v-card>
    </div>

    <v-dialog
      v-model="nueva"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <cortes v-if="nueva && tipo==1" @corte="hecho()" />
      <visita v-else-if="nueva && tipo==2" @visita="hecho()" />
    </v-dialog>

    <alertas :color="alertaColor" :text="alertaText" :timeout="4000" :alerta="alerta" />
  </div>
</template>
<script>
import servicios from '../../service/apis'
import idb from '@/service/idb'
import {version} from '../../../package'
import Alertas from '@/components/Alertas.vue'
import Cortes from '@/components/moves/Cortes.vue'
import Visita from '@/components/moves/Visita.vue'
export default {
  name:'Movimientos',
  data: () => ({
    ver: version,
    alerta:false,
    fab:false,
    sw:false,
    alertaText:null,
    alertaColor:null,
    soloNumero:[
      v => !!v || 'Es necesario ingresar el valor',
      v => /^\d*[.]?\d*$/.test(v) || 'Solo se aceptan numeros.',
    ],
    reglaImg: [
      value => value.size < 18000000 || 'El limite de tamaño de imagen es de 18 MB!',
    ],
    pagina:0,
    sincronizando:false,
    ruta: JSON.parse(localStorage.getItem('ruta')),
    usuario: JSON.parse(sessionStorage.getItem('data')),
    longitud:null,
    lat:null,
    imgRuta:null,
    rutaActual:null,
    maquinaActual:null,
    puntoActual:null,
    nueva: false,
    tipo:0,
    destroyed:false,
    loading: false,
    disabled:true,
    camera:'auto',
    acumulado:{
      revisions: {
        sales_array: []
      }
    },
    default:{},
    pendingToUpload: [],
    salesSincronized: []
  }),
  components: {
    Alertas,
    Cortes,
    Visita
  },
  async created(){
    this.initialize()
  },
  methods: {
    async initialize(){
      this.pendingToUpload = await idb.get('sales')
      this.salesSincronized = await idb.get('salesUploaded')
      this.ordenar()
    },
    async eliminarMovimiento(id, idImg){
      await idb.delete(id, 'sales', false)
      this.pendingToUpload = await idb.get('sales')
      this.$gtag.event('eliminóMovimiento',{
            'event_category': ('Eliminó el movimiento: '+ idImg),
            'event_label': this.usuario.username
          })
    },
    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
    async sincronizar(){
      if(this.acumulado.revisions.sales_array.length>0 || this.pendingToUpload.length){
        var obj = {revisions: {sales_array: this.pendingToUpload}}
        this.sincronizando=true
        servicios.sincronizarMovimientos(JSON.stringify(obj)).then(async respa =>{
          
        //servicios.sincronizarMovimientos(this.acumulado).then(async respa =>{
          this.$gtag.event('sincronizarMovimiento',{
            'event_category': ('sincronizado status: '+ respa.status),
            'event_label': this.usuario.username
          })
          if(respa.status<300){
            this.alertaColor='success'
            this.alertaText='Se realizó la subida de movimientos con éxito'
            this.alerta=true
            await this.timeout(4000)
            this.alerta=false
            
            respa.data.forEach(async obj => {
              await idb.save(obj, 'salesUploaded')
            })
            await idb.delete(null, 'sales', true)
            this.initialize()
            sessionStorage.removeItem('moves')
            let res = JSON.parse(sessionStorage.getItem('data'))
            console.log(res.id)
            servicios.rutasPorUsuario(res.id).then(data =>{
              idb.save(res, 'user')
              data.data.id = 1
              idb.save(data.data, 'config')
              this.$gtag.event('actualizar',{
                'event_category': 'maquinas actualizadas',
                'event_label': res.data.data.username
              })

            })
          }else{
            switch(respa.status){
              case 400:
                this.alertaColor='red'
                this.alertaText='Solicitud no procesada, error 400'
                this.alerta=true
                await this.timeout(4000)
                this.alerta=false
                break
              case 401:
                this.alertaColor='red'
                this.alertaText='Favor de iniciar de sesión nuevamente'
                this.alerta=true
                await this.timeout(4000)
                this.alerta=false
                break
              case 404:
                this.alertaColor='red'
                this.alertaText='404: No se encuentra servicio disponible.'
                this.alerta=true
                await this.timeout(4000)
                this.alerta=false
                break
              case 500:
                this.alertaColor='red'
                this.alertaText='Error de petición en el servidor: 500 ERROR'
                this.alerta=true
                await this.timeout(4000)
                this.alerta=false
                break
            }
          }
        }).catch(async err =>{
          this.alertaColor='black'
          this.alertaText='Imposible realizar operación, Error:' + err.message
          this.alerta=true
          await this.timeout(4000)
          this.alerta=false
          this.sincronizando=false
        }).finally(()=>this.sincronizando=false)

      }else{
        this.alertaColor='orange'
        this.alertaText='Ningun movimiento disponible para subir'
        this.alerta=true
        await this.timeout(4000)
        this.alerta=false
      }
    },
   
    nuevo(tipo){
      this.nueva=true
      this.tipo=tipo
    },
    hecho(e){
      this.nueva=false
      console.log(e)
      this.initialize()
    },
    ordenar(){
      this.pendingToUpload.sort((a,b) =>{
        return b.id - a.id
      })
      this.salesSincronized.sort((a,b) =>{
        return b.id - a.id
      })
    }

  }
}
</script>
<style scoped>
.loading-indicator {
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
}
.statusSincronizado{
  position: absolute;
  z-index: 2;
  right: 3px;
  top: 3px;
}
.naranja{
  border: 3px outset orange;
}
.btnSeleccionMenu{
   right: 33%!important;
 }
</style>