<template>
<div>
  <el-breadcrumb separator="/" class="bread not-print">
    <el-breadcrumb-item>订单打印</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row class="rowOne" v-if="printShow">
    <el-col :span="12" class="not-print">
      <el-card class="leftPart">
        <div slot="header">
          <el-date-picker
            v-model="orderDate"
            type="date"
            placeholder="选择日期"
            @change="lookup">
          </el-date-picker>
          <el-select clearable v-model="orderSchool" filterable placeholder="请选择学校" @change="lookup">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-table border :data="orders" class="tableCls" height="350">
            <el-table-column
              prop="_school.name"
              label="学校">
            </el-table-column>
            <el-table-column
              prop="date"
              label="日期">
            </el-table-column>
            <el-table-column
              label="操作">
              <template scope="scope">
                <el-button @click="fetchTree(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-sizes="[7, 14, 21]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, pager"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="rightPart not-print">
        <div slot="header">
          <el-form ref="form" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="学校">
                  {{selectOrderSchool ? selectOrderSchool.name : ''}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日期">
                  {{selectOrderDate}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="开票公司">
              <el-select v-model="company" placeholder="请选择开票公司">
                <el-option
                  v-for="item in companys"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开票类型">
                  <el-select v-model="orderType" placeholder="请选择开票类型">
                    <el-option
                      v-for="item in orderTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票样式">
                  <el-select v-model="orderStyle" placeholder="请选择开票样式" @change="orderStyleChange">
                    <el-option
                      v-for="item in orderStyles"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id" v-show="item.show">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="配送车号">
                  <el-input v-model="carNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="送货人">
                  <el-input v-model="deliverPerson"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-tree 
          ref="tree"
          node-key="id"
          show-checkbox
          default-expand-all
          class="treeCls"
          empty-text="暂无未打印项目"
          :data="orderDetails" 
          @check-change="handleCheckChange"
          :props="{label: 'name', children: 'details'}">
        </el-tree>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="bottomDiv">
    <el-col :span="7" class="not-print">
      <el-card>
        <div slot="header">
          已打印单据
          <el-button @click="reDoPrintOrders">
            重新制表
          </el-button>
        </div>
        <el-table :data="printOrders">
          <el-table-column
            prop="printNo"
            label="单号">
            <template scope="scope">
              {{wrapPrintNo(scope.row.printNo)}}
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作">
            <template scope="scope">
              <el-button @click="rePrint(scope.row)" type="text" size="small">重新打印</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" :offset="1" class="orderContainer">
      <el-collapse v-model="activeNames" class="not-print">
        <el-collapse-item title="打印配送单" name="1" class="print">
          <div id="toBePrinted">
            <component
              v-bind:is="currentStyle"
              :company="company"
              :school="selectOrderSchool"
              :printOrderNo="wrapPrintNo(printOrderNo)"
              :details="displayNodes"
              :orderStyle="orderStyle"
              :orderType="orderType"
              :deliverPerson="deliverPerson"
              :carNum = "carNum">
            </component>
          </div>
          
          <el-button @click="print" type="primary" class="not-print printBtn">
            打印配送单
          </el-button>
        </el-collapse-item>
        <el-collapse-item title="成本修改" name="2">
          <costModifyStyle
            :printOrderNo="wrapPrintNo(printOrderNo)"
            :details="displayNodes"
            :orderStyle="orderStyle"
            :orderType="orderType"
            >
          </costModifyStyle>
          <el-button @click="submitCostModify" type="primary" class="not-print printBtn">
            提交
          </el-button>
        </el-collapse-item>
      </el-collapse>
      
    </el-col>
  </el-row>
</div>
</template>

<script>
import moment from 'moment'
import mystyle from '../components/orderStyle'
import style1 from '../components/orderStyle1'
import style2 from '../components/orderStyle2'
import style3 from '../components/orderStyle3'
import style4 from '../components/orderStyle4'
import style5 from '../components/orderStyle5'
import style6 from '../components/orderStyle6'
import style7 from '../components/orderStyle7'
import style8 from '../components/orderStyle8'
import style9 from '../components/orderStyle9'
import style10 from '../components/orderStyle10'
import costModifyStyle from '../components/costModifyStyle'
import {orderStyles as OrderStyles} from '../../../config/orderStyles'
export default {
  components: {
    mystyle, style1, style2, style3, style4, style5, style6, style7, style8, style9, style10, costModifyStyle
  },
  data () {
    return {
      activeNames: '1',
      orderDate: null,
      orderSchool: null,
      schools: [],
      companys: [],
      orders: [],
      company: null,
      orderDetails: [],
      currentPage: 1,
      pageSize: 7,
      total: null,
      selectOrderDate: '',
      selectOrderSchool: null,
      printOrderNo: '',
      printOrders: [],
      carNum: '',
      deliverPerson: '',
      orderTypes: [{
        id: 1,
        name: '发货单'
      }, {
        id: 2,
        name: '结算单'
      }],
      orderStyles: OrderStyles,
      selectedOrderStyle: OrderStyles[1],
      orderStyle: 1,
      orderType: 1,
      selectedNodes: [],
      selectedRow: null,
      newPrintOrderNo: '',
      orderMax: 5,
      printShow: true,
      details: [],
      enableChange: true,
      printed: false,
      disabledOrderStyleChange: false
    }
  },
  computed: {
    currentStyle: function () {
      let style = null
      switch (this.orderStyle) {
        case 1:
          style = style1
          break
        case 2:
          style = style2
          break
        case 3:
          style = style3
          break
        case 4:
          style = style4
          break
        case 5:
          style = style5
          break
        case 6:
          style = style6
          break
        case 7:
          style = style7
          break
        case 8:
          style = style8
          break
        case 9:
          style = style9
          break
        case 10:
          style = style10
          break
        default:
          style = style1
          break
      }
      console.log(style)
      return style
    },
    summary: function () {
      let total = 0
      this.selectedNodes.forEach(detail => {
        total += (this.orderType === 1 ? detail.num : detail.fake_num) * detail.price
      })
      return total.toFixed(2)
    },
    displayNodes: function () {
      const nodes = []
      this.selectedNodes.forEach(function (node) {
        nodes.push(node)
      })
      return nodes.sort(function (a, b) {
        return a._product.name.localeCompare(b._product.name)
      })
    }
  },
  watch: {
    selectedNodes: function (newVal, oldVal) {
      this.cutNodes()
    },
    orderMax: function (newVal, oldVal) {
      this.cutNodes()
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    cutNodes: function () {
      if (this.selectedNodes.length > this.orderMax) {
        this.selectedNodes.splice(this.orderMax, this.selectedNodes.length - this.orderMax + 1)
        this.$refs.tree.setCheckedNodes(this.selectedNodes)
        this.$message({
          type: 'info',
          message: '当前票据样式无法打印超过' + this.orderMax + '个商品！'
        })
      }
    },
    fetchData: function () {
      this.$http.get('/company/lookup').then(res => {
        this.companys = res.data.companys
      })
      this.$http.get('/school/lookup').then(res => {
        this.schools = res.data.schools
      })
      this.lookup()
    },
    fetchTree: function (row) {
      if (row && row.id) {
        this.selectedRow = row
        this.selectedNodes = []
        this.fetchOrder(this.selectedRow.id)
      }
    },
    fetchOrder: function (id) {
      this.$http.get('/order/lookupDetaiById', {
        params: {
          order: id
        }
      }).then(res => {
        this.selectOrderSchool = this.selectedRow._school
        this.selectOrderDate = this.selectedRow.date
        this.details = res.data.details
        this.generateTreeData(res.data.details)
        this.fetchPrintOrder()
      })
    },
    fetchPrintOrder: function () {
      if (this.selectedRow) {
        this.$http.post('/order/getPrintOrders', {
          orderId: this.selectedRow.id
        }).then(res => {
          this.printOrders = res.data.print_orders
        })
      }
    },
    combinCode: function (code, codeSuffix) {
      if (code && codeSuffix) {
        return code + '' + codeSuffix
      } else {
        return ''
      }
    },
    generateTreeData: function (data) {
      let tree = []
      data.forEach(detail => {
        if (detail.print_order) {
          return
        }
        let type = detail._product._type
        let typeId = type.id
        let typeName = type.name
        let typeOrder = type.orderBy
        let hasType = false
        let typeIndex = -1
        let fullCode = this.combinCode(detail._product.code, detail._product.code_suffix)
        if (fullCode) {
          detail.name = detail._product.name +
            '(' + this.combinCode(detail._product.code, detail._product.code_suffix) + ')'
        } else {
          detail.name = detail._product.name
        }

        for (let index = 0; index < tree.length; ++index) {
          if (tree[index].id === typeId) {
            hasType = true
            typeIndex = index
            break
          }
        }
        if (hasType) {
          tree[typeIndex].details.push(detail)
        } else {
          tree.push({
            id: typeId,
            orderBy: typeOrder,
            name: typeName,
            details: [detail]
          })
        }
      })
      tree = tree.sort(function (a, b) {
        return a.orderBy > b.orderBy
      })
      this.orderDetails = tree
    },
    generateNextOrderNo: function (date, details) {
      let index = 0
      details.forEach(detail => {
        if (detail._print_order !== null) {
          let printNo = parseInt(detail._print_order.printNo)
          if (printNo > index) {
            index = printNo
          }
        }
      })
      let newNo = ''
      if (index === 0) {
        newNo = this.generateOrderNo(date, 1)
      } else {
        index++
        newNo = index + ''
      }
      this.newPrintOrderNo = newNo
    },
    makeOrderNo: function (date, orderStyle, details) {
      if (!this.enableChange) {
        this.enableChange = true
        return
      }
      if (!date) {
        return
      }
      let index = 0
      let styleId = orderStyle.id
      let prefix = orderStyle.prefix
      details.forEach(detail => {
        if (detail._print_order !== null &&
          this.comparePrefix(detail._print_order.orderStyle, styleId)) {
          let printNo = parseInt(detail._print_order.printNo)
          if (printNo > index) {
            index = printNo
          }
        }
      })
      let newNo = ''
      if (index === 0) {
        newNo = this.generateOrderNoNew(date, prefix, 1)
      } else {
        index++
        newNo = index + ''
      }
      this.printOrderNo = newNo
    },
    comparePrefix: function (idOne, idTwo) {
      let one = this.orderStyles.find(function (v) {
        return v.id === idOne
      })
      let two = this.orderStyles.find(function (v) {
        return v.id === idTwo
      })
      if (one === null || two === null) {
        return false
      } else {
        return one.prefix === two.prefix
      }
    },
    generateOrderNoNew: function (date, prefix, index) {
      let dateStr = moment(date).format('YYYYMMDD')
      if (index < 10) {
        index = prefix + '0' + index
      }
      return dateStr + index
    },
    generateOrderNo: function (date, index) {
      let dateStr = moment(date).format('YYYYMMDD')
      if (index < 10) {
        index = '0' + index
      }
      return dateStr + index
    },
    lookup: function () {
      let params = {
        limit: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize,
        date: this.orderDate
      }
      if (this.orderSchool) {
        params.school = this.orderSchool.id
      }
      this.$http.get('/order/lookupBy', {
        params: params
      }).then(res => {
        this.total = res.data.total
        this.orders = res.data.orders
      })
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      this.lookup()
    },
    handleCurrentChange: function (page) {
      this.currentPage = page
      this.lookup()
    },
    handleCheckChange: function (data, checked, indeterminate) {
      // let selectedNodes = this.$refs.tree.getCheckedNodes(true)
      // this.printOrderNo = this.newPrintOrderNo
      if (this.printed) {
        this.selectedNodes = []
        this.printed = false
      }
      this.makeOrderNo(this.selectOrderDate, this.selectedOrderStyle, this.details)
      if (checked && data.product) {
        this.selectedNodes.push(data)
      } else {
        let index = this.selectedNodes.indexOf(data)
        if (index > -1) {
          this.selectedNodes.splice(index, 1)
        }
      }
      // this.selectedNodes = selectedNodes
    },
    print: function () {
      this.printOrderSummit()
    },
    printOrderSummit () {
      if (!this.selectedRow) {
        this.$message({
          showClose: true,
          message: '请选择待打印订单！',
          type: 'error'
        })
        return
      }
      if (this.selectedNodes.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择待打印项！',
          type: 'error'
        })
        return
      }
      let printOrder = {
        order: this.selectedRow ? this.selectedRow.id : null,
        printNo: this.printOrderNo,
        orderType: this.orderType,
        company: this.company ? this.company.id : null,
        orderStyle: this.orderStyle,
        carNum: this.carNum,
        deliverPerson: this.deliverPerson,
        details: this.selectedNodes
      }
      this.$http.post('/order/createPrintOrder', {
        printOrder: printOrder
      }).then(res => {
        if (res.data.success && this.selectedRow) {
          this.printShow = false
          this.printDiv('toBePrinted')
          this.printShow = true
          this.printed = true
          this.fetchOrder(this.selectedRow.id)
        }
      })
    },
    printDiv (divName) {
      var printContents = document.getElementById(divName).innerHTML
      var originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
    },
    rePrint: function (printOrder) {
      this.disabledOrderStyleChange = true
      this.orderStyle = printOrder.orderStyle
      this.maxChange(printOrder.orderStyle)
      this.selectedNodes = printOrder.details
      this.companys.forEach(company => {
        if (company.id === printOrder.company) {
          this.company = company
        }
      })
      this.orderType = printOrder.orderType
      this.carNum = printOrder.carNum
      this.deliverPerson = printOrder.deliverPerson
      this.printOrderNo = printOrder.printNo
      this.enableChange = false
      this.printed = true
    },
    reDoPrintOrders: function () {
      this.$confirm('将会删除该订单下的所有已打印单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/order/deletePrintOrders', {
          printOrders: this.printOrders
        }).then(res => {
          if (res.data.success) {
            this.fetchOrder(this.selectedRow.id)
            this.selectedNodes = []
            this.company = null
            this.orderStyle = 1
            this.orderType = 1
            this.carNum = ''
            this.deliverPerson = ''
            this.printOrderNo = this.generateOrderNo(this.selectedRow.date, this.selectedOrderStyle.prefix, 1)
            this.printOrders = []
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    maxChange: function (id) {
      this.orderStyles.forEach(orderStyle => {
        if (orderStyle.id === id) {
          this.orderMax = orderStyle.max
          this.selectedOrderStyle = orderStyle
        }
      })
    },
    orderStyleChange: function (id) {
      this.maxChange(id)
      this.makeOrderNo(this.selectOrderDate, this.selectedOrderStyle, this.details)
      if (this.printed && !this.disabledOrderStyleChange) {
        this.selectedNodes = []
        this.disabledOrderStyleChange = false
      }
      // this.selectedNodes = []
      // this.$refs.tree.setCheckedNodes(this.selectedNodes)
    },
    wrapPrintNo: function (printNo) {
      if (!printNo) {
        return ''
      }
      let dateStr = printNo.substr(0, 8)
      let date = moment(dateStr).format('YYYY-MM-DD')
      let index = printNo.substr(8, 3)
      return date + '-' + index
    },
    submitCostModify: function () {
      this.$http.post('/order/modifyCost', {
        details: this.displayNodes
      }).then(res => {
        if (res.data.success) {
          this.$message({
            showClose: true,
            message: '修改成功！',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
@media print {
    .myDivToPrint {
        background-color: white;
        position: fixed;
        top: 0;
        left: 70px;
        margin: 0;
        padding: 15px;
        overflow: auto;
    }
}
.rowOne {
  height: 500px;
}
.leftPart, .rightPart {
  margin: 3px;
  height: 494px;
}
.tableCls {
  height:350px;
}
.treeCls {
  height:180px;
  overflow-y: scroll;
}
.orderTable, .orderTable3 {
  margin: auto;
  width: 530px;
  border-collapse:collapse;
}
.orderTable3 th, .orderTable3 td, .orderTable th, .orderTable td {
  font-family: "宋体";
}
.orderTable3 th, .orderTable th {
  text-align: center;
  font-size: 22px;
  font-weight: normal;
  text-decoration: underline;
}
.orderTable3 td {
  text-align: center;
  font-size: 12px;
  height:22px;
}
.orderTable td {
  text-align: center;
  font-size: 16px;
  height:22px;
}
.orderContainer {
  text-align:center;
}
.borderCell td{
  border: 1px solid black;
}
.printBtn {
  margin-top:15px;
}
.bottomDiv {
  margin-top: 15px;
}
</style>
