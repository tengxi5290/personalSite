<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo"  class="cms-form" label-width="162px">
        <!-- 网站名称 -->
        <el-form-item label="提现账户" class="flex-50 "  prop="commissionTotal">
          <el-input :readonly='true'  class="cms-width" v-model="dataInfo.applyAccount"> </el-input>
        </el-form-item>
        <el-form-item label="" class="flex-50 "  >
        </el-form-item>
         <el-form-item label="提现金额" class="flex-50 "  prop="commissionYear">
          <el-input :readonly='true' class="cms-width" v-model="dataInfo.applyAmount"> </el-input>
        </el-form-item>
        <el-form-item label="" class="flex-50 "  >
        </el-form-item>
         <el-form-item label="密码" class="flex-50 "  prop="commissionMonth">
          <el-input  class="cms-width" v-model="dataInfo.password" type="password"> </el-input>
        </el-form-item>
        <el-form-item label="" class="flex-50 "  >
        </el-form-item>
          <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/drawApply/traAccount'"
                >转账</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
        </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    return {
      
    };
  },
  methods: {
       getDataInfo(id) {//重写获取表单数据
        let api = this.$api; //API地址
        axios.post(this.$api.accountPayPayByWXGet,{id:id})
            .then(res => {
            this.loading = false;
            this.dataInfo = res.body; 
            }).catch(err => {
            this.loading = false;
            });
        },
        update() {    
            this.dataInfo.drawId= this.dataInfo.id;
            this.updateDataInfo(this.$api.accountPayPayByWX, this.dataInfo, "list");
        },
        updateDataInfo(url, params, backUrl) {
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                    axios.post(url, params)
                        .then(res => {
                            this.loading = false;
                            if (res.code == "200") {
                                this.successMessage('修改成功');
                                if(backUrl==''){
                                    return false;
                                }else{
                                    setTimeout(() => {
                                        this.routerLink(backUrl);
                                    }, 1000);
                                }
                                
                            }else if(res.code == '304'){
                                 this.$alert(res.message, '提示', {
                                      confirmButtonText: '确定',type:'warning',
                                          callback: action => {
                                      }
                                  });
                            }
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
        },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>