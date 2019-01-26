<template>
    <section class="cms-body" v-loading="loading">
         
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="微信公众号APPID" class="flex-50"  prop="weixinAppId">
               <el-input v-model="dataInfo.weixinAppId" class="cms-width"></el-input>
            </el-form-item>     
            <el-form-item label="微信公众号Secret" class="flex-50"  prop="weixinSecret">
               <el-input v-model="dataInfo.weixinSecret" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item>     
            <el-form-item label="微信支付商户号" class="flex-50"  prop="weixinAccount">
               <el-input v-model="dataInfo.weixinAccount" class="cms-width"></el-input>
            </el-form-item>     
            <el-form-item label="微信支付商户密钥" class="flex-50"  prop="weixinPassword">
               <el-input v-model="dataInfo.weixinPassword" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item>     
            <el-form-item label="微信企业转账API密钥" class="flex-50"  prop="transferApiPassword">
               <el-input v-model="dataInfo.transferApiPassword" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item> 
            <el-form-item label="转账登陆密码" class="flex-50"  prop="payTransferPassword">
               <el-input v-model="dataInfo.payTransferPassword" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item> 
             <el-form-item label="打赏默认配置" class="flex-100"  prop="rewardPattern">
                <el-radio v-model="dataInfo.rewardPattern" :label="false">随机</el-radio>
                <el-radio v-model="dataInfo.rewardPattern" :label="true">固定</el-radio>
            </el-form-item> 
            <el-form-item label="固定" class="flex-100"  prop="fixed"> 
                    <cms-button @click.native="add" type="edit"></cms-button></br>
            </el-form-item> 
                    
            <span v-for="(item,index) in dataInfo.fixMap" :key="index">
                    <el-form-item  class="flex-50"> 
                        <el-input type="number" v-model="item.value" class="cms-width cms-input"></el-input>
                        <cms-button  @click.native="del(index)" type="delete"></cms-button>
                    </el-form-item>                        
            </span> 
            </br>
            <el-form-item label="打赏随机最小数" class="flex-100"  prop="rewardMin">
               <el-input v-model="dataInfo.rewardMin" class="cms-width" type='number'></el-input>
            </el-form-item> 
             <el-form-item label="打赏随机最大数" class="flex-50"  prop="rewardMax">
               <el-input v-model="dataInfo.rewardMax" class="cms-width" type='number'></el-input>
            </el-form-item> 
            <el-form-item label="合作者ID" class="flex-50"  prop="alipayPartnerId">
               <el-input v-model="dataInfo.alipayPartnerId" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item label="支付宝签约账户" class="flex-50"  prop="alipayAccount">
               <el-input v-model="dataInfo.alipayAccount" class="cms-width"></el-input>
            </el-form-item> 
           <el-form-item label="支付宝安全校验码" class="flex-50"  prop="alipayKey">
               <el-input v-model="dataInfo.alipayKey" class="cms-width" type="password"></el-input>
               <span class="gray">不修改请留空</span>
            </el-form-item> 
             <el-form-item label="支付宝应用ID" class="flex-50"  prop="alipayAppId">
               <el-input v-model="dataInfo.alipayAppId" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item label="支付宝公钥" class="flex-100"  prop="alipayPublicKey">
                <el-input
                    type="textarea"
                    :rows="2"
                    v-model="dataInfo.alipayPublicKey" >
                </el-input>
               <span class="gray">不修改请留空</span>              
            </el-form-item>
             <el-form-item label="支付宝私钥" class="flex-100"  prop="alipayPrivateKey">
                <el-input
                    type="textarea"
                    :rows="2"         
                    v-model="dataInfo.alipayPrivateKey">
                </el-input>
               <span class="gray">工具生成的支付宝私钥复制需要注意把行串起，去除行之间空字符，不修改请留空</span>              
            </el-form-item>
             <el-form-item label="平台抽成比例" class="flex-50"  prop="chargeRatio">
               <el-input v-model="dataInfo.chargeRatio" class="cms-width"></el-input>
               <span class="gray">0.1表示10个点 平台抽取用户支付10%</span>
            </el-form-item> 
             <el-form-item label="提现最小额度" class="flex-50"  prop="minDrawAmount">
               <el-input v-model="dataInfo.minDrawAmount" class="cms-width"></el-input>
            </el-form-item> 
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/contentUpdate'"
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
    let required = va.required('该项必填');
    let number = va.number();
    let double = va.double();

    return {
      params: {//只需要业务参数
      
      },
      rules: {
        //校验规则
        minDrawAmount:[number],
        rewardMin:[double],
        rewardMax:[double],
        chargeRatio:[double],
     
      },
      map:[],
    };
  },
     methods:{
         add(){
             let obj={
                 key:'',
                 value:''
             }
           this.map.push(obj);
         },
         del(index){
              this.map.splice(index,1)
         },
        getDataInfo(){
        let api = this.$api; //API地址
            axios
            .all([
                axios.post(api.configContentChargeGet), //axios批量发送请求
            ])
            .then(
                axios.spread((content)=>{
                    this.dataInfo=content.body;
                    this.dataInfo.alipayPublicKey='';
                    this.dataInfo.alipayPrivateKey='';
                    this.dataInfo.alipayKey='';
                    this.dataInfo.weixinSecret='';
                     this.dataInfo.weixinPassword='';
                     this.dataInfo.transferApiPassword=''; 
                     this.dataInfo.payTransferPassword='';
                    this.map=content.body.fixMap;
                    this.$refs["form"].resetFields();
                    this.loading = false;
                })                                
            )
            .catch(err => {
            this.loading = false;
            });
        },
         update() {         
             for(let i in this.dataInfo.fixMap){
                let va='attr_reward_fix_'+this.dataInfo.fixMap[i].value;
                 this.dataInfo[va]=this.dataInfo.fixMap[i].value;
                 console.log(this.dataInfo)
             };       
            for(let i in this.dataInfo){
                if((typeof this.dataInfo[i])=='object'){
                    delete this.dataInfo[i]
                }
             }      
             this.updateDataInfo(this.$api.configContentChargeUpdate, this.dataInfo, "");
          
        },
         updateDataInfo(url, params, backUrl) {
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                    axios.post(url, params)
                        .then(res => {
                            this.loading = false;
                            if (res.code == "200") {
                                this.successMessage('修改成功');
                                 this.getDataInfo(this.id);
                                if(backUrl==''){
                                    return false;
                                }else{
                                    setTimeout(() => {
                                        this.routerLink(backUrl);
                                    }, 1000);
                                }
                                
                            }
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
        },
        
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>