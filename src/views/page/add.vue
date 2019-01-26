<template>
    <section class="cms-body flex">
            <a class="cms-back" href="javascript:;" @click="back"></a>
            <!-- 页面list内容 -->
            <div style="width: 100%;">
            <!-- 右边内容的大盒子 -->
                
                <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px">

                    <el-form-item label="上级栏目" class="flex-50" prop="parentChannels">
                        <el-input v-model="parentChannels" class="cms-width" disabled></el-input>
                    </el-form-item> 

                    <el-form-item label="名称" class="flex-50" prop="name">
                        <el-input v-model="info.name" class="cms-width" ></el-input>
                    </el-form-item> 
                    <el-form-item label="页面中文名" class="flex-50" prop="showName" v-if="listType=='PAGE'">
                        <el-input v-model="info.showName" class="cms-width" ></el-input>
                    </el-form-item> 

                    <el-form-item label="路径" class="flex-50" prop="path" v-if="listType=='PAGE' || listType == 'DIR'">
                        <el-input v-model="info.path" class="cms-width" ></el-input>
                    </el-form-item> 

                    <el-form-item label="类型" class="flex-50">
                        <el-input value="目录"  class="cms-width" disabled v-if="listType=='DIR'"></el-input>
                        <el-input  value="页面" class="cms-width" disabled v-else-if="listType=='PAGE'"></el-input>
                        <el-input  value="区块" class="cms-width" disabled v-else></el-input>
                    </el-form-item> 

                    <el-form-item label="可用" class="flex-50" prop="enable" v-if="listType == 'DIR'">
                        <el-radio-group v-model="info.enable">
                            <el-radio :label="true">是</el-radio> 
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group> 
                    </el-form-item> 

                    <el-form-item label="行数" class="flex-50" prop="enable" v-if="listType == 'BLOCK'">
                        <el-input class="cms-width" type="number" @blur="checkRows" v-model="info.rowNum"></el-input>
                    </el-form-item>

                    <el-form-item label="排序" class="flex-50" prop="priority" v-if="listType == 'BLOCK'">
                        <el-input class="cms-width" type="number" @blur="checkPriority" v-model="info.priority"></el-input>
                    </el-form-item>


                    <el-form-item label="类型" class="flex-50" prop="blockType" v-if="listType == 'BLOCK'">
                        <el-select v-model="info.blockType" placeholder="请选择" @change="getType">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> 

                    <el-form-item label="链接类型" class="flex-50" prop="linkType" v-if="listType == 'BLOCK'">
                        <el-select v-model="info.linkType" placeholder="请选择" @change="getLinkType">
                            <el-option key="其他" label="其他" value="0"></el-option>
                            <el-option key="HTML" label="HTML" value="1"></el-option>
                            <el-option key="区块" label="区块" value="2"></el-option>
                            <el-option key="栏目" label="栏目" value="3"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="展示类型" class="flex-50" prop="showType" v-if="listType == 'BLOCK'">
                        <el-select v-model="info.showType" placeholder="请选择" @change="getShowType">
                            <el-option key="显示名字" label="显示名字" value="0"></el-option>
                            <el-option key="不显示名字" label="不显示名字" value="1"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="生成默认区块链接" class="flex-50" prop="default" v-if="listType == 'BLOCK' && info.linkType == '2'">
                        <el-switch v-model="info.default"></el-switch>
                    </el-form-item>

                    <el-form-item label="链接地址" class="flex-100" prop="moreUrl" v-if="listType == 'BLOCK'">

                        <div v-if="info.linkType !== '3'">
                            <el-input class="cms-width" v-model="info.moreUrl" v-if="info.default == true" disabled></el-input>
                            <el-input class="cms-width" v-model="info.moreUrl" v-else></el-input>                            
                        </div>

                        <div v-if="info.linkType == '3'">
                            <el-input class="cms-width" :value="selectedChannel" @focus="toggleShow"></el-input> 
                            <div style="width: 100%;" v-if="showInputList">
                                <div class="triangle"></div>
                                <div class="input-list">
                                    <cms-tree @click="getCurrentChannel" treeType="page"></cms-tree>
                                </div>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="角标" class="flex-50" prop="blockIcon" v-if="listType == 'BLOCK'">
                        <uploader @change="getUrl" v-if="showImage" :default="info.blockIcon"></uploader>
                        <!-- <span class="red">请选择上传角标图片或者直接输入图片路径</span>
                        <el-input class="cms-width" type="text" v-model="info.blockIcon" @blur="showPicture"></el-input> -->
                    </el-form-item> 
                        
                    <!-- 动态表单 -->
                    <div class="form-footer">
                        <el-button  type="primary"  @click="add">提交</el-button>
                        <el-button type="info" @click="reset">重置</el-button>
                    </div>

                </el-form>

                
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
            params:this.$route.query,//前页传过来的数据
            info:{
                enable: true,
                moreUrl: null,
                default: false
            },
            exsitedBlocks: [],
            rules:{
                id:[required],
                name:[required],
                path:[required],
                type:[required],
                showName:[required],
                blockType:[required]
            },//校验规则
            listType:'',//当前页面类型
            pid:'',//新建时需要的父id
            siteId:'',//站点id
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
            }],
            value: '',
            showImage: true,

            selectedChannel: null,
            showInputList: false,
            finalChannelId: null
        }
    },
    created(){
        if(this.$route.query.parentId != null) {
            if(this.$route.query.pageType == 'PAGE') {
                this.parentId = this.$route.query.parent
            } else if(this.$route.query.pageType == 'BLOCK') {
                this.parentId = this.$route.query.parent
            } else {
                if(this.$route.query.parentUriId) {
                    this.parentId = this.$route.query.parentUriId
                } else {
                    this.parentId = this.$route.query.parentId
                }
            }
        } else {
            this.parentId = 0
        }

        this.loading = false;
        this.$store.state.enableButton = false

        this.pid = localStorage.getItem('parent');//上级id
        this.info.parentId = this.pid

        this.getBlockTree(this.info.parentId)

        this.listType = this.params.pageType;//创建的类型

        let lastPath = localStorage.getItem('bid');//获得上级栏目
        if(lastPath) {
            lastPath = lastPath.split(',')[0]
        }
        // this.info.path = lastPath;
        // this.getSiteId()//获取siteid

        let breadTree = JSON.parse(localStorage.getItem('treeBread'))
        if(breadTree) {
            for (let i in breadTree) {
                this.parentChannels = this.parentChannels + breadTree[i].name + '/'
            }
            this.parentChannels = this.parentChannels.slice(0, this.parentChannels.length - 1)
        } else {
            this.parentChannels = '根目录'
        }
    },
    mounted () {
        if(this.listType == 'BLOCK') {
            this.$set(this.info, 'rowNum', 1)
            this.$set(this.info, 'priority', 1)

            this.$set(this.info, 'showType', '显示名字')
        }
    },
    methods:{
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

        checkRows (e) {
            if(e.target.value > 0 && e.target.value <= 10) {
                
            } else {
                this.$alert('行数不能为空且最大不超过10', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                       this.info.rowNum = 1  
                    }
                })
            }
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

        getType (value) {
            if(value == 0 || value == '0') {
                this.info.moreUrl = ''
            }
            this.$set(this.info, 'blockType', value)
        },

        getLinkType (value) {
            this.$set(this.info, 'linkType', value)
        },

        getShowType (value) {
            this.$set(this.info, 'showType', value)
        },

        getUrl (imageUrl, index, imagePath, storageId) {
            this.$set(this.info, 'blockIcon', imageUrl)
        },

        reset () {
            this.info.name = ''
            this.info.showType = '显示名字'
            this.info.showName = ''
            this.info.rowNum = 1
            this.info.priority = 1
            this.info.blockIcon = null
            this.showImage = false
            this.info.blockType = null
            setTimeout(() => {
                this.showImage = true
            }, 100)
        },

        add(){
            let backUrl = ''
            let element = {}
            let url = ''
            if(this.listType == "PAGE"){
                element.name = this.info.name
                element.showName = this.info.showName
                element.pageTreeId = localStorage.getItem('parent')
                element.enable = this.info.enable
                url = this.$api.pageAdd
                backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR'
            } else if (this.listType == 'DIR'){
                backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR'
                element.name = this.info.name
                element.enable = this.info.enable
                element.path = this.info.path
                if(parseInt(this.info.parentId) != -1) {
                    element.parentId = parseInt(this.info.parentId)
                }
                url = this.$api.catalogAdd
            } else {

                let nameGroup = []
                for (let i in this.exsitedBlocks) {
                    nameGroup.push(this.exsitedBlocks[i].name)
                }

                if(nameGroup.indexOf(this.info.name) == -1) {
                    if(this.info.name != '' && this.info.name != null) {
                        element.name = this.info.name
                    } else {
                        this.errorMessage('请补全名称')
                        return false
                    }
                } else {
                    this.errorMessage('新创建的区块名称不可以和已有的区块重名!')
                    return false
                }

                if(this.info.blockType != '' && this.info.blockType != null) {
                    element.blockType = this.info.blockType
                } else {
                    this.errorMessage('请补全区块类型')
                    return false
                }

                let baseUrl ='http://cmstest.cnlive.com:8768'

                switch (this.info.linkType) {
                    case 0:
                    case '0':
                        element.moreUrl = ''
                    break
                    case 1:
                    case '1':
                        element.moreUrl = this.info.moreUrl
                    break
                    case 2:
                    case '2':
                        if(this.info.default) {
                            element.moreUrl = baseUrl + '/contentApi/getBlockContents/'
                        } else {
                            element.moreUrl = this.info.moreUrl
                        }
                    break
                    case 3:
                    case '3':
                        if(this.finalChannelId !== null) {
                            element.moreUrl = baseUrl + '/contentApi/getList?siteId=' + window.localStorage.getItem('_site_id_param') + '&channelId=' + this.finalChannelId
                        } else {
                            element.moreUrl = ''
                        }
                    break   
                    default:
                }

                if(this.info.showType == null) {
                    element.showType = 0
                } else {
                    if(this.info.showType == '显示名字') {
                        element.showType = 0
                    } else if(this.info.showType == '不显示名字') {
                        element.showType = 1
                    } else {
                        element.showType = this.info.showType
                    }
                }

                element.linkType = this.info.linkType
                element.blockIcon = this.info.blockIcon
                element.rowNum = this.info.rowNum
                element.priority = parseInt(this.info.priority)
                element.enable = this.info.enable
                element.pageId = parseInt(this.info.parentId)
                url = this.$api.blockAdd
                backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'PAGE'
            }
            let that = this
            axiosProxy.post(url,element)
                .then( res => {
                    if(res.data.errorCode == 0){
                        this.successMessage("新建成功!")
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('新建失败')
                        }
                    }
                    this.$store.state.showTree = false
                    setTimeout( () => {
                        that.routerLink(backUrl)
                        this.$store.state.showTree = true
                        this.$store.state.enableButton = true
                    },2000)
                })
        },//提交

        getSiteId(){
            let url = this.$api.pageTree + '/0'
            axiosProxy.get(url)
                .then( res => {
                    if(res.data.errorCode == 0){
                        this.siteId = res.data.data[0].siteId
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取站点失败')
                        }
                    }
                    
                })
                .catch( err => {console.log(err)})
        },
        back () {
            let backUrl
            if(this.parentId == -1) {
                this.parentId = 0
                if(this.listType == "PAGE"){
                    backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR'
                } else if (this.listType == 'DIR'){
                    backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'DIR'
                } else {
                    backUrl = '/page/list?real_id=' + this.parentId + '&pageType=' + 'PAGE'
                }
            } 
            this.routerLink(backUrl)
        }
    }
}
</script>

<style>
    .cms-form {
        margin: 0;
    }
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
