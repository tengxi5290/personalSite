<template>
  <section v-loading="loading" class="cms-body">
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" width="200"  align="center"></el-table-column>
        <el-table-column prop="acqName" label="采集名称"  align="center">
        </el-table-column>
        <el-table-column prop="acqChannelName" label="所属栏目"  align="center"></el-table-column>
        <el-table-column prop="acqTypeName" label="内容类型" width="100" align="center">
        </el-table-column>  
        <el-table-column  label="采集地址"  width="100"  align="center">
             <template slot-scope="scope">
                <a :href="scope.row.channelUrl" target="_blank">点击浏览</a>
            </template>
        </el-table-column>  
         <el-table-column  label="内容地址" align="center">
            <template slot-scope="scope">
                <a :href="scope.row.contentUrl" target="_blank">点击浏览</a>
            </template>
        </el-table-column>  
         <el-table-column prop="" label="状态"  width="50"  align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.description == 'SUCCESS' " class="collectioning">成功</span>
                <span v-else class="stoping">失败</span>
            </template>
        </el-table-column>  
        <el-table-column label="描述" align="center">
            <template slot-scope="scope">
               <span>{{tips[scope.row.description]}}</span>
            </template>
        </el-table-column>  
        <el-table-column width="100" label="操作"   align="center">
          <div slot-scope="scope">
              <el-button class="btn-collect delete" @click="deleteBatch($api.collectHistoryDelete,scope.row.id)"  title="删除"  v-perms="'/collectionhistory/delete'"><i class="iconfont  icon-shanchu1"></i></el-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.collectHistoryDelete,ids)" v-perms="'/collectionhistory/delete'"
        >批量删除</el-button>
      </div>    
       <div class="cms-right">
        <!-- cms分页组件 -->
        <cms-pagination :total="total" @change="getPages"></cms-pagination>
      </div>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
import { setBaseUrl } from '@/config.js'
export default {
  mixins:[listMixins],
  data(){
    return {
      globalUrl:setBaseUrl(),
      params:{
        pageNo:1,
        pageSize:10,
      },
      tips:{
          'SUCCESS':'采集成功!',
          'TITLESTARTNOTFOUND':'采集失败!原因: 标题起始点不匹配',
          'TITLEENDNOTFOUND':'采集失败!原因: 标题结束点不匹配',
          'CONTENTSTARTNOTFOUND':'采集失败!原因: 内容起始点不匹配',
          'CONTENTENDNOTFOUND':'采集失败!原因: 内容结束点不匹配',
          'TITLEEXIST':'采集失败!原因: 标题已存在',
          'VIEWSTARTNOTFOUND':'采集失败!原因: 浏览量起始点不匹配',
          'VIEWENDNOTFOUND':'采集失败!原因: 浏览量结束点不匹配',
          'AUTHORSTARTNOTFOUND':'采集失败!原因: 作者起始点不匹配',
          'AUTHORENDNOTFOUND':'采集失败!原因: 作者结束点不匹配',
          'DESCRISTARTNOTFOUND':'采集失败!原因: 摘要起始点不匹配',
          'DESCRIENDNOTFOUND':'采集失败!原因: 摘要结束点不匹配',
          'ORIGINSTARTNOTFOUND':'采集失败!原因: 来源起始点不匹配',
          'ORIGINENDNOTFOUND':'采集失败!原因: 来源结束点不匹配',
          'RELEASESTARTNOTFOUND':'采集失败!原因: 发布时间起始点不匹配',
          'RELEASEENDNOTFOUND':'采集失败!原因: 发布时间结束点不匹配',
          'VIEWIDSTARTNOTFOUND':'采集失败!原因: 发布时间起始点不匹配',
          'VIEWIDENDNOTFOUND':'采集失败!原因: 发布时间结束点不匹配',
       },
    }
  },
  methods:{
    suspend(id){
      axios.post(this.$api.collectPause,{id:id}).then(res=>{
        this.loading = true;
         if(res.code == '200'){
          this.loading = false;
            this.getTableData(this.params);
            this.successMessage('操作成功');
         }
      }).catch(error=>{
        this.loading = false;
      })
    },
    stop(id){
      axios.post(this.$api.collectEnd,{id:id}).then(res=>{
        this.loading = true;
         if(res.code == '200'){
          this.loading = false;
            this.getTableData(this.params);
            this.successMessage('操作成功');
         }
      }).catch(error=>{
        this.loading = false;
      })
    },
    start(ids){
      axios.post(this.$api.collectStart,{ids:ids}).then(res=>{
        this.loading = true;
         if(res.code == '200'){
          this.loading = false;
            this.getTableData(this.params);
            this.successMessage('操作成功');
         }
      }).catch(error=>{
        this.loading = false;
      })
    },
     getTableData(params) {//获取表格数据   
            this.loading = true;
            this.state = false;
            axios.post(this.listUrl, params).then(res => {
                    this.loading = false;
                    if(res.code=='200'){
                         this.total = res.totalCount;
                         this.tableData = res.body;
                   }
            }).catch(error => {
                    this.loading = false;
                    this.state = false;
            });
        },
  },
  created(){
      this.initTableData(this.$api.collectHistoryLIst,this.params);
  }
};
</script>
<style scoped>
.cms-body table .btn-collect {
    display: inline-block;
    height: 24px;
    width: 24px;
    min-width: 0px;
    line-height: 24px;
    padding: 0px;
    font-size: 14px;
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .edit{
  background-color: #17d57e;
  font-weight: 100px;
}
.edit .iconfont ,
.delete .iconfont {
  font-size: 12px;
}
.cms-body table .delete{
  background-color: #ff8b53;
  font-weight: 100px;
}
.cms-body table  .suspend{
  background-color: #00aeff;
}
.cms-body table  .start{
  background-color: #67C23A
}
.cms-body table  .stop{
  background-color: #F56C6C
}
.collectioning{
  color: green;
}
.stoping{
  color: red;
}
.pushing{
  color: red;
}
</style>