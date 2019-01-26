<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item v-if="id != 0" label="模型ID" class="flex-50"  >
               <el-input  v-model="dataInfo.id" class="cms-width"
                type="number" disabled ></el-input> 
            </el-form-item> 
            <el-form-item label="模型名字" class="flex-50"  prop="name">
                <el-input  v-model="dataInfo.name" class="cms-width"></el-input>                 
            </el-form-item> 


            <el-form-item label="展示名字" class="flex-50"  prop="showName">
                <el-input  v-model="dataInfo.showName" class="cms-width"></el-input>                 
            </el-form-item> 


            <!-- <el-form-item label="pc模型路径" class="flex-50"  prop="templageIdPc" >
                <el-input  v-model="dataInfo.templageIdPc" class="cms-width"></el-input>                 
                <span class="gray">推荐使用模板名字的拼音或英文</span>
            </el-form-item>
            <el-form-item label="h5模型路径" class="flex-50"  prop="templateIdH5" >
                <el-input  v-model="dataInfo.templateIdH5" class="cms-width"></el-input>                 
                <span class="gray">推荐使用模板名字的拼音或英文</span>
            </el-form-item>   -->
            <el-form-item label="排列顺序" class="flex-50" prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width" type="number"></el-input>                               
            </el-form-item>    
            <div class="form-footer">
               <el-button v-if="id==0" type="warning" @click="add(true)"
                    v-perms="'/model/add'"
                >提交并继续添加</el-button>

                <el-button v-if="id==0" type="primary"  @click="add(false)"
                    v-perms="'/model/add'"
                >提交</el-button>

                <el-button v-if="id!=0" type="primary"  @click="update()"
                    v-perms="'/model/edit'"
                >修改</el-button>

                <el-button type="info" @click="reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import {axiosProxy,checkErrorCode} from "@/api/tool"
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('此项必填');
    let valModel=va.checkModeId();
    let number = va.number('只能输入数字');
    return {
      command: null,
      params: {//只需要业务参数

      },
      rules: {
        //校验规则
        id:[required,number],
        global:[required],
        name:[required],
        showName: [required],
        tplChannelPrefix:[required],
        tplContentPrefix:[required],
        priority:[required],
        hasContent:[required],
        path:[required],
        templateIdH5: [required],
        templageIdPc: [required]
      },
      checkRes:false,
    };
  },
     methods:{   
        
      getDataInfo(id, url){
        axiosProxy.get(url).then(res => {
          if(res.data.errorCode == '0') {
            this.loading = false;
            this.dataInfo = res.data.data
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        });
      },
        update() {      
            this.updateDataInfo(this.$api.modelUpdate, this.dataInfo, "list");
        },
        reset() {
            this.dataInfo.showName = ''
            this.dataInfo.name = ''
            this.dataInfo.priority = ''
        },
        add(state) {    
          if(!this.checkRes){ 
            if(this.command) {
              this.saveDataInfo(state,this.$api.modelSave + '?parentModelId=' + this.command, this.dataInfo, "list", () => {
                setTimeout(() => {
                    this.routerLink('/model/list');
                }, 1000);
              });
            } else {
              this.saveDataInfo(state,this.$api.modelSave, this.dataInfo, "list", () => {
                setTimeout(() => {
                    this.routerLink('/model/list');
                }, 1000);
              });
            }           
          }    
        },

        getUrlParams(name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
  },
  created(){
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    let url
    let api = this.$api
    let id = this.getUrlParams('id')
    this.command = this.getUrlParams('command')
    this.dataInfo.priority = 0
    if(id != 0) {
      url = api.modelGet + '/' + id
      this.getDataInfo(id, url);
    } else {
      url = api.modelGet
      this.loading = false
    }
  }
};
</script>

<style>

</style>