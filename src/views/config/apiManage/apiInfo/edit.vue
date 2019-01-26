<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
         
            <el-form-item label="名称" class="flex-100"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>
             <el-form-item label="地址" class="flex-100"  prop="url">
               <el-input v-model="dataInfo.url" class="cms-width"></el-input>
            </el-form-item>
             <el-form-item label="接口代码" class="flex-100"  prop="code">
               <el-input v-model="dataInfo.code" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="禁用" class="flex-100" prop="disabled">
                <el-radio-group v-model="dataInfo.disabled">
                     <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/apiManage/Info/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/apiManage/Info/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/apiManage/Info/edit'"
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
           name:[required],
            url:[required],
            code:[required],
            disabled:[required],
      },
      checkRes:false,
    };
  },
     methods:{   
    
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.apiInfoGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((Webservice)=>{
                this.dataInfo=Webservice.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() { 
            this.updateDataInfo(this.$api.apiInfoUpdate, this.dataInfo, "list");
        },
        add(state) {                   
            this.saveDataInfo(state,this.$api.apiInfoSave, this.dataInfo, "list");       
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