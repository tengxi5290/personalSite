<template>
    <section class="cms-body flex">

        <div style="width: 100%;">
            <el-table :data="tableData" stripe v-if="showTable">
            <!-- 中间内容部分 -->
                <el-table-column type="selection" width="65" align="right"></el-table-column>
                <el-table-column label="位置" prop="location" align="center" v-if="showPriority == true">
                    <div slot-scope="scope">
                        <el-input v-model="scope.row.location" class="w50" @blur="changePriority(tableData, scope.row)"></el-input>
                    </div>
                </el-table-column>
                <!-- <el-table-column prop="real_id" label="id" width="50" align="center" v-if="tableData.real_id"></el-table-column> -->
                <el-table-column prop="showId" label="id" width="50" align="center"></el-table-column>
                <el-table-column label="名称"  prop="type"  align="center">
                    <div slot-scope="scope">
                        <span v-if="scope.row.type == 'DIR'">{{scope.row.name}}</span>
                        <span v-else-if="scope.row.type == 'PAGE'">{{scope.row.showName}}</span>
                        <span v-else>{{scope.row.name}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="类型" prop="type" align="center">
                    <div slot-scope="scope">       
                        <span v-if="scope.row.type=='DIR'">栏目</span>
                        <span v-else-if="scope.row.type=='PAGE'">页面</span>
                        <span v-else>区块</span>
                    </div>
                </el-table-column>
                <!-- <el-table-column label="排序" prop="priority" align="center" v-if="showPriority == true">
                    <div slot-scope="scope">
                        <el-input v-model="scope.row.priority" class="w50" @blur="changePriority(scope.row)"></el-input>
                    </div>
                </el-table-column> -->

                <el-table-column label="链接类型" prop="linkType" align="center"></el-table-column>

                <el-table-column label="链接地址" prop="moreUrl" align="center"></el-table-column>

                <el-table-column label="是否可用" prop="enable" align="center">
                    <div slot-scope="scope">    
                        <div v-if="scope.row.type == 'DIR'">
                            <span v-if="scope.row.enable">是</span>
                            <span v-else>否</span>
                        </div>  

                        <div v-else-if="scope.row.type == 'PAGE'">
                            
                        </div>  

                        <div v-else>
                            <el-checkbox v-model="scope.row.enable" @change="shiftEnable(scope.row)"></el-checkbox>
                        </div>
                    </div>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <div slot-scope="scope">
                        <cms-button type="edit"  @click="toEdit(scope.row)"
                        v-perms="'/channel/update'" 
                        ></cms-button>
                        <cms-button type="delete" @click="toDelete(scope.row)" v-if="scope.row.type !== 'DIR' && scope.row.type !== 'PAGE'"></cms-button>
                    </div>
                </el-table-column>

            </el-table>
            <!-- 中间内容结束 -->


        </div>
        
    </section>
</template>

<script>
import listMixins from "@/mixins/list";
import {axiosProxy,getPageTreeParams} from "@/api/tool"
import va from "@/rules";
export default {
    mixins: [listMixins],
    data(){
        let required = va.required();
        let number = va.number();
        let string = va.string();
        return{
            parentChannels: '',
            info:{},
            rules:{
                id:[required],
                name:[required],
                path:[required],
                type:[required],
                showName:[required],
            },//校验规则


            params:this.$route.query,//前页面传过来的数据,如id等
            tableData:[],//页面中的数据的集合
            breadState:false,//默认当前目录不显示
            breadItems: [
                {
                    name: "根目录",
                    id: ""
                },
            ], //面包屑,用来存储并显示当前目录的数组
            listType:'ROOT',//当前页面类型,决定是否可以新建目录和栏目
            showPriority: false,
            showTable: true
        }
    },
    methods:{    
        shiftEnable (value) {
            let id = value.id
            let status
            if(value.enable == true) {
                status = 1
            } else if(value.enable == false) {
                status = 0
            }
            axiosProxy.put(this.$api.blockEnable + '?id=' + id + '&status=' + status).then( res => {
                if(res.data.errorCode == 0) {
                    this.successMessage('操作成功')
                    this.getBlock(this.$route.query.real_id)
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
        
        toEdit (tableItem) {
            if(tableItem.real_id) {
                this.routerLink('/page/edit','update',tableItem.real_id,tableItem)
            } else {
                this.routerLink('/page/edit?real_id=' + tableItem.id + '&pageType=' + this.listType + '&parent=' + tableItem.pageId + '&parentId=' + tableItem.pageId)
            }
        },

        changePriority (row, objData) {
            let resortTableData = []

            this.tableData.splice(objData.priority, 1)
            this.tableData.splice(objData.location - 1, 0, objData)

            for (let i in this.tableData) {
                resortTableData.push(this.tableData[i].id)
            }

            axiosProxy.put(this.$api.pagePriority, resortTableData).then( res => {
                if(res.data.errorCode == 0) {
                    this.successMessage('操作成功')
                    this.showTable = false
                    setTimeout(() => {
                        this.showTable = true
                        this.getBlock(this.$route.query.real_id)
                    }, 100)
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

        //页面初始化函数
        getCreated(outParams){
            if(outParams==undefined){
                outParams=0;
            }
            let url=this.$api.pageTree;
            axiosProxy.get(url+'/'+outParams)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.tableData=res.data.data
                        this.showPriority = false
                        for (let i in this.tableData) {
                            if(this.tableData[i].real_id) {
                                this.tableData[i].showId = this.tableData[i].real_id
                            } else {
                                this.tableData[i].showId = this.tableData[i].id
                            }
                        }
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('初始化信息失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
        },
        getBlock(pageId) {
            axiosProxy.get(this.$api.blockPage + '/' + pageId)
            .then(res=>{
                if(res.data.errorCode==0){
                    this.tableData=res.data.data
                    this.showPriority = true
                    for (let i in this.tableData) {
                        if(this.tableData[i].real_id) {
                            this.tableData[i].showId = this.tableData[i].real_id
                        } else {
                            this.tableData[i].showId = this.tableData[i].id
                        }
                        this.tableData[i].location = parseInt(i) + 1
                    }
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('初始化信息失败')
                    }
                }
            })
            .catch(err=>{console.log(err)})
        },
        toDelete (obj) {
            let id = obj.id
            this.postDelete(id)
        },
        postDelete (id) {
            let url = this.$api.blockDelete + '/' + id
            axiosProxy.delete(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.successMessage('操作成功')
                    this.getBlock(this.$route.query.real_id)
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('初始化信息失败')
                    }
                }
            }).catch( error => {
                console.log(error)
            })
        }
    },
    created(){
        this.listType = this.$route.query.pageType
        if(this.listType == 'PAGE') {
            this.getBlock(this.$route.query.real_id)
        } else {
            this.getCreated(this.$route.query.real_id)
        }
    },
    mounted(){
        let clientHeight=document.body.clientHeight
        $('.cms-body').css('minHeight',(clientHeight-110)+'px')
    }
}
</script>

<style>

.tree-left{
    width: 200px;
    float: left;
}
.tree-right{
    margin-left: 200px;
}

</style>
