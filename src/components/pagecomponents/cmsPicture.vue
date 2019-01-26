<template>
	<div class="cms-upload" >
        <div class="">
        	<el-upload
	            class="upload-demo"
	            :on-success="successUpload"
	            action="http://cms.cnlive.com:8768/upload/1"
	            :on-remove="handleRemove"
	            :with-credentials="cookie"
	            :limit="limit"
              :file-list="fileList"
	            :on-exceed="exceed"
	            list-type="picture">
	            <el-button size="small" type="primary">点击上传33333</el-button>
	            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
	         </el-upload>
        </div>
    </div>
</template>

<script>
	import { getRand } from "@/untils/random";
import { signParams } from "@/untils/sign";
import api from "@/api/api";
import axios from "axios";
import {axiosProxy,checkErrorCode, axiosProxyFiles} from "@/api/tool"
var rand = getRand();
export default {
    name:'cms-upload',
props:{
	disable: null,
    field:{
        type:String,
         default:'', 
    },
     src:{
         type:String,
         default:'',
     },
     isMark:{
       type:Boolean,
       default:true,
     },
     index:{
      type:Number,
      default:0,
     },
     pIndex:{
      type:Number,
      default:0,
     },
     index: null,
     default: null
},
  data() {
    return {
      limit: 1,
      isDisable: false,
      // imageUrl: '',
      imageUrl:(this.src !='' && this.src.indexOf('http') <0) ? this.$getUrl() + this.src : this.src,
      // upLoadUrl: this.$store.state.sys.baseUrl + api.bsaeUpload,
      // uploadUrl:this.$api.uploadFiles + '/1',
      uploadUrl: '',
      cookie: true,
      params:{
          appId: process.env.appId,
          sessionKey: localStorage.getItem("sessionKey"),
          type: "image",
          nonceStr: rand,
          mark:'',
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
        // 'Content-Type': 'multipart/form-data'
      },
      data:{},
      percentage: 0,
      status: "",
      uploadStar: false,
      dialogVisible:false,
      currentUrl: '',
      fileObj: {},
      pictureGroup: [],
      fileList: []
    };
  },
  methods: {
  	exceed (file, fileList) {
  		console.log('exceed')
  		console.log(file)
  		console.log(fileList)
  	},
    handlePreview (file) {
      console.log(file)
    },
    handleRemove (file, index) {
    	console.log('remove')
    	this.$emit('remove', 'remove', this.index)
    },
    beforeUpload (files) {
      console.log(files)
      this.fileObj = files
    },
    successUpload(response, file, fileList) {
      console.log('图片上传成功了')
      console.log(response)
      console.log(file)
      console.log(fileList)
      this.pictureGroup = fileList
      this.$emit('get', response.data.url, this.index)
    },
    handleAvatarProgress(event, file, fileList) {//进度
      this.imageUrl = "";
      this.uploadStar = true;
      this.percentage = parseInt(event.percent.toFixed(1));
    },
    deleteImg() {
      this.uploadStar = false;
      this.percentage = 0;
      this.status = "";
       this.$emit('get','',this.field,this.index,this.pIndex);
       this.$emit('change','',this.index,this.pIndex);
      this.imageUrl = "";
      
    }
  },
  created(){
    console.log('created')
    this.data=signParams(this.params,process.env.appKey);
       //console.log("src:"+this.src);
      // this.imageUrl = this.src.indexOf('http') >= 0 ?this.src : this.getUrl()+this.src;
  },
  updated () {
    console.log('update')
  },
  destroyed () {
    console.log('destoried')
  },
//   watch:{
//       src(curVal,oldVal){
//         if(curVal == ''){
//             this.imageUrl = '';
//         }else if(curVal.indexOf("http") >= 0){
//               // this.imageUrl = curVal;              
//         }else{
//             this.imageUrl = this.$getUrl() + curVal;  
//         }
//         // if(curVal!=''){
//         //     this.$emit('change',this.imageUrl,this.index,this.pIndex);
//         // } 
// 　　　},
//       params:{
//         handler(curVal,oldVal){
            
//              this.data=signParams(curVal,process.env.appKey);             
//         },
//         deep:true
//       }
//   }
};
</script>


<style lang="scss" scoped>
$width: 130px;
$height: 130px;
.cms-upload {
  display: flex;
  align-items: center;
}
.cms-upload-box{
   position: relative;
border: 1px dashed #d9d9d9;
  border-radius: 6px;
   width: $width;
  height: $width;
}
.mark-box{
  margin-left: 10px;
}
.avatar-uploader .el-upload:hover .img-porp {
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: $width;
  height: $height;
  line-height: $height;
  text-align: center;
}

.cms-show-img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  cursor: pointer;
}
.cms-zoom-icon {
  color: #fff;
  font-size: 20px;
  margin: 0 auto;
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  margin-left: -51px;
    margin-top: -15px;
}

.cms-zoom-font {
  font-size: 14px;
  position: relative;
  top: -3px;
}
.cms-show-img:hover .img-porp {
  display: block;
}
.back-img {
  width: 100%;
  height: 100%;
}
.img-porp {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  top: 0;
  display: none;
  z-index:49;
}
.cms-img-bottom {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  position: absolute;
  bottom: 0;
  z-index: 50;
}
.cms-again {
  width: 50%;
  background: #1ab0fb;
  text-align: center;
  a {
    color: #fff;
    font-size: 12px;
  }
}
.delete {
  width: 50%;
  background: #ff7653;
  text-align: center;
  a {
    color: #fff;
    font-size: 12px;
  }
}
.cms-progress {
  position: absolute;
  top: 0;
  width: $width;
  height: $height;
  z-index: 888;
}

</style>

