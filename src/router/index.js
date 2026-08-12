import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Inicio from '../components/pages/Inicio.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue'),
    children:[
      // {
      //   path: '/dashboard/registro',
      //   name: 'Registro',
      //   component: () => import('../components/pages/Registro.vue'),
      //   meta: { title: 'Registro - GameZone' }
      // },
      {
        path: '/dashboard/catalogo',
        name: 'Catalogo',
        component: () => import('../components/pages/Catalogos.vue'),
        meta: { title: 'Catalogo - GameZone' },
        children:[
          {
            path: '/dashboard',
            name: 'resumen',
            component: Inicio,
            meta: { title: 'Resumen - GZ' },
          },{
            path: '/dashboard/catalogo/flujo',
            name: 'flujo',
            component: () => import('../components/pages/Flujos.vue'),
            meta: { title: 'Catalogo General - GZ' },
          },{
            path: '/dashboard/catalogo/rutas',
            name: 'rutas',
            component: () => import('../components/Tablas/Rutas.vue'),
            meta: { title: 'Catalogo de Rutas - GZ' },
          },{
            path: '/dashboard/catalogo/tipos-de-maquina',
            name: 'tiposMkn',
            component: () => import('../components/Tablas/TiposMkn.vue'),
            meta: { title: 'Catalogo de Tipos de maquina - GZ' },
          },{
            path: '/dashboard/catalogo/folios',
            name: 'folios',
            component: () => import('../components/Tablas/Folios.vue'),
            meta: { title: 'Folios - GZ' },
          },

        ]
      },
      {
        path: '/dashboard/reportes',
        name: 'Reportes',
        component: () => import('../components/pages/Reportes.vue'),
        meta: { title: 'Reportes - GameZone' },
        children:[
          {
            path: '/dashboard/reportes/general',
            name: 'rGeneral',
            component: () => import('../components/pages/Reportes.vue'),
            meta: { title: 'Reporte General - GZ' },
          },{
            path: '/dashboard/reportes/gastos',
            name: 'rGastos',
            component: () => import('../components/pages/Reportes.vue'),
            meta: { title: 'Reporte de Gastos - GZ' },
          },{
            path: '/dashboard/reportes/cortes',
            name: 'rCortes',
            component: () => import('../components/pages/Reportes.vue'),
            meta: { title: 'Reporte de Cortes - GZ' },
          },

        ]
      },
    ]
  },
  {
    path: '/rutero',
    name: 'Rutero',
    component: () => import(/* webpackChunkName: "about" */ '../views/Rutero.vue'),
    children:[
      {
        path: '/rutero',
        name: 'ruMovimientos',
        component: () => import('../components/pages/Movimientos.vue'),
        meta: { title: 'Rutero - GameZone' }
      },
      // {
      //   path: '/rutero/online',
      //   name: 'ruCortes',
      //   component: () => import('../components/Conectivity.vue'),
      //   meta: { title: 'Rutero - GameZone' }
      // },
      // {
      //   path: '/rutero/premios',
      //   name: 'ruPremios',
      //   component: () => import('../components/pages/Cortes.vue'),
      //   meta: { title: 'Rutero - GameZone' },
      // },
      // {
      //   path: '/rutero/inicio',
      //   name: 'inicio',
      //   component: Inicio,
      //   meta: { title: 'Inicio - GameZone' },
      // },
    ]
  }
]

const router = new VueRouter({
  routes,
  // mode: 'history',
  // base: process.env.BASE_URL,
})
const DEFAULT_TITLE = 'GameZone';
router.afterEach((to) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});
export default router
