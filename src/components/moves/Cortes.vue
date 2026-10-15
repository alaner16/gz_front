<template>
  <v-card>
    <v-toolbar dark color="orange">
      <v-btn icon dark @click="cerrarPadre(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{
        imgRuta == null ? "Leer QR" : "Llenar datos"
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text @click="reload()"> Reiniciar </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- <qrcode-vue v-if="imgRuta==null" :value="imgRuta" :size="size" level="H" /> -->
    <!-- <vue-qr-reader v-on:code-scanned="codeArrived" v-on:error-captured="errorCaptured"> -->

    <div v-if="!pagina">
      <qrcode-drop-zone v-if="lat && !destroyed" @decode="onDecode" @init="logErrors" >
        <qrcode-stream
          @init="onInit"
          @decode="onDecode"
          :camera="camera"
          v-if="!destroyed"
        >
          <div class="loading-indicator" v-if="loading">
            Abriendo camara <br />
            <v-progress-circular
              :size="70"
              :width="7"
              color="amber"
              indeterminate
            ></v-progress-circular>
          </div>
        </qrcode-stream>
      </qrcode-drop-zone>
      <div v-else class="h-100 d-flex flex-column align-center mt-10">
        <h1 ><v-icon style="font-size:4rem">mdi-google-maps</v-icon></h1>
        <h2 >Éste dispositivo no tiene los permisos de ubicación activados</h2>
      </div>
      <qrcode-capture v-if="noStreamApiSupport && lat" @decode="onDecode" />
    </div>
    <v-card v-else class="pa-4">
      <div class="d-flex justify-space-between aling-items flex-row">
        <div class="flex-1-1">
          <v-icon>mdi-slot-machine</v-icon>
          <span class="ml-2">{{ imgRuta }}</span>
        </div>
        <v-switch
          v-model="premio"
          class="float-right mt-0"
          :label="(premio?'Premio':'Corte')"
          color="orange darken-3"
          hide-details
        ></v-switch>
      </div>
      <div class="pa-4" v-if="pagina == 1">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="1. Capturar la entrada"
              placeholder="$0.00"
              outlined
              type="tel"
              ref="txt1"
              v-model="txt1"
              :rules="soloNumero"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="2. Capturar la salida"
              placeholder="$0.00"
              outlined
              type="tel"
              ref="txt2"
              v-model="txt2"
              :rules="soloNumero"
            ></v-text-field>
            <v-file-input
              label=" 2. Evidencia"
              v-model="img2"
              :rules="reglaImg"
              accept="image/*;capture=camera"
              capture
              outlined
              prepend-icon="mdi-camera"
              @change="onFileChange(img2, 1)"
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="3. Capturar la pantalla"
              placeholder="$0.00"
              outlined
              type="tel"
              ref="txt3"
              v-model="txt3"
              :rules="soloNumero"
            ></v-text-field>
            <v-file-input
              label=" 3. Evidencia"
              v-model="img3"
              :rules="reglaImg"
              accept="image/*;capture=camera"
              capture
              outlined
              prepend-icon="mdi-camera"
              @change="onFileChange(img3, 2)"
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="4. Capturar lo que se sacó del equipo"
              placeholder="$0.00"
              outlined
              type="tel"
              ref="txt4"
              v-model="txt4"
              :rules="soloNumero"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="5. Capturar la comisión pagada"
              placeholder="$0.00"
              outlined
              disabled
              type="tel"
              ref="txt5"
              v-model="txt5"
              :value="txt4 * (comision / 100)"
              :rules="soloNumero"
            ></v-text-field>
            <v-dialog transition="dialog-top-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="red" pill v-bind="attrs" v-on="on"
                  ><v-icon>mdi-calculator</v-icon></v-btn
                >
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="primary" dark>Calcular comisión</v-toolbar>
                  <v-card-text>
                    <div class="pa-2">
                      <v-text-field
                        label="Se retiró del equipo"
                        outlined
                        disabled
                        type="tel"
                        ref="txt4"
                        v-model="txt4"
                        :rules="soloNumero"
                      ></v-text-field>
                      <v-text-field
                        label="Comisión en % 0-99 (porcentaje)"
                        outlined
                        type="tel"
                        ref="comision"
                        v-model="comision"
                        :rules="soloNumero"
                      ></v-text-field>
                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Cancelar</v-btn>
                    <v-btn
                      color="red"
                      @click="
                        (dialog.value = false), (txt5 = txt4 * (comision / 100))
                      "
                      >Calcular</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="6. Capturar el fondo actual"
              placeholder="$0.00"
              outlined
              type="tel"
              ref="txt6"
              v-model="txt6"
              :rules="soloNumero"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="pa-4">
        <b class="text-h4">7. Resumen del corte</b>
        <v-card class="pa-8">
          <div class="d-flex justify-space-between">
            <p>Entrada</p>
            <b>{{ txt1 }}</b>
          </div>
          <div class="d-flex justify-space-between">
            <p>Salida</p>
            <b>{{ txt2 }}</b>
          </div>
          <div class="d-flex justify-space-between">
            <p>Pantalla</p>
            <b>{{ txt3 }}</b>
          </div>
          <div class="d-flex justify-space-between">
            <p>Sacado de equipo</p>
            <b>{{ txt4 }}</b>
          </div>
          <div class="d-flex justify-space-between">
            <p>Comisión pagada</p>
            <b>{{ txt5 }}</b>
          </div>
          <div class="d-flex justify-space-between">
            <p>Fondo actual</p>
            <b>{{ txt6 }}</b>
          </div>
        </v-card>
        <v-textarea
          outlined
          class="m-2 mt-4"
          name="comentarios"
          v-model="comentarios"
          label="Comentarios (opcional)"
        ></v-textarea>
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
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import imageCompression from 'browser-image-compression'
import {version} from '../../../package'
export default {
  name: "Cortes",
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
      (value) => {
        if (!value)
          return "Es necesario ingresar la imagen";
        return value.size < 18000000 || "El limite de tamaño de imagen es de 18 MB!";
      }
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
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
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
              this.alertaColor = "red";
              this.alertaText = "No se ha permitido el acceso a la posición del usuario.";
              this.alerta = true;
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
    if (
      this.txt1 == null ||
      this.txt2 == null ||
      this.txt3 == null ||
      this.txt4 == null ||
      this.txt5 == null ||
      this.txt6 == null ||
      this.evidencia1 == null ||
      this.evidencia2 == null
    ) {
      this.disabled = true;
    } else this.disabled = false;
  },
  methods: {
    async onDecode(result) {
      this.imgRuta = result;
      this.turnCameraOff();

      // pretend it's taking really long
      await this.timeout(1000);
      if (result != "") {
        this.pagina = 1;
        this.buscarRutaActual();
      } else this.reload();

      // some more delay, so users have time to read the message
      await this.timeout(1000);
    },
    logErrors(promise) {
      promise.catch(console.error);
    },
    async onInit(promise) {
      this.loading = true;
      try {
        await promise;
      } catch (error) {
        if (error.name === "StreamApiNotSupportedError") {
          this.noStreamApiSupport = true;
          this.evento = error;
        } else if (error.name === "NotAllowedError") {
          this.evento =
            "ERROR: Es necesario proporcionar los permisos de Cámara";
        } else if (error.name === "NotFoundError") {
          this.evento = "ERROR: No se encontró la cámara";
        } else if (error.name === "NotSupportedError") {
          this.evento = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.evento = "ERROR: ¿Se encuentra la cámara en uso?";
        } else if (error.name === "OverconstrainedError") {
          this.evento = "ERROR: No fue posible conectarse con la cámara";
        }
      } finally {
        this.loading = false;
      }
    },
    async reload() {
      this.destroyed = true;
      this.imgRuta = null;
      this.pagina = 0;
      this.premio=false
      await this.$nextTick();
      this.turnCameraOn();
      this.destroyed = false;
      this.default = {};
      this.rutaActual = null;
      this.maquinaActual = null;
      this.puntoActual = null;
      this.txt1 = null;
      this.txt2 = null;
      this.txt3 = null;
      this.txt4 = null;
      this.txt5 = null;
      this.txt6 = null;
      this.comision = 40;
      this.comentarios = null;
      this.img2 = null;
      this.img3 = null;
      this.img4 = null;
      this.evidencia1 = null;
      this.evidencia2 = null;
    },
    turnCameraOn() {
      this.camera = "auto";
    },
    turnCameraOff() {
      this.camera = "off";
    },
    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
    buscarRutaActual() {
      let code = this.imgRuta.split("-");
      this.rutaActual = this.ruta.routes.find((x) => x.code == code[0]);
      // this.maquinaActual = this.rutaActual[0].point_of_sales.map(y =>{

      //   return y.game_machines.map(z =>{
      //     z.sales_comission = y.sales_comission
      //     z.point_of_sale = y.id
      //     return z.folio==code[1]?z:null
      //   })

      // })
      if (!this.rutaActual) {
        this.alertaColor = "orange";
        this.alertaText =
          "La máquina escaneada no existe en la configuración de la ruta asignada.";
        this.alerta = true;
        this.reload();
      } else {
        this.alerta = false;
        this.rutaActual.point_of_sales.forEach((y) => {
          y.game_machines.forEach((z) => {
            if (z.folio == code[1]) {
              this.puntoActual = y;
              z.sales_comission = y.sales_comission;
              z.point_of_sale = y.id;
              this.maquinaActual = z;
              return;
            }
          });
        });
        this.comision = this.maquinaActual.sales_comission;
      }
    },
    async sumarArreglo() {
      var moment = require("moment");
      moment.locale("es");
      this.disabled=true;
      var today = new Date();
      var year = today.getFullYear();

      this.default = {
        status: this.premio?2:1,
        version: this.ver,
        idDisplay: this.imgRuta,
        fecha: moment().format("L") || new Date(),
        salida: parseInt(this.txt4),
        puntoName: this.puntoActual.pos_name,
        route_id: this.rutaActual.id,
        point_of_sale_id: this.maquinaActual.point_of_sale,
        game_machine_id: this.maquinaActual.id,
        week: parseInt(this.maquinaActual.week_lr || 0) + 1,
        week_year: year,
        screen_number: parseInt(this.txt3),
        screen_number_lr: this.maquinaActual.screen_number_lr || 0,
        input_read: parseInt(this.txt1),
        input_read_lr: this.maquinaActual.input_read_lr || 0,
        output_read: parseInt(this.txt2),
        output_read_lr: this.maquinaActual.output_read_lr || 0,
        game_machine_output: parseInt(this.txt4),
        sales_commission_percentage: this.comision,
        sales_commission_amount:
          this.txt5 != null
            ? Math.round(
                (parseInt(this.txt4) * (this.comision / 100) * 100) / 100
              )
            : 0,
        game_machine_fund: this.maquinaActual.real_fund,
        real_fund: this.txt6,
        net_sale: this.txt4,
        total_input_read:
          parseInt(this.txt1) - (this.maquinaActual.input_read_lr || 0),
        total_output_read:
          parseInt(this.txt2) - (this.maquinaActual.output_read_lr || 0),
        comments: this.comentarios,
        mobile_id: 1,
        date: moment().toDate(),
        user_id: this.usuario.id,
        total_screen_number:
          parseInt(this.txt3) - (this.maquinaActual.screen_number_lr || 0),
        game_machine_historic_locations_attributes: {
          game_machine_id: this.maquinaActual.id,
          coordinates: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [this.longitud || 0, this.lat || 0],
            },
          },
        },
        evidences: [
          { file: this.evidencia1, step: 1 },
          { file: this.evidencia2, step: 2 },
        ],
      };
      this.default.total_markers =
        parseInt(this.default.total_input_read) -
        parseInt(this.default.total_output_read);
      this.default.missing =
        parseInt(this.default.game_machine_output) -
        parseInt(this.default.total_markers);
      sessionStorage.setItem("cortes", JSON.stringify(this.acumulado));
      await idb.save(this.default, "sales");
      this.disabled=false;
      this.$gtag.event("hizoCorte", {
        event_category: "Corte de maquina: " + this.imgRuta,
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
      this.$emit('corte', e)
    },
  },
};
</script>