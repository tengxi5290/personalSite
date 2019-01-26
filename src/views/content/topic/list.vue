<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/topic/save','save',0)"
              v-perms="'/topic/save'"
              >添加</el-button>
          
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
              <el-table-column prop="name" label="专题名称" width="180" align="left"></el-table-column>
              <el-table-column prop="priority" label="排列顺序"  align="center"> 
                 <div slot-scope="scope">
                      <el-input v-model="scope.row.priority" type="number" class="w50"></el-input>
                 </div>
              </el-table-column>
              <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/topic/update','update',scope.row.id)"
                        v-perms="'/topic/update'"
                    
                    ></cms-button>
                     <cms-button type="delete" @click.native="deleteBatch($api.topicDelete,scope.row.id)"
                       v-perms="'/topic/delete'"
                     ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">          
                        <el-button :disabled="disabled" @click="priorityBatch($api.topicPriority,ids)"
                    v-perms="'/topic/priority'"                  
                  >保存排序</el-button>       
                  <el-button :disabled="disabled" @click="deleteBatch($api.topicDelete,ids)"
                    v-perms="'/topic/delete'"                  
                  >批量删除</el-button>
                </div>
                <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
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
        pageNo: "",
        pageSize: ""
      }
    };
  },
  methods:{
        priorityBatch(url) { //保存排列循序
        let params={
            ids:this.ids,
            priorities:[]
        }
        for(let i in this.checkedList){
            params.priorities.push(this.checkedList[i].priority);
        }
        
         params.priorities=params.priorities.join(',');
            this.$confirm('是否保存?', '提示', { type: "warning" })   
                .then(mes => {
                    this.$http.post(url, params).then(res => {
                        if (res.code == "200") {
                            this.successMessage('操作成功');
                            this.getTableData(this.params);
                        }
                    });
                })
                .catch(error => {});
        },
  },
  created(){
     this.initTableData(this.$api.topicList,this.params);
  }
};
</script>

<style>

</style>
