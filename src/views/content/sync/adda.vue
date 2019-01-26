<template>
    <section class="cms-body flex">
        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
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
            <el-button type="primary" @click="add">提交</el-button>
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
                currentSyncModel: null, // 当前的同步模型id
                formList: [], // 具体的模型项
                rules: {
                    rule: [required],
                    showName: [required]
                }, // 表单验证规则
                info: {
                    enable: false,
                    rule: 0,
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
                    siteId: null,
                }, // 原始表单参数
                formValue: {}, // 处理后的表单参数
                ue: [], // 富文本编辑器实例


                selectedChannel: null,
                showInputList: false,
                finalChannelId: null
            }
        },
        methods: {
            // 回退到上一页
            back() {
               history.go(-1)
            },
            // 依据模型id获取模型项详情
            getModelItem () {
                axiosProxy.get(this.$api.itemGet + '/' + this.currentSyncModel).then( res => {
                    this.loading = false
                    if(res.data.errorCode == '0') {
                        this.formList = this.resort(res.data.data).reverse()
                        for(let i in this.formList) {
                            this.$set(this.formValue, this.formList[i].field)
                            this.formValue[this.formList[i].field] = this.formList[i].field
                        }
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                    }
                }).catch( error => {
                    this.loading = false
                    console.log(error)
                })
            },
            // 表单元素重新排序
            resort (array) {
                for(let i=0;i<array.length-1;i++){
                    for(let j=0;j<array.length-1-i;j++){
                        if(array[j].priority>array[j+1].priority){
                            var temp=array[j];
                            array[j]=array[j+1];
                            array[j+1]=temp;
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
                params.channelId = this.finalChannelId
                params.method = this.info.method
                // params.modelField = this.info.modelField
                params.params = this.info.params
                params.showName = this.info.showName
                params.status = this.info.status
                params.rule = this.info.rule
                // params.syncModelId = parseInt(this.currentSyncModel)
                params.modelId = parseInt(this.currentSyncModel)
                params.url = this.info.url
                params.uuid = this.info.uuid
                params.weight = this.info.weight.toString()
                params.channelField = this.info.channelField

                return params;
            },
            reset () {
                this.resetDataInfo(this.formValue)
            },
            add() {
                let params = this.getParams();
                console.log('提交参数')
                console.log(params)
                if(this.info.showName == null || this.info.showName == '' || this.info.showName == undefined) {
                    this.errorMessage('请补全接口名称')
                } else {
                    this.saves(params)
                }
            },
            saves (params) {
                let url = this.$api.syncApi
                let backUrl = '/sync/api'
                axiosProxy.post(url, params).then(res => {
                    if(res.data.errorCode == '0') {
                        this.successMessage('添加成功')
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
            // 选择栏目的下拉框是否出现
            toggleShow () {
                if(this.showInputList == false) {
                    this.showInputList = true
                } else {
                    this.showInputList = false
                }
            },
            // 点击栏目获取当前点击的栏目
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
                // window.localStorage.setItem('channelShowList', this.selectedChannel)
                // window.localStorage.setItem('chosenId', this.finalChannelId)
            },
        },
        created() {
            this.currentSyncModel = this.$route.query.id
            this.info.syncModelId = this.$route.query.id
            this.currentModel = this.$route.query.modelId
            this.getModelItem()
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