<template>
  <div class="title" style="color:#666;">
    这个是全局组件
  </div>
</template>

<script>
export default {
  data() {
    return {
      //dynamicComponent: null
    }
  },

  mounted () {
      /*
    import('./lib-that-access-window-on-import').then(module => {
      this.dynamicComponent = module.default
    })
    */
  }
}
</script>

<style lang="sass" scoped>
.title
  font-size:20px
  color:#ff0000
  background-color:#f003

</style>