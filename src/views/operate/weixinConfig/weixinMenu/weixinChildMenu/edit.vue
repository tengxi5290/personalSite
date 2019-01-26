<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
             
            <el-form-item label="菜单名称" class="flex-50"  prop="name">
                <el-input  v-model="dataInfo.name" class="cms-width"></el-input>                 
            </el-form-item>  
            <el-form-item  class="flex-50"  >
            </el-form-item> 
            <el-form-item label="菜单类型" class="flex-50"  prop="type">
               <el-radio v-model="dataInfo.type" :label="'click'">点击事件</el-radio>
               <el-radio v-model="dataInfo.type" :label="'view'">URL事件</el-radio>                
            </el-form-item>      
            <el-form-item  class="flex-50"  >
            </el-form-item> 
             <el-form-item label="KEY" class="flex-50"  prop="key">
                <el-input  v-model="dataInfo.key" class="cms-width"></el-input>     
                <span class="gray">点击事件KEY(自定义回复关键字)</span>            
            </el-form-item> 
           <el-form-item  class="flex-50"  >
         </el-form-item> 
            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/weixinMenu/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/weixinMenu/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/weixinMenu/edit'"
                >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import listMixin from '@/mixins/list';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins,listMixin],
  data() {
    let self = this;
    let required = va.required('该项必填');
    return {
      params: {//只需要业务参数

      },
      parent:'',
      rules: {
        //校验规则
        name:[required],

        
      },
      checkRes:false,
    };
  },
     methods:{   
      getDataInfo(id){
        let api = this.$api; //API地址
        axios.all([
             axios.post(api.weixinMenuGet, {id:id}), //axios批量发送请求
        ]).then(
            axios.spread((type)=>{
                this.dataInfo=type.body;
                this.$refs["form"].resetFields();
                this.loading = false;
                if(id == 0 ){
                    this.dataInfo.type = 'click';
                }
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
    update() {      
        this.dataInfo.parentId=this.type;
        this.updateDataInfo(this.$api.weixinMenuUpdate, this.dataInfo, "list");
    },
    add(state) {  
        this.dataInfo.parentId=this.type;       
        this.saveDataInfo(state,this.$api.weixinMenuSave, this.dataInfo, "list");     
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
    this.parent=this.type;
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>