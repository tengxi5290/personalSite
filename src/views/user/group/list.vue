<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/group/add','save',0)"
              v-perms="'/group/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="allowPerDay" label="每日附件总尺寸" align="center"></el-table-column>
            <el-table-column prop="allowMaxFile" label="最大附件总尺寸" align="center"></el-table-column>
            <el-table-column label="排列顺序" align="center">
                <div slot-scope="scope">
                    <el-input v-model="scope.row.priority" @blur='checkP(scope.row.priority)' type='number' class="w50"></el-input>
                </div>        
            </el-table-column>
            <el-table-column label="默认组" align="center">
                <div slot-scope="scope">
                    <el-radio name="radio" v-model="regDefId" :label="scope.row.id">&nbsp;</el-radio>                 
                </div>      
            </el-table-column>
            <el-table-column prop="needCheck" label="评论需要审核" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.needCheck">是</span>
                    <span v-else>否</span>
                </div>  
            </el-table-column>
            <el-table-column prop="needCaptcha" label="评论需要验证码" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.needCaptcha">是</span>
                    <span v-else>否</span>
                </div>  
            </el-table-column>
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/group/edit','update',scope.row.id)"
                        v-perms="'/group/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.groupDelete,scope.row.id)"
                         v-perms="'/group/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.groupDelete,ids)"
                       v-perms="'/group/delete'"
                  >批量删除</el-button>
                 <el-button :disabled="disabled" @click.native="priorityBatch($api.groupPriority,ids,getPriority(checkedList),regDefId)"
                       v-perms="'/group/priority'"
                  >保存排列顺序</el-button> 
            </div>
             
          </div>   
     </section>   
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {//只需要业务参数    

      },
     regDefId:0
    };
  },methods:{
    //检查排列顺序不能为空且不能超过4位数
    checkP(value) {
      let reg = /^([1-9]\d{0,3}|0)$/
      if (!reg.test(value)) {
        this.open()
      } else {
      }
    },
    open() {
      this.$alert('排列顺序不能为空且不能超过4位数', '提示', {
        confirmButtonText: '确定',
        callback: action => {
           this.initTableData(this.$api.groupList,this.params);   
        }
      })
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
      getPriority(checkedList){
        let Prioritys=[];
        for (let i in checkedList) {
            Prioritys.push(checkedList[i].priority);
        }
        return Prioritys.join(",");
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
     this.initTableData(this.$api.groupList,this.params);   


  }
};
</script>

<style>

</style>
