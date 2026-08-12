<template>
  <div>
    <!-- @detected-condition fires when the connectivity status of the device changes -->
  <offline @detected-condition="handleConnectivityChange">
    <!-- Only renders when the device is online -->

    <!-- <div class="led-box">
      <div class="led-light"
            :class="handleConnectivityChange ? 'led-green' : 'led-red'"></div>
      <p>{{ handleConnectivityChange ? '' : 'Not ' }}Connected</p>
    </div> -->
   <div v-if="enLinea" slot="online" class="ml-2">
      🟢 En linea
    </div>
  </offline>
   
    <div v-show="!enLinea" slot="offline" class="ml-2">
      🔴 Sin red
    </div>
  </div>
</template>

<script>
import offline from 'v-offline';
import idb from '@/service/idb';
export default {
  name: 'Offline',
  components: {
    offline
  },
  data: () => ({
    enLinea: true
  }),
  updated(){
    // this.enLinea = this.handleConnectivityChange()
  },
  methods: {
    async handleConnectivityChange(status) {
      console.log("online: ",status);
      await idb.put({online: status, id: 1}, "online")
      this.$forceUpdate()
      this.enLinea = status
      return status
    }
  }
}
</script>

<style scoped>
  .led-box { height: 10px; width: 100%; margin: 10px 0; display: grid }
  .led-box p { font-size: 12px; text-align: center; margin: 1em; }
  .led-light { margin: 0 auto; width: 24px; height: 24px; border-radius: 50%; }
  .led-red { background-color: #f00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px; }
  .led-green { background-color: #abff00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89ff00 0 2px 12px; }
</style>