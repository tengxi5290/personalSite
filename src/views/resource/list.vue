<template>
    <section class="cms-body flex">

        <!-- 页面树组件 -->
        <div v-if="refresh">
            <cms-filetree @click="treeClick" treeType="page" :hasContent='false' :highlight-current='true'></cms-filetree>
        </div>
        <!-- 页面list内容 -->
        <div class="cms-content-right">
        <!-- 右边内容的大盒子 -->
            
            <!-- 新建存储路径的弹窗 -->
            <el-dialog title="新建存储路径" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="路径" :label-width="formLabelWidth">
                        <el-input v-model="form.path" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 编辑已有存储路径的弹窗 -->
            <el-dialog title="编辑已有存储路径" :visible.sync="infoEditVisible">
                <el-form :model="editForm">
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="editForm.editName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="路径" :label-width="formLabelWidth" >
                        <el-input disabled v-model="editForm.path" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="全路径" :label-width="formLabelWidth">
                        <el-input disabled v-model="editForm.fullPath" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="infoEditVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 图片预览的弹窗 -->
            <el-dialog title="图片预览" :visible.sync="imgVisible">
                <span>
                    分辨率(宽X高):{{width}}X{{height}}
                </span>
                <br>
                <img :src="pic" alt="图片加载失败!">
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="imgVisible = false">确 定</el-button>
                </div>
            </el-dialog>

            <div class="cms-list-header clearfix flex">
            <!-- 右边内容的上方盒子 -->
                <div class="bread-box cms-left">
                    <label class="">当前目录:</label>
                    <ul class="type-bread">
                        <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
                        <a href="javascript:void(0)" >{{item.name}}</a>
                        </li>
                    </ul>
                </div>

                <el-button type="primary" @click="addResource" style="margin-right:10px;"
                >新建存储路径</el-button>

                <el-button type="danger" @click="infoEdit" style="margin-right:10px;"

                :disabled="editAble"
                >编辑路径信息</el-button>
                
                <el-button :disabled="editAble" type="success">
                    <a href="javascript:;" class="a-upload">
                        <input :disabled="editAble"  type="file" ref="inputer"   @change="submitFile">上传文件
                    </a>
                上传文件</el-button>

                
            </div>

            <!-- 表格 -->
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
                <el-table-column type="selection" width="50" align="right"></el-table-column>
                <el-table-column prop="name" label="名称" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="hoverPicParent">
                            <i class="el-icon-picture" v-show="scope.row.type=='jpg'||scope.row.type=='png'||scope.row.type=='jpeg'||scope.row.type=='gif'"></i>
                            {{scope.row.name}}
                            <img :src="scope.row.httpUrl" class="hoverPic" v-show="scope.row.type=='jpg'||scope.row.type=='png'||scope.row.type=='jpeg'||scope.row.type=='gif'">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="httpUrl" label="地址"   align="center"></el-table-column>
                <el-table-column prop="size" label="大小"   align="center">
                    <template slot-scope="scope">
                            <span>{{scope.row.size}} KB</span>
                        </template>
                </el-table-column>

                <el-table-column prop="name" label="操作"   align="center">
                    <div slot-scope="scope">
                        <cms-button type="edit" @click="routerLink('/resource/editor','update',scope.row.id,{info:scope.row})"
                            v-if="scope.row.type=='html'||scope.row.type=='css'||scope.row.type=='js'"
                        ></cms-button>
                        <cms-button type="view" @click="imgShow(scope.row)"
                            v-if="scope.row.type=='jpg'||scope.row.type=='png'||scope.row.type=='jpeg'||scope.row.type=='gif'" 
                        ></cms-button>
                    </div>
                </el-table-column>
                
            </el-table>
            <!-- 表格底部 -->
            <div class="cms-list-footer">
                    <!-- cms分页组件 -->
                <cms-pagination :total="allTotal" @change="getPages" :pageSize="ask.pageSize" :page="ask.page" :init="true"></cms-pagination>
            </div> 
            
        </div>
        
    </section>
</template>

<script>
import listMixins from "@/mixins/list"
import {axiosProxy,getPageTreeParams,axiosProxyFiles} from "@/api/tool"
import axios from 'axios'
export default {
    mixins: [listMixins],
    data(){
        return{
            refresh:true,//树是否显示
            editAble:true,//是否可以编辑路径信息

            allTotal: 0, //分页总数
            ask:{//查询分页的数据
                modelId: '',
                status: '',
                orderByClause: '',
                title: '',
                channelId: '',
                page: 1,
                pageSize: 10
            },
            params:this.$route.query,//前页面传过来的数据,如id等
            tableData:[],//页面中的数据的集合
            breadState:false,//默认当前目录不显示
            breadItems: [
                {
                    name: "根目录",
                    id: ""
                },
            ], //面包屑,用来存储并显示当前目录的数组
            listType:'',//当前页面类型,决定是否可以新建目录和栏目
            pageId:'',//新建区块用到的父id
            infoList:[],//获得树里所有文件的信息,树中只有文件,没有其他图片,页面的信息

            //下面这些是新建弹窗的参数
            dialogFormVisible: false,
            form: {
                name: '',
                parentId:'',
                path:'',
            },
            formLabelWidth: '80px',

            infoEditVisible:false,//编辑已有存储的弹窗控制.
            editForm:{
                fullPath:'',
                id:'',
                editName:'',
                path:'',

            },
            formLabelWidth: '80px',

            imgVisible:false,//图片预览的弹窗
            pic:'',//图片弹窗时使用的url,图片url
            width:0,//图片分辨率宽度
            height:0,//图片分辨率高度

            value:0,//上传的文件类型,默认为0
            fileList: [],
        }
    },
    methods:{
        
        submitFile(e){
            let inputDOM = this.$refs.inputer
            // 通过DOM取文件数据
            this.fileList    = inputDOM.files[0]
            let formdata = new FormData()
            formdata.append('file',inputDOM.files[0])
            
            let pid=localStorage.getItem('fileBid').split(',')[1]
            let url=this.$api.uploadFiles+'/'+this.value+'?resourceTreeId='+pid

            

            //上传文件提交的方法
            axiosProxyFiles.post(url,formdata)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("上传成功!")
                        setTimeout(() => {
                                //这些是获取tabledata的方法
                                let resPageUrl=this.$api.resourcePage
                                
                                let params='?resourceTreeId='+pid
                                axiosProxy.get(resPageUrl+'/'+params)
                                    .then(res=>{
                                        if(res.data.errorCode == 0){
                                            let info=res.data.data.list
                                            info=this.parentRel(info,1,pid)//父子级确定
                                            info=this.chooseType(info)//类型确定
                                            this.tableData=info
                                        } else {
                                            if(res.data.errorMessage){
                                                this.errorMessage(res.data.errorMessage)
                                            } else {
                                                this.errorMessage('获取失败')
                                            }
                                        }
                                    })
                                    .catch(err=>{console.log(err)})
                        },1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('上传失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)})

        },//上传文件的方法

        //以下三个为分页的方法,应用于下方cms-pagenation
        getPages(current, size) {
            this.ask.pageSize = size
            this.ask.page = current
            this.showTableData(this.queryString('page'))
        },
        queryString (data) {
            let pid=localStorage.getItem('fileBid').split(',')[1]
            let url = this.$api.resourcePage+'?resourceTreeId='+pid
            if(data != 'page') {
                this.ask.page = 1
                // this.ask.pageSize = 10
            }
            for (let i in this.ask) {
                if(this.ask[i] != '') {
                    if(url.indexOf('?') == -1) {
                        url = url + '?' + i + '=' + this.ask[i]
                    } else {
                        url = url + '&' + i + '=' + this.ask[i] 
                    }
                }
            }
            return url
        },
        showTableData(api, datas) {
            axiosProxy
                .get(api, datas)
                .then(res => {
                    this.loading = false
                    if (res.data.errorCode == '0') {
                        this.tableData = res.data.data.list
                        this.allTotal = res.data.data.total
                    } else {
                        this.tableData = []
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('分页组件获取内容失败')
                        }
                    }
                })
                .catch(error => {
                    this.loading = false
                    this.state = false
                })
        },

        treeClick(data,node){

            if(data.id==-1){

                // this.getCreated()
                this.editAble=true
                this.breadState=true//在新建按钮旁边,显示当前目录的路径
                this.creatBread(node, [])//获得当前目录
                this.tableData=[]
            }else{
                this.editAble=false

                let newData=data
                this.editForm=newData
                this.editForm.editName=newData.name

                this.breadState=true//在新建按钮旁边,显示当前目录的路径
                this.creatBread(node, [])//获得当前目录


                let id=data.id
                //确定文件上传的url
                this.actionUrl=this.$api.uploadFiles+'/0'+'?resourceTreeId='+id

                let url=this.$api.resourcePage
                
                let params='?resourceTreeId='+id
                axiosProxy.get(url+'/'+params)
                    .then(res=>{
                        
                        if(res.data.errorCode==0){
                            let info=res.data.data.list
                            info=this.parentRel(info,1,data.id)//父子级确定
                            info=this.chooseType(info)//类型确定
                            this.allTotal=info.length//下方分页器的总条数
                            this.tableData=info
                        }else{
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('树点击获取内容失败')
                            }
                        }
                    })
                    .catch(err=>{console.log(err)})
            }

        },//页面树点击事件

        creatBread(node, arr) {
            if (node.parent != null) {
                let params = {
                name: node.data.name,
                id: node.data.id
                }
            arr.push(params)
            this.creatBread(node.parent, arr)
            } else {
                this.breadItems = arr.reverse()

                var breadStr =''
                let pid=''
                for (let i in this.breadItems) {
                    breadStr=breadStr+this.breadItems[i].name+'/' //属性
                    pid=this.breadItems[i].id
                }
                
                
                localStorage.setItem('fileBid',[breadStr,pid])//将list页面保存到的,名字目录和id,存起来,到edit页面用
                return false
            }
        },// 获取当前目录的函数
        
        getCreated(){

            let url=this.$api.resoureTreeList
            axiosProxy.get(url)
                .then(res=>{
                    
                    if(res.data.errorCode==0){
                        let info=res.data.data
                        this.infoList=info
                        info=this.chooseType(info)//处理好类型
                        info=this.parentRel(info,0)//处理好父子级关系
                        this.tableData=info
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取内容失败')
                        }
                    }

                })
                .catch(err=>{console.log(err)})
        },//页面初始化函数,需求改了,list里面不显示所有文件,所以这个方法没有被调用

        parentRel(info,num,id){
            let returnInfo=[]
            if(num==0){//这是从created中传过来的,只负责第一级
                for(let i in info){
                    if(info[i].pId==null){
                        returnInfo.push(info[i])
                    }
                }
                return returnInfo
            }else if(num==1){
                let oldList=this.infoList
                for(let i in oldList){
                    if(oldList[i].pId==id){
                        info.push(oldList[i])
                    }
                }
                return info.reverse()
            }
        },//处理父子级关系的函数

        chooseType(info){
            for(let i in info){
                if(info[i].fileName){
                    let arr=info[i].fileName
                    arr=arr.split('.')[1]
                    info[i].type=arr
                }else if(info[i].listType==null){
                    info[i].type='文件'
                }
            }
            return info
        },//文件,图片,其他的类型处理

        addResource(){
            this.dialogFormVisible=true
        },//使弹窗弹出来的函数.

        submitConfirm(){
            let url=this.$api.resourceTree
            let info=localStorage.getItem('fileBid')
            let pid
            if (info) {
                pid=info.split(',')[1]
                if(pid==-1){
                    pid=''
                }
            } else {
                pid = ''
            }
            let params=this.form
                params.parentId=pid
            axiosProxy.post(url,params)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("新建成功!")
                            setTimeout(() => {
                                this.reflashClick()
                                this.dialogFormVisible=false
                            },1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('新建失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)
                    
                })
        },//确定新建,提交的函数

        infoEdit(){
            this.infoEditVisible=true
        },//编辑已有存储信息
        submitEditConfirm(){
            this.infoEditVisible=false
            let url=this.$api.resourceTreeUpdate
            let params=this.editForm
            params.name=params.editName

            axiosProxy.put(url,params)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("修改成功!")
                        this.breadItems[this.breadItems.length-1].name=params.name
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('修改失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)})
        },//编辑之后,提交信息
        imgShow(pic){
            this.pic=pic.httpUrl
            let url=this.$api.resourceGetPpi
            axiosProxy.get(url+'?imageUrl='+this.pic)
                .then(res=>{
                    if(res.data.errorCode==0){
                        let ppi=res.data.data
                        this.width=ppi.width
                        this.height=ppi.height
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('图片预览失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)})
            this.imgVisible=true
        },//图片预览的函数

        reflashClick(){
            this.refresh=false
            setTimeout(() => {
                this.refresh=true    
            },100)
        },//树的刷新函数
    },
    created(){
        this.$store.dispatch("setCollapse", true) //收缩状态栏
    },
    mounted(){
        let clientHeight=document.body.clientHeight
        $('.cms-body').css('minHeight',(clientHeight-110)+'px')
    }
}
</script>

<style>
/* 隐藏了input的样式,覆盖在上传文件按钮上 */
.a-upload{
    margin-top: -6px;
    margin-left: -15px;
    opacity: 0;
    z-index: 90;
    position: absolute;
    width: 84px;
    height: 32px;
}

.a-upload input{
    display: block;
    width: 84px;
    height: 32px;
}

/* 图片预览的样式 */
.hoverPic{
    width: 90px;
    height: 60px;
    display: none;
    position: absolute;
    left: 180px;
    top: 0px;
    z-index: 999;
}
.hoverPicParent:hover .hoverPic{
    display: block;
}
</style>
