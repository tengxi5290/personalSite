<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="分组名" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item  class="flex-50"  >
            </el-form-item>    
            <el-form-item label="启用" class="flex-100"  prop="enable">
               <el-radio v-model="dataInfo.enable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.enable" :label="false">否</el-radio>
            </el-form-item>    
            <el-form-item label="默认分组" class="flex-100"  prop="def">
               <el-radio v-model="dataInfo.def" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.def" :label="false">否</el-radio>
            </el-form-item>   
            <el-form-item label="描述" class="flex-100"  prop="description">
               <el-input
                type="textarea"  :rows="5" class="cms-width"
                placeholder="请输入内容" v-model="dataInfo.description">
              </el-input>
            </el-form-item>

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/scoregroup/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/scoregroup/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/scoregroup/edit'"
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
        name:[required],
      },
      
    };
  },
     methods:{       
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.scoregroupGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((ftp)=>{
                this.dataInfo=ftp.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() {      
            this.updateDataInfo(this.$api.scoregroupUpdate, this.dataInfo, "list");
        },
        add(state) {      
             this.saveDataInfo(state,this.$api.scoregroupSave, this.dataInfo, "list");
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