<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
    <!-- <connection-light /> -->
    <alertas :alerta="alerta" :text="'Offline'" :color="'red'" />
  </div>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.v-card__title{
    word-break: inherit;
}
</style>
<script>
import Alertas from '@/components/Alertas.vue'
// import ConnectionLight from './components/ConnectionLight.vue'
export default {
  name:'GameZone',
  data(){
    return{
      alerta:false
    }
  },
  updated(){
    // this.$vuetify.theme.dark=tema.getTema()=='false'?false:true
  },
  created(){
    this.$vuetify.theme.dark=(screen.width>=560)
  },
  components:{
    Alertas,
    // ConnectionLight
  }
}
</script>
