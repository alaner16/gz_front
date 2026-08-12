<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="ruteros"
          :search="search"
          sort-by="type"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Ruteros</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                  v-model="search" class="mr-3"
                  append-icon="mdi-magnify"
                  label="Buscar ruteros"
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
                            v-model="editedItem.user_id"
                            label="ID"
                            type="tel"
                            pattern="[0-9]"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          
                        >
                          <v-text-field
                            v-model="editedItem.salary"
                            label="Salario"
                            type="tel"
                            pattern="[0-9]"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          
                        >
                          <v-text-field
                            v-model="editedItem.agent_comission"
                            label="Comision"
                            type="tel"
                            pattern="[0-9]"
                            required
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
                  <v-card-title class="headline">¿Seguro de eliminar esta Rutero?</v-card-title>
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
  name:'Ruteros',
  data: () => ({
      dialog: false,
      dialogDelete: false,
      search:null,
      headers: [
        { text: 'ID', value: 'id' },
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'first_name',
        },
        { text: 'Apellidos', value: 'last_name' },
        { text: 'Comision', value: 'agent_comission' },
        { text: 'Salario', value: 'salary' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      ruteros: [],
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
        return this.editedIndex === -1 ? 'Alta de nuevo Rutero' : 'Modificar Rutero'
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
        ApiService.getAllRuteros().then(ruteros =>{
          this.ruteros = ruteros
        })
      },

      editItem (item) {
        this.editedIndex = this.ruteros.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.id=item.id
      },

      deleteItem (item) {
        this.editedIndex = this.ruteros.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        ApiService.ruteroBorrar(this.id, this.editedItem).then(res =>{
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
          
          ApiService.ruteroEditar(this.id, this.editedItem).then(res =>{
            console.log(res.data)
            if(res.status<400){
              this.initialize()
              this.close()
            }
          })
        } else {
          //this.sucursales.push(this.editedItem)
          ApiService.ruteroNuevo(this.editedItem).then(res =>{
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