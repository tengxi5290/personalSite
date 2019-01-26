<template>
    <section class="cms-body flex">
        <div style="width: 100%;">
            <!-- 区块的基本信息表单 -->
            <el-form ref="form" :model="info" :rules="rules" class="cms-form" label-width="100px"  v-loading="loading" style="margin:0;padding:0">

                <el-form-item label="区块id" class="flex-50" prop="id">
                    <el-input v-model="info.id" class="cms-width" disabled></el-input>
                </el-form-item>

                <el-form-item label="区块名称" class="flex-50"  prop="name">
                    <el-input v-model="info.name"  class="cms-width" :disabled="editAble"></el-input>
                </el-form-item>
            </el-form>
            <!-- 区块的基本信息表单结束 -->

            <!-- 区块内容操作按钮组 -->
            <div class="form-footer">
                <el-button type="primary" @click="pickExsitedContent" v-if="info.id !== 678 && info.id !== 679">选取已有内容</el-button>
                <el-button type="warning" @click="addH5" v-if="info.id !== 678 && info.id !== 679">添加外链</el-button>
                <span style="margin-left: 20px; color: red;" v-if="info.id !== 678 && info.id !== 679">可以拖动内容进行排序哦！</span>
                <span style="margin-left: 20px; color: red;" v-else>该区块内容运营不做处理</span>
            </div>
            <!-- 区块内容操作按钮组结束 -->

            <!-- 已经存在的区块内容 -->
            <el-row :gutter="20" style="padding-left: 24px; padding-right: 24px; padding-bottom: 20px;">
                <draggable v-model="localContent" @update="datadragEnd">
                    <transition-group>
                        <el-col :span="12" v-for="(item, index) in localContent" :key="index" style="padding-top: 20px;">
                            <ul class="el-upload-list el-upload-list--picture">
                                <li class="el-upload-list__item">
                                    <div v-if="item.poster != undefined && item.poster != null">
                                        <img :src="item.poster" alt="" class="el-upload-list__item-thumbnail" style="width: 128px; height: 72px;" v-if="item.poster.indexOf('http') != -1" />
                                        <img :src="item.imageUrl" alt="" class="el-upload-list__item-thumbnail" styl
                                        e="width: 128px; height: 72px;" v-else />
                                    </div>
                                    <div v-else>
                                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539691103822&di=ffbac6710b9d2152d767a3405d250032&imgtype=0&src=http%3A%2F%2Fpic2.16pic.com%2F00%2F20%2F02%2F16pic_2002642_b.jpg" alt="" class="el-upload-list__item-thumbnail" style="width: 128px; height: 72px;">
                                    </div>
                                    <span class="el-upload-list__item-name" style="margin-top: 6px; margin-right: 0; line-height: 30px;display: block;height: 30px; margin-left: 56px;">{{item.title}}</span>
                                    <div class="el-upload-list__item-buttons" style="float: right;">
                                        <span>{{item.pushTime}}</span>
                                        <cms-button type="edit" @click="action('edit', index)"></cms-button>
                                        <cms-button type="delete" @click="action('delete', index)"></cms-button>
                                    </div>

                                    <div class="special pic1" v-if="item.check1 == true">
                                        <!-- <i class="el-icon-check" style="color: white;"></i> -->
                                    </div>

                                    <div class="special pic2" v-if="item.check2 == true">
                                        <!-- <i class="el-icon-check" style="color: white;"></i> -->
                                    </div>
                                </li>
                            </ul>
                        </el-col>
                    </transition-group>
                </draggable>
            </el-row>
            <!-- 已经存在的区块内容结束 -->

            <!-- 选取已有内容的蒙版 -->
            <el-dialog title="选取已有内容" :visible.sync="exsitedTableVisible" @close="closeExsitedTable">
                <div class="cms-content-left" style="overflow: hidden;">
                    <cms-tree :hasContent='true' @click="getChannelId" treeType="page"></cms-tree>
                </div>

                <div class="cms-content-right">
                    <!-- 栏目内容的多选表格筛选条件 -->
                    <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
                        <div style="margin-top: 16px; flex: auto;">
                            <!-- 所有类型 -->
                            <el-select class="cms-left" @change="doQueryModel" placeholder="所有类型" v-model="queryParams.modelId" style="width:120px">
                                <el-option label="所有类型" value="all"></el-option>
                                <el-option v-for="item in modelList" :key="item.id" :label="item.showName" :value="item.id"> </el-option>
                            </el-select>
                            <!-- 排序方式 -->
                            <el-select v-model="queryParams.orderByClause" @change="doQueryOrder">
                                <el-option label="默认排序" value="all"></el-option>
                                <el-option label="ID降序" value="id desc"></el-option>
                                <el-option label="ID升序" value="id asc"></el-option>
                            </el-select>
                            <el-button type="success" @click="showWitnessList" v-if="!$store.state.isHot && isCnlive">目击者视频</el-button>
                        </div>
                        <div style="margin-top: 16px; flex: auto;" v-if="currentSiteId == 23">
                            <el-button type="info" @click="toLiveChina" v-if="chinaType == 'normal'">直播中国</el-button>
                            <el-button type="info" @click="toNormalChina" v-if="chinaType == 'live'">普通</el-button>
                        </div>
                        <div style="margin-top:16px; flex:auto" class="content-flex-right" v-if="showQueryTitle">
                            <cms-input label="标题" v-model="queryParams.title" :width="120"></cms-input>
                            <el-button @click="doQuery" type="primary">查询</el-button>
                        </div>
                    </div>
                    <!-- 栏目内容的多选表格筛选条件结束 -->

                    <!-- 栏目内容的多选表格 -->
                    <el-table key="normal" :data="contentTable" stripe @selection-change="getSelectedContents">
                        <el-table-column type="selection" align="center"></el-table-column>
                        <el-table-column property="id" label="ID" align="center"></el-table-column>
                        <el-table-column property="title" label="标题" align="center">
                            <div slot-scope="scope">
                                <span class="cms-ups" v-if="scope.row.topLevel">[顶]</span>
                                <span class="">{{scope.row.title}}</span>
                            </div>
                        </el-table-column>
                        <el-table-column property="poster" label="封面" align="center">
                            <div slot-scope="scope">
                                <img :src="scope.row.poster" height="60" width="80" v-if="scope.row.poster != null" />
                                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" height="60" width="80" v-else />
                            </div>
                        </el-table-column>
                        <el-table-column property="weight" label="权重" align="center"></el-table-column>
                        <el-table-column property="modelShowName" label="类型" align="center"></el-table-column>
                        <el-table-column property="spName" label="sp名称" align="center"></el-table-column>
                        <el-table-column property="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column property="publishTime" label="发布时间" align="center"></el-table-column>
                        <el-table-column property="status" label="状态" align="center">
                            <div slot-scope="scope">
                              <span v-if="scope.row.status==1">草稿</span>
                              <span v-if="scope.row.status==5">已上线</span>
                              <span v-if="scope.row.status==6">已下线</span>
                              <span v-if="scope.row.status==7">删除</span>
                            </div>
                        </el-table-column>
                    </el-table>
                    <!-- 栏目内容的多选表格结束 -->
                    <div class="cms-list-footer" style="padding-bottom:20px;">
                        <el-button type="primary" @click="sureSelectContents" v-if="enablePicking">确认选取</el-button>
                        <el-button type="primary" v-else disabled>确认选取</el-button>
                        <cms-pagination v-if="showPagination == true" :total="allTotal" @change="getPages" :pageSize="queryParams.pageSize" :page="queryParams.page" :init="true"></cms-pagination>
                    </div>
                </div>
            </el-dialog>
            <!-- 选取已有内容的蒙版结束 -->

            <!-- 目击者视频蒙版 -->
            <el-dialog title="目击者内容" :visible.sync="witnessTableVisible" @close="closeWitnessTable">
                <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
                    <div  style="margin-top:16px;flex:auto">
                        <el-select @change="doQueryStatus" v-model="queryWitness.status">
                            <el-option label="全部" value="all"></el-option>
                            <el-option label="上线" value="1"></el-option>
                            <el-option label="下线" value="0"></el-option>
                        </el-select>

                        <cms-input label="标题" v-model="queryWitness.title" v-if="showWitnessSearch"></cms-input>
                        <el-button @click="doQueryWitness" v-if="showWitnessSearch">查询</el-button>

                        <el-button type="success" @click="showNormalList" v-if="!$store.state.isPublish">其他视频</el-button>

                        <el-table key="witness" :data="witnessTable" stripe @selection-change="getCheckedWitness">
                            <el-table-column type="selection" align="center"></el-table-column>
                            <el-table-column property="description" label="简介" align="center"></el-table-column>
                            <el-table-column property="tagName" label="标签" align="center"></el-table-column>
                            <el-table-column property="videoUrl" label="视频" align="center">
                                <div slot-scope="scope">
                                    <video :src="scope.row.videoUrl" height="200" width="auto" controls></video>
                                </div>
                            </el-table-column>
                            <el-table-column property="userName" label="目击者" align="center"></el-table-column>
                        </el-table>

                        <div class="cms-list-footer" style="padding-bottom:20px;">
                            <el-button type="primary" @click="sureWitness" v-if="enablePickingWitness">确认选取目击者</el-button>
                            <el-button type="primary" v-else disabled>确认选取目击者</el-button>
                            <cms-pagination :total="witnessAll" @change="getWitnessPage" :pageSize="queryWitness.pageSize" :page="queryWitness.page" :init="true"></cms-pagination>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <!-- 目击者视频蒙版结束 -->

            <!-- 添加外链蒙版 -->
            <el-dialog title="外链内容" :visible.sync="htmlVisiable">
                <el-form ref="htmlForm" :model="htmlInfo" :rules="htmlRules" class="cms-form" label-width="100px" style="margin: 0; padding: 0;">
                    <el-form-item label="标题" class="flex-100" prop="title">
                        <el-input v-model="htmlInfo.title" class="cms-width"></el-input>
                    </el-form-item>

                    <el-form-item label="外链地址" class="flex-100" prop="thirdUrl">
                        <el-input placeholder="请输入内容" v-model="htmlInfo.thirdUrl" class="cms-width">
                            <template slot="prepend">https://</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="封面" class="flex-50" prop="poster">
                        <uploader @change="getHtmlImage" v-if="showHtmlImage" :default="htmlInfo.poster" direction="horizontal"></uploader>
                    </el-form-item>

                    <el-form-item label="banner" class="flex-50" prop="bannerImg">
                        <uploader @change="getBannerImage" v-if="showBannerImage" :default="htmlInfo.bannerImg" direction="horizontal"></uploader>
                    </el-form-item>

                    <!-- 这里也要加附加的模型项 -->
                    <el-form-item label="模型附加项" class="flex-50" prop="addition">
                        <el-select v-model="htmlInfo.addition" placeholder="请选择">
                            <el-option label="不选" value="0"></el-option>
                            <el-option label="小图横划类型" value="1"></el-option>
                            <el-option label="不进行跳转" value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <div class="form-footer">
                        <el-button type="primary" @click="postHtml">确认添加</el-button>
                        <el-button type="info" @click="resetHtml">重置</el-button>
                    </div>
                </el-form>
            </el-dialog>
            <!-- 添加外链蒙版结束 -->

            <el-dialog :title="'编辑区块内容--' + currentModelType" :visible.sync="editVisible" @close="closeEdit">
                <el-form ref="editForm" :model="editInfo" :rules="editRules" class="cms-form" label-width="140px" style="margin: 0; padding: 0;">
                    <el-form-item label="标题" class="flex-100" prop="title">
                        <el-input v-model="editInfo.title" class="cms-width"></el-input>
                    </el-form-item>

                    <el-form-item label="外链地址" class="flex-100" prop="thirdUrl" v-if="showThirdUrl">
                        <!-- <el-input v-model="editInfo.thirdUrl" class="cms-width"></el-input> -->
                        <el-input placeholder="请输入内容" v-model="editInfo.thirdUrl" class="cms-width">
                            <template slot="prepend">https://</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="副标题" class="flex-100" prop="subTitle">
                        <el-input v-model="editInfo.subTitle" class="cms-width"></el-input>
                    </el-form-item>

                    <el-form-item label="扩展字段" class="flex-100" prop="extensions" v-if="editInfo.contentModelId == '62'">
                        <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="editInfo.extensions" resize="none"></el-input>
                    </el-form-item>

                    <el-form-item label="横图" class="flex-50" prop="poster">
                        <uploader @change="getEditPoster" v-if="showEditPoster" :default="editInfo.poster" direction="horizontal"></uploader>
                    </el-form-item>

                    <el-form-item label="竖图" class="flex-50" prop="verticalImg">
                        <uploader @change="getVerticalImg" v-if="showVerticalImg" :default="editInfo.verticalImg" direction="vertical"></uploader>
                    </el-form-item>

                    <el-form-item label="banner" class="flex-50" prop="bannerImg">
                        <uploader @change="getEditBanner" v-if="showEditBanner" :default="editInfo.bannerImg" direction="horizontal"></uploader>
                    </el-form-item>

                    <el-form-item label="模型附加项" class="flex-50" prop="addition">
                        <el-select v-model="editInfo.addition" placeholder="请选择">
                            <el-option label="不选" value="0"></el-option>
                            <el-option label="小图横划类型" value="1"></el-option>
                            <el-option label="不进行跳转" value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <div class="form-footer">
                        <el-button type="primary" @click="postEdit">确认修改</el-button>
                        <el-button type="info" @click="resetEdit">重置</el-button>
                    </div>
                </el-form>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import formMixins from "@/mixins/form"
    import functionMixins from "@/mixins/function"
    import {axiosProxy, getPageTreeParams, timestampToTime, isNull} from "@/api/tool"
    import va from "@/rules"
    import draggable from 'vuedraggable'

    export default {
        mixins: [formMixins, functionMixins],
        data() {
            let self = this;
            let required = va.required();
            let number = va.number();
            let string = va.string();
            return{
                isCnlive: true, // 是否是视讯中国站点
                modelList: [], // 用于筛选的模型列表
                enablePicking: false, // 已有内容确认选择的按钮是否禁用
                editAble: true, // 基本表单项是否可编辑
                info: {}, // 区块基本表单信息
                rules:{
                    id:[required],
                }, // 区块基本表单信息的校验规则
                localContent: [], // 已经存在的区块内容
                exsitedTableVisible: false, // 已有内容选择蒙层的显示隐藏
                allTotal: null, // 已有内容的分页的内容总数
                queryParams: {
                    pageSize: 10,
                    page: 1,
                    modelId: '',
                    channelId: '',
                    orderByClause: '',
                    status: 5,
                    title: ''
                }, // 已有内容选择蒙层的查询参数
                contentTable: [], // 已有内容的表格数据
                showPagination: true, // 是否显示已有内容待选择表格的分页
                underPickedContent: [], // 已选择的已有内容数组

                htmlVisiable: false, // h5新增和编辑的表单蒙版是否可见
                htmlInfo: {
                    title: null,
                    poster: null,
                    thirdUrl: null,
                    addition: null
                }, // 外链表单参数
                htmlRules: {
                    title: [required]
                }, // 新增外链时候表单验证规则
                showHtmlImage: true, // 是否显示h5的封面图
                showBannerImage: true, // 是否显示h5的banner图


                witnessTableVisible: false, // 是否显示目击者表格蒙版
                witnessTable: [], // 目击者表格数据
                witnessAll: null, // 目击者数据总条数
                underPickedWitness: [], // 待提交的选中的目击者视频数据集合
                enablePickingWitness: false, // 确认选取目击者视频的按钮是否被禁用
                queryWitness: {
                    pageSize: 10,
                    page: 1,
                    status: null,
                    title: null
                }, // 目击者视频查询参数

                editVisible: false, // 编辑区块内容的蒙版是否可见
                editInfo: {
                    addition: null,
                    title: null,
                    poster: null,
                    bannerImg: null,
                    subTitle: null,
                    thirdUrl: null,
                    verticalImg: null
                }, // 编辑表单的表单相内容
                editRules: {
                    title: [required]
                }, // 编辑表单的表单验证规则
                showEditBanner: true, // 是否显示编辑表单中的banner图
                showEditPoster: true, // 是否显示编辑表单中的封面
                showThirdUrl: false, // 编辑的时候是否显示第三方外链
                showVerticalImg: true, // 是否显示竖图
                currentModelType: null, // 编辑时显示的模型类型
                showQueryTitle: true, // 是否显示查询标题输入框
                showWitnessSearch: true, // 是否显示目击者标题搜索框

                currentModelId: null, // 当前内容的模型id
                currentSiteId: null, // 当前站点id
                chinaType: 'normal', // 当前是直播中国或者普通的
            }
        },
        created(){
            this.loading = false

            let siteId = window.localStorage.getItem('_site_id_param')
            this.currentSiteId = siteId

            if(siteId == 1) {
                this.isCnlive = true
            } else {
                this.isCnlive = false
            }

            let childId = this.$route.query.id
            this.getBlockInfo(childId)
            this.getBLockContentList(childId)
            this.getModelList()
        },
        mounted() {
            let clientHeight = document.body.clientHeight;
            $(".cms-body").css("minHeight", clientHeight - 110 + "px");
        },
        components: {
        　　draggable
        },
        methods:{
            // 视频中国时点直播中国按钮
            toLiveChina () {
                this.chinaType = 'live'
                this.queryParams.modelId = 1
                this.queryParams.siteId = 26
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                }) 
            },
            // 取消直播中国的筛选条件
            toNormalChina () {
                this.chinaType = 'normal'
                this.queryParams.modelId = ''
                this.queryParams.siteId = ''
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                })
            },
            // 拖拽结束
            datadragEnd (evt) {
                let resortLocalContent = []

                for (let i in this.localContent) {
                    let obj = {}
                    obj.priority = parseInt(i) + parseInt(this.localContent.length) - 1 - 2 * parseInt(i)
                    obj.id = this.localContent[i].id
                    resortLocalContent.push(obj)
                }
                this.updatePriority(resortLocalContent)
            },
            // 获取html5的封面回调
            getHtmlImage (imageUrl, index, imagePath, storageId) {
                this.htmlInfo.poster = imageUrl
            },

            // 获取html5的banner回调
            getBannerImage (imageUrl, index, imagePath, storageId) {
                this.htmlInfo.bannerImg = imageUrl
            },

            // 获取编辑中的封面图
            getEditPoster (imageUrl, index, imagePath, storageId) {
                this.editInfo.poster = imageUrl
            },

            // 获取编辑中的banner图
            getEditBanner (imageUrl, index, imagePath, storageId) {
                this.editInfo.bannerImg = imageUrl
            },

            // 获取编辑中的竖图
            getVerticalImg (imageUrl, index, imagePath, storageId) {
                this.editInfo.verticalImg = imageUrl
            },

            // 确认提交h5内容
            postHtml () {
                let postObj = {}
                postObj.blockId = this.$route.query.id
                if(this.htmlInfo.poster != null && this.htmlInfo.poster != undefined) {
                    postObj.poster = this.htmlInfo.poster
                }

                if(this.htmlInfo.bannerImg != null && this.htmlInfo.bannerImg != undefined) {
                    postObj.bannerImg = this.htmlInfo.bannerImg
                }

                if(this.localContent.length > 0) {
                    postObj.priority = this.localContent[0].priority + 1
                } else {
                    postObj.priority = 0
                }

                postObj.title = this.htmlInfo.title
                if(this.htmlInfo.thirdUrl.indexOf('http') == -1) {
                    postObj.thirdUrl = 'https://' + this.htmlInfo.thirdUrl
                } else {
                    postObj.thirdUrl = this.htmlInfo.thirdUrl
                }
                postObj.contentModelId = 4

                if(isNull(postObj.title) || postObj.title == null) {
                    this.errorMessage('请补全标题')
                    return false
                }

                if(isNull(postObj.thirdUrl) || postObj.thirdUrl == null) {
                    this.errorMessage('请补全外链地址')
                    return false
                }

                switch (this.htmlInfo.addition) {
                    case 0:
                    case '0':
                        postObj.contentModelId = 4
                    break
                    case 1:
                    case '1':
                        postObj.contentModelId = 4 + '_shape_1'
                    break
                    case 2:
                    case '2':
                        postObj.contentModelId = 4 + '_shape_2'
                    break
                    default:
                        postObj.contentModelId = 4
                }

                this.updateHtml(postObj)
            },

            // 新增外链提交服务器事件
            updateHtml(postObj) {
                axiosProxy.put(this.$api.blockContentUpdate, postObj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.htmlVisiable = false
                        this.editVisible = false
                        this.getBLockContentList(this.$route.query.id)
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

            // 重置h5表单
            resetHtml () {
                this.htmlInfo.title = null
                this.htmlInfo.poster = null
                this.htmlInfo.thirdUrl = null
                this.htmlInfo.bannerImg = null
                this.showBannerImage = false
                this.showHtmlImage = false
                setTimeout(() => {
                    this.showHtmlImage = true
                    this.showBannerImage = true
                }, 100)
            },




            //初始化区块数据
            getBlockInfo(id){
                let url = this.$api.getBlock
                axiosProxy.get(url + '/' + id).then(res => {
                    if(res.data.errorCode == 0){
                        this.info = res.data.data
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('初始化信息失败')
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },

            // 获取模型列表
            getModelList () {
                let url = this.$api.modelList + '?enable=true'
                axiosProxy.get(url).then(res=>{
                    if(res.data.errorCode == '0') {
                        this.modelList = res.data.data
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取模型列表失败')
                        }
                    }
                }).catch(err=>{console.log(err)})
            },

            getUnpickedWitness (type) {
                let groupArray
                let total
                if(type == 'witness') {
                    groupArray = this.witnessStoreTable
                    total = this.witnessAll
                } else if(type == 'normal') {
                    groupArray = this.contentTableStore
                    total = this.allTotal
                } 
                let localContentIds = []
                let delRepeatWitnessTable = []
                for(let i in this.localContent) {
                    if(this.localContent[i].contentId == null) {
                        localContentIds.push(parseInt(this.localContent[i].id))
                    } else {
                        localContentIds.push(parseInt(this.localContent[i].contentId))
                    }
                }
                for(let i in groupArray) {
                    if(localContentIds.indexOf(groupArray[i].id) == -1) {
                        delRepeatWitnessTable.push(groupArray[i])
                    }
                }
                if(type == 'witness') {
                    this.witnessTable = delRepeatWitnessTable
                    this.witnessAll = this.witnessAll - localContentIds.length
                    if(this.witnessAll < 0) {
                        this.allTotal = 0
                    }
                } else if(type == 'normal') {
                    this.contentTable = delRepeatWitnessTable
                    this.allTotal = this.allTotal - localContentIds.length
                    if(this.allTotal < 0) {
                        this.allTotal = 0
                    }
                }
            },

            // 选取已有内容按钮响应
            pickExsitedContent () {
                this.queryParams.title = ''
                this.showQueryTitle = false
                setTimeout(() => {
                    this.showQueryTitle = true
                }, 100)

                if(this.$store.state.isPublish == true) {
                    this.exsitedTableVisible = false
                    this.witnessTableVisible = true
                    this.getWitnessList(null, null, 1, 10, () => {
                        this.getUnpickedWitness('witness')
                    })
                } else {
                    if(this.$store.state.isHot == true) {
                        this.exsitedTableVisible = true
                        this.witnessTableVisible = false
                        this.queryParams.channelId = 77
                        this.getContentTable(this.queryString(), () => {
                            this.getUnpickedWitness('normal')
                        }) 
                    } else {
                        this.exsitedTableVisible = true
                        this.witnessTableVisible = false
                        this.getContentTable(this.queryString(), () => {
                            this.getUnpickedWitness('normal')
                        })
                    }
                }
            },

            // 添加外链按钮响应
            addH5 () {
                this.resetHtml()
                this.htmlVisiable = true
            },

            // 选择已有内容时根据栏目筛选
            getChannelId (data, node) {
                if(data.id != '-1') {
                    this.queryParams.channelId = data.id
                    this.channelName = data.name
                } else {
                    this.queryParams.channelId = ''
                    this.channelName = ''
                }

                if(this.$store.state.isHot == true) {
                    if(this.queryParams.channelId == 77) {
                        this.getContentTable(this.queryString(), () => {
                            this.getUnpickedWitness('normal')
                        }) 
                    } 
                } else {
                    this.getContentTable(this.queryString(), () => {
                        this.getUnpickedWitness('normal')
                    }) 
                }
            },

            // 各种条件查询--模型
            doQueryModel (value) {
                if(value == 'all') {
                    this.queryParams.modelId = ''
                } else {
                    this.queryParams.modelId = value
                }
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                })
            },

            // 各种条件查询--id顺序
            doQueryOrder (value) {
                if(value == 'all') {
                    this.queryParams.orderByClause = ''
                } else {
                    this.queryParams.orderByClause = value
                }
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                })
            },

            // 各种条件查询--标题
            doQuery() {
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                })
            },

            // 处理已有内容的查询参数
            queryString (data) {
                let url = this.$api.contentList
                if(data != 'page') {
                    this.queryParams.page = 1
                }
                for (let i in this.queryParams) {
                    if(this.queryParams[i] != '') {
                        if(url.indexOf('?') == -1) {
                            url = url + '?' + i + '=' + this.queryParams[i]
                        } else {
                            url = url + '&' + i + '=' + this.queryParams[i]
                        }
                    }
                }
                return url
            },

            // 获取已有内容待选择表格的分页信息
            getPages (current, size) {
                this.queryParams.pageSize = size
                this.queryParams.page = current
                this.getContentTable(this.queryString('page'), () => {
                    this.getUnpickedWitness('normal')
                })
            },

            // 获取内容列表
            getContentTable (url, callback) {
                axiosProxy.get(url).then(res=>{
                    if(res.data.errorCode == '0') {
                        this.contentTable = res.data.data.list
                        this.contentTableStore = res.data.data.list
                        this.allTotal = res.data.data.total
                        for (var i = 0; i < this.contentTable.length; i++) {
                            this.contentTable[i].createTime = this.timestampToTime(this.contentTable[i].createTime)
                            this.contentTable[i].createTime = this.contentTable[i].createTime.slice(5, 16)
                            if(this.contentTable[i].publishTime != null) {
                                this.contentTable[i].publishTime = this.timestampToTime(this.contentTable[i].publishTime)
                                this.contentTable[i].publishTime = this.contentTable[i].publishTime.slice(5, 16)
                            } else {
                                this.contentTable[i].publishTime = ''
                            }
                        }
                        callback()
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取内容列表失败')
                        }
                    }
                }).catch(err=>{console.log(err)})
            },

            // 获取区块内容列表
            getBLockContentList (id) {
                let url = this.$api.blockContentList + '/' + id
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.localContent = res.data.data
                        for (let i in this.localContent) {

                            if (this.localContent[i].pushTime !== null) {
                                this.localContent[i].pushTime = timestampToTime(this.localContent[i].pushTime)
                            } else {
                               this.localContent[i].pushTime = this.localContent[i].pushTime 
                            }


                            if(this.localContent[i].title !== null) {
                                if(this.localContent[i].title.indexOf('%') == -1) {
                                    this.localContent[i].title = this.localContent[i].title
                                } else {
                                    this.localContent[i].title = decodeURIComponent(this.localContent[i].title)
                                }
                            } else {
                                this.localContent[i].title = this.localContent[i].title
                            }

                            if(this.localContent[i].contentModelId.indexOf('_shape_1') !== -1) {
                                this.localContent[i].check1 = true
                            } else {
                                this.localContent[i].check1 = false
                            }

                            if(this.localContent[i].contentModelId.indexOf('_shape_2') !== -1) {
                                this.localContent[i].check2 = true
                            } else {
                                this.localContent[i].check2 = false
                            }
                        }
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

            // 选取已有内容时获得多选的项
            getSelectedContents (value) {
                this.underPickedContent = value
                if(value.length > 0) {
                    this.enablePicking = true
                } else {
                    this.enablePicking = false
                }
            },

            // 确认选取已有内容了
            sureSelectContents () {
                let blockId = this.info.id
                let modelsArray = []
                let models
                let prioritiesArray = []
                let priorities
                let contentIdsArray = []
                let contentIds
                let p
                let exsitedMaxPriority
                if(this.localContent.length > 0) {
                    exsitedMaxPriority = this.localContent[0].priority
                } else {
                    exsitedMaxPriority = 0
                }

                let localContentLength = this.localContent.length
                for(let i = 1; i < this.underPickedContent.length + 1; i++) {
                    p = parseInt(exsitedMaxPriority) + i
                    prioritiesArray.push(p)
                }

                prioritiesArray.reverse()

                for (let i in this.underPickedContent) {
                    if(this.underPickedContent[i].channelId == 77) {
                        modelsArray.push(this.underPickedContent[i].modelId + '_witness')
                    } else {
                        modelsArray.push(this.underPickedContent[i].modelId)
                    }
                    contentIdsArray.push(this.underPickedContent[i].id)
                }

                models = modelsArray.join(',')
                priorities = prioritiesArray.join(',')
                contentIds = contentIdsArray.join(',')

                this.postContentLink(blockId, models, priorities, contentIds)
            },

            // 切换成目击者视频列表
            showWitnessList () {
                this.queryWitness.title = null
                this.showWitnessSearch = false
                setTimeout (() => {
                    this.showWitnessSearch = true
                }, 100)

                this.exsitedTableVisible = false
                this.witnessTableVisible = true
                this.getWitnessList(null, null, 1, 10, () => {
                    this.getUnpickedWitness('witness')
                })
            },

            // 切换成普通视频列表
            showNormalList () {
                this.exsitedTableVisible = true
                this.witnessTableVisible = false
                this.getContentTable(this.queryString(), () => {
                    this.getUnpickedWitness('normal')
                })
            },

            // 获取目击者表格数据
            getWitnessList(title, status, page, pageSize, callback) {
                let url = this.$api.witnessList + '?page=' + page + '&pageSize=' + pageSize
                if(title != null) {
                    url = url + '&title=' + title
                }
                if(status != null) {
                    url = url + '&status=' + status
                }
                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.witnessTable = res.data.data.list
                        this.witnessStoreTable = res.data.data.list
                        this.witnessAll = res.data.data.total
                        callback()
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

            // 根据状态查询目击者
            doQueryStatus (value) {
                if(value == 'all') {
                    value = null
                }
                this.queryWitness.status = value
                this.getWitnessList(this.queryWitness.title, value, 1, 10, () => {
                    this.getUnpickedWitness('witness')
                })
            },

            // 根据标题查询目击者
            doQueryWitness () {
                if(isNull(this.queryWitness.title)) {
                    this.queryWitness.title = null
                }
                this.getWitnessList(this.queryWitness.title, this.queryWitness.status, this.queryWitness.page, this.queryWitness.pageSize, () => {
                    this.getUnpickedWitness('witness')
                })
            },

            // 获取目击者视频列表的分页回调
            getWitnessPage (current, size) {
                this.queryWitness.page = current
                this.queryWitness.pageSize = size
                this.getWitnessList(null, null, current, size, () => {
                    this.getUnpickedWitness('witness')
                })
            },

            // 关闭目击者视频列表的回调
            closeWitnessTable () {
                this.witnessTable = []
                this.queryWitness = {
                    page: 1,
                    pageSize: 10,
                    status: null,
                    title: null
                }
            },

            // 已有内容蒙版关闭时的回调
            closeExsitedTable () {
                this.contentTable = []
                this.queryParams = {
                    pageSize: 10,
                    page: 1,
                    modelId: '',
                    channelId: '',
                    orderByClause: '',
                    status: 5,
                    title: ''
                }
            },

            // 提交关联申请
            postContentLink (blockId, models, priorities, contentIds) {
                let url = this.$api.blockContentLink + '?blockId=' + blockId + '&models=' + models + '&priorities=' + priorities + '&contentIds=' + contentIds
                axiosProxy.put(url).then( res=> {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.exsitedTableVisible = false
                        this.witnessTableVisible = false
                        this.getBLockContentList(this.$route.query.id)
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

            // 获取选中的目击者视频
            getCheckedWitness (value) {
                this.underPickedWitness = value
                if(this.underPickedWitness.length > 0) {
                    this.enablePickingWitness = true
                } else {
                    this.enablePickingWitness = false
                }
            },

            // 确认提交目击者内容按钮响应
            sureWitness () {
                let blockId = this.info.id
                let modelsArray = []
                let models
                let prioritiesArray = []
                let priorities
                let contentIdsArray = []
                let contentIds
                let p
                let exsitedMaxPriority
                if(this.localContent.length > 0) {
                    exsitedMaxPriority = this.localContent[0].priority
                } else {
                    exsitedMaxPriority = 0
                }

                let localContentLength = this.localContent.length

                for(let i = 1; i < this.underPickedWitness.length + 1; i++) {
                    p = parseInt(exsitedMaxPriority) + i
                    prioritiesArray.push(p)
                }

                prioritiesArray.reverse()

                for (let i in this.underPickedWitness) {
                    modelsArray.push('witness')
                    contentIdsArray.push(this.underPickedWitness[i].id)
                }

                models = modelsArray.join(',')
                priorities = prioritiesArray.join(',')
                contentIds = contentIdsArray.join(',')

                this.postContentLink(blockId, models, priorities, contentIds)
            },

            // 重置编辑表单
            resetEdit () {
                this.editInfo.title = null
                this.editInfo.poster = null
                this.editInfo.thirdUrl = null
                this.editInfo.bannerImg = null
                this.editInfo.verticalImg = null
                this.showEditBanner = false
                this.showEditPoster = false
                this.showVerticalImg = false
                setTimeout(() => {
                    this.showEditBanner = true
                    this.showEditPoster = true
                    this.showVerticalImg = true
                }, 100)
            },

            // 提交编辑表单
            postEdit () {
                if(isNull(this.editInfo.title) || this.editInfo.title == null) {
                    this.errorMessage('请补全标题')
                    return false
                }

                if(this.editInfo.contentModelId == 4) {
                    if(isNull(this.editInfo.thirdUrl) || this.editInfo.thirdUrl == null) {
                        this.errorMessage('请补全外链地址')
                        return false
                    }
                }

                if(this.editInfo.thirdUrl == null) {
                    this.editInfo.thirdUrl = this.editInfo.thirdUrl
                } else {
                    if(this.editInfo.thirdUrl.indexOf('http') == -1) {
                        this.editInfo.thirdUrl = 'https://' + this.editInfo.thirdUrl
                    } else {
                        this.editInfo.thirdUrl = this.editInfo.thirdUrl
                    }
                }

                switch (this.editInfo.addition) {
                    case 0:
                    case '0':
                        if(this.editInfo.contentModelId.indexOf('_shape_') !== -1) {
                            this.editInfo.contentModelId = this.editInfo.contentModelId.match(/(\S*)_shape_/)[1]
                        } else {
                            this.editInfo.contentModelId = this.editInfo.contentModelId
                        }
                    break
                    case 1:
                    case '1':
                        if(this.editInfo.contentModelId.indexOf('_shape_') == -1) {
                            this.editInfo.contentModelId = this.currentModelId + '_shape_1'
                        } else {
                            this.editInfo.contentModelId = this.editInfo.contentModelId.match(/(\S*)_shape_/)[1] + '_shape_1'
                        }
                    break
                    case 2:
                    case '2':
                        if(this.editInfo.contentModelId.indexOf('_shape_') == -1) {
                            this.editInfo.contentModelId = this.currentModelId + '_shape_2'
                        } else {
                            this.editInfo.contentModelId = this.editInfo.contentModelId.match(/(\S*)_shape_/)[1] + '_shape_2'
                        }
                    break
                    default: 
                        this.editInfo.contentModelId = this.currentModelId
                }
                this.updateHtml(this.editInfo)
            },

            // 关闭编辑的蒙版
            closeEdit () {
                this.resetEdit()
            },

            // 针对区块内容的各项操作
            action (){
                let index = arguments[1]
                let type = arguments[0]
                let id = this.localContent[index].id
                let priority = this.localContent[index].priority
                switch (type) {
                    case 'up':
                        // 上移
                        if(index == 0) {
                            this.errorMessage('已经是第一个了')
                            return false
                        } else {
                            let lastId = this.localContent[index - 1].id
                            let lastPriority = this.localContent[index - 1].priority
                            let ids = [lastId, id].join(',')
                            let priorities = [priority, lastPriority].join(',')
                            this.updatePriority(ids, priorities)
                        }
                    break
                    case 'down':
                        // 下移
                        if(index == this.localContent.length - 1) {
                            this.errorMessage('已经是最后一个了')
                            return false
                        } else {
                            let nextId = this.localContent[index + 1].id
                            let nextPriority = this.localContent[index + 1].priority
                            let ids = [id, nextId].join(',')
                            let priorities = [nextPriority, priority].join(',')
                            this.updatePriority(ids, priorities)
                        }
                    break
                    case 'top':
                        // 置顶
                        if(index == 0) {
                            this.errorMessage('已经是第一个了')
                            return false
                        } else {
                            let priority = this.localContent[0].priority + 1
                            this.updatePriority(id, priority)
                        }
                    break
                    case 'bottom':
                        // 置底
                        if(index == this.localContent.length - 1) {
                            this.errorMessage('已经是最后一个了')
                            return false
                        } else {
                            let priority = this.localContent[this.localContent.length - 1].priority - 1
                            this.updatePriority(id, priority)
                        }
                    break
                    case 'edit':
                        // 编辑
                        if(this.localContent[index].contentModelId == 4) {
                            this.showThirdUrl = true
                            let obj = {}
                            let array = []
                            array.push(obj)
                            obj.message = '此项必填'
                            obj.required = true
                            obj.trigger = 'blur'
                            obj.validator = function (rule, value, callback) {
                                // console.log(rule)
                            }
                            this.$set(this.editRules, 'thirdUrl', array)
                        } else {
                            this.showThirdUrl = false
                        }
                        this.getBlockContentDetail(id, (detailData) => {
                            this.currentModelId = detailData.contentModelId
                            for (let i in detailData) {
                                this.editInfo[i] = detailData[i]

                                if(i == 'title') {
                                    if(this.editInfo[i] !== null) {
                                        if(this.editInfo[i].indexOf('%') == -1) {
                                            this.editInfo[i] = this.editInfo[i]
                                        } else {
                                            // this.editInfo[i].replace(/%/g, '%25')
                                            this.editInfo[i] = decodeURIComponent(this.editInfo[i])
                                        }
                                    } else {
                                        this.editInfo[i] = this.editInfo[i]
                                    }
                                }
                            }
                            if(this.editInfo.thirdUrl == null) {
                                this.editInfo.thirdUrl = this.editInfo.thirdUrl
                            } else {
                                if(this.editInfo.thirdUrl.indexOf('http') == -1) {
                                    this.editInfo.thirdUrl = this.editInfo.thirdUrl
                                } else {
                                    this.editInfo.thirdUrl = this.editInfo.thirdUrl.slice(8, this.editInfo.thirdUrl.length)
                                }
                            }

                            if(detailData.contentModelId.indexOf('_shape_1') !== -1) {
                                this.editInfo.addition = '小图横划类型'
                            } else if(detailData.contentModelId.indexOf('_shape_2') !== -1) {
                                this.editInfo.addition = '不进行跳转'
                            } else {
                                this.editInfo.addition = '不选'
                            }

                            this.showEditPoster = false
                            this.showEditBanner = false
                            this.showVerticalImg = false
                            setTimeout(() => {
                                this.showEditBanner = true
                                this.showEditPoster = true
                                this.showVerticalImg = true
                            }, 100)
                        })
                        this.editVisible = true
                    break
                    case 'delete':
                        // 删除
                        this.$confirm("是否确认删除?", "警告", { type: "error" }).then( mes => {
                            this.omitBlockContent(id)
                        }).catch(error => {
                            console.log(error)
                        })
                    break
                    case 'no':
                        this.errorMessage('请先保存再移动')
                    break
                }
            },

            // 删除区块内容
            omitBlockContent (id) {
                axiosProxy.delete(this.$api.blockContentOmit + '/' + id).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getBLockContentList(this.$route.query.id)
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

            // 修改区块内容排序
            updatePriority (obj) {
                axiosProxy.put(this.$api.blockContentPriority, obj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getBLockContentList(this.$route.query.id)
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                })
            },

            // 获取区块内容的详情
            getBlockContentDetail(id, callback) {
                axiosProxy.get(this.$api.blockContentDetail + '/' + id).then( res => {
                    if(res.data.errorCode == 0) {
                        let detailObj = res.data.data
                        switch (detailObj.contentModelId) {
                            case 1:   
                            case '1':
                                this.currentModelType = '视频'
                            break
                            case 2:
                            case '2':
                                this.currentModelType = '直播'
                            break
                            case 3:
                            case '3':
                                this.currentModelType = '图文'
                            break
                            case '4':
                            case 4:
                                this.currentModelType = '外链'
                            break
                            case 'witness':
                                this.currentModelType = '目击者视频'
                            break
                            case '1_witness':
                                this.currentModelType = '关联新闻(视频)'
                            break
                            case '3_witness':
                                this.currentModelType = '关联新闻(图文)'
                            break
                            default:
                                this.currentModelType = '其他类型'
                        }
                        callback(detailObj)
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
            }
        }
    }
</script>

<style>
    .lastPath div{
        /* 给当前目录定义了一个class 名,为其子div设置了颜色 */
        color: #188AE2;
    }

    .cms-content-right .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .cms-content-right  .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .cms-content-right  .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
    .cms-content-right  .el-aside img{
            margin: auto 0;
            object-fit: cover;
            max-width: 100%;
            max-height: 100%;
    }
    .pad{
        /* 内容之间的间隔 */
        background-color: white;
    }

    .mask{
        /* 蒙层的设置 */
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 10;
        background: black;
        opacity: .6;
        bottom: 0;
        left: 0;
    }
    .maskMessage{
        /* 弹窗的大盒子 */
        height: 500px;
        width: 500px;
        position: fixed;
        z-index:1000;
        background: white;
        left: 400px;
        top: 200px;

        border-radius: 20px;
    }

    .maskHeader{
        /* 弹窗的顶部 */
        height: 40px;
        width: 100%;
        border-bottom: 2px dotted gray;
    }
    .maskHeader .headerButton{
        float: right;
        margin-right: 30px;
    }

    /*卡片相关样式*/
    .time {
        font-size: 13px;
        color: #999;
      }

      .bottom {
        margin-top: 13px;
        line-height: 12px;
      }

      .button {
        padding: 0;
        float: right;
      }

      .image {
        width: 100%;
        display: block;
      }

      .clearfix:before,
      .clearfix:after {
          display: table;
          content: "";
      }

      .clearfix:after {
          clear: both
      }

      .el-dialog {
        width: 80%;
        margin-top: 5vh!important;
      }


      /*编辑时图片的回显*/
      .display-picture {
        position: relative;
        overflow: hidden;
        z-index: 0;
        width: 100%;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-top: 10px;
        padding: 10px 10px 10px 90px;
        height: 92px;
    }
    .display-thumb {
        vertical-align: middle;
        display: inline-block;
        width: 70px;
        height: 70px;
        background-color: pink;
        float: left;
        position: relative;
        z-index: 1;
        margin-left: -80px;
    }
    .display-filename {
        line-height: 70px;
        margin-top: 0;
    }
    .delete-default {
      position: absolute;
      top: 0;
      right: 10px;
      cursor: hand;
      cursor: pointer;
    }

    .el-dialog {
        height: calc(100vh - 5vh - 50px);
        overflow: auto;
    }
    .tree-layout {
        height: auto;
    }

    .el-input-number {
        line-height: 30px;
    }

    .special {
        width: 26px;
        height: 26px;
        position: absolute;
        top: 0;
        right: 0;
        text-align: center;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }

    .pic1 {
        background-image: url(http://test.y2017.cnlive.com/0/1546850951057.png);
    }

    .pic2 {
        background-image: url(http://test.y2017.cnlive.com/0/1547454572770.png);
    }

    .special i {
        line-height: 36px;
        top: 0;
        transform: rotate(-45deg);
    }
</style>