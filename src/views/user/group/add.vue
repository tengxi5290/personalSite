<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width" type='required'></el-input>
            </el-form-item>       
            <el-form-item label="排列顺序" class="flex-50"  prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width" type='number'></el-input>
            </el-form-item> 
            <el-form-item label="每日附件总尺寸" class="flex-50"  prop="allowPerDay">
               <el-input v-model="dataInfo.allowPerDay" class="cms-width" type='required'></el-input>
               <span class="gray">0为不限制，单位(KB)</span> 
            </el-form-item> 
            <el-form-item label="最大附件总尺寸" class="flex-50"  prop="allowMaxFile">
               <el-input v-model="dataInfo.allowMaxFile" class="cms-width" type='required'></el-input>
               <span class="gray">0为不限制，单位(KB)</span> 
            </el-form-item> 
            <el-form-item label="允许上传后缀" class="flex-100"  prop="allowSuffix">
               <el-input v-model="dataInfo.allowSuffix" class="cms-width"></el-input>
               <span class="gray">留空则不限制，多个用","分开</span> 
            </el-form-item>
           
         
            <el-form-item label="评论需要审核" class="flex-50"  prop="needCheck">
                 <el-radio-group v-model="dataInfo.needCheck">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>  
            </el-form-item>
            <el-form-item label="评论需要验证码" class="flex-50"  prop="needCaptcha">
                 <el-radio-group v-model="dataInfo.needCaptcha">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>  
            </el-form-item>

            <div class="form-footer">
                <el-button type="warning" @click="add(true)"
                    v-perms="'/group/add'"
                >保存并继续添加</el-button>
                <el-button type="primary"  @click="add(false)"
                    v-perms="'/group/add'"
                >提交</el-button>
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
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      params: {//只需要业务参数
      
      },
      rules: {
        //校验规则
        name: [required],
        priority:[required,number],
        allowPerDay:[required,number],
        allowMaxFile:[required,number],
        allowFileSize:[required,number],
        allowFileTotal:[required,number],
      },
      memberGroup: [], //业务变量会员组
       roles:[],
      };
  },
     methods:{
         getRoleIds(value){
              console.log(value);             
         },
      getDataInfo(id,https){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.groupGet, {id:id,https:https}), //axios批量发送请求
        ])
        .then(
            axios.spread((group)=>{
                this.dataInfo=group.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        add(state) {  
             this.dataInfo['steps']=1;    
             this.saveDataInfo(state,this.$api.groupSave, this.dataInfo, "list");
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
