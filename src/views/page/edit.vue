<template>
    <section class="cms-body flex">
        <a class="cms-back" href="javascript:;" @click="back"></a>
        <!-- 页面list内容 -->
        <div style="width: 100%;">
        <!-- 右边内容的大盒子 -->

            <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px"  v-loading="loading" style="margin:0;padding:0">
                <el-form-item label="上级栏目" class="flex-50"  prop="parentId" >
                    
                    <el-input :disabled="true" class="cms-width" :value="channelShowList"></el-input> 

                </el-form-item>     
                
                <el-form-item label="id" class="flex-50"  prop="id">
                    <el-input v-model="info.id" class="cms-width" disabled></el-input>
                </el-form-item> 
            
                <el-form-item label="名称" class="flex-50"  prop="showName" v-if="info.showName">
                    <el-input v-model="info.showName"  class="cms-width"></el-input>
                </el-form-item> 

                <el-form-item label="名称" class="flex-50"  prop="name" v-else>
                    <el-input v-model="info.name"  class="cms-width"></el-input>
                </el-form-item> 

                <el-form-item label="路径" class="flex-50"  prop="path" v-if="info.path">
                        <el-input :disabled="true" v-model="info.path" class="cms-width"></el-input>
                </el-form-item> 

                <el-form-item label="类型"  prop="type" class="flex-50" >
                    <el-input :disabled="true" class="cms-width" :value="type"></el-input>
                </el-form-item>

                <el-form-item label="链接类型" class="flex-50" prop="linkType" v-if="type == '区块'">
                    <el-select v-model="info.linkType" placeholder="请选择" @change="getLinkType">
                        <el-option key="其他" label="其他" value="0"></el-option>
                        <el-option key="HTML" label="HTML" value="1"></el-option>
                        <el-option key="区块" label="区块" value="2"></el-option>
                        <el-option key="栏目" label="栏目" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="展示类型" class="flex-50" prop="showType" v-if="type == '区块'">
                    <el-select v-model="info.showType" placeholder="请选择" @change="getShowType">
                        <el-option key="显示名字" label="显示名字" value="0"></el-option>
                        <el-option key="不显示名字" label="不显示名字" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="生成默认区块链接" class="flex-50" prop="default" v-if="type == '区块' && (info.linkType == '2' || info.linkType == 2 || info.linkType == '区块')">
                    <el-switch v-model="info.default"></el-switch>
                </el-form-item>

                <el-form-item label="链接地址" class="flex-100" prop="moreUrl" v-if="type == '区块'">

                    <div v-if="info.linkType !== '3' && info.linkType !== '栏目'">
                        <el-input class="cms-width" v-model="info.moreUrl" v-if="info.default == true" disabled></el-input>
                        <el-input class="cms-width" v-model="info.moreUrl" v-else></el-input>                            
                    </div>

                    <div v-if="info.linkType == '3' || info.linkType == '栏目'">
                        <el-input class="cms-width" :value="selectedChannel" @focus="toggleShow"></el-input> 
                        <div style="width: 100%;" v-if="showInputList">
                            <div class="triangle"></div>
                            <div class="input-list">
                                <cms-tree @click="getCurrentChannel" treeType="page"></cms-tree>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item label="可用" class="flex-50" prop="enable" v-if="params.type == 'DIR'">
                    <el-radio-group v-model="info.enable">
                        <el-radio :label="true">是</el-radio> 
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group> 
                </el-form-item> 

                <el-form-item label="行数" class="flex-50" prop="rowNum" v-if="type == '区块'">
                    <el-input class="cms-width" type="number" @blur="checkRows" v-model="info.rowNum"></el-input>
                </el-form-item>

                <el-form-item label="排序" class="flex-50" prop="priority" v-if="type == '区块'">
                    <el-input class="cms-width" type="number" @blur="checkPriority" v-model="info.priority" disabled></el-input>
                </el-form-item>

                <el-form-item label="类型" class="flex-50" prop="blockType" v-if="type == '区块'">
                    <el-select v-model="info.blockType" placeholder="请选择" @change="getType">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> 

                <el-form-item label="角标" class="flex-50" prop="blockIcon" v-if="type == '区块'">
                    <uploader @change="getUrl" v-if="showImage" :default="info.blockIcon"></uploader>
                    <!-- <span class="red">请选择上传角标图片或者直接输入图片路径</span>
                    <el-input class="cms-width" type="text" v-model="info.blockIcon" @blur="showPicture"></el-input> -->
                </el-form-item> 

                <!-- 动态表单 -->


                <div class="form-footer">

                    <el-button  type="primary"  @click="update(info)"
                    >修改</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </div>
            </el-form>

        </div>

    </section>
</template>

<script>
import formMixins from "@/mixins/form";
import {axiosProxy,getPageTreeParams} from "@/api/tool"
import va from "@/rules";

export default {
    mixins: [formMixins],
    data(){
        let self = this;
        let required = va.required();
        let number = va.number();
        let string = va.string();
        return{
            parentId: '',
            listType: null,
            info:{
                moreUrl: null,
                default: true,
                moreUrl: null
            },//页面中部渲染的内容
            rules:{
                id:[required],
                name:[required],
                path:[required],
                type:[required],
            },//校验规则
            channelShowList:'',//显示上级栏目
            params:this.$route.query, //前一个页面带过来的数据
            options: [{
              value: 1,
              label: 'Banner'
            }, {
              value: 2,
              label: '横图大图'
            }, {
              value: 3,
              label: '竖图大图'
            }, {
              value: 4,
              label: '横图普通'
            }, {
              value: 5,
              label: '竖图普通'
            }, {
              value: 6,
              label: '横图横划'
            }, {
              value: 7,
              label: '竖图横划'
            }, {
              value: 8,
              label: '多大图'
            }, {
                value: 9,
                label: '正图横划'
            }, {
                value: 10,
                label: '外部引用json'
            }, {
                value: 11,
                label: '层叠式轮播'
            }, {
                value: 12,
                label: '专题'
            }],
            value: '',
            showImage: true,
            exsitedBlocks: [],

            selectedChannel: null,
            showInputList: false,
            finalChannelId: null,
            currentChannelGroup: [],
            currentSiteId: null
        }
    },
    created(){
        this.currentSiteId = window.localStorage.getItem('_site_id_param')
        if(this.$route.query.parentId != null) {
            if(this.$route.query.pageType == 'PAGE') {
                this.parentId = this.$route.query.parent
            } else if(this.$route.query.pageType == 'BLOCK') {
                this.parentId = this.$route.query.parent
            } else {
                this.parentId = this.$route.query.parentUriId
            }
        } else {
            this.parentId = 0
        }
        this.loading=false

        this.getBlockTree(this.parentId)

        let childId = this.$route.query.real_id
        let childType=this.params.type
        
        this.getInfo(childId,childType)
    },
    mounted() {
        this.$store.dispatch("setCollapse", true)
        this.$store.state.enableButton = false
        let clientHeight = document.body.clientHeight
        $(".cms-body").css("minHeight", clientHeight - 110 + "px")
    },
    methods:{
        getLinkType (value) {
            if(value == 0 || value == '0') {
                this.info.moreUrl = ''
            }
            this.$set(this.info, 'linkType', value)
        },

        getShowType (value) {
            this.$set(this.info, 'showType', value)
        },

        getChannel (id) {
            axiosProxy.get(this.$api.channelInfo + '/' + id).then(res => {
                if(res.data.errorCode == '0') {
                    this.currentChannelGroup.push(res.data.data.name)
                    if(res.data.data.parentId) {
                        this.getChannel(res.data.data.parentId)
                    }
                    this.currentChannelGroup = this.currentChannelGroup.reverse()
                    this.selectedChannel = this.currentChannelGroup.join('/')
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('操作失败')
                    }
                }
            })
        },

        toggleShow () {
            if(this.showInputList == false) {
                this.showInputList = true
            } else {
                this.showInputList = false
            }
        },

        getCurrentChannel (data, node) {
            if(node.parent.data != undefined) {
                this.selectedChannel = data.name
                if(node.parent.parent.data != undefined) {
                    this.selectedChannel =  node.parent.data.name + '/' + data.name
                    if(node.parent.parent.parent.data != undefined) {
                        this.selectedChannel = node.parent.parent.data.name + '/' + node.parent.data.name + '/' + data.name
                    } 
                } 
            } 
            this.finalChannelId = data.id
            this.showInputList = false
        },

        getBlockTree (parentId) {
            let url = this.$api.blockPage + '/' + parentId
            axiosProxy.get(url).then( res => {
                if(res.data.errorCode == 0) {
                    this.exsitedBlocks = res.data.data
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('新建失败')
                    }
                }
            }).catch( error => {
                console.log(error)
            })
        },

        checkPriority (e) {
            if(e.target.value > 0) {

            } else {
                this.$alert('排序需要正整数哦', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.info.priority = 1
                    }
                })
            }
        },
        showPicture () {
            this.showImage = false
            setTimeout (() => {
                this.showImage = true
            },100)
        },
        checkRows (e) {
            if(e.target.value > 0 && e.target.value <= 100) {
                
            } else {
                this.$alert('行数不能为空且最大不超过100', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                       this.info.rowNum = 1  
                    }
                })
            }
        },
        getType (value) {
            this.$set(this.info, 'blockType', value)
        },
        getUrl (imageUrl, index, imagePath, storageId) {
            this.$set(this.info, 'blockIcon', imageUrl)
        },
        reset () {
            this.info.name = ''
            this.info.showName = ''
            this.info.showType = '显示名字'
            this.info.blockIcon = null
            this.info.blockType = null
            this.info.rowNum = 1
            this.info.priority = 1
            this.showImage = false
            setTimeout (() => {
                this.showImage = true
            }, 100)
        },
        treeClick(data,node){
            if(node.isLeaf){
                this.getInfo(data.rid,this.params.type)
            }else if(data.id==-1){//点击根目录,不动
                this.routerLink('/page/list',0)
            }else{
                let element=getPageTreeParams(node);//拼接好的参数
                this.routerLink('/page/list','',element)
            }
        },//页面树点击

        getInfo(id,type){
            
            let breadStr = JSON.parse(localStorage.getItem('treeBread'))
            if(breadStr) {
                for (let i in breadStr) {
                    this.channelShowList = this.channelShowList + breadStr[i].name + '/'
                }
                this.channelShowList = this.channelShowList.slice(0, this.channelShowList.length - 1)
            } else {
                this.channelShowList = '根目录'
            }
            let pid = localStorage.getItem('parent')

            let url='';
            if(type) {
                if(type=='DIR'){
                    url=this.$api.getCatalog;
                    this.type='栏目'
                }else if (type == 'PAGE'){
                    this.type='页面'
                    url=this.$api.getPage
                } else {
                    this.type = '区块'
                    url = this.$api.getBlock
                }
            } else {
                this.type = '区块'
                url = this.$api.getBlock
            }
            axiosProxy.get(url+'/'+id).then(res=>{
                if(res.data.errorCode==0){
                    let info=res.data.data
                    this.info=info
                    this.showImage = false
                    let channel_id

                    switch (info.linkType) {
                        case 0:
                        case '0':
                            this.info.linkType = '其他'
                        break
                        case 1:
                        case '1':
                            this.info.linkType = 'HTML'
                        break
                        case 2:
                        case '2':
                            this.info.linkType = '区块'
                        break
                        case 3:
                        case '3':
                            this.info.linkType = '栏目'
                        break
                    }

                    switch (info.showType) {
                        case 0:
                        case '0':
                            this.info.showType = '显示名字'
                        break
                        case 1:
                        case '1':
                            this.info.showType = '不显示名字'
                        break
                        default:
                            this.info.showType = '显示名字'
                    }

                    if(res.data.data.linkType) {
                        if(res.data.data.linkType == '栏目' || res.data.data.linkType == '栏目') {
                            if(res.data.data.moreUrl !== null && res.data.data.moreUrl !== '' && res.data.data.moreUrl !== 'null') {
                                channel_id = res.data.data.moreUrl.match(/channelId=(\S*)/)[1]
                                if(channel_id !== null && channel_id !== 'null' && channel_id !== '') {
                                    this.getChannel(channel_id)
                                } 
                            } else {
                                this.selectedChannel = null
                            }
                        } 
                    }

                    setTimeout (() => {
                        this.showImage = true
                    }, 100)
                }else{
                    if(res.data.errorMessage){
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('初始化信息失败')
                    }
                }
            }).catch(err=>{console.log(err)})
        },//初始化页面数据
        back () {
            history.go(-1)
        },
        update(info){
            let childId = parseInt(this.info.id)
            let childType=this.params.type;//获取前一页面传过来的类型

            let element
            let obj = {}

            let url='';
            if(childType == 'DIR') {
                url = this.$api.catalogEdit
                element = info.name
                obj.name = element
                obj.enable = info.enable
                axiosProxy.put(url+'/'+childId,obj)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("修改成功!")
                        // this.$store.state.showTree = false
                        setTimeout (() => {
                            this.routerLink('/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR')
                            // this.$store.state.showTree = true
                            this.$store.state.enableButton = true
                        }, 1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('修改失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
            } else if(childType == 'PAGE') {
                url = this.$api.pageEdit
                element = info.showName
                obj.showName = element
                axiosProxy.put(url+'/'+childId,obj)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("修改成功!")
                        // this.$store.state.showTree = false
                        setTimeout (() => {
                            this.routerLink('/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR')
                            // this.$store.state.showTree = true
                            this.$store.state.enableButton = true
                        }, 1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('修改失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
            } else {
                let elementObj = {}


                let nameGroup = []
                for (let i in this.exsitedBlocks) {
                    if(this.exsitedBlocks[i].id !== this.info.id) {
                        nameGroup.push(this.exsitedBlocks[i].name)
                    }
                }

                if(nameGroup.indexOf(info.name) == -1) {
                    if(info.name != '' && info.name != null) {
                        elementObj.name = info.name
                    } else {
                        this.errorMessage('请补全名称')
                        return false
                    }
                } else {
                    this.errorMessage('区块名称不可以和已有的区块重名!')
                    return false
                }

                let baseUrl ='http://cmstest.cnlive.com:8768'

                switch (this.info.linkType) {
                    case 0:
                    case '0':
                        elementObj.moreUrl = ''
                    break
                    case 1:
                    case '1':
                    case 'HTML':
                        elementObj.moreUrl = this.info.moreUrl
                    break
                    case 2:
                    case '2':
                    case '区块':
                        if(this.info.default == true) {
                            elementObj.moreUrl = baseUrl + '/contentApi/getBlockContents'
                        } else {
                            elementObj.moreUrl = this.info.moreUrl
                        }
                    break
                    case 3:
                    case '3':
                    case '栏目':
                        if(this.finalChannelId !== null) {
                            elementObj.moreUrl = baseUrl + '/contentApi/getList?siteId=' + window.localStorage.getItem('_site_id_param') + '&channelId=' + this.finalChannelId
                        } else {
                            elementObj.moreUrl = ''
                        }
                    break   
                    default:
                }

                if(this.info.showType == '显示名字') {
                    elementObj.showType = 0
                } else if(this.info.showType == '不显示名字') {
                    elementObj.showType = 1
                } else {
                    elementObj.showType = this.info.showType
                }

                elementObj.linkType = this.info.linkType

                if(this.info.linkType == '其他') {
                    elementObj.linkType = 0
                }

                if(this.info.linkType == '区块'){
                    elementObj.linkType = 2
                }

                if(this.info.linkType == 'HTML'){
                    elementObj.linkType = 1
                } 

                if(this.info.linkType == '栏目'){
                    elementObj.linkType = 3
                } 

                elementObj.blockIcon = info.blockIcon
                elementObj.blockType = info.blockType
                elementObj.rowNum = info.rowNum
                elementObj.priority = parseInt(info.priority)
                elementObj.pageId = this.parentId
                elementObj.id = info.id
                elementObj.enable = info.enable
                elementObj.parentUriId = info.parentUriId
                url = this.$api.blockAdd
                axiosProxy.post(url, elementObj)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("修改成功!")
                        // this.$store.state.showTree = false
                        setTimeout (() => {
                            this.routerLink('/page/list?real_id=' + this.parentId + '&pageType=' + 'PAGE')
                            // this.$store.state.showTree = true
                            this.$store.state.enableButton = true
                        }, 1000)
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('修改失败')
                        }
                    }
                    
                })
                .catch(err=>{console.log(err)})
            }
        },
    },
    
}
</script>

<style>
    .input-list {
        width: 200px;
        position: relative;
        display: inline-block;
        height: 200px;
        z-index: 10;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); 
        overflow: auto;    
    }
    .triangle {
        margin-top: 10px;
        margin-left: 15px;
        width:0;
        height:0;
        border-width:0 7px 7px;
        border-style:solid;
        border-color:transparent transparent #333;/*透明 透明  灰*/
        position:relative;
        z-index: 9;
    }
    .triangle::after {
        content: '';
        margin-left: -6px;
        display: block;
        width:0;
        height:0;
        border-style:solid;
        border-width:0 6.5px 6.5px;
        border-color:transparent transparent white;
    }
    .input-list>ul {
        width: 100%;
        display: inline-block;
    }
    .has-arrow, .has-not-arrow {
        font-size: 14px;
        padding: 8px 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
        outline: 0;
    }
    .has-arrow:after {
        content: '>';
        float: right;
        color: #666666;
    }
    .has-not-arrow:after {
        content: '>';
        float: right;
        color: transparent;
    }
    .bg-img {
        display: block;
        position: absolute;
        width: 130px;
        height: 130px;
        border-radius: 6px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
</style>
