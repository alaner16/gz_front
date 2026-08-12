import api from './api'
let service = {}

service.logIn = function (info) {
  return api.post('/api/auth/sign_in', info).then(res => res)
}
service.rutasPorUsuario = function (info) {
  return api.get('/saleRevision/routes_configuration?user_id='+ info).then(res => res).catch(err => {
    console.log(err)
  })
}
service.sincronizarMovimientos = function (info) {
  return api.post('/saleRevision/save_array', {params:{obj:info}}).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
//Reportes
service.filtrosCortes = function () {
  return api.get('/saleRevision/getFilters').then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.reporteCortes = function (info) {
  return api.get('/saleRevision/getSalesRevision', {params: info}).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.getAllRutas = function () {
  return api.get('/routes/getAll').then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.getAllRuteros = function () {
  return api.get('/roadmen/getAll').then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.ruteroNuevo = function (rutero) {
  return api.post('/roadmen/create', {obj:rutero}).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.ruteroEditar = function () {
  return api.post('/roadmen/update').then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.getAllPuntodeVenta = function () {
  return api.get('/pointOfSales/getAll').then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.putReporte = function (obj) {
  return api.put('/saleRevision/editSaleRevision',obj).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}


//Catalogos
service.getUsuarios = function () {
  return api.get('/usuarios/getURR').then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.editarUsuarios = function (obj) {
  return api.put('/usuarios/updateURR',obj).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.nuevoUsuario = function (rutero) {
  return api.post('/usuarios/createURR', rutero).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.usuarioBorrar = function (user) {
  return api.put('/usuarios/deleteUser', user).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.PuntoXruta = function (ruta) {
  return api.get('/pointOfSales/getByRoute?routeId='+ruta).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.pdvEditar = function (punto) {
  return api.post('/pointOfSales/update', {obj:punto}).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.pdvNuevo = function (punto) {
  return api.post('/pointOfSales/create', {obj:punto}).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.pdvBorrar = function (maquina) {
  return api.post('/pointOfSales/delete', maquina).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.MaquinaXpunto = function (punto) {
  return api.get('/gameMachines/getByPointOfSale?point_of_sale_id='+punto).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.MaquinaXruta = function (ruta) {
  return api.get('/gameMachines/getMachinesByRouteId?route_id='+ruta).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.MaquinaSiguiente = function (ruta) {
  return api.get('/gameMachines/getNextInvoice?routeId='+ruta).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.maquinaEditar = function (makina) {
  return api.post('/gameMachines/update', {obj:makina}).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.maquinaNuevo = function (makina) {
  return api.post('/gameMachines/create', {obj:makina}).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.maquinaBorrar = function (maquina) {
  return api.post('/gameMachines/delete', maquina).then(res => res.data).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.tipoMknNuevo = function (tipoMkn) {
  return api.post('/gameMachineType/create', {obj:tipoMkn}).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.tipoMknEditar = function (tipoMkn) {
  return api.post('/gameMachineType/update', {obj:tipoMkn}).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.tipoMknBorrar = function (tipoMkn) {
  return api.post('/gameMachineType/delete', {id:tipoMkn}).then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.getTiposMkn = function () {
  return api.get('/gameMachineType/getAll').then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
service.getResumen = function () {
  return api.get('/saleRevision/getDashboard').then(res => res).catch(err => {
    console.log(err)
    // alert(err.data.message)
  })
}
export default service