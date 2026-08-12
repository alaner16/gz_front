<template>
  <v-container>
    <v-row>
      <v-col
          class="d-flex"
          cols="12"
          md="3"
        >
          <v-autocomplete
            :items="filtros.routes"
            label="Rutas"
            outlined
            dense
            item-text="code"
            prepend-icon="mdi-map"
            item-value="id"
            v-model="route_id"
            clearable
            @change="maquina=null; buscarRutero()"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          md="3"
        >
          <v-autocomplete
            :items="filtros.users.filter(x=>x.route_id!=null)"
            label="Rutero"
            outlined
            dense
            item-text="username"
            prepend-icon="mdi-account-search-outline"
            item-value="id"
            clearable
            @change="buscarRuta()"
            v-model="rutero"
            return-object
          ></v-autocomplete>
        </v-col>
    </v-row>
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
          loading-text="Acomodando maquinas por folio, un momento..."
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Maquinas de la ruta <b class="text-uppercase">{{route_id.code}}</b></v-toolbar-title>
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
                <!-- <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Nuevo
                  </v-btn>
                </template> -->
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
                            v-model="maximo"
                            label="Folio de maquina"
                            counter="3"
                            :max="3"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.game_type"
                            label="Tipo de juego"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
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
                            persistent-hint
                            single-line
                          ></v-select>
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
                    Codigo QR de {{ route_id.code+'-'+item.folio }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="pa-5">
                      <img :src="'https://api.qrserver.com/v1/create-qr-code/?data='+route_id.code+'-'+item.folio+'&size=250x250'" alt="Maquina">
                    </div>
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
export default {
  name:'Maquinas',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      selected:null,
      ultimo:0,
      filtros:null,
      rutero:null,
      route_id:null,
      headers: [
        {
          text: 'Folio',
          align: 'start',
          value: 'folio',
        },
        { text: 'Tipo de juego', value: 'game_type' },
        { text: 'Punto de venta', value: 'point_of_sale_id.pos_name' },
        { text: 'Fondo real', value: 'real_fund' },
        { text: 'Tipo de entrada', value: 'money_type' },
        // { text: 'Acciones', value: 'actions', sortable: false },
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
      
    },
    mounted(){
      ApiService.filtrosCortes().then(respa =>{
        this.filtros=respa.data
      })
      // this.reporte()
    },
    methods: {
      buscarRutero(){
        this.rutero=this.filtros.users.find(x => x.route_id== this.route_id.id)
        this.initialize()
      },
      buscarRuta(){
        this.route_id = this.filtros.routes.find(x => x.id == this.rutero.route_id)
        this.initialize()
      },
      initialize () {
        this.loading=true
        ApiService.MaquinaXruta(this.route_id.id).then(maquinas =>{
          // maquinas=maquinas.data.map(m =>{
          //   if(m.type==1){
          //     m.type='PRODUCTO'
          //   }
          //   return m
          // })
          this.maquinas = maquinas.data
          this.loading=false
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
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        
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
      }
    },
}
</script>
<style>
.v-application .headline {
  letter-spacing: unset;
}
</style>