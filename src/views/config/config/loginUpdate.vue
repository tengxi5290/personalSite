<template>
    <section class="cms-body" v-loading="loading">
      
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="登录错误次数" class="flex-50"  prop="errorTimes">
               <el-input v-model="dataInfo.errorTimes" class="cms-width" type='number'></el-input>
               <span class="gray">达到错误次数后显示验证码</span>
            </el-form-item>       
             <el-form-item label="登录错误时间" class="flex-50"  prop="errorInterval">
               <el-input v-model="dataInfo.errorInterval" class="cms-width" type='number'></el-input>
               <span class="gray">(分钟)。超过时间重计次数</span>
            </el-form-item>     
            <el-form-item label="邮件服务器" class="flex-50"  prop="host">
               <el-input v-model="dataInfo.host" class="cms-width"></el-input>               
            </el-form-item>
            <el-form-item label="邮件端口" class="flex-50"  prop="port">
               <el-input v-model="dataInfo.port" class="cms-width" type='number'></el-input> 
               <span class="gray">留空则为默认端口</span>              
            </el-form-item>    
           <el-form-item label="邮件用户名" class="flex-50"  prop="username">
               <el-input v-model="dataInfo.username" class="cms-width"></el-input>               
            </el-form-item>
            <el-form-item label="邮件密码" class="flex-50"  prop="password">
               <el-input v-model="dataInfo.password" class="cms-width" type="password"></el-input>               
            </el-form-item>
            <el-form-item label="邮件编码" class="flex-50"  prop="encoding">
               <el-input v-model="dataInfo.encoding" class="cms-width"></el-input>               
            </el-form-item>
            <el-form-item label="发件人" class="flex-50"  prop="personal">
               <el-input v-model="dataInfo.personal" class="cms-width"></el-input>               
            </el-form-item>
            <el-form-item label="找回密码标题" class="flex-100"  prop="forgotPasswordSubject">
               <el-input v-model="dataInfo.forgotPasswordSubject" class="cms-width"></el-input>               
            </el-form-item>    
             <el-form-item label="找回密码内容" class="flex-100"  prop="forgotPasswordText">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="dataInfo.forgotPasswordText" class="cms-width" rows="6">
                </el-input>
               <span class="gray">用户ID：${Uid}，用户名：${Username}，重置KEY：${ResetKey}，重置密码：${ResetPwd}</span>              
            </el-form-item>
            <el-form-item label="会员注册标题" class="flex-100"  prop="registerSubject">
               <el-input v-model="dataInfo.registerSubject" class="cms-width"></el-input>               
            </el-form-item> 
            <el-form-item label="会员注册内容" class="flex-100"  prop="registerText">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="dataInfo.registerText" class="cms-width" rows="4">
                </el-input>
               <span class="gray">用户名：${Username}，激活码：${ActivationCode}</span>              
            </el-form-item>


            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/loginUpdate'"
                >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let numberLim = va.numberLim('只能输入数字');
    
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:""
      },
      rules: {
        //校验规则
        password:[required],
        forgotPasswordSubject:[required],
        registerText:[required],
        errorTimes:[required,number],
        host:[required],
        errorInterval:[required,number],
        forgotPasswordText:[required],
        username:[required],
        registerSubject:[required],
        port:[numberLim],
      },
      
    };
  },
     methods:{
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configLoginGet), //axios批量发送请求
        ])
        .then(
            axios.spread((group)=>{
                this.dataInfo=group.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
             this.updateDataInfo(this.$api.configLoginUpdate, this.dataInfo, "");
        }
        
  },
  created(){
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style>

</style>