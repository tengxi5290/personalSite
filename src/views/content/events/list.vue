<template>
    <section class="cms-body">
        <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">
            <el-button type="success" @click="addIntroduce">新增活动推荐</el-button>
            <el-switch v-model="queryEvents.private" active-text="公有" inactive-text="私有" @change="searchByPrivate"></el-switch>
        </div>
        <el-table :data="tableData" @selection-change="multiDelete">
            <el-table-column type="selection" width="65" align="center"></el-table-column>

            <el-table-column prop="id" label="ID" align="center" width=""></el-table-column>

            <el-table-column prop="title" label="标题" align="center" width="200"></el-table-column>

            <el-table-column prop="img" label="封面图" align="center" width="200">
                <div slot-scope="scope">
                    <img :src="scope.row.img" alt="" height="100" width="auto" v-if="scope.row.img != null && scope.row.img != undefined" />
                    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
                </div>
            </el-table-column>

            <el-table-column prop="icon" label="角标" align="center" width="200">
                <div slot-scope="scope">
                    <img :src="scope.row.icon" alt="" height="100" width="auto" v-if="scope.row.icon != null && scope.row.icon != undefined" />
                    <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
                </div>
            </el-table-column>

            <el-table-column prop="spId" label="spId" align="center" width="200"></el-table-column>

            <el-table-column prop="thirdUrl" label="外链路径" align="center" width=""></el-table-column>

            <el-table-column prop="enable" label="可用" align="center" width="">
                <div slot-scope="scope">
                    <span v-if="scope.row.enable == 1">可用</span>                    
                    <span v-if="scope.row.enable == 0">禁用</span>
                </div>
            </el-table-column>

            <el-table-column label="操作" align="center" width="">
                <div slot-scope="scope">
                    <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>
                    <cms-button type="delete" @click="toDelete(scope.row)"></cms-button>
                </div>
            </el-table-column>
        </el-table>

        <div class="cms-list-footer" style="padding-bottom:100px;">
            <el-button type="info" v-if="enableButton" @click="deleteMulti">批量删除</el-button>
            <el-button type="info" v-else disabled>批量删除</el-button>
            <cms-pagination :total="tableTotal" @change="getPages" :pageSize="queryEvents.pageSize" :page="queryEvents.page" :init="true"></cms-pagination>
        </div>

        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="handleClose">
            <el-form v-model="eventForm" class="cms-form">
                <el-form-item :label-width="formLabelWidth" label="标题" class="flex-50">
                    <el-input v-model="eventForm.title"></el-input>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="spId" class="flex-50">
                    <el-input v-model="eventForm.spId" type="number"></el-input>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="外链路径" class="flex-100">
                    <el-input placeholder="请输入内容" v-model="eventForm.thirdUrl" class="input-with-select" v-if="showHttp">
                        <el-select v-model="eventForm.protocalType" slot="prepend" placeholder="请选择" @change="selectProtocal">
                            <el-option label="http" value="1"></el-option>
                            <el-option label="https" value="2"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="封面图" class="flex-50">
                    <uploader @change="getUrl" v-if="showImage" :default="eventForm.img"></uploader>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="角标" class="flex-50">
                    <uploader @change="getIcon" v-if="showImage" :default="eventForm.icon"></uploader>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="可用" class="flex-50">
                    <el-radio-group v-model="eventForm.enable">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd" v-if="currentMode == 'add'">确 定</el-button>
                <el-button type="warning" @click="sureUpdate" v-if="currentMode == 'update'">更 新</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import listMixins from "@/mixins/list"
    import axios from "axios"
    import {axiosProxy, checkErrorCode, isNull, timestampToTime} from "@/api/tool"
    export default {
        mixins: [listMixins],
        data() {
            return {
                tableData: [], // 表格数据
                deleteGroup: [], // 批量删除数据组
                enableButton: false, // 批量删除按钮是否可用
                tableTotal: null, // 表格数据总条数
                queryEvents: {
                    page: 1,
                    pageSize: 10,
                    private: null
                },
                currentSiteId: null, // 当前站点id

                input5: '',
                select: '',
                showHttp: true, // 是否显示http选项框

                eventForm: {
                    id: null,
                    img: null,
                    title: null,
                    thirdId: null,
                    enable: 1,
                    thirdUrl: null,
                    type: 4,
                    siteId: null,
                    icon: null,
                    spId: null,
                    protocalType: null,
                }, // 表单数据项
                formLabelWidth: '120px', // 标签宽度
                dialogFormVisible: false, // 新增或编辑蒙版是否可见
                formTitle: null, // 新增或编辑蒙版标题

                currentMode: null, // 当前是编辑还是新增
                showImage: true, // 显示上传图片组件
            }
        },
        methods: {
            // 选择网络协议回调
            selectProtocal (value) {
                this.showHttp = false
                switch(value) {
                    case 1:
                    case '1':
                        this.eventForm.protocalType = 'http'
                    break
                    case 2:
                    case '2':
                        this.eventForm.protocalType = 'https'
                    break
                    default: 
                }
                setTimeout(() => {
                    this.showHttp = true
                }, 100)
            },

            // 根据公有私有查询
            searchByPrivate (value) {
                if(value == false) {
                    this.currentSiteId = this.eventForm.siteId
                    this.getEvents()
                } else {
                    this.currentSiteId = 0
                    this.getEvents()
                }
            },

            // 获取模板列表
            getEvents () {
                let url = this.$api.eventsList + '/' + this.currentSiteId + '?page=' + this.queryEvents.page + '&pageSize=' + this.queryEvents.pageSize
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tableData = res.data.data.list
                        this.tableTotal = res.data.data.total
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

            // 关闭蒙版回调
            handleClose () {
                this.getEvents()
            },


            // 新增活动推荐按钮
            addIntroduce () {
                this.resetForm()
                this.dialogFormVisible = true
                this.currentMode = 'add'
                this.formTitle = '新增活动推荐'
            },

            // 获取待批量删除数据组
            multiDelete (data) {
                this.deleteGroup = data
                if(data.length > 0) {
                    this.enableButton = true
                } else {
                    this.enableButton = false
                }
            },

            // 点击了编辑的按钮
            toEdit (obj) {
                this.resetForm()
                this.dialogFormVisible = true
                this.currentMode = 'update'
                this.formTitle = '编辑活动推荐'
                this.eventForm = obj
                if(obj.enable == true) {
                    obj.enable = 1
                } else {
                    obj.enable = 0
                }
                if(obj.thirdUrl.indexOf('https') == -1) {
                    if(obj.thirdUrl.indexOf('http') == -1) {

                    } else {
                        this.eventForm.protocalType = 'http'
                        this.eventForm.thirdUrl = this.eventForm.thirdUrl.match(/http(\S*)/)[1].slice(3, this.eventForm.thirdUrl.length)
                    }
                } else {
                    this.eventForm.protocalType = 'https'
                    this.eventForm.thirdUrl = this.eventForm.thirdUrl.match(/https(\S*)/)[1].slice(3, this.eventForm.thirdUrl.length)
                }
            },

            // 点击了删除的按钮
            toDelete (obj) {
                let ids = obj.id
                this.$confirm('确定删除该项活动推荐?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(ids)
                }).catch( error => {
                    console.log(error)    
                })
            },

            // 开始执行批量删除
            deleteMulti () {
                let idGroup = []

                for (let i in this.deleteGroup) {
                    idGroup.push(this.deleteGroup[i].id)
                }

                let ids = idGroup.join(',')

                this.$confirm('确定删除该项活动推荐?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(ids)
                }).catch( error => {
                    console.log(error)    
                })
            },

            // 分页回调
            getPages (current, size) {
                this.queryEvents.pageSize = size
                this.queryEvents.page = current
                this.getEvents()
            },

            // 上传图片回调
            getUrl (imageUrl, index, imagePath, storageId) {
                this.eventForm.img = imageUrl
            },

            // 上传角标回调
            getIcon (imageUrl, index, imagePath, storageId) {
                this.eventForm.icon = imageUrl
            },

            // 确认新增
            sureAdd () {
                if(this.eventForm.thirdUrl.indexOf('https') == -1) {
                    if(this.eventForm.thirdUrl.indexOf('http') == -1) {
                        this.eventForm.thirdUrl = this.eventForm.protocalType + '://' + this.eventForm.thirdUrl
                    } 
                }
                this.postAdd(this.eventForm)
            },

            // 确认更新
            sureUpdate () {
                if(this.eventForm.thirdUrl.indexOf('https') == -1) {
                    if(this.eventForm.thirdUrl.indexOf('http') == -1) {
                        this.eventForm.thirdUrl = this.eventForm.protocalType + '://' + this.eventForm.thirdUrl
                    } 
                } 
                this.postAdd(this.eventForm)
            },

            // 重置表单相
            resetForm () {
                for (let i in this.eventForm) {
                    this.eventForm[i] = null
                }
                this.showImage = false
                this.eventForm.type = 4
                this.eventForm.enable = 1
                this.eventForm.siteId = this.currentSiteId
                setTimeout (() => {
                    this.showImage = true
                }, 100)
            },

            // 提交新增，更新参数
            postAdd (element) {
                let url = this.$api.eventsSave
                axiosProxy.post(url, element).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.dialogFormVisible = false
                        this.getEvents()
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

            // 发删除请求
            postDelete (ids) {
                let url = this.$api.eventsDelete + '/' + ids
                axiosProxy.delete(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getEvents()
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
        mounted() {
          let clientHeight = document.body.clientHeight
          $(".cms-body").css("minHeight", clientHeight - 110 + "px")
          this.$store.dispatch("setCollapse", true)
        },
        created() {
            let siteId = window.localStorage.getItem('_site_id_param')
            this.currentSiteId = siteId
            this.eventForm.siteId = siteId
            this.getEvents()
        }
    }
</script>

<style lang="scss">
    .el-dialog {
        margin-top: 100px!important;
        width: 80%;
    }
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
