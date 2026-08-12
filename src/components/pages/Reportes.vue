<template>
  <div>
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-if="reporte != 1"
            
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                range
                label="Rango de fechas"
                prepend-icon="mdi-calendar"
                readonly
                outlined
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" range no-title scrollable :max="hoy">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="date = []">
                LIMPIAR
              </v-btn>
              <v-btn text color="primary" @click="menu = false">
                CANCELAR
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                ACEPTAR
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
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
            :items="filtros.game_machines.filter(x=>x.route_id==this.route_id.id)"
            label="Folio de maquina"
            outlined
            dense
            item-text="folio"
            prepend-icon="mdi-slot-machine"
            item-value="id"
            clearable
            v-model="maquina"
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
        <v-col md="1">
          <v-btn small fab color="red" @click="reporte" :disabled="date[0]===undefined" :loading="loading">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-chip class="ma-2" v-if="equipos_asignados">
          Equipos asignados: {{equipos_asignados}}
        </v-chip>
        <v-chip class="ma-2" v-if="total_utilidad!==undefined">
          Total utilidad: {{total_utilidad}}
        </v-chip>
        <v-chip class="ma-2" v-if="datos">
          Total de cortes: {{datos.length}}
        </v-chip>
      </v-row>
      <v-row>
        <v-col >
          <DataTable :value="datos" :filters="filters" :paginator="true" :rows="10" removableSort ref="tablaReporte" :loading="loading" dataKey="id"  class="p-datatable-responsive-demo" @row-select="onRowSelect" @row-unselect="onRowUnselect" :selection.sync="seleccionado" selectionMode="single" :scrollable="true"  style="width: auto" :expandedRows.sync="expandedRows" :rowsPerPageOptions="[10,20,50]">
          <template #header>
            <span class="p-input-icon-left float-md-left">
                <v-icon style="position:relative; left:35px;top:3px">mdi-magnify</v-icon>
                <InputText v-model="filters['global']" placeholder="Buscar" class="p-inputtext-sm" />
            </span>
            <div style="text-align: right">
              <Button class="btn btn-success" label="Export" @click="exportCSV($event)"><span class="d-none d-sm-none d-md-block">Exportar a Excel</span> <v-icon>mdi-file-excel</v-icon></Button>
            </div>
          </template>
          <template #empty>
              Sin datos encontrados con estos parametros de busqueda.
          </template>
          <template #loading>
              Recolectando los datos del servidor.
          </template>
          <Column :expander="true" headerStyle="width: 3em" />
          <Column v-for="col of encabezados" :field="col.value" :header="col.text" :key="col.value" :sortable="true" headerStyle="width: 150px" >
            <template #body="hola" class="columna">
              <div v-if="col.text!='Movimiento'">
                <span class="p-column-title">{{col.text}}</span>
                {{hola.data[col.value]}}
              </div>
              <div v-else>
                <v-chip v-if="hola.data.status==1" color="success">Corte</v-chip>
                <v-chip v-else-if="hola.data.status==2" color="error">Premio</v-chip>
                <v-chip v-else color="info">Visita</v-chip>
              </div>
            </template>
             <template #editor="slotProps">
                <InputText v-model="slotProps.data[slotProps.column.field]" />
            </template>
          </Column>
          <Column :rowEditor="true" headerStyle="width:7rem; color:red" bodyStyle="text-align:center"></Column>
          <template #expansion="slotProps">
            <v-row>
              <v-col>
                <v-carousel class="carruselTabla">
                  <v-carousel-item contain
                    :src="slotProps.data.evidence1"
                  ></v-carousel-item>
                  <v-carousel-item contain
                    :src="slotProps.data.evidence2"
                  ></v-carousel-item>
                  <v-carousel-item>
                    <iframe
                      style="border:0"
                      class="mapa"
                      loading="lazy"
                      allowfullscreen
                      :src="'https://www.google.com/maps/embed/v1/place?key=AIzaSyCE1yq1ic0MHVU7AYsUo9jdfzPooTBmx-Q&q='+ slotProps.data.coordenadas.geometry.coordinates[1] + ','+slotProps.data.coordenadas.geometry.coordinates[0]">
                    </iframe>
                  </v-carousel-item>
                </v-carousel>
              </v-col>
            </v-row>
        </template>
        </DataTable>
        </v-col>
      </v-row>
    </v-container>
    <Dialog :visible.sync="modal" :closable="false" >
      <template #header>
        <h3>Editar corte</h3>
      </template>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Pantalla actual"
              outlined
              v-model="seleccionado.screen_number"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Entrada actual"
              outlined
              v-model="seleccionado.input_read"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Salida actual"
              outlined
              v-model="seleccionado.output_read"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Pantalla sistema"
              outlined
              v-model="seleccionado.screen_system"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Sacado sistema"
              outlined
              v-model="seleccionado.game_machine_output"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Comisión pagada"
              outlined
              v-model="seleccionado.sales_commission_amount"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Fondo real"
              outlined
              v-model="seleccionado.real_fund"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Total marcadores"
              outlined
              disabled
              :value="((parseInt(this.seleccionado.input_read) - (this.seleccionado.input_read_lr))-(parseInt(this.seleccionado.output_read) - (this.seleccionado.output_read_lr)))"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <v-text-field
              label="Faltante / Sobrante"
              outlined
              disabled
              :value="(parseInt(seleccionado.game_machine_output) - ((parseInt(this.seleccionado.input_read) - (this.seleccionado.input_read_lr))-(parseInt(this.seleccionado.output_read) - (this.seleccionado.output_read_lr))))"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              label="Comentarios"
              outlined
              v-model="seleccionado.comments"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <template #footer>
        <v-btn
          color="red"
          @click="reporte();modal=false"
        >
          <v-icon left>
            mdi-cancel
          </v-icon>
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          @click="editarReporte()"
        >
          <v-icon left>
            mdi-content-save
          </v-icon>
          Guardar
        </v-btn>
      </template>
    </Dialog>
  </div>
</template>
<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Servicio from '../../service/apis'
import Dialog from "primevue/dialog"
export default {
  name:'Reportes',
  components: {
    'DataTable': DataTable,
    'Column': Column,
    'InputText': InputText,
    'Dialog': Dialog
  },
  data() {
    return{
      modal:false,
      editingRows: [],
      expandedRows: [],
      seleccionado: {},
      clon:{},
      inicio: null,
      fin: null,
      date: [],
      hoy: new Date().toISOString().substr(0, 10),
      menu:false,
      route_id:{id:null},
      maquina:null,
      tienda:null,
      rutero:null,
      filters: {},
      loading: false,
      equipos_asignados:null,
      total_utilidad:null,
      rutas:[
        {
          name:'rGeneral',
          tittle: 'General'
        },
        {
          name:'rCortes',
          tittle: 'Cortes'
        },
        {
          name:'rGastos',
          tittle: 'Gastos'
        },
      ],
      search: '',
      encabezados: [
        {
          text: 'Reporte',
          align: 'start',
          filterable: false,
          value: 'created_at',
        },
        // { text: 'Ruta', value: 'code' },
        // { text: 'Nombre tienda', value: 'pos_name' },
        // { text: 'Folio', value: 'folio' },
        // { text: 'Pantalla actual', value: 'screen_number' },
        // { text: 'Entrada actual', value: 'input_read' },
        // { text: 'Salida actual', value: 'output_read' },
        // { text: 'Sistema Contadores', value: 'contadores' },
        // { text: 'Sacado maquina', value: 'game_machine_output' },
        // { text: 'Comision pagada', value: 'sales_commission_percentage' },
        // { text: 'Faltante/ Sobrante', value: 'faso' },
        // { text: 'Fondo Real', value: 'game_machine_fund' },
        // { text: 'Comentarios', value: 'comments' },
      ],
      datos: [],
      filtros: {routes:[],game_machines:[],users:[],point_of_sales:[]}
    }
  },
  computed: {
    dateRangeText() {
      return this.date.join(" ~ ");
    },
  },
  mounted(){
    Servicio.filtrosCortes().then(respa =>{
      this.filtros=respa.data
    })
    // this.reporte()
  },
  methods: {
    buscarRutero(){
      this.rutero=this.filtros.users.find(x => x.route_id== this.route_id.id)
    },
    buscarRuta(){
      this.route_id = this.filtros.routes.find(x => x.id == this.rutero.route_id)
    },
    onRowSelect() {
      if(this.seleccionado!=null){
        this.modal=true
        
      }else{
          this.onRowUnselect()
      }
    },
    onRowUnselect() {
      this.modal=false
      this.seleccionado = null
      this.reporte()
    },
    reporte(){
      this.loading = true
      this.encabezados = [
        {
          text: 'Fecha',
          // align: 'start',
          // filterable: false,
          value: 'fecha',
        },
        { text: 'Movimiento', value: 'status' },
        { text: 'Ruta', value: 'code' },
        { text: 'Nombre tienda', value: 'pos_name' },
        { text: 'Folio', value: 'folio' },
        { text: 'Tipo maquina', value: 'game_type' },
        { text: 'Usuario', value: 'username' },
        { text: 'Pantalla anterior', value: 'screen_number_lr' },
        { text: 'Entrada anterior', value: 'input_read_lr' },
        { text: 'Salida anterior', value: 'output_read_lr' },
        { text: 'Pantalla actual', value: 'screen_number' },
        { text: 'Entrada actual', value: 'input_read' },
        { text: 'Salida actual', value: 'output_read' },
        { text: 'Total entrada', value: 'total_input' },
        { text: 'Total salida', value: 'total_output' },
        { text: 'Pantalla sistema', value: 'screen_system' },
        { text: 'Sistema Contadores', value: 'counts_system' },
        { text: 'Sacado maquina', value: 'game_machine_output' },
        { text: 'Comision pagada', value: 'sales_commission_amount' },
        { text: 'Faltante / Sobrante', value: 'missing' },
        { text: 'Utilidad', value: 'utilidad' },
        { text: 'Fondo real', value: 'real_fund' },
        { text: 'Fondo neto', value: 'game_machine_fund' },
        { text: 'Comentarios', value: 'comments' }
      ]
      var moment = require('moment')
      moment.locale('es')
      let obj = {start: (moment(this.date[0])>moment(this.date[1]))?this.date[1]:this.date[0], end: this.date[1]===undefined?this.date[0]:(moment(this.date[0])>moment(this.date[1]))?this.date[0]:this.date[1], route_id:this.route_id?this.route_id.id:null, game_machine_id: this.maquina, user_id: this.rutero?this.rutero.id:null}
      Servicio.reporteCortes(obj).then(respa =>{
        
        
        
        respa.data.report.map(x=>{
          x.fecha=moment(x.date).format('lll')
        })
        this.datos = respa.data.report
        this.total_utilidad = respa.data.total_utilidad?parseFloat(respa.data.total_utilidad).toFixed(2):false
        this.equipos_asignados = respa.data.equipos_asignados
      }).finally(()=>{
        this.loading = false;
      })
    },
    exportCSV() {
      this.$refs.tablaReporte.exportCSV()
    },
    onRowExpand(event) {
        // this.$toast.add({severity: 'info', summary: 'Row Expanded', detail: 'Vin: ' + event.data.vin, life: 3000});
        console.log(event)
    },
    onRowCollapse(event) {
        // this.$toast.add({severity: 'success', summary: 'Row Collapsed', detail: 'Vin: ' + event.data.vin, life: 3000});
        console.log(event)
    },
    editarReporte(){
      this.seleccionado.total_input_read= parseInt(this.seleccionado.input_read) - (this.seleccionado.input_read_lr),
      this.seleccionado.total_output_read= parseInt(this.seleccionado.output_read) - (this.seleccionado.output_read_lr),
      this.seleccionado.total_markers = parseInt(this.seleccionado.total_input_read) - parseInt(this.seleccionado.total_output_read)
      this.seleccionado.missing = parseInt(this.seleccionado.game_machine_output) - parseInt(this.seleccionado.total_markers)
      Servicio.putReporte(this.seleccionado).then(resp=>{
        if(resp){
          this.seleccionado=resp
          this.modal=false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.v-image__image--cover {
    background-size: contain!important;
  }
</style>
<style lang="postcss">
.p-datatable-responsive-demo .p-datatable-tbody > tr > td .p-column-title {
    display: none;
}
.carruselTabla{
  width: 90vw;
  
}
.mapa{
  width: 90vw;
  height: 445px;
}
@media screen and (max-width: 40em) {
  .row /deep/ .p-datatable {
        &.p-datatable-responsive-demo {
            .p-datatable-thead > tr > th,
            .p-datatable-tfoot > tr > td {
                display: none !important;
            }

            .p-datatable-tbody > tr > td {
                text-align: left;
                display: block;
                width: 100%;
                float: left;
                clear: left;
                border: 0 none;

                .p-column-title {
                    padding: .4rem;
                    min-width: 30%;
                    display: inline-block;
                    margin: -.4em 1em -.4em -.4rem;
                    font-weight: bold;
                }

                &:last-child {
                    border-bottom: 1px solid var(--surface-d);
                }
            }
        }
    }
}
</style>
