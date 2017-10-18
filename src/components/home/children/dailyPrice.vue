<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>每日价格录入</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <div slot="header">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        @change="lookup">
      </el-date-picker>
      <el-select v-model="type" placeholder="请选择类型" @change="lookup">
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      品名：
      <el-input v-model="searchWord" class="searchInput">
      </el-input>
      <el-button @click="lookup">搜索</el-button>
    </div>
    <div>
      <el-table :data="products">
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          label="价格1">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price1"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格2">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price2"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格3">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price3"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格4">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price4"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格5">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price5"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格6">
          <template scope="scope">
            <el-input v-model="scope.row.dailyPrice.price6"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button @click="submitPrice(scope.row)">提交</el-button>
          </template>
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
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      types: [],
      type: null,
      date: new Date(),
      products: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      searchWord: ''
    }
  },
  mounted () {
    this.GetTypes()
  },
  methods: {
    GetTypes: function () {
      this.$http.get('/type/lookup').then(res => {
        this.types = res.data.types
      })
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize
      this.lookup()
    },
    handleCurrentChange: function (page) {
      this.currentPage = page
      this.lookup()
    },
    lookup: function () {
      if (!this.date || !this.type) {
        return
      }
      let offset = (this.currentPage - 1) * this.pageSize
      let limit = this.pageSize
      let date = this.date
      let type = this.type.id
      this.$http.post('/product/lookupDailyPrice', {
        offset: offset,
        limit: limit,
        date: date,
        type: type,
        searchWord: this.searchWord
      }).then(res => {
        this.total = res.data.total
        this.products = res.data.products
        this.handleProducts(this.products)
      })
    },
    handleProducts: function (products) {
      products.forEach(product => {
        if (product.prices.length === 0) {
          product.dailyPrice = {
            id: null,
            date: this.date,
            product: product.id,
            price1: null,
            price2: null,
            price3: null,
            price4: null,
            price5: null,
            price6: null
          }
        } else {
          product.dailyPrice = product.prices[0]
        }
      })
    },
    submitPrice: function (row) {
      console.log(row)
      this.$http.post('/product/saveDailyPrice', {
        dailyPrice: row.dailyPrice
      }).then(res => {
        if (res.data.success) {
          this.$message({
            showClose: true,
            message: '提交成功！',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '提交失败！',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.searchInput {
  width: 200px;
}
</style>
