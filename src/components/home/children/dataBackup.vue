<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item>数据备份</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="backup">
      备份
    </el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    backup: function () {
      this.$http.post('/backup', {}, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '备份成功'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
