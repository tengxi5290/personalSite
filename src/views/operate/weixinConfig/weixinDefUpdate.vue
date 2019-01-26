<template>
    <section class="cms-body" v-loading="loading">
         
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="消息类型:" class="flex-100"  prop="type">
               <el-select v-model='dataInfo.type' @change="cont">
                    <el-option label="带图文链接消息" :value="0">带图文链接消息</el-option>
                    <el-option label="内容加关键字提示消息" :value="1">内容加关键字提示消息</el-option>
                    <el-option label="仅有内容消息" :value="2">仅有内容消息</el-option>
               </el-select>             
            </el-form-item> 
             <el-form-item  label="标题:"  class="flex-100"  prop="title">
                      <el-input  v-model="dataInfo.title" class="cms-width"></el-input>
             </el-form-item>  
            <span v-show="hid">         
                <el-form-item label="链接地址:"  class="flex-100"  prop="url">
                <el-input v-model="dataInfo.url" class="cms-width"></el-input>
                </el-form-item>  
                <el-form-item label="微信二维码" class="flex-100">            
                        <cms-upload :src='dataInfo.path' :isMark='false' @change='getPath'></cms-upload>
                        <span class="gray">留空则使用文字水印</span> 
                 </el-form-item> 
            </span>
            <el-form-item label="内容" class="flex-100"  prop="content">
               <el-input
                    type="textarea"
                    :rows="2"  class="cms-width"
                    placeholder="请输入内容"
                    v-model="dataInfo.content">
                </el-input>
            </el-form-item>
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/weixinMessageDef'"
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
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('该项必填');
    return {
      hid:'',
      params: {//只需要业务参数
       
      },
      rules: {
        //校验规则
         title:[required],

      },
      
    };
  },
     methods:{
        cont(value){
            if(value===0){
                 this.hid=true; 
            }else{
               this.hid=false;     
            }
        },
        getPath(value){
           this.dataInfo.path=value;  
        },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.weixinMessageDefaultGet), //axios批量发送请求
        ])
        .then(
            axios.spread((group)=>{
                this.dataInfo=group.body;
                 this.dataInfo.welcome=true;  
                this.dataInfo.type===0?this.hid=true:this.hid=false;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
             this.updateDataInfo(this.$api.weixinMessageUpdate, this.dataInfo, "");
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