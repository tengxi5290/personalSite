<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" 
        class="cms-form" label-width="162px">
      
    <el-form-item label="旧密码" prop="oldPwd" class="flex-100"  >
            <el-input class="cms-width" v-model="dataInfo.oldPwd" type="password"></el-input>
         </el-form-item> 
        <el-form-item label="新密码" prop="newPwd" class="flex-100"  >
            <el-input class="cms-width" v-model="dataInfo.newPwd" type="password"></el-input>
         </el-form-item> 
         <el-form-item label="再次输入新密码" prop="newPwd2" class="flex-100"  >
            <el-input class="cms-width" v-model="dataInfo.newPwd2" type="password"></el-input>
         </el-form-item> 
         
         <div class="form-footer" v-if="type=='save'">
            <el-button type="primary"  @click="add(false)"
                 v-perms="'/apiManage/apiAccount/add'"
            >修改</el-button>
           <el-button type="info" @click="$reset">重置</el-button>
         </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
import { Encrypt } from "@/untils/aes";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    var validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入独立密码"));
        this.valueType = "password";
      } else {
        let va = Encrypt(value, process.env.aesKey, process.env.ivKey); //加密
        axios
          .post(this.$api.apiAccountValPwd, { password: va }) //axios批量发送请求
          .then(data => {
            if (data.body.result) {
              
              callback();
            } else {

              callback(new Error("请输入正确的独立密码"));
            }
          });
      }
    };
     var validatePass = (rule, value, callback) => {
            if (value === '') {
               callback(new Error('请输入新密码'));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
             callback(new Error('请再次输入密码'));
            } else if (value !== this.dataInfo.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };    
    return {
      memberGroup: [], //业务变量会员组
      checkApiPwd: false,
      rules: {
          oldPwd:[{validator:validatePwd,trigger:'blur'}],
          newPwd:[{validator:validatePass,trigger:'blur'}],
          newPwd2:[{validator:validatePass2,trigger:'blur'}]
      },
      valueType: "password",
      show: false
    };
  },
  methods: {
    add(state) {
      let form = this.$refs["form"];
      form.validate(valid => {
        //验证方法
        if (valid) {
          this.loading = true;
          let params={
            oldPWD:'',
            newPWD:''
          }
            params.oldPWD=Encrypt(this.dataInfo.oldPwd, process.env.aesKey, process.env.ivKey ); //加密
             params.newPWD=Encrypt(this.dataInfo.newPwd, process.env.aesKey, process.env.ivKey ); //加密

          axios
            .post('/api/admin/apiAccount/pwd_update',params)
            .then(res => {
              if (res.code == "200") {
                this.successMessage("修改成功");
                  setTimeout(() => {
                    this.routerLink("list");
                  }, 1000);
              }
              this.loading = false;
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.loading=false;
  }
};
</script>

<style>

</style>
