<template>
    <section class="cms-body" v-loading="loading">
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="App Key" class="flex-50"  prop="wxAppkey">
               <el-input v-model="dataInfo.wxAppkey" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item> 
             <el-form-item label="App Secret" class="flex-50"  prop="wxAppSecret">
               <el-input v-model="dataInfo.wxAppSecret" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item> 
            <el-form-item class="flex-100" label="token"  prop="wxToken">
               <el-input class="cms-input cms-width" v-model="dataInfo.wxToken" type="password"></el-input>
            </el-form-item>  
            <el-form-item label="关注欢迎语" class="flex-100"  prop="welcome">
               <el-input
                    type="textarea"
                    :rows="2" class="cms-width"
                    placeholder="请输入内容"
                    v-model="dataInfo.welcome">
                </el-input>
            </el-form-item>
            <el-form-item label="微信二维码" class="flex-100">            
                    <cms-upload :src='dataInfo.pic' :isMark='false' @change='getPath'></cms-upload>
                    <span class="gray">留空则使用文字水印</span> 
           </el-form-item> 

            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/weixinConfig'"
                >提交</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
import { Encrypt } from "@/untils/aes";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required();
    return {
      params: {//只需要业务参数
       
      },
      rules: {
        //校验规则
         welcome:[required],
      },
      
    };
  },
     methods:{
        getPath(value){
           this.dataInfo.pic=value;  
        },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.weixinGet), //axios批量发送请求
        ])
        .then(
            axios.spread((group)=>{
                this.dataInfo=group.body;
                this.dataInfo.wxAppkey='';
                this.dataInfo.wxAppSecret=''
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        ).catch(err => {
          this.loading = false;
        });
        },
         update() {  
            this.updateDataInfo(this.$api.weixinConfig,this.dataInfo, "");
            this.getDataInfo(this.id);
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