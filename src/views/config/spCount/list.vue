<template>
    <div>
        <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
            <div style="margin-top:16px;flex:auto" class="content-flex-left">
                <el-select v-model="queryParams.spName" placeholder="请选择站点" @change="valueChange">
                    <el-option lable="全部站点" value="全部站点"></el-option>
                    <el-option
                        v-for="item in siteGroup"
                        :key="item.id"
                        :label="item.shortName"
                        :value="item.shortName">
                    </el-option>
                </el-select>
                <el-date-picker @change="pickDate" format="yyyy 年 MM 月 dd 日" v-model="timeSelector" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
            </div>

            <div style="margin-top:16px;flex:auto" class="content-flex-right">
                <el-button @click="exportExcel" type="warning">导出表格</el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" stripe @row-click="showDetail" v-if="showTable">
            <el-table-column type="selection" width="65" align="center"></el-table-column>
            <!-- <el-table-column prop="spId" label="spID" align="center"></el-table-column> -->
            <el-table-column prop="spName" label="频道名称" align="center"></el-table-column>
            <el-table-column prop="dateTime" label="日期" align="center"></el-table-column>
            <el-table-column prop="viNumber" label="点播数量" align="center"></el-table-column>
            <el-table-column prop="lvNumber" label="直播数量" align="center"></el-table-column>
            <el-table-column prop="arNumber" label="图文数量" align="center"></el-table-column>
            <el-table-column prop="dayNumber" label="日总量" align="center"></el-table-column>
            <!-- <el-table-column prop="createTime" label="统计时间" align="center"></el-table-column> -->
        </el-table>

        <div class="cms-list-footer" style="padding-bottom:100px;" v-if="showTable">
            <cms-pagination :total="allTotal" @change="getPages" :pageSize="queryParams.pageSize" :page="queryParams.page" :init="true"></cms-pagination>
        </div>

        <el-dialog title="详细数据" :visible.sync="dialogVisible">
            <el-table :data="detailGroup" style="width: 100%" stripe>
                <el-table-column prop="spName" label="频道名称" align="center"></el-table-column>
                <el-table-column prop="viNumber" label="点播数量" align="center"></el-table-column>
                <el-table-column prop="lvNumber" label="直播数量" align="center"></el-table-column>
                <el-table-column prop="arNumber" label="图文数量" align="center"></el-table-column>
                <el-table-column prop="dayNumber" label="日总量" align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import axios from "axios";
    import {axiosProxy, isNull, timestampToTime} from "@/api/tool"
    import va from "@/rules";
    export default {
        data() {
            return {
                showTable: true,
                allTotal: null,
                tableData: [],
                queryParams: {
                    page: 1,
                    pageSize: 10,
                    spName: null,
                    startTime: null,
                    endTime: null
                },
                totalPages: null,
                detailGroup: [],
                dialogVisible: false,
                siteGroup: [],
                timeSelector: '',
                excelData: [],
                columns1: [
                    {
                        title: '频道名称',
                        key: 'spName'
                    },
                    {
                        title: '日期',
                        key: 'dateTime'
                    },
                    {
                        title: '点播数量',
                        key: 'viNumber'
                    },
                    {
                        title: '直播数量',
                        key: 'lvNumber'
                    },
                    {
                        title: '图文数量',
                        key: 'arNumber'
                    }, 
                    {
                        title: '日总量',
                        key: 'dayNumber'
                    }
                ]
            }
        },
        methods:{
            // 点击表格的某一行时
            showDetail (row, event, column) {
                this.dialogVisible = true
                let spId = row.spId
                let spDate = row.dateTime.replace(/\//g,"-")
                this.getDetail(spId, spDate)
            },
            // 获取sp的详情
            getDetail (spId, spDate) {
                let url = this.$api.spDetail + '?pid=' + spId + '&dateTime=' + spDate 
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.detailGroup = res.data.data
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
            // 站点的下拉值改变之后的事件
            valueChange (value) {
                let spName
                if(value == '全部站点') {
                    spName = null
                } else {
                    spName = value
                }
                this.queryParams.spName = spName
                this.getSpCountList(1, 10, spName, this.queryParams.startTime, this.queryParams.endTime)
            },
            // 获取站点列表
            getSiteList () {
                let url = this.$api.siteAll
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.siteGroup = res.data.data
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
            // 获取sp上传统计的表格
            getSpCountList(page, pageSize, spName, startTime, endTime) {
                let url = this.$api.spStatistic + '?page=' + page + '&pageSize=' + pageSize

                if(spName !== null) {
                    url = url + '&spName=' + spName
                }

                if(startTime !== null) {
                    url = url + '&startTime=' + startTime
                }

                if(endTime !== null) {
                    url = url + '&endTime=' + endTime
                }

                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tableData = res.data.data.list
                        this.excelData = this.excelData.concat(res.data.data.list)
                        this.allTotal = res.data.data.total
                        this.totalPages = res.data.data.pages

                        for( let i in this.tableData) {
                            if(this.tableData[i].createTime != null) {
                                this.tableData[i].createTime = timestampToTime(this.tableData[i].createTime)
                            }

                            if(this.tableData[i].dateTime != null) {
                                this.tableData[i].dateTime = timestampToTime(this.tableData[i].dateTime)
                                this.tableData[i].dateTime = this.tableData[i].dateTime.slice(0, 10)
                            }
                        }

                        for( let i in this.excelData) {
                            if(this.excelData[i].createTime != null) {
                                this.excelData[i].createTime = timestampToTime(this.excelData[i].createTime)
                            }

                            if(this.excelData[i].dateTime != null) {
                                this.excelData[i].dateTime = timestampToTime(this.excelData[i].dateTime)
                                this.excelData[i].dateTime = this.excelData[i].dateTime.slice(0, 10)
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

            // 获取选好了的开始和结束日期
            pickDate (value) {
                this.queryParams.startTime = this.timeSelector[0]
                this.queryParams.endTime = this.timeSelector[1]
                this.getSpCountList(1, 10, this.queryParams.spName, this.queryParams.startTime, this.queryParams.endTime)
            },

            // spName输入框的空格检测
            checkNull () {
                if(isNull(this.queryParams.spName)) {
                    this.queryParams.spName = null
                }
            },

            // 开始根据spname查表格数据
            querySpName () {
                this.getSpCountList(1, 10, this.queryParams.spName, this.queryParams.startTime, this.queryParams.endTime)
            },

            // 获取分页数据
            getPages (current, size) {
                this.queryParams.page = current
                this.queryParams.pageSize = size
                this.getSpCountList(current, size, this.queryParams.spName, this.queryParams.startTime, this.queryParams.endTime)
            },

            collectExcelData(callback) {
                for (let i = 1; i <= this.totalPages; i++) {
                    this.getSpCountList(i, this.queryParams.pageSize, this.queryParams.spName, this.queryParams.startTime, this.queryParams.endTime)
                }
                setTimeout( () => {
                    callback()
                }, 500)
            },

            // 导出表格按钮响应事件
            exportExcel () {
                this.excelData = []
                this.$confirm("确认导出为Excel表格?", "警告", { type: "warning" }).then(mes => {
                    this.collectExcelData( () => {
                        this.export2Excel() 
                        this.showTable = false

                        setTimeout(() => {
                            this.showTable = true
                        }, 100)
                    })
                    
                    // this.excelData = []
                }).catch( error => {
                    console.log(error)
                })
            },

            // 导出excel表格 
            formatJson(filterVal, jsonData) {
        　　　　return jsonData.map(v => filterVal.map(j => v[j]))
        　  },

            // 导出excel表格
            export2Excel() {
                let that = this;
        　　　　 require.ensure([], () => {
        　　　　　　 const { export_json_to_excel } = require('@/vendor/Export2Excel');
        　　　　　　 const tHeader = [that.columns1[0].title, that.columns1[1].title, that.columns1[2].title, that.columns1[3].title, that.columns1[4].title, that.columns1[5].title];
        　　　　　　 const filterVal = [that.columns1[0].key, that.columns1[1].key, that.columns1[2].key, that.columns1[3].key, that.columns1[4].key, that.columns1[5].key];
        　　　　　　 const list = that.excelData;
                
        　　　　　　 const data = this.formatJson(filterVal, list);
        　　　　　　 export_json_to_excel(tHeader, data, 'sp上传统计');
        　　　　 })
        　  }
        },
        created(){
            this.$store.dispatch("setCollapse", true)
        },
        mounted (){
            this.getSpCountList(1, 10, null, null, null)
            this.getSiteList()
        }
    }
</script>
<style>
    .content-fiexd {
        bottom: auto;
    }
    .cell {
        cursor: hand;
        cursor: pointer;
    }
</style>
