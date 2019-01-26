<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
             @click="dialogVisible = true"
              v-perms="'/word/tag/add'"          
              >添加</el-button>
              <cms-input v-model="params.queryName" label="名称"></cms-input>
              <el-button @click="query">查询</el-button> 
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="left"></el-table-column>
            <el-table-column prop="count" label="文档数" align="right"></el-table-column>

            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="edit(scope.row.name,scope.row.id)"
                        v-perms="'/word/tag/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.wordTagDelete,scope.row.id)"
                         v-perms="'/word/tag/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.wordTagDelete,ids)"
                        v-perms="'/word/tag/delete'"
                  >批量删除</el-button>
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
          <el-dialog title="Tag管理 - 添加"  :visible.sync="dialogVisible"  width="30%"  :before-close="handleClose">
                <span>
                     <el-form ref='form' :model='addParams' :rules="rules" label-width="80px"  >
                            <el-form-item label="名称"  prop="name">
                                <el-input v-model="addParams.name" ></el-input>
                            </el-form-item>
                      </el-form>  
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </span>
         </el-dialog> 
          <el-dialog  title="Tag管理 - 修改"  :visible.sync="dialogVisible1"  width="30%"  :close-on-click-modal="false"   :before-close = "handleClose" >
                <span>
                      <el-form ref='form1' :model='updateParams' :rules="rules"  label-width="80px" >
                            <el-form-item label="名称"  class="flex-100" prop="updateName">
                                <el-input v-model="updateParams.updateName"  class="cms-width"></el-input>
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
import va from "@/rules";
import api from "@/api/api";
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let checkTagName =  va.checkTagName('');
    let required = va.required('此项必填');
    return {
      params: {//只需要业务参数    
        queryName:'',
        pageNo:'',
        pageSize:'',
      },
       rules: {//校验规则
        name:[required,checkTagName],
        updateName:[required],
      },
      addParams:{
           name:'',
      },  
      updateParams:{
        updateId:'',
        updateName:'',  
      },
      dialogVisible: false,
      dialogVisible1: false,
      tapTipSave:false,
     
     regDefId:0
    };
  },
  methods:{
      save(){
           let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                         this.$http.post(this.$api.wordTagSave,{name:this.addParams.name}) .then(res => {
                            this.dialogVisible=false; 
                            if(res.code == '200'){
                                this.addParams.name = '';
                                this.successMessage('添加成功');
                                this.initTableData(this.$api.wordTagList,this.params); 
                            }
                            this.loading = false;
                        }).catch(error => {
                            this.dialogVisible=false;
                            this.loading = false;
                        })
                }else{
                     return false;
                }
            })
      },
      edit(name,value){
        this.updateParams.updateName=''; 
        this.updateParams.updateName=name;    
        this.updateParams.updateId=value;
        let  rule =   [ va.required('此项必填')];
        rule.push(va.checkTagName(value));
        this.rules.updateName  =rule;
        this.tapTipSave=false,
        this.dialogVisible1=true;

      },
      update(){   
           let form = this.$refs['form1'];
            form.validate((valid) => {//验证方法
                if(valid){ 
                    this.$http.post(this.$api.wordTagUpdate,{id:this.updateParams.updateId,name:this.updateParams.updateName}).then(res => {
                        this.dialogVisible1=false;
                        if(res.code == '200'){
                            this.successMessage('修改成功')
                            this.updateParams.updateId = '';
                            this.initTableData(this.$api.wordTagList,this.params); 
                        }
                        this.loading = false;
                    }).catch(error => {
                        this.dialogVisible=false;
                        this.loading = false;
                    })
                }else{
                     return false
                }
            })         
      },
      handleClose(done) {
            this.updateParams.updateId = '';
            done();
      }
  },
  created(){
     this.initTableData(this.$api.wordTagList,this.params);   
  }
};
</script>
<style scoped>
  .el-dialog__body{
      min-height: 150px;
  }
</style>
