<template>
  <section class="cms-body" v-loading="loading">
    <div class="content" >
         <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
             <el-form-item label="二维码LOGO图片" class="flex-10 "  prop="imagePath">
                  <cms-upload :src='dataInfo.imagePath' :isMark="false" @change='getPath'></cms-upload>
            </el-form-item>
            <el-form-item label="二维码内容" class="flex-100 "  prop="content">
                <el-input class="cms-width"  type="textarea" :rows="2" placeholder="请输入内容" v-model="dataInfo.content">
                </el-input>
            </el-form-item>
             <el-form-item label="logo文字" class="flex-100 "  prop="logoWord">
              <el-input class="cms-width" v-model="dataInfo.logoWord"> </el-input>
            </el-form-item>
             <el-form-item label="logo文字大小" class="flex-100 "  prop="fontSize">
              <el-input  class="cms-width" v-model="dataInfo.fontSize"> </el-input>
            </el-form-item>
              <el-form-item label="二维码尺寸" class="flex-100 "  prop="size">
              <el-input  class="cms-width" v-model="dataInfo.size" maxlength="3" onkeyup="value=value.replace(/[^\d]/g,'')"> </el-input>
              <span class="gray">规定生成之后图片的宽和高（大小最好在100-300之间）</span>
            </el-form-item>  
              <div class="form-footer">
                    <el-button type="primary"  @click="grenQR()"
                        v-perms="'/dimensioncode/create'"
                    >生成二维码</el-button>
                    <el-button type="info" @click="$reset">重置</el-button>
            </div>
        </el-form>
    </div>
    <div class="prven">
         <!-- <iframe v-if="downloadImgFlage" :src="qrcodeUrl"   id="IframeReportImg" name="IframeReportImg"  width="0" height="0" ></iframe> -->
         <el-form  ref="form1" class="cms-form">
           <el-form-item label="二维码预览" class="flex-50 "  >
                  <div class="qrcode">
                        <img v-if="downloadImgFlage"  :src="qrcodeUrl">
                        <span v-else class="qr-tip">左侧输入内容，点击生成二维码</span>
                        <span class="gray download-tip">下载提示：鼠标移动至图片，右键另存为即可</span>
                <!--  <el-button type="primary"  class="download" @click="download(qrcodeUrl)" >下载</el-button>-->
                  </div> 
            </el-form-item>
            <div class="form-footer">
                    
            </div>
        </el-form>
    </div>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import { setBaseUrl } from '@/config.js'
import { getRand } from '@/untils/random'
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let qrcode = va.qrcode('只能输入数字且大小在100-300之间');
    return {
         rules: {
            //校验规则
            content:[required],
            fontSize:[required,number],
            size:[required,qrcode],
        },
        downloadImgFlage:false,
        qrcodeUrl:'',
    };
  },
  methods: {
       getPath(value){
           this.dataInfo.logoPicPath=value;  
       },
       // download(imgPathURL) {
       //     document.execCommand("SaveAs");        
       // },
       getDataInfo() {//重写获取表单数据
            let body={
                content:'',
                logoPicPath:'',
                logoWord:'',
                fontSize:'10',
                size:'100',    
                qrcodeUrl:'',
            };
             this.dataInfo=body;
             this.loading = false;
        },
        grenQR() {     
            this.loading = true;
            this.downloadImgFlage = false;
            axios.post(this.$api.dimensioncodeCreate,this.dataInfo).then(res=>{
                if(res.code == '200'){
                    this.downloadImgFlage = true;
                    // setBaseUrl()+
                    let imgUrl=(res.body.url+'').replace('/jeecmsv9f','');
                    this.qrcodeUrl =  setBaseUrl()+imgUrl+'?str='+getRand();
                } 
                this.loading = false;
            }).catch(error=>{
                this.loading = false;
            })
        }
  },
  created() {
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style scoped>
  .cms-body{
     display: flex;
  }
  .content{
    width: 60%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }
  .prven{
      width: 40%;
      box-sizing: border-box;
  }
  .qrcode{
    position: relative;
     margin-left: 122px;
     width: 200px;
     height: 200px;
     border: 1px dashed #d9d9d9;
  }
  .qrcode img{
    width: 198px;
    height: 198px;
  }
  .qr-tip{
      color: #606266;
      display: block;
      text-align: center;
       height: 60px;
       width: 100px;
       position: absolute;
       left: 50%;
       top: 50%;
       margin-top: -30px;
       margin-left: -50px;
  }
  .form-footer{
    text-align: center;
  }
  .download{
    position: absolute;
    left: 50%;
    top: 100%;
    margin-top: 20px;
    margin-left:-40px;
  }
  .download-tip{
    text-align: center;
    width: 140px;
    line-height: 20px;
    position: absolute;
    left: 50%;
    top: 100%;
    margin-top: 20px;
    margin-left:-70px;
  }
</style>
