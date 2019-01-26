<template>
    <section class="cms-body cms-chart-box">
        <div class="cms-list-header" style="padding-left:0">
            <h5 class="data-header-title">统计详情({{time}})</h5>
            <div class="flex-date">
                <label class="cms-label" style="margin-left:0">日期：</label>
                <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                    <el-radio-button :label="4">今日</el-radio-button>
                    <el-radio-button :label="6">昨日</el-radio-button>
                    <el-radio-button :label="2">本周</el-radio-button>
                    <el-radio-button :label="1">本月</el-radio-button>
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
            <div class="chart-style" id="chartPie"></div>      
            <div class="chart-style" id="chartLine"></div>    
        </div> 

        <el-table :data="spData" stripe style="width: 100%">
            <el-table-column prop="spName" label="频道名称" align="center"></el-table-column>
            <el-table-column prop="dateTime" label="日期" align="center"></el-table-column>
            <el-table-column prop="viNumber" label="点播数量" align="center"></el-table-column>
            <el-table-column prop="lvNumber" label="直播数量" align="center"></el-table-column>
            <el-table-column prop="arNumber" label="图文数量" align="center"></el-table-column>
            <el-table-column prop="dayNumber" label="日总量" align="center"></el-table-column>
        </el-table>

        <div class="cms-list-footer" style="padding-bottom:100px;">
            <cms-pagination :total="allTotal" @change="getPages" :pageSize="queryParams.pageSize" :page="queryParams.page" :init="true"></cms-pagination>
        </div>
    </section>
</template>

<script>
import axios from "axios"
import {axiosProxy, timestampToTime} from "@/api/tool"
export default {
    data() {
        return {
            queryParams: {
                page: 1,
                pageSize: 10,
                startTime: null,
                endTime: null
            }, // 表格数据的查询参数
            currentSiteName: null, // 当前站点名称的缩写
            showLine: false, // 显示折线图
            showPie: true, // 显示饼图
            spData: [], // 表格数据
            allTotal: null, // 数据总数


            dateArr: "",
            params: {
                // type: "link",
                // target: "",
                flag: 4,
                // begin: "",
                // statisDay: "",
                // end: ""
            },
            time:'',
            date:{
                year:'',
                month:'',
                day:''
            },
            totalMap:[],
            sum:0,
            ipsum:0,
            fksum:0,
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
            chartLineOptions: {
                //折线图配置
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["点播数量", "直播数量", "图文数量", "日总量"]
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
                    data: []
                },
                yAxis: {
                    splitLine: { show: false },
                    type: "value"
                },
                series: [
                    {
                        name: "点播数量",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    },
                    {
                        name: "直播数量",
                        type: "line",
                        showSymbol: false,
                        smooth: true,

                        data: []
                    },
                    {
                        name: "图文数量",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    },
                    {
                        name: "日总量",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: []
                    }]
            },
            chartPieOptions: {
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: "right",
                    data: ["点播数量", "直播数量", "图文数量"]
                },
                series: [
                    {
                        name: "统计详情",
                        type: "pie",
                        radius: "55%",
                        radius: ["50%", "70%"],
                        data: [
                            { value: null, name: "点播数量" },
                            { value: null, name: "直播数量" },
                            { value: null, name: "图文数量" },
                        ]
                    }
                ],
                color: ["#56dea0", "#ffbe60", "#fa99cb"]
            }
        }
    },
    methods: {
        // 中投 获取上传统计数据
        getSpStatistics (startTime, endTime, callback) {
            let url = this.$api.spStatistic + '?spName=' + this.currentSiteName + '&page=' + this.queryParams.page + '&pageSize=' + this.queryParams.pageSize
            if(startTime !== null && startTime !== '' && startTime !== undefined) {
                url = url + '&startTime=' + startTime
            }
            if(endTime !== null && endTime !== '' && endTime !== undefined) {
                url = url + '&endTime=' + endTime
            }
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    console.log('拿到的详情数据')
                    console.log(res)
                    this.spData = res.data.data.list
                    this.allTotal = res.data.data.total
                    let dateArray = []
                    let viArray = [] // 点播
                    let lvArray = [] // 直播
                    let arArray = [] // 图文
                    let dayArray = [] // 日总量

                    for( let i in this.spData) {
                        if(this.spData[i].dateTime != null) {
                            this.spData[i].dateTime = timestampToTime(this.spData[i].dateTime)
                            this.spData[i].dateTime = this.spData[i].dateTime.slice(0, 10)
                        }

                        if(this.params.flag == 1 || this.params.flag == 2) {
                            console.log('凑折线图数据')
                            dateArray.push(timestampToTime(this.spData[i].createTime).slice(0,10))
                            viArray.push(this.spData[i].viNumber)
                            lvArray.push(this.spData[i].lvNumber)
                            arArray.push(this.spData[i].arNumber)
                            dayArray.push(this.spData[i].dayNumber)
                        }

                        if(this.params.flag == 4 || this.params.flag == 6) {
                            console.log('凑饼图数据')
                            this.chartPieOptions.series[0].data[0].value = this.spData[0].viNumber
                            this.chartPieOptions.series[0].data[1].value = this.spData[0].lvNumber
                            this.chartPieOptions.series[0].data[2].value = this.spData[0].arNumber
                        }
                    }
                    this.chartLineOptions.xAxis.data = dateArray
                    this.chartLineOptions.series[0].data = viArray
                    this.chartLineOptions.series[1].data = lvArray
                    this.chartLineOptions.series[2].data = arArray
                    this.chartLineOptions.series[3].data = dayArray

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

        // 中投 获取站点缩写
        getSiteAbbrName (currentSiteId, callback) {
            axiosProxy.get(this.$api.site + '/' + currentSiteId).then( res => {
                if(res.data.errorCode == 0) {
                    console.log('站点详情')
                    console.log(res)
                    this.currentSiteName = res.data.data.shortName
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
        },

        // 中投 获取本月第一天
        getCurrentMonthFirst(){
            var date=new Date()
            date.setDate(1)
            return this.formatDate(date)
        },

        // 中投 获取本月最后一天
        getCurrentMonthLast(){
            var date=new Date()
            var currentMonth=date.getMonth()
            var nextMonth=++currentMonth
            var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1)
            var oneDay=1000*60*60*24
            return this.formatDate(new Date(nextMonthFirstDay-oneDay))
        },

        // 中投 获取本周第一天和最后一天
        getSelectDate(){
            var now = new Date()
            var nowDayOfWeek = now.getDay()
            var nowDay = now.getDate()
            var nowMonth = now.getMonth()
            var nowYear = now.getFullYear()
            var queryBeginDate = this.formatDate(new Date(nowYear,nowMonth,nowDay-nowDayOfWeek+1))
            var queryEndDate = this.formatDate(new Date(nowYear,nowMonth,nowDay-nowDayOfWeek+7))
            return [queryBeginDate, queryEndDate]
        },

        // 中投 标准时间转化
        formatDate (date) {
            var ds = new Date(date)
            let y = ds.getFullYear()
            let m = ds.getMonth() + 1
            let d = ds.getDate()
            m = m < 10? "0" + m: m
            d = d < 10? "0" + d: d
            return y + "-" + m + "-" + d
        },

        // 中投 分页回调
        getPages (current, size) {
            this.queryParams.page = current
            this.queryParams.pageSize = size

            this.getSiteAbbrName( window.localStorage.getItem('_site_id_param'), () => {
                this.getSpStatistics(this.queryParams.startTime, this.queryParams.endTime, () => {
                    this.chartLine = echarts.init(document.getElementById("chartLine"));
                    this.chartLine.setOption(this.chartLineOptions);

                    this.chartPie = echarts.init(document.getElementById("chartPie"));
                    this.chartPie.setOption(this.chartPieOptions);
                })
            })
        },




        rangeTime(val) {
            // 格式化时间
            if(val!=null){
                this.params.begin = val[0]
                this.params.end = val[1]
                this.params.flag = 3
                if(val[0]===val[1]){
                    this.time=val[0]  
                }else{
                    this.time=val[0]+'-'+val[1]   
                }   
            }else{
                this.params.begin = ''
                this.params.end = ''
                this.params.flag = 4
                this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
            }  
            this.getDataInfo()
        },
        // 中投 切换时段选项
        query(val) {
            switch (val) {
                case 1:
                case '1':
                    console.log('本月')
                    this.showLine = true
                    this.showPie = false
                    this.queryParams.startTime = this.getCurrentMonthFirst()
                    this.queryParams.endTime = this.getCurrentMonthLast()
                break
                case 2:
                case '2':
                    console.log('本周')
                    this.showLine = true
                    this.showPie = false
                    this.queryParams.startTime = this.getSelectDate()[0]
                    this.queryParams.endTime = this.getSelectDate()[1]
                break
                case 4:
                case '4':
                    console.log('今日')
                    this.showLine = false
                    this.showPie = true
                    this.queryParams.startTime = this.time
                    this.queryParams.endTime = this.time
                break
                case 6:
                case '6':
                    console.log('昨日')
                    this.showLine = false
                    this.showPie = true
                    this.queryParams.startTime = this.getYesterday()
                    this.queryParams.endTime = this.getYesterday()
                break
                default: 
            }
            console.log('所以开始和结束时间是')
            console.log(this.queryParams.startTime)
            console.log('</br>')
            console.log(this.queryParams.endTime)

            this.queryParams.page = 1
            this.queryParams.pageSize = 10

            this.getSiteAbbrName( window.localStorage.getItem('_site_id_param'), () => {
                this.getSpStatistics(this.queryParams.startTime, this.queryParams.endTime, () => {
                    this.chartLine = echarts.init(document.getElementById("chartLine"));
                    this.chartLine.setOption(this.chartLineOptions);

                    this.chartPie = echarts.init(document.getElementById("chartPie"));
                    this.chartPie.setOption(this.chartPieOptions);
                })
            })
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
    mounted() {
        this.getNowFormatDate()

        this.getSiteAbbrName( window.localStorage.getItem('_site_id_param'), () => {
            this.queryParams.startTime = this.time
            this.queryParams.endTime = this.time
            this.getSpStatistics(this.queryParams.startTime, this.queryParams.endTime, () => {
                this.chartLine = echarts.init(document.getElementById("chartLine"));
                this.chartLine.setOption(this.chartLineOptions);

                this.chartPie = echarts.init(document.getElementById("chartPie"));
                this.chartPie.setOption(this.chartPieOptions);
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
