<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    用户的编辑页面
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" 
        class="cms-form" label-width="162px">
        <el-form-item label="用户名" class="flex-50"  prop="username">
          {{dataInfo.username}}       
         </el-form-item>  
       <el-form-item label="电子邮箱" class="flex-50" prop="email">
               <el-input v-model="dataInfo.email" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="密码" class="flex-50" prop="password">
               <el-input v-model="dataInfo.password" class="cms-width" type="password"></el-input>              
                <span class="gray">留空不修改</span>
         </el-form-item>
       <el-form-item label="确认密码" class="flex-50" prop="confirmPassword">
               <el-input v-model="dataInfo.confirmPassword" class="cms-width" type="password"></el-input>
                <span class="gray">留空不修改</span>
         </el-form-item>
          <el-form-item label="会员组" class="flex-50" prop="groupId">
              <el-select v-model="dataInfo.groupId" class="cms-width">
               <el-option 
               v-for="(item,index) in memberGroup" 
               :key="index"
               :label="item.name"
               :value="item.id"
               ></el-option>
              </el-select>
         </el-form-item>       
          <el-form-item label="真实姓名" class="flex-50">
               <el-input v-model="dataInfo.realname" class="cms-width" ></el-input>              
         </el-form-item>     
       <el-form-item label="性别" class="flex-50">
                <el-radio-group v-model="dataInfo.gender">
                   <el-radio :label="true">男</el-radio>
                    <el-radio :label="false">女</el-radio>
                </el-radio-group>
         </el-form-item>
          <el-form-item label="出生日期" class="flex-50">
             <el-date-picker v-model="dataInfo.birthday" 
                              type="date" 
                               class="cms-width"
                               value-format="yyyy-MM-dd"
                               >
             </el-date-picker>           
         </el-form-item>
       <el-form-item label="来自" class="flex-50">
               <el-input v-model="dataInfo.comefrom" class="cms-width"></el-input>
         </el-form-item>
            <el-form-item label="QQ" class="flex-50" prop="qq">
               <el-input v-model.number="dataInfo.qq" class="cms-width"></el-input>
         </el-form-item>
           <el-form-item label="msn" class="flex-50">
               <el-input v-model="dataInfo.msn" class="cms-width"></el-input>
         </el-form-item>
           <el-form-item label="电话" class="flex-50" prop="phone">
               <el-input v-model="dataInfo.phone" class="cms-width"></el-input>
         </el-form-item>
         <el-form-item label="手机" class="flex-50" prop="mobile">
               <el-input v-model="dataInfo.mobile" class="cms-width"></el-input>
         </el-form-item>
       <el-form-item label="禁用" class="flex-100" prop="disabled">
             <el-radio-group v-model="dataInfo.disabled">
                   <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
         </el-form-item>

     <el-form-item label="描述" class="flex-100">
               <el-input v-model="dataInfo.intro" class="cms-width" type="textarea"></el-input>
         </el-form-item>
         <div class="form-footer">
               <el-button type="primary"  @click="update()">修改</el-button>
           <el-button type="info" @click="reset()">重置</el-button>
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
    let self = this;
    function password() {
      return {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          } else if (value.length<self.passwordMinLen) {
            callback(new Error('密码长度不能小于系统设定值:'+self.passwordMinLen));
          } else {
            if (self.dataInfo.confirmPassword !== "") {
              self.$refs.form.validateField("confirmPassword");
            }
            callback();
          }
        },
        trigger: "blur"
      };
    }
    function confirmPassword() {
      return {
        validator: (rule, value, callback) => {
          if (value === "" && self.dataInfo.password != '') {
            callback(new Error('请再次输入确认密码'));
          } else if (value !== self.dataInfo.password) {
            callback(new Error('前面密码不一致'));
          } else {
            callback();
          }
        },
        trigger: "blur"
      };
    }
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let email = va.email('请输入正确的邮箱地址');
    let validateName = va.validateName('用户名已存在');
    let tel = va.tel('请输入正确的固定电话');
    let mobile = va.mobile('请输入正确的手机号');
    return {
      memberGroup: [], //业务变量会员组
      passwordMinLen:'',
      rules: {
        //校验规则
        username: [required],
        email: [email],
        password: [password()],
        confirmPassword: [confirmPassword()],
        groupId: [required, number],
        grain: [required, number],
        phone: [tel],
        mobile: [mobile],
        disabled:[required]
      }
    };
  },
  methods: {
    // getDataInfo(id) {
    //   //重写获取表单数据
    //   let api = this.$api; //API地址
    //   axios
    //     .all([
    //       axios.post(api.memberGet, { id: id }), //axios批量发送请求
    //       axios.post(api.groupList)
    //     ])
    //     .then(
    //       axios.spread((data, memberGroup) => {
    //         this.dataInfo = data.body; //将用户数据复制给dataInfo
    //         this.dataInfo.password = ""; //密码
    //         this.dataInfo.confirmPassword = ""; //重复密码
    //         this.passwordMinLen=data.body.passwordMinLen;//最小密码长度
    //         if(this.dataInfo.gender===""){
    //           this.dataInfo.gender=true
    //         }

    //         this.memberGroup = memberGroup.body; //将用户组数据复制给dataInfo
    //         this.$refs["form"].resetFields();
    //         this.loading = false;
    //       })
    //     )
    //     .catch(err => {
    //       this.loading = false;
    //     });
    // },
    initUpdate (id) {
      axiosProxy
      .get(url + '/' + id)
      .then(res => {
        console.log('get table datas')
        console.log(res)
        if(res.data.errorCode == '0') {
          this.tableData = res.data.data
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      });
    },
    reset () {
      this.resetDataInfo(this.dataInfo)
    },
    update () {
      // this.updateDataInfo(this.$api.memberUpdate, this.dataInfo, "list");
    }
  },
  created() {
    //初始获取数据
    let id = this.$route.query.id
    console.log(id)

    // this.initUpdate(id, this.$api.)
    // this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>
