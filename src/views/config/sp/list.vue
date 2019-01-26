<template>
    <div>
        <div class="cms-list-header">
            <el-button type="primary" icon="el-icon-plus" @click="addSp">添加</el-button>
        </div> 

        <el-table :data="tableData" style="width: 100%" stripe @selection-change="getSps">
            <el-table-column type="selection" width="65" align="center"></el-table-column>
            <el-table-column prop="id" label="spID" align="center"></el-table-column>
            <el-table-column prop="name" label="sp名称" align="center"></el-table-column>
            <el-table-column prop="spDesc" label="详情" align="center"></el-table-column>
            <el-table-column prop="spLiveNotice" label="房间公告" align="center"></el-table-column>
            <el-table-column prop="icon" label="缩略图" align="center">
                <div slot-scope="scope">
                    <img :src="scope.row.icon" alt="" width="auto" height="48" />
                </div>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>   
                    <cms-button type="delete" @click="omitSp(scope.row)"></cms-button>   
                </div>
            </el-table-column>
        </el-table>

        

        <div class="content-fiexd">
            <el-button :disabled="bottomButtonDisable" @click="multiOmitSp">批量删除</el-button>
        </div> 

    </div>
</template>
<script>
    import axios from "axios";
    import {axiosProxy} from "@/api/tool"
    import va from "@/rules";
    export default {
        data() {
            return {
                tableData: [],
                bottomButtonDisable: true,
                selection: []
            }
        },
        methods:{
            getSpList () {
                axiosProxy.get(this.$api.spList).then( res => {
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
            toEdit (list) {
                this.routerLink('/sp/edit', 'update', list.id, list)
            },
            omitSp (item) {
                this.$confirm("是否确认删除?", "警告", { type: "error" }).then(mes => {
                    axiosProxy.delete(this.$api.spDelete + '?ids=' + item.id).then( res => {
                        if(res.data.errorCode == 0) {
                            this.successMessage('操作成功')
                            this.getSpList()
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
                })
            },
            multiOmitSp () {
                let omitArray = []
                for (let i in this.selection) {
                    omitArray.push(this.selection[i].id)
                }
                let ids = omitArray.join(',')


                this.$confirm("是否确认删除?", "警告", { type: "error" }).then(mes => {
                    axiosProxy.delete(this.$api.spDelete + '?ids=' + ids).then( res => {
                        if(res.data.errorCode == 0) {
                            this.successMessage('操作成功')
                            this.getSpList()
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
                })
            },
            addSp () {
                this.routerLink('/sp/add', 'add', '')
            },
            getSps (value) {
                this.selection = value
                if(value.length > 0) {
                    this.bottomButtonDisable = false
                } else {
                    this.bottomButtonDisable = true
                }
            }
        },
        created(){   
            this.$store.dispatch("setCollapse", true)
        },
        mounted (){
            this.getSpList()
        }
    }
</script>
<style>
   .content-fiexd {
        bottom: auto;
   } 
</style> 
