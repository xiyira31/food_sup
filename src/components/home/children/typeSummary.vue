<template>
  <div>
    <el-breadcrumb separator="/" class="bread not-print">
      <el-breadcrumb-item>品类汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="not-print">
      <div class="not-print" slot="header">
        <el-date-picker
          v-model="start"
          type="date"
          placeholder="选择开始日期"
          @change="lookup">
        </el-date-picker>
        -
        <el-date-picker
          v-model="end"
          type="date"
          placeholder="选择结束日期"
          @change="lookup">
        </el-date-picker>
        <el-select v-model="selectTypes" multiple placeholder="请选择类型" @change="lookup">
          <el-option
            v-for="(item, index) in types"
            :key="index"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <el-checkbox v-model="showSpec">规格</el-checkbox>
        <el-checkbox v-model="showUnit">单位</el-checkbox>
        <el-checkbox v-model="reserve">倒置</el-checkbox>
        <el-checkbox v-model="calculation">计算均价</el-checkbox>
      </div>
      <div>
        <div>
          <el-button-group>
            <el-button type="success" @click="allClickSchools">
              学校全选
            </el-button>
            <el-button type="danger" @click="cancelSchools">
              学校取消
            </el-button>
          </el-button-group>
          <el-button-group>
            <el-button type="success" @click="allClickTypes">
              类型全选
            </el-button>
            <el-button type="danger" @click="cancelTypes">
              类型取消
            </el-button>
          </el-button-group>
        </div>
        <div style="margin-top:15px">
          统计学校：
          <el-checkbox 
            v-for="school in schools" 
            :key="'school3+' + school.school.id"
            v-model="school.school.show"
            @change="totalChange(school)">
            {{school.school.short? school.school.short: school.school.name}}
          </el-checkbox>
        </div>
      </div>
    </el-card>
    <table border="1" class="summaryTable myDivToPrint print" v-if="schools.length > 0 && !reserve">
      <tr>
         <td align="center" v-if="start.getTime() === end.getTime()">
          {{wrapDate(start)}}
        </td>
        <td align="center" v-else>
          {{wrapDate(start)}}<br>到<br>
          {{wrapDate(end)}}
        </td>
        <td v-if="showSpec">
          规格
        </td>
        <td v-if="showUnit">
          单位
        </td>
        <td v-for="school in schools" v-if="school.school.show && school.total > 0" :key="'school4+' + school.school.id">
          {{school.school.short? school.school.short: school.school.name}}
        </td>
        <td>
          合计
        </td>
        <td v-if="calculation">
          均价
        </td>
        <td v-else>
          单价
        </td>
        <td>
          金额
        </td>
      </tr>
      <tr v-for="product in products" v-if="product.total > 0.00001" :key="'product-1' + product.product.id">
        <td>
          {{product.product.name + combinCode(product.product.code, product.product.code_suffix)}}
        </td>
        <td v-if="showSpec">
          {{product.product.spec}}
        </td>
        <td v-if="showUnit">
          {{product.product.unit}}
        </td>
        <td v-for="school in schools" v-if="school.school.show && school.total > 0" :key="'school-1+' + school.school.id">
          {{formatNum(getNum(product.product, school.school))}}
        </td>
        <td>
          {{formatNum(product.total)}}
        </td>
        <td v-if="calculation">
          {{(product.sum / product.total).toFixed(2)}}
        </td>
        <td v-else>
        </td>
        <td v-if="calculation">
          {{product.sum.toFixed(2)}}
        </td>
        <td v-else>
        </td>
      </tr>
      <tr>
        <td>
          小计
        </td>
        <td v-if="showSpec">
        </td>
        <td v-if="showUnit">
        </td>
        <td v-for="school in schools" v-if="school.school.show && school.total > 0" :key="'school' + school.school.id">
          {{formatNum(school.total)}}
        </td>
        <td>
          {{formatNum(amount)}}
        </td>
        <td>
        </td>
        <td v-if="calculation">
          {{this.amountMoney.toFixed(2)}}
        </td>
        <td v-else>
        </td>
      </tr>
    </table>
    <table border="1" class="summaryTable myDivToPrint print" v-if="schools.length > 0 && reserve">
      <tr>
        <td align="center" v-if="start.getTime() === end.getTime()">
          {{wrapDate(start)}}
        </td>
        <td align="center" v-else>
          {{wrapDate(start)}}<br>到<br>
          {{wrapDate(end)}}
        </td>
        <td v-for="product in products" v-if="product.total > 0" :key="'product0+' + product.id">
          {{product.product.name + combinCode(product.product.code, product.product.code_suffix)}}
        </td>
        <td>
          小计
        </td>
      </tr>
      <tr v-if="showSpec">
        <td>
          规格
        </td>
        <td  v-for="product in products" v-if="product.total > 0" :key="'product1+' + product.id">
          {{product.product.spec}}
        </td>
        <td>
        </td>
      </tr>
      <tr v-if="showUnit">
        <td>
          单位
        </td>
        <td  v-for="product in products" v-if="product.total > 0" :key="'product2+' + product.id">
          {{product.product.unit}}
        </td>
        <td>
        </td>
      </tr>
      <tr v-for="school in schools" v-if="school.school.show && school.total > 0" :key="'school0+' + school.school.id">
        <td>
          {{school.school.short? school.school.short: school.school.name}}
        </td>
        <td v-for="product in products" v-if="product.total > 0" :key="'product3+' + product.id">
          {{getNum(product.product, school.school)}}
        </td>
        <td>
          {{formatNum(school.total)}}
        </td>
      </tr>
      <tr>
        <td>
          合计
        </td>
        <td v-for="product in products" v-if="product.total > 0" :key="'product4+' + product.id">
          {{formatNum(product.total)}}
        </td>
        <td>
          {{formatNum(amount)}}
        </td>
      </tr>
      <tr>
        <td>
          单价
        </td>
        <td v-for="product in products" v-if="product.total > 0" :key="'product5+' + product.id">
        </td>
        <td>
        </td>
      </tr>
      <tr>
        <td>
          金额
        </td>
        <td v-for="product in products" v-if="product.total > 0" :key="'product6+' + product.id">
        </td>
        <td>
        </td>
      </tr>
    </table>
    <el-button type="primary" @click="printTable" class="printTable not-print">
      打印表单
    </el-button>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      types: [],
      selectTypes: [],
      products: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      schools: [],
      start: null,
      end: null,
      showSpec: false,
      showUnit: false,
      reserve: false,
      calculation: false,
      amount: 0,
      amountMoney: 0
    }
  },
  mounted () {
    this.GetTypes()
  },
  methods: {
    combinCode: function (code, codeSuffix) {
      console.log(code)
      if (code && codeSuffix) {
        return '(' + code + '' + codeSuffix + ')'
      } else {
        return ''
      }
    },
    wrapDate: function (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    GetTypes: function () {
      this.$http.get('/type/lookup').then(res => {
        this.types = res.data.types
      })
    },
    lookup: function () {
      if (!this.start || !this.end) {
        return
      }
      let types = []
      this.selectTypes.forEach(function (type) {
        types.push(type.id)
      })
      this.$http.post('/type/lookupTypeSummary', {
        types: types,
        start: this.start,
        end: this.end
      }).then(res => {
        let products = new Map()
        let schools = new Map()
        let nums = new Map()
        let details = res.data.details
        this.amount = 0
        this.amountMoney = 0
        details.forEach(detail => {
          let school = detail._order._school
          let product = detail._product
          let num = this.realNum(detail)
          this.amountMoney += detail.price * num
          if (!schools.has(school.id)) {
            schools.set(school.id, {
              school: school,
              total: num,
              products: {
                [product.id]: detail.price * num
              }
            })
            school.show = true
          } else {
            schools.get(school.id).total += num
            let productSum = schools.get(school.id).products[product.id]
            if (productSum) {
              schools.get(school.id).products[product.id] += detail.price * num
            } else {
              schools.get(school.id).products[product.id] = detail.price * num
            }
          }
          if (!products.has(product.id)) {
            products.set(product.id, {
              product: product,
              total: num,
              sum: detail.price * num
            })
          } else {
            products.get(product.id).total += num
            products.get(product.id).sum += detail.price * num
          }
          let numId = this.generateId(school.id, product.id)
          if (nums.has(numId)) {
            nums.set(numId, nums.get(numId) + num)
          } else {
            nums.set(numId, num)
          }
          this.amount += num
        })
        this.products = [...products.values()]
        this.schools = [...schools.values()]
        this.nums = nums
      })
    },
    generateId: function (schoolId, productId) {
      return schoolId + '_' + productId
    },
    getNum: function (product, school) {
      let numId = this.generateId(school.id, product.id)
      if (this.nums.has(numId)) {
        return this.nums.get(numId)
      } else {
        return null
      }
    },
    totalChange: function (school) {
      this.products.forEach(product => {
        let num = this.getNum(product.product, school.school)
        if (school.school.show) {
          product.total += num
          school.total += num
          if (num > 0) {
            product.sum += school.products[product.product.id]
            this.amountMoney += school.products[product.product.id]
          }
          this.amount += num
        } else {
          if (num > 0) {
            product.sum -= school.products[product.product.id]
            this.amountMoney -= school.products[product.product.id]
          }
          product.total -= num
          school.total -= num
          this.amount -= num
        }
      })
    },
    printTable: function () {
      window.print()
    },
    formatNum: function (val) {
      if (val === null) {
        return null
      }
      if (parseInt(val) === val) {
        return val.toFixed(0)
      }
      if (Math.round(val) === val.toFixed(2)) {
        return val.toFixed(0)
      }
      return val.toFixed(2)
    },
    realNum: function (detail) {
      return detail.fake_num ? detail.fake_num : detail.num
    },
    allClickSchools: function () {
      let _this = this
      this.schools.forEach(function (school) {
        school.school.show = true
        _this.totalChange(school)
      })
    },
    cancelSchools: function () {
      let _this = this
      this.schools.forEach(function (school) {
        school.school.show = false
        _this.totalChange(school)
      })
    },
    allClickTypes: function () {
      this.selectTypes = this.types
    },
    cancelTypes: function () {
      this.selectTypes = []
    }
  }
}
</script>

<style scoped>
.summaryTable {
  border-collapse:collapse;
  margin-top:15px;
}
.summaryTable td {
  padding: 3px;
}
.printTable {
  margin-top:10px;
}
@media print {
  @page {
  }
  .myDivToPrint {
    background-color: white;
    position: fixed;
    top: 30px;
    left: 30px;
    margin: 0;
    padding: 15px;
    visibility: visible;
  }
}
</style>
