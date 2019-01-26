<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" class="cms-form" label-width="162px">
        <!-- 网站名称 -->
        <el-form-item label="佣金总金额" class="flex-50 "  prop="commissionTotal">
          <el-input :disabled="true" class="cms-width" v-model="dataInfo.commissionTotal"> </el-input>
        </el-form-item>
         <el-form-item label="佣金年金额" class="flex-50 "  prop="commissionYear">
          <el-input :disabled="true" class="cms-width" v-model="dataInfo.commissionYear"> </el-input>
        </el-form-item>
         <el-form-item label="佣金月金额" class="flex-50 "  prop="commissionMonth">
          <el-input :disabled="true" class="cms-width" v-model="dataInfo.commissionMonth"> </el-input>
        </el-form-item>
         <el-form-item label="佣金日金额" class="flex-50 "  prop="commissionDay">
          <el-input :disabled="true" class="cms-width" v-model="dataInfo.commissionDay"> </el-input>
        </el-form-item>
       
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    return {
      
    };
  },
  methods: {
       getDataInfo() {//重写获取表单数据
        let api = this.$api; //API地址
        axios.post(this.$api.contentBuyCommissionStatic)
            .then(res => {
            this.loading = false;
            this.dataInfo = res.body; 
            }).catch(err => {
            this.loading = false;
            });
        },
  },
  created() {
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style>

</style>
