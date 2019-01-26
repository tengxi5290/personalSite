<template>
  <section v-loading="loading" class="cms-body">
      <section class="tree-left">
            <!-- cms站点tree组件引用 -->
            <cmsSiteTree @node-click="nodeClik"></cmsSiteTree>
      </section>


      <!-- 上半部分 -->
      <section v-show="dateList" v-loading="loading" class="tree-right">
            <div class="cms-list-header">
                  <el-button type="primary" 
                  icon="el-icon-plus"
                  @click="routerLink('/site/add','save','0')"
                  v-perms="'/site/add'"          
                  >添加</el-button>
            </div> 


        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
              <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="domain" label="域名" align="center"></el-table-column>
              <el-table-column prop="name" label="站点名称" align="center"></el-table-column>
              
              <el-table-column label="操作"   align="center">
                    <div slot-scope="scope">
                          <cms-button type="edit" @click.native="edit(scope.row.id)" v-perms="'/site/edit'"  ></cms-button>
                    </div>
              </el-table-column>
        </el-table>

      </section>


      <!-- 这里做了个判断, show:editTable -->
      <section v-show="editTable" class="tree-right">

      <div class="cms-list-header">
            <el-button type="primary" 
            icon="el-icon-plus"
            @click="routerLink('/site/add','save','0',{pid:dataInfo.id})"
            v-perms="'/site/add'"          
            >添加</el-button>
      </div> 

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
                  <el-input v-model="dataInfo.rootPath" class="cms-width" disabled ></el-input>
                  <span class="gray">各站点资源的存放路径</span>
            </el-form-item>
            <el-form-item label="是否可用" class="flex-100"  prop="enable">
                  <el-radio v-model="dataInfo.enable" :label="true" v-if="userType != 'SP_ADMIN' && userType != 'MASTER_ADMIN'">是</el-radio>
                  <el-radio v-model="dataInfo.enable" :label="true" v-else readonly>是</el-radio>
                  <el-radio v-model="dataInfo.enable" :label="false" v-if="userType != 'SP_ADMIN' && userType != 'MASTER_ADMIN'">否</el-radio>
                  <el-radio v-model="dataInfo.enable" :label="false" v-else readonly>否</el-radio>
            </el-form-item>
            <el-form-item label="站点图标" class="flex-100"  prop="logo">
                  <uploader @change="getUrl" :default="dataInfo.logo" v-if="editTable && showImage"></uploader>
            </el-form-item>


            <div class="form-footer">
                  <el-button type="primary"  @click="update()"
                        v-perms="'/site/edit'"
                  >修改</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
                  <el-button type="warning" @click="back">返回</el-button>
            </div>

      </el-form>   
      </section>
</section>
</template>
<script>
import listMixin from '@/mixins/form';
import listMixins from '@/mixins/list';

import axios from "axios";
import {axiosProxy,checkErrorCode} from "@/api/tool"
import va from "@/rules";
export default {
mixins:[listMixins,listMixin],

  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      userType: null,
      showPicture: true,
      currentSite: null,
      showImage: true,
      //过滤参数
      params: {
            querySiteId:'',    //站点
            pageNo: "",        //当前页码
            pageSize: "",      //每页显示条数
            root:'',
      }, 
      ftpList:[],
      ossList:[],
      tplList:[],
      editTable:false,
      dateList:true,
      domainCheck:false,//域名验证
      accessPathCheck:false,//访问路径验证
      siteIdCheckRes:false,//站点验证
      rules: {
        //校验规则
      name: [required],
      shortName: [required],
      domain:[required],
      rootPath: [required],
      enable:[required],
      logo:[required],
      },
    };
  },
methods:{
      back() {
        setTimeout(() => {
          this.editTable = false
          this.dateList = true
        }, 1000);
      },
      reset () {
        this.dataInfo.name = ''
        this.dataInfo.shortName = ''
        this.dataInfo.domain = ''
        this.dataInfo.enable = true
        this.dataInfo.logo = ''
        this.showImage = false
        setTimeout(() => {
          this.showImage = true
        }, 100)
      },
      getUrl (imageUrl) {
        this.dataInfo.logo = imageUrl
      },
      // 获取文件路径
      getFieldImg(path, index) {
        this.dataInfo.logo = path
        this.showPicture = false
      },
      // 移除选好的文件
      remove (tip, index) {
        if(tip == 'remove') {
          delete this.dataInfo.logo
        }
      },
      deleteDefault (index) {
        this.showPicture = false
      },
      //效验是否存在主站
      siteIdCheck(value){
            if(!value){
                  this.siteIdCheckRes=false;
                  return false;
            }
            axios.post(this.$api.siteCheckMaster,{siteId:this.params.querySiteId,accessPath:this.dataInfo.accessPath}).then(res =>{
                  if(!res.body.result){
                        this.siteIdCheckRes=true;
                        this.loading = false;
                  }
            }).catch(error => {
                  this.loading = false;
            });
      },
      //效验域名是否重复
      checkDomain(value){
            if(value == ''){
                  this.domainCheck=false;
                  return false;
            }
            axios.post(this.$api.siteCheckDomain,{siteId:this.params.querySiteId,domain:value}).then(res =>{
                      this.loading = false;
                      if(res.body.result){
                           this.domainCheck=false;
                      }else{
                            this.domainCheck=true;
                      }
            }).catch(error => { 
                  this.loading = false;
            });
      },
      //效验访问路径是否重复
      checkAccessPath(value){
            if(value == ''){
                  this.accessPathCheck=false;
                  return false;
            }
            axios.post(this.$api.siteCheckAccessPath,{siteId:this.params.querySiteId,accessPath:value}).then(res =>{
                    if(res.body.result){
                            this.accessPathCheck=false;
                            this.loading = false;
                    }else{
                            this.accessPathCheck=true;
                            this.loading = false;
                    }
            }).catch(error => {
                  this.loading = false;
            });
      },
      update() {    
            if(!(this.domainCheck || this. accessPathCheck || this.siteIdCheckRes)){
                  var currentId = this.currentSite
                  axiosProxy.put(this.$api.site+'/'+currentId,{
                      name:this.dataInfo.name,
                      shortName:this.dataInfo.shortName,
                      rootPath:this.dataInfo.rootPath,
                      domin:this.dataInfo.domin,
                      enable:this.dataInfo.enable,
                      logo:this.dataInfo.logo
                    })
                    .then(res=>{
                      if(res.data.errorCode == '0') {
                        this.successMessage('操作成功')
                        this.editTable=false;
                        this.dateList=true;
                      } else {
                        if(res.data.errorMessage) {
                          this.errorMessage(res.data.errorMessage)
                        } else {
                          this.errorMessage('操作失败')
                        }
                      }
                    })
                    .catch(error=>{console.log(error)})
            }
      },
      //编辑
      edit(updateId){
        this.currentSite = updateId
            //到编辑页面,updateId就是相关站点的信息
            axiosProxy.get(this.$api.site+"/"+updateId)
                  .then(res=>{
                    if(res.data.errorCode == '0') {
                      this.editTable=true;
                      this.dateList=false;
                      this.dataInfo=res.data.data
                    } else {
                      if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                      } else {
                        this.errorMessage('请求失败')
                      }
                    }
                  })
                  .catch(error=>{
                        console.log(error)
                  })
      },
      //获取表格数据
      getTableData(params) {
            this.loading = true;
            this.tableData = params;
            this.loading = false;
      },
      //节点树节点触发触发函数
      nodeClik(data){
        this.currentSite = data.id
        this.params.querySiteId = data.id;
        if(data.hasChild || data.id == ''){
              if(data.id==''){
                    return;//点击根目录,保持不动就行
              }
              this.editTable=false;
              this.dateList=true;
        }else{
              let url=this.$api.site
              let id=data.id
              this.editTable=false
              axiosProxy.get(url+"/"+id)
                    .then(res=>{
                      if(res.data.errorCode == '0') {
                        this.dataInfo=res.data.data
                        this.editTable=true;
                        this.dateList=false;
                      } else {
                        if(res.data.errorMessage) {
                          this.errorMessage(res.data.errorMessage)
                        } else {
                          this.errorMessage('请求失败')
                        }
                      }
                    })
                    .catch(error=>{
                          console.log(error)
                    })
        }    
      },
      getUserInfo(){
            // 这里访问站点查询api,得到返回数据
        axiosProxy.get(this.$api.siteList)
          // 判断是否登录
          .then(res=>{
            if(res.data.errorCode == '0') {
              checkErrorCode(res)
              this.loading=false;

              axiosProxy.get(this.$api.siteList)
                // 如果登录,获取站点信息
              .then(res=>{
                if(res.data.errorCode == '0') {
                  var  siteInfo=res.data.data
                  this.getTableData(siteInfo)
                } else {
                  if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                  } else {
                    this.errorMessage('请求失败')
                  }
                }
              })
              .catch(error=>{
                  console.log(error)
              })
            } else {
              if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
              } else {
                this.errorMessage('请求失败')
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
      this.getUserInfo();//获取初始数据
      this.userType = window.localStorage.getItem('userType')
      this.$store.dispatch("setCollapse", true); //收缩状态栏
},
mounted (){
  let clientHeight = document.body.clientHeight;
      $(".cms-body").css("minHeight", clientHeight - 110 + "px"); 
}
};
</script>
<style>
  .tree-left{
    width: 200px;
    float: left;
  }
  .tree-right{
    margin-left: 200px;
  }
  .font-bold{
    font-weight: bold;
  }
  .iconfont{
    color: #409EFF;
  }
  .red-color{
    color: red;
  }
  /*显示当前的默认图片*/
  .display-picture {
    position: relative;
    overflow: hidden;
    z-index: 0;
    width: 100%;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px 10px 10px 90px;
    height: 92px;
}
.display-thumb {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    background-color: pink;
    float: left;
    position: relative;
    z-index: 1;
    margin-left: -80px;
}
.display-filename {
    line-height: 70px;
    margin-top: 0;
}
.delete-default {
  position: absolute;
  top: 0;
  right: 10px;
  cursor: hand;
  cursor: pointer;
}
</style> 
