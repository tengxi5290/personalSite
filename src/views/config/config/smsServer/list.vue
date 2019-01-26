<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/smsServer/smsServer/add','save',0)"
              v-perms="'/smsServer/smsServer/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" :rules="rules" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
            <el-table-column prop="sourceName" label="短信运营商" align="center"></el-table-column>
            
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/smsServer/smsServer/edit','update',scope.row.id)"
                        v-perms="'/smsServer/smsServer/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.smsServerDelete,scope.row.id)"
                         v-perms="'/smsServer/smsServer/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.smsServerDelete,ids)"
                       v-perms="'/smsServer/smsServer/delete'"
                  >批量删除</el-button>
            </div>
             
          </div>   
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
    let required = va.required();
    let number = va.number();
    return {
      params: {//只需要业务参数    
        pageNo:'',
        pageSize:'',
      },
      rules: {
        //校验规则
        priority:[number],

      },
     regDefId:0
    };
  },methods:{
      checkP(value){
           let reg = /^[0-9]+$/;
            if (!reg.test(value)) {
                this.open();
            } else {
               
            }
      },
      open() {
        this.$alert('排列顺序不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {
              this.initTableData(this.$api.configRegisterItemList,this.params);   
          }
        });
      },
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.getRegRefId(res.body)
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },
      priorityBatch(url,ids,labels,Prioritys){
           this.$confirm('是否保存？', '警告', { type: "warning" })   
                .then(mes => {
                     this.$http.post(url,{ids:ids,priorities:Prioritys,labels:labels})
                    .then(res => {
                            if (res.code == "200") {
                                this.successMessage('保存成功!');
                                this.getTableData(this.params);
                            }
                        });
                    })
                    .catch(error => {});
            },
      getPriority(checkedList){
        let Prioritys=[];
        for (let i in checkedList) {
            Prioritys.push(checkedList[i].priority);
        }
        return Prioritys.join(",");     
      },
       getLabels(checkedList){
        let labels=[];
        for (let i in checkedList) {
            labels.push(checkedList[i].label);
        }
        return labels.join(",");
      },
    getRegRefId(obj){
       for(let a in obj){
           if(obj[a].regDef){
               this.regDefId =obj[a].id;
               break;
           }
       } 
    }

  },
  created(){
     this.initTableData(this.$api.smsServerList,this.params);   


  }
};
</script>

<style>

</style>
