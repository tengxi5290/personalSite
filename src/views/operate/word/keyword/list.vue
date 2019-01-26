<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-form  ref="form" :model="param" :rules="rules"  label-width="162px">
                  <el-row :gutter="10">
                      <el-col :span="6">
                            <el-form-item label="关键字" prop="name">
                              <el-input v-model="param.name"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="10">
                              <el-form-item label="内容" prop="url">
                                  <el-input v-model="param.url" ></el-input>
                              </el-form-item>    
                    </el-col>
                    <el-col :span="3">&nbsp;</el-col> 
                    <el-col :span="4">
                          <el-button type="primary"     icon="el-icon-plus" @click="add()" v-perms="'/word/keyword/add'" >
                            添加
                          </el-button>
                     </el-col>
              </el-row>
            </el-form>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="关键字" align="center">
               <div slot-scope="scope">  
                     <el-input v-model="scope.row.name"></el-input>
                </div> 
            </el-table-column>
            <el-table-column width="50" align="center">
            </el-table-column>
            <el-table-column prop="url" label="内容" align="center">
                <div slot-scope="scope">  
                     <el-input v-model="scope.row.url"></el-input>
                </div> 
            </el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope="scope">                        
                     <el-checkbox v-model="scope.row.disabled"></el-checkbox>
                </div> 
            </el-table-column>
            <el-table-column label="操作"   align="center">
                <div slot-scope="scope">                  
                    <cms-button type="delete" @click.native="deleteBatch($api.wordKeywordDelete,scope.row.id)"
                         v-perms="'/word/keyword/delete'"
                    ></cms-button>                 
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.wordKeywordDelete,ids)"
                        v-perms="'/word/keyword/delete'"
                  >批量删除</el-button>
                 
                  <el-button :disabled="disabled" @click="save(ids)"
                        v-perms="'/word/keyword/update'"
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
    let required = va.required();
    let number = va.number();
    return {
      params: {//只需要业务参数    
      
      },
      rules: {//校验规则
        name:[required],
        url:[required],

      },
      param:{
          name:'',
          url:''
      }

    };
  },
  methods:{
      save(ids){
          let names=[];
          let urls=[];
          let idss=[];
          let disableds=[]

          for(let i in this.tableData){
              idss.push(this.tableData[i].id)
              names.push(this.tableData[i].name)
              urls.push(this.tableData[i].url)
              disableds.push(this.tableData[i].disabled)
          }
           this.$http.post(this.$api.wordKeywordUpdate,{names:names.join(','),
                  ids:idss.join(','),urls:urls.join(','),
                   disableds:disableds.join(',') 
              }).then(res => {
                   if(res.code == '200'){   
                        this.successMessage('保存成功');
                        this.initTableData(this.$api.wordKeywordList,this.params);
                    };  
                    this.loading = false;
            }).catch(error => {
                this.loading = false;
            })
      },
      add(){
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if(valid){
                         this.$http.post(this.$api.wordKeywordSave,this.param).then(res => {
                                if(res.code == '200'){   
                                    this.successMessage('添加成功');
                                    this.initTableData(this.$api.wordKeywordList,this.params);
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
     this.initTableData(this.$api.wordKeywordList,this.params);   
  }
};
</script>

<style>

</style>
