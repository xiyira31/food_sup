<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="buttonGroup">
    <el-button type="primary" @click="showDialog('新增商品')">
      新增
    </el-button>
    <el-button @click="showModify">
      修改
    </el-button>
    <el-button @click="deleteData">
      删除
    </el-button>
    <el-input v-model="searchWord" class = "searchStyle"></el-input>
    <el-button @click="search">查找</el-button>
  </div>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="addNewShow"
    :before-close="beforeCloseDialog">
    <el-form ref="addNewForm" :model="product" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="product.name" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="product.code" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="代码后缀" prop="code_suffix">
        <el-input v-model="product.code_suffix" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="品类">
        <el-select v-model="product.type" placeholder="请选择">
          <el-option
            v-for="item in typeLst"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认单价" prop="price">
        <el-input v-model.number="product.price" class="money"></el-input>元
      </el-form-item>
      <el-form-item label="默认成本" prop="cost">
        <el-input v-model.number="product.cost" class="money"></el-input>元
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="product.spec" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="product.unit" class="money"></el-input>
      </el-form-item>
      <el-form-item label="保质期">
        <el-input v-model.number="product.shelf_life" class="money"></el-input>月
      </el-form-item>
      <el-form-item label="供应商">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入供应商名称"
          :titles="['可选供应商', '已选供应商']"
          :props="{
            key: 'id',
            label: 'name'
          }"
          v-model="product.producers"
          :data="producerLst">
        </el-transfer>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="addNew" class="submitBtn">
      提交
    </el-button>
  </el-dialog>
  <el-dialog
    :title="'修改商品'"
    :visible.sync="modifyShow"
    :before-close="closeModify">
    <el-form ref="modifyForm" :model="modifyProduct" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        {{modifyProduct.name}}
      </el-form-item>
      <el-form-item label="代码" prop="code">
        <el-input v-model="modifyProduct.code" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="代码后缀" prop="code_suffix">
        <el-input v-model="modifyProduct.code_suffix" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="品类">
        <el-select v-model="modifyProduct.type" placeholder="请选择">
          <el-option
            v-for="item in typeLst"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认单价" prop="price">
        <el-input v-model.number="modifyProduct.price" class="money"></el-input>元
      </el-form-item>
      <el-form-item label="默认成本" prop="cost">
        <el-input v-model.number="modifyProduct.cost" class="money"></el-input>元
      </el-form-item>
      <el-form-item label="规格">
        <el-input v-model="modifyProduct.spec" class="inputStyle"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="modifyProduct.unit" class="money"></el-input>
      </el-form-item>
      <el-form-item label="保质期">
        <el-input v-model.number="modifyProduct.shelf_life" class="money"></el-input>月
      </el-form-item>
      <el-form-item label="供应商">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入供应商名称"
          :titles="['可选供应商', '已选供应商']"
          :props="{
            key: 'id',
            label: 'name'
          }"
          v-model="modifyProduct.producers"
          :data="producerLst">
        </el-transfer>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="modify">
      提交
    </el-button>
    <el-button type="primary" @click="modify">
      提交并修改价格
    </el-button>
  </el-dialog>
  <el-table border :data="productData"
    highlight-current-row
    @current-change="selectChange">
    <el-table-column
      prop="id"
      label="编号">
    </el-table-column>
    <el-table-column
      prop="name"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="code"
      label="代码">
    </el-table-column>
    <el-table-column
      prop="code_suffix"
      label="代码后缀">
    </el-table-column>
    <el-table-column
      prop="_type.name"
      label="品类">
    </el-table-column>
    <el-table-column
      prop="price"
      label="默认单价">
    </el-table-column>
    <el-table-column
      prop="cost"
      label="默认成本">
    </el-table-column>
    <el-table-column
      prop="spec"
      label="规格">
    </el-table-column>
    <el-table-column
      prop="unit"
      label="单位">
    </el-table-column>
    <el-table-column
      prop="shelf_life"
      label="保质期(月)">
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
</div>
</template>

<script>
export default {
  data () {
    return {
      producerLst: [],
      typeLst: [],
      product: {
        id: null,
        name: '',
        code: '',
        code_suffix: '',
        type: null,
        price: null,
        cost: null,
        spec: null,
        unit: null,
        shelf_life: null,
        producers: []
      },
      modifyProduct: {
        id: null,
        name: '',
        code: '',
        code_suffix: '',
        type: null,
        price: null,
        cost: null,
        spec: null,
        unit: null,
        shelf_life: null,
        producers: []
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { type: 'number', message: '单价必须为数字值' }
        ]
      },
      addNewShow: false,
      modifyShow: false,
      dialogTitle: '新增商品',
      currentPage: 1,
      total: null,
      searchWord: '',
      productData: [],
      pageSize: 10,
      selectId: -1
    }
  },
  mounted () {
    this.fetchProducers()
    this.lookup()
  },
  methods: {
    fetchProducers: function () {
      this.$http.get('/producer/lookup').then(res => {
        this.producerLst = res.data.producers
      })
      this.$http.get('/type/lookup').then(res => {
        this.typeLst = res.data.types
      })
    },
    filterMethod (query, item) {
      return item.name.indexOf(query) > -1
    },
    showDialog: function (title) {
      this.addNewShow = true
      this.dialogTitle = title
    },
    beforeCloseDialog: function (done) {
      this.$confirm('确认关闭？').then(_ => {
        this.clearAll()
        done()
      }).catch(_ => {})
    },
    addNew: function () {
      this.$refs['addNewForm'].validate((valid) => {
        if (valid) {
          let _this = this
          _this.$http.post('/product/create', {
            product: _this.product
          }).then(res => {
            if (res.data.success) {
              _this.$message({
                showClose: true,
                message: '商品创建成功',
                type: 'success'
              })
              this.$refs['addNewForm'].resetFields()
              this.product.producers = []
              this.product.shelf_life = null
              this.product.code = null
              this.product.code_suffix = null
              this.product.type = null
              this.product.spec = null
              this.product.unit = null
              this.product.cost = null
              this.lookup()
            } else {
              _this.$message({
                showClose: true,
                message: res.data.reason || '商品创建失败',
                type: 'error'
              })
            }
          })
        }
      })
    },
    clearAll: function () {
      this.$refs['addNewForm'].resetFields()
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      this.lookup()
    },
    handleCurrentChange: function (page) {
      this.currentPage = page
      this.lookup()
    },
    search: function () {
      this.lookup()
    },
    selectChange: function (selection) {
      if (selection) {
        this.selectId = selection.id
      } else {
        this.selectId = -1
      }
    },
    lookup: function () {
      let _this = this
      let limit = _this.pageSize
      let offset = (_this.currentPage - 1) * _this.pageSize
      _this.$http.get('/product/lookup', {
        params: {
          searchWord: _this.searchWord,
          limit: limit,
          offset: offset
        }
      }).then(res => {
        let data = res.data
        _this.total = data.total
        _this.productData = data.products
      })
    },
    showModify: function () {
      let id = this.selectId
      if (id > 0) {
        this.$http.post('/product/readOne', {
          id: id
        }).then(res => {
          let product = res.data.product
          this.modifyProduct.id = product.id
          this.modifyProduct.name = product.name
          this.modifyProduct.code = product.code
          this.modifyProduct.code_suffix = product.code_suffix
          this.modifyProduct.shelf_life = product.shelf_life
          this.modifyProduct.spec = product.spec
          this.modifyProduct.type = product.type
          this.modifyProduct.unit = product.unit
          this.modifyProduct.price = parseFloat(product.price)
          this.modifyProduct.cost = parseFloat(product.cost)
          this.modifyProduct.producers = res.data.producers
          this.modifyShow = true
        })
      } else {
        this.$message({
          showClose: true,
          message: '请选择待修改商品',
          type: 'error'
        })
      }
    },
    closeModify: function (done) {
      this.$refs['modifyForm'].resetFields()
      done()
    },
    modify: function () {
      this.$refs['modifyForm'].validate((valid) => {
        if (valid) {
          if (this.modifyProduct.id) {
            this.$http.post('/product/updateAndUpdateCost', {
              product: this.modifyProduct
            }).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: '修改成功！',
                  type: 'success'
                })
                this.lookup()
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败！',
                  type: 'error'
                })
              }
              this.$refs['modifyForm'].resetFields()
            })
          } else {
            this.$message({
              showClose: true,
              message: '请选择待修改商品',
              type: 'error'
            })
          }
          this.modifyShow = false
        }
      })
    },
    deleteData: function () {
      if (this.selectId > 0) {
        this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/product/delete', {
            id: this.selectId
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
.buttonGroup {
  margin:15px;
}
.inputStyle {
  width:50%
}
.money {
  width: 20%;
  margin-right:20px;
}
.searchStyle {
  width:50%;
  margin-left:10px;
  margin-right:10px;
  margin-top:15px;
}
.submitBtn {
  float: right;
  margin: 10px;
}
</style>
