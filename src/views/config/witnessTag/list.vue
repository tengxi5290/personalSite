<template>
    <div>
        <!-- <cropper></cropper> -->
        
        <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
            <div style="margin-top:16px;flex:auto" class="content-flex-left">
                <el-button type="primary" @click="addTag">添加目击者标签</el-button>
            </div>
        </div>

        <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column type="selection" width="65" align="center"></el-table-column>
            <el-table-column prop="tagId" label="标签Id" align="center"></el-table-column>
            <el-table-column prop="tagName" label="标签名称" align="center"></el-table-column>
            <el-table-column prop="zscore" label="权重" align="center">
                <div slot-scope="scope">
                    <el-input v-model="scope.row.zscore" type="number" class="w50" @blur="checkLeagle(scope.row)"></el-input>
                </div>
            </el-table-column>
        </el-table>

        <el-dialog title="添加目击者标签" :visible.sync="dialogFormVisible">
            <el-form ref="ruleForm" :model="form" :rules="rules" class="cms-form" label-width="100px" style="margin:0;padding:0">
                <el-form-item label="标签名称" class="flex-100" prop="tagName">
                    <el-input v-model="form.tagName"></el-input>
                </el-form-item>

                <el-form-item label="权重" class="flex-100" prop="zscore">
                    <el-input v-model="form.zscore" type="number"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="success" @click="sureAdd">确定添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Vue from 'vue'
    import formMixins from "@/mixins/form"
    import {VueCropper} from "vue-cropper"
    import axios from "axios"
    import {axiosProxy, isNull, timestampToTime} from "@/api/tool"
    import va from "@/rules"


    export default {
        mixins: [formMixins],
        data() {
            let required = va.required("此项必填")
            return {
                tableData: [], // 表格数据
                dialogFormVisible: false, // 添加目击者标签蒙版
                form: {
                    tagName: null,
                    tagId: null,
                    zscore: null
                }, // 表单数据
                rules: {
                    tagName: [required],
                    zscore: [required]
                }, // 表单验证规则
            }
        },
        methods:{
            // 获取表格数据
            getWitnessTagList () {
                axiosProxy.get(this.$api.witnessTagList).then( res => {
                    if(res.data.errorCode == 0) {
                        this.tableData = res.data.data
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

            // 权重值是否合法
            checkLeagle (valueObj) {
                if(isNull(valueObj.zscore)) {
                    this.errorMessage('权重值不能为空哦！')
                    return false
                } else {
                    this.updateWitnessTag(valueObj)
                }
            },

            // 更新接口
            updateWitnessTag (obj) {
                axiosProxy.put(this.$api.witnessTagUpdate, obj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getWitnessTagList()
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

            // 重置表单元素
            resetForm () {
                this.form.zscore = null
                this.form.tagName = null
            },

            // 新增目击者标签按钮点击事件
            addTag () {
                this.resetForm()
                this.dialogFormVisible = true
            },

            // 确认添加目击者标签
            sureAdd () {
                if(!isNull(this.form.tagName) && this.form.tagName !== null) {
                        
                } else {
                    this.errorMessage('请补全标签名称')
                    return false
                }

                if(!isNull(this.form.zscore) && this.form.zscore !== null) {
                    
                } else {
                    this.errorMessage('请补全权重')
                    return false
                }
                this.updateWitnessTag(this.form)
                this.dialogFormVisible = false
            }
        },
        created(){
            this.$store.dispatch("setCollapse", true)
        },
        mounted (){
            this.getWitnessTagList()
        }
    }
</script>
<style>
   .content-fiexd {
        bottom: auto;
   }


   .list {
        max-height: 80vh;
        margin: 0 auto;
        padding: 0;
        overflow: auto;
        background-color: #f3f3f3;
        border: 1px solid #efefef;
        border-radius: 3;
   }
   .list-item {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 100%;
        padding: 20px;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        box-sizing: border-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color: #333;
        font-weight: 400;
   }
</style>
