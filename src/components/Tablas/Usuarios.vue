<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="ruteros"
          :search="search"
          :single-select="true"
          show-select
          item-key="user_id"
          sort-by="type"
          class="elevation-1"
          :loading="loading"
          loading-text="Extrayendo a los ruteros desde la base de datos, un momento..."
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
                      <b>Datos de Usuario</b>
                      <v-row>
                        
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.email"
                            label="Correo electrónico"
                            type="email"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.username"
                            label="Nombre de usuario"
                            type="text"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.new_password"
                            label="Contraseña"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-select
                            v-model="editedItem.role"
                            :items="rol"
                            item-text="name"
                            item-value="_id"
                            label="Permisos"
                            persistent-hint
                            single-line
                          ></v-select>
                        </v-col>
                      </v-row>
                        <v-divider></v-divider>
                        <b>Datos de Rutero</b>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                        >
                          <v-text-field
                            v-model="editedItem.first_name"
                            label="Nombre (s)"
                            type="text"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                        >
                          <v-text-field
                            v-model="editedItem.last_name"
                            label="Apellidos"
                            type="text"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                        >
                          <v-text-field
                            v-model="editedItem.phone_number"
                            label="Teléfono"
                            type="number"
                            pattern="[0-9]"
                            counter="10"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          
                        >
                          <v-text-field
                            v-model="editedItem.salary"
                            label="Salario"
                            type="number"
                            pattern="[0-9]"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          
                        >
                          <v-text-field
                            v-model="editedItem.agent_comission"
                            label="Comision"
                            type="number"
                            pattern="[0-9]"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                        <v-divider></v-divider>
                        <b>Datos de la ruta</b>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                        >
                          <v-text-field
                            v-model="editedItem.code"
                            label="Ruta"
                            type="number"
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
                  <v-card-title class="headline">¿Seguro de eliminar este Rutero?</v-card-title>
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
      selected: [{}],
      search:null,
      headers: [
        { text: 'Usuario', align: 'start', value: 'username' },
        {
          text: 'Nombre',
          value: 'first_name',
        },
        { text: 'Apellidos', value: 'last_name' },
        { text: 'Comision', value: 'agent_comission' },
        { text: 'Salario', value: 'salary' },
        { text: 'Ruta', value: 'code' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      ruteros: [],
      rol:[{_id:0,name:'Admin'},{_id:1,name:'Coordinador'}, {_id:2,name:'Rutero'}],
      editedIndex: -1,
      show1:false,
      editedItem: {
        code: 1000,
        salary: 0,
        agent_comission: 0,
        user_type: null,
      },
      defaultItem: {
        code: 1000,
        salary: 0,
        agent_comission: 0,
        new_password: '12345678',
        user_type: null,
      },
      loading:false
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
    updated(){
      this.evento()
    },
    methods: {
      evento(){
        this.$emit('usuario', this.selected)
      },
      initialize () {
        this.loading=true
        ApiService.getUsuarios().then(ruteros =>{
          this.ruteros = ruteros.data
          this.loading=false
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
        let borrar = {
          id: this.editedItem.user_id
        }
        ApiService.usuarioBorrar(borrar).then(res =>{
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
          this.editedItem.uid=this.editedItem.email
          ApiService.editarUsuarios(this.editedItem).then(res =>{
            if(res){
              this.initialize()
              this.close()
            }
          })
        } else {
          this.editedItem.uid=this.editedItem.email
          ApiService.nuevoUsuario(this.editedItem).then(res =>{
            if(res){
              this.initialize()
              this.close()
            }

          })
        }
      },
    },
}
</script>
<style>
.v-application .headline {
  letter-spacing: unset;
}
</style>