<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">忠诚度({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                            <el-radio-button  label="4">今日</el-radio-button>
                            <el-radio-button  label="1">本月</el-radio-button>
                            <el-radio-button  label="2">今年</el-radio-button>   
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
                     
                </li>
            </ul> 
                <!-- 图表 -->
            <div class="chart-style" id="chartLine" > </div>    
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dateArr:'',
      params: {
        flag:'4',
        begin: "",
        end: ""
      },
      dataInfo: {
        regTotal: 0,
        list: []
      },
      time:'',
      date:{
          year:'',
          month:'',
          day:''
      },
      chartLine: null,
      chartPie: null,
      sum:0,
      year:'',
      month:'',
      totoal:'',
      chartLineOptions: 
        {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[10, 52, 200, 334, 390, 330, 220]
                }
            ]
        }
    }   
  },
  methods: {
      rangeTime(val){//格式化时间
        if(val!=null){
            this.params.begin=val[0];
            this.params.end=val[1];
            if(val[0]===val[1]){
                this.time=val[0];   
            }else{
                this.time=val[0]+'-'+val[1];   
            }   
            this.params.flag='3';
        }else{
            this.params.begin='';
            this.params.end='';
            this.params.flag='4';
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }   
           
            this.getDataInfo(); 
      },
     query(val){
        if(val==='4'){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val==='1'){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val==='2'){
            this.time=this.date.year
        }
        this.getDataInfo();
     }, 
    getDataInfo() {
      axios.post(this.$api.flowVisitorList,this.params).then(res => {
          let xData=[];
          let series=[]; 
            for(let i in res.body.data){
                series.push(res.body.data[i][0]);
                xData.push(res.body.data[i][1]);
            }
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
                    name: "忠诚度",
                    data:series
                    },
                ]
                };
           this.chartLine.setOption(Options);   
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
