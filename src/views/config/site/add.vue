<template>
      <section class="cms-body" v-loading="loading">
            <!-- 返回组件 -->
            <cms-back></cms-back> 

            <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
                  <el-form-item label="名称" class="flex-50"  prop="name">
                        <el-input v-model="dataInfo.name" class="cms-width"></el-input>
                  </el-form-item> 

                  <el-form-item label="站点简称" class="flex-50"  prop="shortName">
                        <el-input v-model="dataInfo.shortName" class="cms-width"></el-input>
                  </el-form-item> 
                  
                  
                  <el-form-item label="域名" class="flex-50"  prop="domain">
                        <el-input v-model="dataInfo.domain" class="cms-width" ></el-input>
                        <span class="red" v-show="domainCheck">域名已存在，无法使用</span>
                  </el-form-item>

                  <el-form-item label="是否可用" class="flex-50"  prop="enable">
                        <el-radio v-model="dataInfo.enable" :label="true">是</el-radio>
                        <el-radio v-model="dataInfo.enable" :label="false">否</el-radio>
                  </el-form-item>

                  <el-form-item label="根目录" class="flex-50"  prop="rootPath">
                        <el-input v-model="dataInfo.rootPath" class="cms-width"></el-input>
                  </el-form-item>

                  <el-form-item label="appId" class="flex-50"  prop="appId">
                        <el-input  v-model="dataInfo.appId" class="cms-width"></el-input>
                  </el-form-item>

                  <el-form-item label="appKey" class="flex-50"  prop="appKey">
                        <el-input  v-model="dataInfo.appKey" class="cms-width"></el-input>
                  </el-form-item>

                  <el-form-item label="用户秘钥" class="flex-50"  prop="appSecret">
                        <el-input  v-model="dataInfo.appSecret" class="cms-width"></el-input>
                  </el-form-item>

                  <el-form-item label="站点图标" class="flex-50"  prop="logo">
                        <uploader @change="getUrl"></uploader>
                  </el-form-item>


                  <div class="form-footer">
                        <el-button type="primary"  @click="save()"
                              v-perms="'/site/add'"
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
import {axiosProxy,checkErrorCode} from "@/api/tool"

export default {
    mixins:[listMixins],
  data() {
      let self = this;
      let required = va.required('此项必填');
      let number = va.number('只能输入数字');
    return {
      fileList: [],
      cookie: true,
      limit: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      root: this.$route.query.pid,//父站点ID
      params: {//只需要业务参数
            queryUsername: "",
            https:"",
      },
      domainCheck:false,
      accessPathCheck:false,
      rules: {
            //校验规则
            name: [required],
            domain:[required],
            enable: [required],
            rootPath:[required],
            logo:[required],
            appId:[required],
            appKey:[required],
            spid:[required],
            shortName:[required],
            appSecret:[required]            
      },
      ftpList:[],
      ossList:[],
      tplList:[],
      editTable:false,
      dateList:true,
      domainCheck:false,//域名验证
      accessPathCheck:false,//访问路径验证
      siteIdCheckRes:false,//站点验证
    };
  },
     methods:{
      getUrl (imageUrl) {
            this.dataInfo.logo = imageUrl
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 获取文件路径
      getFieldImg(path, index) {
            this.dataInfo.logo = path
      },
      // 移除选好的文件
      remove (tip, index) {
            if(tip == 'remove') {
              delete this.dataInfo.logo
            }
      },
      getUserInfo(){
             axiosProxy.get(this.$api.user)
                  .then(res=>{
                        if(res.data.errorCode == '0') {
                              checkErrorCode(res)
                              this.loading=false;
                        } else {
                              if(res.data.errorMessage) {
                                    this.errorMessage(res.data.errorMessage)
                              } else {
                                    this.errorMessage('请求失败')
                              }
                        }
                  })
      },
      save(){    
            axiosProxy.post(this.$api.site,{
                  name:this.dataInfo.name,
                  shortName:this.dataInfo.shortName,
                  domain:this.dataInfo.domain,
                  enable:this.dataInfo.enable,
                  rootPath:this.dataInfo.rootPath,
                  appId:this.dataInfo.appId,
                  appKey:this.dataInfo.appKey,
                  spid:this.dataInfo.spid,
                  logo:this.dataInfo.logo,
                  appSecret:this.dataInfo.appSecret
            })
                  .then(res=>{
                        if(res.data.errorCode == '0') {
                              this.successMessage('操作成功')
                              this.routerLink('/site/list')
                        } else {
                            if(res.data.errorMessage) {
                              this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('操作失败')
                            }
                        }
                  })
                  .catch(error=>{
                        console.log(error)
                  })
      }      
},
      created(){
            this.loading=true;
            this.getUserInfo();//判断是否登录了或者登录超时
            this.$store.dispatch("setCollapse", true); //收缩状态栏
      }
};
</script>

<style>

</style>
