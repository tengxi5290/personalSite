<template>
    <section class="cms-body flex">

        
        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
        <!-- 返回按钮 -->

        <!-- 页面list内容 -->
        <div class="cms-content-right">

            <!-- 右边内容的大盒子 -->
            <div class="cms-list-header clearfix flex">
            <!-- 右边内容的上方盒子 -->

                <div class="cms-left channel-group">
                <!-- 两个按钮的区域 -->
                    <el-button type="primary" @click="edit">编辑</el-button>
                </div>

            
            </div>

            <el-form v-if="plat==1"  ref="form" :model="info" :rules="rules" class="cms-form" label-width="100px"  v-loading="loading" style="margin:0;padding:0">  
            
                <el-form-item label="云存储服务商" class="flex-50"  prop="type" >
                    <el-radio :disabled="editAble" v-model="info.type" :label="1">七牛</el-radio>
                    <el-radio :disabled="editAble" v-model="info.type" :label="2">金山</el-radio>
                </el-form-item> 

                <el-form-item label="云平台应用id" class="flex-50"  prop="appId">
                    <el-input v-model="info.appId" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="空间名称" class="flex-50"  prop="bucketName">
                    <el-input v-model="info.bucketName" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="地域标识" class="flex-50"  prop="region">
                    <el-input v-model="info.region" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="云平台应用秘钥" class="flex-50"  prop="appSecretId">
                    <el-input v-model="info.appSecretId" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="结束点" class="flex-50"  prop="endPoint">
                    <el-input v-model="info.endPoint" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 
            </el-form>

            <el-form v-if="plat==0"  ref="form" :model="info" :rules="rules" class="cms-form" label-width="100px"  v-loading="loading" style="margin:0;padding:0">  
                

                <el-form-item label="服务器IP" class="flex-50"  prop="ip">
                    <el-input v-model="info.ip" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="端口" class="flex-50"  prop="port">
                    <el-input v-model="info.port" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="用户名" class="flex-50"  prop="userName">
                    <el-input v-model="info.userName" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 

                <el-form-item label="密码" class="flex-50"  prop="password">
                    <el-input v-model="info.password" class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 
            </el-form>

            <div class="cms-list-footer" style="padding-bottom:52px;">
                <!-- 底部盒子 -->
                <div class="cms-left">
                <!-- 装按钮的盒子 -->
                    <el-button type="success" :disabled="editAble" @click="update">提交</el-button>
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
            params:this.$route.query,//前一页面传过来的数据
            plat:0,//文件存储类型,是oss还是ftp
            url:'',//根据plat改变地址,
            editAble:true,
            storageId:'',//存储id,和文件新建的id一致
            info:{
                storageId:'',
                type:'',
                appId:'',
                appSecretId:'',
                bucketName:'',
                region:'',
                ip:'',
                port:'',
                userName:'',
                password:'',
            },//新建时提交的数据

            rules: {
                //校验规则
                name: [required],
                enable: [required],
                domain:[required],
                plat:[required],
                rootPath:[required],
            },
        }
    },
    methods:{
        back(){
            this.routerLink('/storage/list')
        },//返回方法

        chooseType(){
            let plat=this.plat;
            if(plat==0){
                this.url=this.$api.ftpInfo;
            }else if(plat==1){
                this.url=this.$api.ossInfo;
            }
        },//根据plat来决定页面的结构和类型

        getInfo(id){
            let url=this.url;
            axiosProxy.get(url+'/'+id)
                .then(res=>{
                    
                    if(res.data.errorCode == 0){
                        let infoList= res.data.data;
                        if(infoList==null){
                            this.editAble=false;
                        }else{
                            this.info=infoList;
                        }
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取存储列表失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)})
        },//获取存储列表

        update(){
            
            let url=this.url;
            let params=this.info;
            params.storageId=this.storageId;
            axiosProxy.post(url,params)
                .then(res=>{
                    console.log(res)
                    if(res.data.errorCode==0){
                        this.successMessage("更新成功!")
                        setTimeout(() => {
                            this.routerLink('/storage/list')
                        },1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('更新失败')
                        }
                    }
                })
                .catch(err=>{console.log(err)})
        },//更新已有存储配置
    
        edit(){
            this.editAble=false;
        },//确定开始编辑基本信息
    },
    created(){
        this.$store.dispatch("setCollapse", true); //收缩状态栏
        this.loading=false;

        let id=this.params.id;//获得传来的id
        let element=this.params.element;//传来的那一行的完整信息
        this.plat=element.plat;//获得前页的plat

        this.storageId=id;

        this.chooseType();//决定页面类型

        this.getInfo(id);//获取存储列表
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

.cms-content-right{
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
