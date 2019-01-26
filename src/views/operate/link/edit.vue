<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 网站名称 -->
        <el-form-item label="名称" class="flex-50 "  prop="name">
          <el-input class="cms-width" v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 网址 -->
        <el-form-item label="网站地址" class="flex-50 "  prop="domain">
          <el-input class="cms-width" v-model="dataInfo.domain"> </el-input>
        </el-form-item>
        <!-- 网站类别 -->
        <el-form-item label="网站类别" class="flex-50"  prop="categoryId">
          <el-select v-model="dataInfo.categoryId" class="cms-width">
            <el-option v-for="(item,index) in LinkTypes" :key="index" :label="LinkTypes[index].name" :value="LinkTypes[index].id"></el-option>
          </el-select>
        </el-form-item> 
        <!-- 排序 -->
        <el-form-item label="排序" class="flex-50 "  prop="priority">
          <el-input class="cms-width" v-model="dataInfo.priority" type="number"> </el-input>
        </el-form-item>
        <!-- 点击次数 -->
        <el-form-item label="点击次数" class="flex-50 "  prop="views">
          <el-input class="cms-width" v-model="dataInfo.views" type="number"> </el-input>
        </el-form-item>
        <!-- 显示 -->
        <el-form-item label="显示" class="flex-50 "  prop="enabled">
          <el-radio-group v-model="dataInfo.enabled"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
        </el-form-item>
        <!-- Logo上传 -->
        <el-form-item label="Logo" class="flex-50 " >
          <cms-upload :src='dataInfo.logo' class="cms-width" @change='getPath' :isMark="false"></cms-upload>
        </el-form-item>
        <el-form-item class="flex-50 "  >
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="描述" class="flex-100" >
          <el-input v-model="dataInfo.description" class="cms-width" type="textarea" maxlength="255"></el-input>
        </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')" @click="add(true)" v-perms="'/link/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)" v-perms="'/link/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/link/update'">
              修改
            </el-button>
            <el-button type="info" @click="$reset">重置</el-button>
            <span class="gray" v-if="isType('save')">选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
        </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let required = va.required('此项必填');
    let number = va.number('必须为数字');
    let checkChinese = va.checkChinese('URL不能包含中文');
    let isURL = va.isURL("URL格式不正确");

    return {
      dataInfo:{
      },
      LinkTypes:[],
      rules: {//校验规则
        name:[required],
        priority:[required,number],
        views:[required,number],
        enabled:[required],
        domain:[required,checkChinese,isURL],
        categoryId:[required],
      }
    };
  },
  methods: {
    getPath(val){
      this.dataInfo.logo = val;
    },
    getLinkTypes(){
      axios.post(this.$api.linkTypeList).then(res=>{
        if(res.code == '200'){
          this.LinkTypes =  res.body;
          if(this.id == 0 || this.dataInfo.categoryId == ''){
            if(res.body.length > 0 ){
              this.dataInfo.categoryId = res.body[0].id;
            }
          }
        }
      });
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.linkGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          this.getLinkTypes();
        }).catch(err => {
          this.loading = false;
        });
    },
    update() {
      this.updateDataInfo(this.$api.linkUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.saveDataInfo(state,this.$api.linkSave, this.dataInfo, "list");
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>
