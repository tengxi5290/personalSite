<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
         
            <el-form-item label="用户名" class="flex-100"  prop="username">
               <el-input v-model="dataInfo.username" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="系统" class="flex-100"  prop="system">
               <el-input v-model="dataInfo.system" class="cms-width"></el-input>
            </el-form-item>
              <el-form-item label="密码" class="flex-50"  prop="password">
                  <el-input v-model="dataInfo.password" class="cms-width" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" class="flex-50"  prop="confirmPassword">
                <el-input v-model="dataInfo.confirmPassword" class="cms-width" type="password"></el-input>
              </el-form-item>    

            <el-form-item label="启用" class="flex-100">
                <el-radio-group v-model="dataInfo.enable">
                     <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>


            <div class="form-footer">
               <el-button type="warning" @click="add(true)"
                    v-perms="'/apiManage/apiUserMan/add'"
                >保存并继续添加</el-button>
                <el-button type="primary"  @click="add(false)"
                    v-perms="'/apiManage/apiUserMan/add'"
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
     let self=this;
    function password() {
      return {
        validator: (rule, value, callback) => {          
            self.$refs.form.validateField("confirmPassword");
            callback();
        },
        trigger: "blur"
      };
    };
    function confirmPassword() {
      return {
        validator: (rule, value, callback) => {
          if(value===undefined){
            value=''
          }
          if (value !== self.dataInfo.password) {
            callback(new Error('前后密码不一致'));
          } else {
            callback();
          }
        },
        trigger: "blur"
      };
    };
    let required = va.required();
    let number = va.number();
    return {
      params: {//只需要业务参数

      },
      rules: {
        system:[required],
        username:[required],
        password: [required,password()],
        confirmPassword: [required,confirmPassword()],

      },
      checkRes:false,
    };
  },
     methods:{   
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.apiWebserviceAuthGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((Webservice)=>{
                this.dataInfo=Webservice.body;
                this.dataInfo.password='';
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        add(state) {                     
            this.saveDataInfo(state,this.$api.apiWebserviceAuthSave, this.dataInfo, "list");       
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