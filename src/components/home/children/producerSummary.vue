<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item>供应商汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header">
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
        <el-select v-model="producer" filterable placeholder="请选择供应商">
          <el-option
            v-for="item in producers"
            :key="item.id"
            :label="item.name"
            :value="item"
            @change="lookup">
          </el-option>
        </el-select>
        <el-button @click="lookup">
          查询
        </el-button>
        <el-checkbox v-model="showSpec" @change="reserveChange">规格</el-checkbox>
        <el-checkbox v-model="showUnit" @change="reserveChange">单位</el-checkbox>
        <el-checkbox v-model="reserve">倒置</el-checkbox>
        <div style="margin-top:15px;">
          统计学校：
          <el-checkbox v-for="school in schoolArray" :key="school.id" 
            v-model="school.show" @change="schoolChange">
            {{school.short ? school.short : school.name}}
          </el-checkbox>
        </div>
      </div>
      <div>
        <el-table :data="schoolProducts" v-if="reserve">
          <el-table-column type="expand">
            <template scope="props">
              <el-table :data="props.row.schools" style="width:450px">
                <el-table-column
                  prop="school"
                  label="学校">
                </el-table-column>
                <el-table-column v-for="product in products" :key="product.id"
                  :prop="product.id + ''"
                  :label="product.name">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
        </el-table>
        <el-table :data="printOrders" v-if="!reserve">
          <el-table-column type="expand">
            <template scope="props">
              <el-table :data="props.row.details" style="width:450px">
                <el-table-column
                  prop="_product.name"
                  label="品名">
                </el-table-column>
                <el-table-column
                  v-if="showSpec"
                  prop="_product.spec"
                  label="规格">
                </el-table-column>
                <el-table-column
                  v-if="showUnit"
                  prop="_product.unit"
                  label="单位">
                </el-table-column>
                <el-table-column
                  label="学校">
                  <template scope="scope">
                    {{scope.row._order._school.short ? scope.row._order._school.short : scope.row._order._school.name}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  label="数量">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
        </el-table>
        <div class="summary">合计表格：</div>
        <el-table :data="productTotal">
          <el-table-column
            prop="name"
            label="品名">
          </el-table-column>
          <el-table-column
            prop="total"
            label="总计数量">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      producer: null,
      producerName: '',
      producers: [],
      start: null,
      end: null,
      printOrders: [],
      productTotal: [],
      showSpec: false,
      showUnit: false,
      reserve: false,
      schoolProducts: [],
      products: [],
      details: [],
      schools: new Map()
    }
  },
  computed: {
    schoolArray: function () {
      return [...this.schools.values()]
    }
  },
  mounted () {
    this.fetchProducer()
  },
  methods: {
    schoolChange () {
      this.warpData(this.details)
      this.generateReserveData(this.details)
    },
    reserveChange () {
      if (this.reserve && this.details) {
        this.generateReserveData(this.details)
      }
    },
    fetchProducer () {
      this.$http.get('/producer/lookup').then(res => {
        this.producers = res.data.producers
      })
    },
    lookup () {
      if (this.start && this.end && this.producer) {
        this.$http.post('/order/producerSummary', {
          start: this.start,
          end: this.end,
          producer: this.producer.id
        }).then(res => {
          this.details = res.data.details
          this.generateSchool()
          this.warpData(res.data.details)
          this.generateReserveData(res.data.details)
        })
      }
    },
    generateSchool () {
      let schools = new Map()
      this.details.forEach(detail => {
        if (detail._order._school) {
          detail._order._school.show = true
          schools.set(detail._order._school.id, detail._order._school)
        }
      })
      this.schools = schools
    },
    generateReserveData (details) {
      let reserveData = new Map()
      let products = new Map()
      details.forEach(detail => {
        if (!this.schools.get(detail._order._school.id) ||
          !this.schools.get(detail._order._school.id).show) {
          return
        }
        let date = detail._order.date
        if (!reserveData.has(date)) {
          let schoolMap = new Map()
          reserveData.set(date, schoolMap)
        }
        let schoolMap = reserveData.get(date)
        let school = detail._order._school
        if (!schoolMap.has(school.id)) {
          let productsCount = {}
          schoolMap.set(school.id, productsCount)
        }
        let productsCount = schoolMap.get(school.id)
        let product = detail._product
        if (!productsCount[product.id]) {
          products.set(product.id, product)
          productsCount[product.id] = 0
          productsCount.id = product.id
          productsCount.spec = product.spec
          productsCount.unit = product.unit
          productsCount.name = product.name
          productsCount.school = school.short ? school.short : school.name
        }
        if (detail.count) {
          productsCount[product.id] += detail.count
        }
      })
      let data = []
      for (let [key, value] of reserveData) {
        data.push({
          date: key,
          schools: [...value.values()]
        })
      }
      data.forEach(schoolMap => {
        let specs = {}
        let units = {}
        specs.school = '规格'
        units.school = '单位'
        schoolMap.schools.forEach(productsCount => {
          specs[productsCount.id] = productsCount.spec
          units[productsCount.id] = productsCount.unit
        })
        if (this.showSpec) {
          schoolMap.schools.splice(0, 0, specs)
        }
        if (this.showUnit) {
          schoolMap.schools.splice(0, 0, units)
        }
      })
      this.products = [...products.values()]
      this.schoolProducts = data
    },
    getAmount (detail) {
      return parseInt(detail.count) * parseFloat(detail.price)
    },
    warpData (details) {
      let dateDetails = new Map()
      let productDetails = new Map()
      details.forEach(detail => {
        if (!this.schools.get(detail._order._school.id) ||
          !this.schools.get(detail._order._school.id).show) {
          return
        }
        let date = detail._order.date
        let product = detail._product.id
        let num = detail.count
        if (productDetails.has(product) && detail.count) {
          productDetails.get(product).total += num
        } else {
          productDetails.set(product, {
            name: detail._product.name,
            total: num,
            unit: detail._product.unit,
            spec: detail._product.spec
          })
        }
        if (dateDetails.has(date)) {
          let mapDetail = dateDetails.get(date)
          mapDetail.details.push(detail)
        } else {
          dateDetails.set(date, {
            date: date,
            details: [detail]
          })
        }
      })
      this.printOrders = [...dateDetails.values()]
      this.productTotal = [...productDetails.values()]
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
.summary {
  padding: 10px;
}
</style>
