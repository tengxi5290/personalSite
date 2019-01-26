<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/apiManage/apiMan/add','save',0)"
              v-perms="'/apiManage/apiMan/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="address" label="接口地址" align="center"></el-table-column>
          
            <el-table-column prop="targetNamespace" label="空间" align="center"></el-table-column>
            <el-table-column prop="successResult" label="正确返回值" align="center"></el-table-column>
            <el-table-column prop="type" label="接口类型" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.type==='addUser'">添加用户</span>
                    <span v-if="scope.row.type==='updateUser'">修改用户</span>
                    <span v-if="scope.row.type==='deleteUser'">删除用户</span>
                </div>   
            </el-table-column>
            <el-table-column prop="operate" label="接口方法" align="center"></el-table-column>
          
           

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/apiManage/apiMan/edit','update',scope.row.id)"
                        v-perms="'/apiManage/apiMan/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.apiWebserviceDelete,scope.row.id)"
                     v-perms="'/apiManage/apiMan/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.apiWebserviceDelete,ids)"
                     v-perms="'/apiManage/apiMan/delete'"  
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
        defaultValue:'',
        paramName:'',
      }
    };
  },
  created(){
     this.initTableData(this.$api.apiWebserviceList,this.params);
  }
};
</script>
    
<style>

</style>