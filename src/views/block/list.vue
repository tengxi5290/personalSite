<template>
    <section class="cms-body flex">
        
        <!-- 页面list内容 -->
        <div style="width: 100%;">
        <!-- 右边内容的大盒子 -->

            <el-table :data="tableData" stripe @selection-change="checkBlockIds">
            <!-- 中间内容部分 -->

                <el-table-column type="selection" width="65" align="right"></el-table-column>
                <!-- <el-table-column prop="real_id" label="id" width="50" align="center" v-if="tableData.real_id"></el-table-column> -->
                <el-table-column prop="showId" label="id" width="50" align="center"></el-table-column>
                <el-table-column label="名称"  prop="name"  align="center"></el-table-column>
                <el-table-column label="类型"  prop="type"  align="center">
                    <div slot-scope="scope">     
                        <span v-if="scope.row.type=='DIR'">栏目</span>
                        <span v-else-if="scope.row.type=='PAGE'">页面</span>
                        <span v-else>区块</span>
                    </div>
                </el-table-column>
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

            </el-table>
            <!-- 中间内容结束 -->

        </div>
        
    </section>
</template>

<script>
import listMixins from "@/mixins/list"
import {axiosProxy,getPageTreeParams} from "@/api/tool"
export default {
    mixins: [listMixins],
    data(){
        return{
            params:this.$route.query,//前页面传过来的数据,如id等
            tableData:[],//页面中的数据的集合
            breadState: false,//默认当前目录不显示
            breadItems: [
                {
                    name: "根目录",
                    id: ""
                },
            ], //面包屑,用来存储并显示当前目录的数组
            listType:'',//当前页面类型,决定是否可以新建目录和栏目
            pageId:'',//新建区块用到的父id
        }
    },
    methods:{
        //页面初始化函数
        getCreated(outParams){
            if(outParams==undefined){
                outParams=0;
            }
            let url=this.$api.pageTree;
            axiosProxy.get(url+'/'+outParams)
                .then(res=>{
                    if(res.data.errorCode==0){
                        let info=res.data.data
                        this.tableData=info;
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
                            this.errorMessage('页面初始化失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
        },
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
                    this.getBlockList(this.$route.query.id)
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
        getBlockList (id) {
            let url=this.$api.blockPage
            axiosProxy.get(url + '/' + id)
            .then(res=>{

                if(res.data.errorCode==0){
                    let info=res.data.data
                    this.tableData=info;
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
                        this.errorMessage('区块信息初始化失败')
                    }
                }
                
            })
            .catch(err=>{console.log(err)})
        }
    },
    created(){
        if(this.$store.state.listType == 'PAGE') {
            this.getBlockList(this.$route.query.id)
        } else {
            if(this.$route.query.id) {
                this.getCreated(this.$route.query.id)
            } else {
                this.getCreated('0')
            }
        }
        localStorage.removeItem('bread')
    },
    mounted(){
        let breadArray = JSON.parse(localStorage.getItem('bread'))
        this.breadState = true
        if(breadArray) {
            this.breadItems = breadArray
        } else {
            this.breadItems = [
                {
                    name: "根目录",
                    id: ""
                },
            ]
        }
    }
}
</script>

<style>

</style>
