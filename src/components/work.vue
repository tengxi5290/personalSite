<template>
    <div style="background:#ecf0f5;">
        <el-row :gutter="24">
            <el-col :xs="24" :sm="12" :md="12" :lg="6" class="span24 index-flex">
                <div class="bg-box">
                    <div class="bg-green bg-icon">
                        <span class="iconfont icon-shipin1"></span>
                        <p class="icon-title">直播</p>
                    </div>
                    <div class="bg-info">
                        <p class="today-count">今日&nbsp;&nbsp;<span class="count-num">{{countObj.d_lvNumber}}&nbsp;</span>
                          <!-- <span class="up-num">({{page.pageNum.contentDayUncheckCount}})</span> -->
                        </p>
                        <p class="all-count">月总量:&nbsp;&nbsp;{{countObj.m_lvNumber}}</p>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" class="span24 index-flex">
                <div class="bg-box">
                    <div class="bg-yellow bg-icon">
                        <span class="iconfont icon-APPshouyetubiao-dingdan"></span>
                          <p class="icon-title">点播</p>
                    </div>
                    <div class="bg-info">
                        <p class="today-count">今日&nbsp;&nbsp;<span class="count-num">{{countObj.d_viNumber}}&nbsp;</span>
                            <!-- <span class="up-num">({{page.pageNum.commentDayUncheckCount}})</span> -->
                        </p>
                        <p class="all-count">月总量:&nbsp;&nbsp;{{countObj.m_viNumber}}</p>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" class="span24 index-flex">
                <div class="bg-box">
                    <div class="bg-blue bg-icon">
                        <span class="iconfont icon-unie62e"></span>
                        <p class="icon-title">图文</p>
                    </div>
                    <div class="bg-info">
                        <p class="today-count">今日&nbsp;&nbsp;<span class="count-num">{{countObj.d_arNumber}}</span>
                            <!-- <span class="up-num">({{page.pageNum.guestbookDayUncheckTotalCount}})</span> -->
                        </p>
                        <p class="all-count">月总量:&nbsp;&nbsp;{{countObj.m_arNumber}}</p>
                    </div>
                </div>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="6" class="span24 index-flex"> 
                <div class="bg-box">
                    <div class="bg-purple bg-icon">
                        <span class="iconfont icon-barschart"></span>
                        <p class="icon-title">综合总量</p>
                    </div>
                    <div class="bg-info">
                        <p class="today-count">今日&nbsp;&nbsp;<span class="count-num">{{countObj.d_total}}</span>
                          <!-- <span class="up-num"></span> -->
                        </p>
                        <p class="all-count">累计:&nbsp;&nbsp;{{countObj.m_total}}</p>
                    </div>
                </div>
            </el-col>
        </el-row>



        <el-row :gutter="24">
            <!--趋势分析-->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24">
                <div class="h358">
                    <div class="work-header">
                       <span>趋势分析</span>
                       <a href="javascript:void(0)" @click="routerLink('/traffic/trend','')" class="iconfont icon-gengduo"></a>
                    </div>
                    <div class="work-body">
                        <div id="chartLine" style="height:308px"></div>
                    </div>
                </div>
            </el-col>




            <!--错误日志-->
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 ">
                <div class="h358">
                    <div class="work-header">
                        <span>错误日志</span>
                        <!-- <a href="javascript:void(0)" @click="routerLink('/sourceanalysis/class','')" class="iconfont icon-gengduo"></a> -->
                    </div>
                    <div class="work-body error-log">
                        <!-- <div id="chartPie" style="height:308px"></div> -->
                        <div>
                            <el-table :data="errorTable" stripe style="width: 100%">
                                <el-table-column prop="classMethod" label="异常方法名" align="center"></el-table-column>
                                <el-table-column prop="className" label="异常类名" align="center"></el-table-column>
                                <el-table-column prop="errorMessage" label="异常类型" align="center"></el-table-column>
                                <el-table-column prop="createTime" label="异常时间" align="center"></el-table-column>
                                <el-table-column label="查看异常详情" align="center">
                                    <div slot-scope="scope">
                                        <cms-button type="view" @click="viewErrorDetail(scope.row)"></cms-button>
                                    </div>
                                </el-table-column>
                            </el-table>
                        </div>

                        <el-dialog title="异常详情" :visible.sync="dialogVisible" width="30%">
                            <div style="word-wrap: break-word;">{{error_detail}}</div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </div>
            </el-col>
        </el-row>






        <!-- 访问日排行 -->
        <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 ">
                <div class="h440">
                    <div class="work-header">
                        <span>访问排行</span>
                        <a href="javascript:void(0)" @click="routerLink('/sourceanalysis/keywords','')" class="iconfont icon-gengduo"></a>
                    </div>
                    <div class="work-body day-count">
                        <el-table :data="dayCount" stripe style="width: 100%">
                            <el-table-column prop="title" label="标题" align="center"></el-table-column>
                            <el-table-column prop="pv" label="访问次数" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
       
          <!-- 来访域名 -->

            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="span24 ">
                <div class="h440">
                    <div class="work-header">
                        <span>统计详情</span>
                        <!-- <a href="javascript:void(0)" @click="routerLink('/sourceanalysis/domain','')" class="iconfont icon-gengduo"></a> -->
                    </div>
                    <div class="work-body">
                        <el-table :data="spData" stripe style="width: 100%">
                            <el-table-column prop="spName" label="频道名称" align="center"></el-table-column>
                            <el-table-column prop="dateTime" label="日期" align="center"></el-table-column>
                            <el-table-column prop="viNumber" label="点播数量" align="center"></el-table-column>
                            <el-table-column prop="lvNumber" label="直播数量" align="center"></el-table-column>
                            <el-table-column prop="arNumber" label="图文数量" align="center"></el-table-column>
                            <el-table-column prop="dayNumber" label="日总量" align="center"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>



         <!-- 系统信息 -->
        <div class="systemInfo">
            <span>
                当前系统版本:&nbsp;&nbsp;cms v1.0 
            </span>
            <span>
                <!-- 上次登录时间: &nbsp;&nbsp;{{page.pageNum.lastLoginTime}} -->
            </span>
            <span>
                <!-- 已用内存: &nbsp;&nbsp;{{page.pageNum.usedMemory}}MB   -->
            </span>
            <span>
                <!-- 剩余内存:&nbsp;&nbsp;{{page.pageNum.useableMemory}}MB    -->
            </span>
            <span>
                <!-- 最大内存:&nbsp;&nbsp; {{page.pageNum.maxMemory}}MB -->
            </span>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {axiosProxy, checkErrorCode, axiosAjax, timestampToTime} from "@/api/tool"
export default {
    data() {
        return {
            data: [],
            siteId: null, // 当前站点
            countObj: {}, // 统计数据对象

            errorTable: [], // 错误日志列表集合
            currentRole: null, // 当前用户角色
            dialogVisible: false, // 错误详情蒙版是否显示
            error_detail: null, // 当前错误详情


            chartLine: null, // 折线图对象

            dayCount: [], // 日排行数据集


            currentSiteName: null, // 当前站点名字
            spData: [], // 统计详情数据



            params:{
                type:'source',  //查询分类
                flag:'1',  //查询范围
                target:'',  //查询指标
                year:'',  //年度
                begin:'',  //开始日期
                end:'',  //结束日期
                orderBy:'',  //排序
                count:'10',
            },
            page:{
                //页面数据
                source:[],  //来访域名  type:array
                keyword:[],  //搜索词   type:array
                pageNum:'',
                adminNum:'',//会员数
                pv:[],//获取pv、
                ip:[],//ip、
                fk:[], //访客数信息
                avg:[],//平均访问时长  
                wd:[],//时间维度
                ss:[],//来源分析
                ssKey:[],//来源键
                sum:'',
                sumkey:'',
            },

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
                    boundaryGap: false,
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
                        smooth: true, //这句就是让曲线变平滑的

                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: "访问用户",
                        type: "line",
                        showSymbol: false,
                        smooth: true, //这句就是让曲线变平滑的

                        data: [345, 456, 111, 675, 345, 562, 222]
                    },
                    {
                        name: "独立ip",
                        type: "line",
                        showSymbol: false,
                        smooth: true, //这句就是让曲线变平滑的
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }, 
                    {
                        name: "新增用户",
                        type: "line",
                        showSymbol: false,
                        smooth: true,
                        data: [34, 667, 124, 45, 679, 578, 111]
                    }
                ]
            },
        };
    },
    methods: {
        // 中投 获取统计数据
        getSpCount() {
            let url = this.$api.spCount + '?siteId=' + this.siteId
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.countObj = res.data.data
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

        // 中投 获取错误日志列表
        getErrorList () {
            let url = this.$api.errorLogList
            axiosProxy.get(url).then( res => {
            if(res.data.errorCode == 0) {
                this.errorTable = res.data.data
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

        // 中投 查看异常详情
        viewErrorDetail (obj) {
            this.dialogVisible = true
            this.error_detail = obj.errorDetails
        },

        // 中投 获取全部站点列表
        getCurrentSite(callback) {
            if(window.localStorage.getItem('_site_id_param') !== null) {
                this.siteId = window.localStorage.getItem('_site_id_param')
                axiosProxy.get(this.$api.siteList).then( res => {
                    for (let i in res.data.data) {
                        if(res.data.data[i].current == true) {
                            this.currentSiteName = res.data.data[i].shortName
                        }
                    }
                    callback()
                }).catch( error => {
                  console.log(error)
                })
            } else {
                axiosProxy.get(this.$api.siteList).then( res => {
                    for (let i in res.data.data) {
                        if(res.data.data[i].current == true) {
                            this.siteId = res.data.data[i].id
                            this.currentSiteName = res.data.data[i].shortName
                            callback()
                        }
                    }
                }).catch( error => {
                  console.log(error)
                })
            }
        },

        // 中投 获取折线图信息
        getLineDetail (callback) {
            let url = '/api/Daren/dataCount/channel.action?channelId=' + this.siteName
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
                    for (let i in res.data) {
                        dateArray.push(res.data[i].create_time.slice(5, res.data[i].create_time.length))
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

        // 中投 获取站点缩写
        getSiteAbbrName (currentSiteId, callback) {
            axiosProxy.get(this.$api.site + '/' + currentSiteId).then( res => {
                if(res.data.errorCode == 0) {
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

        // 中投 获取表格统计数据
        getStatisticData () {
            let url = '/api/Daren/dataCount/content.action?channelId=' + this.siteName + '&page=1' + '&pageSize=' + 5
            $.ajax({
                type: 'get',
                url: url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                },
                success: res => {
                    this.dayCount = res.data.list
                },
                error: res => {
                    console.log(res)
                }
            })
        },

        // 中投 绘制图表
        createChart(){
            this.chartLine.resize();
        },

        // 中投 获取上传统计一周数据
        getSpStatistics () {
            var startTime = this.getSelectDate()[0]
            var endTime = this.getSelectDate()[1]
            let url = this.$api.spStatistic + '?page=1&pageSize=10&spName=' + this.currentSiteName + '&startTime=' + startTime + '&endTime=' + endTime
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.spData = res.data.data.list
                    for( let i in this.spData) {
                        if(this.spData[i].dateTime != null) {
                            this.spData[i].dateTime = timestampToTime(this.spData[i].dateTime)
                            this.spData[i].dateTime = this.spData[i].dateTime.slice(0, 10)
                        }
                    }
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
        }
    },
    created () {
        this.getCurrentSite(() => {
            this.getSpCount()
            this.getSpStatistics()
            this.getSiteAbbrName(this.siteId, () => {
                this.getLineDetail( () => {
                    this.chartLine = echarts.init(document.getElementById("chartLine"));           
                    this.chartLine.setOption(this.chartLineOptions);
                    window.addEventListener('resize', this.createChart);
                })
                this.getStatisticData()
            })
        })
        this.getErrorList()
        this.getSelectDate()
    }
}
</script>

<style lang="scss" scoped>
.gray-bg{

}
.span24 {
  margin-bottom: 24px;
}

.bg-box {
  background: #fff;
  height: 112px;
  display: flex;
  .bg-green {
    background: #17d57e;
  }
  .bg-yellow {
    background: #fec92b;
  }
  .bg-blue {
    background: #2da3fb;
  }
  .bg-purple {
    background: #c172d8;
  }
}

.bg-icon {
  text-align: center;
  padding-top: 22px;
  width: 35%;
  height: 100%;
  .iconfont {
    margin-top: 24px;
    font-size: 40px;
    color: #fff;
    text-align: center;
  }
  .icon-title {
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
}
.bg-info {
  width: 65%;
  padding: 24px;
}
.today-count {
  color: #5a5e66;
  font-size: 14px;
  .count-num {
    font-size: 18px;
    position: relative;
    top: 2px;
    margin-right: 4px;
    color: #353535;
  }
  .up-num {
    font-size: 14px;
    color: #ff724c;
  }
}
.all-count {
  font-size: 14px;
  color: #999;
  margin-top: 24px;
}
.h358 {
  height: 358px;
  background: #fff;
}
.h440 {
  height: 440px;
  background: #fff;
}
.work-header {
  height: 50px;
  line-height: 50px;
  padding: 0 16px 0 24px;
  display: flex;
  justify-content: space-between;
  .iconfont {
    font-size: 20px;
    color: #999999;
    &:hover {
      color: #353535;
    }
  }
}
.work-body {
  background: #fff;
  height: 308px;
  padding: 0 24px;
}
.error-log {
  overflow-y: scroll;
}
.day-count {
    overflow-y: scroll;
}
.index-table {
  /*width: 100%;*/
  th {
    color: #878d99;
    font-size: 12px;
    padding-bottom: 10px;
  }
  td {
    border-bottom: 1px dotted #e6ebf3;
    height: 32px;
    line-height: 32px;
    color: #5a5e66;
    font-size: 12px;
  }
  tr:last-child{
    td{ border-bottom: none;}
  }
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.systemInfo{
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 12px;
  margin-bottom:12px;

  span{
        margin-right: 14px;
  }
}

.el-dialog__body {
  min-height: 200px;
}

.no-data {
    line-height: 60px;
    text-align: center;
    border-top: 2px solid #e6ebf5 !important;
    border-bottom: 1px solid #e6ebf5 !important;
    color: #909399;
    font-size: 14px;
}
</style>

