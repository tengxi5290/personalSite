<template>
    <section class="cms-body flex">

        
        
        <!-- 页面list内容 -->
        <div class="cms-content-right list-content-right">

            <div class="mask" v-if="showMask"></div>
            <!-- 蒙层和新建蒙层 -->
            <div class="maskInfo" v-if="showAddMask">
                <div class="header">
                    <div class="font">新建配置</div>
                    <i class="el-icon-close" @click="closeMask"></i>
                </div>

                <div class="body">
                    <el-form ref="form" :model="info" :rules="rules">
                        <el-form-item label="名称" class="flex-100"  prop="name">
                            <el-input v-model="info.name" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="路径" class="flex-100"  prop="rootPath">
                                <el-input v-model="info.rootPath" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="域名" class="flex-100"  prop="domain">
                                <el-input v-model="info.domain" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="可用" class="flex-100"  prop="enable">
                                <el-radio v-model="info.enable" checked :label="true">是</el-radio>
                                <el-radio v-model="info.enable" :label="false">否</el-radio>
                        </el-form-item>
                        <el-form-item label="类型" class="flex-100"  prop="plat">
                                <el-radio v-model="info.plat" :label="0">FTP</el-radio>
                                <el-radio v-model="info.plat" :label="1">OSS</el-radio>
                        </el-form-item>

                    </el-form>
                </div>

                <div class="footer">
                    <div class="btnGroup">
                        <el-button @click="closeMask">关闭</el-button>
                        <el-button type="primary" @click="add">提交</el-button>
                    </div>
                </div>
            </div>

            <!-- 更新基本信息蒙层 -->
            <div class="maskInfo" v-if="showUpdateMask">
                <div class="header">
                    <div class="font">编辑配置</div>
                    <i class="el-icon-close" @click="closeMask"></i>
                </div>

                <div class="body">
                    <el-form ref="form" :model="singleTableData" :rules="rules">
                        <el-form-item label="名称" class="flex-100"  prop="name">
                            <el-input v-model="singleTableData.name" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="路径" class="flex-100"  prop="rootPath">
                                <el-input disabled v-model="singleTableData.rootPath" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="域名" class="flex-100"  prop="domain">
                                <el-input v-model="singleTableData.domain" class="cms-width"></el-input>
                        </el-form-item> 
                        <el-form-item label="类型" class="flex-100"  prop="plat">
                                <el-radio v-model="singleTableData.plat" :label="0">FTP</el-radio>
                                <el-radio v-model="singleTableData.plat" :label="1">OSS</el-radio>
                        </el-form-item>
                        <el-form-item label="允许文件类型" class="flex-100"  prop="fileType" >
                                <el-radio v-model="singleTableData.fileType" :label="0" disabled>其他</el-radio>
                                <el-radio v-model="singleTableData.fileType" :label="1" disabled>图片</el-radio>
                                <el-radio v-model="singleTableData.fileType" :label="2" disabled>音视频</el-radio>
                                <el-radio v-model="singleTableData.fileType" :label="null" disabled>均有</el-radio>
                        </el-form-item>
                        <el-form-item label="是否是默认配置" class="flex-100"  prop="isDefault">
                                <el-radio v-model="singleTableData.isDefault" :label="true">是</el-radio>
                                <el-radio v-model="singleTableData.isDefault" :label="false">否</el-radio>
                        </el-form-item>
                        

                    </el-form>
                </div>

                <div class="footer">
                    <div class="btnGroup">
                        <el-button @click="closeMask">关闭</el-button>
                        <el-button type="primary" @click="update">提交</el-button>
                    </div>
                </div>
            </div>

            <!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>
            <! 若改善页面的样式,可以启用这里的样式,这个是element ui中的弹窗样式
            <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
            </el-dialog> -->

            <!-- 右边内容的大盒子 -->
            <div class="cms-list-header clearfix flex">
            <!-- 右边内容的上方盒子 -->

                <div class="cms-left channel-group">
                <!-- 两个按钮的区域 -->
                    <el-button type="primary" @click="addNewStorage">添加</el-button>
                </div>

            
            </div>

            <el-table :data="tableData" stripe>
                    <!-- 中间内容部分 -->

                <el-table-column label="名称"  prop="name"  align="center"></el-table-column>

                <el-table-column label="路径"  prop="rootPath"  align="center">
                </el-table-column>

                <el-table-column prop="enable" label="可用" align="center">
                    <div slot-scope='scope' >
                        <el-checkbox v-model="scope.row.enable" v-on:change="$emit('change', enableUpdate(scope.row))"></el-checkbox>
                    </div> 
                </el-table-column>

                <el-table-column prop="isDefault" label="默认配置" align="center">
                    <div slot-scope='scope' >
                        <el-checkbox v-model="scope.row.isDefault" v-on:change="$emit('change', defaultUpdate(scope.row))"></el-checkbox>
                    </div> 
                </el-table-column>

                <el-table-column prop="plat" label="存储平台" align="center">
                    <div slot-scope='scope' >       
                        <span v-if="scope.row.plat=='0'">FTP</span>
                        <span v-if="scope.row.plat=='1'">OSS</span>
                    </div> 
                </el-table-column>


                <el-table-column label="编辑" align="center">
                    <div slot-scope="scope">
                        <cms-button type="edit"  @click="toEdit(scope.row)"
                        v-perms="'/channel/update'" 
                        ></cms-button>
                    </div>
                </el-table-column> 

                <el-table-column label="详情配置" align="center">
                    <div slot-scope="scope">
                        <cms-button type="view"  @click="routerLink('/storage/detail','update',scope.row.id,{element:scope.row})"
                        v-perms="'/channel/update'" 
                        ></cms-button>
                    </div>
                </el-table-column> 

            </el-table>


            <div class="cms-list-footer" style="padding-bottom:52px;">
                <!-- 底部盒子 -->
                <div class="cms-left">
                <!-- 装按钮的盒子 -->
                </div>
            </div>

        </div>

        

    </section>
</template>

<script>
import listMixins from "@/mixins/list";
import {axiosProxy,checkErrorCode} from "@/api/tool"
import va from "@/rules";
export default {
    mixins: [listMixins],
    data(){
        let required = va.required();
        let number = va.number();
        let string = va.string();
        return {
            tableData:[],//存储列表数据
            singleTableData:[],//单个的列表数据
            showMask:false,//蒙层是否显示
            showAddMask:false,//新增蒙层是否显示
            showUpdateMask:false,//更新蒙层的显示
            info:{
                name:'',
                plat:'',
                enable:true,
                rootPath:'',
                domain:'',
            },//新建时提交的数据

            rules: {
                //校验规则
                name: [required],
                enable: [required],
                domain:[required],
                plat:[required],
                rootPath:[required],
            },

            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            id:'',//被选中之后,进入编辑页面,更改是否默认信息的row.id
        }
    },
    methods:{

        defaultUpdate(info){
            let listId=info.id;
            let isDefault=info.isDefault;
            let element="?ids="+listId+"&defaults="+isDefault;
            let url=this.$api.defaultUpdate;

            axiosProxy.put(url+element)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("更新状态成功")
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('更新状态失败')
                        }
                        setTimeout(()=>{
                            info.isDefault=!isDefault
                        },500)
                    }
                })
                .catch(err=>{
                    console.log(err);
                    setTimeout(()=>{
                        info.isDefault=!isDefault
                    },500)
                })
        },//更新是否启用默认配置的方法

        enableUpdate(info){
            let listId=info.id;
            let enable=info.enable;
            let element="?ids="+listId+"&enables="+enable;
            let url=this.$api.enableUpdate;
            axiosProxy.put(url+element)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("更新状态成功")
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('更新状态失败')
                        }
                        setTimeout(()=>{
                            info.enable=!enable
                        },500)
                    }
                })
                .catch(err=>{
                    console.log(err)
                    setTimeout(()=>{
                        info.enable=!enable
                    },500)
                })
        },//更新是否可用的方法

        getInfoList(){
            let url=this.$api.storageList
            axiosProxy.get(url)
                .then(res=>{
                    if(res.data.errorCode == 0){
                        let infoList= res.data.data;
                        this.tableData=infoList;
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取站点失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
        },//获取存储列表

        toEdit(scopeRow){
            //打开蒙层
            this.showMask=true;
            this.showUpdateMask=true;

            //获得了当前的信息
            this.singleTableData=scopeRow;
            this.id=scopeRow.id;
        },//编辑存储列表的信息

        addNewStorage(){

            this.showMask=true;
            this.showAddMask=true;  
        },//添加新的存储
    
        closeMask(){
            this.showMask=false;
            this.showAddMask=false; 
            this.showUpdateMask=false;
        },//关闭蒙层

        add(){

            let url=this.$api.storageAdd;
            let params=this.info;
            axiosProxy.post(url,params)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("新建成功!")
                        setTimeout(() => {
                            this.getInfoList();//获取存储列表
                            this.showMask=false;
                            this.showAddMask=false;
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
        },//新建提交

        update(){
            let url=this.$api.storageUpdate;
            let params=this.singleTableData;
            // let defaultUrl=this.$api.storageListIsDefault+'?ids='+this.id+'&defaults='+this.singleTableData.isDefault;
            axiosProxy.put(url,params)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("更新成功!")
                        setTimeout(()=>{
                            this.getInfoList();//获取存储列表
                            this.showMask=false;
                            this.showUpdateMask=false;
                        },1000)
                    }else{
                        this.tableData.isDefault=!this.tableData.isDefault
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('更新失败')
                        }
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        },//更新已有存储配置

    },
    created(){
        this.$store.dispatch("setCollapse", true); //收缩状态栏

        this.getInfoList();//获取存储列表
    },
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

.list-content-right{
    /* 让右边的内容距离左边边距为0 */
    padding-left:0;
}

.mask{
/* 蒙层的样式 */
    position: fixed;
    height: 100%;
    width: 100%;
    background: black;
    opacity: .6;
    z-index: 20;
}
.maskInfo{
    /* 新建时的弹窗 */
    min-width: 600px;
    position: fixed;
    left:400px;
    top: 150px;
    background: white;
    z-index: 100;
}
.header{
    height: 60px;
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
    display: flex;
    justify-content: space-between;
}
.font{
    font-size: 28px;
    padding-left: 30px;
    padding-top: 5px;
}
.header i{
    padding-top: 10px;
    padding-right: 10px;
}
.body{
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
}
.body {
    padding-top:20px;
    padding-left: 30px
}
.footer{
    height: 60px;
    width: 100%;
}
.footer .btnGroup{
    position: absolute;
    width: 50%;
    margin-top: 10px;
    margin-left: 350px;
}
</style>
