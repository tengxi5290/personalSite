<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">

            <el-form-item label="名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width" maxlength="15"></el-input> 
            </el-form-item> 

            <el-form-item label="选择运营商" class="flex-50"  prop="source">
               <el-select v-model="dataInfo.source">
                    <el-option :value="1" label="阿里云"></el-option> 
                    <el-option :value="2" label="腾讯云"></el-option>
                    <el-option :value="3" label="百度云"></el-option> 
               </el-select>
            </el-form-item>

            <el-form-item label="accessKey" class="flex-50"  prop="accessKeyId">
               <el-input v-model="dataInfo.accessKeyId" class="cms-width"></el-input>
               
            </el-form-item> 
      
            <el-form-item label="accessKeySecret" class="flex-50"  prop="accessKeySecret">
               <el-input v-model="dataInfo.accessKeySecret" class="cms-width"></el-input> 
              
            </el-form-item> 

            <el-form-item label="短信模板CODE" class="flex-50"  prop="templateCode">
               <el-input v-model="dataInfo.templateCode" class="cms-width"></el-input> 
            </el-form-item> 
            <el-form-item label="发送短信间隔时间" class="flex-50"  prop="intervalTime">
               <el-input v-model="dataInfo.intervalTime" class="cms-width"></el-input> 
            </el-form-item> 
      
            <el-form-item label="发送间隔时间单位" class="flex-50"  prop="defValue">
               <el-select v-model="dataInfo.intervalUnit">
                    <el-option :value="0" label="秒"></el-option> 
                    <el-option :value="1" label="分"></el-option>
                    <el-option :value="2" label="时"></el-option> 
               </el-select>
            </el-form-item> 

            <el-form-item label="验证码有效时间" class="flex-50"  prop="effectiveTime">
               <el-input v-model="dataInfo.effectiveTime" class="cms-width"></el-input> 
            </el-form-item> 

            <el-form-item label="验证码有效时间单位" class="flex-50"  prop="defValue">
               <el-select v-model="dataInfo.effectiveUnit">
                  <el-option :value="0" label="秒"></el-option> 
                  <el-option :value="1" label="分"></el-option>
                  <el-option :value="2" label="时"></el-option> 
               </el-select>
            </el-form-item> 

            <el-form-item v-if="dataInfo.source!=2" label="模板参数" class="flex-50"  prop="templateParam">
               <el-input v-model="dataInfo.templateParam" class="cms-width"></el-input> 
            </el-form-item>

            <el-form-item v-if="dataInfo.source==1" label="短信签名" class="flex-50"  prop="signName">
                <el-input v-model="dataInfo.signName" class="cms-width"></el-input> 
            </el-form-item> 

            <el-form-item v-if="dataInfo.source==2" label="区域码" class="flex-50"  prop="nationCode">
                <el-input v-model="dataInfo.nationCode" class="cms-width"></el-input> 
            </el-form-item> 

            <el-form-item v-if="dataInfo.source==3" label="SMS服务域名" class="flex-50"  prop="endPoint">
                <el-input v-model="dataInfo.endPoint" class="cms-width"></el-input> 
            </el-form-item> 

            <el-form-item v-if="dataInfo.source==3" label="短信签名ID" class="flex-50"  prop="invokeId">
              <el-input v-model="dataInfo.invokeId" class="cms-width"></el-input> 
            </el-form-item>

            <el-form-item label="验证码位数" class="flex-50"  prop="randomNum">
              <el-input v-model="dataInfo.randomNum" class="cms-width" maxlength="1"></el-input> 
            </el-form-item>

            <div class="form-footer">
                <el-button  type="primary"  @click="add(false)"
                    v-perms="'/smsServer/smsServer/add'"
                >提交</el-button>
                <el-button type="info" @click="reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
import {Encrypt} from '@/untils/aes';
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
   
   
    return {
      params: {//只需要业务参数

      },
      rules: {
        //校验规则
        name:[required],
        source:[required],
        accessKeyId:[required],
        accessKeySecret:[required],
        templateCode:[required],
        templateParam:[required],
        signName:[required],
        nationCode:[required],
        endPoint:[required],
        invokeId:[required],
        required:[required],
        randomNum:[number],
        nationCode:[number],
        effectiveTime:[number],
        intervalTime:[number],
      },
      checkRes:false,
    };
  },
     methods:{    
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.smsServerGET, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((type)=>{
                this.dataInfo=type.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() { 
            let obj=Object.assign({},this.dataInfo);
            obj.templateParam=this.dataInfo.templateParam.join(',');
            obj.accessKeyId=Encrypt(this.dataInfo.accessKeyId,process.env.aesKey, process.env.ivKey);//加密     
            obj.accessKeySecret=Encrypt(this.dataInfo.accessKeySecret,process.env.aesKey, process.env.ivKey);//加密
            this.updateDataInfo(this.$api.smsServerUpdate, obj, "list");
        },
        add(state) {  
          if(!this.checkRes){
              let obj=Object.assign({},this.dataInfo);
              obj.accessKeyId=Encrypt(this.dataInfo.accessKeyId,process.env.aesKey, process.env.ivKey);//加密     
              obj.accessKeySecret=Encrypt(this.dataInfo.accessKeySecret,process.env.aesKey, process.env.ivKey);//加密              
              this.saveDataInfo(state,this.$api.smsServerSave, obj, "list");
          }        
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