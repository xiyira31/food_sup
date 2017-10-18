<template>
<div class="sidebar not-print">
  <el-menu router :default-openeds="openeds">
    <el-submenu index="1">
      <template slot="title">管理</template>
      <el-menu-item v-if="allows.indexOf(1) > -1" :index= "'/home/company'"><i class="el-icon-plus"></i>公司管理</el-menu-item>   
      <el-menu-item v-if="allows.indexOf(2) > -1" :index= "'/home/type'"><i class="el-icon-setting"></i>品类管理</el-menu-item>
      <el-menu-item v-if="allows.indexOf(3) > -1" :index= "'/home/school'"><i class="el-icon-plus"></i>学校管理</el-menu-item>
      <el-menu-item v-if="allows.indexOf(4) > -1" :index= "'/home/producer'"><i class="el-icon-plus"></i>供应商管理</el-menu-item>
      <el-menu-item v-if="allows.indexOf(5) > -1" :index= "'/home/product'"><i class="el-icon-plus"></i>商品管理</el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">订单管理</template>
      <el-menu-item v-if="allows.indexOf(6) > -1" :index= "'/home/dailyPrice'"><i class="el-icon-date"></i>每日价格</el-menu-item>
      <el-menu-item v-if="allows.indexOf(7) > -1" :index= "'/home/order'"><i class="el-icon-date"></i>订单录入</el-menu-item>
      <el-menu-item v-if="allows.indexOf(8) > -1" :index= "'/home/orderModify'"><i class="el-icon-date"></i>订单修改</el-menu-item>
      <el-menu-item v-if="allows.indexOf(9) > -1" :index= "'/home/orderPrint'"><i class="el-icon-upload"></i>订单打印</el-menu-item>
      <el-menu-item v-if="allows.indexOf(15) > -1" :index= "'/home/checkOrder'"><i class="el-icon-upload"></i>订单复核</el-menu-item>
      <el-menu-item v-if="allows.indexOf(7) > -1" :index= "'/home/orderShow'"><i class="el-icon-upload"></i>订单查询</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">汇总管理</template>
      <el-menu-item v-if="allows.indexOf(10) > -1" :index= "'/home/schoolSummary'"><i class="el-icon-date"></i>学校汇总</el-menu-item>
      <el-menu-item v-if="allows.indexOf(11) > -1" :index= "'/home/typeSummary'"><i class="el-icon-date"></i>品类汇总</el-menu-item>
      <el-menu-item v-if="allows.indexOf(12) > -1" :index= "'/home/producerSummary'"><i class="el-icon-upload"></i>供应商汇总</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">系统管理</template>
      <el-menu-item v-if="allows.indexOf(13) > -1" :index= "'/home/user'"><i class="el-icon-upload"></i>员工管理</el-menu-item>
      <el-menu-item v-if="allows.indexOf(14) > -1" :index= "'/home/role'"><i class="el-icon-upload"></i>角色管理</el-menu-item>
      <el-menu-item v-if="allows.indexOf(14) > -1" :index= "'/home/dataBackup'"><i class="el-icon-upload"></i>数据备份</el-menu-item>
    </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  data () {
    return {
      openeds: ['2'],
      allows: []
    }
  },
  mounted () {
    this.fetchUserInfo()
  },
  methods: {
    fetchUserInfo () {
      this.$http.get('/getInfo', {
        params: {
          username: sessionStorage.getItem('user')
        }
      }).then(res => {
        let permissions = []
        res.data.user._role.permissions.forEach(function (permission) {
          if (permission.allowed === 1) {
            permissions.push(permission.model)
          }
        })
        this.allows = permissions
      })
    }
  }
}
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 60px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
