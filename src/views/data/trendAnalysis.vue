<template>
    <section class="cms-body cms-chart-box">
        <div class="cms-list-header" style="padding-left:0">
            <h5 class="data-header-title">趋势分析({{time}})</h5>
            <div class="flex-date">
                <label class="cms-label" style="margin-left:0">日期：</label>
                <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                    <!-- <el-radio-button :label="4">今日</el-radio-button> -->
                    <!-- <el-radio-button :label="6" >昨日</el-radio-button> -->
                    <el-radio-button :label="1">本周</el-radio-button>
                    <el-radio-button :label="2">本月</el-radio-button>
                </el-radio-group>
                <el-date-picker v-model="dateArr" value-format="yyyy-MM-dd" @change="rangeTime" :editable='false' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>  
        </div>


        <!-- 图表 -->
        <div class="chart-style" id="chartLine"></div> 

        <el-table :data="dataInfo.list" stripe style="width: 100%">
            <el-table-column prop="create_time" label="日期" align="center"></el-table-column>
            <el-table-column prop="channel_name" label="频道名称" align="center"></el-table-column>
            <el-table-column prop="pv" label="访问次数" align="center"></el-table-column>
            <el-table-column prop="uv" label="访问用户" align="center"></el-table-column>
            <el-table-column prop="uip" label="独立ip" align="center"></el-table-column>
            <el-table-column prop="new_user" label="新增用户" align="center"></el-table-column>
            <el-table-column prop="rate" label="pv/uv" align="center"></el-table-column>
        </el-table>  
    </section>
</template>

<script>
import axios from "axios"
import {axiosProxy} from "@/api/tool"
export default {
    data() {
        return {
            dateArr:'',
            params: {
                flag: 1,
                begin: "",
                statisDay:"",
                end: ""
            },
            time:'',
            date:{
                year:'',
                month:'', 
                day:''
            },
            dataInfo: {
                pvTotal: 0,
                visitorTotal: 0,
                ipTotal: 0,
                list: []
            },
            chartLine: null,
            chartPie: null,
            chartLineOptions: {
                //折线图配置
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["访问次数", "访问用户", "独立ip", "新增用户"]
                },
                grid: {
                    left: "5%",
                    right: "2%",
                    bottom: "14%"
                },
                xAxis: {
                    type: "category",
                    splitLine: { show: false },
                    boundaryGap: true,
                    data: []
                },
                yAxis: {
                    splitLine: { show: false },
                    type: "value"
                },
                series: [
                    {
                        name: "访问次数",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    },
                    {
                        name: "访问用户",
                        type: "line",
                        showSymbol: false,
                        smooth: true,

                        data: []
                    },
                    {
                        name: "独立ip",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    },
                    {
                        name: "新增用户",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    }
                ]
            },



            siteName: null, // 当前站点的缩写名字 
        }
    },
    methods: {
        // 中投 获取站点缩写
        getSiteAbbrName (currentSiteId, callback) {
            axiosProxy.get(this.$api.site + '/' + currentSiteId).then( res => {
                if(res.data.errorCode == 0) {
                    console.log('站点详情')
                    console.log(res)
                    let abbrName 
                    switch (res.data.data.shortName) {
                        case '视讯中国':
                            abbrName = 'sxzg'
                        break
                        case '娱乐中国':
                            abbrName = 'ylzg'
                        break
                        case '视频中国':
                            abbrName = 'spzg'
                        break
                        case '直播中国':
                            abbrName = 'zbzg'
                        break
                        case '文化中国': 
                            abbrName = 'whzg'
                        break
                        default:
                            abbrName = null
                    }
                    this.siteName = abbrName
                    callback()
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('操作失败')
                    }
                }
            }).catch( error => {
                console.log(error)  
            })
        },

        // 中投 获取折线图信息
        getLineDetail (callback) {
            let startTime = this.params.begin
            let endTime = this.params.end
            let url = '/api/Daren/dataCount/channel.action?channelId=' + this.siteName
            if(startTime !== '' && endTime !== '') {
                url = url + '&startTime=' + startTime + '&endTime=' + endTime
            } 
            $.ajax({
                type: 'get',
                url: url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                },
                success: res => {
                    let dateArray = []
                    let pvArray = []
                    let uvArray = []
                    let uipArray = []
                    let newUserArray = []
                    this.dataInfo.list = res.data
                    for (let i in res.data) {
                        dateArray.push(res.data[i].create_time)
                        pvArray.push(res.data[i].pv)
                        uvArray.push(res.data[i].uv)
                        uipArray.push(res.data[i].uip)
                        newUserArray.push(res.data[i].new_user)
                    }
                    this.chartLineOptions.xAxis.data = dateArray
                    this.chartLineOptions.series[0].data = pvArray
                    this.chartLineOptions.series[1].data = uvArray
                    this.chartLineOptions.series[2].data = uipArray
                    this.chartLineOptions.series[3].data = newUserArray
                    callback()
                },
                error: res => {
                    console.log(res)
                }
            })
        },

        // 中投 自选时间段
        rangeTime(val){
            if(val!=null){
                this.params.begin = val[0]
                this.params.end = val[1]
                this.params.flag = 3
            }else{
                this.params.begin=''
                this.params.end=''
                this.params.flag=1
            }  
            this.getLineDetail( () => {
                this.chartLine = echarts.init(document.getElementById("chartLine"))        
                this.chartLine.setOption(this.chartLineOptions)
                window.addEventListener('resize', this.createChart)
            })
        },

        // 中投 日期tab筛选结果
        query(val){
            switch (val) {
                case 1:
                case '1':
                    this.params.begin = ''
                    this.params.end = ''
                break
                case 2:
                case '2':
                    this.params.begin = this.setDate(this.getCurrentMonthFirst())
                    this.params.end = this.setDate(this.getCurrentMonthLast())
                break
                case 4:
                case '4':
                    this.params.begin = this.getNowFormatDate()
                    this.params.end = this.getNowFormatDate()
                break
                case 6:
                case '6':
                    this.params.begin = this.getYesterday()
                    this.params.end = this.getYesterday()
                break
                default: 
                    this.params.begin = ''
                    this.params.end = ''
            }

            this.getLineDetail( () => {
                this.chartLine = echarts.init(document.getElementById("chartLine"))          
                this.chartLine.setOption(this.chartLineOptions)
                window.addEventListener('resize', this.createChart)
            })
        }, 

        // 中投 获取日期
        setDate (date) {
            let y=date.getFullYear()
            let m=date.getMonth()+1
            let d=date.getDate()
            m=m<10?"0"+m:m
            d=d<10?"0"+d:d
            return y+"-"+m+"-"+d
        },

        // 中投 获取本月第一天
        getCurrentMonthFirst(){
            var date=new Date()
            date.setDate(1)
            return date
        },

        // 中投 获取本月最后一天
        getCurrentMonthLast(){
            var date=new Date()
            var currentMonth=date.getMonth()
            var nextMonth=++currentMonth
            var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1)
            var oneDay=1000*60*60*24
            return new Date(nextMonthFirstDay-oneDay)
        },

        // 中投 获取当天
        getNowFormatDate() {
            var date = new Date()
            var seperator1 = "-"
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var strDate = date.getDate()
            if (month >= 1 && month <= 9) {
                month = "0" + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate
            this.time = currentdate
            return currentdate
        },

        // 中投 获取昨天
        getYesterday() {
            var day1 = new Date()
            day1.setTime(day1.getTime()-24*60*60*1000)
            var month = day1.getMonth()+1
            var strDate = day1.getDate()
            if (month >= 1 && month <= 9) {
                month = "0" + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate
            }
            var s1 = day1.getFullYear()+"-" + month + "-" + strDate
            return s1
        }
    },
    created() { 
        this.getNowFormatDate()
        this.getSiteAbbrName(window.localStorage.getItem('_site_id_param'), () => {
            this.getLineDetail( () => {
                this.chartLine = echarts.init(document.getElementById("chartLine"))        
                this.chartLine.setOption(this.chartLineOptions)
                window.addEventListener('resize', this.createChart)
            })
        })
    }
}
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
