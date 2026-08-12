<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="maquinas"
          :search="search"
          :single-expand="true"
          :expanded.sync="expanded"
          sort-by="type"
          show-expand
          item-key="id"
          class="elevation-1"
          :loading="loading"
          loading-text="Buscando maquinas, un momento..."
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Maquinas de <b class="text-uppercase">{{nombrepunto}}</b></v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search" class="mr-3"
                  append-icon="mdi-magnify"
                  label="Buscar en Maquinas"
                  single-line
                  hide-details
                ></v-text-field>
              <v-dialog
                v-model="dialog"
                persistent
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Nuevo
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.folio"
                            :label="editedIndex == -1?'Folio de maquina sugerido':'Folio de maquina'"
                            counter="3"
                            :max="3"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <!-- <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.game_type"
                            label="Tipo de juego"
                            v-uppercase
                          ></v-text-field>
                        </v-col> -->
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.real_fund"
                            label="Fondo real" 
                            type="number"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <!-- <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.money_type"
                            label="Tipo de moneda" 
                            type="number"
                            v-uppercase
                          ></v-text-field>
                        </v-col> -->
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.digits_number"
                            label="Numero de digitos" 
                            type="number"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-select
                            v-model="editedItem.money_type"
                            :items="tipo"
                            item-text="name"
                            item-value="_id"
                            label="Tipo de moneda" 
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-select
                            v-model="tipoMkn"
                            :items="tipos"
                            item-text="description"
                            item-value="id"
                            label="Tipo de maquina"
                            @change="otro"
                            return-object
                          ></v-select>
                          <v-text-field
                            v-model="editedItem.otro"
                            label="Nombre de tipo de maquina"
                            v-if="otroTipo"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                    >
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline">¿Seguro de eliminar esta Maquina?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">Aceptar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template #item.money_type="{ item }">
             {{ item.money_type==0?'Monedas':item.money_type==1?'Billetes':'Mixto' }}</template
            >
          <template v-slot:no-data>
            <!-- <v-btn
              color="primary"
              @click="initialize"
            >
              Reiniciar
            </v-btn> -->
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <v-container>
                <v-row>
                  <v-col>
                    Codigo QR de {{ ruta+'-'+item.folio }}
                  </v-col>
                  <v-col>
                    <v-btn color="success" dark text @click="guardar(ruta,item.folio)">
                      <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                      Guardar
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div ref="guardaMe" class="pa-5 imprimirQr" id="qr" style="display:flex;background-color:white;width:400px;align-items: center;">
                      <img :src="'https://api.qrserver.com/v1/create-qr-code/?data='+ruta+'-'+item.folio+'&size=250x250'" alt="Maquina">
                      <div class="infoRuta" style="color:black;margin-left:40px;font-weight:bold;display:flex;justify-content:center;flex-direction: column;">
                        <h1>{{ruta}}</h1><br>
                        <h1>{{item.folio}}</h1>
                      </div>
                    </div>
                    <img :src="img">
                  </v-col>
                </v-row>
              </v-container>
              
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  
</template>
<script>

import ApiService from '../../service/apis'
import domtoimage from "dom-to-image-more";
export default {
  name:'Maquinas',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      selected:null,
      tipos:null,
      ultimo:0,
      tipoMkn:{},
      img:null,
      otroTipo:false,
      headers: [
        {
          text: 'Folio',
          align: 'start',
          value: 'folio',
        },
        { text: 'Tipo de juego', value: 'game_type' },
        { text: 'Fondo real', value: 'real_fund' },
        { text: 'Tipo de entrada', value: 'money_type' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      maquinas: [],
      editedIndex: -1,
      tipo:[{_id:0,name:'Monedas'},{_id:1,name:'Billete'},{_id:2,name:'Mixto'},],
      editedItem: {
        
      },
      defaultItem: {
        
      },
      loading:false
    }),
    props:{
      punto: Number,
      nombrepunto: String,
      ruta: Number,
      route_id: Number
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Alta de nueva Maquina' : 'Modificar Maquina'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
      
    },
    methods: {
      initialize () {
        this.loading=true
        let otro = [{id:null,description:'Otro'}]
        ApiService.getTiposMkn().then(tipos =>{
          
          this.tipos = tipos.data.concat(otro)
        })
        ApiService.MaquinaXpunto(this.punto).then(maquinas =>{
          // maquinas=maquinas.data.map(m =>{
          //   if(m.type==1){
          //     m.type='PRODUCTO'
          //   }
          //   return m
          // })
          this.maquinas = maquinas.data
          this.loading=false
        })
        ApiService.MaquinaSiguiente(this.route_id).then(ultimo =>{
          this.ultimo = parseInt(ultimo[0].max)>100?(parseInt(ultimo[0].max)+1):parseInt(ultimo[0].max)<10?'00'+(parseInt(ultimo[0].max)+1):'0'+(parseInt(ultimo[0].max)+1)
          this.editedItem.folio = this.ultimo
          this.tipoMkn={}
          this.otro()
        })
      },

      editItem (item) {
        this.editedIndex = this.maquinas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.id=item._id
      },

      deleteItem (item) {
        this.editedIndex = this.maquinas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        let borrar = {
          id: this.editedItem.id
        }
        ApiService.maquinaBorrar(borrar).then(res =>{
          if(res){
            this.initialize()
            this.closeDelete()
          }
        })
        
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.editedItem.folio = this.ultimo
          this.tipoMkn={}
          this.otro()
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      otro(){
        if(this.tipoMkn.id == null){
          this.otroTipo=true
        }else{
          this.otroTipo=false
        }
      },
      save () {
        this.editedItem.game_type_id=this.tipoMkn.id
        this.editedItem.game_type=this.tipoMkn.description
        if (this.editedIndex > -1) {
          //Object.assign(this.sucursales[this.editedIndex], this.editedItem)
          
          ApiService.maquinaEditar(this.editedItem).then(res =>{
            if(res){
              this.initialize()
              this.close()
            }
          })
        } else {
          this.editedItem.route_id = this.route_id
          this.editedItem.point_of_sale_id = this.punto
          ApiService.maquinaNuevo(this.editedItem).then(res =>{
            console.log(res.data)
            if(res){
              this.initialize()
              this.close()
            }

          })
        }
        this.initialize()
      },
      maximo(){
        return this.editedIndex === -1 ?this.ultimo : this.editedItem.folio
      },
      imprimir() {
        let imprimir = "";
        imprimir = document.getElementById("qr");
        var ventana = "";
        ventana = window.open("", "PRINT", "height=300,width=500");
        ventana.document.write(
          "<html><head><title></title>"
        );
        ventana.document.write('<link rel="stylesheet" href="./estilos.css">');
        ventana.document.write("</head><body >");
        ventana.document.write(imprimir.innerHTML);
        ventana.document.write("</body></html>");
        ventana.document.close();
        ventana.focus();
        setTimeout(() => {
          ventana.print();
        }, 2000);
        this.cerrarDialog()
      },
      guardar(laruta,folio) {
        this.loading = true;
        //const capture = this.$refs.guardaMe;
        var qr = document.getElementById("qr");
        // domtoimage.toPng(qr).then((dataUrl) => {
        //   this.img=dataUrl
        //   this.loading = false;
        // })
        // .catch((error) => {
        //   this.loading = false;
        //   console.error("Ta valiendo vrg", error);
        // });
        // domtoimage.toBlob(qr).then(function (blob) {
        //   window.saveAs(blob, (laruta+'-'+folio+".png"));
        // });
        domtoimage.toJpeg(qr, { quality: 0.95 }).then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = (laruta+'-'+folio+".jpg")
          link.href = dataUrl
          link.click()
          this.loading = false
        });
      }
    },
}
</script>
<style>
.v-application .headline {
  letter-spacing: unset;
}
</style>