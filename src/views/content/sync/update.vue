<template>
    <section class="cms-body flex">
        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
        <!-- 返回按钮 -->
        <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px" v-loading="loading">

            <el-form-item label="可用" class="flex-50" prop="enable">
                <el-radio-group v-model="info.enable">
                    <el-radio :label="true">可用</el-radio>
                    <el-radio :label="false">不可用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="匹配方式" class="flex-50" prop="rule">
                <el-radio-group v-model="info.rule">
                    <el-radio :label="1">主栏目路径</el-radio>
                    <el-radio :label="0">全路径</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="权重" class="flex-50" prop="weight">
                <el-input v-model="info.weight"></el-input>
            </el-form-item>

            <el-form-item label="栏目字段" class="flex-50" prop="channelField">
                <el-input v-model="info.channelField"></el-input>
            </el-form-item>

            <el-form-item label="接口名称" class="flex-50" prop="showName">
                <el-input v-model="info.showName"></el-input>
            </el-form-item>

            <el-form-item label="栏目" class="flex-50" prop="siteId">
                <el-input class="cms-width" :value="selectedChannel" @focus="toggleShow"></el-input> 
                <div style="width: 100%;" v-if="showInputList">
                    <div class="triangle"></div>
                    <div class="input-list">
                      <cms-tree @click="getCurrentChannel" treeType="page"></cms-tree>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="请求地址" class="flex-100" prop="url">
                <el-input v-model="info.url"></el-input>
            </el-form-item>

            <el-form-item label="请求方式" class="flex-50" prop="method">
                <el-input v-model="info.method"></el-input>
            </el-form-item>

            <!-- <el-form-item label="模型字段" class="flex-50" prop="modelField">
                <el-input v-model="info.modelField"></el-input>
            </el-form-item> -->

            <el-form-item label="参数" class="flex-100" prop="params">
                <el-input v-model="info.params"></el-input>
            </el-form-item>

            <el-form-item label="状态字段" class="flex-50" prop="status">
                <el-input v-model="info.status"></el-input>
            </el-form-item>

            <el-form-item label="模型id" class="flex-50" prop="syncModelId">
                <el-input v-model="info.syncModelId" disabled></el-input>
            </el-form-item>

            <el-form-item label="uuid" class="flex-50" prop="uuid">
                <el-input v-model="info.uuid"></el-input>
            </el-form-item>


            <!-- 动态表单 -->
            <el-form-item :label="item.showName" class="flex-50" v-for="(item, index) in formList" :key="index" :prop="item.field">

                <!-- dataType == 1 文本框 -->
                <el-input :placeholder="item.description" v-model="formValue[item.field]"></el-input>

            </el-form-item>
            <!-- 动态表单结束 -->

        <!-- 表单操作按钮 -->
        <div class="form-footer">
            <el-button type="primary" @click="update">更新</el-button>
            <el-button type="info" @click="reset">重置</el-button>
        </div>


        </el-form>
    </section>
</template>

<script>
    import listMixins from "@/mixins/list"
    import formMixins from "@/mixins/form"
    import axios from "axios"
    import va from "@/rules"
    import {axiosProxy,checkErrorCode} from "@/api/tool"
    export default {
        mixins: [listMixins, formMixins],
        data() {
            let self = this;
            let required = va.required('此项必填')
            let number = va.number('只能输入数字')
            return {
                syncContentId: null, // 同步内容id
                currentSyncModel: null, // 当前的同步模型id
                currentModelId: null, // 当前的模型id
                formList: [], // 具体的模型项
                rules: {
                    rule: [required],
                    showName: [required]
                }, // 表单验证规则
                formData: [], // 表单详情内容
                info: {
                    enable: false,
                    rule: null,
                    showName: '',
                    method: '',
                    modelField: '',
                    params: '',
                    status: '',
                    syncModelId: null,
                    url: '',
                    uuid: '',
                    weight: '',
                    channelField: '',
                    siteId: null
                }, // 原始表单参数
                formValue: {}, // 处理后的表单参数
                ue: [], // 富文本编辑器实例


                selectedChannel: null,
                showInputList: false,
                finalChannelId: null,
                currentChannelGroup: []
            }
        },
        methods: {
            // 通过同步模型id找模型id
            getModelId () {
                axiosProxy.get(this.$api.syncModel + '/' + this.currentSyncModel).then ( res => {
                    if(res.data.errorCode == '0') {
                        this.currentModelId = res.data.data.modelId
                        this.getContentDetail()
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
                    }
                }).catch( error => {
                    console.log(error)
                })
            },
            // 通过模型id找具体的模型项
            getModelItems (callback) {
                axiosProxy.get(this.$api.itemGet + '/' + this.currentModelId).then( res => {
                    this.loading = false
                    if(res.data.errorCode == '0') {
                        this.formList = this.resort(res.data.data).reverse()
                        let checkBoxName
                        for(let i in this.formList) {
                            if(this.formList[i].dataType == 7) {
                                checkBoxName = this.formList[i].field
                            }
                        }
                        callback(checkBoxName)
                    }
                    else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
                    }
                }).catch ( error => {
                    this.loading = false
                    console.log(error)
                })
            },
            // 获取同步内容详情
            getContentDetail () {
                axiosProxy.get(this.$api.syncApiDetail + '/' + this.syncContentId).then( res => {
                    if(res.data.errorCode == '0') {
                        console.log('栏目要怎么体现呢')
                        console.log(res.data.data)
                        this.formData = res.data.data.cmsSyncContentAttr
                        this.info.channelField = res.data.data.channelField
                        this.info.enable = res.data.data.enable
                        this.info.method = res.data.data.method
                        // this.info.modelField = res.data.data.modelField
                        this.info.params = res.data.data.params
                        this.info.rule = res.data.data.rule
                        this.info.showName = res.data.data.showName
                        this.info.status = res.data.data.status
                        // this.info.syncModelId = res.data.data.syncModelId
                        this.info.syncModelId = res.data.data.modelId
                        this.info.url = res.data.data.url
                        this.info.uuid = res.data.data.uuid
                        this.info.weight = res.data.data.weight
                        this.info.id = res.data.data.id

                        let channel_id = res.data.data.channelId
                        if(channel_id !== null && channel_id !== '' && channel_id !== undefined) {
                            this.getChannel(channel_id)
                        }

                        this.getModelItems ((checkBoxName) => {
                            for (let i in this.formData) {
                                this.$set(this.formValue, this.formData[i].contentAttrName)
                                this.formValue[this.formData[i].contentAttrName] = this.formData[i].syncAttrName
                            }
                        })
                    }
                    else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
                    }
                }).catch( error => {
                    console.log(error)
                })
            },
            // 表单元素重新排序
            resort (array) {
                for(let i = 0; i < array.length - 1; i++){
                    for(let j = 0; j < array.length - 1 - i; j++){
                        if(array[j].priority > array[j+1].priority){
                            var temp = array[j];
                            array[j] = array[j+1];
                            array[j+1] = temp;
                        }
                    }
                }
                return array
            },
            getUrl (imageUrl, index, imagePath, storageId) {
                this.formValue[index] = imageUrl
                this.storageId = storageId
                this.poster = imagePath
            },
            //获取ue实例
            getUeditor(ue, index) {
                this.ue[index] = ue;
            },
            // 富文本编辑器相关，具体干啥的还不知道
            getDocTxt(txt,index){
                this.ue[index].execCommand('inserthtml',txt);
            },
            getEditorContent(i) {
                this.formValue[i] = this.ue[i].getContent()
            },
            getParams() {
                //获取到处理完成给后台提交的对象
                let params = {}; //数组对象换成字符串
                let sendAttr = []

                for (let key in this.formValue) {
                    params.attrObj = {}

                    if(this.formValue[key] != undefined) {
                        params.attrObj['contentAttrName'] = key
                        if (this.formValue[key] instanceof Array) {
                            params.attrObj['syncAttrName'] = this.formValue[key].join(',')
                        } else {
                            params.attrObj['syncAttrName'] = this.formValue[key]
                        }

                        sendAttr.push(params.attrObj)
                        params.cmsSyncContentAttr = sendAttr
                    }
                }

                delete params.attrObj

                params.enable = this.info.enable
                params.method = this.info.method
                // params.modelField = this.info.modelField
                params.params = this.info.params
                params.channelId = this.finalChannelId
                params.rule = this.info.rule
                params.showName = this.info.showName
                params.status = this.info.status
                params.modelId = parseInt(this.currentSyncModel)
                // params.syncModelId = parseInt(this.currentSyncModel)
                params.url = this.info.url
                params.uuid = this.info.uuid
                params.weight = this.info.weight + ''
                if(this.info.weight == 'null' || this.info.weight == 'undefined' || this.info.weight == '') {
                    params.weight = ''
                } else {
                    params.weight = this.info.weight + ''
                }
                params.channelField = this.info.channelField
                params.id = this.info.id

                return params;
            },
            // 点击提交更新按钮
            update () {
                let params = this.getParams()
                this.saves(params)
            },
            saves (params) {
                let url = this.$api.syncApiUpdate
                let backUrl = '/sync/api'
                axiosProxy.put(url, params).then(res => {
                    if(res.data.errorCode == '0') {
                        this.successMessage('操作成功')
                        setTimeout(() => {
                            this.routerLink(backUrl)
                        }, 1000)
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                })
            },
            reset () {
                this.resetDataInfo(this.formValue)
            },
            back(){
                this.routerLink('/sync/api')
            },//返回方法
            toggleShow () {
                if(this.showInputList == false) {
                    this.showInputList = true
                } else {
                    this.showInputList = false
                }
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
                });
            },
            // 点击栏目获取当前点击的栏目
            getCurrentChannel (data, node) {
                if(node.parent.data != undefined) {
                    this.selectedChannel = data.name
                    if(node.parent.parent.data != undefined) {
                        this.selectedChannel =  node.parent.data.name + ',' + data.name
                        if(node.parent.parent.parent.data != undefined) {
                            this.selectedChannel = node.parent.parent.data.name + ',' + node.parent.data.name + ',' + data.name
                        } 
                    } 
                } 

                this.finalChannelId = data.id
                this.showInputList = false
            },
        },
        mounted() {
            this.syncContentId = this.$route.query.id
            this.currentSyncModel = this.$route.query.syncModelId
            this.currentModelId = this.$route.query.modelId
            this.getContentDetail()
            this.$store.dispatch("setCollapse", true); //收缩状态栏
        }
    }
</script>

<style lang="scss">
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