<template>
    <section class="cms-body" v-loading="loading">
       
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
           
            <el-form-item label="是否开启" class="flex-50"  prop="open">
                <el-radio v-model="dataInfo.open" :label="'true'">打开</el-radio>
                <el-radio v-model="dataInfo.open" :label="'false'">关闭</el-radio>
            </el-form-item>          
            <el-form-item label="防火墙登录密码" class="flex-50"  prop="valPassword">
               <el-input v-model="dataInfo.valPassword" class="cms-width" type="password"></el-input>
            </el-form-item>
            <el-form-item label="防火墙密码" class="flex-50"  prop="password">
                 <el-input v-model="dataInfo.password" class="cms-width" type="password"></el-input>
                 <span class="gray">不修改请留空</span>
            </el-form-item>
            <el-form-item label="确认密码" class="flex-50" prop="confirmPassword">
                <el-input v-model="dataInfo.confirmPassword" class="cms-width" type="password"></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
             <el-form-item label="访问域名" class="flex-50"  prop="domain">
                 <el-input v-model="dataInfo.domain" class="cms-width"></el-input>          
            </el-form-item>
             <el-form-item label="指定来访ip" class="flex-50"  prop="ips">
                 <el-input v-model="dataInfo.ips" class="cms-width"></el-input>          
            </el-form-item>
            <el-form-item label="允许登录后台的时间" class="flex-100"  prop="hours">
                <el-checkbox-group v-model="dataInfo.hours" @change="getHours">
                    <el-checkbox v-for="(hour,index) in hoursList" :label="index" :key="index">{{hour}}</el-checkbox>
                </el-checkbox-group>          
            </el-form-item>
            <el-form-item label="允许登录后台的星期" class="flex-100"  prop="weeks">
                <el-checkbox-group v-model="dataInfo.weeks" @change="getWeeks">
                    <el-checkbox v-for="(week,index) in weekLiset" :label="index+1" :key="index">{{week}}</el-checkbox>
                </el-checkbox-group>          
            </el-form-item>
           
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/firewallUpdate'"
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
    function password() {
      return {
        validator: (rule, value, callback) => {
            self.$refs.form.validateField("confirmPassword");     
            callback();
        },
        trigger: "blur"
      };
    }
    function confirmPassword() {
      return {
        validator: (rule, value, callback) => {
          if (value !== self.dataInfo.password) {
            callback(new Error('前后密码不一致'));
          } else {
            callback();
          }
        },
        trigger: "blur"
      };
    }
    let required = va.required();
    let number = va.number();
    let spot='点';  
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:""
      },
      rules: {
        //校验规则
        password: [password()],
        confirmPassword: [confirmPassword()],
        valPassword:[required]

      },
      hoursList:[0+spot,1+spot,2+spot,3+spot,4+spot,5+spot,6+spot,7+spot,8+spot,9+spot,10+spot,11+spot,12+spot
       ,13+spot,14+spot,15+spot,16+spot,17+spot,18+spot,19+spot,20+spot,21+spot,22+spot,23+spot 
      ],
      weekLiset:[
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天',
      ],
      hours:[],
      weeks:[],
    };
  },
     methods:{
        getHours(value){
             this.hours= value;
        },
        getWeeks(value){
              this.weeks= value;
        },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.configFirewallGet), //axios批量发送请求
        ])
        .then(
            axios.spread((firewall)=>{
                this.dataInfo=firewall.body;
                this.dataInfo.password='';
                this.dataInfo.confirmPassword='';
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
        update() {
            let res={};
            for(let x in this.dataInfo){
                res[x]=this.dataInfo[x]
            }
            res.hours=res.hours.join(',');
            res.weeks=res.weeks.join(',');
             for(let i in res){
                if((typeof res[i])=='object'){
                    delete res[i]
                }
             } 
            console.log(this.dataInfo)
            console.log(res)   
            this.updateDataInfo(this.$api.configFirewallUpdate, res, "");
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