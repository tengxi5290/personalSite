<template>
  <div class="uploader">
    <div class="uploader-container" :style="{backgroundImage: 'url(' + pictureUrl + ')'}" :class="additionalClass">
        <i class="el-icon-plus" :class="showIcon? 'show': 'hide'"></i>
    </div>
    <input type="file" class="uploader-action" :class="additionalClass" :model="pictureUrl" @change="fileChange" />
  </div>
</template>

<script>
  import axios from "axios";
  import {axiosProxy,checkErrorCode,axiosProxyFiles} from "@/api/tool"
  export default {
    props:{
      default: '',
      index: '',
      direction: ''
    },

    data() {
      return {
        pictureUrl: '',
        showIcon: true,
        storageId: null,
        picturePath: '',
        additionalClass: 'normal-image'
      };
    },


    methods: {
      fileChange (e) {
        let file = e.target.files[0]
        let filename = e.currentTarget.files[0]
        var formData = new FormData();
        formData.append("file", file);
        let url = 'http://cmstest.cnlive.com:8768/upload/1'
        axiosProxyFiles.post(url, formData)
        .then(res=>{
          if(res.data.errorCode=='0'){
            this.successMessage('文件上传成功')
            this.pictureUrl = res.data.data.url
            this.picturePath = res.data.data.url
            // this.picturePath = res.data.data.path
            this.storageId = res.data.data.storageId
            this.showIcon = false
            if(this.index) {
              this.$emit('change', this.pictureUrl, this.index, this.picturePath, this.storageId)
            } else {
              this.$emit('change', this.pictureUrl)
            }
          }
          else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('文件上传失败')
            }
          }
        })
        .catch(err=>{console.log(err)})
      },
    },
    mounted () {
      if(this.default != undefined) {
        if(this.default == '') {
          this.showIcon = true
        } else {
          this.showIcon = false
        }
        this.pictureUrl = this.default
      } else {
        this.showIcon = true
      }


      if(this.direction) {
        if(this.direction == 'horizontal') {
          this.additionalClass = 'horizontal-image'
        } else if(this.direction == 'vertical') {
          this.additionalClass = 'vertical-image'
        } else {
          this.additionalClass = 'normal-image'
        }
      } else {
        this.additionalClass = 'normal-image'
      }
    }

};
</script>

<style lang='scss' scoped>
  .uploader {
    position: relative;
  }
  .uploader-container {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    vertical-align: top;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    i {
      font-size: 28px;
      color: #8c939d;
    }
  }

  .vertical-image {
    width: 240px;
    height: 320px;
    line-height: 320px;
  }

  .horizontal-image {
    width: 320px;
    height: 180px;
    line-height: 180px;
  }

  .normal-image {
    width: 320px;
    height: 320px;
    line-height: 320px;
  }

  .uploader-action {
    position: absolute;
    top: 0;
    opacity: 0;
    display: block;
  }

  .hide {
    visibility: hidden;
  }

  .show {
    visibility: visible;
  }
</style>
