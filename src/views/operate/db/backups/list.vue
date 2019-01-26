<template>
     <section v-loading="loading" class="cms-body">

         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="name" label="表名" align="center">   
                 <div slot-scope="scope">
                      <a  @click="routerLink('/backups/seek',dbType,scope.row.name)">{{scope.row.name}}</a>
                 </div>
            </el-table-column>
             <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                      <a @click="routerLink('/backups/seek',dbType,scope.row.name)">查看</a>
                </div>
            </el-table-column>
        
        </el-table> 
         <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">  
                <cms-input label="备份文件编码格式" v-model="encoding"></cms-input>
                <span class="gray">一般win平台默认GBK linux默认UTF-8</span> 
                    
                 <el-button :disabled="disabled" @click.native="backup(names)"
                       v-perms="'/db/backup'"
                  >备份</el-button> 
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
      dbType:'', 
      names:'', 
      encoding:'GBK',
      params: {//只需要业务参数
          
      }
    };
  },methods:{
       getTableData(url) {//获取表格数据
            this.loading = true;
            this.$http
                .post(url)
                .then(res => {   
                    let re= [];     
                    for(let i in res.body){
                        let obj={name:""}
                        obj.name=res.body[i]
                        re.push(obj)
                    }       
                    this.tableData = re;  
                                 
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },
       backup(names){
        
           let url='';
          if(this.dbType==='mysql'){
                url=this.$api.mysqlDataBackup;
          }
          if(this.dbType==='oracle'){
              url=this.$api.oracleDataBackup;
          }
          if(this.dbType==='sqlserver'){
               url=this.$api.sqlserverDataBackup;
          }
          if(this.dbType==='db2'){
               url=this.$api.db2DataBackup;
          }

          this.loading=true;
          this.$http.post(url,{tableNames:names,encoding:this.encoding}).then(res=>{
             if(res.code=='200'){
                
                 this.successMessage('备份成功');
                 this.loading=false
             }
             
          })
       },
        checkIds(val) {
            let names = [];
            for (let i in val) {
                names.push(val[i].name);
            }
            this.names = names.join(",");
            this.disabled = val.length > 0 ? false : true;
        },
  },
  created(){
      this.$http.post(this.$api.frameGetDB).then(res=>{
          this.loading=false;
          this.dbType=res.body.db;
          if(res.body.db==='mysql'){
                this.getTableData(this.$api.mysqlDataList);
          }
          if(res.body.db==='oracle'){
                this.getTableData(this.$api.oracleDataList);
          }
          if(res.body.db==='sqlserver'){
                this.getTableData(this.$api.sqlserverDataList);
          }
          if(res.body.db==='db2'){
                this.getTableData(this.$api.db2DataList);
          }
      });

  }
};
</script>

</style>
