<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" 
        class="cms-form" label-width="190px">
         <el-form-item label="独立密码" class="flex-100"  prop="apiPwd">
               <el-input v-model="dataInfo.apiPwd" class="cms-width"  type="password"></el-input>
             <el-button @click="showpwd" v-if="type=='update'">查看</el-button>
            <span class="gray" v-if="type=='update'">输入密码后查看信息</span>
         </el-form-item>   
         <el-form-item label="是否默认管理后台API账户" class="flex-50"  prop="admin">
                 <el-radio-group v-model="dataInfo.admin">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
         </el-form-item>  
         <el-form-item label="是否限制单设备同时登陆" class="flex-50"  prop="limitSingleDevice">
                 <el-radio-group v-model="dataInfo.limitSingleDevice">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
         </el-form-item>  

         <el-form-item label="APP ID" class="flex-50"  prop="setAppId">
               <el-input :readonly='true' v-model="dataInfo.setAppId" class="cms-width"  :type='valueType'></el-input>
               <el-button type="primary" @click="creatAppId"  v-if="type=='save'">生成</el-button>
         </el-form-item>  
        <el-form-item label="APP KEY" class="flex-50"  prop="appKey">
               <el-input :readonly='true' v-model="dataInfo.appKey" class="cms-width"  :type='valueType'></el-input>
               <el-button type="primary" @click="creatAppKey"  v-if="type=='save'">生成</el-button>
         </el-form-item> 
        
         <el-form-item label="aesKey" class="flex-50"  prop="aesKey">
               <el-input :readonly='true' v-model="dataInfo.aesKey" class="cms-width"   :type='valueType'></el-input>
               <el-button  type="primary" @click="creatAesKey"  v-if="type=='save'">生成</el-button>
         </el-form-item> 
        <el-form-item label="ivKey" class="flex-50"  prop="ivKey">
               <el-input :readonly='true' v-model="dataInfo.ivKey" class="cms-width"  :type='valueType'></el-input>
               <el-button  type="primary" @click="creatIvKey"  v-if="type=='save'">生成</el-button>
         </el-form-item> 
        <el-form-item label="禁用" class="flex-100"  prop="disabled" v-if="type=='save'">
                 <el-radio-group v-model="dataInfo.disabled">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
         </el-form-item>  
         <div class="form-footer" v-if="type=='save'">
           <el-button type="warning" @click="add(true)"
                v-perms="'/apiManage/apiAccount/add'"
           >保存并继续添加</el-button>
            <el-button type="primary"  @click="add(false)"
                 v-perms="'/apiManage/apiAccount/add'"
            >提交</el-button>
           <el-button type="info" @click="$reset">重置</el-button>
           <span class="gray">
               选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
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
            axios.post(this.$api.apiAccountValPwd, { password: va }) //axios批量发送请求
          .then(data=>{  
            if (data.body.result) {
               this.show=true;
                     callback();
              } else {
                  this.show=false;
                    callback(new Error("请输入正确的独立密码"));              
              }})
      }
    };
    return {
      memberGroup: [], //业务变量会员组
      checkApiPwd: false,
      rules: {
        //校验规则
        disabled: [required],
        apiPwd: [{validator:validatePwd,trigger:'blur'}]
      },
      valueType: "password",
      show:false,
    };
  },
  methods: {
    showpwd() {
      if (this.show) {
        this.valueType = "text";
      } else {
        this.valueType = "password";
      }
    },
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      axios
        .all([
          axios.post(api.apiAccountGet, { id: id }) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            this.dataInfo = data.body; //将用户数据复制给dataInfo
            this.$refs["form"].resetFields();
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    creatAppId() {
      this.dataInfo.setAppId = this.randomWord(false, true, 16);
    },
    creatAppKey() {
      this.dataInfo.appKey = this.randomWord(false, false, 32);
    },
    creatAesKey() {
      this.dataInfo.aesKey = this.randomWord(false, false, 16);
    },
    creatIvKey() {
      this.dataInfo.ivKey = this.randomWord(false, false, 16);
    },
    randomWord(randomFlag, numFlag, min, max) {
      var str = "",
        range = min,
        arr = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ];

      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      //纯数字组合
      if (numFlag) {
        arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      }
      for (var i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    checkPwd(value) {
      //密码校验
    },
    add(state) {
     
       let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                     this.dataInfo.apiPwd = Encrypt(
                      this.dataInfo.apiPwd,
                      process.env.aesKey,
                      process.env.ivKey
                              ); //加密
                    axios.post(this.$api.apiAccountSave, this.dataInfo)
                        .then(res => {       
                            if (res.code == "200") {
                                this.successMessage('添加成功');
                                if (state) {
                                    this.reset();
                                } else {
                                    setTimeout(() => {
                                        this.routerLink('list');
                                    }, 1000);
                                }
                            }
                            this.loading = false;
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
    }
  },
  created() {
    if (this.type == 'save') {
            this.valueType='text';
            this.getDataInfo(this.id);
        } else if (this.type == 'update') {
           this.valueType='password';
             this.getDataInfo(this.id);
        };
    //初始获取数据
  
  }
};
</script>

<style>

</style>
