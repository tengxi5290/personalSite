<template>
    <section class="cms-body" v-loading="loading">
        
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="开启水印" class="flex-100"  prop="on">
                <el-radio v-model="dataInfo.on" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.on" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="图片尺寸控制" class="flex-50" prop="minWidth">
                    <el-input class="w-120"  v-model="dataInfo.minWidth" type="number"></el-input> ×
                    <el-input class="w-120"  v-model="dataInfo.minHeight" type="number"></el-input>    
                      <span class="gray">宽 × 高 ；小于该尺寸的图片不添加水印</span>    
            </el-form-item>    
               
              
               
         
            <el-form-item label="水印图片" class="flex-100">            
                    <cms-upload :src="'/jeecmsv9f'+dataInfo.imagePath" @change='getPath'></cms-upload>
                    <span class="gray">留空则使用文字水印</span> 
           </el-form-item>  
             <el-form-item label="水印文字" class="flex-50" prop="content">
                    <el-input class="cms-width" v-model="dataInfo.content"></el-input>
                    <span class="gray">使用中文有可能出现乱码</span> 
           </el-form-item> 
           <el-form-item  class="flex-50" >
           </el-form-item> 
            <el-form-item label="水印配置" class="flex-100" prop="size">
                <div class="flex">
                    <span style="margin-right:12px">文本大小</span>
                    <el-input class="w-120" v-model="dataInfo.size" type="number" style="margin-right:12px"></el-input>
                    <span style="margin-right:12px">颜色</span>             
                    <el-color-picker v-model="dataInfo.color" style="margin-right:12px"></el-color-picker>
                    <span style="margin-right:12px">文字透明度</span>
                    <el-input class="w-120" v-model="dataInfo.alpha" type="number" style="margin-right:12px"></el-input>
                </div>
                    
                    <span class="gray">0-100，越小越透明</span>       
           </el-form-item>  
                 
           
            <el-form-item label="位置" class="flex-100" prop="pos">
                    <el-select v-model="dataInfo.pos">
                        <el-option :value="0" label="随机"></el-option>
                        <el-option :value="1" label="左上"></el-option>
                        <el-option :value="2" label="右上"></el-option>
                        <el-option :value="3" label="左下"></el-option>
                        <el-option :value="4" label="右下"></el-option>
                        <el-option :value="5" label="居中"></el-option>
                    </el-select>
                    <span  style="margin:0 12px">水平偏移量</span>
                    <el-input class="w-120" v-model="dataInfo.offsetX" type='number'></el-input>
                    <span>垂直偏移量</span>
                    <el-input class="w-120" v-model="dataInfo.offsetY" type='number'></el-input>
            </el-form-item>         
               
              
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/markUpdate'"
                >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:""
      },
      rules: {
        //校验规则
        on:[required],
        content:[required],
        pos:[required],
        minHeight:[number],
        minWidth:[required,number],
        offsetX:[number],
        offsetY:[number],
        alpha:[number],
        size:[required,number],
      },
      
    };
  },
     methods:{
         getPath(value){
           this.dataInfo.imagePath='/jeecmsv9f'+value;  
         },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configMarkGet), //axios批量发送请求
        ])
        .then(
            axios.spread((mark)=>{
                this.dataInfo=mark.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
             if(this.dataInfo.minWidth == '' || this.dataInfo.minHeight == ''){
                  this.errorMessage('图片尺寸控制未填写，请确认!');
                  return false;
             }
             if(this.dataInfo.size == '' || this.dataInfo.alpha == '' || this.dataInfo.color == '' || this.dataInfo.color == null){
                  this.errorMessage('水印配置未填写，请确认!');
                  return false;
             }
            if(this.dataInfo.offsetX === '' || this.dataInfo.offsetY ===''){
                  this.errorMessage('位置未填写，请确认!');
                  return false;
             }
              
             this.updateDataInfo(this.$api.configMarkUpdate, this.dataInfo, "");
        }
        
  },
  created(){
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style scoped>
.w-120{
    width: 128px !important;
}
</style>