<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>订单查询</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <div slot="header">
      <el-date-picker
        placeholder="起始时间"
        type="date"
        v-model="start">
      </el-date-picker>
      <el-date-picker
        placeholder="结束时间"
        type="date"
        v-model="end">
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
    <div>
      <el-table :data="orders">
        <el-table-column
          prop="_school.name"
          label="学校">
        </el-table-column>
        <el-table-column
          prop="date"
          label="名称">
        </el-table-column>
        <el-table-column
          label="打印状态">
          <template scope="scope">
            <el-tag :type="printColor(scope.row.details)">
              {{printStats(scope.row.details)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button @click="showDetail(scope.row)" type="primary" size="mini">
              查看详情
            </el-button>
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
      <el-dialog title="订单详情" :visible.sync="dialogVisible">
        <el-table
          v-loading.body="loading"
          :data="details"
          height="300">
          <el-table-column
            label="品名"
            prop="_product.name">
          </el-table-column>
          <el-table-column
            label="数量">
            <template scope="scope">
              {{showRealNum(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column
            label="价格"
            prop="price">
          </el-table-column>
          <el-table-column
            label="打印状态">
            <template scope="scope">
              <el-tag v-if="scope.row._print_order" type="success">
                已打印
              </el-tag>
              <el-tag v-else type="danger">
                未打印
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      orders: [],
      school: null,
      start: null,
      end: null,
      schools: [],
      currentPage: 1,
      pageSize: 10,
      total: null,
      dialogVisible: false,
      loading: true,
      details: []
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
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize
      this.lookup()
    },
    handleCurrentChange: function (page) {
      this.currentPage = page
      this.lookup()
    },
    lookup: function () {
      let offset = (this.currentPage - 1) * this.pageSize
      let limit = this.pageSize
      let start = this.start
      let end = this.end
      let school = this.school
      this.$http.post('/order/lookupOrders', {
        offset: offset,
        limit: limit,
        start: start,
        end: end,
        school: school ? school.id : null
      }).then(res => {
        this.total = res.data.total
        this.orders = res.data.orders
      })
    },
    printColor: function (details) {
      let count = 0
      details.forEach(function (detail) {
        if (detail.print_order === null) {
          count++
        }
      }, this)
      if (count === 0) {
        return 'success'
      } else if (count === details.length) {
        return 'danger'
      } else {
        return 'warning'
      }
    },
    printStats: function (details) {
      let count = 0
      details.forEach(function (detail) {
        if (detail.print_order === null) {
          count++
        }
      }, this)
      if (count === 0) {
        return '已全部打印'
      } else if (count === details.length) {
        return '未打印'
      } else {
        return '部分打印'
      }
    },
    showDetail: function (row) {
      this.dialogVisible = true
      this.$http.get('/order/lookupDetaiById', {
        params: {
          order: row.id
        }
      }).then(res => {
        this.loading = false
        this.details = res.data.details.sort(function (a, b) {
          return a._product.name.localeCompare(b._product.name)
        })
      })
    },
    showRealNum: function (row) {
      return row.fake_num ? row.fake_num : row.num
    },
    showPrintStats: function (row) {
      return row._print_order === null ? '未打印' : '已打印'
    }
  }
}
</script>

<style scoped>

</style>
