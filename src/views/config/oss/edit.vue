<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px"> 
            <el-form-item label="存储类型" class="flex-50"  prop="ossType">
                   <el-select v-model="dataInfo.ossType" @change='cha' class="cms-width">
                         <el-option label="腾讯云" :value="1">腾讯云</el-option>
                          <el-option label="阿里云" :value="2">阿里云</el-option>
                          <el-option label="七牛云" :value="3">七牛云</el-option>               
                   </el-select>
            </el-form-item>  
                   <el-form-item class="flex-50"></el-form-item>
            <el-form-item label="Bucket名" class="flex-50"  prop="bucketName">
                   <el-input v-model="dataInfo.bucketName" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item v-show="ossAppIdSta" label="AppId" class="flex-50"  prop="ossAppId">
                   <el-input v-model="dataInfo.ossAppId" class="cms-width"></el-input>
            </el-form-item>  
            <el-form-item label="appKey" class="flex-50"  prop="appKey">
                   <el-input v-model="dataInfo.appKey" class="cms-width" type="password"></el-input>
                   <span class="gray">留空不修改</span>
            </el-form-item> 
            <el-form-item label="secretId" class="flex-50"  prop="secretId">
                   <el-input v-model="dataInfo.secretId" class="cms-width" type="password"></el-input>
                   <span class="gray">留空不修改</span>
            </el-form-item> 
            <el-form-item v-show="bucketAreaSta" label="地区码" class="flex-50"  prop="bucketArea">
                    <el-input v-model="dataInfo.bucketArea" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item v-show="accessDomainSta" label="访问域名" class="flex-50"  prop="accessDomain">
                  <el-input v-model="dataInfo.accessDomain" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item label="备注名字" class="flex-50"  prop="name">
                  <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item v-show="endPointStatus" label="阿里云endPoint" class="flex-50"  prop="endPoint">
                  <el-input v-model="dataInfo.endPoint" class="cms-width"></el-input>
            </el-form-item>       
            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/oss/save'"
                >添加并继续保存</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/oss/save'"
                >添加</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/oss/edit'"
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
    let number = va.number();
    let numAndStr=va.NumAndStr('必须是数字或者小写字母');
    return {
      params: {//只需要业务参数
     

      },
      endPointStatus:'',
      ossAppIdSta:'',
      bucketAreaSta:'',
      accessDomainSta:'',
      rules: {
        //校验规则
          secretId:'',
          appKey:'',
          bucketName:[required,numAndStr],
          ossType:[required],
          name:[required],
         
      },
      
    };
  },
     methods:{  
       cha(value){
          let sta=value===2?true:false;
          this.endPointStatus=sta;
          let sta2=value!=3?true:false;
          this.ossAppIdSta=sta2;
          let sta3=value===1?true:false;
          this.bucketAreaSta=sta3;
          let sta4=value!=1?true:false;
          this.accessDomainSta=sta4;
       },    
      getDataInfo(id){
            this.loading = true;
            axios.post(this.$api.ossGet,{id:id}).then(res=>{
                  this.loading = false;
                  if(res.code == '200'){
                            this.dataInfo = res.body;
                            this.dataInfo.secretId = '';
                            this.dataInfo.appKey = '';
                            if(id == 0 ){
                                  this.rules.secretId  = [va.required()];
                                  this.rules.appKey = [va.required()];
                            }
                  }
            }).catch(error=>{
                this.loading = false;
            })
      },
        update() {     
            if(this.dataInfo.appKey != ''){
                  this.dataInfo.appKey = Encrypt(this.dataInfo.appKey,process.env.aesKey, process.env.ivKey);//加密 
            }
            if(this.dataInfo.secretId != ''){
                  this.dataInfo.secretId = Encrypt(this.dataInfo.secretId,process.env.aesKey, process.env.ivKey);//加密   
            }
            this.updateDataInfo(this.$api.ossUpdate, this.dataInfo, "list");
        },
        add(state) {  
            if(this.dataInfo.appKey != ''){
                  this.dataInfo.appKey = Encrypt(this.dataInfo.appKey,process.env.aesKey, process.env.ivKey);//加密 
            }
             if(this.dataInfo.secretId != ''){
                  this.dataInfo.secretId = Encrypt(this.dataInfo.secretId,process.env.aesKey, process.env.ivKey);//加密   
            }
             this.saveDataInfo(state,this.$api.ossSave, this.dataInfo, "list");
        }
  },
  created(){
    //初始获取数据
    let sta=this.dataInfo.type===2?true:false;
    this.endPointStatus=sta;
    let sta2=this.dataInfo.type!=3?true:false;
    this.ossAppIdSta=sta2;
    let sta3=this.dataInfo.type===1?true:false;
    this.bucketAreaSta=sta3;
    let sta4=this.dataInfo.typ!=1?true:false;
    this.accessDomainSta=sta4;

    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>