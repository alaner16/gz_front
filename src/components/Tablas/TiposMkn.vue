<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="tipos"
          :search="search"
          sort-by="type"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Tipo de Maquinas</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search" class="mr-3"
                  append-icon="mdi-magnify"
                  label="Buscar tipos"
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
                          
                        >
                          <v-text-field
                            v-model="editedItem.description"
                            label="Tipo"
                            required
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
                  <v-card-title class="headline">¿Seguro de eliminar esta Tipo de Maquina?</v-card-title>
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
  name:'Tipo-de-Maquina',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      headers: [
        { text: 'ID', value: 'id' },
        {
          text: 'Tipo',
          align: 'start',
          value: 'description',
        },
        { text: 'Alta', value: 'fecha' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      tipos: [],
      tipo:[{_id:1,name:'Producto'}],
      editedIndex: -1,
      editedItem: {
        user_id: 0,
        salary: 0,
        agent_comission: 0,
      },
      defaultItem: {
        user_id: 0,
        salary: 0,
        agent_comission: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Alta de nuevo Tipo de Maquina' : 'Modificar Tipo de Maquina'
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
        var moment = require('moment')
              moment.locale('es')
        ApiService.getTiposMkn().then(tipos =>{
          tipos.data.map(x=>{
            x.fecha=moment(x.created_at).format('lll')
          })
          this.tipos = tipos.data
        })
      },

      editItem (item) {
        this.editedIndex = this.tipos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.id=item.id
      },

      deleteItem (item) {
        this.editedIndex = this.tipos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        ApiService.tipoMknBorrar(this.editedItem.id).then(res =>{
            console.log(res.data)
            if(res.status<400){
              this.initialize()
              this.close()
            }
          })
        this.closeDelete()
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
          
          ApiService.tipoMknEditar(this.editedItem).then(res =>{
            console.log(res.data)
            if(res.status<400){
              this.initialize()
              this.close()
            }
          })
        } else {
          //this.sucursales.push(this.editedItem)
          ApiService.tipoMknNuevo(this.editedItem).then(res =>{
            console.log(res.data)
            if(res.status<400){
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