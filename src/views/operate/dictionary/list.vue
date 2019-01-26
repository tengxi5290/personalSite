<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
             @click="add"
              v-perms="'/dictionary/add'"          
              >添加</el-button>


             <el-select v-model="params.queryType" @change="query">
                <el-option label="所有" value=""></el-option>
                <el-option label="scale" value="scale"></el-option>
                <el-option label="nature" value="nature"></el-option>
                <el-option label="industry" value="industry"></el-option>
            </el-select>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="value" label="值" align="center"></el-table-column>
           <el-table-column prop="type" label="分类" align="center"></el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="edit(scope.row.name,scope.row.type,scope.row.value,scope.row.id)"
                        v-perms="'/dictionary/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.dictionaryDelete,scope.row.id)"
                         v-perms="'/dictionary/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.dictionaryDelete,ids)"
                        v-perms="'/dictionary/delete'"
                  >批量删除</el-button>
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
          <el-dialog  title="字典 - 添加"  :visible.sync="dialogVisible"  width="27%"  :before-close="handleClose">
                <span>
                     <el-form ref="form"  label-width="80px"   :model='addParam' :rules="rules">                        
                           <el-form-item label="分类"  prop="type">
                                <el-input v-model="addParam.type" class="cms-width"></el-input>
                            </el-form-item>
                            <el-form-item label="名称"  prop="name">
                                <el-input v-model="addParam.name" class="cms-width"></el-input>
                            </el-form-item>
                            <el-form-item label="值"  prop="value">
                                <el-input v-model="addParam.value" class="cms-width"></el-input>
                                <span v-show="updateCheck" class="red">所属分类已有此值</span>    
                            </el-form-item>
                      </el-form>                    
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="check">确定</el-button>
                </span>
         </el-dialog> 
          <el-dialog title="字典 - 修改" :visible.sync="dialogVisible1"  width="30%"  :close-on-click-modal="false"  :before-close = "handleClose" >
                <span>
                      <el-form ref='form1' :model='updateParam' :rules="rules"  label-width="80px"   >
                            <el-form-item label="分类"  prop="type">
                                <el-input v-model="updateParam.type" class="cms-width"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="updateParam.name" class="cms-width"></el-input>
                            </el-form-item>
                            <el-form-item label="值"  prop="value">
                                <el-input v-model="updateParam.value" class="cms-width"></el-input>
                                <span v-show="updateCheck" class="red">所属分类已有此值</span>    
                            </el-form-item>      
                      </el-form>                   
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">取消</el-button>
                    <el-button type="primary" @click="checkUpdate">确定</el-button>
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
    let required = va.required('此项必填');
    return {
      params: {//只需要业务参数    
        pageNo:'',
        pageSize:'',
        queryType:'',

      },
      rules: {//校验规则
        name:[required],
        type:[required],
        type:[required],
        name:[required],
      },
      addParam:{
        name:'',
        type:'',
        value:'',
      },
      updateParam:{
        id:'',
        name:'',
        value:'',
        type:'',      
      },
      dialogVisible: false,
      dialogVisible1: false,
      tapTipSave:false,
      updateCheck:false,
      addCheck:false,
    };
  },
  methods:{
      check(){
           this.$http
            .post(this.$api.dictionaryCheckValue,{type:this.addParam.type,value:this.addParam.value})
            .then(res => {
                if(!res.body.result){
                    this.addCheck=false;
                    this.save();
                }else{
                    this.addCheck=true;       
                }
                this.loading = false;
            })
            .catch(error => {
                this.dialogVisible=false;
                this.loading = false;
            })
      },
      add(){
         this.addParam.type='';
         this.addParam.name='';
         this.addParam.value=''; 
         this.updateCheck=false;
         this.dialogVisible = true;   
      },
      checkUpdate(){
           this.$http
            .post(this.$api.dictionaryCheckValue,{type:this.updateParam.type,value:this.updateParam.value})
            .then(res => {
                if(!res.body.result){
                    this.updateCheck=false;
                    this.update();
                }else{
                    this.updateCheck=true;       
                }
                this.loading = false;
            })
            .catch(error => {
                this.dialogVisible=false;
                this.loading = false;
            })
      },
      save(){
             let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                     this.$http
                    .post(this.$api.dictionarySave,this.addParam)
                    .then(res => {
                        if(res.message==='成功!'){
                            this.dialogVisible=false;
                            this.initTableData(this.$api.dictionaryList,this.params); 
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
      edit(name,type,value,id){
      //   this.$refs[this.name].resetFields();
        this.updateParam.name=''; 
        this.updateParam.name=name;
        this.updateParam.type='';  
        this.updateParam.type=type;
        this.updateParam.value='';
        this.updateParam.value=value;
        this.updateParam.id=id;
        this.tapTipSave=false,
        this.updateCheck=false,
        this.dialogVisible1=true;

      },
      update(){      
           let form = this.$refs['form1'];
            form.validate((valid) => {//验证方法
                if(valid){
                     this.$http
                    .post(this.$api.dictionaryUpdate,this.updateParam)
                    .then(res => {
                        if(res.message==='成功!'){
                            this.dialogVisible1=false;
                            this.initTableData(this.$api.dictionaryList,this.params); 
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
            done();
      }
  },
  created(){
     this.initTableData(this.$api.dictionaryList,this.params);   
  }
};
</script>
