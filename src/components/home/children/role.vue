<template>
<div>
  <el-row>
    <el-col :span="8">
      <el-card>
        <el-input v-model="roleName" style="width:200px"></el-input>
        <el-button @click="addNewRole">新增</el-button>
      </el-card>
      <el-table :data="roles">
        <el-table-column 
          prop="name"
          label="角色名">
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button type="text" @click="editRole(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :offset="2" :span="14">
      <el-card>
        <div slot="header">
          角色名：{{selectedRole ? selectedRole.name : ''}}
        </div>
        <el-transfer
          :titles="['可选权限', '已有权限']"
          :props="{
            key: 'id',
            label: 'name'
          }"
          v-model="permissions"
          :data="models">
        </el-transfer>
        <el-button @click="submitPermission" type="primary">提交</el-button>
      </el-card>
    </el-col>
  </el-row>

</div>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      models: [],
      roleName: '',
      permissions: [],
      selectedRole: null
    }
  },
  mounted () {
    this.fetchModels()
    this.fetchRoles()
  },
  methods: {
    fetchRoles () {
      this.$http.get('/user/fetchRoles').then(res => {
        this.roles = res.data.roles
      })
    },
    fetchModels () {
      this.$http.get('/user/fetchModels').then(res => {
        this.models = res.data.models
      })
    },
    addNewRole () {
      if (!this.roleName) {
        this.$message({
          showClose: true,
          message: '请输入角色名',
          type: 'error'
        })
        return
      }
      this.$http.post('/user/createRole', {
        name: this.roleName
      }).then(res => {
        if (res.data.success) {
          this.$message({
            showClose: true,
            message: '角色创建成功',
            type: 'success'
          })
          this.fetchRoles()
        } else {
          this.$message({
            showClose: true,
            message: '角色创建失败',
            type: 'error'
          })
        }
      })
    },
    editRole (role) {
      this.permissions = []
      this.selectedRole = role
      role.permissions.forEach(permission => {
        this.permissions.push(permission.model)
      })
    },
    submitPermission () {
      console.log(this.permissions)
      if (!this.selectedRole) {
        this.$message({
          showClose: true,
          message: '请选择角色！',
          type: 'error'
        })
        return
      }
      this.$http.post('/user/roleUpdate', {
        role: this.selectedRole.id,
        permissions: this.permissions
      }).then(res => {
        if (res.data.success) {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '修改失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
