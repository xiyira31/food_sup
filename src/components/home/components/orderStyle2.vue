<template>
  <div>
    <table class="orderTable myDivToPrint">
      <tr>
        <th colspan="6">{{company? company.name : ''}}配送单</th>
      </tr>
      <tr class="secondLine">
        <td colspan="4" style="text-align:left">
          收货单位：{{school ? school.name : ''}}
        </td>
        <td colspan="2" style="text-align:left">
          配货单号：{{printOrderNo}}
        </td>
      </tr>
      <tr class="borderCell">
        <td>
          产品名称
        </td>
        <td>
          单位
        </td>
        <td>
          发货数
        </td>
        <td>
          实收数
        </td>
        <td>
          单价（元）
        </td>
        <td>
          金额（元）
        </td>
      </tr>
      <tr v-for="detail in details" class="borderCell" :key="detail.id">
        <td>
          {{detail._product.name}}
        </td>
        <td>
          {{detail._product.unit}}
        </td>
        <td>
          {{detail.num}}
        </td>
        <td>
          {{orderType === 2? handleNum(detail) :''}}
        </td>
        <td>
          {{detail.price.toFixed(2)}}
        </td>
        <td style="text-align:right">
          {{handleTotal(detail)}}
        </td>
      </tr>
      <tr v-for="i in 10 - details.length" class="borderCell" :key="i">
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
        </td>
      </tr>
      <tr class="borderCell">
        <td colspan="4" style="text-align:left">
          大写：
        </td>
        <td  style="text-align:left">
          小计：
        </td>
        <td style="text-align:right">
          {{summary}}
        </td>
      </tr>
      <tr class="borderCell">
        <td colspan="2" style="text-align:left">
          配送车号：{{carNum}}
        </td>
        <td colspan="2" style="text-align:left">
          送货人：{{deliverPerson}}
        </td>
        <td colspan="2" style="text-align:left">
          收货人：
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['company', 'school', 'printOrderNo', 'details', 'orderStyle', 'orderType',
    'deliverPerson', 'carNum'],
  computed: {
    summary: function () {
      let total = 0
      this.details.forEach(detail => {
        total += this.handleNum(detail) * detail.price
      })
      return total.toFixed(2)
    }
  },
  methods: {
    handleNum: function (detail) {
      if (this.orderType === 1) {
        return detail.num
      } else {
        return detail.fake_num ? detail.fake_num : detail.num
      }
    },
    handleTotal: function (detail) {
      if (this.orderType === 1) {
        return (detail.price * detail.num).toFixed(2)
      } else {
        return (detail.price * this.handleNum(detail)).toFixed(2)
      }
    },
    handleTotalBeiShiDa: function (detail) {
      if (this.orderType === 2 && detail.fake_num) {
        return (detail.price * this.handleNum(detail)).toFixed(2)
      }
    },
    alboToChinese: function (n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        return '数据非法'
      }
      let unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'
      let str = ''
      n += '00'
      let p = n.indexOf('.')
      if (p >= 0) {
        n = n.substring(0, p) + n.substr(p + 1, 2)
      }
      unit = unit.substr(unit.length - n.length)
      for (let i = 0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
      }
      return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(兆|万|亿|元)/g, '$1').replace(/(兆|亿)万/g, '$1').replace(/(京|兆)亿/g, '$1').replace(/(京)兆/g, '$1').replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2零$3仟').replace(/^元零?|零分/g, '').replace(/(元|角)$/g, '$1整')
    }
  }
}
</script>

<style scoped>
@media print {
    .myDivToPrint {
        background-color: white;
        position: fixed;
        top: 30px;
        left: 100px;
        margin: 0;
        padding: 15px;
        overflow: auto;
    }    
    .myDivToPrint1 {
      background-color: white;
      position: fixed;
      top: 30px;
      left: 25px;
      margin: 0;
      padding: 15px;
      overflow: auto;
    }
    .myDivToPrint2 {
      background-color: white;
      position: fixed;
      top: 30px;
      left: 50px;
      margin: 0;
      padding: 15px;
      overflow: auto;
    }
    .myDivToPrint3 {
      background-color: white;
      position: fixed;
      top: 10px;
      left: 100px;
      margin: 0;
      padding: 15px;
      overflow: auto;
    }
}
.orderTable, .orderTable3 {
  margin: auto;
  width: 530px;
  border-collapse:collapse;
}
.orderTable4 {
  margin: auto;
  width: 450px;
  border-collapse:collapse;
}
.orderTable2 {
  margin: auto;
  width: 630px;
  border-collapse:collapse;
}
.orderTable4 th, .orderTable4 td,.orderTable3 th, .orderTable3 td, .orderTable th, .orderTable td, .orderTable2 th, .orderTable2 td {
  font-family: "宋体";
}
.orderTable3 th, .orderTable th, .orderTable2 th, .orderTable4 th {
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
.orderTable td, .orderTable2 td, .orderTable4 td {
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
