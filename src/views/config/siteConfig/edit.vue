<template>
      <section class="cms-body" v-loading="loading">
      <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="名称" class="flex-50"  prop="name">
                  <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="站点简称" class="flex-50"  prop="shortName">
                  <el-input v-model="dataInfo.shortName" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="域名" class="flex-50"  prop="domain">
                  <el-input v-model="dataInfo.domain" @change="checkDomain" class="cms-width" ></el-input>
                  <span class="red" v-show="domainCheck">域名已存在，无法使用</span>
            </el-form-item>
            <el-form-item label="根目录" class="flex-50"  prop="rootPath">
                  <el-input v-model="dataInfo.rootPath" class="cms-width" ></el-input>
                  <span class="gray">各站点资源的存放路径</span>
            </el-form-item>
            <el-form-item label="是否可用" class="flex-100"  prop="enable">
                  <el-radio v-model="dataInfo.enable" :label="true">是</el-radio>
                  <el-radio v-model="dataInfo.enable" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="站点图标" class="flex-100"  prop="logo">
                  <el-input  v-model="dataInfo.logo" class="cms-width"></el-input>
                  <img :src="dataInfo.logo">
                  <!-- 这里传过来的图片是 -->
            </el-form-item>


            <div class="form-footer">
                  <el-button type="primary"  @click="save()"
                        v-perms="'/siteConfig/edit'"
                  >提交</el-button>
                  <el-button type="info" @click="$reset">重置</el-button>
            </div>
      </el-form>       
      </section>    
</template>
<script>
import listMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
import {axiosProxy,checkErrorCode} from "@/api/tool"

export default {
  mixins: [listMixins],
  data() {
    let self = this;
    let required = va.required("此项必填");
    let number = va.number("只能输入数字");
    return {
      params: {
            //只需要业务参数
            queryUsername: "",
            https: ""
      },
      domainCheck: false,
      accessPathCheck: false,
      rules: {
            //校验规则
            name: [required],
            domain:[required],
            rootPath: [required],
            enable:[required],
            logo:[required],
      },
      ftpList: [],
      ossList: [],
      tplList: [],
      editTable: false,
      dateList: true,
      domainCheck: false, //域名验证
      accessPathCheck: false, //访问路径验证
      siteIdCheckRes: false //站点验证
    };
  },
  methods: {
    siteIdCheck(value) {
      if (!value) {
        this.siteIdCheckRes = false;
        return false;
      }
      axios
        .post(this.$api.siteCheckMaster, { siteId: "" })
        .then(res => {
          if (!res.body.result) {
            this.siteIdCheckRes = true;
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    checkDomain(value) {
      if (value == "") {
            this.domainCheck = false;
            return false;
      }
      axios
        .post(this.$api.siteCheckDomain, { siteId: "", domain: value })
        .then(res => {
          if (res.body.result) {
            this.domainCheck = false;
            this.loading = false;
          } else {
            this.domainCheck = true;
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    checkAccessPath(value) {
      if (value == "") {
        this.accessPathCheck = false;
        return false;
      }
      axios
        .post(this.$api.siteCheckAccessPath, { siteId: "", accessPath: value })
        .then(res => {
          if (res.body.result) {
            this.accessPathCheck = false;
            this.loading = false;
          } else {
            this.accessPathCheck = true;
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
        });
    },
    getUserInfo(){
      // let api = this.$api; //API地址
      // axios
      //   .all([
      //     axios.post(api.configGet), //请求全局配置信息
      //     axios.post(api.siteConfigGet),
      //     axios.post(api.ftpList), //请求ftp信息
      //     axios.post(api.ossList), //请求oss信息
      //     axios.post(api.tplList) //请求模板信息
      //   ])
      //   .then(
      //     axios.spread((config, site, ftps, ossList, tplList) => {
      //       if (config.body.insideSite) {
      //             this.rules["accessPath"] = [va.required("此项必填")];
      //       }
      //       this.dataInfo = site.body;
      //       this.ftpList = ftps.body;
      //       this.ossList = ossList.body;
      //       this.tplList = tplList.body;
      //       this.$refs["form"].resetFields();
      //       this.loading = false;
      //     })
      //   )
      //   .catch(err => {
      //     this.loading = false;
      //   });
    },
    save() {
      //提交重置信息
      //var dataInfo=this.dataInfo
      var currentId=localStorage.getItem('_site_id_param');//得到当前的站点id
      if (!(this.domainCheck || this.accessPathCheck || this.siteIdCheckRes)) {
        axiosProxy.put(this.$api.site+'/'+currentId,{
          name:this.dataInfo.name,
          shortName:this.dataInfo.shortName,
          rootPath:this.dataInfo.rootPath,
          domin:this.dataInfo.domin,
          enable:this.dataInfo.enable,
          logo:this.dataInfo.logo
        })
          .then(res=>{console.log(res)})
          .catch(error=>{console.log(error)})

      location.reload()//刷新页面
      }
    },
    checkSiteId(){
      // 确定右上角id,来进行页面内容的渲染

      var currentId=localStorage.getItem('_site_id_param');//得到当前的站点id

      axiosProxy.get(this.$api.user)
            .then(res=>{
              //判断是否登录,若未登录,进行跳转,登录再进行进一步操作
              checkErrorCode(res)
              this.loading=false;

              //根据currentId,来获取特定站点的信息并渲染
              axiosProxy.get(this.$api.site+'/'+currentId)
                .then(res=>{
                  this.dataInfo=res.data.data
                })
                .catch(error=>{
                  console.log(error)
                })

            })
            .catch(error=>{
              console.log(error)
            })


      
    }
  },
  created() {
    this.loading = true;//将加载页面取消掉
    this.checkSiteId();//判断当前右上角当前站点的id,将其内容渲染到页面中
    //this.getUserInfo();//判断是否登录等,获取用户信息,渲染
  }
};
</script>

<style>
</style>
