<template>
    <section class="cms-body" v-loading="loading">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click.native="add"     
              >添加</el-button>
         </div>
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="是否开启单点登录" class="flex-100"  prop="attr_ssoEnable">
                <el-radio v-model="dataInfo.attr_ssoEnable" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.attr_ssoEnable" :label="false">否</el-radio>
            </el-form-item>       
            <el-form-item label="认证地址" class="flex-100" prop="attrs">                  
                    <span v-for="(item,index) in dataInfo.attrs" :key="index">
                        <el-input v-model="item.value" class="cms-width"  style="margin-bottom:22px;"></el-input>
                        <cms-button @click.native="del(index)" type="delete"></cms-button>
                    </span> 
            </el-form-item>               

            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/apiManage/apiSSOupdate'"
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
    return {
      params: {//只需要业务参数
       
      },
      map:[],
      rules: {
        //校验规则
      },
      
    };
  },
     methods:{
         add(){
             let obj={
                 key:'',
                 value:''
             }
           this.map.push(obj);
         },
         del(index){
              this.map.splice(index,1)
         },
         getPath(value){
           this.dataInfo.imagePath=value;  
         },
        getDataInfo(){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.apiSSOGet), //axios批量发送请求
        ])
        .then(
            axios.spread((mark)=>{
                this.dataInfo=mark.body;
                this.map=mark.body.attrs;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
        },
         update() {    
            for(let i in this.dataInfo.attrs){
                let va='attr_sso_'+(i+1);
                 this.dataInfo[va]=this.dataInfo.attrs[i].value;
                
             };       
            for(let i in this.dataInfo){
                if((typeof this.dataInfo[i])=='object'){
                    delete this.dataInfo[i]
                }
             }   
             this.updateDataInfo(this.$api.apiSSOupdate, this.dataInfo, "");
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
                                 this.getDataInfo();
                                if(backUrl==''){
                                    return false;
                                }else{
                                    setTimeout(() => {
                                        this.routerLink(backUrl);
                                    }, 1000);
                                }       
                            }
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
        },
         
  },
  created(){
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style>

</style>