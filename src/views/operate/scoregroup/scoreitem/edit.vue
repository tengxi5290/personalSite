<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="评分文本" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item class="flex-50"  >
            </el-form-item> 
             <el-form-item label="分值" class="flex-50"  prop="score">
               <el-input v-model="dataInfo.score" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item class="flex-50"  >
            </el-form-item> 
             <el-form-item label="排列顺序" class="flex-50"  prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item class="flex-50"  >
            </el-form-item> 
             <el-form-item label="图片路径" class="flex-50"  prop="imagePath">
                <cms-upload :src='dataInfo.imagePath' @change='getPath' :isMark='false'></cms-upload>
            </el-form-item> 

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/scoreitem/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/scoreitem/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/scoreitem/edit'"
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
    let number = va.number('只能是正整数');
    return {
      params: {//只需要业务参数
            
      },
      rules: {
        //校验规则
        name:[required],
        priority:[required,number],
        score:[required,number],
      },
      
    };
  },
     methods:{  
        getPath(value){
           this.dataInfo.imagePath=value;  
        },     
        getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.scoreitemGet, {id:id}), //axios批量发送请求
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
            this.updateDataInfo(this.$api.scoreitemUpdate, this.dataInfo, "list");
        },
        add(state) {     
            this.dataInfo['groupId']=this.type; 
             this.saveDataInfo(state,this.$api.scoreitemSave, this.dataInfo, "list");
        },
        saveDataInfo(state, url, params, backUrl) {
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                    axios.post(url, params)
                        .then(res => {       
                            if (res.code == "200") {
                                this.successMessage('添加成功');
                                if (state) {
                                    this.reset();
                                } else {
                                    setTimeout(() => {
                                        this.routerLink(backUrl,'',this.type);
                                    }, 1000);
                                }
                            }
                            this.loading = false;
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
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
                                        this.routerLink(backUrl,'',this.type);
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