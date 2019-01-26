<template>
    <section class="cms-body">
        <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">
            <el-button type="success" @click="addBlock">新增详情页区块</el-button>
            <el-button type="danger" @click="clearStorage">清理缓存</el-button>
            <el-switch v-model="queryTemplate.private" active-text="公有" inactive-text="私有" @change="searchByPrivate"></el-switch>
        </div>
        <el-table :data="tableData" @selection-change="multiDelete">
            <el-table-column type="selection" width="65" align="center"></el-table-column>

            <el-table-column prop="id" label="ID" align="center" width=""></el-table-column>

            <el-table-column prop="blockName" label="区块名称" align="center" width="200"></el-table-column>

            <el-table-column prop="showName" label="展示名称" align="center" width="200"></el-table-column>

            <el-table-column prop="sort" label="排序" align="center" width=""></el-table-column>

            <el-table-column prop="enable" label="可用" align="center" width="">
                <div slot-scope="scope">
                    <span v-if="scope.row.enable == 1">可用</span>                    
                    <span v-if="scope.row.enable == 0">禁用</span>
                </div>
            </el-table-column>

            <el-table-column prop="blockType" label="区块类型" align="center" width=""></el-table-column>

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
            <cms-pagination :total="tableTotal" @change="getPages" :pageSize="queryTemplate.pageSize" :page="queryTemplate.page" :init="true"></cms-pagination>
        </div>


        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form v-model="templateForm">
                <el-form-item :label-width="formLabelWidth" label="区块名称">
                    <el-radio-group v-model="templateForm.blockType">
                        <el-radio :label="1">商品</el-radio>
                        <el-radio :label="2">片花咨询</el-radio>
                        <el-radio :label="3">活动推荐</el-radio>
                        <el-radio :label="4">相关内容</el-radio>
                        <el-radio :label="5">内容详情</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- <el-form-item :label-width="formLabelWidth" label="区块类型">
                    <el-input v-model="templateForm.blockType" type="number"></el-input>
                </el-form-item> -->

                <el-form-item :label-width="formLabelWidth" label="展示名称">
                    <el-input v-model="templateForm.showName"></el-input>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="排序">
                    <el-input v-model="templateForm.sort" type="number" @blur="checkSort"></el-input>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth" label="可用">
                    <el-radio-group v-model="templateForm.enable">
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
                currentSiteId: null, // 当前站点id
                tableData: [], // 模板列表
                tableTotal: null, // 总数据条数
                queryTemplate: {
                    page: 1,
                    pageSize: 10,
                    private: null
                }, // 模板列表查询参数


                templateForm: {
                    id: null,
                    blockName: null,
                    blockType: null,
                    showName: null,
                    sort: null,
                    enable: 1,
                    type: 1,
                    siteId: null
                }, // 表单数据项
                formLabelWidth: '120px', // 标签宽度
                dialogFormVisible: false, // 新增或编辑蒙版是否可见
                formTitle: null, // 新增或编辑蒙版标题

                currentMode: null, // 当前是编辑还是新增

                deleteGroup: [], // 批量删除的数组
                enableButton: false, // 批量删除的按钮是否可用
            }
        },
        methods: {
            // 清理缓存按钮
            clearStorage () {
                axiosProxy.get(this.$api.contentStorage + '/' + this.currentSiteId).then( res => {
                    if(res.data.errorCode == 0) {
                        if(res.data.data == true) {
                            this.successMessage('缓存清理成功')
                        } else {
                            this.errorMessage('操作失败')
                        }
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                }).catch (error => {
                    console.log(error)
                })
            },

            // 根据公有私有查询
            searchByPrivate (value) {
                if(value == false) {
                    this.currentSiteId = this.queryTemplate.siteId
                    this.getTemplates()
                } else {
                    this.currentSiteId = 0
                    this.getTemplates()
                }
            },

            // 新增详情页区块按钮
            addBlock () {
                this.resetForm()
                this.dialogFormVisible = true
                this.currentMode = 'add'
                this.formTitle = '新增详情页区块'
            },

            // 获取模板列表
            getTemplates () {
                let url = this.$api.templatesList + '/' + this.currentSiteId + '?page=' + this.queryTemplate.page + '&pageSize=' + this.queryTemplate.pageSize
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

            // 分页回调
            getPages (current, size) {
                this.queryTemplate.page = current
                this.queryTemplate.pageSize = size
                this.getTemplates()
            },

            // 点击编辑按钮
            toEdit (obj) {
                this.dialogFormVisible = true
                this.currentMode = 'update'
                this.formTitle = '编辑详情页区块'
                this.templateForm = obj
                if(obj.enable == true) {
                    obj.enable = 1
                } else {
                    obj.enable = 0
                }
            },

            // 检查排序值是否合法
            checkSort () {
                if(isNull(this.templateForm.sort) || this.templateForm.sort == null || this.templateForm.sort == undefined) {
                    this.errorMessage('请输入合法数值')
                    return false
                } else {
                    if(this.templateForm.sort < 0) {
                       this.errorMessage('请输入合法数值') 
                       return false
                    }
                }
            },



            // 重置表单元素
            resetForm () {
                for (let i in this.templateForm) {
                    this.templateForm[i] = null
                }
                this.templateForm.type = 1
                this.templateForm.enable = 1
                this.templateForm.siteId = this.currentSiteId
            },

            // 确认新增
            sureAdd () {
                switch (this.templateForm.blockType) {
                    case 1:
                    case '1':
                        this.templateForm.blockName = '商品'
                    break
                    case 2:
                    case '2':
                        this.templateForm.blockName = '片花咨询'
                    break
                    case 3:
                    case '3':
                        this.templateForm.blockName = '活动推荐'
                    break
                    case 4:
                    case '4':
                        this.templateForm.blockName = '相关内容'
                    break
                    case 5:
                    case '5':
                        this.templateForm.blockName = '内容详情'
                    break
                    default:
                        this.templateForm.blockName = null
                }
                this.postAdd(this.templateForm)
            },

            // 确认更新
            sureUpdate () {
                this.postAdd(this.templateForm)
            },

            // 提交新增，更新参数
            postAdd (element) {
                let url = this.$api.templatesSave
                axiosProxy.post(url, element).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.dialogFormVisible = false
                        this.getTemplates()
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

            // 点击删除按钮
            toDelete (obj) {
                let ids = obj.id
                this.$confirm('确定删除该项区块模板?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(ids)
                }).catch( error => {
                    console.log(error)    
                })
            },

            // 提交的删除
            postDelete(ids) {
                let url = this.$api.templatesDelete + '/' + ids
                axiosProxy.delete(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getTemplates()
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

            // 获取批量删除的多个项
            multiDelete (data) {
                this.deleteGroup = data
                if(data.length > 0) {
                    this.enableButton = true
                } else {
                    this.enableButton = false
                }
            },

            // 发起批量删除
            deleteMulti () {
                let idGroup = []

                for (let i in this.deleteGroup) {
                    idGroup.push(this.deleteGroup[i].id)
                }

                let ids = idGroup.join(',')

                this.$confirm('确定删除该项区块模板?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(ids)
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
            this.queryTemplate.siteId = siteId
            this.getTemplates()
        }
    }
</script>

<style lang="scss">

</style>
