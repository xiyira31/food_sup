<template>
  <el-menu theme="dark" class="el-menu-demo not-print" mode="horizontal" router>
    <el-menu-item :index="'/home'" class="title">{{title}}</el-menu-item>
    <el-submenu index="2" class="right">
      <template slot="title"><i class="el-icon-menu"></i></template>
      <el-menu-item :index="'/login'">登出</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  data () {
    return {
      title: ''
    }
  },
  mounted () {
    const _this = this
    _this.$http.get('/main').then(function (res) {
      _this.title = res.data.websiteName
    })
  }
}
</script>
<style scoped>
.title {
  font-size:20px;
  font-weight: bold;
  color:white;
}
.right {
  float: right;
}
</style>
