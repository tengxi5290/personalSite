<template>

    <section class="cms-body" v-loading="loading">
          <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="原名称:" class="flex-100"  prop="origName">
               <el-input :disabled='true' v-model="dataInfo.origName" class="cms-width"></el-input>
            </el-form-item>       
            <el-form-item label="新名称:" class="flex-100"  prop="distName">
               <el-input v-model="dataInfo.distName" class="cms-width"></el-input>
            </el-form-item> 
           

            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/backupsDir/rename'"
                >提交</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
      


        


    </section>       
</template>

<script>
import listMixins from '@/mixins/form';
import listMixin from '@/mixins/list';
import va from "@/rules";
export default {
    mixins:[listMixins,listMixin],
  data() {
    let self = this;
    let required = va.required();         
    return {   
      dbType:'', 
      url:{
         url1:'',//重命名路径

      },
      dataInfo:{
          origName:this.$route.query.id,
          distName:this.$route.query.id,
      },
      rules: {
         distName:[required]
      },
      params: {//只需要业务参数
          
      }
    };
  },methods:{
         update() {  
             console.log('213')  
             this.updateDataInfo(this.url.url1, this.dataInfo, "list");
         }
  },
  created(){
      this.$http.post(this.$api.frameGetDB).then(res=>{
          this.dbType=res.body.db;
            //根据不同库分配不同数据库路径
            if(this.dbType==='mysql'){
                 this.url.url1=this.$api.mysqlDataRename;
            }
            if(this.dbType==='oracle'){
                 this.url.url1=this.$api.oracleDataRename;
            }
            if(this.dbType==='sqlserver'){
                 this.url.url1=this.$api.sqlserverDataRename;
            }
            if(this.dbType==='db2'){
                 this.url.url1=this.$api.db2DataRename;
            }


      });
      this.loading=false;
  }
};
</script>

</style>
