<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>学校管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row>
    <el-col :span="8">
      <el-card class="box-card">
        <div slot="header" class="header">
          <el-button style="float: right;margin-left:10px;" type="primary" @click="clearAll">清空</el-button>
          <el-button style="float: right;" type="primary" @click="addNew">新增</el-button>
        </div>
        <el-form ref="form" :model="school" :rules="rules" label-width="70px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="school.name"></el-input>
          </el-form-item>
          <el-form-item label="学校缩写">
            <el-input v-model="school.short"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="school.address"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="school.email"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="school.mobile"></el-input>
          </el-form-item>
        </el-form>
      </el-card>      
    </el-col>
    <el-col :span="16">
      <el-card class="box-card">
        <div slot="header">
          <span class="titleFont">学校名称 </span>
          <el-input v-model="searchWord" class="search"></el-input>
          <el-button @click="search">搜索</el-button>
        </div>
        <el-table border :data="schoolData"
          highlight-current-row
          @current-change="selectChange">
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="学校名称">
          </el-table-column>
          <el-table-column
            prop="short"
            label="学校缩写">
          </el-table-column>
          <el-table-column
            prop="email"
            label="email">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机">
          </el-table-column>
        </el-table>
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <el-button @click="updateData">
          修改
        </el-button>
        <el-button @click="deleteData">
          删除
        </el-button>
      </el-card>
    </el-col>
  </el-row>
    <el-dialog
    :title="'修改学校'"
    :visible.sync="addNewShow"
    size="tiny">
    <el-form ref="form2" :model="selection" :rules="rules" label-width="70px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="selection.name"></el-input>
      </el-form-item>
      <el-form-item label="学校缩写">
        <el-input v-model="selection.short"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="selection.address"></el-input>
      </el-form-item>
      <el-form-item label="email">
        <el-input v-model="selection.email"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="selection.mobile"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="submitUpdate">
      提交
    </el-button>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      school: {
        name: '',
        short: '',
        address: '',
        email: '',
        mobile: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
      schoolData: [],
      searchWord: '',
      addNewShow: false,
      selection: {
        name: '',
        short: '',
        address: '',
        email: '',
        mobile: ''
      }
    }
  },
  mounted () {
    this.lookup()
  },
  methods: {
    handleSizeChange: function (size) {
      this.pageSize = size
      this.lookup()
    },
    handleCurrentChange: function (page) {
      this.currentPage = page
      this.lookup()
    },
    lookup: function () {
      let _this = this
      let limit = _this.pageSize
      let offset = (_this.currentPage - 1) * _this.pageSize
      _this.$http.get('/school/lookup', {
        params: {
          searchWord: _this.searchWord,
          limit: limit,
          offset: offset
        }
      }).then(res => {
        let data = res.data
        _this.total = data.total
        _this.schoolData = data.schools
      })
    },
    addNew: function () {
      let _this = this
      _this.$http.post('/school/create', {
        school: _this.school
      }).then(res => {
        if (res.data.success) {
          _this.$message({
            showClose: true,
            message: '学校创建成功',
            type: 'success'
          })
          _this.school = {
            name: '',
            short: '',
            address: '',
            email: '',
            mobile: ''
          }
          this.lookup()
        } else {
          _this.$message({
            showClose: true,
            message: '学校创建失败',
            type: 'error'
          })
        }
      })
    },
    clearAll: function () {
      this.school.name = ''
      this.school.short = ''
      this.school.address = ''
      this.school.email = ''
      this.school.mobile = ''
    },
    search: function () {
      this.lookup()
    },
    selectChange: function (val) {
      if (val === null) {
        this.selection = {
          name: '',
          short: '',
          address: '',
          email: '',
          mobile: ''
        }
      } else {
        this.selection = val
      }
    },
    updateData: function () {
      let selection = this.selection
      if (selection.id) {
        this.addNewShow = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择需要修改的学校！',
          type: 'error'
        })
      }
    },
    submitUpdate: function () {
      let selection = this.selection
      if (selection.id) {
        this.$http.post('/school/update', {
          school: selection
        }).then(res => {
          if (res.data.success) {
            this.$message({
              showClose: true,
              message: '修改成功！',
              type: 'success'
            })
            this.addNewShow = false
            this.lookup()
          } else {
            this.$message({
              showClose: true,
              message: '修改失败！',
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '未知问题！',
          type: 'error'
        })
      }
    },
    deleteData: function () {
      let selection = this.selection
      if (selection.id) {
        this.$confirm('此操作将删除该学校, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/school/delete', {
            id: selection.id
          }).then(res => {
            if (res.data.success) {
              this.$message({
                showClose: true,
                message: '删除成功！',
                type: 'success'
              })
              this.lookup()
            } else {
              this.$message({
                showClose: true,
                message: '删除失败！',
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.bread {
  font-size: 20px;
  margin:5px;
  font-weight:bold
}
.box-card {
  margin: 5px;
}
.box-card .header {
  height:38px;
}
.search {
  width:50%
}
.titleFont {
  line-height: 36px;
  font-size:20px;
}
</style>
