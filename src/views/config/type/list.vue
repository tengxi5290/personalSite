<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/type/add','save',0)"
              v-perms="'/type/add'"          
              >添加</el-button>
             <el-select v-model="params.containDisabled" @change="query">
                <el-option label="是否禁用" value=""></el-option>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
            </el-select>  
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="imgWidth" label="图片宽度" align="center"></el-table-column>
            <el-table-column prop="imgHeight" label="图片高度" align="center"></el-table-column>
            <el-table-column prop="hasImage" label="是否有图片" align="center">
                <div slot-scope='scope'>
                    <span v-if="scope.row.hasImage">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope='scope'>
                    <span v-if="scope.row.disabled">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
           

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/type/edit','update',scope.row.id)"
                        v-perms="'/type/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.typeDelete,scope.row.id)"
                     v-perms="'/type/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.typeDelete,ids)"
                   v-perms="'/type/delete'"  
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
        containDisabled:'',
      }
    };
  },
  created(){
     this.initTableData(this.$api.typeList,this.params);
  }
};
</script>
    
<style>

</style>