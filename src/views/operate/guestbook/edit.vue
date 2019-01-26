<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
      <!-- 留言类型 -->
        <el-form-item label="留言类型" class="flex-50 "  prop="ctgId">
            <el-select  v-model="dataInfo.ctgId" class="cms-width">
              <el-option v-for="(item,index) in guestbookTypes" :key="index" :label="guestbookTypes[index].name" :value="guestbookTypes[index].id"></el-option>
            </el-select>
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="标题" class="flex-50 "  prop="title">
          <el-input class="cms-width" v-model="dataInfo.title"> </el-input>
        </el-form-item>
        <!-- 留言内容 -->
        <el-form-item label="留言内容" class="flex-100"  prop="content">
          <el-input v-model="dataInfo.content" class="cms-width" type="textarea" ></el-input>
        </el-form-item>
        <!-- 回复内容-->
        <el-form-item label="回复内容" class="flex-100"  prop="reply">
          <el-input v-model="dataInfo.reply" class="cms-width" type="textarea" ></el-input>
        </el-form-item>
         <!-- 邮箱 -->
        <el-form-item label="邮箱" class="flex-50 "  prop="priority">
          <el-input class="cms-width" v-model="dataInfo.email" > </el-input>
        </el-form-item>
        <!-- 电话-->
        <el-form-item class="flex-50 "  label="电话">
          <el-input class="cms-width" v-model="dataInfo.phone" > </el-input>
        </el-form-item>
        <!-- QQ-->
        <el-form-item class="flex-50 "  label="QQ">
          <el-input class="cms-width" v-model="dataInfo.qq" type="number"> </el-input>
        </el-form-item>
        <!-- 审核-->
        <el-form-item label="审核" class="flex-50 "  >
          <el-radio-group v-model="dataInfo.checked"  class="cms-width"> 
            <el-radio :label="0">待审核</el-radio>
            <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
          </el-radio-group>  
        </el-form-item>
         <!-- 审核-->
        <el-form-item label="推荐" class="flex-50 "  >
          <el-radio-group v-model="dataInfo.recommend"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
        </el-form-item>
        <el-form-item  class="flex-50 "  >
        </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')"    @click="add(true)" v-perms="'/guestbook/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)" v-perms="'/guestbook/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/guestbook/update'">
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
    let required = va.required();
    let number = va.number();
    return {
      dataInfo:{
      },
      setps:[],
      roles:[],
      defaultRole:{},
      ftp_div_show:false,
      guestbookTypes:[],
      rules: {//校验规则
        ctgId:[required],
        content:[required],
        reply:[required],
        title:[required],
      }
    };
  },
  methods: {
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.guestbookGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          axios.post(this.$api.guestbookTypeList).then(result=>{
            if(res.code == '200'){
                this.guestbookTypes = result.body;
                if(this.guestbookTypes.length > 0){
                  this.dataInfo.ctgId = this.guestbookTypes[0].id;
                }
            }
          });
          this.dataInfo.checked = 1;
          this.dataInfo.recommend =  true;
        }).catch(err => {
          this.loading = false;
        });
    },
    update(state) {
      this.updateDataInfo(this.$api.guestbookUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.saveDataInfo(state,this.$api.guestbookSave, this.dataInfo, "list");
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>
<style scoped>
.el-input-group{
  width: 20%;
} 
.cms-body .cms-form .flex-100,.cms-body .cms-form .flex-50{
  border-top: 1px dashed #eee;
}
.cms-body .cms-form .flex-no-border{
 border-top: 0px dashed #eee; 
}
.cms-body .cms-col1{
  width: 10%
}
.cms-body .cms-col2{
  width: 20%
}
.cms-body .cms-col3{
  width: 30%
}
.cms-body .cms-col4{
  width: 40%
}
.cms-body .cms-col5{
  width: 50%
}
.cms-body .cms-col6{
  width: 60%
}
.cms-body .cms-col7{
  width: 70%
}
.cms-body .cms-col8{
  width: 80%
}
.cms-body .cms-col9{
  width: 90%
}
.cms-body .cms-col10{
  width: 100%
}
.ftp-div{
  padding: 15px 0 15px 162px;
  box-sizing: border-box;
  font-size: 14px;
}
.ftp-item{
  background-color: #fbfdff;
  border: 1px #eee dotted;
  padding: 15px 15px ;
}
.ftp-item{
  line-height:50px;
}
.ftp-item > div >div{
  display: inline-block;
}
.gray{
  font-size: 14px;
}
.el-form-item__error {
    left: 84%;
}
</style>
