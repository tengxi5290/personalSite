<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="字段" class="flex-50"  prop="field">
               <el-input v-model="dataInfo.field" class="cms-width"></el-input> 
            </el-form-item> 
            <el-form-item label="名称" class="flex-50"  prop="label">
               <el-input v-model="dataInfo.label" class="cms-width"></el-input> 
            </el-form-item> 
             <el-form-item label="数据类型" class="flex-50"  prop="dataType">
               <el-select v-model="dataInfo.dataType">
                    <el-option :value="1" label="字符串文本"></el-option> 
                    <el-option :value="2" label="整型文本"></el-option>
                    <el-option :value="3" label="浮点型文本"></el-option>
                    <el-option :value="4" label="文本区"></el-option>
                    <el-option :value="5" label="日期"></el-option>
                    <el-option :value="6" label="下拉列表"></el-option>
                    <el-option :value="7" label="复选框"></el-option>
                    <el-option :value="8" label="单选框"></el-option>   
               </el-select>
            </el-form-item>
            <el-form-item label="排列顺序" class="flex-50"  prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width"></el-input> 
            </el-form-item> 
             <el-form-item label="帮助信息" class="flex-50"  prop="help">
               <el-input v-model="dataInfo.help" class="cms-width"></el-input> 
            </el-form-item> 
            <el-form-item label="帮助位置" class="flex-50"  prop="helpPosition">
               <el-input v-model="dataInfo.helpPosition" class="cms-width"></el-input>
                <span class="gray">上1，右2，下3，左4</span>
            </el-form-item>
             <el-form-item label="默认值" class="flex-50"  prop="defValue">
               <el-input v-model="dataInfo.defValue" class="cms-width"></el-input> 
            </el-form-item> 
             <el-form-item label="宽" class="flex-50"  prop="size">
               <el-input v-model="dataInfo.size" class="cms-width" type='number'></el-input> 
            </el-form-item> 
            <el-form-item label="可选项" class="flex-100"  prop="optValue">
               <el-input v-model="dataInfo.optValue" class="cms-width"></el-input>
                <span class="gray">多个值用","分开</span>
            </el-form-item>
            <el-form-item label="行数" class="flex-50"  prop="rows">
               <el-input v-model="dataInfo.rows" class="cms-width" type='number'></el-input> 
            </el-form-item> 
             <el-form-item label="列数" class="flex-50"  prop="cols">
               <el-input v-model="dataInfo.cols" class="cms-width" type='number'></el-input> 
            </el-form-item> 
            <el-form-item label="必填项" class="flex-100"  prop="required">
               <el-radio v-model="dataInfo.required" :label="true">是</el-radio>
               <el-radio v-model="dataInfo.required" :label="false">否</el-radio>                
            </el-form-item>      
            

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/globel/registerModel/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/globel/registerModel/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/globel/registerModel/edit'"
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
        field:[required],
        label:[required],
        dataType:[required],
        priority:[required,number],
        required:[required],
        rows:[required,number],
        cols :[required,number],
        size :[required,number],
      },
      checkRes:false,
    };
  },
     methods:{    
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configRegisterItemGet, {id:id}), //axios批量发送请求
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
            this.updateDataInfo(this.$api.configRegisterItemUpdate, this.dataInfo, "list");
        },
        add(state) {  
          if(!this.checkRes){              
              this.saveDataInfo(state,this.$api.configRegisterItemSave, this.dataInfo, "list");
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

</style>