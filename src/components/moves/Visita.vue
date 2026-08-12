<template>
  <v-card>
    <v-toolbar dark color="orange">
      <v-btn icon dark @click="cerrarPadre(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{
         "Registrar Visita"
      }}</v-toolbar-title>
    </v-toolbar>
    <v-card class="pa-4">
      <div class="d-flex justify-space-between aling-items flex-row">
        
      </div>
      <div class="pa-4">
        <v-row>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Punto de venta"
              outlined
              :items="ruta.routes[0].point_of_sales"
              type="tel"
              item-text="pos_name"
              item-value="id"
              v-model="puntoActual"
              return-object
              @change="valida"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-file-input
              label="Evidencia"
              v-model="img2"
              :rules="reglaImg"
              accept="image/*;capture=camera"
              capture
              outlined
              prepend-icon="mdi-camera"
              @blur="valida"
              @change="onFileChange(img2, 1)"
            ></v-file-input>
          </v-col>
          <v-textarea
          outlined
          class="m-2 mt-4"
          name="comentarios"
          v-model="comentarios"
          label="Comentarios (opcional)"
        ></v-textarea>
        </v-row>
      </div>
      <v-btn @click="sumarArreglo" :disabled="disabled" color="red"
        >Guardar</v-btn
      >
    </v-card>
     <alertas :color="alertaColor" :text="alertaText" :timeout="4000" :alerta="alerta" />
  </v-card>
</template>
<script>
import Alertas from '@/components/Alertas.vue'
import idb from '@/service/idb';
import imageCompression from 'browser-image-compression'
import {version} from '../../../package'
export default {
  name: "Visita",
  data: () => ({
    ver: version,
    alerta: false,
    sw: false,
    alertaText: null,
    alertaColor: null,
    soloNumero: [
      (v) => !!v || "Es necesario ingresar el valor",
      (v) => /^\d*[.]?\d*$/.test(v) || "Solo se aceptan numeros.",
    ],
    reglaImg: [
      (value) =>
        value.size < 18000000 || "El limite de tamaño de imagen es de 18 MB!",
    ],
    pagina: 0,
    sincronizando: false,
    ruta: JSON.parse(localStorage.getItem("ruta")),
    usuario: JSON.parse(sessionStorage.getItem("data")),
    longitud: null,
    lat: null,
    imgRuta: null,
    rutaActual: null,
    maquinaActual: null,
    puntoActual: null,
    premio:false,
    txt1: null,
    txt2: null,
    txt3: null,
    txt4: null,
    txt5: null,
    txt6: null,
    comision: 40,
    comentarios: null,
    img2: null,
    img3: null,
    img4: null,
    evidencia1: null,
    evidencia2: null,
    destroyed: false,
    loading: false,
    noStreamApiSupport: false,
    evento: null,
    disabled: true,
    camera: "auto",
    acumulado: {
      revisions: {
        sales_array: [],
      },
    },
    default: {},
    pendingToUpload: [],
    salesSincronized: [],
  }),
  components: {
    Alertas,
  },
  async created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function Position(objPosition) {
          console.log(objPosition.coords.longitude);
          console.log(objPosition.coords.latitude);
        },
        function (objPositionError) {
          switch (objPositionError.code) {
            case objPositionError.PERMISSION_DENIED:
              console.log(
                "No se ha permitido el acceso a la posición del usuario."
              );
              break;
            case objPositionError.POSITION_UNAVAILABLE:
              console.log(
                "No se ha podido acceder a la información de su posición."
              );
              break;
            case objPositionError.TIMEOUT:
              console.log(
                "El servicio ha tardado demasiado tiempo en responder."
              );
              break;
            default:
              console.log("Error desconocido.");
          }
        },
        {
          maximumAge: 75000,
          timeout: 15000,
        }
      );
    } else {
      this.alertaColor = "yellow";
      this.alertaText = "Este dispositivo no será posible Geolocalizarlo";
      this.alerta = true;
    }
    // this.cerrarPadre(false)
    /*if(sessionStorage.getItem('cortes')){
      this.acumulado=JSON.parse(sessionStorage.getItem('cortes'))
    }*/
  },
  mounted(){
    this.nuevo()
  },
  updated() {
    if (this.puntoActual==null || this.img2 == null) {
      this.disabled = true;
      } else this.disabled = false;
  },
  methods: {
    valida(){
      
    },
    logErrors(promise) {
      promise.catch(console.error);
    },

    async reload() {
      this.puntoActual = null;
      this.comentarios = null;
      this.evidencia1 = null;
    },
    
    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
    
    async sumarArreglo() {
      var moment = require("moment");
      moment.locale("es");
      this.disabled=true;
      this.default = {
        status: 3,
        version: this.ver,
        idDisplay: this.ruta.routes[0].code,
        fecha: moment().format("L") || new Date(),
        puntoName: this.puntoActual.pos_name,
        route_id: this.ruta.routes[0].id,
        point_of_sale_id: this.puntoActual.id,
        
        comments: this.comentarios,
        mobile_id: 1,
        date: moment().toDate(),
        user_id: this.usuario.id,
        game_machine_historic_locations_attributes: {
          coordinates: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [this.longitud || 0, this.lat || 0],
            },
          },
        },
        evidences: [
          { file: this.evidencia1, step: 1 }
        ],
      };
      
      // sessionStorage.setItem("cortes", JSON.stringify(this.acumulado));
      await idb.save(this.default, "sales");
      this.disabled=false;
      this.$gtag.event("hizoVisita", {
        event_category: "Visita de ruta: " + this.ruta.routes[0].code,
        event_label: this.usuario.username,
      });
      this.cerrarPadre(false)
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    async onFileChange(files, numero) {
      console.log("originalFile instanceof Blob", files instanceof Blob); // true
      console.log(`originalFile size ${files.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(files, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        const filePathsPromises = [];
        filePathsPromises.push(this.toBase64(compressedFile));
        const filePaths = await Promise.all(filePathsPromises);

        if (numero == 1) {
          this.evidencia1 = filePaths.map((base64File) => ({
            base64File,
          }));
        } else {
          this.evidencia2 = filePaths.map((base64File) => ({
            base64File,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    nuevo() {
      this.reload()

      navigator.geolocation.getCurrentPosition((objPosition) => {
        this.longitud = objPosition.coords.longitude;
        this.lat = objPosition.coords.latitude;
      });
    },
    cerrarPadre(e){
      this.$emit('visita', e)
    },
  },
};
</script>