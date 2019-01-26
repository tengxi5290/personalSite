<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="收件人" class="flex-50"  prop="username">
               <el-input v-model="dataInfo.username" class="cms-width" type='required'></el-input>
            </el-form-item>       
             <el-form-item label="会员组管理" class="flex-50"  prop="name">
                <el-select v-model="dataInfo.groupId">
                    <el-option label="所有会员组" value=""></el-option>
                    <el-option v-for="(item,index) in groups" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <label class="cms-label">请填写收件人或者选择会员组（两者必选其一，选择会员组批量发送站内信）</label> 
            </el-form-item>    
            <el-form-item label="标题" class="flex-100"  prop="msgTitle">
               <el-input v-model="dataInfo.msgTitle" class="cms-width" type='required'></el-input>
            </el-form-item> 
            <el-form-item label="内容" class="flex-100"  prop="msgContent">
                <el-input
                    type="textarea"
                    :rows="15"
                    placeholder="请输入内容"
                    v-model="dataInfo.msgContent">
                </el-input>
            </el-form-item> 
             <el-input v-show="false" v-model="dataInfo.msgReceiverUserName" class="cms-width"></el-input>
             <el-input v-show="false" v-model="dataInfo.msgSendUserUserName" class="cms-width"></el-input>    

            <div class="form-footer">
                <el-button type="primary"  @click="add(false)"
                    v-perms="'/message/add'"
                >发送</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
import api from "@/api/api";
export default {
    mixins:[listMixins],
  data() {
    
    let self = this;
     function checkName() {//用户名验证
    return {
        validator: (rule, value, callback) => {
            axios.post(api.memberCheckName,{username:value}).then(res=>{
                if(res.code=='200'){
                    if (res.body.result){
                        callback(new Error('用户名不存在'))
                    }else{
                        callback();      
                    } 
                }else{
                    callback(new Error('服务器响应异常'));  
                }      
            })
        }, trigger: 'blur'
      }
   }
    let required = va.required('此项必填');
    return {
      params: {//只需要业务参数
      
      },
      rules: {
        //校验规则
        msgTitle: [required],
        username: [checkName()],
      },
     groups:[]
    };
  },
     methods:{
         getRoleIds(value){
               console.log(value);
               
         },
        getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.messageForward, {id:id}), //axios批量发送请求
             axios.post(api.groupList)
        ])
        .then(
            axios.spread((message,groups)=>{
                this.dataInfo=message.body;
                this.groups=groups.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        add(state) {
              this.dataInfo['username']=this.dataInfo.msgReceiverUserName;
            this.saveDataInfo(state,api.messageSend, this.dataInfo, "list");            
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