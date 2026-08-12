<template>
  <v-app>
    <v-container dark>
      <v-row>
        <img class="ma-auto logo" alt="GZ" src="../assets/img_logo.png">
      </v-row>
    <v-row class="text-center">
      <v-col>
        <v-card max-width="360px" class="ma-auto">
          <v-card-title class="d-flex justify-center">
            <v-icon class="mr-2">mdi-login</v-icon> Acceso
          </v-card-title>
          <v-card-subtitle>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12" v-show="aviso" class="d-flex justify-center">
                    <v-alert color="orange" dismissible v-model="aviso">{{avisoMSJ}}</v-alert>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="user"
                      label="Usuario"
                      prepend-icon="mdi-account-circle-outline"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="pass"
                      :rules="passRules"
                      label="Contraseña"
                      prepend-icon="mdi-lock-outline"
                      required
                      @keypress.enter="loguear"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            counter
            @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                  >
                    <v-btn color="success" @click="loguear" :loading="loading">
                      Ingresar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-footer absolute bottom class="footerLogin">
    <b>v{{version}}</b>
    <Offline/>
  </v-footer>
  </v-app>
</template>
<style lang="scss">
.logo{
  width: 100%;
  padding: 2rem;
}
.footerLogin{
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
<script>
import servicios from '@/service/apis'
import {version} from '../../package'
import tema from '../service/tema'
import idb from '@/service/idb';
import Offline from "../components/Conectivity";

  export default {
    name: 'LogIn',

    data: () => ({
      valid: false,
      show1:false,
      aviso:false,
      avisoMSJ:null,
      user: '',
      pass: '',
      loading:false,
      version:version,
      passRules: [
        v => !!v || 'Contraseña es requerida',
        v => v.length >= 8 || 'Favor de ingresar una contraseña valida.',
      ],
      email: '',
      emailRules: [
        v => !!v || 'Correo electrónico necesario',
        v => /.+@.+/.test(v) || 'Favor de introducir un correo electrónico valido.',
      ],
    }),
    components: {
      Offline
    },
    methods:{
      async loguear(){
        let info ={
          username: this.user.toLowerCase(),
          password: this.pass
        }
        this.loading=true
        let status = await idb.get('online')
        if (status[0].online){
          servicios.logIn(info).then(async res =>{
            if(res){
              sessionStorage.setItem('token', res.data.token)
              servicios.rutasPorUsuario(res.data.data.id).then(data =>{
                localStorage.setItem('ruta', JSON.stringify(data.data))
                sessionStorage.setItem('data', JSON.stringify(res.data.data))
                sessionStorage.setItem('sesion', true)
                idb.save(res.data.data, 'user')
                data.data.id = 1
                idb.save(data.data, 'config')
                this.loading=false
                if(res.data.data.role==0){
                  this.$router.push('/dashboard')
                  tema.actualizarTema(true)
                }else{
                  this.$router.push('/rutero')
                  tema.actualizarTema(false)
                }
                this.$gtag.event('login',{
                  'event_category': 'login exitoso',
                  'event_label': res.data.data.username
                })

              })

            }else{
              
              this.loading=false
            }
          }).catch(err => {
            if (err.status>=400){
                this.aviso=true
                this.avisoMSJ=err.data
              }
              this.$gtag.event('errores',{
                'event_category': 'error',
                'event_label': err.data,
                'value': err.status
              })
              this.loading=false
          })
        }else{
          let user = await idb.get("user")
          if (user[0].username == info.username && '12345678' == info.password){
            let data = await idb.get("config")
            localStorage.setItem('ruta', JSON.stringify(data[0]))
            sessionStorage.setItem('sesion', true)
            this.loading=false
            if(user[0].role==0){
              this.$router.push('/dashboard')
              tema.actualizarTema(true)
            }else{
              this.$router.push('/rutero/inicio')
              tema.actualizarTema(false)
            }
          }
        }


      }
    }
  }
</script>
