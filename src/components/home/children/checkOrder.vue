<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>订单复核</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row>
    <el-col>
      <el-card>
        <div slot="header">
          <el-date-picker
            v-model="orderDate"
            type="date"
            placeholder="选择日期"
            @change="fetchPrintOrder">
          </el-date-picker>
          <el-select v-model="orderSchool" filterable placeholder="请选择学校" @change="fetchPrintOrder">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <el-tabs v-model="activeName" class="elTabs">
          <el-tab-pane label="未复核账单" name="first">
            <el-row>
              <el-col :span="4" class="leftTab">
                <ul>
                  <li v-for="printOrder in printOrders" 
                    :key="printOrder.id"
                    v-if="printOrder.checked === 0">
                    <el-button type="text" @click="showOrder(printOrder)">
                      {{wrapPrintNo(printOrder.printNo)}}
                    </el-button>
                  </li>
                </ul>
              </el-col>
              <el-col :span="20" style="text-align:center">
                <my-style
                  :company="company"
                  :school="school"
                  :printOrderNo="wrapPrintNo(printOrderNo)"
                  :details="details"
                  :orderStyle="orderStyle"
                  :orderType="orderType"
                  :deliverPerson="deliverPerson"
                  :carNum = "carNum">
                </my-style>
                <el-button class="checkBtn" type="danger" size="large" :disabled="!id" @click="checkOrder(id)">
                  复核
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="已复核账单" name="second">
            <el-row>
              <el-col :span="4" class="leftTab">
                <ul>
                  <li v-for="printOrder in printOrders" 
                    :key="printOrder.id"
                    v-if="printOrder.checked === 1">
                    <el-button type="text" @click="showChecked(printOrder)">
                      {{wrapPrintNo(printOrder.printNo)}}
                    </el-button>
                  </li>
                </ul>
              </el-col>
              <el-col :span="20" style="text-align:center">
                <my-style
                  :company="checkedCompany"
                  :school="checkedSchool"
                  :printOrderNo="wrapPrintNo(checkedPrintOrderNo)"
                  :details="checkedDetails"
                  :orderStyle="checkedOrderStyle"
                  :orderType="checkedOrderType"
                  :deliverPerson="checkedDeliverPerson"
                  :carNum = "checkedCarNum">
                </my-style>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import myStyle from '../components/orderStyle'
import moment from 'moment'
export default {
  components: {
    'myStyle': myStyle
  },
  data () {
    return {
      orderDate: Date.now(),
      orderSchool: null,
      schools: [],
      printOrders: [],
      activeName: 'first',
      // 未复核
      id: null,
      company: null,
      school: null,
      printOrderNo: '',
      details: [],
      orderStyle: 1,
      orderType: 2,
      deliverPerson: '',
      carNum: '',
      // 已复核
      checkedId: null,
      checkedCompany: null,
      checkedSchool: null,
      checkedPrintOrderNo: '',
      checkedDetails: [],
      checkedOrderStyle: 1,
      checkedOrderType: 2,
      checkedDeliverPerson: '',
      checkedCarNum: ''
    }
  },
  mounted () {
    this.fetchTree()
  },
  methods: {
    fetchTree: function () {
      this.$http.get('/school/lookup').then(res => {
        this.schools = res.data.schools
      })
    },
    fetchPrintOrder: function () {
      if (this.orderDate && this.orderSchool) {
        this.$http.post('/order/getPrintOrdersByDateSchool', {
          date: this.orderDate,
          school: this.orderSchool
        }).then(res => {
          this.printOrders = res.data.print_orders
          this.reset()
        })
      }
    },
    handleClick: function () {},
    checkOrder: function (id) {
      this.$confirm('复核后将无法更改订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          this.$http.post('/order/checkPrintOrder', {
            printNo: id
          }).then(res => {
            if (res.data.success) {
              this.$message({
                showClose: true,
                message: '复核成功！',
                type: 'success'
              })
              this.fetchPrintOrder()
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg ? res.data.msg : '复核失败！',
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请选择未复核订单',
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消复核'
        })
      })
    },
    showOrder: function (printOrder) {
      this.id = printOrder.id
      this.company = printOrder._company
      this.school = printOrder._order._school
      this.orderStyle = printOrder.orderStyle
      this.printOrderNo = printOrder.printNo
      this.details = printOrder.details
      this.deliverPerson = printOrder.deliverPerson
      this.carNum = printOrder.carNum
    },
    reset: function () {
      this.id = null
      this.company = null
      this.school = null
      this.orderStyle = 1
      this.printOrderNo = ''
      this.details = []
      this.deliverPerson = ''
      this.carNum = ''
    },
    showChecked: function (printOrder) {
      this.checkedId = printOrder.id
      this.checkedCompany = printOrder._company
      this.checkedSchool = printOrder._order._school
      this.checkedOrderStyle = printOrder.orderStyle
      this.checkedPrintOrderNo = printOrder.printNo
      this.checkedDetails = printOrder.details
      this.checkedDeliverPerson = printOrder.deliverPerson
      this.checkedCarNum = printOrder.carNum
    },
    wrapPrintNo: function (printNo) {
      if (!printNo) {
        return ''
      }
      let dateStr = printNo.substr(0, 8)
      let date = moment(dateStr).format('YYYY-MM-DD')
      let index = printNo.substr(8, 3)
      return date + '-' + index
    }
  }
}
</script>

<style scoped>
.elTabs {
  min-height: 400px;
}
.leftTab {
  border-right: 1px solid rgb(209, 210, 229);
  height: 350px;
}
.checkBtn {
  margin-top: 15px;
}
</style>
