<template>
    <section class="cms-body">
        <!-- 表格 -->
        <div style="margin-top:20px; flex:auto; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;" class="content-flex-left">    
            <cms-input label="标题" :width="240" v-model="query.title" @input="checkQuery"></cms-input>
            <el-button type="primary" @click="doQuery" v-if="query.enable == true">查询</el-button>
            <el-button type="primary" v-else disabled>查询</el-button>
            <el-select v-model="query.tagId" placeholder="请选择" @change="changeTag">
                <el-option :key="-2" label="全部" value="-1"></el-option>
                <el-option :key="-1" label="无标签项" value="0"></el-option>
                <el-option
                    v-for="(item, index) in tagOptions"
                    :key="index"
                    :label="item.tagName"
                    :value="item.tagId">
                </el-option>
            </el-select>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <!-- <el-table-column prop="title" label="原标题" align="center" width="260"></el-table-column>  -->
            <el-table-column prop="tagName" label="标签名" align="center"></el-table-column>
            <!-- <el-table-column prop="subTitle" label="展示标题" align="center" width="260"></el-table-column> -->
            <el-table-column prop="status" label="状态" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.status == 0">上线</span>
                    <span v-if="scope.row.status == 1">下线</span>
                    <span v-if="scope.row.status == -1">审核失败</span>
                </div>
            </el-table-column>
            <el-table-column prop="userName" label="目击者" align="center"></el-table-column>
            <el-table-column prop="description" label="描述" align="center" width="260"></el-table-column>
            <el-table-column prop="bornTime" label="发布时间" align="center"></el-table-column>
            <el-table-column prop="videoUrl" label="目击者视频" align="center" width="300">
                <div slot-scope="scope">
                    <video :src="scope.row.videoUrl" height="160" controls></video>
                </div>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click="openEdit(scope.row)"></cms-button>
                    <cms-button type="online" v-if="scope.row.status == 1" @click="shiftStatus(scope.row.status, scope.row.id)"></cms-button>
                    <cms-button type="offline" v-if="scope.row.status == 0" @click="shiftStatus(scope.row.status, scope.row.id)"></cms-button>
                </div>
            </el-table-column>
        </el-table>

        <div class="cms-list-footer" style="padding-bottom:100px;">
            <cms-pagination :total="allTotal" @change="getPages" :pageSize="query.pageSize" :page="query.page" :init="true"></cms-pagination>
        </div>

        <el-dialog title="编辑目击者视频" :visible.sync="dialogFormVisible">
            <el-form :model="currentObj">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="currentObj.title"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="currentObj.description" disabled></el-input>
                </el-form-item>
                <el-form-item label="标签" :label-width="formLabelWidth">
                    <el-select v-model="currentObj.tagId" placeholder="请选择" @change="alterTag" v-if="enableTag == true">
                        <el-option
                            v-for="(item, index) in tagOptions"
                            :key="index"
                            :label="item.tagName"
                            :value="item.tagId">
                        </el-option>
                    </el-select>

                    <el-select v-model="currentObj.tagId" placeholder="请选择" @change="alterTag" v-else disabled>
                        <el-option
                            v-for="(item, index) in tagOptions"
                            :key="index"
                            :label="item.tagName"
                            :value="item.tagId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="展示封面" :label-width="formLabelWidth">
                    <uploader @change="getUrl" v-if="showImage" :default="currentObj.videoImg"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRow">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import axios from "axios"
    import {axiosProxy, isNull, timestampToTime} from "@/api/tool"

    export default {
        data() {
            return {
                tableData: [],
                query: {
                    title: null,
                    enable: false,
                    page: 1,
                    pageSize: 10,
                    tagId: null
                },
                currentObj: {
                    title: '',
                    videoImg: '',
                    id: '',
                    description: '',
                    tagId: ''
                },
                showImage: true,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                allTotal: null,
                tagOptions: [],
                enableTag: false
            }
        },
        methods: {
            getWitnessList (title, tagId) {
                let url = this.$api.witnessList + '?page=' + this.query.page + '&pageSize=' + this.query.pageSize
                if(title != null) {
                    url = url + '&title=' + title
                } 

                if(tagId != null) {
                    url = url + '&tagId=' + tagId
                }
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tableData = res.data.data.list
                        this.allTotal = res.data.data.total
                        for (let i in this.tableData) {
                            if(this.tableData[i].createTime) {
                                this.tableData[i].bornTime = timestampToTime(this.tableData[i].createTime)
                                this.tableData[i].bornTime = this.tableData[i].bornTime.slice(5, 16)
                            }

                            if(this.tableData[i].status == -2) {
                                this.tableData.splice(i, 1)
                            }

                            if(this.tableData[i].description !== null) {
                                if(this.tableData[i].description.indexOf('%') == -1) {
                                    this.tableData[i].description = this.tableData[i].description
                                } else {
                                    if(this.tableData[i].description.indexOf('+') == -1) {
                                        this.tableData[i].description = this.tableData[i].description
                                    } else {
                                        this.tableData[i].description = this.tableData[i].description.replace(/\+/g, '%20')
                                    }
                                    this.tableData[i].description = decodeURIComponent(this.tableData[i].description)
                                }
                            } else {
                                this.tableData[i].description = this.tableData[i].description
                            }


                            if(this.tableData[i].title !== null) {
                                if(this.tableData[i].title.indexOf('%') == -1) {
                                    this.tableData[i].title = this.tableData[i].title
                                } else {
                                    if(this.tableData[i].title.indexOf('+') == -1) {
                                        this.tableData[i].title = this.tableData[i].title
                                    } else {
                                        this.tableData[i].title = this.tableData[i].title.replace(/\+/g, '%20')
                                    }
                                    this.tableData[i].title = decodeURIComponent(this.tableData[i].title)
                                }
                            } else {
                                this.tableData[i].title = this.tableData[i].title
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

            doQuery () {
                this.getWitnessList(this.query.title, this.query.tagId)
            },

            checkQuery () {
                if(this.query.title != undefined && this.query.title != null && !isNull(this.query.title)) {
                    this.query.enable = true
                } else {
                    this.query.enable = false
                }
            },

            openEdit (rowData) {
                this.showImage = false
                this.dialogFormVisible = true
                this.currentObj = rowData
                if(this.currentObj.tagId !== '') {
                    this.enableTag = false
                } else {
                    this.enableTag = true
                }
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            },

            getUrl (imageUrl, index, imagePath, storageId) {
                this.currentObj.videoImg = imageUrl
            },

            updateRow () {
                let param = {}
                param.id = this.currentObj.id
                // param.subTitle = this.currentObj.subTitle
                param.title = this.currentObj.title
                param.description = this.currentObj.description
                param.videoImg = this.currentObj.videoImg
                param.tagId = this.currentObj.tagId
                param.tagName = this.searchTagName(this.currentObj.tagId)
                this.updatePut(param)
            },

            updatePut (param) {
                let url = this.$api.witnessUpdate
                axiosProxy.put(url, param).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        setTimeout (() => {
                            this.dialogFormVisible = false
                            this.getWitnessList(this.query.title, this.query.tagId)
                        }, 500)
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

            toggleStatus (id, status) {
                axiosProxy.put(this.$api.witnessToggle + '/' + id + '/' + status).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        setTimeout(() => {
                            this.getWitnessList(this.query.title, this.query.tagId)
                        }, 500)
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

            shiftStatus (status, id) {
                let state
                if(status == 0) {
                    state = 1
                } else if(status == 1) {
                    state = 0
                }
                this.toggleStatus(id, state)
            },

            getPages(current, size) {
                this.query.page = current
                this.query.pageSize = size
                this.getWitnessList(this.query.title, this.query.tagId)
            },

            getTags () {
                let url = this.$api.witnessTagList
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tagOptions = res.data.data
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

            changeTag (value) {
                if(value == -1 || value == '-1') {
                    value = null
                }
                this.query.tagId = value
                this.query.page = 1
                this.query.pageSize = 10
                this.getWitnessList(this.query.title, this.query.tagId)
            },

            alterTag (value) {
                this.currentObj.tagId = value
            },

            searchTagName (tagId) {
                let currentTagName
                for(let i in this.tagOptions) {
                    if(tagId == this.tagOptions[i].tagId) {
                        currentTagName = this.tagOptions[i].tagName
                    }
                }
                return currentTagName
            }
        },
        created() {
            this.$store.dispatch("setCollapse", true); //收缩状态栏
        },
        mounted() {
            this.getWitnessList(null, null)
            this.getTags()
        }
    }
</script>

<style lang="scss">
    
</style>