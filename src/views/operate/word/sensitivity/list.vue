<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
            <el-form  ref="form" :model="param" :rules="rules"  label-width="162px">
                  <el-row :gutter="10">
                      <el-col :span="6">
                            <el-form-item label="敏感词"  prop="search">
                               <el-input v-model="param.search"></el-input>
                            </el-form-item> 
                      </el-col>
                      <el-col :span="6">
                            <el-form-item label="替换为" prop="replacement">
                                  <el-input v-model="param.replacement" ></el-input>
                           </el-form-item>
                    </el-col>
                    <el-col :span="3">&nbsp;</el-col> 
                    <el-col :span="4">
                         <el-button type="primary"  icon="el-icon-plus" 
                              @click="add()" v-perms="'/word/Sensitivity/add'"   >添加
                           </el-button>
                     </el-col>
              </el-row>
            </el-form>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="search" label="敏感词" align="center"  >
               <div slot-scope="scope">  
                     <el-input v-model="scope.row.search" class="cms-width"></el-input>
                </div> 
            </el-table-column>
             <el-table-column align="center" width="50" >
            </el-table-column>
            <el-table-column prop="replacement" label="替换为" align="center"  >
                <div slot-scope="scope">  
                     <el-input v-model="scope.row.replacement" class="cms-width"></el-input>
                </div> 
            </el-table-column>

            <el-table-column label="操作"   align="center">
                <div slot-scope="scope">                  
                    <cms-button type="delete" @click.native="deleteBatch($api.wordSensitivityDelete,scope.row.id)"
                         v-perms="'/word/Sensitivity/delete'"
                    ></cms-button>                 
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.wordSensitivityDelete,ids)"
                        v-perms="'/word/Sensitivity/delete'"
                  >批量删除</el-button>
                 
                  <el-button :disabled="disabled" @click="save(ids)"
                        v-perms="'/word/Sensitivity/update'"
                  >保存内容</el-button>
            </div>
              
          </div>  
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import listMixin from '@/mixins/form';
import va from "@/rules";
import axios from "axios";
export default {
    mixins:[listMixins,listMixin],
  data() {
    let self = this;
    let required = va.required('此项必填');
    return {
      params: {//只需要业务参数    
      
      },
      rules: {//校验规则
        search:[required],
        replacement:[required],
      },
      param:{
          search:'',
          replacement:''
      }

    };
  },
  methods:{
      save(ids){
          let replacements=[];
          let searchs=[];
          let idss=[]
          for(let i in this.tableData){
              idss.push(this.tableData[i].id)
              replacements.push(this.tableData[i].replacement)
              searchs.push(this.tableData[i].search)
          }
           this.$http.post(this.$api.wordSensitivityUpdate,{replacements:replacements.join(','),
                  ids:idss.join(','),searchs:searchs.join(',')}).then(res => {
                    if(res.code == '200'){  
                          this.successMessage('保存成功');
                          this.initTableData(this.$api.wordSensitivityList,this.params);  
                          this.param.search='';  
                          this.param.replacement='';    
                    }   
                    this.loading = false;
            }).catch(error => {
                this.loading = false;
            })
      },
      add(){
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                    this.loading = true;
                     this.$http.post(this.$api.wordSensitivitySave,this.param).then(res => {
                            if(res.code == '200'){  
                                this.initTableData(this.$api.wordSensitivityList,this.params);  
                                this.param.search='';  
                                this.param.replacement='';    
                            }
                            this.loading = false;
                     }).catch(error => {
                        this.loading = false;
                      })   
                }else{
                     return false
                }
            })
      },
      update(){       
      },
  },
  created(){
     this.initTableData(this.$api.wordSensitivityList,this.params);   
  }
};
</script>

<style >

</style>
