<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
         
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="部署路径" class="flex-50"  prop="contextPath">
               <el-input v-model="dataInfo.contextPath" class="cms-width"></el-input>
               <span class="gray">部署在根目录请留空</span>
            </el-form-item>       
            <el-form-item label="FTP端口号" class="flex-50"  prop="port">
               <el-input v-model="dataInfo.port" class="cms-width" type='number'></el-input>
               <span class="gray">默认留空</span>
            </el-form-item>  
             <el-form-item label="默认图片" class="flex-50"  prop="defImg">
               <el-input v-model="dataInfo.defImg" class="cms-width"></el-input>
               <span class="gray">图片不存在时显示</span>
            </el-form-item>
           <el-form-item label="注册、找回密码验证方式" class="flex-50"  prop="validateType">
               <el-select v-model="dataInfo.validateType">
                    <el-option :value="0" label="无"></el-option> 
                    <el-option :value="1" label="邮箱验证"></el-option>
                    <el-option :value="2" label="短信验证"></el-option> 
               </el-select>
            </el-form-item>
            
            <el-form-item v-if="dataInfo.validateType == 2" label="可选择短信运营商" class="flex-50"  prop="smsID">
               <el-select v-model='dataInfo.smsID'>
                   <el-option v-for="(item,index) in params.list" :key="index" :value="item.id" :label="item.name"></el-option>
               </el-select>
               <span class="gray">若无请前往短信服务中配置</span>
            </el-form-item>

            <el-form-item v-if="dataInfo.validateType == 2" label="每日验证次数限制" class="flex-50"  prop="dayCount">
               <el-input v-model="dataInfo.dayCount" class="cms-width"  maxlength="6"></el-input>
               <span class="gray">0则不限制</span>              
            </el-form-item> 
            <el-form-item label="数据库附件" class="flex-50"  prop="uploadToDb">
                <el-radio v-model="dataInfo.uploadToDb" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.uploadToDb" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="附件地址" class="flex-50"  prop="dbFileUri">
               <el-input v-model="dataInfo.dbFileUri" class="cms-width"></el-input>
               <span class="gray">一般无需改动</span>
            </el-form-item>
            <el-form-item label="只终审浏览内容页" class="flex-50"  prop="viewOnlyChecked">
                <el-radio v-model="dataInfo.viewOnlyChecked" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.viewOnlyChecked" :label="false">否</el-radio>
            </el-form-item>
          
         
           


            <el-form-item label="评论是否开启" class="flex-50"  prop="commentOpen">
                <el-radio v-model="dataInfo.commentOpen"  :label="true">是</el-radio>
                <el-radio v-model="dataInfo.commentOpen" :label="false">否</el-radio>
               
            </el-form-item>
            <el-form-item label="留言是否开启" class="flex-50"  prop="guestbookOpen">
                <el-radio v-model="dataInfo.guestbookOpen" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.guestbookOpen" :label="false">否</el-radio>
              
            </el-form-item>
             <el-form-item label="留言是否登录" class="flex-50"  prop="guestneedNeedLogin">
                <el-radio v-model="dataInfo.guestbookNeedLogin" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.guestbookNeedLogin" :label="false">否</el-radio>
          
            </el-form-item>
             <el-form-item label="用户发表留言日最高限制数" class="flex-50"  prop="guestbookDayLimit">
               <el-input v-model="dataInfo.guestbookDayLimit" class="cms-width" type='number'></el-input>
               <span class="gray">0则无限制</span>
            </el-form-item>
            <el-form-item label="用户发表评论日最高 限制数" class="flex-50"  prop="commentDayLimit">
               <el-input v-model="dataInfo.commentDayLimit" class="cms-width" type='number'></el-input>
               <span class="gray">0则无限制</span>
            </el-form-item>
            <el-form-item  class="flex-50" >
            </el-form-item>
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/systemUpdate'"
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
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:"",
        list:[],
      },
      rules: {
        //校验规则
        smsID:[required],
        defImg:[required],
        validateType:[required],
        smsID:[required],
        dayCount:[number],
        uploadToDb:[required],
        dbFileUri:[required],
        viewOnlyChecked:[required],
        insideSite:[required],
        officeHome:[required],
        officePort:[required],
        guestbookDayLimit:[required,number],
        commentDayLimit:[required,number],
      },
      
    };
  },
     methods:{
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configGet), //axios批量发送请求
        ])
        .then(
            axios.spread((group)=>{
                this.dataInfo=group.body;
                this.params.list =this.dataInfo.jsonArray;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {
             let obj=Object.assign({},this.dataInfo)
             obj.jsonArray='';     
             this.updateDataInfo(this.$api.configSystemUpdate, obj, "");
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