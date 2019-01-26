<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">来源分类({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                            <el-radio-button  :label="4">今日</el-radio-button>
                            <el-radio-button  :label="1">本月</el-radio-button>
                            <el-radio-button  :label="2">今年</el-radio-button>
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
          
                <!-- 图表 -->
                <div class="flex">
                     <div class="chart-style" id="chartPie" > </div>      
                          <div class="chart-style" id="chartLine" > </div>    
            
                </div>
             

                       <table class="data-table">
                              <tr>
                                <th>分类</th>                        
                                <th>pv总数</th> 
                                <th>ip总数</th> 
                                <th>访客总数</th> 
                              </tr>
                              <tr>
                                  <td>合计</td>                                
                                  <td>{{sum}}</td>
                                  <td>{{ipsum}}</td>
                                  <td>{{fksum}}</td>
                              </tr>        
                              <tr  v-for="(item,index,length) in totalMap" :key="index">
                                  <td>{{index}}</td>
                                  <td>{{item}}</td>
                                  <td>{{ipList[length][index]}}</td>
                                  <td>{{fkList[length][index]}}</td>
                              </tr>    
                        </table>

  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dateArr: "",
      params: {
        type: "source",
        target: "",
        flag: 4,
        begin: "",
        statisDay: "",
        end: ""
      },
       time:'',
      date:{
          year:'',
          month:'',
          day:''
      },
      totalMap:[],
      ipList:[],
      fkList:[],
      dataInfo: {
        pvTotal: 0,
        visitorTotal: 0,
        ipTotal: 0,
        list: []
      },
      chartLine: null,
      chartPie: null,
      sum:0,
      ipsum:0,
      fksum:0,
      chartLineOptions: {
        //折线图配置
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        grid: {
          left: "5%",
          right: "5%",
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
        series: []
      },
      chartPieOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "来源分析",
            type: "pie",
            radius: "55%",
            radius: ["50%", "70%"],
            data: [ ]
          }
        ],
        color: ["#56dea0", "#ffbe60", "#fa99cb", "#46d7e8", "#86c0e9"]
      }
    };
  },
  methods: {
    rangeTime(val) {
      //格式化时间
      if(val!=null){
        this.params.begin = val[0];
        this.params.end = val[1];
        this.params.flag = 3;
         if(val[0]===val[1]){
              this.time=val[0];   
          }else{
              this.time=val[0]+'-'+val[1];   
          }   
      }else{
        this.params.begin = '';
        this.params.end = '';
        this.params.flag = 4;
           this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
      }  
      this.getDataInfo();
    },
    query(val) {
      this.dateArr = "";
      this.params.begin = "";
      this.params.end = "";
      if(val===4){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val===1){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val===2){
            this.time=this.date.year
        }
      this.getDataInfo();
    },
    getDataInfo() {
       axios
        .all([
   
             axios.post(this.$api.flowSourceList, this.params),
            
         ]).then(
            axios.spread((res) => {
            let keys = []; //显示项
            let xData = []; //时间
            let series = []; //值
            this.ipList=[];
            this.fkList=[];
            for (let i in res.body.keys) {
              keys.push(res.body.keys[i]); 
              let tol=0;  
              let fktol=0;
              let obj={};
              let obj2={};
              for(let j in res.body.resultMap[keys[i]]){
                  tol+=res.body.resultMap[keys[i]][j][1];
                  fktol+=res.body.resultMap[keys[i]][j][2];
                  obj[res.body.keys[i]]=tol;
                  obj2[res.body.keys[i]]=fktol;
              }
              this.ipList.push(obj);
              this.fkList.push(obj2);
            }  
            this.ipsum=0;
            this.fksum=0;
            for(let x in this.ipList){
               this.ipsum+= this.ipList[x][keys[x]];
               this.fksum+= this.fkList[x][keys[x]];
            }
            this.totalMap=res.body.totalMap;
            this.sum=0;
            for(let s in res.body.totalMap){
              this.sum+=res.body.totalMap[s];
            }

            for (let i in keys) {
              //折线数据
              let restMap = res.body.resultMap[keys[i]];
              series[i] = {
                name: keys[i],
                type: "line",
                showSymbol: false,
                smooth: true, //这句就是让曲线变平滑的
                data: this.getChartSeriesData(restMap)
              };
            }
            xData = this.getXdata(res.body.resultMap[keys[0]]);
          
            let sData=['',''];
            xData=xData.length==0?sData:xData;
            let lineOptions = {
              legend: {
                data: keys
              },
              xAxis: {
                data: xData
              },
              series: series
            };

            let pieData=this.getPieSeriesData(res.body.totalMap);
            let initData=[0];
            pieData=pieData.length==0?initData:pieData;
            let pieOptions = {
              series: [
                {
                  name: "来源分类",
                  data: pieData
                }
              ]
            };
            this.chartLine.setOption(lineOptions);
            this.chartPie.setOption(pieOptions);
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    getXdata(arr) {
      let data = [];
      for (let i in arr) {
        data.push(arr[i][4]);
      }
      return data;
    },
    getChartSeriesData(arr) {
      //处理二位数组
      let data = [];
      for (let i in arr) {
        data.push(arr[i][0]);
      }
      return data;
    },
    getPieSeriesData(arr) {
      //处理二位数组
      let data = [];
      for (let key in arr) {
        data.push({
          name: key,
          value: arr[key]
        });
      }
      return data;
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
    this.chartPie = echarts.init(document.getElementById("chartPie"));
    this.chartPie.setOption(this.chartPieOptions);
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
