<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item>学校汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
        <el-date-picker
          v-model="start"
          type="date"
          placeholder="选择开始日期">
        </el-date-picker>
        -
        <el-date-picker
          v-model="end"
          type="date"
          placeholder="选择结束日期">
        </el-date-picker>
        <el-select v-model="school" filterable placeholder="请选择学校">
          <el-option
            v-for="item in schools"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-button @click="lookup">
          查询
        </el-button>
      </div>
      <el-select v-model="orderStyle" placeholder="请选择开票样式">
        <el-option
          v-for="item in orderStyles"
          :key="item.id"
          :label="item.name"
          :value="item.id" v-show="item.id === 0 || item.show">
        </el-option>
      </el-select>
      <el-checkbox v-model="costShow">成本</el-checkbox>
      <div>
        <table border="1" class="summaryTable">
          <tr>
            <th>
              收货单位
            </th>
            <th colspan="2">
              {{schoolName}}
            </th>
            <th v-if="costShow">
            </th>
          </tr>
          <tr>
            <td>
              日期
            </td>
            <td>
              单据类型
            </td>
            <td>
              金额(元)
            </td>
            <td v-if="costShow">
              成本(元)
            </td>
          </tr>
          <tr v-for="printOrder in filterOrders" :key="printOrder.id">
            <td>
              {{wrapPrintNo(printOrder.printNo)}}
            </td>
            <td>
              {{coverageStyle(printOrder.orderStyle)}}
            </td>
            <td>
              {{printOrder.amount}}
            </td>
            <td v-if="costShow">
              {{printOrder.costAmount}}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              合计
            </td>
            <td>
              {{amount}}
            </td>
            <td v-if="costShow">
              {{costAmount}}
            </td>
          </tr>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {orderStyles as OrderStyles} from '../../../config/orderStyles'
import moment from 'moment'
export default {
  data () {
    return {
      school: null,
      schoolName: '',
      schools: [],
      start: null,
      end: null,
      printOrders: [],
      orderStyles: OrderStyles,
      orderStyle: 0,
      costShow: false
    }
  },
  computed: {
    amount () {
      let sum = 0
      this.filterOrders.forEach(printOrder => {
        if (printOrder.amount) {
          sum += parseFloat(printOrder.amount)
        }
      })
      return sum.toFixed(2)
    },
    costAmount () {
      let sum = 0
      this.filterOrders.forEach(printOrder => {
        if (printOrder.costAmount) {
          sum += parseFloat(printOrder.costAmount)
        }
      })
      return sum.toFixed(2)
    },
    filterOrders () {
      if (this.orderStyle === 0) {
        return this.printOrders
      }
      return this.printOrders.filter(order => {
        return order.orderStyle === this.orderStyle
      })
    }
  },
  mounted () {
    this.fetchSchools()
  },
  methods: {
    fetchSchools: function () {
      this.$http.get('/school/lookup').then(res => {
        this.schools = res.data.schools
      })
    },
    lookup () {
      if (this.start && this.end && this.school) {
        this.$http.post('/order/printOrderSummary', {
          start: this.start,
          end: this.end,
          school: this.school.id
        }).then(res => {
          this.schoolName = this.school.name
          this.printOrders = res.data.print_orders
        })
      }
    },
    coverageStyle: function (styleId) {
      return OrderStyles.find(function (v) {
        return v.id === styleId
      }).name
    },
    wrapPrintNo: function (printNo) {
      let dateStr = printNo.substr(0, 8)
      let date = moment(dateStr).format('YYYY-MM-DD')
      let index = printNo.substr(8, 3)
      return date + '-' + index
    }
  }
}
</script>

<style scoped>
.summaryTable {
  border-collapse:collapse;
  margin: auto;
}
.summaryTable td, .summaryTable th {
  padding: 10px;
}
</style>
