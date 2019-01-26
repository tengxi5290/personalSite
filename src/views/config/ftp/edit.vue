<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="名称" class="flex-50"  prop="name">
                   <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item label="服务器IP" class="flex-50"  prop="ip">
                   <el-input v-model="dataInfo.ip" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="FTP端口号" class="flex-50"  prop="port">
                   <el-input v-model="dataInfo.port" class="cms-width"></el-input>
                   <span class="gray">默认端口21</span>
            </el-form-item> 
            <el-form-item label="传输超时时间" class="flex-50"  prop="timeout">
                   <el-input v-model="dataInfo.timeout" class="cms-width"></el-input>
                   <span class="gray">单位：秒，0为服务器默认</span>
            </el-form-item> 
            <el-form-item label="FTP用户名" class="flex-50"  prop="username">
                  <el-input v-model="dataInfo.username" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item  label="FTP密码" class="flex-50"  prop="password">
                  <el-input v-model="dataInfo.password" class="cms-width"  autocoplate  type="password"></el-input>
                  <span class="gray">留空不修改</span>
            </el-form-item> 
            <el-form-item label="远程目录" class="flex-50"  prop="path">
                  <el-input v-model="dataInfo.path" class="cms-width"></el-input>
                  <span class="gray">留空为根目录</span>
            </el-form-item> 
            <el-form-item label="编码" class="flex-50"  prop="encoding">
                  <el-input v-model="dataInfo.encoding" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item label="地址" class="flex-100"  prop="url">
                  <el-input v-model="dataInfo.url" class="cms-width"></el-input>
                  <span class="gray">访问该FTP的Url地址</span>
            </el-form-item>     

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/ftp/add'"
                >提交并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/ftp/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/ftp/edit'"
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
import { Encrypt } from "@/untils/aes";
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

      },
      rules: {
        //校验规则
        ip:[required],
        name: [required],
        port: [required,number],
        encoding: [required],
        timeout: [required,number],
        username: [required],
        url: [required],
      },
      
    };
  },
     methods:{       
      getDataInfo(id){
        this.loading = true;
        axios.post(this.$api.ftpGet,{id:id}).then(res=>{
            this.loading = false;
            if(res.code == '200'){
                    this.dataInfo = res.body;
                    this.dataInfo.password = '';
                    if(id == 0 ){
                        this.rules.password  = [va.required()];
                    }
                    console.log(this.rules);
            }
        }).catch(error=>{
            this.loading = false;
        })
      },
        update() {   
          if(this.dataInfo.password != ''){
                  this.dataInfo.password = Encrypt(this.dataInfo.password,process.env.aesKey, process.env.ivKey);//加密  
            }
            this.updateDataInfo(this.$api.ftpUpdate, this.dataInfo, "list");
        },
        add(state) {     
           if(this.dataInfo.password != ''){
                  this.dataInfo.password = Encrypt(this.dataInfo.password,process.env.aesKey, process.env.ivKey);//加密  
            }
             this.saveDataInfo(state,this.$api.ftpSave, this.dataInfo, "list");
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