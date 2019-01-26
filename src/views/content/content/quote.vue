<template>
    <section class="cms-body flex">
        <a class="cms-back" href="javascript:;" @click="back"></a>
        <cms-tree :hasContent='true' @click="getChannelId" treeType="page"></cms-tree>
        <div class="cms-content-right">
            <div class="cms-list-header clearfix flex">
                <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">
                    <cms-input label="标题" :width="240" v-model="queryQuote.title"></cms-input>
                    <el-button type="primary" @click="doQuery" v-if="queryEnable == true">查询</el-button>
                    <el-button type="primary" v-else disabled>查询</el-button>

                    <el-select class="cms-left" @change="doQueryModel" placeholder="所有类型" v-model="queryQuote.modelId" style="width:180px">
                        <el-option label="所有类型" value="all"></el-option>
                        <el-option v-for="item in modelList" :key="item.id" :label="item.showName" :value="item.id"> </el-option>
                    </el-select>

                    <el-select class="cms-left" @change="doQuerySite" placeholder="站点" v-model="queryQuote.siteId" style="width:180px">
                        <el-option v-for="item in siteList" :key="item.id" :label="item.shortName" :value="item.id"> </el-option>
                    </el-select>
                </div>
            </div>

            <el-table :data="copyableGroup" @selection-change="getUnderCopy">
                <el-table-column type="selection" width="65" align="center"></el-table-column>

                <el-table-column prop="id" label="ID" align="center" width=""></el-table-column>

                <el-table-column prop="title" label="标题" align="center" width="250"></el-table-column>

                <el-table-column prop="poster" label="封面" align="center" width="80">
                    <div slot-scope="scope">
                        <img :src="scope.row.poster" height="60" width="80" v-if="scope.row.poster !== null && scope.row.poster !== undefined" />
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" height="60" width="80" v-else />
                    </div>
                </el-table-column>

                <el-table-column prop="weight" label="权重" align="center" width=""></el-table-column>

                <el-table-column prop="modelShowName" label="类型" align="center" width=""></el-table-column>

                <el-table-column prop="spName" label="sp名称" align="center" width=""></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" width=""></el-table-column>

                <el-table-column prop="publishTime" label="发布时间" align="center" width=""></el-table-column>

                <el-table-column prop="status" label="状态" align="center" width="">
                    <div slot-scope="scope">
                        <span v-if="scope.row.status==1">草稿</span>
                        <span v-if="scope.row.status==5">已上线</span>
                        <span v-if="scope.row.status==6">已下线</span>
                        <span v-if="scope.row.status==7">删除</span>
                    </div>
                </el-table-column>
            </el-table>

            <div class="cms-list-footer" style="padding-bottom:100px;">
                <el-button type="primary" @click="copyContent" v-if="enableCopy">复制</el-button>
                <el-button type="primary" v-else disabled>复制</el-button>
                <cms-pagination :total="contentTotal" @change="getPages" :pageSize="queryQuote.pageSize" :page="queryQuote.page" :init="true"></cms-pagination>
            </div>
        </div>
    </section>
</template>

<script>
import listMixins from '@/mixins/list'
import {axiosProxy, checkErrorCode, axiosProxyFiles, isNull, timestampToTime} from "@/api/tool"
export default {
    mixins:[listMixins],
    data() {
        return {
            queryQuote: {
                title: null,
                page: 1,
                pageSize: 10,
                channelId: null,
                modelId: null,
                siteId: null
            }, // 列表的查询条件
            queryEnable: true, // 查询按钮是否禁用
            modelList: [], // 模型列表
            siteList: [], // 排除当前站点的站点列表
            contentTable: [], // 表格数据
            contentTotal: null, // 表格数据总条数
            underCopy: [], // 待复制的那些项
            enableCopy: false, // 复制按钮是否可用
            exsitedGroup: [], // 已经引用过的内容组
            copyableGroup: [], // 可以被引用的组
        }
    },
    methods: {
        // 执行查询
        doQuery () {
            this.getQuotedContent( () => {
                this.getContentList()
            })
        },
        // 获取已经引用的内容
        getQuotedContent (callback) {
            let url = this.$api.contentCopyCheck + '?thisSiteId=' + window.localStorage.getItem('_site_id_param') + '&citeSiteId=' + this.queryQuote.siteId
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    for (let i in res.data.data) {
                        if(this.exsitedGroup.indexOf(res.data.data[i].UUID) == -1) {
                            this.exsitedGroup.push(res.data.data[i].UUID)
                        }
                    }
                    callback()
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('请求失败')
                    }
                }
            }).catch( error => {
                console.log(error)
            })
        },
        // 分页回调
        getPages (current, size) {
            this.queryQuote.page = current
            this.queryQuote.pageSize = size
            // this.getContentList ()
            this.getQuotedContent( () => {
                this.getContentList()
            })
        },
        // 获取内容列表
        getContentList () {
            let url = this.$api.contentQuoteList + '?enable=true&page=' + this.queryQuote.page + '&pageSize=' + this.queryQuote.pageSize

            if(this.queryQuote.title !== null) {
                url = url + '&title=' + this.queryQuote.title
            }

            if(this.queryQuote.channelId !== null) {
                url = url + '&channelId=' + this.queryQuote.channelId
            }

            if(this.queryQuote.modelId !== null) {
                url = url + '&modelId=' + this.queryQuote.modelId
            }

            if(this.queryQuote.siteId !== null) {
                url = url + '&siteId=' + this.queryQuote.siteId
            } else {
                this.errorMessage('请选择一个站点')
                return false
            }

            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.copyableGroup = []
                    this.contentTable = res.data.data.list
                    this.contentTotal = res.data.data.total - this.exsitedGroup.length
                    for (let i in this.contentTable) {
                        if(this.contentTable[i].createTime !== null) {
                            this.contentTable[i].createTime = timestampToTime(this.contentTable[i].createTime).slice(5, 16)
                        } 

                        if(this.contentTable[i].publishTime !== null) {
                            this.contentTable[i].publishTime = timestampToTime(this.contentTable[i].publishTime).slice(5, 16)
                        } 

                        if(this.exsitedGroup.indexOf(this.contentTable[i].uuid) == -1) {
                            this.copyableGroup.push(this.contentTable[i])
                        } 
                    }
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('请求失败')
                    }
                }
            }).catch( error => {
                console.log(error)
            })
        },
        // 获取栏目树
        getChannelId (data, node) {
            if(data.id != '-1') {
                this.queryQuote.channelId = data.id
                window.localStorage.setItem('currentChannelId', data.id)
            } else {
                this.queryQuote.channelId = null
            }   
        },
        // 获取模型的查询条件
        doQueryModel (value) {
            if(value == 'all') {
                this.queryQuote.modelId = null
            } else {
                this.queryQuote.modelId = value
            }
        },
        // 获取站点的查询条件
        doQuerySite (value) {
            this.queryQuote.siteId = value
        },
        // 获取多选项
        getUnderCopy (data) {
            this.underCopy = data
            if(data.length > 0) {
                this.enableCopy = true
            } else {
                this.enableCopy = false
            }
        },
        // 确定复制
        copyContent () {
            this.postCopy()
        },
        // 发送复制请求
        postCopy () {
            let ids = []
            for (let i in this.underCopy) {
                ids.push(this.underCopy[i].id)
            }
            ids = ids.join(',')

            let siteId = window.localStorage.getItem('_site_id_param')

            let channelId = window.localStorage.getItem('currentChannelId')

            let url = this.$api.contentCopy + '?contentIds=' + ids + '&siteId=' + siteId + '&channelIds=' + channelId
            axiosProxy.post(url).then(res => {
                if(res.data.errorCode == 0) {
                    this.successMessage('操作成功')
                    // this.getContentList()
                    this.getQuotedContent( () => {
                        this.getContentList()
                    })
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
        // 返回上级页面
        back () {
            history.go(-1)
        },
        // 获取排除当前站点的站点列表
        getSiteList (id) {
            let url = this.$api.siteAll + '?id=' + id
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.siteList = res.data.data
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
        }
    },
    created(){
        let currentSiteId = window.localStorage.getItem('_site_id_param')
        this.modelList = JSON.parse(window.localStorage.getItem('modelList'))
        this.getSiteList(currentSiteId)
        // this.siteList = JSON.parse(window.localStorage.getItem('siteList'))

        // for (let i in this.siteList) {
        //     if(this.siteList[i].id == currentSiteId) {
        //         this.siteList.splice(i, 1)
        //     }
        // }
    },
    mounted() {
        this.$store.dispatch("setCollapse", true)
        let clientHeight = document.body.clientHeight
        $(".cms-body").css("minHeight", clientHeight - 110 + "px")
    },
}
</script>

<style>
    .tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}

.red-color {
  color: red;
}


.cms-table-button{
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height:1;
  border-radius: 4px;
  background: #000;
  color: #fff;
  position: relative;
  text-align: center;
  font-size: 14px;
  top:-2px;
  margin-left: 2px;
  transition: 0.2s;
  &:first-child{
    margin-left: 0px;
  }
  &:hover{
    opacity: 0.65;
  }
  &.edit{
    background: #17d57e;
    &::after{
      content: '\e662';
      position: relative;
      top:5px;
    }
  }
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-button-group .el-button--success:last-child {
  width: 50px;
  min-width: 50px;
}
.el-dialog {
  width: 80%;
  margin-top: 50px;
}
</style>
