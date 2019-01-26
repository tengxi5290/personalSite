<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">留言数({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.queryModel" @change="query">
                            <el-radio-button  label="day">今日</el-radio-button>
                            <el-radio-button  label="month">本月</el-radio-button>
                            <el-radio-button  label="year">今年</el-radio-button>
                        </el-radio-group>
                        </div>  
                         <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">筛选：</label>
                        <el-select size="small" placeholder="是否回复" style="margin-right:10px;" v-model="params.isReplyed" @change="query">
                            <el-option :value="''">无</el-option>
                            <el-option :value="true" label="是">是</el-option>
                            <el-option :value="false" label="否">否</el-option>
                        </el-select>
                        </div>
            </div>
                  <table class="data-table">
                              <tr>
                                <th >时段</th>
                                <th >留言数</th>
                                <th >占比</th> 
                              </tr>
                              <tr>
                                  <td>合计</td>
                                  <td>{{tol}}</td>
                                  <td></td>
                                </tr>
                                <tr  v-for="(item,index) in dataInfo" :key="index">
                                <td v-if="params.queryModel==='day'">
                                    <span v-if='item[1]<10'>
                                        0{{item[1]}}:00-0{{item[1]}}:59
                                    </span>
                                    <span v-else>
                                        {{item[1]}}:00-{{item[1]}}:59
                                    </span>     
                                </td>
                                <td v-if="params.queryModel==='month'">                               
                                    {{year}}-{{month}}-{{item[1]}} 00:00:00-23:59:59                                
                                </td>
                                <td v-if="params.queryModel==='year'">                               
                                     {{year}}-{{item[1]}}-01——{{year}}-{{item[1]}}-{{getDay(year,item[1])}} 
                                                                   
                                </td>
                                <td >{{item[0]}}</td>
                                <td >{{((item[0]/sum)*100).toFixed(1)}}%</td>      
                              </tr>      
                            </table>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dateArr:'',
      params: {
        queryModel:'day',
        isReplyed:'',
       
      },
      channelParams:{
          parentId:'',
          https:'',
          all:'',
      },
      time:'',
      date:{
          year:0,
          month:0,
          day:0
      },
     dataInfo: {},
     totoal:'',
     year:'',
     month:'',
     sum:0,
     tol:0,
     channelList:[],
    };
  },
  methods: {
     getDay(y,m){
        let curMonthDays = new Date(y,m, 0).getDate();
        return curMonthDays;
     },
     query(val){
        if(val==='day'){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val==='month'){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val==='year'){
            this.time=this.date.year
        }
        this.getDataInfo();
     }, 
    getDataInfo() {
      axios.post(this.$api.statisticGuestbookList,this.params).then(res => {
       this.dataInfo=res.body.data;
       this.totoal=res.body.totalCount;
       this.sum=0;
       let tol=0;
        for(let i in res.body.data){
              this.sum=this.sum+res.body.data[i][0];
              tol+=res.body.data[i][0];
        }
        this.tol=tol;
        if(this.sum===0){
          this.sum=1
        }
      });
    },
    getChannel(){
      axios.post(this.$api.channelList,this.channelParams).then(res => {
        this.channelList=res.body;
      });
            
    },
  },
  created() {
    let now = new Date();
    let Y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    this.date.year=Y;
    this.date.month=m;
    this.date.day=d;
    this.year=Y;
    this.month=m;
    this.time=Y+'-'+m+'-'+d
    this.getDataInfo();
    this.getChannel();
  }
};
</script>

<style scoped lang='scss'>
.data-item {
  float: left;
  min-width: 170px;
  margin-top: 30px;
  .data-title {
    font-size: 12px;
    color: #878d99;
    margin-bottom: 17px;
  }
  .data-num {
    color: #353535;
    font-size: 24px;
  }
}
.chart-style {
  width: 100%;
  height: 380px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 15px;
}
</style>
