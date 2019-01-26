<template>
    <section class="cms-body">
        <div>
            <div class="cms-list-header clearfix flex">
                <el-button type="primary" @click="addNewSp">添加外部页面</el-button>
            </div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column width="50" align="right">
                    <template slot-scope="scope">
                        <el-checkbox v-if="scope.row.type == 4" @change="getCheckedItem(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="名称" width="200" align="center"></el-table-column>

                <el-table-column prop="showName" label="展示名称" width="200" align="center"></el-table-column>

                <el-table-column prop="thirdUrl" label="引用地址" width="200" align="center"></el-table-column>

                <el-table-column prop="pageType" label="页面类型" width="200" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pageType == 1">H5</span>
                    </template>
                </el-table-column>

                <el-table-column prop="type" label="类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">站点</span>
                        <span v-if="scope.row.type == 2">页面</span>
                        <span v-if="scope.row.type == 3">外部引用站点</span>
                        <span v-if="scope.row.type == 4">外部引用页面</span>
                    </template>
                </el-table-column>

                <el-table-column prop="img" label="频道管理切换图片" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.img" alt="" width="auto" height="48" />
                    </template>
                </el-table-column>

                <el-table-column prop="icon" label="频道管理图片" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" alt="" width="auto" height="48" />
                    </template>
                </el-table-column>

                <el-table-column prop="width" label="图标宽度" align="center"></el-table-column>

                <el-table-column prop="height" label="图标高度" align="center"></el-table-column>

                <el-table-column prop="sort" label="排序" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" type="number" disabled class="w50"></el-input>
                    </template>
                </el-table-column>

                <el-table-column prop="textColor" label="未选中字体颜色" align="center">
                    <template slot-scope="scope">
                        <el-color-picker v-model="scope.row.textColor" disabled></el-color-picker>
                    </template>
                </el-table-column>

                <el-table-column prop="textColorSelected" label="选中字体颜色" align="center">
                    <template slot-scope="scope">
                        <el-color-picker v-model="scope.row.textColorSelected" disabled></el-color-picker>
                    </template>
                </el-table-column>

                <el-table-column prop="backgroundColor" label="背景颜色" align="center">
                    <template slot-scope="scope">
                        <el-color-picker v-model="scope.row.backgroundColor" disabled></el-color-picker>
                    </template>
                </el-table-column>

                <el-table-column prop="statusBarColor" label="状态栏颜色" align="center">
                    <template slot-scope="scope" v-if="scope.row.type == 1">
                        <span v-if="scope.row.statusBarColor == 0">白色</span>
                        <span v-if="scope.row.statusBarColor == 1">黑色</span>
                    </template>
                </el-table-column>

                <el-table-column prop="module" label="功能模块" align="center">
                    <template slot-scope="scope" v-if="scope.row.type == 2">
                        <span>{{scope.row.module}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="enable" label="禁用" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.enable" @change="changeEnable(scope.row)" v-if="scope.row.changable"></el-checkbox>
                        <el-checkbox v-model="scope.row.enable" disabled v-else></el-checkbox>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="操作" align="center" width="160">
                    <template slot-scope="scope">
                        <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>
                        <cms-button type="delete" @click="deleteItem(scope.row)" v-if="scope.row.type == 4"></cms-button>

                        <cms-button type="show" v-if="scope.row.defaultPage == 0 && (scope.row.type == 2 || scope.row.type == 4)" @click="toggleDefault(scope.row.defaultPage, scope.row.id)"></cms-button>
                        <cms-button type="hide" v-if="scope.row.defaultPage == 1 && (scope.row.type == 2 || scope.row.type == 4)" @click="toggleDefault(scope.row.defaultPage, scope.row.id)"></cms-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="cms-list-footer" style="padding-bottom:100px;">
                <div class="cms-left">
                    <el-button type="danger" @click="deleteGroup" v-if="buttonEnable">批量删除</el-button>
                    <el-button type="danger" v-else disabled>批量删除</el-button>
                </div>
            </div>
        </div>

        <el-dialog title="编辑站点样式" :visible.sync="dialogFormVisible">
            <el-form :model="editForm" class="cms-form" label-width="200px" style="margin:0;padding:0">
                <el-form-item label="展示名称" class="flex-50">
                    <el-input v-model="editForm.showName"></el-input>
                </el-form-item>

                <el-form-item label="名称" class="flex-50">
                    <el-input v-model="editForm.name" disabled v-if="pageStatus == 'edit'"></el-input>
                    <el-input v-model="editForm.name" v-if="pageStatus == 'add'"></el-input>
                </el-form-item>

                <el-form-item label="引用地址" class="flex-50">
                    <el-input v-model="editForm.thirdUrl"></el-input>
                </el-form-item>

                <el-form-item label="排序" class="flex-50">
                    <el-input v-model="editForm.sort" type="number" @blur="checkNull"></el-input>
                </el-form-item>

                <el-form-item label="类型" class="flex-50">
                    <el-input v-model="editForm.type" disabled></el-input>
                </el-form-item>

                <el-form-item label="页面类型" class="flex-50">
                    <el-select v-model="editForm.pageType" placeholder="H5" disabled>
                        <el-option label="H5" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="频道管理切换图片" class="flex-50">
                    <uploader @change="getUrl" :default="editForm.img" v-if="showImage"></uploader>
                </el-form-item>

                <el-form-item label="频道管理图片" class="flex-50">
                    <uploader @change="getIconUrl" :default="editForm.icon" v-if="showImage"></uploader>
                </el-form-item>

                <el-form-item label="图标宽度" class="flex-50">
                    <el-input type="number" v-model="editForm.width"></el-input>
                </el-form-item>

                <el-form-item label="图标高度" class="flex-50">
                    <el-input type="number" v-model="editForm.height"></el-input>
                </el-form-item>

                <el-form-item label="状态栏颜色" class="flex-50" v-if="editForm.type == '站点'">
                    <el-select v-model="editForm.statusBarColor">
                        <el-option label="黑色" value="1"></el-option>
                        <el-option label="白色" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="功能组件" class="flex-50" v-if="editForm.type == '页面'">
                    <el-checkbox-group v-model="editForm.module">
                        <el-checkbox label="扫码"></el-checkbox>
                        <el-checkbox label="搜索"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="背景颜色" class="flex-50">
                    <el-color-picker v-model="editForm.backgroundColor"></el-color-picker>
                </el-form-item>

                <el-form-item label="未选中字体颜色" class="flex-50">
                    <el-color-picker v-model="editForm.textColor"></el-color-picker>
                </el-form-item>

                <el-form-item label="选中字体颜色" class="flex-50">
                    <el-color-picker v-model="editForm.textColorSelected"></el-color-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureEdit" v-if="pageStatus == 'edit'">确定修改</el-button>
                <el-button type="success" @click="sureUpdate" v-if="pageStatus == 'add'">确定添加</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import listMixins from "@/mixins/list"
    import {axiosProxy, isNull} from "@/api/tool"
    import axios from 'axios'
    export default {
        mixins: [listMixins],
        data(){
            return{
                tableData: [], // 样式列表数据
                dialogFormVisible: false, // 是否显示编辑蒙版
                editForm: {
                    showName: null,
                    backgroundColor: null,
                    typeName: null,
                    img: null,
                    name: null,
                    sort: null,
                    enable: null,
                    textColorSelected: null,
                    textColor: null,
                    thirdUrl: null,
                    pageType: null,
                    type: 4,
                    width: null,
                    height: null,
                    statusBarColor: null,
                    icon: null
                }, // 编辑表单的对象
                showImage: true, // 是否显示上传图片组件
                editId: null, // 正在编辑的样式的id
                pageStatus: null, // 标明当前是编辑内容还是新增内容
                checkedGroup: [], // 选中待被批量删除的
                buttonEnable: false, // 批量删除按钮是否可用
            }
        },
        methods:{
            // 获取sp样式列表
            getSpStyleList() {
                axiosProxy.get(this.$api.styleList).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tableData = res.data.data
                        for (let i in this.tableData) {
                            if(this.tableData[i].enable == 0) {
                                this.tableData[i].enable = true
                            } else if(this.tableData[i].enable == 1) {
                                this.tableData[i].enable = false
                            }
                            if(this.tableData[i].type == 1) {
                                this.tableData[i].changable = false
                            } else {
                                this.tableData[i].changable = true
                            }

                            let emptyArray = []

                            if(this.tableData[i].module !== null && this.tableData[i].module !== undefined && this.tableData[i].module !== '') {
                                this.tableData[i].module = this.tableData[i].module.split(',')
                            }
                        
                            for (let j in this.tableData[i].module) {
                                if(this.tableData[i].module[j] == 1) {
                                    emptyArray.push('搜索')
                                }

                                if(this.tableData[i].module[j] == 2) {
                                    emptyArray.push('扫码')
                                }
                            }

                            this.tableData[i].module = emptyArray.join(',')
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

            // 编辑按钮的响应事件
            toEdit (value) {
                this.pageStatus = 'edit'
                let id = value.id
                this.editId = value.id
                this.showImage = false
                this.editForm.backgroundColor = null
                this.getStyleDetail(id)
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            },

            // 获取sp样式的详情
            getStyleDetail (id) {
                // styleDetail
                axiosProxy.get(this.$api.styleDetail + '/' + id).then( res => {
                    if(res.data.errorCode == 0) {
                        this.editForm = res.data.data
                        this.dialogFormVisible = true
                        if(this.editForm.type == 3) {
                            this.editForm.type = '外部引用站点'
                        }
                        if(this.editForm.type == 4) {
                            this.editForm.type = '外部引用页面'
                        }
                        if(this.editForm.type == 2) {
                            this.editForm.type = '页面'
                        }
                        if(this.editForm.type == 1) {
                            this.editForm.type = '站点'
                        }

                        if(this.editForm.pageType == 1) {
                            this.editForm.pageType = 'H5'
                        }

                        let anotherArray = []

                        if(this.editForm.module !== null && this.editForm.module !== undefined && this.editForm.modue !== '') {
                            this.editForm.module = this.editForm.module.split(',')
                            for (let i in this.editForm.module) {
                                if(this.editForm.module[i] == 1) {
                                    anotherArray.push('搜索')
                                }

                                if(this.editForm.module[i] == 2) {
                                    anotherArray.push('扫码')
                                }
                            }
                        }

                        this.editForm.module = anotherArray

                        if(this.editForm.statusBarColor == 1) {
                            this.editForm.statusBarColor = '黑色'
                        } else if (this.editForm.statusBarColor == 0) {
                            this.editForm.statusBarColor = '白色'
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

            // 确认编辑表单按钮点击响应
            sureEdit () {
                if(isNull(this.editForm.sort)) {
                    this.errorMessage('请正确填写排序值')
                    this.editForm.sort = null
                    return false
                } else {
                    switch (this.editForm.type) {
                        case '页面':
                            this.editForm.type = 2
                        break
                        case '站点':
                            this.editForm.type = 1
                        break
                        case '外部引用站点':
                            this.editForm.type = 3
                        break
                        case '外部引用页面':
                            this.editForm.type = 4
                        break
                        default: 
                            this.editForm.type = null
                    }

                    if(this.editForm.statusBarColor == '黑色') {
                        this.editForm.statusBarColor = 1
                    } else if(this.editForm.statusBarColor == '白色') {
                        this.editForm.statusBarColor = 0
                    } else {
                        this.editForm.statusBarColor = this.editForm.statusBarColor
                    }

                    let storeArray = []
                    for(let i in this.editForm.module) {
                        if(this.editForm.module[i] == '') {
                            this.editForm.module.splice(i, 1)
                        } 
                        if(this.editForm.module[i] == '扫码') {
                            storeArray.push(1)
                        } 
                        if(this.editForm.module[i] == '搜索') {
                            storeArray.push(2)
                        }
                    }

                    this.editForm.module = storeArray.join(',')

                    this.editForm.pageType = 1
                    this.postUpdate(this.editId, this.editForm)
                }
            },

            // 提交更改
            postUpdate(id, obj) {
                axiosProxy.put(this.$api.styleUpdate + '/' + id, obj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.dialogFormVisible = false
                        this.getSpStyleList()
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

            // 上传图片的回调
            getUrl (imageUrl, index, imagePath, storageId) {
                this.editForm.img = imageUrl
            },

            // 上传图片回调
            getIconUrl (imageUrl, index, imagePath, storageId) {
                this.editForm.icon = imageUrl
            },

            // 判断排序值是否合法
            checkNull () {
                if(isNull(this.editForm.sort)) {
                    this.errorMessage('请正确填写排序值')
                    this.editForm.sort = null
                    return false
                } 
            },

            // 切换禁用状态
            changeEnable (obj) {
                let postObj = {}
                if(obj.enable == 0) {
                    obj.enable = 1
                } else if (obj.enable == 1) {
                    obj.enable = 0
                }
                this.postUpdate(obj.id, obj)
            }, 




            addNewSp () {
                this.dialogFormVisible = true
                this.pageStatus = 'add'
                this.resetForm()
                this.editForm.type = '外部引用页面'
            },

            // 重置表单内容
            resetForm () {
                this.showImage = false
                for (let i in this.editForm) {
                    this.editForm[i] = null
                }
                this.editForm.type = 4
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            },

            // 确认修改了
            sureUpdate () {
                this.editForm.pageType = 1
                this.editForm.type = 4
                this.postAdd(this.editForm)
            },

            // 提交新增的数据
            postAdd (obj) {
                axiosProxy.post(this.$api.styleAdd, obj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('创建成功')
                        this.dialogFormVisible = false
                        this.getSpStyleList()
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

            // 切换默认显示隐藏状态
            toggleDefault (defaultStatus, id) {
                if(defaultStatus == 1) {
                    defaultStatus = 0
                } else if(defaultStatus == 0) {
                    defaultStatus = 1
                }
                this.shiftDefaultPage(id, defaultStatus)
            },

            // 切换默认显示或隐藏
            shiftDefaultPage (id, status) {
                let url = this.$api.styleToggle + '/' + id + '/' + status
                axiosProxy.put(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getSpStyleList()
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




            // 表格多选框状态改变事件
            getCheckedItem (valueObj) {
                let location = this.checkedGroup.indexOf(valueObj.id)
                if(location == -1) {
                    this.checkedGroup.push(valueObj.id)
                } else {
                    this.checkedGroup.splice(location, 1)
                }

                if(this.checkedGroup.length > 0) {
                    this.buttonEnable = true
                } else {
                    this.buttonEnable = false
                }
            },

            // 单条删除按钮事件
            deleteItem (value) {
                this.$confirm("是否确认删除?", "警告", { type: "error" }).then(mes => {
                    this.handleDelete(value.id)
                }).catch( error => {
                    console.log(error)
                })
            },

            // 删除服务
            handleDelete (ids) {
                let url = this.$api.styleDelete + '/' + ids
                axiosProxy.delete(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.tableData = []
                        this.getSpStyleList()
                        this.checkedGroup = []
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

            // 批量删除按钮响应
            deleteGroup() {
                let ids = this.checkedGroup.join(',')

                this.$confirm("是否确认删除?", "警告", { type: "error" }).then(mes => {
                    this.handleDelete(ids)
                }).catch( error => {
                    console.log(error)
                })
            }
        },
        created(){
            this.getSpStyleList()
        },
        mounted(){
            this.$store.dispatch("setCollapse", true) //收缩状态栏
            let clientHeight=document.body.clientHeight
            $('.cms-body').css('minHeight',(clientHeight-110)+'px')
        }
    }
</script>

<style>
    .el-dialog {
        margin-top: 50px!important;
        width: 80%;
    }
</style>
