<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">会员注册数({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.queryModel" @change="query">
                            <el-radio-button  label="day">今日</el-radio-button>
                            <el-radio-button  label="yesterday" >昨日</el-radio-button>
                            <el-radio-button  label="month">本月</el-radio-button>
                            <el-radio-button  label="year">今年</el-radio-button>
                            <el-radio-button  label="years">年份</el-radio-button>
                        </el-radio-group>

                            <el-date-picker
                                v-model="dateArr"
                                value-format="yyyy-MM-dd"
                                :editable='false'
                                @change="rangeTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>  
            </div>
            <!-- 统计数据 -->
            <ul class="clearfix">
                <li class="data-item">
                     <p class="data-title">注册数<i class="iconfont icon-kongzhitai-zhushi"></i></p>
                     <p class="data-num">{{dataInfo.regTotal}}</p>                  
                </li>
            </ul> 
                <!-- 图表 -->
            <div class="chart-style" id="chartLine" > </div>    
                  <table class="data-table">
                               <tr>
                                <th >时段</th>
                                <th >注册数</th>
                                <th >占比</th> 
                              </tr>
                              <tr>
                                  <td>合计</td>
                                  <td>{{sum}}</td>
                                  <td></td>
                                </tr>
                                <tr  v-for="(item,index) in dataInfo" :key="index">
                                <td v-if="params.queryModel==='day'||params.queryModel==='yesterday'">
                                    <span v-if='item[1]<10'>
                                        0{{item[1]}}:00-0{{item[1]}}:59
                                    </span>
                                    <span v-else>
                                        {{item[1]}}:00-{{item[1]}}:59
                                    </span>     
                                </td>
                                <td v-if="params.queryModel==='month'||params.queryModel==='section'">                               
                                    {{year}}-{{month}}-{{item[1]}} 00:00:00-23:59:59                                
                                </td>
                                <td v-if="params.queryModel==='year'">                               
                                     {{year}}-{{item[1]}}-01——{{year}}-{{item[1]}}-{{getDay(year,item[1])}}                                              
                                </td>
                                 <td v-if="params.queryModel==='years'">                               
                                     {{item[1]}}-01-01——{{item[1]}}-12-{{getDay(year,item[1])}}                                              
                                </td>
                                <td >{{item[0]}}</td>
                                <td >{{((item[0]/totoal)*100).toFixed(1)}}%</td>      
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
        begin: "",
        end: ""
      },
      time:'',
      date:{
          year:0,
          month:0,
          day:0
      },
      dataInfo: {
        regTotal: 0,
        list: []
      },
      chartLine: null,
      chartPie: null,
      sum:0,
      year:'',
      month:'',
      totoal:'',
      chartLineOptions: {
        //折线图配置
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["注册数"]
        },
        grid: {
          left: "4%",
          right: "2%",
          bottom: "14%"
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          boundaryGap: true,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          splitLine: { show: false },
          type: "value"
        },
        series: [
          {
            name: "注册数",
            type: "line",
            showSymbol: false,
            smooth: true, //这句就是让曲线变平滑的
            data: [120, 132, 101, 134, 90, 230, 210]
          },
        ]
      }
    };
  },
  methods: {
    getDay(y,m){
        //获取m月天数
        let curMonthDays = new Date(y,m, 0).getDate();
        return curMonthDays;
     },
      rangeTime(val){//格式化时间
      console.log(val)
      if(val!=null){
           this.params.begin=val[0];
           this.params.end=val[1]; 
            if(val[0]===val[1]){
                this.time=val[0];   
            }else{
                this.time=val[0]+'-'+val[1];   
            }   
            this.params.flag='3';
           this.params.queryModel='section';   
      }else{
        this.params.begin='';
        this.params.end=''; 
        this.params.queryModel='day'; 
        this.time=this.date.year+'-'+this.date.month+'-'+this.date.day  
      }       
        this.getDataInfo(); 
      },
     query(val){
        if(val==='day'){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val==='yesterday'){
            this.time=this.date.year+'-'+this.date.month+'-'+(parseInt(this.date.day)-1)
        }
        if(val==='month'){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val==='year'||val==='years'){
            this.time=this.date.year
        }
        this.getDataInfo();
     }, 
    getDataInfo() {
      axios.post(this.$api.statisticMemberList,this.params).then(res => {
            let admin=[];
            let timeWD=[];
             let xData=[];
             let series=[]; 
            for(let i in res.body.data){
                admin.push(res.body.data[i][0]);
                timeWD.push(res.body.data[i][1]);
                xData.push(this.timeFormat(this.params.queryModel,res.body.data[i][1]));
                series.push(res.body.data[i][0]);
            };
            this.sum=0;
            for(let i in res.body.data){
                this.sum=this.sum+res.body.data[i][0];
            }
             this.totoal=res.body.totalCount;
            if(this.totoal===0){
                this.totoal=1;
            }

        this.dataInfo.regTotal = this.sum;
       
        this.dataInfo = res.body.data;
       

       this.setChartLineOptions(xData,series);
      });
    },
    setChartLineOptions(xdata,series){
        let Options = {
                xAxis: {
                    data: xdata
                },
                series: [
                    {
                    name: "浏览量(pv)",
                    data:series
                    },
                ]
                };
           this.chartLine.setOption(Options);   
    },
    timeFormat(flag,timeName){//格式化时间显示
        let formatTime='0';
        if(flag=='day'||flag=='yesterday'){//小时转换
            switch (timeName) {
                case 0:
                formatTime="00:00-00:59" 
                    break;
                case 1:
                formatTime="01:00-01:59" 
                    break;
                    case 2:
                formatTime="02:00-02:59" 
                    break;
                    case 3:
                formatTime="03:00-03:59" 
                    break;
                    case 4:
                formatTime="04:00-04:59" 
                    break;
                    case 5:
                formatTime="05:00-05:59" 
                    break;
                    case 6:
                formatTime="06:00-06:59" 
                    break;
                    case 7:
                formatTime="07:00-07:59" 
                    break;
                    case 8:
                formatTime="08:00-08:59" 
                    break;
                    case 9:
                formatTime="09:00-09:59" 
                    break;
                    case 10:
                formatTime="10:00-10:59" 
                    break;
                    case 11:
                formatTime="11:00-11:59" 
                    break;
                    case 12:
                formatTime="12:00-12:59" 
                    break;
                    case 13:
                formatTime="13:00-13:59" 
                    break;
                    case 14:
                formatTime="14:00-14:59" 
                    break;
                    case 15:
                formatTime="15:00-15:59" 
                    break;
                    case 16:
                formatTime="16:00-16:59" 
                    break;
                    case 17:
                formatTime="17:00-17:59" 
                    break;
                    case 18:
                formatTime="18:00-18:59" 
                    break;
                    case 19:
                formatTime="19:00-19:59" 
                    break;
                    case 20:
                formatTime="20:00-20:59" 
                    break;
                    case 21:
                formatTime="21:00-21:59" 
                    break;
                    case 22:
                formatTime="22:00-22:59" 
                    break;
                    case 23:
                formatTime="23:00-23:59" 
                    break;
                default:
                formatTime="99:99:99~99:99:99:99"
                    break;
            }
        }
        if(flag=='year'){
            let date= new Date();
            switch (timeName) {
                case 1:
                 formatTime=date.getFullYear()+"-01"  
                    break;
                 case 2:
                 formatTime=date.getFullYear()+"-02"  
                    break;
                     case 3:
                 formatTime=date.getFullYear()+"-03"  
                    break;
                     case 4:
                 formatTime=date.getFullYear()+"-04"  
                    break;
                     case 5:
                 formatTime=date.getFullYear()+"-05"  
                    break;
                     case 6:
                 formatTime=date.getFullYear()+"-06"  
                    break;
                     case 7:
                 formatTime=date.getFullYear()+"-07"  
                    break;
                     case 8:
                 formatTime=date.getFullYear()+"-08"  
                    break;
                     case 9:
                 formatTime=date.getFullYear()+"-09"  
                    break;
                      case 10:
                 formatTime=date.getFullYear()+"-10"  
                    break;
                      case 11:
                 formatTime=date.getFullYear()+"-11"  
                    break;
                       case 12:
                 formatTime=date.getFullYear()+"-12"  
                    break;
                default:
                formatTime="9999-99-99"  
                    break;
            }
        }
        if(flag=='month'||flag=='years'){
            formatTime=timeName;  
        }
        if(flag==='section'){
            timeName=timeName.split('/')[1]
            formatTime=timeName;  
        }
        return formatTime;
    }
    
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
  },
  mounted() {
    this.chartLine = echarts.init(document.getElementById("chartLine"));
    this.chartLine.setOption(this.chartLineOptions);
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
