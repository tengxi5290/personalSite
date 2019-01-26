<template>
  <section class="cms-body" v-loading="loading">
        <section v-if="havaAcquisition" class="container">
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
      </section>
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
              interval:'',
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
              havaAcquisition:false,
            }
      },
        methods:{
          getInfo(ids,type){
                  this.loading = false;
                  let url  =  this.$api.collectSpeedData;
                  this.interval = setInterval(()=>{
                         axios.post(url).then(result=>{
                               if(result.code == '200'){
                                      if(result.body.havaAcquisition){
                                            this.percent = result.body.percent; 
                                            this.collection = result.body.acquisition;
                                            this.speedData = result.body.list;
                                            this.havaAcquisition = true;
                                      }else{
                                            clearInterval(this.interval)
                                            this.$confirm('目前暂无进行中的采集任务，请至采集列表中开始任务!', '提示', {
                                              confirmButtonText: '确定',
                                              type: 'warning'
                                            }).then(() => {
                                                   this.routerLink('/collectionmanage/list','list');
                                            }).catch(() => {
                                                   this.routerLink('/collectionmanage/list','list');
                                            });
                                      }
                               }
                         }).catch(error=>{
                         })
                  },1000);
            } 
        },
      created(){
            this.getInfo();
        },
       beforeRouteLeave (to, from, next) {
          clearInterval(this.interval);
          next();
      },
};
</script>
<style scoped>
.container{
  width: 95%;
  margin:20px auto;
  color: rgb(96, 98, 102);
}
.collectioning{
  color: green;
}
.stoping{
  color: red;
}
.speed-container{
  max-height: 600px;
  overflow:auto
}
.speedHead {
  margin:10px 0px;
  box-sizing: border-box;
}

</style>