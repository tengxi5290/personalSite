<template>
	<section class="cms-body">
        <div class="cms-list-header flex-between">
            <el-dropdown @command="chooseModel">
                <el-button type="primary" icon="el-icon-plus">添加同步接口</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in modelList" :key="item.id" :command="item">{{item.showName}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="getCheckedTableItems">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="showName" label="接口名称"  align="center"></el-table-column> 
            <el-table-column prop="modelName" label="模型" align="center"></el-table-column>
            <el-table-column prop="url" label="请求地址"  align="center"></el-table-column> 
            <el-table-column prop="method" label="请求方式" align="center"></el-table-column>
            <el-table-column prop="rule" label="匹配方式" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.rule == 1">主栏目路径</span>
                    <span v-if="scope.row.rule == 0">全路径</span>
                </div>
            </el-table-column>
            <el-table-column prop="enable" label="可用" align="center">
                <div slot-scope="scope">
                    <el-checkbox v-model="scope.row.enable"></el-checkbox>
                </div>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/sync/api/update','update',scope.row.id, scope.row)"></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <div class="cms-list-footer">
            <el-button  @click="saveAble" v-if="checkedTableItems.length > 0">保存更改</el-button>
            <el-button  @click="saveAble" v-else disabled>保存更改</el-button>
        </div>
	</section>
</template>

<script>
    import listMixins from "@/mixins/list";
    import axios from "axios";
    import {axiosProxy,checkErrorCode} from "@/api/tool"
    export default {
        mixins: [listMixins],
        data() {
            return {
                tableData: [], // 表格数据
                modelList: [], // 同步模型列表
                checkedTableItems: [] // 选中的列表项
            }
        },
        methods: {
            // 保存是否可用的更改
            saveAble () {
                let enableArray = []
                let disableArray = []
                for (let i in this.checkedTableItems) {
                    if(this.checkedTableItems[i].enable == true) {
                        enableArray.push(this.checkedTableItems[i].id)
                    } else {
                        disableArray.push(this.checkedTableItems[i].id)
                    }
                }
                if (enableArray.length > 0) {
                    let url = this.$api.syncApiEnable + '?ids=' + enableArray.join(',')
                    axiosProxy.put(url).then( res => {
                        if(res.data.errorCode == '0') {
                            this.successMessage('操作成功')
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

                if(disableArray.length > 0) {
                    let url = this.$api.syncApiDisable + '?ids=' + disableArray.join(',')
                    axiosProxy.put(url).then( res => {
                        if(res.data.errorCode == '0') {
                            this.successMessage('操作成功')
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
                setTimeout (() => {
                    this.getTableList()
                }, 1000)
            },
            // 获取选中的列表项
            getCheckedTableItems (value) {
                this.checkedTableItems = value
            },
            // 获取api表格数据
            getTableList () {
                axiosProxy.get(this.$api.syncApiList).then( res => {
                    if(res.data.errorCode == '0') {
                        this.tableData = res.data.data
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
                    }
                }).catch ( error => {
                    console.log(error)
                })
            },  
            // 获取添加前选择的模型
            chooseModel (value) {
                this.routerLink('/sync/api/add', 'save', '', value)
            },
            // 获取同步模型列表
            getSyncModelList () {
                axiosProxy.get(this.$api.modelList).then( res => {
                    if(res.data.errorCode == '0') {
                        this.modelList = res.data.data
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
                    }
                }).catch ( error => {
                    console.log(error)
                })
            }
        },
        created() {
            this.getTableList()
            this.getSyncModelList()
            this.$store.dispatch("setCollapse", true); //收缩状态栏
        }
    }
</script>

<style lang="scss">
    
</style>