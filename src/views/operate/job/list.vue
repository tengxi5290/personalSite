<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
                <cms-input v-model="params.title" label="申请职位"></cms-input>
                <el-button @click="query">查询</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="contentTitle" label="职位申请" align="center">
                    <div slot-scope="scope">
                         <a class="link" :href="scope.row.contentURL" title="申请职位" target="_blank">{{scope.row.contentTitle}}</a> 
                     </div>
            </el-table-column> 
            <el-table-column prop="username" label="申请用户" align="center"></el-table-column> 
            <el-table-column prop="applyTime" label="申请时间" align="center"></el-table-column> 
            <el-table-column  label="简历" align="center">
                <div slot-scope="scope">
                    <a @click="routerLink('/job/seek',scope.row.userId,scope.row.contentId)"  class="link">查看</a>
                </div>
            </el-table-column> 
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="delete" @click.native="deleteBatch($api.jobapplyDelete,scope.row.id)"
                         v-perms="'/job/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
        </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                 <el-button :disabled="disabled" @click="deleteBatch($api.jobapplyDelete,ids)"
                        v-perms="'/job/delete'"
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
        title:'',
        pageNo:'',
        pageSize:'',      
      }
    };
  },methods:{
    
  },
  created(){
     this.initTableData(this.$api.jobapplyList,this.params);
    
  }
};
</script>

</style>
