<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
             

            <el-form-item label="标题" class="flex-50"  prop="title">
                <el-input  v-model="dataInfo.title" class="cms-width"></el-input>                 
            </el-form-item>  
           <el-form-item  class="flex-50"  >
            </el-form-item> 
            <el-form-item label="关键字" class="flex-50"  prop="number">
                <el-input  v-model="dataInfo.number" class="cms-width"></el-input>                 
            </el-form-item>
            <el-form-item  class="flex-50"  >
            </el-form-item> 
             <el-form-item label="链接地址" class="flex-50"  prop="url">
                <el-input  v-model="dataInfo.url" class="cms-width"></el-input>                 
            </el-form-item>
            <el-form-item  class="flex-50"  >
            </el-form-item> 
            <el-form-item label="图片" class="flex-50">
                 <cms-upload :src='dataInfo.path' :isMark='false' @change='getPath'></cms-upload>
                <span class="gray">留空则使用文字水印</span>               
            </el-form-item>
            <el-form-item  class="flex-50"  >
            </el-form-item> 
             <el-form-item label="内容" class="flex-100"  prop="content">
               <el-input
                    type="textarea"
                    :rows="2" class="cms-width"
                    placeholder="请输入内容"
                    v-model="dataInfo.content" maxlength="255">
                </el-input>            
            </el-form-item>
            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/weixinMessage/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/weixinMessage/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/weixinMessage/edit'"
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
    let required = va.required('该项必填');
    return {
      params: {//只需要业务参数

      },
      rules: {
        //校验规则
        title:[required],
        number:[required],
        welcome:[required],
      },

    };
   },
     methods:{   
       getPath(value){
           this.dataInfo.path=value;  
        },   
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.weixinMessageGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((type)=>{
                this.dataInfo=type.body;
                this.dataInfo.type=0;
                this.dataInfo.welcome=false;  
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() {      
            this.updateDataInfo(this.$api.weixinMessageUpdate, this.dataInfo, "list");
        },
        add(state) {             
            this.saveDataInfo(state,this.$api.weixinMessageSave, this.dataInfo, "list");       
        }
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>