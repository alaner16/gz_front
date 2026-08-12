<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="pdvs"
          :search="search"
          sort-by="type"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Rutas</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search" class="mr-3"
                  append-icon="mdi-magnify"
                  label="Buscar pdvs"
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
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.name"
                            label="Nombre"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-text-field
                            v-model="editedItem.description"
                            label="Descripción"
                            v-uppercase
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-select
                            v-model="editedItem.type"
                            :items="tipo"
                            item-text="name"
                            item-value="_id"
                            label="Tipo"
                            persistent-hint
                            single-line
                          ></v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="4"
                        >
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
                  <v-card-title class="headline">¿Seguro de eliminar esta Ruta?</v-card-title>
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
  name:'Rutas',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Descripción', value: 'description' },
        { text: 'Tipo', value: 'type' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      pdvs: [],
      tipo:[{_id:1,name:'Producto'}],
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        type: '',
      },
      defaultItem: {
        name: '',
        description: '',
        type: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Alta de nuevo Ruta' : 'Modificar Ruta'
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
        ApiService.pdv().then(pdvs =>{
          pdvs=pdvs.data.map(m =>{
            if(m.type==1){
              m.type='PRODUCTO'
            }
            return m
          })
          this.pdvs = pdvs
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
        this.pdvs.splice(this.editedIndex, 1)
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
          
          ApiService.pdvEditar(this.id, this.editedItem).then(res =>{
            console.log(res.data)
            if(res.status<400){
              this.initialize()
              this.close()
            }
          })
        } else {
          //this.sucursales.push(this.editedItem)
          ApiService.pdvNuevo(this.editedItem).then(res =>{
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