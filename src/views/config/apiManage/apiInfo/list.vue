<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/apiManage/apiInfo/add','save',0)"
              v-perms="'/apiManage/apiInfo/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="url" label="地址" align="center"></el-table-column>

            <el-table-column prop="code" label="接口代码" align="center"></el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.disabled">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
            <el-table-column prop="callTotalCount" label="调用总次数" align="center"></el-table-column>
            <el-table-column prop="callMonthCount" label="月调用次数" align="center"></el-table-column>
            <el-table-column prop="callWeekCount" label="周调用次数" align="center"></el-table-column>
            <el-table-column prop="callDayCount" label="日调用次数" align="center"></el-table-column>



            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/apiManage/apiInfo/edit','update',scope.row.id)"
                        v-perms="'/apiManage/apiInfo/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.apiInfoDelete,scope.row.id)"
                     v-perms="'/apiManage/apiInfo/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.apiInfoDelete,ids)"
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
  
      }
    };
  },
  created(){
     this.initTableData(this.$api.apiInfoList,this.params);
  }
};
</script>
    
<style>

</style>