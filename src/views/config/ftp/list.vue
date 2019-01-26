<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/ftp/add','save',0)"
              v-perms="'/ftp/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="ip" label="服务器IP" align="center"></el-table-column>
            <el-table-column prop="path" label="远程目录" align="center"></el-table-column>
            <el-table-column prop="url" label="地址" align="center"></el-table-column>   

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/ftp/edit','update',scope.row.id)"
                        v-perms="'/ftp/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.ftpDelete,scope.row.id)"
                     v-perms="'/ftp/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.ftpDelete,ids)"
                   v-perms="'/ftp/delete'"  
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
     this.initTableData(this.$api.ftpList,this.params);
  }
};
</script>
    
<style>

</style>