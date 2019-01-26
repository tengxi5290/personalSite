<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
             @click="dialogVisible = true"
              v-perms="'/word/searchwords/add'"          
              >添加</el-button>

               <cms-input v-model='params.qname' label="热词"></cms-input>
                <label  class="cms-label">是否推荐</label> 
             <el-select v-model="params.qrecommend" @change="query">
                <el-option label="所有" :value="2"></el-option>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
            </el-select>
             <label  class="cms-label">排列顺序</label> 
             <el-select v-model="params.orderBy" @change="query">
                <el-option label="搜索次数降序" :value="1"></el-option>
                <el-option label="搜索次数升序" :value="2"></el-option>
                <el-option label="排序降序" :value="3"></el-option>
                <el-option label="排序升序" :value="4"></el-option>
            </el-select>
               <el-button @click="query">查询</el-button> 
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="热词" align="center"></el-table-column>
            <el-table-column prop="hitCount" label="搜索次数" align="center"></el-table-column>
           <el-table-column prop="priority" label="排列顺序" align="center"></el-table-column>
           <el-table-column prop="recommend" label="是否推荐" align="center">
                <div slot-scope="scope">
                    <span v-if='scope.row.recommend'>是</span>
                     <span v-else>否</span>
                </div>
           </el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="edit(scope.row.name,scope.row.priority,scope.row.recommend,scope.row.id)"
                        v-perms="'/word/searchwords/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.wordSearchwordsDelete,scope.row.id)"
                         v-perms="'/word/searchwords/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.wordSearchwordsDelete,ids)"
                        v-perms="'/word/searchwords/delete'"
                  >批量删除</el-button>
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
          <el-dialog
                title="热词管理 - 添加"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <span>
                     <el-form ref="form" :model='addParam' :rules="rules"  label-width="80px">  
                            <el-form-item label="热词"  prop="name" >
                                <el-input v-model="addParam.name" ></el-input>
                            </el-form-item>
                            <el-form-item label="排序"  prop="priority">
                                <el-input v-model="addParam.priority"  type='number'></el-input>
                            </el-form-item>
                            <el-form-item label="是否推荐"  prop="recommend">
                                <el-radio v-model="addParam.recommend" label="true">是</el-radio>
                                <el-radio v-model="addParam.recommend" label="false">否</el-radio>
                            </el-form-item>
                      </el-form>                    
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel('form')">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </span>
         </el-dialog> 
          <el-dialog
                title="热词管理 - 修改"
                :visible.sync="dialogVisible1"
                width="30%"
                :close-on-click-modal="false"
                :before-close = "handleClose"
                >
                <span>
                      <el-form ref="form1" :model='updateParam' :rules="rules"  label-width="80px">
                             <el-form-item label="热词"  prop="name">
                                <el-input v-model="updateParam.name" ></el-input>
                            </el-form-item>
                            <el-form-item label="排序"  prop="priority">
                                <el-input v-model="updateParam.priority" type='number'></el-input>
                            </el-form-item>
                            <el-form-item label="是否推荐"  prop="recommend">
                                <el-radio v-model="updateParam.recommend" :label="true">是</el-radio>
                                <el-radio v-model="updateParam.recommend" :label="false">否</el-radio>
                            </el-form-item>          
                      </el-form>                   
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel('form1')">取消</el-button>
                    <el-button type="primary" @click="update">确定</el-button>
                </span>
         </el-dialog> 
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import va from "@/rules";
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('该项必填');     
    let number = va.number('');     
    return {
      params: {//只需要业务参数    
        pageNo:'',
        pageSize:'',
        qname:"",
        qrecommend:'',
        orderBy:''

      },
      rules: {//校验规则
        name:[required],
        priority:[required,number],
        recommend:[required],
      },
      addParam:{
        name:'',
        priority:'',
        recommend:'',
      },
      updateParam:{
        id:'',
        name:'',
        recommend:'',
        priority:'',  
      },
      dialogVisible: false,
      dialogVisible1: false,
      tapTipSave:false, 
    };
  },
  methods:{
      save(){
          let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                      this.$http
                    .post(this.$api.wordSearchwordsSave,this.addParam)
                    .then(res => {
                        if(res.code == '200'){
                            this.dialogVisible=false;
                            this.successMessage('添加成功');
                            this.initTableData(this.$api.wordSearchwordsList,this.params);
                            this.addParam.name='';
                            this.addParam.priority='';
                            this.addParam.recommend='';
                        }
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
      cancel(formName){
          this.$refs[formName].resetFields(); 
          if (formName==='form1') {
              this.dialogVisible1=false;     
          }else{
              this.dialogVisible=false;     
          }
      },
      edit(name,priority,recommend,value){
      //   this.$refs[this.name].resetFields();
        this.updateParam.name=''; 
        this.updateParam.name=name;
        this.updateParam.priority='';  
        this.updateParam.priority=priority;
        this.updateParam.recommend='';
        this.updateParam.recommend=recommend;
        this.updateParam.id=value;
        this.tapTipSave=false,
        this.dialogVisible1=true;

      },
      update(){   
          let form = this.$refs['form1'];
            form.validate((valid) => {//验证方法
                if(valid){
                     this.$http
                    .post(this.$api.wordSearchwordsUpdate,this.updateParam)
                    .then(res => {
                        if(res.code == '200'){
                            this.dialogVisible1=false;    
                            this.successMessage('修改成功');
                            this.initTableData(this.$api.wordSearchwordsList,this.params);
                        }
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
      handleClose(done) {
        this.$confirm('你确定要关闭吗?')
          .then(_ => {  
            done();
          })
          .catch(_ => {});
      }

  },
  created(){
     this.initTableData(this.$api.wordSearchwordsList,this.params);   


  }
};
</script>

<style scoped>
  .el-dialog__body{
      min-height: 150px;
   }
</style>
