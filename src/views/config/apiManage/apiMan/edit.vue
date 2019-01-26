<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
         
            <el-form-item label="接口地址" class="flex-100"  prop="address">
               <el-input v-model="dataInfo.address" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="空间" class="flex-100"  prop="targetNamespace">
               <el-input v-model="dataInfo.targetNamespace" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="接口方法" class="flex-100"  prop="operate">
               <el-input v-model="dataInfo.operate" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="接口类型" class="flex-100"  prop="type">
                <el-select class="cms-width" v-model="dataInfo.type">
                    <el-option value="addUser" label="添加用户"></el-option>
                    <el-option value="updateUser" label="修改用户"></el-option>
                    <el-option value="deleteUser" label="删除用户"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="正确返回值" class="flex-100"  prop="successResult">
               <el-input v-model="dataInfo.successResult" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="参数列表" class="flex-100"  prop="params">
                <el-button @click="inc" type="primary"  icon="el-icon-plus">添加</el-button>
                        <table>
                            <tr>
                                <th style="color:#353535">参数名称</th>
                                <th style="color:#353535">默认值</th>
                                <th style="color:#353535">操作</th>
                            </tr>
                            <tr v-for="(item,index) in dataInfo.params" :key="index" style="padding-bottom:5px;">
                                <td><el-input class="cms-width" v-model="item.paramName"></el-input></td>
                                <td><el-input class="cms-width" v-model="item.defaultValue"></el-input></td>
                                <td><cms-button @click.native="del" type="delete"></cms-button></td>
                            </tr>
                        </table>
            </el-form-item>
            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/apiManage/apiMan/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/apiManage/apiMan/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/apiManage/apiMan/edit'"
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
    return {
      params: {//只需要业务参数

      },
      rules: {
          address:[required],
          type:[required],
      },
      checkRes:false,
      map:[],
    };
  },
     methods:{   
        inc(){
             let obj={
                 paramName:'',
                 defaultValue:''
             }
           this.map.push(obj);
         },
         del(index){
              this.map.splice(index,1)
         },
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.apiWebserviceGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((Webservice)=>{
                this.dataInfo=Webservice.body;
                this.map=Webservice.body.params;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() { 
          let paramNames=[];
          let defaultValues=[];
             for(let i in this.dataInfo.params){
                  defaultValues.push(this.dataInfo.params[i].defaultValue);  
                  paramNames.push(this.dataInfo.params[i].paramName);       
             }; 
            this.dataInfo.params=JSON.stringify(this.dataInfo.params)     
            for(let i in this.dataInfo){
                if((typeof this.dataInfo[i])=='object'){
                    delete this.dataInfo[i]
                }
             };                 
            this.updateDataInfo(this.$api.apiWebserviceUpdate, this.dataInfo, "list");
        },
        add(state) { 
            let paramNames=[];
          let defaultValues=[];
             for(let i in this.dataInfo.params){
                  defaultValues.push(this.dataInfo.params[i].defaultValue);  
                  paramNames.push(this.dataInfo.params[i].paramName);       
             };  
             this.dataInfo.params=JSON.stringify(this.dataInfo.params)       
            for(let i in this.dataInfo){
                if((typeof this.dataInfo[i])=='object'){
                    delete this.dataInfo[i]
                }
             };                                     
            this.saveDataInfo(state,this.$api.apiWebserviceSave, this.dataInfo, "list");       
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
                                this.getDataInfo(this.id);
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
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>