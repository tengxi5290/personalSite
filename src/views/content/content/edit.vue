<template>
  <section class="cms-body flex" >
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
    <cms-tree @change="getChannelId" treeType="page"></cms-tree>
    <div class="cms-content-right">  
      <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px" v-loading="loading">      
        <!-- 栏目 -->
        <el-form-item label="选择栏目" class="flex-50"  prop="parentId"  >
          <el-input class="cms-width" :value="selectedChannel" @focus="toggleShow"></el-input> 
          <div style="width: 100%;" v-if="showInputList">
            <div class="triangle"></div>

            <div class="input-list">
              <cms-tree @click="getCurrentChannel" treeType="page"></cms-tree>
            </div>
          </div>  
        </el-form-item> 

          <!--关联副栏目  -->
          <el-form-item label="关联副栏目" class="flex-50"  >
            <el-button @click="channelVisble=true">关联副栏目</el-button>
          </el-form-item> 



          <!-- 模型弹窗 -->
          <el-dialog class="dialog" title="选择副栏目" :visible.sync="channelVisble" width="30%"> 
            <div class="tree-layout">
              <div class="tree" v-if="showSubTree">
                <el-tree :props="props" :load="ansyTree" ref="channelTree" lazy :indent='16' node-key="id" 
                  :default-expanded-keys="['']"
                  :default-checked-keys="info.channelIds"
                  v-if="refash"
                  :check-strictly="strict"
                  show-checkbox
                  @check-change="checkChange"
                  >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="node.label">{{ node.label }} {{data.id}}</span>
                  </span> 
                </el-tree>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="channelVisble = false">取消</el-button>
              <el-button type="primary" @click="chooseSubChannel">选择</el-button>
            </span>
          </el-dialog> 

          <el-form-item label="uuid" class="flex-100">
            <el-input placeholder="uuid" v-model="info.uuid" disabled></el-input>
          </el-form-item>


          <!-- 动态渲染表单   -->

          <el-form-item :label="item.showName" :class="item.single? 'flex-100': 'flex-50'" v-for="(item, index) in formList" :key="index" :prop="item.field">

            <!-- dataType == 1 文本框 -->
            <div v-if="item.field == 'spName'">
                <el-input placeholder="sp名称" v-model="spName"></el-input>
            </div>
            <div v-else>
                <el-input :placeholder="item.description" v-if="item.dataType == 1 && item.field == 'title'" v-model="title"></el-input>
                <el-input :placeholder="item.description" v-if="item.dataType == 1 && item.field !== 'title'" v-model="formValue[item.field]"></el-input>
            </div>

            <!-- dataType == 2 自定义的整形 -->
            <el-input :placeholder="item.description" v-if="item.dataType == 2" v-model="formValue[item.field]" @blur="getLiveNum(item)"></el-input>

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
            <!-- <el-date-picker
              v-model="formValue[item.field]"
              type="date"
              v-if="item.dataType == 5"
              placeholder="选择日期">
            </el-date-picker> -->
            <el-input placeholder="选择日期" v-if="item.dataType == 5 && item.field != 'publishTime'" v-model="formValue[item.field]" disabled></el-input>
            <el-input placeholder="选择日期" v-if="item.dataType == 5 && item.field == 'publishTime'" v-model="publishTime" disabled></el-input>

            <!-- dataType == 7 多选框 -->
            <el-checkbox-group v-if="item.dataType == 7" v-model="formValue[item.field]">
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
            <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && showImage && item.field == 'poster'" :default="poster"></uploader>
            <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && showImage && item.field !== 'poster'" :default="formValue[item.field]"></uploader>

            <!-- dataType == 11 富文本 -->
            <cms-editor :defaultMsg="formValue[item.field]" :index="item.field" @ready="getUeditor" v-if="item.dataType == 11"></cms-editor>

          </el-form-item>

          <!-- 动态渲染表单结束 -->   
            
            
  
              

          <div class="form-footer">  
            <el-button  type="primary"  @click="update(false)" v-perms="'/content/update'" v-if="updateButtonEnable">修改</el-button>
            <el-button  type="primary" disabled v-else>修改</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </div>

        </el-form>
      </div>
    </section>
</template>
<script>
import formMixins from "@/mixins/form";
import axios from "axios";
import {axiosProxy, checkErrorCode, timestampToTime, isNull} from "@/api/tool"
import va from "@/rules";
export default {
  mixins: [formMixins],
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let string = va.string('只能输入英文字母');
    return {
      strict: true,
      createUserId: null,
      contentId: null,
      formList: [], // 表单内容类型
      formValue: { 
        
      },
      title: '',
      spName: '',
      value1: '',
      info: {
        modelId: null,
      },
      value: '',
      formData: [],
      params: this.$route.query, //前一个页面带过来的数据
      rules: {
        parentId:[required],
        typeId:[required,number]
      },
      publishTime: '',
      parentId:'',
      dataState: false,
      isLink:false,//是否开启外部链接
      hasContentImg:false,
      hasTitleImg:false,
      channelList: [], //栏目列表
      itemList: [], //动态列表
      topicList: [], //专题列表
      typeList: [], //内容类型列表
      groupList: [], //用户组列表
      workflowList: [], //工作流
      tplAll:[],//所有模型
      chargeMap:[],
      contentInfo:{},
      isTypeImg:false,
      refash:true,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      channelVisble:false,
      selectedChannel: null,
      showInputList: false,
      currentChannelGroup: [],
      ue: [],
      ues: '',
      picturePath: null,
      chosenSubChannelList: [],
      chosenSubChannelArray: [],
      storageId: null,
      poster: '',
      showImage: true,
      showSubTree: true
    };
  },
  methods: {
    putLiveNum (uuid, baseNum, addNum) {
      if(isNull(baseNum) || baseNum == undefined) {
        this.errorMessage('请输入正整数')
        return false
      }
      if(isNull(addNum) || addNum == undefined) {
        this.errorMessage('请输入正整数')
        return false
      }
      let url = this.$api.contentLiveNum + '?liveId=' + uuid + '&baseNum=' + baseNum + '&addNum=' + addNum
      axiosProxy.put(url).then( res => {
        if(res.data.errorCode == 0) {
          
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
    getLiveNum (item) {

      if(item.field == 'addNum' || item.field == 'baseNum') {
        this.putLiveNum(this.info.uuid, this.formValue.baseNum, this.formValue.addNum)
      }
    },
    getUrl (imageUrl, index, imagePath, storageId) {
      this.formValue[index] = imageUrl
      this.storageId = storageId
      this.poster = imagePath
    },
    ansyTree(node, resolve) {
      //异步加载树形结构
      if (node.level === 0) {

        return resolve([
        {
          name: "根目录",
          id: '-1'
        }
        ]);

      }

      if(node.level == 1) {
        this.getTreeNodes(node, resolve, 0)  
      }
      if (node.level > 1) {
        this.getTreeNodes(node, resolve, node.data.id)  
      }
    },
    getTreeNodes (node, resolve, id) {
        let api=this.$api;
        this.rotating=true;
        axiosProxy.get(api.contentChannel + '/' + id).then(res => {
          this.rotating=false;
          if(res.data.errorCode == '0') {
            const data = [];
            for (let i in res.data.data) {
              let obj = {};
              obj.id = res.data.data[i].id;
              obj.isChild = !res.data.data[i].haveChildren;
              obj.name = res.data.data[i].name;
              obj.data=res.data.data;
              data.push(obj);
            }
            return resolve(data);
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
          }
        }).catch(error=>{ this.rotating=false;});
    },
    checkChange(node, checkStatus, childStatus){//副栏目选择
      this.info.channelIds=this.$refs["channelTree"].getCheckedKeys();//获取副栏目
    },
    //获取ue实例
    getUeditor(ue, index) {
      this.ue[index] = ue;
    },
    // 副栏目的选择按钮
    chooseSubChannel () {
      this.channelVisble = false
      if(this.info.channelIds.indexOf('-1') >= 0) {
        this.info.channelIds.splice(0, 1)
      } 
    },
    // 富文本编辑器相关，具体干啥的还不知道
    getDocTxt(txt,index){
      this.ue[index].execCommand('inserthtml',txt);
    },
    getEditorContent(i) {
      this.formValue[i] = this.ue[i].getContent()
    },
    // 重置表单
    reset() {
      this.showImage = false
      this.showSubTree = false
      setTimeout (() => {
        this.showImage = true
        this.showSubTree = true
      }, 100)
      this.resetDataInfo(this.formValue)
      this.info.channelIds = []
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
    getChannelId(data, node) {
      this.routerLink("/content/list", "list", data.id);
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

      window.localStorage.setItem('channelShowList', this.selectedChannel)
      window.localStorage.setItem('chosenId', this.finalChannelId)
    },
    // 选择栏目的下拉框是否出现
    toggleShow () {
      if(this.showInputList == false) {
        this.showInputList = true
      } else {
        this.showInputList = false
      }
    },
    // 回退到上一级
    back(){
      window.close()
      // this.routerLink('/content/list','list',this.parentId); 
    },  
    getContentInfo(callback){
      let id = this.modelId
      axiosProxy.get(this.$api.itemGet+ '/' + id).then(res => {
        this.loading = false
        if(res.data.errorCode == '0') {
          this.formList = this.resort(res.data.data).reverse()
          let checkBoxName
          for(let i in this.formList) {
            if(this.formList[i].dataType == 7) {
              checkBoxName = this.formList[i].field
            }

            if(this.formList[i].showName == '图片展示类型') {
              this.formList[i].optValue = "自定义风格, 三图"
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
              this.rules[this.formList[i].field] = array
            }
          }
          callback(checkBoxName)
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
        }
      });
    },
    // 获取这条内容的详情，主要是获得modelid
    getDataInfo() {
      let id = this.contentId
      axiosProxy.get(this.$api.contentGet + '/' + id).then(res => {
        this.loading = false
        if(res.data.errorCode == '0') {
          this.publishTime = timestampToTime(res.data.data.publishTime)
          this.publishTime = this.publishTime.slice(5, 16)
          this.modelId = res.data.data.modelId
          this.title = res.data.data.title
          this.spName = res.data.data.spName
          this.formData = res.data.data.attr
          this.createUserId = res.data.data.createUserId
          this.storageId = res.data.data.storageId
          this.poster = res.data.data.poster

          this.chosenSubChannelArray = res.data.data.channelIds
          this.info.channelIds = res.data.data.channelIds
          this.info.topLevel = res.data.data.topLevel
          this.info.uuid = res.data.data.uuid

          let channel_id = res.data.data.channelId
          window.localStorage.setItem('chosenId', channel_id)
          this.getChannel(channel_id)

          this.getContentInfo( (checkBoxName) => {

            for (let i in this.formData) {

              if(this.formData[i].attrName == '图片展示类型') {
                if(this.formData[i].attrValue == '0') {
                  this.formData[i].attrValue = '自定义风格'
                } else if (this.formData[i].attrValue == '1') {
                  this.formData[i].attrValue = '三图'
                }
              }

              this.$set(this.formValue, this.formData[i].attrName)
              if(this.formData[i].attrName == checkBoxName) {
                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue.split(',')
              } else {
                this.formValue[this.formData[i].attrName] = this.formData[i].attrValue
              }
            }

          })
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
        }
      });
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
    getParams(){
      let params = {}
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

          sendAttr.push(params.attrObj)
          params.attr = sendAttr
        }

      }

      delete params.attrObj

      params.channelId = parseInt(window.localStorage.getItem('chosenId'))
      params.modelId = this.modelId
      params.storageId = this.storageId
      params.parentId = this.info.parentId

      params.poster = this.poster
      params.siteId = 1
      params.status = 0
      params.topLevel = this.info.topLevel
      params.weight = 0
      params.title = this.title
      params.channelIds = this.info.channelIds
      params.createUserId = this.createUserId
      params.id = this.contentId

      return params;
    },
    //修改栏目
    update(state){  
      for (let i = 0; i < this.formList.length; i++) {
        if(this.formList[i].dataType == 11) {
          this.getEditorContent(this.formList[i].field)
        }

        if(this.formList[i].isRequire) {
          if(this.formList[i].field !== 'title' && this.formList[i].field !== 'publishTime' && this.formList[i].field !== 'spName') {
            if(this.formValue[this.formList[i].field] == undefined || this.formValue[this.formList[i].field] == '') {
              this.errorMessage('请补全' + this.formList[i].showName)
              return false
            }
          }
        }
      }

      let params = this.getParams();
      if (isNaN(params.channelId)) {
        this.errorMessage("请选择一个栏目");
        return false;
      }
      
      for (let i in params.attr) {
        if(params.attr[i].attrValue == ' 三图') {
          params.attr[i].attrValue = '1'
        } else if(params.attr[i].attrValue == '自定义风格') {
          params.attr[i].attrValue = '0'
        }
      }
      this.saves(state, params)
    },
    saves (state, params) {
      let url = this.$api.contentUpdate
      let backUrl = '/content/list'
      let form = this.$refs['form'];
      axiosProxy.put(url, params).then (res => {
        if(res.data.errorCode == '0') {
          this.successMessage('操作成功')
          setTimeout (() => {
            window.close()
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
  },
  created() {
    //初始获取数据
    this.$store.dispatch("setCollapse", true)
    this.contentId = parseInt(this.params.id)
    this.getDataInfo()
    let siteId = window.localStorage.getItem('_site_id_param')
    if(this.contentId == 1 && siteId == 1) {
      this.updateButtonEnable = false
    } else {
      this.updateButtonEnable = true
    }
  },
  mounted(){
    this.finalChannelId = window.localStorage.getItem('chosenId')
  }
};
</script>

<style scss scoped>
.w40p{
  width: 35% !important;
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
  display: inline-block;
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 6px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
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
</style>