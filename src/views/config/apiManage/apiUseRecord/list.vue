<template>
     <section v-loading="loading" class="cms-body">
          <div class="cms-list-header">
           
          </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="serviceCode" label="操作" align="center"></el-table-column>
            <el-table-column prop="authUsername" label="用户名" align="center"></el-table-column>
            <el-table-column prop="authSystem" label="系统" align="center"></el-table-column>
            <el-table-column prop="authUsername" label="时间" align="center"></el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">      
                     <cms-button type="delete" @click.native="deleteBatch($api.apiWebserviceRecordDelete,scope.row.id)"
                     v-perms="'/apiManage/apiUseRecord/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                    <el-button :disabled="disabled" @click="deleteBatch($api.apiWebserviceRecordDelete,ids)"
                       v-perms="'/apiManage/apiUseRecord/delete'"
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
     this.initTableData(this.$api.apiWebserviceRecordList,this.params);
  }
};
</script>
    
<style>

</style>