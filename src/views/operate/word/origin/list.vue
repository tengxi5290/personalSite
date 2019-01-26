<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
             @click="dialogVisible = true"
              v-perms="'/word/origin/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
            <el-table-column prop="name" label="来源" align="left"></el-table-column>
           
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="edit(scope.row.name,scope.row.id)"
                        v-perms="'/word/origin/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.wordOriginDelete,scope.row.id)"
                         v-perms="'/word/origin/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.wordOriginDelete,ids)"
                        v-perms="'/word/origin/delete'"
                  >批量删除</el-button>
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
           <el-dialog title="来源管理-添加" :visible.sync="dialogVisible" width="30%"  :close-on-click-modal="false"  
            :before-close = "handleClose" >
                <span>
                     <el-form  ref="form" :model='param' :rules="rules" label-width="80px">
                        <el-form-item label="来源"  prop="name">
                            <el-input v-model="param.name" ></el-input>
                        </el-form-item>
                      </el-form>                    
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </span>
         </el-dialog> 
          <el-dialog title="来源管理-修改" :visible.sync="dialogVisible1" width="30%"  :close-on-click-modal="false"  
            :before-close = "handleClose" >
                <span>
                      <el-form ref="form1" :model='updateParam' :rules="rules"  label-width="80px">
                            <el-form-item label="来源"  prop="name">
                            <el-input v-model="updateParam.name" ></el-input>
                    </el-form-item>             
                      </el-form>                   
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">取消</el-button>
                    <el-button type="primary" @click="update">确定</el-button>
                </span>
         </el-dialog> 
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('该项必填'); 
    return {
      params: {//只需要业务参数    
        pageNo:'',
        pageSize:'',
      },
      rules: {//校验规则
        name:[required],
      },
      param:{
          name:'',
      },   
      dialogVisible: false,
      dialogVisible1: false,
      tapTipSave:false,
      updateParam:{
          id:'',
          name:'',
      },    
    };
  },
  methods:{
      save(){
           let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                    this.$http
                    .post(this.$api.wordOriginSave,{name:this.param.name})
                    .then(res => {
                        if(res.code=='200'){
                            this.dialogVisible=false;
                            this.successMessage("添加成功");
                        }
                        this.param.name='';
                        this.loading = false;
                    })
                    .catch(error => {
                        this.dialogVisible=false;
                        this.loading = false;
                    })    
                }else{
                     return false
                }
            })  
      },
      edit(name,value){
      //   this.$refs[this.updateParam.name].resetFields();
        this.updateParam.name=''; 
        this.updateParam.name=name;    
        this.updateParam.id=value;
        this.tapTipSave=false,
        this.dialogVisible1=true;

      },
      update(){    
            let form = this.$refs['form1'];
            form.validate((valid) => {//验证方法
                if(valid){
                    this.$http
                    .post(this.$api.wordOriginUpdate,{id:this.updateParam.id,name:this.updateParam.name})
                    .then(res => {
                         if(res.code=='200'){
                            this.dialogVisible1=false;
                            this.successMessage("添加成功");
                             this.initTableData(this.$api.wordOriginList,this.params);  
                        }
                        this.loading = false;
                    })
                    .catch(error => {
                        this.dialogVisible1=false;
                        this.loading = false;
                    })    
                }else{
                     return false
                }
            })  
      },
      handleClose(done) {
            done();
      }

  },
  created(){
     this.initTableData(this.$api.wordOriginList,this.params);   


  }
};
</script>

<style scoped>
    .el-dialog__body{
      min-height: 150px;
   }
</style>
