/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App está en almacenada y lista en Caché.\n' +
        'Mas detalles en: https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Servicio de trabajo registrado.')
    },
    cached () {
      console.log('Éste contenido se está renderizando de lo que está guardado en Caché')
    },
    updatefound () {
      console.log('El contenido nuevo se está descargando')
    },
    updated () {
      console.log('Hay disponible una actualización, favor de actualizar')
      this.$bus.$emit('actualizacion', 'Hay disponible una actualización, favor de actualizar')
    },
    offline () {
      console.log('No se encontró conexión a internet, la App se está ejecuntando de forma Offline')
      this.$bus.$emit('offline', 'No se encontró conexión a internet, la App se está ejecuntando de forma Offline')
    },
    error (error) {
      console.error('No se pudo registrar el servicio, motivo:', error)
    }
  })
}
