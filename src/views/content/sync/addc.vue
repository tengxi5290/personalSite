<template>
	<section class="cms-body flex">
        <div class="cms-content-left">
            <div class="tree-layout">
                <div class="tree">
                    <div class="reflash">
                        <div @click="reload"><span class="el-icon-refresh"></span> 刷新 </div>
                    </div>

                    <el-tree ref="tree" :props="props" @check="check" :load="loadNode" lazy show-checkbox :indent='16' :node-key="props.id" @node-click="getNodes" :check-strictly="checkStrict" v-if="refresh">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span :title="node.label">{{ node.label }} {{data.id}}</span>
                        </span> 
                    </el-tree>
                </div>
            </div>
        </div>
        <div class="cms-content-right">
            <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
                <el-form-item label="同步字段" class="flex-50"  prop="name">
                    <el-input v-model="dataInfo.name" class="cms-width"></el-input>
                </el-form-item>

                <div class="cms-list-footer">
                    <el-button @click="add" type="primary" style="margin: 0 auto;" :disabled="dataInfo.name != '' && currentChannel == null? true: false">添加</el-button>
                </div> 
            </el-form>
        </div>
	</section>
</template>

<script>
    import listMixins from "@/mixins/list"
    import axios from "axios"
    import va from "@/rules"
    import {axiosProxy,checkErrorCode} from "@/api/tool"
    export default {
        mixins: [listMixins],
        data() {
            let self = this;
            let required = va.required('此项必填')
            let number = va.number('只能输入数字')
            return {
                // 栏目树的属性
                props: {
                    label: "name",
                    children: "zones",
                    isLeaf: "isChild",
                    id: "id"
                },
                count: 1,
                // 表单参数
                dataInfo: {
                    name: ''
                },
                // 表单验证规则
                rules: {
                    name:[required]
                },
                // 不可勾选的栏目
                unableChannelList: [],
                // 提交的按钮禁用状态
                buttonDisable: true,
                // 树是否父子严格模式
                checkStrict: true,
                // 当前选中的栏目id
                currentChannel: null,
                // 树是否可见
                refresh: true
            }
        },
        methods: {
            reload () {
                this.refresh = false
                setTimeout (() => {
                    this.refresh = true
                }, 0)
            },
            // 点击节点事件
            getNodes (data,node,param) {

            },
            // 选中了节点事件
            check(data, datas) {
                let array = []
                array.push(data.id)
                this.currentChannel = data
                this.$refs.tree.setCheckedKeys(array, false);
            },
            // 获取栏目树数据
            getTreeNodes (node, resolve, id) {
                this.rotating=true
                axiosProxy.get(this.$api.contentTree + '/' + id).then(res => {
                    if(res.data.errorCode == '0') {
                        this.rotating=false
                        const data = []
                        for (let i in res.data.data) {
                            let obj = {}
                            if(this.unableChannelList.indexOf(res.data.data[i].id) != -1) {
                                obj.disabled = true
                            }
                            obj.id = res.data.data[i].id
                            obj.isChild = !res.data.data[i].haveChildren
                            obj.name = res.data.data[i].name
                            obj.data=res.data.data
                            data.push(obj)
                        }
                        return resolve(data)
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                }).catch(error=>{ this.rotating=false})
            },
            // 获取树结构
            loadNode (node, resolve) {
                this.unableChannelList = []
                this.getUnableCahnnelList(() => {
                    if (node.level === 0) {
                        this.getTreeNodes(node, resolve, 0) 
                    }
                    if (node.level > 0) {
                        this.getTreeNodes(node, resolve, node.data.id)  
                    }
                })
            },
            // 提交新增的同步栏目数据
            add () {
                let params = {}
                params.channelId = this.currentChannel.id
                params.channelName = this.currentChannel.name
                params.syncChannel = this.dataInfo.name
                axiosProxy.post(this.$api.syncChannel, params).then (res => {
                    if(res.data.errorCode == '0') {
                        this.successMessage('操作成功')
                        setTimeout (() => {
                            this.routerLink('/sync/channel', '', '')
                        }, 1000)
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
            // 获取不可选的栏目信息
            getUnableCahnnelList (callback) {
                axiosProxy.get(this.$api.syncChannelList).then( res => {
                    if(res.data.errorCode == '0') {
                        for (let i in res.data.data) {
                            this.unableChannelList.push(res.data.data[i].channelId)
                        }
                        callback()
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                }).catch ( error => {
                    console.log(error)
                })
            }
        },
        mounted() {
            let clientHeight = document.body.clientHeight
            $(".cms-body").css("minHeight", clientHeight - 110 + "px")
            this.$store.dispatch("setCollapse", true); //收缩状态栏
        }
    }
</script>

<style lang="scss">
    
</style>