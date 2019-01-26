<template>
    <section class="cms-body" v-loading="loading">
       <div class="cms-list-header">
               <el-button type="primary" 
              @click="routerLink('/siteConfig','update',0)"
              v-perms="'/siteConfig/edit'"          
              >基本设置</el-button>
         </div>


        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="公司名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>  
            <el-form-item label="公司规模" class="flex-50"  prop="scale">
               <el-select v-model='dataInfo.scale'>
                   <el-option v-for="(item,index) in scaleList" :key="index" :value="item.value">{{item.name}}</el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="公司性质" class="flex-50"  prop="nature">
               <el-select v-model='dataInfo.nature'>
                   <el-option v-for="(item,index) in natureList" :key="index" :value="item.value">{{item.name}}</el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="公司行业" class="flex-50"  prop="industry">
               <el-select v-model='dataInfo.industry'>
                   <el-option v-for="(item,index) in industryList" :key="index" :value="item.value">{{item.name}}</el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="公司地址" class="flex-100"  prop="address">
               <el-input v-model="dataInfo.address" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="公司联系方式" class="flex-100"  prop="contact">
                <el-input
                    type="textarea"
                    :rows="4"       
                    v-model="dataInfo.contact">
                 </el-input>
            </el-form-item>
            <el-form-item label="公司简介" class="flex-100"  prop="companyDescription">
                <el-input
                    type="textarea"
                    :rows="4"       
                    v-model="dataInfo.companyDescription">
                 </el-input>
            </el-form-item>

            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/companyUpdate'"
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
        name:[required],
        nature:[required],
        scale:[required],
        longitude:[required],
      },
        scaleList:[],
        natureList:[],
        industryList:[],

    };
  },
     methods:{
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configCompanyGet), //axios批量发送请求
             axios.post(api.dictionaryType,{type:'scale'}),
             axios.post(api.dictionaryType,{type:'nature'}),
             axios.post(api.dictionaryType,{type:'industry'}),
        ])
        .then(
            axios.spread((group,scale,nature,industry)=>{
                this.dataInfo=group.body;
                this.scaleList=scale.body;
                this.natureList=nature.body;
                this.industryList=industry.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
             this.updateDataInfo(this.$api.configCompanyUpdate, this.dataInfo, "");
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