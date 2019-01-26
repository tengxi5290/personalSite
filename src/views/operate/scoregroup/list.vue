<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/scoregroup/add','save',0)"
              v-perms="'/scoregroup/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="分组名" align="center"></el-table-column>
            <el-table-column prop="def" label="默认分组" align="center">
                  <div slot-scope='scope'>
                      <span v-if='scope.row.def'>是</span>
                      <span v-else>否</span>
                  </div>
            </el-table-column>
            <el-table-column prop="enable" label="启用" align="center">
                  <div slot-scope='scope'>
                      <span v-if='scope.row.enable'>是</span>
                      <span v-else>否</span>
                  </div>
            </el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                         <button class="btn list" @click="routerLink('/scoregroup/scoreitem/list','1',scope.row.id)" title="查看评分项列表" v-perms="'/scoreitem/list'" ><i class="iconfont icon-gengduo"></i></button>
                          <button class="btn edit" @click="routerLink('/scoregroup/edit','update',scope.row.id)" title="修改" v-perms="'/scoreitem/edit'" ><i class="iconfont icon-weibiaoti101"></i></button>
                          <button class="btn delete" @click="deleteBatch($api.scoregroupDelete,scope.row.id)" title="修改" v-perms="'/scoreitem/delete'" ><i class="iconfont icon-shanchu1"></i></button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.scoregroupDelete,ids)"
                   v-perms="'/scoregroup/delete'"  
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
     this.initTableData(this.$api.scoregroupList,this.params);
  }
};
</script>
    
<style scoped>
  .cms-body table .btn {
    margin-top: 5px;
    display: inline-block;
    height: 24px;
    width: 24px;
    min-width: 0px;
    line-height: 24px;
    padding: 0px;
    font-size: 14px;
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .btn .iconfont{
  font-size: 14px;
  font-weight: 100;
  color: #ffffff;
}
.list{
 background-color: #409EFF;
}
.edit{
  background-color: #17D57E
}
.delete{
  background-color: #FF8B53;
}
.list:hover,
.delete:hover,
.edit:hover{
  cursor: pointer;
}
</style>