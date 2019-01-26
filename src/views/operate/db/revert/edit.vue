<template>
    <section class="cms-body" v-loading="loading">
        <el-form  ref="form" class="cms-form" label-width="162px">
              <el-form-item label="/WEB-INF/backup/"  class="flex-50  importDb" >
                <el-input  v-model="filename"  class="cms-width"> </el-input>
                <span class="gray">恢复后建议重启web服务器</span>
               <el-button class="improt-btn" type="primary" plain @click="choose()" >选择文件</el-button>
              </el-form-item>
              <el-form-item   class="flex-50 " ></el-form-item>
              <el-form-item label="数据库名称"  class="flex-50 " >
                  <el-select  class="cms-width" v-show="selectSta" v-model="db">
                    <el-option v-for="(item,index) in dbList" :key="index" :value="item" :label="item">{{item}}</el-option>
                 </el-select>
              </el-form-item>
              <div class="form-footer">
                  <el-button type="primary"  @click="revert()" v-perms="'/db/revert'"  >恢复</el-button>
              </div>
        </el-form>
        <el-dialog title="选择文件" :visible.sync="dialogTableVisible" width="30%"   >
            <el-table :data="gridData" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column property="filename" label="文件名" width="250">
                    <div slot-scope="scope">
                        {{scope.row.filename}}
                    </div>
                </el-table-column>
                <el-table-column property="size" label="大小" width="100"></el-table-column>
                <el-table-column property="lastModifiedDate" label="最后修改时间"></el-table-column>
            </el-table>
        </el-dialog>
    </section>       
</template>
<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      dbType:'', 
      filename:'',
      selectSta:'',
      dialogTableVisible: false,
      gridData:[],
      dbList:[],
      db:'',
      url:{
         url1:'',//列表路径
         url2:'',//恢复路径  
      },
      params: {//只需要业务参数
          
      }
    };
  },methods:{
      handleCurrentChange (obj){
          if(obj != null){
              this.filename=obj.filename;
              this.dialogTableVisible = false; 
          }
      },  
      choose(){  
          //加载选择文件  
           this.dialogTableVisible = true; 
          this.$http.post(this.url.url1).then(res=>{
              this.gridData=res.body;
          })  
      },
       revert(){
           //恢复
          this.loading=true; 
          this.$http.post(this.url.url2,{filename:this.filename,db:this.db}).then(res=>{
              this.$alert(res.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.loading=false;
                }
             });
          }).catch(err=>{
              this.loading=false;
          })
        },
  },
  created(){
      this.$http.post(this.$api.frameGetDB).then(res=>{
          this.dbType=res.body.db;
            if(this.dbType==='mysql'||this.dbType==='sqlserver'){
                this.selectSta=true ;  
                let url=this.dbType==='mysql'?this.$api.mysqlDataListDataBases:this.$api.sqlserverDataListDataBases;
                this.$http.post(url).then(res=>{
                    this.dbList=res.body
                });
            //获取当前db值
                let dbUrl=this.dbType==='mysql'?this.$api.mysqlDataDefaultCatalog:this.$api.sqlserverDataDefaultCatalog;
                this.$http.post(dbUrl).then(res=>{
                    this.db=res.body.defaultCatalog
                });
                this.loading=false;
            }else{
                this.selectSta=false;  
                 this.loading=false; 
            };
            //根据不同库分配不同数据库路径
            if(this.dbType==='mysql'){
                this.url.url2=this.$api.mysqlDataRevert;
                 this.url.url1=this.$api.mysqlDataFiles;
            }
            if(this.dbType==='oracle'){
                this.url.url2=this.$api.oracleDataRevert;
                 this.url.url1=this.$api.oracleDataFiles;
            }
            if(this.dbType==='sqlserver'){
                this.url.url2=this.$api.sqlserverDataRevert;
                 this.url.url1=this.$api.sqlserverDataFiles;
            }
            if(this.dbType==='db2'){
                this.url.url2=this.$api.db2DataRevert;
                 this.url.url1=this.$api.db2DataFiles;
            }


      });
      this.loading=false;
  }
};
</script>
<style type="text/css">
  .importDb{
    position: relative;
  }
  .improt-btn{
    position: absolute;
    right: 10%;
    top: 0;
  }
  .el-table__row:hover{
      cursor: pointer;
  }
</style>
