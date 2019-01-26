<template>
    <section class="cms-body cms-chart-box">
        <div class="cms-list-header" style="padding-left:0">
            <h5 class="data-header-title">访问日排行({{time}})</h5>
            <div class="flex-date">
                <label class="cms-label" style="margin-left:0">日期：</label>
                <el-date-picker
                    v-model="params.date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="pickDate"
                    placeholder="选择日期">
                </el-date-picker>

                <!-- <cms-input label="标题" :width="240" v-model="params.title" @input="checkQuery"></cms-input>
                <el-button type="primary" @click="doQuery" v-if="params.enable == true">查询</el-button>
                <el-button type="primary" v-else disabled>查询</el-button> -->
            </div>         
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="create_time" label="日期" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="pv" label="访问次数" align="center"></el-table-column>
            <el-table-column prop="uv" label="访问用户" align="center"></el-table-column>
            <el-table-column prop="uip" label="独立ip" align="center"></el-table-column>
            <el-table-column prop="new_user" label="新增用户" align="center"></el-table-column>
        </el-table>

        <div class="cms-list-footer" style="padding-bottom:100px;">
            <cms-pagination :total="allTotal" @change="getPages" :pageSize="params.pageSize" :page="params.page" :init="true"></cms-pagination>
        </div>
    </section>
</template>

<script>
import axios from "axios"
import {axiosProxy, checkErrorCode, axiosAjax, isNull} from "@/api/tool"
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
    data() {
        return {
            params: {
                flag: 4,
                date: null,
                page: 1,
                pageSize: 10,
                title: null,
                enable: false
            },
            allTotal: null,
            tableData: [],
            time: '',
            siteName: null,
        }
    },
    methods:{
        // 中投 获取当天
        getNowFormatDate(callback) {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            this.time = currentdate
            callback()
            return currentdate;
        },

        // 中投 获取昨天
        getYesterday() {
            var day1 = new Date();
            day1.setTime(day1.getTime()-24*60*60*1000);
            var month = day1.getMonth()+1
            var strDate = day1.getDate()
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var s1 = day1.getFullYear()+"-" + month + "-" + strDate
            return s1
        },

        // 中投 获取表格统计数据
        getStatisticData (title, time) {
            let url = '/api/Daren/dataCount/content.action?channelId=' + this.siteName + '&page=' + this.params.page + '&pageSize=' + this.params.pageSize
            if(title !== null && title !== undefined && title !== '') {
                url = url + '&title=' + title
            } 
            if(time !== null && time !== undefined && time !== '') {
                url = url + '&time=' + time
            }
            $.ajax({
                type: 'get',
                url: url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                },
                success: res => {
                    this.tableData = res.data.list
                    this.allTotal = res.data.total
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

        // 中投 检查输入的标题是否合法
        checkQuery () {
            if(this.params.title != undefined && this.params.title != null && !isNull(this.params.title)) {
                this.params.enable = true
            } else {
                this.params.enable = false
            }
        },

        // 中投 发起标题查询请求
        doQuery () {
            this.params.page = 1
            this.params.pageSize = 10
            this.getStatisticData(this.params.title, this.params.date)
        },

        // 中投 选中了日期
        pickDate (value) {
            this.getStatisticData(this.params.title, this.params.date)
        },

        // 中投 分页回调
        getPages (current, size) {
            this.params.page = current
            this.params.pageSize = size
            this.getStatisticData(null, null)
        }
    },
    created() {
        this.getSiteAbbrName(window.localStorage.getItem('_site_id_param'), () => {
            this.getNowFormatDate( () => {
                this.getStatisticData(this.params.title, this.params.date)
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
