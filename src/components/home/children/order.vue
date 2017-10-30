<template>
<div>
  <el-breadcrumb separator="/" class="bread">
    <el-breadcrumb-item>订单录入</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <div slot="header">
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
    </div>
    <el-collapse>
      <el-collapse-item title="订单详情" name="1">
        <template slot="title">
          订单详情<el-badge class="mark" :value="details.length" />
        </template>
        <el-row>
          <el-col :span="24" class="product_detail">
            <el-card>
              <div slot="header">
                订单详情: {{selectedSchoolName}} - {{wrappedDate}}
              </div>
              <div>
                <el-table :data="details">
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
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree :data="tree" 
            default-expand-all
            :props="{
              label: 'name',
              children: 'products'
            }"
            :filter-node-method="filterNode" 
            ref="foodTree"
            @node-click="handleNodeClick"
            class="treeStyle"></el-tree>
        </el-col>
        <el-col :span="16" class="enter_place">
          <el-card>
            <div slot="header">
              录入商品名：{{orderDetail.name}}
            </div>
            <el-form ref="ruleForm" :model="orderDetail" :rules="rules" label-width="70px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单位">
                    {{orderDetail.unit}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="规格">
                    {{orderDetail.spec}}
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
                    <el-input v-model.number="orderDetail.num" class="tiny" @keyup.enter.native="submitDetail"></el-input>
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
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      orderDate: Date.now(),
      orderSchool: null,
      filterText: '',
      prevent: false,
      orderDetail: {
        product: null,
        price: null,
        num: null,
        fake_num: null,
        produce_date: null,
        producer: null
      },
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
      },
      tree: [],
      schools: [],
      producers: [],
      details: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.foodTree.filter(val)
    }
  },
  mounted () {
    this.fetchTree()
  },
  computed: {
    wrappedDate: function () {
      moment.locale('zh-cn')
      let mDate = moment(this.orderDate)
      return mDate.format('LL')
    },
    selectedSchoolName: function () {
      if (this.orderSchool) {
        return this.orderSchool.name
      } else {
        return '请选择学校'
      }
    }
  },
  methods: {
    filterNode: function (value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick: function (data, node) {
      if (node.isLeaf && node.level > 1) {
        let orderDetail = this.orderDetail
        orderDetail.product = data.id
        orderDetail.price = parseFloat(data.price)
        orderDetail.name = data.name
        orderDetail.unit = data.unit
        orderDetail.spec = data.spec
        this.producers = data.producers
        if (this.producers.length === 1) {
          orderDetail.producer = this.producers[0]._producer.id
        } else {
          orderDetail.producer = null
        }
      }
    },
    fetchTree: function () {
      this.$http.get('/type/lookupAll').then(res => {
        this.tree = res.data.types
      })
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
    submitDetail: function () {
      if (!this.orderDetail.product) {
        this.$message({
          showClose: true,
          message: '请选择提交的商品！',
          type: 'error'
        })
        return
      }
      if (!this.orderSchool) {
        this.$message({
          showClose: true,
          message: '请选择学校！',
          type: 'error'
        })
        return
      }
      if (!this.orderDate) {
        this.$message({
          showClose: true,
          message: '请选择日期！',
          type: 'error'
        })
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.orderDate && this.orderSchool) {
            if (this.prevent === true) {
              return
            }
            this.prevent = true
            let date = moment(this.orderDate).format('YYYY-MM-DD')
            this.$http.post('/order/create', {
              date: date + '',
              school: this.orderSchool.id,
              detail: this.orderDetail
            }).then(res => {
              if (res.data.success) {
                this.$message({
                  showClose: true,
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['ruleForm'].resetFields()
                this.orderDetail.produce_date = null
                this.lookup()
                this.prevent = false
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '请选择时间和学校',
              type: 'error'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.bread {
  font-size: 20px;
  margin:5px;
  font-weight:bold;
  margin-bottom:20px;
}
.treeStyle {
  height:325px;
  overflow-y: scroll
}
.enter_place {
  padding-left:10px;
  padding-bottom:10px;
}
.product_detail {
  padding-left:10px;
  padding-right:10px;
}
.inputStyle {
  width:200px;
}
.tiny {
  width: 175px;
}
.sub_btn {
  float: right;
  margin:10px;
}
.mark {
  margin-top:5px;
  margin-left:5px;
}
</style>
