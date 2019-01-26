<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="ID" class="flex-50"  prop="id">
               <el-input v-if="this.id==0" v-model="dataInfo.id" :class="checkResClass" @change="checkId"></el-input> 
               <span v-else>{{dataInfo.id}}</span>
               <span v-if="checkRes" class="red">内容类型ID重复</span>
            </el-form-item>       
            <el-form-item label="名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="是否有图片" class="flex-50"  prop="hasImage">
              <el-radio v-model="dataInfo.hasImage" :label="true">是</el-radio>
              <el-radio v-model="dataInfo.hasImage" :label="false">否</el-radio>         
            </el-form-item>
            <el-form-item label="禁用" class="flex-50"  prop="disabled">
              <el-radio v-model="dataInfo.disabled" :label="true">是</el-radio>
              <el-radio v-model="dataInfo.disabled" :label="false">否</el-radio>         
            </el-form-item>
             <el-form-item label="图片宽度" class="flex-50"  prop="imgWidth">
               <el-input v-model="dataInfo.imgWidth" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item label="图片高度" class="flex-50"  prop="imgHeight">
               <el-input v-model="dataInfo.imgHeight" class="cms-width"></el-input>
            </el-form-item>


            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/type/add'"
                >提交并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/type/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/type/edit'"
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

      },
      rules: {
        //校验规则
        id:[required],
        name: [required],
        imgHeight: [required,number],
        imgWidth: [required,number],
        disabled: [required],
        hasImage: [required],
      },
      checkResClass:'cms-width',
      checkRes:false,
    };
  },
     methods:{   
      checkId(value){
            let reg = new RegExp("^[0-9]*$");  
            if(reg.test(value)){
                  axios.post(this.$api.typeCheckId,{id:value}).then(res=>{
                          this.checkRes = res.body.result
                          this.checkResClass = res.body.result ? 'border-red cms-width' : 'cms-width';
                          this.loading = false;
                  }).catch(err => {
                         this.loading = false;
                  });
            }else{
                  this.errorMessage('ID必须为1-999999的正整数');
            } 
      } ,
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.typeGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((type)=>{
                this.dataInfo=type.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() {      
            this.updateDataInfo(this.$api.typeUpdate, this.dataInfo, "list");
        },
        add(state) {  
          if(!this.checkRes){              
              this.saveDataInfo(state,this.$api.typeSave, this.dataInfo, "list");
          }        
        }
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>
  .red{
        color: #f56c6c;
  }
  .el-form-item__content .border-red input{
      border-color : #f56c6c  !important;
  }
</style>