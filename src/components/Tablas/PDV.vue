<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="pdvs"
          :search="search"
          sort-by="type"
          v-model="selected"
          :single-select="true"
          show-select
          item-key="id"
          class="elevation-1"
          :loading="loading"
          loading-text="Obteniendo los puntos de venta de la ruta, un momento..."
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Puntos de venta de la ruta: <b>{{code}}</b></v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search" class="mr-3"
                  append-icon="mdi-magnify"
                  label="Buscar en Punto de venta"
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
                            v-model="editedItem.pos_name"
                            label="Nombre"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.manager_name"
                            label="Encargado"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                        >
                          <v-text-field
                            v-model="editedItem.address"
                            label="Dirección"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.phone_number"
                            label="Numero del contacto"
                            counter="10"
                            type="number"
                            max="10"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.sales_comission"
                            label="Comisión por venta"
                            type="number"
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
                  <v-card-title class="headline">¿Seguro de eliminar esta Punto de venta?</v-card-title>
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
          <template v-slot:no-data>
            <!-- <v-btn
              color="primary"
              @click="initialize"
            >
              Reiniciar
            </v-btn> -->
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  
</template>
<script>

import ApiService from '../../service/apis'
export default {
  name:'Punto-de-venta',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      selected:null,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'pos_name',
        },
        { text: 'Dirección', value: 'address' },
        { text: 'Encargado', value: 'manager_name' },
        { text: 'Teléfono', value: 'phone_number' },
        { text: 'Comision', value: 'sales_comission' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      pdvs: [],
      tipo:[{_id:1,name:'Producto'}],
      editedIndex: -1,
      editedItem: {
        geotag: null
      },
      defaultItem: {
        geotag: null
      },
      loading:false
    }),
    props:{
      ruta: Number,
      code: Number
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Alta de nuevo Punto de venta' : 'Modificar Punto de venta'
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
    updated(){
      this.evento()
    },
    methods: {
      evento(){
        this.$emit('puntodventa', this.selected)
      },
      initialize () {
        this.loading=true
        ApiService.PuntoXruta(this.ruta).then(pdvs =>{
          // pdvs=pdvs.data.map(m =>{
          //   if(m.type==1){
          //     m.type='PRODUCTO'
          //   }
          //   return m
          // })
          this.pdvs = pdvs.data
          this.loading=false
        })
      },

      editItem (item) {
        this.editedIndex = this.pdvs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.id=item._id
      },

      deleteItem (item) {
        this.editedIndex = this.pdvs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        let borrar = {
          id: this.editedItem.id
        }
        ApiService.pdvBorrar(borrar).then(res =>{
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
          
          ApiService.pdvEditar(this.editedItem).then(res =>{
            if(res){
              this.initialize()
              this.close()
            }
          })
        } else {
          this.editedItem.route_id = this.ruta
          ApiService.pdvNuevo(this.editedItem).then(res =>{
            if(res){
              this.initialize()
              this.close()
            }

          })
        }
        this.initialize()
      },
    },
}
</script>
<style>
.v-application .headline {
  letter-spacing: unset;
}
</style>