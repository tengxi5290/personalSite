<template>
    <section v-loading="loading" class="cms-body">
    <cms-back></cms-back>
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/weixinMenu/child/add',params.parentId,0)"
              v-perms="'/weixinMenu/child/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
            
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/weixinMenu/child/edit',params.parentId,scope.row.id)"
                        v-perms="'/weixinMenu/child/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.weixinMenuDelete,scope.row.id)"
                         v-perms="'/weixinMenu/child/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.weixinMenuDelete,ids)"
                       v-perms="'/weixinMenu/child/delete'"
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
            parentId:'',
            pageNo:'',
            pageSize:'',
      },
     regDefId:0
    };
  },methods:{
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },

  },
  created(){

    this.params.parentId=this.$route.query.id;
    this.initTableData(this.$api.weixinMenuList,this.params);   


  }
};
</script>

<style>

</style>
