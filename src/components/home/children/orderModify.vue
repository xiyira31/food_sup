<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>订单修改</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row>
    <el-col :span="24">
      <el-card>
        <div slot="header">
          <span>订单查询</span>
          <el-date-picker
            v-model="orderDate"
            type="date"
            placeholder="选择日期"
            @change="lookup">
          </el-date-picker>
          <el-select v-model="orderSchool" filterable placeholder="请选择学校" @change="lookup">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <div v-if="selectedRow && (!selectedRow._print_order || selectedRow._print_order.checked === 0)" class="dailyDiv">
            <div class="header">
              {{selectedRow._product.name}}今日价格：{{currentPrices.length === 0 ? '无' : ''}}
            </div>
            <div>
              <table>
                <tr>
                  <td v-for="header in currentPriceHeader" :key="header">
                    {{header}}
                  </td>
                </tr>
                <tr>
                  <td v-for="(price, index) in currentPrices" :key="index">
                    <el-button @click="quickUpdate(price)" type="text">
                      {{price}}
                    </el-button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <el-table :data="details"
          highlight-current-row
          @current-change="changeDailyPrice">
          <el-table-column
            prop="_product.name"
            label="商品">
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="fake_num"
            label="结算数量">
          </el-table-column>
          <el-table-column
            prop="_producer.name"
            label="供应商">
          </el-table-column>
          <el-table-column
            prop="produce_date"
            label="生产日期">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template scope="scope">
              <el-button 
                @click="editDetail(scope.row)" 
                type="text" 
                size="small"
                v-if="!scope.row._print_order || scope.row._print_order.checked === 0">编辑</el-button>
              <el-button 
                @click="deleteDetail(scope.row)" 
                type="text" 
                size="small"
                v-if="!scope.row._print_order || scope.row._print_order.checked === 0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog
    :title="'修改订单'"
    :visible.sync="editShow">
    <el-form ref="ruleForm" :model="orderDetail" :rules="rules" label-width="70px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="货品" prop="price">
            {{orderDetail._product? orderDetail._product.name : ''}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="单价" prop="price">
            <el-input v-model.number="orderDetail.price" class="inputStyle"></el-input> 元
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="数目" prop="num">
            <el-input v-model.number="orderDetail.num" class="tiny"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算数目" prop="fake_num">
            <el-input v-model.number="orderDetail.fake_num" class="tiny"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="orderDetail.produce_date"
              type="date"
              placeholder="生产日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">
            <el-select v-model="orderDetail.producer" filterable placeholder="请选择供应商">
              <el-option
                v-for="item in producers"
                :key="item._producer.id"
                :label="item._producer.name"
                :value="item._producer.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>              
    </el-form>
    <el-button type="primary" class="sub_btn" @click="submitDetail">
      提交
    </el-button>
  </el-dialog>
</div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      orderDate: null,
      orderSchool: null,
      schools: [],
      details: [],
      currentPrices: [],
      currentPriceHeader: [],
      selectedRow: null,
      orderDetail: {
        id: null,
        product: null,
        price: null,
        num: null,
        fake_num: null,
        produce_date: null,
        producer: null
      },
      producers: [],
      editShow: false,
      rules: {
        price: [
          { type: 'number', message: '单价必须为数字' },
          { required: true, message: '请填入单价' }
        ],
        num: [
          { type: 'number', message: '数量必须为数字' },
          { required: true, message: '请填入数量' }
        ],
        fake_num: [
          { type: 'number', message: '结算数量必须为数字' }
        ]
      }
    }
  },
  mounted () {
    this.fetchSchools()
  },
  methods: {
    hasChecked (detail) {
      console.log(detail)
      if (detail._print_order && detail._print_order.checked === 1) {
        return false
      } else {
        return true
      }
    },
    fetchSchools: function () {
      this.$http.get('/school/lookup').then(res => {
        this.schools = res.data.schools
      })
    },
    lookup: function () {
      if (!this.orderDate || !this.orderSchool) {
        return
      }
      let _this = this
      let date = moment(this.orderDate).format('YYYY-MM-DD')
      _this.$http.get('/order/lookup', {
        params: {
          date: date,
          school: this.orderSchool.id
        }
      }).then(res => {
        let data = res.data
        if (data.order.length > 0) {
          this.details = data.order[0].details
        } else {
          this.details = []
        }
      })
    },
    changeDailyPrice: function (currentRow) {
      this.currentPrices = []
      this.currentPriceHeader = []
      this.selectedRow = null
      if (!currentRow) {
        return
      }
      this.selectedRow = currentRow
      currentRow._product.prices.forEach(price => {
        if (price.price1) {
          this.currentPriceHeader.push('价格1')
          this.currentPrices.push(price.price1)
        }
        if (price.price2) {
          this.currentPriceHeader.push('价格2')
          this.currentPrices.push(price.price2)
        }
        if (price.price3) {
          this.currentPriceHeader.push('价格3')
          this.currentPrices.push(price.price3)
        }
        if (price.price4) {
          this.currentPriceHeader.push('价格4')
          this.currentPrices.push(price.price4)
        }
        if (price.price5) {
          this.currentPriceHeader.push('价格5')
          this.currentPrices.push(price.price5)
        }
        if (price.price6) {
          this.currentPriceHeader.push('价格6')
          this.currentPrices.push(price.price6)
        }
      })
      console.log(this.selectedRow)
    },
    editDetail: function (row) {
      let detail = this.orderDetail
      detail.id = row.id
      detail.product = row.product
      detail._product = row._product
      detail.num = row.num
      detail.fake_num = row.fake_num
      detail.price = parseFloat(row.price)
      detail.produce_date = row.produce_date
      detail.producer = row.producer
      this.producers = row._product.producers
      this.editShow = true
    },
    deleteDetail: function (row) {
      this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/order/delete', {
          id: row.id
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
    },
    quickUpdate: function (price) {
      this.$http.post('/order/quickUpdate', {
        id: this.selectedRow.id,
        price: price
      }).then(res => {
        if (res.data.success) {
          this.$message({
            showClose: true,
            message: '更新成功！',
            type: 'success'
          })
          this.details.every(detail => {
            if (detail.id === this.selectedRow.id) {
              detail.price = price
              return false
            }
            return true
          })
        } else {
          this.$message({
            showClose: true,
            message: '更新失败！',
            type: 'error'
          })
        }
      })
    },
    submitDetail: function () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.orderDetail.id) {
            if (this.orderDetail.produce_date) {
              this.orderDetail.produce_date = moment(this.orderDetail.produce_date).format('YYYY-MM-DD')
            }
            this.$http.post('/order/update', {
              id: this.orderDetail.id,
              detail: this.orderDetail
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
                  message: '修改失败或未改动',
                  type: 'error'
                })
              }
              this.$refs['ruleForm'].resetFields()
              this.lookup()
              this.editShow = false
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.sub_btn {
  float:right;
  margin:10px;
}
.inputStyle {
  width:20%
}
.dailyDiv {
  width:400px;
  float:right;
}
.dailyDiv div {
  float:left;
}
.dailyDiv .header {
  margin-top: 12px;
}
</style>
