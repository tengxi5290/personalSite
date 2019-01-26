<template>
     <section v-loading="loading" class="cms-body">
    <cms-back></cms-back>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
           
            <el-table-column prop="name" label="表名" align="center"></el-table-column>
            <el-table-column prop="fieldType" label="字段类型" align="center"></el-table-column>
            <el-table-column prop="fieldProperty" label="字段属性" align="center"></el-table-column>
            <el-table-column prop="fieldDefault" label="默认值" align="center"></el-table-column>
            <el-table-column prop="extra" label="附加属性" align="center"></el-table-column>

            
        </el-table> 
        
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
  },methods:{
       getTableData(url) {//获取表格数据
            this.loading = true;
            this.$http
                .post(url,{tablename:this.$route.query.id})
                .then(res => {        
                    this.tableData = res.body;                  
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },
  },
  created(){  
        console.log(this.$route.query.type)
          if(this.$route.query.type==='mysql'){
                this.getTableData(this.$api.mysqlDataListfields);
          }
          if(this.$route.query.type==='oracle'){
                this.getTableData(this.$api.oracleDataListfields);
          }
          if(this.$route.query.type==='sqlserver'){
                this.getTableData(this.$api.sqlserverDataListfields);
          }
          if(this.$route.query.type==='db2'){
                this.getTableData(this.$api.db2DataListfields);
          }
  }
};
</script>

</style>
