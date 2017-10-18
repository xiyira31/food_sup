<template>
  <div>
    {{orderId}}
    <el-table
      v-loading.body="loading">
      <el-table-column>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: [
    'orderId'
  ],
  data () {
    return {
      details: [],
      loading: true
    }
  },
  mounted () {
    this.$http.get('/order/lookupDetaiById', {
      order: this.orderId
    }).then(res => {
      this.loading = false
      this.details = res.data.details
      console.log(this.details)
    })
  }
}
</script>

<style scoped>

</style>
