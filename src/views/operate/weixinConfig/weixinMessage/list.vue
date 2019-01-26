<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/weixinMessage/add','save',0)"
              v-perms="'/weixinMessage/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
             <el-table-column prop="number" label="关键字" align="center"></el-table-column>
            

            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/weixinMessage/edit','update',scope.row.id)"
                        v-perms="'/weixinMessage/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.weixinMessageDelete,scope.row.id)"
                         v-perms="'/weixinMessage/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.weixinMessageDelete,ids)"
                       v-perms="'/weixinMessage/delete'"
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
      },

    };
  },methods:{
     

  },
  created(){
     this.initTableData(this.$api.weixinMessageList,this.params);   
  }
};
</script>

<style>

</style>
