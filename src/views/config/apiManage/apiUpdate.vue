<template>
    <section class="cms-body" v-loading="loading">
        
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="QQ登录" class="flex-100"  prop="qqEnable">
                <el-radio v-model="dataInfo.qqEnable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.qqEnable" :label="false">否</el-radio>
            </el-form-item>       
            <el-form-item label="APP ID" class="flex-50" prop="qqID">
                    <el-input class="cms-width" v-model="dataInfo.qqID"></el-input>                  
            </el-form-item> 
            <el-form-item label="APP KEY" class="flex-50" prop="qqKey">
                    <el-input class="cms-width" v-model="dataInfo.qqKey"></el-input>                  
            </el-form-item>
            <el-form-item label="新浪微博登录" class="flex-100"  prop="sinaEnable">
                <el-radio v-model="dataInfo.sinaEnable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.sinaEnable" :label="false">否</el-radio>
            </el-form-item>       
            <el-form-item label="APP ID" class="flex-50" prop="sinaID">
                    <el-input class="cms-width" v-model="dataInfo.sinaID"></el-input>                  
            </el-form-item> 
            <el-form-item label="APP KEY" class="flex-50" prop="sinaKey">
                    <el-input class="cms-width" v-model="dataInfo.sinaKey"></el-input>                  
            </el-form-item>
            <el-form-item label="腾讯微博登录" class="flex-100"  prop="qqWeboEnable">
                <el-radio v-model="dataInfo.qqWeboEnable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.qqWeboEnable" :label="false">否</el-radio>
            </el-form-item>       
            <el-form-item label="APP ID" class="flex-50" prop="qqWeboID">
                    <el-input class="cms-width" v-model="dataInfo.qqWeboID"></el-input>                  
            </el-form-item> 
            <el-form-item label="APP KEY" class="flex-50" prop="qqWeboKey">
                    <el-input class="cms-width" v-model="dataInfo.qqWeboKey"></el-input>                  
            </el-form-item>
             <el-form-item label="微信登录" class="flex-100"  prop="weixinEnable">
                <el-radio v-model="dataInfo.weixinEnable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.weixinEnable" :label="false">否</el-radio>
            </el-form-item>       
            <el-form-item label="APP ID" class="flex-50" prop="weixinLoginId">
                    <el-input class="cms-width" v-model="dataInfo.weixinLoginId"></el-input>                  
            </el-form-item> 
            <el-form-item label="APP KEY" class="flex-50" prop="weixinLoginSecret">
                    <el-input class="cms-width" v-model="dataInfo.weixinLoginSecret"></el-input>                  
            </el-form-item>    

            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/apiManage/apiUpdate'"
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
    let email = va.email();
    let validateName = va.validateName();
    let tel = va.tel();
    let mobile = va.mobile();  
    return {
      params: {//只需要业务参数
       
      },
      rules: {
        //校验规则
        qqEnable:[required],
        sinaEnable:[required],
        qqWeboEnable:[required],
        weixinEnable:[required]
      },
      
    };
  },
     methods:{
         getPath(value){
           this.dataInfo.imagePath=value;  
         },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.apiGet), //axios批量发送请求
        ])
        .then(
            axios.spread((mark)=>{
                this.dataInfo=mark.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
             this.updateDataInfo(this.$api.apiUpdate, this.dataInfo, "");
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