<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="标题" class="flex-50"  prop="msgTitle">
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

            <div class="form-footer">
                <el-button type="warning" @click="update()"
                    v-perms="'/message/add'"
                >回复</el-button>
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
    return {
      params: {//只需要业务参数
      },
      rules: {
        //校验规则
        msgTitle:[required],
      },
     groups:[]
    };
  },
     methods:{
        getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.messageReply, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((message)=>{
                this.dataInfo=message.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() {
             this.dataInfo['username']=this.dataInfo.msgReceiverUserName;
             this.updateDataInfo(this.$api.messageSend, this.dataInfo, "list");
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