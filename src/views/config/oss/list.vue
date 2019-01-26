<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/oss/add','save',0)"
              v-perms="'/oss/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="备注名字" align="center"></el-table-column>
            <el-table-column prop="ossType" label="类型" align="center">
                <div slot-scope="scope">
                      <span v-if="scope.row.ossType===1">
                          腾讯云
                      </span>
                       <span v-if="scope.row.ossType===2">
                          阿里云
                      </span>
                       <span v-if="scope.row.ossType===3">
                          七牛云
                      </span>
                </div>            
            </el-table-column>
            <el-table-column prop="bucketName" label="Bucket名" align="center"></el-table-column>

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/oss/edit','update',scope.row.id)"
                        v-perms="'/oss/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.ossDelete,scope.row.id)"
                     v-perms="'/oss/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.ossDelete,ids)"
                   v-perms="'/oss/delete'"  
                  >批量删除</el-button>
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
       
      }
    };
  },
  created(){
     this.initTableData(this.$api.ossList,this.params);
  }
};
</script>
    
<style>

</style>