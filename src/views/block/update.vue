<template>
    <section class="cms-body flex">

        <!-- 页面list内容 -->
        <div style="width: 100%;">
        <!-- 右边内容的大盒子 -->

            <el-dialog :title="buttonType.dialogTitle" :visible.sync="dialogTableVisible" @close="handleClose">

                <div class="cms-content-left" style="overflow: hidden;" v-if="buttonType.type == 'copy'">
                    <cms-tree :hasContent='true' @click="getChannelId" treeType="page"></cms-tree>
                </div>
                <div class="cms-content-right">
                    <!-- 添加已有内容 -->
                    <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap" v-if="buttonType.type == 'copy'">
                        <div  style="margin-top:16px;flex:auto">
                            <!-- 所有类型 -->
                            <el-select class="cms-left" v-if="isWitness == false" @change="doQueryModel" placeholder="所有类型" v-model="queryParams.modelId" style="width:120px">
                                <el-option label="所有类型" value="all"></el-option>
                                <el-option v-for="item in modelList" :key="item.id" :label="item.showName" :value="item.id"> </el-option>
                            </el-select>
                            <!-- 排序方式 -->
                            <el-select v-model="queryParams.orderByClause" @change="doQueryOrder" v-if="isWitness == false">  
                                <el-option label="默认排序" value="all"></el-option>     
                                <el-option label="ID降序" value="id desc"></el-option>
                                <el-option label="ID升序" value="id asc"></el-option>
                            </el-select>
                            <el-button type="success" @click="showWitnessList" v-if="isWitness == false">目击者视频</el-button>
                            <el-button type="success" @click="showNormalList" v-if="isWitness == true">其他视频</el-button>
                            <el-select @change="doQueryStatus" v-model="queryWitness.status" v-if="isWitness == true">
                                <el-option label="全部" value="all"></el-option>
                                <el-option label="上线" value="1"></el-option>  
                                <el-option label="下线" value="0"></el-option>
                            </el-select>
                            <cms-input label="标题" v-model="queryWitness.title" v-if="isWitness == true"></cms-input>
                            <el-button @click="doQueryWitness" v-if="isWitness == true">查询目击者视频标题</el-button>
                        </div>    
                        <div style="margin-top:16px; flex:auto" class="content-flex-right" v-if="isWitness == false">    
                            <cms-input label="标题" v-model="queryParams.title" :width="120"></cms-input>
                            <el-button @click="doQuery">查询</el-button>
                        </div>          
                    </div>  

                    <!-- 栏目内容的多选表格 -->
                    <el-table key="normal" :data="contentTable" stripe @selection-change="getSelectedContents" v-if="buttonType.type == 'copy' && isWitness == false">
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


                    <!-- 目击者内容的多选表格 -->
                    <el-table key="witness" :data="witnessTable" stripe @selection-change="getCheckedWitness" v-if="buttonType.type == 'copy' && isWitness == true">
                        <el-table-column type="selection" align="center"></el-table-column>
                        <el-table-column property="title" label="标题" align="center"></el-table-column>
                        <el-table-column property="videoUrl" label="视频" align="center">
                            <div slot-scope="scope">
                                <video :src="scope.row.videoUrl" height="200" width="auto" controls></video>
                            </div>
                        </el-table-column>
                        <el-table-column property="userId" label="目击者" align="center"></el-table-column>
                    </el-table>
                    <!-- 目击者内容的多选表格 -->


                    <div class="cms-list-footer" style="padding-bottom:20px;" v-if="buttonType.type == 'copy' && isWitness == false">
                        <el-button type="primary" @click="sureSelectContents">确认选取</el-button>
                        <cms-pagination v-if="showPagination == true" :total="allTotal" @change="getPages" :pageSize="queryParams.pageSize" :page="queryParams.page" :init="true"></cms-pagination>
                    </div>

                    <div class="cms-list-footer" style="padding-bottom:20px;" v-if="buttonType.type == 'copy' && isWitness == true">
                        <el-button type="primary" @click="sureWitnessSelection">确认选取目击者</el-button>
                        <cms-pagination :total="witnessAll" @change="getWitnessPage" :pageSize="queryWitness.pageSize" :page="queryWitness.page" :init="true"></cms-pagination>
                    </div>
                    <!-- 添加已有内容结束 -->
                </div>

                <!-- 新增内容 -->
                <el-form ref="contentForm" :model="formValue" :rules="contentRules" class="cms-form" label-width="162px" v-loading="loading" v-if="buttonType.type == 'add' || buttonType.type == 'edit' && editWitness == false">
                    <!-- <el-form-item label="sp名称" class="flex-50" prop="spName">
                        <el-input placeholder="sp名称" v-model="spName"></el-input>
                    </el-form-item> -->

                    <el-form-item :label="item.showName" :class="item.single? 'flex-100': 'flex-50'" v-for="(item, index) in formList" :key="index" :prop="item.field">

                        <!-- dataType == 1 文本框 -->
                        <div v-if="item.field != 'spName'">
                            <el-input :placeholder="item.description" v-if="item.dataType == 1 && item.field != 'title'" v-model="formValue[item.field]"></el-input>
                            <el-input :placeholder="item.description" v-if="item.dataType == 1 && item.field == 'title'" v-model="title"></el-input>
                        </div>
                        <div v-else>
                            <el-input placeholder="sp名称" v-model="spName"></el-input>
                        </div>

                        <!-- dataType == 2 自定义的整形 -->
                        <el-input-number :controls="isControl" v-model="formValue[item.field]" v-if="item.dataType == 2" :min="1" label="item.description" @change="handleChange" @focus="getField(item.field)"></el-input-number>

                        <!-- dataType == 3 自定义的浮点形 -->
                        <el-input :placeholder="item.description" type="number" v-if="item.dataType == 3" v-model="formValue[item.field]"></el-input>

                        <!-- dataType == 4 文本区 -->
                        <el-input
                            type="textarea"
                            :rows="2"
                            v-model="formValue[item.field]"
                            v-if="item.dataType == 4"
                            :placeholder="item.description">
                        </el-input>

                        <!-- dataType == 5 自定义的日期 -->
                        <el-date-picker
                            v-model="formValue[item.field]"
                            type="date"
                            v-if="item.dataType == 5 && buttonType.type == 'add'"
                            placeholder="选择日期">
                        </el-date-picker>

                        <div v-if="item.field == 'publishTime'">
                            <el-input placeholder="选择日期" v-model="publishTime" disabled></el-input>
                        </div>
                        <div v-else>
                            <el-input placeholder="选择日期" v-if="item.dataType == 5 && buttonType.type == 'edit'" v-model="formValue[item.field]" disabled></el-input>
                        </div>

                        <!-- dataType == 7 多选框 -->
                        <el-checkbox-group v-if="item.dataType == 7 && buttonType.type == 'add'" v-model="formValue[item.field]">
                            <el-checkbox v-for="(ele,index) in item.optValue.split(',')" :label="ele" :key="index"></el-checkbox>
                        </el-checkbox-group>

                        <el-checkbox-group v-if="item.dataType == 7 && buttonType.type == 'edit'" v-model="formValue[item.field]">
                            <el-checkbox v-for="(ele,index) in item.optValue.split(',')" :label="ele" :key="index"></el-checkbox>
                        </el-checkbox-group>

                        <!-- dataType == 6 下拉框 -->
                        <el-select placeholder="请选择" v-model="formValue[item.field]" v-if="item.dataType == 6">
                            <el-option
                                v-for="(ele,index) in item.optValue.split(',')"
                                :label="ele"
                                :key="index"
                                :value="ele">
                            </el-option>
                        </el-select>

                        <!-- dataType == 8 单选框 -->
                        <el-radio-group v-if="item.dataType == 8" v-model="formValue[item.field]">
                            <el-radio v-for="(ele,index) in item.optValue.split(',')" :label="ele" :key="index"></el-radio>
                        </el-radio-group>

                        <!-- dataType == 10 上传图片 -->
                        <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && buttonType.type == 'add' && showImage"></uploader>

                        <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && buttonType.type == 'edit' && showImage && item.field == 'poster'" :default="poster"></uploader>

                        <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && buttonType.type == 'edit' && showImage && item.field != 'poster'" :default="formValue[item.field]"></uploader>

                        <!-- dataType == 11 富文本 -->
                        <cms-editor :defaultMsg="formValue[item.field]" :index="item.field" @ready="getUeditor" v-if="item.dataType == 11 && buttonType.type == 'add' && showEditor == true"></cms-editor> 
                        <cms-editor :defaultMsg="formValue[item.field]" :index="item.field" @ready="getUeditor" v-if="item.dataType == 11 && buttonType.type == 'edit' && showEditor == true"></cms-editor>  

                    </el-form-item>

                    <div class="form-footer">
                        <el-button type="primary"  @click="add" v-if="buttonType.type == 'add'">确认添加</el-button>
                        <el-button type="primary"  @click="update" v-if="buttonType.type == 'edit'">确认修改</el-button>
                        <el-button type="info" @click="reset">重置</el-button>
                    </div>
                </el-form>
                <!-- 新增内容结束 -->

                <!-- 编辑目击者内容 -->
                <el-form ref="witnessForm" :model="witnessInfo" :rules="witnessRules" class="cms-form" label-width="100px" style="margin: 0; padding: 0;" v-if="editWitness == true">
                    <el-form-item label="标题" class="flex-50" prop="title">
                        <el-input v-model="witnessInfo.title" class="cms-width"></el-input>
                    </el-form-item>

                    <el-form-item label="排序" class="flex-50" prop="priority">
                        <el-input v-model="witnessInfo.priority" class="cms-width" type="number"></el-input>
                    </el-form-item>

                    <el-form-item label="封面" class="flex-50" prop="poster">
                        <uploader @change="getWitnessUrl" v-if="showImage" :default="witnessInfo.poster"></uploader>
                    </el-form-item>

                    <div class="form-footer">
                        <el-button type="primary" @click="updateWitness">确认修改</el-button>
                        <el-button type="info" @click="resetWitness">重置</el-button>
                    </div>
                </el-form>
                <!-- 编辑目击者内容结束 -->
            </el-dialog>

            <!-- 区块基本信息的盒子 -->
            <el-form ref="form" :model="info" :rules="rules" class="cms-form" label-width="100px"  v-loading="loading" style="margin:0;padding:0">  
                
                <el-form-item label="区块id" class="flex-50" prop="id">
                    <el-input v-model="info.id" class="cms-width" disabled></el-input>
                </el-form-item> 
            
                <el-form-item label="区块名称" class="flex-50"  prop="name">
                    <el-input v-model="info.name"  class="cms-width" :disabled="editAble"></el-input>
                </el-form-item> 
            </el-form>

            <!-- 选择新建的形式 -->
            <el-form>
                <div class="form-footer">
                    <el-button type="primary" @click="addOldContent">选取已有内容</el-button>
                    <!-- <el-dropdown @command="newContent">
                        <el-button type="success">
                        新建内容<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in modelList" :key="index" :command="item.id" v-if="item.enable == true">{{item.showName}}</el-dropdown-item>

                            <el-dropdown-item v-for="(item, index) in modelList" :key="index" :command="item.id" v-if="item.enable == false" disabled>{{item.showName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                    <el-button type="warning" @click="addOutterLink">添加外链</el-button>
                    <el-button type="info" @click="saveBlock">保存</el-button>
                </div>
            </el-form>

            <el-row :gutter="20" style="padding-left: 24px; padding-right: 24px; padding-bottom: 20px;">

                <!-- 本地的暂存区块内容列表 -->
                <el-col :span="6" v-for="(item, index) in localContent" :key="index" style="padding-top: 20px;">
                    <el-card :body-style="{ padding: '0px' }">
                      <div v-if="item.poster != undefined">
                        <img :src="item.poster" class="image" width="100%" height="180" v-if="item.poster.indexOf('http') != -1">
                        <img :src="item.imageUrl" class="image" width="100%" height="180" v-else>
                      </div>
                      <div v-else>
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539691103822&di=ffbac6710b9d2152d767a3405d250032&imgtype=0&src=http%3A%2F%2Fpic2.16pic.com%2F00%2F20%2F02%2F16pic_2002642_b.jpg" class="image" width="100%" height="180">
                      </div>
                      <div style="padding: 14px;">
                        <el-row style="height: 40px; overflow: hidden;">
                            <span style="line-height: 20px;">{{item.title}}</span>
                        </el-row>
                        <div class="bottom clearfix">
                          <el-row style="height: 32px; overflow: hidden;">
                              <time class="time" style="line-height: 16px;">{{item.modelShowName}}</time>
                          </el-row>
                          <el-row style="margin-top: 10px; text-align: center">
                            <el-col :span="4"><i class="el-icon-arrow-up" @click="action('up', index)"></i></el-col>
                            <el-col :span="4"><i class="el-icon-arrow-down" @click="action('down', index)"></i></el-col>
                            <el-col :span="4"><i class="el-icon-caret-top" @click="action('top', index)"></i></el-col>
                            <el-col :span="4"><i class="el-icon-caret-bottom" @click="action('bottom', index)"></i></el-col>
                            <el-col :span="4"><i class="el-icon-edit" @click="action('edit', index)"></i></el-col>
                            <el-col :span="4"><i class="el-icon-delete" @click="action('delete', index)"></i></el-col>
                          </el-row>
                        </div>
                      </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </section>
</template>

<script>
import formMixins from "@/mixins/form";
import functionMixins from "@/mixins/function";
import {axiosProxy,getPageTreeParams,timestampToTime} from "@/api/tool"
import va from "@/rules";

export default {
    mixins: [formMixins, functionMixins],
    data(){
        let self = this;
        let required = va.required();
        let number = va.number();
        let string = va.string();
        return{
            showWitnessPagination: true,
            showPagination: true,
            editWitness: false,
            witnessInfo: {
                title: null,
                poster: null,
                priority: null
            },
            witnessRules: {

            },
            isWitness: false,
            showImage: true,
            expandAll: false,
            queryParams: {
                pageSize: 10,
                page: 1,
                modelId: '',
                channelId: '',
                orderByClause: '',
                status: 5,
                title: ''
            }, // 查询参数
            queryWitness: {
                pageSize: 10,
                page: 1,
                status: null,
                title: null
            },
            buttonType: {
                type: '',
                dialogTitle: '',
            }, // 控制蒙版内容和蒙版标题
            formList: [], // 动态表单内容
            formValue: {}, // 新增内容的动态表单
            currentModel: null, // 新增内容时选中的模型 
            maxPriority: null, // 置顶置底用的最大的顺序
            minPriority: null,
            contentType: '', // 区分区块列表中的内容是哪里来的
            allTotal: null, // 内容列表总数
            contentTable: [], // 内容列表
            modelList: [], // 模型列表
            blockList: [], // 区块列表
            deleteBlocks: [], // 被选中删除的区块集
            deleteIds: [], // 被选中删除的区块id
            blockValues: [], // 从内容列表中新复制出来的内容
            addingContent: [], // 手动添加出来的新内容
            dialogTableVisible: false, // 蒙版是否可见
            info:{

            }, // 区块表单信息
            contentRules: {
                
            },
            rules:{
                id:[required],
                name:[required],
                path:[required],
                type:[required],
                title: [required]
            },//校验规则
            channelShowList:'',//显示上级栏目
            params:this.$route.query, //前一个页面带过来的数据
            editAble:true,//判断是否可以修改区块基本信息
            contentList:[],//内容信息列表
            valueObj: {}, // 日期
            txtObj: {}, // 富文本
            imgObj: {}, // 图片
            ue: [], //富文本编辑器初始化
            parentUriId: null,
            pageId: null,
            addNewParam: {},
            formData: [],
            editOrder: null,
            localContent: [],
            poster: '',
            title: '',
            storageId: null,
            copy: {},
            publishTime: '',
            spName: '',
            updatingId: null,
            updatingIndex: null,
            witnessTable: [],
            witnessAll: null,
            channelName: '',
            isControl: false,
            currentNum: null,
            showEditor: false,
            ueIndex: null,
            hasUeditor: false
        }
    },
    created(){
        this.loading=false;

        if(this.dialogTableVisible == false) {
            this.formValue = {}
            this.dialogTableVisible = false
            this.title = ''
            this.poster = ''
        }

        let childId = this.params.id
        this.getBlockInfo(childId);//初始化区块基本数据
        this.getContentInfo(childId);//初始化内容数据
        this.getModelList()
    },
    mounted() {
        let clientHeight = document.body.clientHeight;
        $(".cms-body").css("minHeight", clientHeight - 110 + "px");
    },
    methods:{
        getField (field) {
            this.currentNum = field
        },
        handleChange (value) {
            if(value == undefined) {
                this.formValue[this.currentNum] = 1
            }
        },
        handleClose () {
            this.editWitness = false
            // window.location.reload()
            // if(this.showEditor) {
            //     this.ue[this.ueIndex].destroy()
            // }
            // setTimeout (() => {
            //     this.showEditor = false
            // }, 0)
            
        },
        addOutterLink () {
            this.currentModel = 4
            this.buttonType.type = 'add'
            this.title = ''
            this.poster = ''
            this.reset()
            this.buttonType.dialogTitle = '添加外链'
            this.dialogTableVisible = true
            this.getFormInfo(this.$api.itemGet + '/' + this.currentModel, (formList) => {
                            
            })
        },
        getWitnessUrl (imageUrl, index, imagePath, storageId) {
            this.witnessInfo.poster = imageUrl
        },
        updateWitness () {
            let obj = {}
            this.dialogTableVisible = false     
            this.localContent[this.updatingIndex].title = this.witnessInfo.title
            this.localContent[this.updatingIndex].poster = this.witnessInfo.poster
            this.localContent[this.updatingIndex].priority = this.witnessInfo.priority
        },
        resetWitness () {
            this.witnessInfo.title = ''
            this.witnessInfo.priority = ''
            this.witnessInfo.poster = ''
            this.showImage = false
            setTimeout (() => {
                this.showImage = true
            }, 100)
        },
        showNormalList () {
            this.isWitness = false
            this.imgObj = {}
            this.buttonType.type = 'copy'
            this.getContentTable(this.queryString())
        },
        showWitnessList () {
            this.isWitness = true
            this.getWitnessList(null, null, this.queryWitness.page, this.queryWitness.pageSize)
        },
        getWitnessList(title, status, page, pageSize) {
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
                    this.witnessAll = res.data.data.total
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
        getCheckedWitness (value) {
            this.blockValues = []
            for (let i in value) {
                let obj = {}
                obj.title = value[i].title
                obj.poster = value[i].videoImg
                obj.priority = 0
                obj.id = value[i].id
                this.blockValues.push(obj)
            }
        },
        getWitnessPage (current, size) {
            this.queryWitness.page = current
            this.queryWitness.pageSize = size
            this.getWitnessList(null, null, current, size)
        },
        doQueryStatus (value) {
            if(value == 'all') {
                value = null
            }
            this.getWitnessList(null, value, 1, 10)
        },
        sureWitnessSelection (value) {
            this.dialogTableVisible = false
            this.title = ''
            this.poster = ''
            this.contentType = 'old'
            this.queryWitness.page = 1
            this.queryWitness.pageSize = 10
            this.showWitnessPagination = false
            setTimeout(() => {
                this.showWitnessPagination = true
            }, 100)

            for (let i in this.blockValues) {
                this.blockValues[i].priority = this.localContent.length + this.blockValues.length - i
            }
            this.localContent = this.localContent.concat(this.blockValues)
            this.localContent = this.resort(this.localContent)
            this.localContent = this.localContent.reverse()
        },
        doQueryWitness () {
            this.getWitnessList(this.queryWitness.title, null, this.queryWitness.page, this.queryWitness.pageSize)
        },
        getChannelId (data, node) {
            this.isWitness = false
            if(data.id != '-1') {
                this.queryParams.channelId = data.id
                this.channelName = data.name
            } else {
                this.queryParams.channelId = ''
                this.channelName = ''
            }
            this.getContentTable(this.queryString())
        },
        getUrl (imageUrl, index, imagePath, storageId) {
            this.formValue[index] = imageUrl
            this.storageId = storageId
            this.poster = imagePath
        },
        update () {
            for (let i in this.formList) {
                if(this.formList[i].isRequire) {
                    if(this.formList[i].field !== 'publishTime' && this.formList[i].field !== 'title' && this.formList[i].field !== 'spName' && this.formList[i].field !== 'poster') {
                        if(this.formValue[this.formList[i].field] == undefined) {
                            this.errorMessage('请补全' + this.formList[i].showName)
                            return false
                        }
                    }
                }
            }
            let params = this.getFormParams()

            this.localContent[this.editOrder].blockContentAttr = params.cmsBlockContentList[0].blockContentAttr
            for (let i in params.cmsBlockContentList[0].blockContentAttr) {
                params.cmsBlockContentList[0].blockContentAttr[i].blockContentId = this.updatingId
            }
            this.localContent[this.editOrder].title = this.title
            this.localContent[this.editOrder].poster = params.cmsBlockContentList[0].poster
            this.localContent[this.editOrder].imageUrl = params.cmsBlockContentList[0].poster
            this.dialogTableVisible = false
            for (let i in this.localContent[this.editOrder].blockContentAttr) {
                if(this.localContent[this.editOrder].blockContentAttr[i].attrName == 'title') {
                    this.localContent[this.editOrder].blockContentAttr[i].attrValue = this.localContent[this.editOrder].title
                }

                if(this.localContent[this.editOrder].blockContentAttr[i].attrName == 'poster') {
                    this.localContent[this.editOrder].blockContentAttr[i].attrValue = this.localContent[this.editOrder].poster
                }
            }
        },
        add () {
            this.contentType = 'current'
            for (let i in this.formList) {
                if(this.formList[i].dataType == 11) {
                    this.getEditorContent(this.formList[i].field)
                }

                if(this.formList[i].field == 'title') {
                    this.formValue[this.formList[i].field] = this.title
                }

                if(this.formList[i].field == 'spName') {
                    this.formValue[this.formList[i].field] = this.spName
                }

                if(this.formList[i].field == 'publishTime') {
                    this.formValue[this.formList[i].field] = this.publishTime
                }

                if(this.formList[i].isRequire) {
                    // if(this.formList[i].field !== 'publishTime' && this.formList[i].field !== 'title' && this.formList[i].field !== 'spName') {
                        if(this.formValue[this.formList[i].field] == undefined || this.formValue[this.formList[i].field] == '') {
                            this.errorMessage('请补全' + this.formList[i].showName)
                            return false
                        }
                    // }
                }
            }

            setTimeout (() => {
                let params = this.getFormParams();
                this.localContent = this.localContent.concat(params.cmsBlockContentList[0])
                for (let i = this.localContent.length - 1; i > -1 ; i --) {
                    this.localContent[i].priority = this.localContent.length - i
                }
                this.dialogTableVisible = false
                this.reset()
            },0)
        },
        getFormParams () {
            let params = {}; //数组对象换成字符串
            let sendAttr = []

            for (let key in this.formValue) {
                params.attrObj = {}

                if(this.formValue[key] != undefined) {
                    params.attrObj['attrName'] = key
                    if (this.formValue[key] instanceof Array) {
                        params.attrObj['attrValue'] = this.formValue[key].join(',')
                    } else {
                        params.attrObj['attrValue'] = this.formValue[key]
                    }

                    if(this.updatingIndex != null) {
                        for (let j in this.blockList[this.updatingIndex].blockContentAttr) {
                            if(this.blockList[this.updatingIndex].blockContentAttr[j].attrName == key) {
                                params.attrObj['id'] = this.blockList[this.updatingIndex].blockContentAttr[j].id
                            }
                        }
                    }

                    params.title = this.title
                    params.poster = this.poster
                    if(key == 'title') {
                        this.formValue[key] = this.title
                    }

                    if(key == 'poster') {
                        this.formValue[key] = this.poster
                    }

                    sendAttr.push(params.attrObj)
                    params.blockContentAttr = sendAttr
                }
            }
            delete params.attrObj

            params.contentModelId = this.currentModel + ''
            params.priority = 0


            let outParam = {}
            outParam.cmsBlockContentList = []
            outParam.cmsBlockContentList.push(params)
            outParam.name = 'string name'
            outParam.pageId = this.pageId
            outParam.parentUriId = this.parentUriId
            outParam.id = parseInt(this.params.id)
            this.addNewParam = outParam
            return outParam;
        },
        reset () {
            this.updatingIndex = null
            this.valueObj = {}
            this.txtObj = {}
            this.imgObj = {}
            this.title = ''
            this.poster = ''
            this.spName = ''
            this.showImage = false
            setTimeout (() => {
                this.showImage = true
            }, 100)
            this.resetDataInfo(this.formValue)
        },
        remove (tip, index) {
            if(tip == 'remove') {
                delete this.imgObj['img' + index]
            }
        },
        //获取ue实例
        getUeditor(ue, index) {
            this.ueIndex = index
            this.ue[index] = ue;
        },
        // 富文本编辑器相关，具体干啥的还不知道
        getDocTxt(txt,index){
            this.ue[index].execCommand('inserthtml',txt);
        },
        getEditorContent(i) {
            this.formValue[i] = this.ue[i].getContent()
        },
        // 获取上传之后的文件路径
        getFieldImg(path, index) {
            this.imgObj['img' + index] = path
            this.formValue[index] = path
            if(this.buttonType.type == 'edit') {
                this.imgObj['display_' + index] = false
            }
        },
        deleteDefault (index) {
            this.imgObj['display_' + index] = false
        },
        // 添加新内容
        newContent (value) {
            this.currentModel = value
            this.buttonType.type = 'add'
            this.title = ''
            this.poster = ''
            this.reset()
            this.buttonType.dialogTitle = '创建新内容'
            this.dialogTableVisible = true
            this.getFormInfo(this.$api.itemGet + '/' + this.currentModel, (formList) => {
                // console.log('no bug')
            })
        },
        getFormInfo (url,callback) {
            axiosProxy.get(url).then(res=>{
                if(res.data.errorCode == '0') {
                    // console.log('接下来的返回数据')
                    // console.log(res)
                    // console.log('这里得到的是模型项')
                    this.formList = this.resort(res.data.data)
                    let name
                    for(let i in this.formList) {
                        if(this.formList[i].dataType == 7) {
                            name = this.formList[i].field
                        }

                        if(this.formList[i].dataType == 11) {
                            // console.log('走这里了么')
                            this.showEditor = true
                            // this.hasUeditor = true
                        } 

                        if(this.formList[i].isRequire == true) {
                            let obj = {}
                            let array = []
                            array.push(obj)
                            obj.message = '此项必填'
                            obj.required = true
                            obj.trigger = 'blur'
                            obj.validator = function (rule, value, callback) {
                                // console.log(rule)
                            }
                            this.$set(this.rules, this.formList[i].field)
                            this.contentRules[this.formList[i].field] = array
                        }
                    }
                    if(this.buttonType.type == 'add') {
                        for(let i in this.formList) {
                            this.$set(this.formValue, this.formList[i].field)
                            this.formValue[this.formList[i].field] = this.formList[i].defValue
                            switch (this.formList[i].dataType) {
                                case 11: 
                                    this.txtObj[this.formList[i].field] = this.formList[i].defValue
                                    this.formValue[this.formList[i].field] = this.txtObj[this.formList[i].field]
                                break
                                case 5: 
                                    this.$set(this.formValue, this.formList[i].field)
                                    this.$set(this.valueObj, this.formList[i].field)
                                    if(this.buttonType.type == 'add') {
                                        this.valueObj[this.formList[i].field] = this.formList[i].defValue
                                        this.formValue[this.formList[i].field] = this.formList[i].defValue
                                    } else if (this.buttonType.type == 'edit') {
                                        this.valueObj[this.formList[i].field] = this.formList[i].defValue
                                        this.formValue[this.formList[i].field] = this.valueObj[this.formList[i].field]
                                    }
                                break
                                case 10:
                                    this.imgObj['img' + this.formList[i].field] = this.formList[i].defValue
                                    this.formValue[this.formList[i].field] = this.imgObj['img' + this.formList[i].field]
                                break
                                case 7:
                                    this.$set(this.formValue, this.formList[i].field)
                                    this.formValue[this.formList[i].field] = this.formList[i].defValue.split(',')
                                break
                            }    
                        }
                        callback()
                    } else if(this.buttonType.type == 'edit') {
                        // console.log('走这里的回调呗')
                        callback(name)
                    }
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('更新失败')
                    }
                }
            }).catch(err=>{console.log(err)})
        },
        creatBread(node, arr) {
            if (node.parent != null) {
                let params = {
                name: node.data.name,
                id: node.data.rid
                };
            arr.push(params);
            this.creatBread(node.parent, arr);
            } else {
                this.breadItems = arr.reverse();

                var breadStr ='';
                let pid='';
                for (let i in this.breadItems) {
                    breadStr=breadStr+this.breadItems[i].name+'/'; //属性
                    pid=this.breadItems[i].id
                }
                
                
                localStorage.setItem('bid',[breadStr,pid]);//将list页面保存到的,名字目录和id,存起来,到edit页面用
                localStorage.setItem('bread', JSON.stringify(this.breadItems))
                return false;
            }
        },
        //页面树点击
        treeClick(data,node){
            let test = localStorage.getItem('datas')
            let prevData = JSON.stringify(this.blockList)
            let currentData = JSON.stringify(this.localContent)
            if(test == currentData) {
                if(node.isLeaf){
                    this.getBlockInfo(node.data.rid);//初始化区块基本数据
                    this.getContentInfo(node.data.rid);//初始化内容数据
                    this.getModelList()

                }else if(data.id==-1){//点击根目录,不动
                    this.routerLink('/block/list',0)
                }else{
                    let element=getPageTreeParams(node);//拼接好的参数
                    this.creatBread(node, []);//获得当前目录
                    this.routerLink('/block/list','',element)
                }
            } else {
                this.$confirm("内容未保存,是否离开?", "警告", { type: "error" })
                .then(mes => {
                    if(mes == 'confirm') {
                        if(node.isLeaf){
                            this.getBlockInfo(node.data.rid);//初始化区块基本数据
                            this.getContentInfo(node.data.rid);//初始化内容数据
                            this.getModelList()

                        }else if(data.id==-1){//点击根目录,不动
                            this.routerLink('/block/list',0)
                        }else{
                            let element=getPageTreeParams(node);//拼接好的参数
                            this.routerLink('/block/list','',element)
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            }
        },
        //初始化区块数据
        getBlockInfo(id){//这里的id是传过来的子id
            
            let breadStr=localStorage.getItem('bid')
            let breadArr=breadStr.split(',')
            this.channelShowList=breadArr[0];//将list页面中穿过来的值,上级目录;
            let pid=parseInt(breadArr[1]);//上一个页面传来的父id


            let url=this.$api.getBlock;
            axiosProxy.get(url+'/'+id).then(res=>{
                if(res.data.errorCode==0){
                    this.info = res.data.data
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('初始化信息失败')
                    }
                }
                
            }).catch(err=>{console.log(err)})
        },
        // 获取多选框的选中内容
        getSelectedContents (value) {
            this.blockValues = []
            for (let i in value) {
                this.getContentDetail(value[i].id)
            }
        },
        getContentDetail (id) {
            let url = this.$api.contentGet
            axiosProxy.get(url+'/'+id).then(res=>{
                if(res.data.errorCode==0){
                    let contentDetail = res.data.data
                    let obj = {}
                    // console.log('这里能拿到spName么')
                    // console.log(contentDetail)
                    obj.spName = contentDetail.spName
                    obj.publishTime = contentDetail.publishTime
                    obj.channelId = contentDetail.channelId
                    obj.blockContentAttr = contentDetail.attr
                    obj.contentModelId = contentDetail.modelId + ''
                    obj.contentId = contentDetail.id + ''
                    obj.priority = contentDetail.weight
                    obj.imageUrl = contentDetail.imageUrl
                    obj.title = contentDetail.title
                    obj.storageId = contentDetail.storageId
                    obj.poster = contentDetail.poster
                    obj.blockId = this.info.id
                    obj.cmsContent = null
                    this.blockValues.push(obj)
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('获取详细内容失败')
                    }
                }
                
            }).catch(err=>{console.log(err)})
        },
        // 确认选取的按钮
        sureSelectContents () {
            this.dialogTableVisible = false
            this.title = ''
            this.poster = ''
            this.queryParams.page = 1
            this.queryParams.pageSize = 10
            this.showPagination = false
            setTimeout (() => {
                this.showPagination = true
            }, 100)
            this.contentType = 'old'
            for (let i in this.blockValues) {
                this.blockValues[i].priority = this.localContent.length + this.blockValues.length - i
            }
            this.localContent = this.localContent.concat(this.blockValues)
            this.localContent = this.resort(this.localContent)
            this.localContent = this.localContent.reverse()
        },
        getMaxMin() {
            let max = this.localContent[0].priority
            let min = this.localContent[0].priority
            for (let i = 1; i < this.localContent.length; i++) {
                if(this.localContent[i].priority > max) {
                    max = this.localContent[i].priority
                }
            }
            for(let i in this.localContent) {
                if(this.localContent[i].priority < min) {
                    min = this.localContent[i].priority
                }
            }
            this.maxPriority = max
            this.minPriority = min
        },
        //初始化内容数据
        getContentInfo(id){
            let url=this.$api.blockContents;
            axiosProxy.get(url+'/'+id).then(res=>{
                if(res.data.errorCode == '0') {
                    // this.blockList = this.resort(res.data.data).reverse()
                    this.blockList = res.data.data
                    window.localStorage.setItem('datas', JSON.stringify(this.blockList))
                    this.localContent = this.blockList
                    for (let i = this.localContent.length - 1; i > -1 ; i --) {
                        this.localContent[i].priority = this.localContent.length - i
                    }
                    if(this.localContent.length > 0) {
                        this.getMaxMin()
                    }
                } else {
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('初始化内容失败')
                    }
                } 
            }).catch(err=>{console.log(err)})
        },  
        // 获取内容列表
        getContentTable (url) {
            axiosProxy.get(url).then(res=>{
                if(res.data.errorCode == '0') {
                    this.contentTable = res.data.data.list
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
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('获取内容列表失败')
                    }
                }
            }).catch(err=>{console.log(err)})
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
        // 分页
        getPages(current, size) {
            this.queryParams.pageSize = size
            this.queryParams.page = current
            this.getContentTable(this.queryString('page'))
        },
        // 各种条件查询--标题
        doQuery() {
            this.getContentTable(this.queryString())
        },
        // 各种条件查询--id顺序
        doQueryOrder (value) {
            if(value == 'all') {
                this.queryParams.orderByClause = ''
            } else {
                this.queryParams.orderByClause = value
            }
            this.getContentTable(this.queryString())
        },
        // 各种条件查询--模型
        doQueryModel (value) {
            if(value == 'all') {
                this.queryParams.modelId = ''
            } else {
                this.queryParams.modelId = value
            }
            this.getContentTable(this.queryString())
        },
        //是否可以编辑区块基本信息的toggle方法
        blockEdit(){
            this.editAble=!this.editAble;
        },
        //添加已有类型内容
        addOldContent(){
            this.imgObj = {}
            this.dialogTableVisible = true
            this.buttonType.type = 'copy'
            this.buttonType.dialogTitle = '选取已有内容'
            this.getContentTable(this.queryString())
        },
        // 区块内容的操作
        action () {
            let index = arguments[1]
            let type = arguments[0]
            switch (type) {
                case 'up':
                    // 上移
                    if(index == 0) {
                        this.errorMessage('已经是第一个了')
                        return false
                    } else {
                        let temp = this.localContent[index]
                        this.$set(this.localContent, index, this.localContent[index - 1])
                        this.$set(this.localContent, index - 1, temp)
                        for (let i = this.localContent.length - 1; i > -1 ; i --) {
                            this.localContent[i].priority = this.localContent.length - i
                        }
                    }
                break
                case 'down':
                    // 下移
                    if(index == this.localContent.length - 1) {
                        this.errorMessage('已经是最后一个了')
                        return false
                    } else {
                        let temp = this.localContent[index]
                        this.$set(this.localContent, index, this.localContent[index + 1])
                        this.$set(this.localContent, index + 1, temp)
                        for (let i = this.localContent.length - 1; i > -1 ; i --) {
                            this.localContent[i].priority = this.localContent.length - i
                        }
                    }
                break
                case 'top':
                    // 置顶
                    if(index == 0) {
                        this.errorMessage('已经是第一个了')
                        return false
                    } else {
                        this.localContent[index].priority = parseInt(this.maxPriority) + 1
                        this.resort(this.localContent).reverse()
                        this.getMaxMin()
                        for (let i = this.localContent.length - 1; i > -1 ; i --) {
                            this.localContent[i].priority = this.localContent.length - i
                        }
                    }
                break
                case 'bottom':
                    // 置底
                    if(index == this.localContent.length - 1) {
                        this.errorMessage('已经是最后一个了')
                        return false
                    } else {
                        this.localContent[index].priority = parseInt(this.minPriority) - 1
                        this.resort(this.localContent).reverse()
                        this.getMaxMin()
                        for (let i = this.localContent.length - 1; i > -1 ; i --) {
                            this.localContent[i].priority = this.localContent.length - i
                        }
                    }
                break
                case 'edit':
                    // 编辑
                    this.resetWitness()
                    this.updatingIndex = index
                    this.showImage = false
                    this.showEditor = false

                    this.editOrder = index
                    this.dialogTableVisible = true
                    this.buttonType.type = 'edit'
                    this.buttonType.dialogTitle = '编辑内容'

                    if(this.localContent[index].blockContentAttr) {
                        if(this.localContent[index].blockContentAttr.length > 0) {
                            // 编辑已经存在的栏目内容
                            // console.log('这里是编辑已经存在的栏目内容')
                            this.editWitness = false
                            this.updatingId = this.localContent[index].blockContentAttr[0].blockContentId
                            this.currentModel = this.localContent[index].contentModelId + ''
                            let currentContentId
                            let from
                            if(this.localContent[index].contentId) {
                                currentContentId = this.localContent[index].contentId
                                

                                if(this.localContent[index].id) {
                                    // 栏目内容的编辑
                                    from = 'old'
                                    // console.log('这里是保存过的旧栏目内容')
                                    currentContentId = this.localContent[index].id
                                    // this.getEditContent(currentContentId, from)
                                    this.getEditContentCopy(currentContentId, from)
                                } else {
                                    from = 'new'
                                    // console.log('这里是没保存过的旧栏目内容')
                                    currentContentId = this.localContent[index].contentId
                                    this.getEditContentCopy(currentContentId, from)
                                }
                            } else {
                                from = 'new'
                                // console.log('这里应该是刚新增的内容，旧逻辑，或者编辑的h5的内容')
                                this.title = this.localContent[index].title
                                this.poster = this.localContent[index].poster
                                this.formData = this.localContent[index].blockContentAttr
                                this.getFormInfo(this.$api.itemGet + '/' + this.currentModel, (name) => {
                                    for (let i in this.formData) {
                                          
                                        this.$set(this.formValue, this.formData[i].attrName)
                                        if(this.formData[i].attrName == name) {
                                            this.formValue[this.formData[i].attrName] = this.formData[i].attrValue.split(',')
                                        }
                                        else{
                                            this.formValue[this.formData[i].attrName] = this.formData[i].attrValue
                                        }
                                    }
                                })      
                            }

                            setTimeout (() => {
                                this.showImage = true
                            }, 100)
                        } else {
                            // console.log('这里是目击者视频的编辑')
                            // 目击者视频的编辑
                            this.editWitness = true
                            this.showImage = true
                            this.witnessInfo.title = this.localContent[index].title
                            this.witnessInfo.poster = this.localContent[index].poster
                            this.witnessInfo.priority = this.localContent[index].priority
                        }
                    } else {
                        // console.log('这里是没保存的目击者视频的编辑')
                        // console.log('这里要调试没保存的目击者视频的编辑')
                        // console.log(this.localContent[index])

                        this.editWitness = true
                        this.showImage = true
                        this.witnessInfo.title = this.localContent[index].title
                        this.witnessInfo.poster = this.localContent[index].poster
                        this.witnessInfo.priority = this.localContent[index].priority
                    }

                break
                case 'delete':
                    // 删除
                    this.deleteIds.push(this.localContent[index].id)
                    setTimeout(() => {
                        this.localContent.splice(index, 1)
                        for (let i = this.localContent.length - 1; i > -1 ; i --) {
                            this.localContent[i].priority = this.localContent.length - i
                        }
                    })
                break
                case 'no':
                    this.errorMessage('请先保存再移动')
                break
            }
            this.contentType = 'current'
        },
        getEditContentCopy (id, from) {
            let url
            if(from == 'old') {
                url = this.$api.contentBlockGet
            } else if(from == 'new') {
                url = this.$api.contentGet
            }

            axiosProxy.get(url + '/' + id).then(res => {
                if(res.data.errorCode == '0') {
                    // console.log('返回数据')
                    // console.log(res.data.data)
                    if(from == 'old') {
                        // console.log('old')
                        // 这里是为了已经存在的栏目内容改的
                        this.formData = res.data.data.blockContentAttr
                        // this.formData = res.data.data.attr
                        
                        // this.currentModel = res.data.data.modelId
                        // 下面这句是为了已有的栏目内容改的
                        this.currentModel = res.data.data.contentModelId + ''
                        // this.currentModel = res.data.data.contentModelId
                        this.poster = res.data.data.poster
                        this.title = res.data.data.title
                        this.spName = res.data.data.spName
                        this.publishTime = timestampToTime(res.data.data.publishTime)
                        this.publishTime = this.publishTime.slice(5, 16)
                    } else if(from == 'new') {
                        // console.log('new')
                        // console.log('新拖过来的已有数据，还没保存就编辑了')
                        // 这里是为了新拖过来的已有数据，还没保存就编辑了
                        this.currentModel = res.data.data.modelId + ''
                        // this.currentModel = res.data.data.contentModelId + ''
                        // this.formData = res.data.data.blockContentAttr
                        this.formData = res.data.data.attr
                    }
                    // console.log('怀疑这玩意又没了')
                    // console.log(this.currentModel)
                    if(this.currentModel.includes('witness')) {
                        // console.log('有witness')
                        let index = this.currentModel.indexOf('_')
                        // console.log(index)
                        this.currentModel = this.currentModel.slice(0, index)
                    } else {
                        // console.log('没有witness')
                        this.currentModel = this.currentModel
                    }
                    // console.log('处理完了的currentModel')
                    // console.log(this.currentModel)
                    this.getFormInfo(this.$api.itemGet + '/' + this.currentModel, (name) => {
                        // console.log('到这这里回调后的方法')

                        // console.log(this.formData)

                        for (let i in this.formData) {
                            // console.log('这又是啥玩意')
                            // console.log(this.formData[i])
                              
                            this.$set(this.formValue, this.formData[i].attrName)
                            if(this.formData[i].attrName == name) {
                                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue.split(',')
                            }
                            else{
                                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue
                            }

                        }
                    })
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('获取编辑内容失败')
                    }
                }
            })
        },
        getEditContent (id, from) {
            // console.log('这里还能走到么')
            let url 
            if(from == 'old') {
                // url = this.$api.contentBlockGet
                url = this.$api.contentGet
            } else if(from == 'new') {
                url = this.$api.blockContentDetail
            }
            axiosProxy.get(url + '/' + id).then(res => {
                if(res.data.errorCode == '0') {
                    // console.log(res.data.data)
                    if(from == 'old') {
                        this.formData = res.data.data.blockContentAttr
                        // this.formData = res.data.data.attr
                        // this.currentModel = res.data.data.modelId
                        this.currentModel = res.data.data.contentModelId
                        this.poster = res.data.data.poster
                        this.title = res.data.data.title
                        this.spName = res.data.data.spName
                        this.publishTime = timestampToTime(res.data.data.publishTime)
                        this.publishTime = this.publishTime.slice(5, 16)
                    } else if(from == 'new') {
                        this.currentModel = res.data.data.contentModelId + ''
                        this.formData = res.data.data.blockContentAttr
                    }
                    this.getFormInfo(this.$api.itemGet + '/' + this.currentModel, (name) => {

                        for (let i in this.formData) {

                            if(this.formData[i].attrValue.indexOf('http') >= 0) {
                                this.$set(this.imgObj, 'display_' + this.formData[i].attrName)
                                this.$set(this.imgObj, 'img' + this.formData[i].attrName)
                                this.imgObj['display_' + this.formData[i].attrName] = true
                                this.imgObj['img' + this.formData[i].attrName] = this.formData[i].attrValue

                                this.$set(this.formValue, this.formData[i].attrName)
                                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue
                            }
                              
                            this.$set(this.formValue, this.formData[i].attrName)
                            if(this.formData[i].attrName == name) {
                                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue.split(',')
                            }
                            else{
                                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue
                            }

                        }
                    })
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('获取编辑内容失败')
                    }
                }
            })
        },
        // 组合提交的参数
        getParams(originalData) {
            let param = {}
            param.id = this.params.id
            param.cmsBlockContentList = []
            for(let i in originalData) {
                let obj = {}
                if(originalData[i].blockContentAttr) {
                    // console.log('普通视频和目击者没关系')
                    // console.log('这里也一样呗，spName啥的')
                    // console.log(originalData[i])
                    obj.spName = originalData[i].spName
                    obj.publishTime = originalData[i].publishTime
                    obj.channelId = originalData[i].channelId
                    obj.contentId = originalData[i].contentId + ''
                    obj.contentModelId = originalData[i].contentModelId + ''
                    obj.priority = originalData[i].priority
                    obj.id = originalData[i].id
                    obj.title = originalData[i].title
                    if(originalData[i].blockContentAttr) {
                        if(originalData[i].blockContentAttr.length > 0) {
                            obj.blockContentAttr = originalData[i].blockContentAttr
                            for (let j in originalData[i].blockContentAttr) {
                                if(originalData[i].blockContentAttr[j].attrName == 'title') {
                                    obj.title = originalData[i].blockContentAttr[j].attrValue
                                }
                            }
                        } else {
                            obj.title = originalData[i].title
                        }
                    } else {
                        obj.title = originalData[i].title
                    }
                    obj.poster = originalData[i].poster
                    
                    // param.cmsBlockContentList.push(obj)
                } else {
                    // console.log('关联的目击者视频')
                    obj.contentId = originalData[i].id + ''
                    obj.poster = originalData[i].poster
                    obj.title = originalData[i].title
                    obj.contentModelId = 'witness'
                    obj.priority = this.maxPriority + 1
                    obj.blockContentAttr = []
                }
                param.cmsBlockContentList.push(obj)
            }
            
            return param
        },
        // 保存更改过的区块
        saveBlock () {
            let url
            let postParam = this.getParams(this.localContent)

            // console.log('这里有spName么')
            // console.log(postParam)

            for (let i in postParam.cmsBlockContentList) {
                if(postParam.cmsBlockContentList[i].channelId == 77) {
                    postParam.cmsBlockContentList[i].contentModelId = postParam.cmsBlockContentList[i].contentModelId + '_witness'
                }
            }

            if(this.deleteIds.length > 0) {
                url = this.$api.blockContentAdd + '?delBlockContentIds=' + this.deleteIds.join(',')
            } else {
                url = this.$api.blockContentAdd
            }

            axiosProxy.post(url,postParam)
                .then(res=>{
                    if(res.data.errorCode==0){
                        this.successMessage("操作成功")
                        this.getContentInfo(this.params.id)
                        this.localContent = []
                        this.deleteIds = []
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage("操作失败")
                        }
                    }
                })
            .catch(err=>{console.log(err)})
        },
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
        checkHtml(htmlStr) {
            var  reg = /<[^>]+>/g;
            return reg.test(htmlStr);
        }
    },
    
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
</style>
