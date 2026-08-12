<template>
  <div class="led-box">
    <div class="led-light"  :class="connected ? 'led-green' : 'led-red'"></div>
    <p>{{ connected ? '' : 'Not ' }}Connected</p>
  </div>
</template>
<script>
  export default {
    computed: {
      connected() {
        return this.$store.getters['connected']
      }
    }
  }
</script>
<style scoped>
  .led-box { height: 30px; width: 100%; margin: 50px 0; }
  .led-box p { font-size: 12px; text-align: center; margin: 1em; }
  .led-light { margin: 0 auto; width: 24px; height: 24px; border-radius: 50%; }
  .led-red { background-color: #f00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px; }
  .led-green { background-color: #abff00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89ff00 0 2px 12px; }
</style>