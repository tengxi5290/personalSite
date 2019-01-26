<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header ">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/collectionmanage/save','save',0)" v-perms="'/collection/save'"
        >添加</el-button>     
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="采集名称"  align="center"></el-table-column>
        <el-table-column prop="logo" label="状态"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" class="stoping">停止</span>
            <span v-if="scope.row.status == 1" class="collectioning">采集中<i class="el-icon-loading"></i></span>
            <span v-if="scope.row.status == 2" class="pushing">暂停</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
        </el-table-column>  
        <el-table-column prop="endTime" label="结束时间" align="center">
        </el-table-column>  
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <el-button class="btn-collect start" @click="start(scope.row.id)" title="开始" v-perms="'/collectionmanage/start'" :disabled="scope.row.startDisabled"><i class="iconfont icon-zantingcopy"></i></el-button>
              <el-button class="btn-collect suspend" @click="suspend(scope.row.id)" title="暂停" v-perms="'/collectionmanage/suspend'" :disabled="scope.row.suspendDisabled"><i class="iconfont icon-icon-test"></i></el-button>
              <el-button class="btn-collect  stop" @click="stop(scope.row.id)" title="停止" v-perms="'/collectionmanage/stop'" :disabled="scope.row.stopDisabled"><i class="iconfont icon-iconfonttingzhi"></i></el-button>
               <el-button class="btn-collect edit" @click="routerLink('/collectionmanage/update','update',scope.row.id)" title="修改" v-perms="'/collectionmanage/get'"><i class=" iconfont icon-weibiaoti101"></i></el-button>
              <el-button class="btn-collect delete" @click="deleteBatch($api.collectDelete,scope.row.id)"  title="删除"  v-perms="'/collectionmanage/delete'"><i class="iconfont  icon-shanchu1"></i></el-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.collectDelete,ids)" v-perms="'/collectionmanage/delete'"
        >批量删除</el-button>
        <el-button :disabled="disabled" @click="start(ids)" v-perms="'/collectionmanage/start'"
        >开始采集</el-button>
      </div>    
    </div> 
     <!-- 新增及修改dialog -->
    <el-dialog class="dialog" title="采集进度查看" :visible.sync="dialogVisible" width="80%":before-close="handleClose">
       <el-row>
          <el-col :span="24">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="percent" status="success"></el-progress>
          </el-col>
       </el-row>
       <el-row  class="speedHead">
          <el-col>
              <h3>采集任务描述：{{collection.name}}正在进行中，预计总数为：{{collection.totalNum}}，正在执行第{{collection.currNum}}个</h3>
          </el-col>
       </el-row>
       <el-row  class="speedHead">
          <el-col>
              <h3>采集信息过程：</h3>
          </el-col>
       </el-row>
       <section class="speed-container">
             <el-row  class="speedHead" v-for="(item ,index) in speedData" :key="index">
                <el-col :span="1" >
                      第{{speedData[index].seq}}条
                </el-col>
                <el-col :span="17" >
                    {{speedData[index].contentUrl}}【{{speedData[index].title}}】
                </el-col>
                <el-col :span="6" >
                    <span class="collectioning" v-if="speedData[index].description == 'success'">{{tips[speedData[index].description]}}</span>
                    <span v-else class="stoping">{{tips[speedData[index].description]}}</span>
                </el-col>
             </el-row>
       </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="danger">关闭</el-button>
      </span>
    </el-dialog>
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
      dialogVisible:false,
      interval:'',
      params:{
           queryCtgId:'',
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
       percent:0,
      collection:{},
      speedData:[],
      collectionmanageTypes:[],
    }
  },
  methods:{
    handleClose(done) {
       this.interval.clearInterval;
       done();
      this.dialogVisible=false;
    },
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
    //采集
    start(ids,type){
      axios.post(this.$api.collectStart,{ids:ids}).then(res=>{
        this.loading = true;
         if(res.code == '200'){
             this.loading = false;
             this.getTableData(this.params);
            let url  =  this.$api.collectSpeedData;
             axios.post(url).then(result=>{
                   if(result.code == '200'){
                        if( result.body.havaAcquisition ){
                              this.dialogVisible = true;
                              this.interval = setInterval(()=>{
                                     axios.post(url).then(result=>{
                                           if(result.code == '200' ){
                                                  this.percent = result.body.percent; 
                                                  this.collection = result.body.acquisition;
                                                  this.speedData = result.body.list;
                                           }
                                     }).catch(error=>{
                                     })
                              },1000);
                        }else{
                             this.$confirm('当前采集任务无法进行，请检查采集任务信息设置是否正确，请确认!', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                             })
                        }
                   }
             }).catch(error=>{
             })

            
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
                         for(let i in this.tableData){
                            if(this.tableData[i].status == 0 ){
                              this.tableData[i].startDisabled = false;
                              this.tableData[i].suspendDisabled = true;
                              this.tableData[i].stopDisabled = true;
                            }else if(this.tableData[i].status == 1 ){
                              this.tableData[i].startDisabled = true;
                              this.tableData[i].suspendDisabled = false;
                              this.tableData[i].stopDisabled = false;
                            }else if(this.tableData[i].status == 2 ){
                              this.tableData[i].startDisabled = false;
                              this.tableData[i].suspendDisabled = true;
                              this.tableData[i].stopDisabled = true;
                            }
                          }
                    }
              }).catch(error => {
                    this.loading = false;
                    this.state = false;
                });
        },
  },
  created(){
      this.initTableData(this.$api.collectList,this.params);
  },
  watch:{
       dialogVisible(curlVal,oldVal){
          if(!curlVal){
             clearInterval(this.interval)
          }
      }
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
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .btn-collect  .iconfont{
  font-size: 14px;
  font-weight: 100;
}

.cms-body table .edit{
  background-color: #17d57e;
}
.cms-body table .delete{
  background-color: #ff8b53;
}
.cms-body table  .suspend{
  background-color: #e6a23c;
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
.speed-container{
  max-height: 500px;
  overflow:auto
}
.speedHead{
  margin:10px 0px;
}
</style>