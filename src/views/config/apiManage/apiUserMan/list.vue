<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/apiManage/apiUserMan/add','save',0)"
              v-perms="'/apiManage/apiUserMan/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>      
            <el-table-column prop="system" label="系统" align="center"></el-table-column>
            <el-table-column prop="enable" label="启用" align="center">
                  <div slot-scope="scope">
                      <span v-if="scope.row.enable">是</span>
                      <span v-else>否</span>
                  </div>
            </el-table-column>
            
            

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/apiManage/apiUserMan/edit','update',scope.row.id)"
                        v-perms="'/apiManage/apiUserMan/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.apiWebserviceAuthDelete,scope.row.id)"
                     v-perms="'/apiManage/apiUserMan/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.apiWebserviceAuthDelete,ids)"
                     v-perms="'/apiManage/apiUserMan/delete'"  
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
        pageNo:'',
        pageSize:'',
      }
    };
  },
  created(){
     this.initTableData(this.$api.apiWebserviceAuthList,this.params);
  }
};
</script>
    
<style>

</style>