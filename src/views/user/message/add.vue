<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="收件人" class="flex-50"  prop="username">
               <el-input v-model="dataInfo.username" class="cms-width"></el-input>
            </el-form-item>       
             <el-form-item label="会员组管理" class="flex-50"  prop="groupId">
                <el-select v-model="dataInfo.groupId">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="(item,index) in groups" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <span class="gray">请填写收件人或者选择会员组（两者必选其一，选择会员组批量发送站内信）</span> 
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



            <div class="form-footer">
                <el-button type="warning" @click="add(true)"
                    v-perms="'/message/add'"
                >发送并继续添加</el-button>
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
import api from "@/api/api";
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    
    let self = this;
    let required = va.required('此项必填');
    var  checkName=(rule, value, callback) =>{
           
            if(value==''){
                if(this.dataInfo.groupId==''){
                     callback(new Error('用户名和用户组,必填一项'))
                }else{
                    callback()
                }
            }else{
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
            }

    }
        // validator: (rule, value, callback) => { console.log(value!==)}
            
        //         if(value!=''){
        //                  axios.post(api.memberCheckName,{username:value}).then(res=>{
        //         if(value==''){
        //              callback();    
        //         }else{
        //             if(res.code=='200'){
        //             if (res.body.result){
        //                 callback(new Error('用户名不存在'))
        //             }else{
        //                 callback();      
        //             } 
        //         }else{
        //             callback(new Error('服务器响应异常'));  
        //         }
        //         }
                      
        //     })
        //  }   
       
    return {
      params: {//只需要业务参数
      
      },
      dataInfo:{
          username:'',
          groupId:'',
          msgContent:'',
          msgTitle:''
      },
      rules: {
        //校验规则
        msgTitle: [required],
        username: [ { validator: checkName, trigger: 'blur' }],
      },
     groups:[]
    };
  },
     methods:{
        
         getRoleIds(value){
               
               
         },
        getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.messageGet, {id:id}), //axios批量发送请求
             axios.post(api.groupList)
        ])
        .then(
            axios.spread((message,groups)=>{
                this.dataInfo=Object.assign(this.dataInfo,message.body);
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
         
            if(state!=null){
                this.saveDataInfo(state,this.$api.messageSend, this.dataInfo, "list");
            }else{
                this.saveDataInfo(false,this.$api.messageSave, this.dataInfo, "list");    
            }        
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