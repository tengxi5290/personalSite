<template>
    <section class="cms-body" v-loading="loading">
         
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="开启会员功能" class="flex-50"  prop="memberOn">
                <el-radio v-model="dataInfo.memberOn" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.memberOn" :label="false">否</el-radio>
            </el-form-item> 
            <el-form-item label="开启会员注册" class="flex-50"  prop="registerOn">
                <el-radio v-model="dataInfo.registerOn" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.registerOn" :label="false">否</el-radio>
            </el-form-item>   
            <el-form-item label="注册审核" class="flex-100"  prop="checkOn">
                <el-radio v-model="dataInfo.checkOn" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.checkOn" :label="false">否</el-radio>
            </el-form-item>

            <el-form-item label="用户名最小长度" class="flex-50"  prop="usernameMinLen">
               <el-input v-model="dataInfo.usernameMinLen" class="cms-width" type="number"></el-input>
            </el-form-item>  
             <el-form-item label="密码最小长度" class="flex-50"  prop="passwordMinLen">
               <el-input v-model="dataInfo.passwordMinLen" class="cms-width" type="number"></el-input>
            </el-form-item> 
            <el-form-item label="用户头像宽度" class="flex-50"  prop="userImgWidth">
               <el-input v-model="dataInfo.userImgWidth" class="cms-width" type="number"></el-input>
            </el-form-item>  
             <el-form-item label="用户头像高度" class="flex-50"  prop="userImgHeight">
               <el-input v-model="dataInfo.userImgHeight" class="cms-width" type="number"></el-input>
            </el-form-item> 
             <el-form-item label="用户名保留字" class="flex-100"  prop="usernameReserved">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="dataInfo.usernameReserved"  class="cms-width">
                </el-input>
               <span class="gray">可以使用 * 作为通配符，如: *Admin*</span>              
            </el-form-item>



            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/memberUpdate'"
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
    let required = va.required();
    let number = va.number();
    let minNumber = va.minNumber();
    let email = va.email();
    let validateName = va.validateName();
    let tel = va.tel();
    let mobile = va.mobile();  
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:""
      },
      rules: {
        //校验规则
        memberOn:[required],
        checkOn:[required],
        registerOn:[required],
        usernameMinLen:[required,minNumber],
        passwordMinLen:[required,minNumber],
        userImgWidth:[required,number],
        userImgHeight:[required,number],
        
      },
      
    };
  },
     methods:{
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configMemberGet), //axios批量发送请求
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
             this.updateDataInfo(this.$api.configMemberUpdate, this.dataInfo, "");
        }
        
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>