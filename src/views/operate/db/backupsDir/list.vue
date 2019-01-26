<template>
    <section v-loading="loading" class="cms-body">
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="filename" label="文件名" align="center">
            </el-table-column>
            <el-table-column prop="size" label="大小" align="center">
                <div slot-scope="scope">
                    {{scope.row.size}}KB
                </div>
            </el-table-column>
            <el-table-column prop="lastModifiedDate" label="最后备份时间" align="center"></el-table-column>   
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                        <cms-button type="down" @click.native="down(scope.row.filename)"
                        v-perms="'/backupsDir/rename'" 
                    ></cms-button>             
                    <cms-button type="edit" @click.native="routerLink('/backupsDir/edit','update',scope.row.filename)"
                        v-perms="'/backupsDir/rename'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch(url.url3,'/WEB-INF/backup/'+scope.row.filename)"
                         v-perms="'/backupsDir/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                
                 <el-button type="primary"  @click="download()" :disabled="disabled">批量下载</el-button>
                <el-button :disabled="disabled" @click="deleteBatch(url.url3,names)"
                       v-perms="'/backupsDir/delete'"
                  >批量删除</el-button>
             
            </div>
             
          </div>   
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import { setBaseUrl } from '@/config.js';
import { signParams } from '@/untils/sign';
import qs from 'qs'
export default {
    mixins:[listMixins],
  data() {
    return {
      dbType:'', 
      names:'',
      url:{
          url1:"",//获取数据库文件列表信息
          url2:'',//文件下载路径  
          url3:'',//删除路径
          url4:'',//重命名路径

      }, 
      params: {//只需要业务参数    
        
      },
      downParam:{
         appId:'',
         sessionKey:'',
         names:'',
      },
    };
  },methods:{
      download(){
          //下载
         
            let link = setBaseUrl()+this.url.url2
            this.downParam.appId = process.env.appId;
            this.downParam.sessionKey=localStorage.getItem('sessionKey');
            this.downParam.names=this.names;
            this.downParam = signParams(this.downParam,  process.env.appKey);//返回签名后的对象
            let url=link+'?'+qs.stringify(this.downParam);
            location.href=url;
      },
         down(val){
            //下载
          
            let link = setBaseUrl()+this.url.url2
            this.downParam.appId = process.env.appId;
            this.downParam.sessionKey=localStorage.getItem('sessionKey');
            this.downParam.names='/WEB-INF/backup/'+val;
            this.downParam = signParams(this.downParam, process.env.appKey);//返回签名后的对象
            let url=link+'?'+qs.stringify(this.downParam);
            location.href=url;  
        },
       deleteBatch(url,ids) { //删除
            this.$confirm('是否确定删除？', '警告', { type: "error" })
                .then(mes => {
                    this.$http.post(url, {names: ids }).then(res => {
                        if (res.code == "200") {
                            this.successMessage('删除成功');
                            this.getTableData(this.params);
                        }
                    });
                })
                .catch(error => { });
        },
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {          
                    this.tableData = res.body;
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },
         checkIds(val) {
            let names = [];
            for (let i in val) {
                names.push('/WEB-INF/backup/'+val[i].filename);
            }
            this.names = names.join(",");
            this.disabled = val.length > 0 ? false : true;
            console.log(names)  
        },
  },
  created(){
      //获取库类型
       this.$http.post(this.$api.frameGetDB).then(res=>{
            this.dbType=res.body.db;         
            //根据不同库分配不同数据库路径
            if(this.dbType==='mysql'){
                this.url.url1=this.$api.mysqlDataFiles;
                this.url.url2=this.$api.mysqlDataExport;
                this.url.url3=this.$api.mysqlDataDelete;
                this.url.url4=this.$api.mysqlDataRename;
            }
            if(this.dbType==='oracle'){
                this.url.url1=this.$api.oracleDataFiles;
                this.url.url2=this.$api.oracleDataExport;
                this.url.url3=this.$api.oracleDataDelete;
                this.url.url4=this.$api.oracleDataRename;
            }
            if(this.dbType==='sqlserver'){
                this.url.url1=this.$api.sqlserverDataFiles;
                this.url.url2=this.$api.sqlserverDataExport;
                this.url.url3=this.$api.sqlserverDataDelete;
                this.url.url4=this.$api.sqlserverDataRename;
            }
            if(this.dbType==='db2'){
                this.url.url1=this.$api.db2DataFiles;
                this.url.url2=this.$api.db2DataExport;
                this.url.url3=this.$api.db2DataDelete;
                this.url.url4=this.$api.db2DataRename;
            }
            this.initTableData(this.url.url1,this.params);  

      });     
  }
};
</script>

<style>

</style>
