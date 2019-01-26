<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 名称 -->
        <el-form-item label="名称" class="flex-50 "  prop="name">
          <el-input class="cms-width" v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 版位 -->
        <el-form-item label="版位" class="flex-50"  prop="adspaceId">
          <el-select v-model="dataInfo.adspaceId" class="cms-width">
            <el-option v-for="(item,index) in adTypes" :key="index" :label="adTypes[index].name" :value="adTypes[index].id"></el-option>
          </el-select>
        </el-form-item> 
        <!-- 点击次数 -->
        <el-form-item label="点击次数" class="flex-50 "  prop="clickCount">
          <el-input class="cms-width" v-model="dataInfo.clickCount" type="number"> </el-input>
        </el-form-item>
        <!-- 展现次数 -->
        <el-form-item label="展现次数" class="flex-50 "  prop="displayCount">
          <el-input class="cms-width" v-model="dataInfo.displayCount" type="number"> </el-input>
        </el-form-item>
        <!-- 是否启用 -->
        <el-form-item label="是否启用" class="flex-50 "  prop="enabled">
          <el-radio-group v-model="dataInfo.enabled"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 时间范围 -->
        <el-form-item label="时间范围" class="flex-50" >
          <el-date-picker
            v-model="dateRange"
            :editable="false"
            type="daterange"
            align="right"
            value-format = "yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
             class="cms-width">
          </el-date-picker>
        </el-form-item> 
        <!-- 类型 -->
        <el-form-item label="类型" class="flex-100 "  prop="category">
          <el-radio-group v-model="dataInfo.category"  class="cms-width" @change="categoryChange"> 
            <el-radio :label="'image'">图片</el-radio>
            <!-- <el-radio :label="'flash'">Flash</el-radio> 需要解决flash上传组件 -->
            <el-radio :label="'text'">文字</el-radio>
            <el-radio :label="'code'">代码</el-radio>
          </el-radio-group>  
        </el-form-item>
        <!-- 内容-图片 -->
        <div v-if="conteDisable[0]" class="content-div">
            <!-- 图片链接 -->
            <el-form-item label="链接地址" class="flex-50 "  prop="attr_image_link">
              <el-input class="cms-width" v-model="dataInfo.attr_image_link" > </el-input>
            </el-form-item> 
            <el-form-item  class="flex-50">
              <el-input type="hidden"></el-input>
            </el-form-item>
            <!-- 图片标题 -->
            <el-form-item label="链接提示" class="flex-50 "  >
              <el-input class="cms-width" v-model="dataInfo.attr_image_title" > </el-input>
            </el-form-item>
            <el-form-item  class="flex-50">
              <el-input type="hidden"></el-input>
            </el-form-item>
            <!-- 图片上传 -->
            <el-form-item label="图片地址" class="flex-50 upload">
              <cms-upload :src='dataInfo.attr_image_url' class="cms-width" @change='getPath' :isMark="false">
              </cms-upload>
            </el-form-item> 
            <el-form-item  class="flex-50 upload">
              <el-input type="hidden" ></el-input>
            </el-form-item>
            <!-- 图片宽度 -->
            <el-form-item label="图片尺寸" class="flex-50 "  >
              <el-input class="cms-col2" v-model="dataInfo.attr_image_width" type="number" > </el-input>&nbsp;×
              <el-input class="cms-col2" v-model="dataInfo.attr_image_height" type="number" > </el-input>
              <span class="gray">宽×高</span>
            </el-form-item>
            <el-form-item  class="flex-50">
              <el-input type="hidden"></el-input>
            </el-form-item>
            <!-- 链接目标 新窗口/原窗口-->
            <el-form-item label="链接目标" class="flex-50 "  prop="enabled">
              <el-radio-group v-model="dataInfo.attr_image_target"  class="cms-width"> 
                <el-radio :label="'_blank'">新窗口</el-radio>
                <el-radio :label="'_self'">原窗口</el-radio>
              </el-radio-group>  
            </el-form-item>
            <el-form-item  class="flex-50 ">
              <el-input type="hidden"></el-input>
            </el-form-item>
        </div>
        <!-- 内容-Flash -->
        <!-- <div v-if="conteDisable[1]" class="content-div"> -->
          <!-- flash地址 -->
         <!--  <el-form-item label="Flash地址" class="flex-50 "  prop="attr_flash_url">
            <el-input class="cms-width" v-model="dataInfo.attr_flash_url" > </el-input>
          </el-form-item>   
          <el-form-item  class="flex-50">
            <el-input type="hidden"></el-input>
          </el-form-item>   -->
          <!-- flash尺寸 -->
       <!--    <el-form-item label="Flash尺寸" class="flex-50 " >
            <el-input class="cms-col2" v-model="dataInfo.attr_flash_width" type="number"> </el-input>&nbsp;×
            <el-input class="cms-col2" v-model="dataInfo.attr_flash_height" type="number" > </el-input>
             <span class="gray">宽×高</span>
          </el-form-item>
        </div> -->

        <!-- 内容-文字 -->
        <div v-if="conteDisable[2]" class="content-div">
          <!-- 文字内容/标题 -->
          <el-form-item label="文字内容" class="flex-50 "  prop="attr_text_title">
            <el-input class="cms-width" v-model="dataInfo.attr_text_title" > </el-input>
          </el-form-item>
          <el-form-item  class="flex-50">
            <el-input type="hidden"></el-input>
          </el-form-item> 
          <!-- 文字链接 -->
          <el-form-item label="文字链接" class="flex-50 "  prop="attr_text_link">
            <el-input class="cms-width" v-model="dataInfo.attr_text_link" > </el-input>
          </el-form-item>
          <el-form-item  class="flex-50">
            <el-input type="hidden"></el-input>
          </el-form-item> 
          <!-- 文字颜色 -->
          <el-form-item label="文字颜色" class=" text-color-item flex-50 "  >
            <el-input class="cms-width text-color" v-model="dataInfo.attr_text_color" > </el-input>
            <el-color-picker v-model="dataInfo.attr_text_color"></el-color-picker>  
          </el-form-item>
          <el-form-item  class="flex-50">
            <el-input type="hidden"></el-input>
          </el-form-item> 
          <!-- 文字大小 -->
          <el-form-item label="文字大小" class="flex-50 " >
            <el-input class="cms-width" v-model="dataInfo.attr_text_font" type="number"> </el-input>
            <span class="gray">如12px</span>
          </el-form-item>
          <el-form-item  class="flex-50">
            <el-input type="hidden"></el-input>
          </el-form-item> 
          <!-- 链接目标 -->
          <el-form-item label="链接目标" class="flex-50 "  >
             <el-radio-group v-model="dataInfo.attr_text_target"  class="cms-width"> 
                <el-radio :label="'_blank'">新窗口</el-radio>
                <el-radio :label="'_self'">原窗口</el-radio>
              </el-radio-group>  
          </el-form-item>
        </div>

        <!-- 内容-代码 -->
        <div v-if="conteDisable[3]" class="content-div">
          <!-- 内容 -->
          <el-form-item label="代码" class="flex-50 code-area"  prop="code">
            <el-input class="cms-width" v-model="dataInfo.code" type="textarea"> </el-input>
          </el-form-item>
        </div>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')" @click="add(true)" v-perms="'/ad/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)" v-perms="'/ad/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/ad/update'">
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
    return {
      dataInfo:{
      },
      adTypes:[],
      conteDisable:[
        true,
        false,
        false,
        false,
      ],
      index:{image:0,flash:1,text:2,code:3},
      dateRange:[],//时间范围
      rules: {//校验规则
        name:[required],
        priority:[required,number],
        views:[required,number],
        enabled:[required],
        domain:[required],
        category:[required],
        displayCount:[required],
        clickCount:[required],
        adspaceId:[required],
        attr_image_link:[required],
        attr_flash_url:[required],
        attr_text_link:[required],
        attr_text_title:[required],
        code:[required],
      }
    };
  },
  methods: {
    getPath(url){
      let val = url; 
      this.dataInfo.attr_image_url = '423423';
      this.dataInfo.attr_image_url = val;
      console.log(val);
    },
    categoryChange(val){
      this.conteDisable = this.conteDisable.map(function(e){return false;});
      this.conteDisable[this.index[val]] = true;
    },
    getAdTypes(){
      axios.post(this.$api.adSpaceList).then(res=>{
        if(res.code == '200'){
          this.adTypes =  res.body;
          if(this.id == 0 || this.dataInfo.adspaceId == ''){
            if(res.body.length > 0 ){
              this.dataInfo.adspaceId = res.body[0].id;
            }
          }
        }
      });
    },
    cleanImageParm(){
      this.dataInfo.attr_image_height = '';
      this.dataInfo.attr_image_width = '';
      this.dataInfo.attr_image_url = '';
      this.dataInfo.attr_image_link = '';
      this.dataInfo.attr_image_title = '';
      this.dataInfo.attr_image_target = '';
    },
    cleanFlashParm(){
      this.dataInfo.attr_flash_url = '';
      this.dataInfo.attr_flash_width = '';
      this.dataInfo.attr_flash_height = '';
    },
    cleanTextParm(){
      this.dataInfo.attr_text_title = '';
      this.dataInfo.attr_text_target = '';
      this.dataInfo.attr_text_font = '';
      this.dataInfo.attr_text_color = '';
      this.dataInfo.attr_text_link = '';
    },
    cleanCodeParm(){
      this.dataInfo.code = '';
    },
    getParam(){
      if(this.dateRange.length > 0){
        this.dataInfo.startTime = this.dateRange[0];
        this.dataInfo.endTime = this.dateRange[1];
      }
      switch(this.dataInfo.category){
        case 'image':
          this.cleanFlashParm();
          this.cleanTextParm();
          this.cleanCodeParm();
          break;
        case 'flash':
          this.cleanImageParm()
          this.cleanTextParm();
          this.cleanCodeParm();
          break;
        case 'text':
          this.cleanImageParm()
          this.cleanFlashParm();
          this.cleanCodeParm();
          break;
        case  'code':
          this.cleanImageParm()
          this.cleanFlashParm();
          this.cleanTextParm();
          break;
      }
    },
    getDataInfo(id) {//重写获取表单数据
      axios.post(this.$api.adGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          if(id == 0){
            this.dataInfo.category = 'image';
            this.dataInfo.attr_text_target = '_blank';
            this.dataInfo.attr_image_target = '_blank';
          }else{
            this.dateRange.push(res.body.startTime);
            this.dateRange.push(res.body.endTime);
          }
          this.getAdTypes();
          this.categoryChange(this.dataInfo.category);
        }).catch(err => {
          this.loading = false;
        });
    },
    update() {
       if(this.dataInfo.category=='image'){
         if(this.dataInfo.attr_image_url==''){
           this.errorMessage('必须上传一张图片');
           return false;
         } 
       }
      this.getParam();
      this.updateDataInfo(this.$api.adUpdate, this.dataInfo, "list");
    },
    add(state) {
       if(this.dataInfo.category=='image'){
         if(this.dataInfo.attr_image_url==''){
           this.errorMessage('必须上传一张图片');
           return false;
         } 
       }

      this.getParam();
      this.saveDataInfo(state,this.$api.adSave, this.dataInfo, "list");
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>
<style >
.el-date-editor .el-range-separator{
 margin-top: -1px
}
.el-date-editor .el-range-separator{
  width: 6%;
}
.content-div{
  margin-bottom: 0px;
  padding: 15px 0;
  width: 100%;
}
.text-color{
  top: -10px;
}
.el-color-picker,.el-color-picker__trigger{
  width: 32px;
  height: 32px;
}
.cms-col2{
  width: 20%;
}
.cms-col4{
  width: 40%;
}
.cms-col6{
  width: 60%;
}
.content-div .el-form-item{
  float: left;
}
.text-color-item{
  height: 63px
}
.content-div .gray{
  display: inline-block;
}
.flex-50{
  height: 63px;
}
.upload{
  height: 161px;
}
.upload .el-form-item__label{
  margin-top: 49px;
}
.code-area{
   height: 110px;
}
</style>
