<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
                <cms-input v-model="params.queryUsername" label="用户名"></cms-input>
                <cms-input v-model="params.queryTitle" label="标题"></cms-input>
                <cms-input v-model="params.queryIp" label="IP"></cms-input>
                <label class="cms-label">日志类型</label> 
                <el-select v-model="params.category" @change="query">
                    <el-option label="操作日志" value="3"></el-option>
                    <el-option label="登录成功日志" value="1"></el-option>
                    <el-option label="登录失败日志" value="2"></el-option>
                </el-select>
                <el-button @click="query">查询</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column v-if="params.category!=2" prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="time" label="时间" align="center"></el-table-column>
            <el-table-column prop="ip" label="IP" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>  
            <el-table-column v-if="params.category!=1" prop="content" label="内容" align="center"></el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
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
        queryUsername: "",
        queryTitle: "",
        queryIp: "",
        category: "",
        pageNo:'',
        pageSize:'',      
      }
    };
  },
  created(){
     this.initTableData(this.$api.logList,this.params);
  }
};
</script>

</style>
