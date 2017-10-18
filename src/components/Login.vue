<template>
  <div class="login-wrap">
    <div class="ms-title">{{title}}</div>
    <div class="ms-login">
      <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="demo-ruleForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" @keyup.native.enter="submitForm('user')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('user')">登录</el-button>
          <el-button @click="resetForm('user')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      },
      title: ''
    }
  },
  mounted () {
    const _this = this
    this.$http.get('/main').then(function (res) {
      _this.title = res.data.websiteName
      document.title = _this.title
    })
  },
  methods: {
    submitForm: function (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/userLogin', {
            username: _this.user.username,
            password: _this.user.password
          }).then(res => {
            let data = res.data
            if (data.success) {
              sessionStorage.setItem('user', res.data.user.username)
              this.$router.push('home')
            } else {
              _this.$message({
                showClose: true,
                message: '账号或密码错误，请重新输入',
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.login-wrap{
    position: relative;
    width:100%;
    height:100%;
   background: #348F50;  /* fallback for old browsers */
background: -webkit-linear-gradient(to bottom, #56B4D3, #348F50);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to bottom, #56B4D3, #348F50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;
}
.ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
}
</style>
