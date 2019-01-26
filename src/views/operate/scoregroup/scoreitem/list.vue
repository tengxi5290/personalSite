<template>
     <section v-loading="loading" class="cms-body">
     <!-- 返回组件 -->
        <cms-back></cms-back>
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/scoregroup/scoreitem/add',$route.query.id,0)"
              v-perms="'/scoregroup/scoreitem/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="groupName" label="分组名" align="center"></el-table-column>
            <el-table-column prop="name" label="评分文本" align="center"></el-table-column>
            
            <el-table-column prop="score" label="分值" align="center"></el-table-column>
            <el-table-column prop="priority" label="排列顺序" align="center"></el-table-column>
            <el-table-column prop="imagePath" label="图片路径" align="center"></el-table-column>
            
            
    
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/scoregroup/scoreitem/edit',$route.query.id,scope.row.id)"
                        v-perms="'/scoregroup/scoreitem/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.scoreitemDelete,scope.row.id)"
                     v-perms="'/scoregroup/scoreitem/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.scoreitemDelete,ids)"
                   v-perms="'/scoregroup/scoreitem/delete'"  
                  >批量删除</el-button>
                </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
     </section> 
</template>

<script>
import listMixin from '@/mixins/form';
import listMixins from '@/mixins/list';
export default {
    mixins:[listMixins,listMixin],
  data() {
    return {
      params: {//只需要业务参数
        groupId:'',
        pageNo:'',
        pageSize:'',
      }
    };
  },
  created(){
      console.log(this.id)
     this.params.groupId=this.id;
     this.initTableData(this.$api.scoreitemList,this.params);
  }
};
</script>
    
<style>

</style>