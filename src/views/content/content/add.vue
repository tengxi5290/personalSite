<template>
  <section class="cms-body flex tree-bottom" >
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
    <cms-tree @change="getChannelId" treeType="page"></cms-tree>
    <div class="cms-content-right">
      <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px" v-loading="loading">        
        <!-- 动态表单 -->
        <!-- 栏目 -->
        <el-form-item label="选择栏目" class="flex-50"  prop="parentId" >
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
        <el-dialog class="dialog" title="选择副栏目" :visible.sync="channelVisble" width="30%" > 
          <div class="tree-layout">
            <div class="tree" v-if="showSubTree">
              <cms-tree @change="getChosenChannel" treeType="component"></cms-tree>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="channelVisble = false">取消</el-button>
            <el-button type="primary" @click="chooseSubChannel">选择</el-button>
          </span>
        </el-dialog>  


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
          <el-input :placeholder="item.description" type="number" v-if="item.dataType == 2" v-model="formValue[item.field]"></el-input>

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

          <!-- dataType == 5 日期 -->
          <el-date-picker
            v-model="formValue[item.field]"
            type="date"
            v-if="item.dataType == 5"
            placeholder="选择日期">
          </el-date-picker>

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
          <uploader @change="getUrl" :index="item.field" v-if="item.dataType == 10 && showImage"></uploader>

          <!-- dataType == 11 富文本 -->
          <cms-editor :defaultMsg="formValue[item.field]" :index="item.field" @ready="getUeditor" v-if="item.dataType == 11"></cms-editor>    

        </el-form-item>


        <!-- 动态渲染表单结束 -->




        <!-- 表单操作按钮 -->
        <div class="form-footer">
          <el-button v-if="this.id==0" type="warning" @click="add(true)" v-perms="'/content/save'">提交并继续添加</el-button>
          <el-button v-if="this.id==0" type="primary"  @click="add(false)" v-perms="'/content/save'">提交</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>
<script>
  import formMixins from "@/mixins/form";
  import axios from "axios";
  import {axiosProxy,checkErrorCode} from "@/api/tool"
  import va from "@/rules";
  export default {
    mixins: [formMixins],
    data() {
      let self = this;
      let required = va.required("此项必填");
      let number = va.number("只能输入数字");
      let string = va.string("只能输入英文字母");
      return {
      formList: [], // 表单内容类型
      formValue: {

      },
      title: '',
      cookie: true,
      info: {
        modelId: null,
      },
      storageId: null,
      value: '',
      params: this.$route.query, //前一个页面带过来的数据
      rules: {
        parentId: [required],
        typeId: [required, number]
      },
      channelList: [], //栏目列表
      itemList: [], //动态列表
      topicList: [], //专题列表
      typeList: [], //内容类型列表
      groupList: [], //用户组列表
      workflowList: [], //工作流
      chargeMap: [],
      tplAll: [], //所有模型
      isTypeImg: false,
      selectId: 0,
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      spName: '',
      channelVisble: false, //选择模型模版弹窗
      showInputList: false,
      selectedChannel: null,
      showChildList: false,
      childrenList:[],
      showGrandList: false,
      grandList: [],
      chosenList: [],
      finalChannelId: null,
      chosenSubChannelList: [],
      chosenSubChannelArray:[],
      currentLevel: '',
      storageEnable: 1,
      postAttrs: [],
      ue: [],
      checkList:[],
      poster: '',
      showImage: true,
      showSubTree: true
    };
  },
  methods: {
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
    // 获取选择好了的副栏目
    getChosenChannel (data) {
      this.chosenSubChannelList = data.checkedNodes
      for(let i = 0; i < this.chosenSubChannelList.length; i++) {
        this.chosenSubChannelArray.push(this.chosenSubChannelList[i].id)
      }
    },
    // 副栏目的选择按钮
    chooseSubChannel () {
      this.channelVisble = false
      this.info.channelIds = this.chosenSubChannelArray
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
    // 获取栏木树信息
    getChannelTree (id) {
      let api=this.$api;
      this.rotating=true;
      axiosProxy.get(api.contentTree + '/' + id).then(res => {
        if(res.data.errorCode == '0') {
          let treeData = res.data.data
          this.options2 = res.data.data
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
        }
      }).catch(error=>{ this.rotating=false;});
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
    },
    // 回退到上一级
    back(){
      this.routerLink('/content/list','list',this.params.parentId); 
    }, 
    // 获取左侧树点击时的栏目id
    getChannelId(data, node) {
      this.routerLink("/content/list", "list", data.id);
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
    getDataInfo() {
      //先获取模型id
      this.loading = true;
      let modelId = this.info.modelId

      axiosProxy.get(this.$api.itemGet + '/' + modelId).then (res => {
        this.loading = false
        if(res.data.errorCode == '0') {
          this.formList = this.resort(res.data.data).reverse()
          for(let i in this.formList) {
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

            this.$set(this.formValue, this.formList[i].field)
            if(this.formList[i].dataType == 7) {
              this.formValue[this.formList[i].field] = this.formList[i].defValue.split(',')
            } else {
              this.formValue[this.formList[i].field] = this.formList[i].defValue
            }
          }
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
        }
      }).catch (error =>{
        console.log(error)
        this.loading = false
      })
    },  
    // 处理表单数据格式
    getFormData () {
      let data = this.formList
    },
    // 获取栏目列表
    getChannelList (id) {
      let api=this.$api;
      axiosProxy.get(api.contentTree + '/' + id).then(res => {
        if(res.data.errorCode == '0') {
          this.rotating=false;
          const data = [];
          this.channelList = res.data.data
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
        }
      }).catch(error=>{ this.rotating=false;});
    },
    getParams() {
      //获取到处理完成给后台提交的对象
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

          sendAttr.push(params.attrObj)
          params.attr = sendAttr
        }
      }

      delete params.attrObj

      params.channelId = parseInt(this.finalChannelId)
      params.modelId = this.info.modelId
      params.storageId = this.storageId
      params.parentId = this.info.parentId
      params.poster = this.poster
      params.spName = this.spName
      params.title = this.title
      params.siteId = 1
      params.status = 0
      params.topLevel = 0
      params.weight = 0
      params.channelIds = this.info.channelIds

      return params;
    },
    saves (state, params) {
      let url = this.$api.contentSave
      let backUrl = '/content/list'
      let form = this.$refs['form'];
      axiosProxy.post(url, params).then(res => {
        if(res.data.errorCode == '0') {
          this.successMessage('添加成功')
          if(state) {
            this.reset()
          } else {
            setTimeout(() => {
              this.routerLink(backUrl)
            }, 1000)
          }
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('添加失败')
          }
        }
      })
    },
    add(state,views) {
      for (let i = 0; i < this.formList.length; i++) {
        if(this.formList[i].dataType == 11) {
          this.getEditorContent(this.formList[i].field)
        }

        if(this.formList[i].field == 'title') {
         this.formValue[this.formList[i].field] = this.title
        }

        if(this.formList[i].field == 'poster') {
          this.formValue[this.formList[i].field] = this.poster
        }

        if(this.formList[i].field == 'spName') {
          this.formValue[this.formList[i].field] = this.spName
        }

        if(this.formList[i].isRequire) {
          if(this.formValue[this.formList[i].field] == undefined || this.formValue[this.formList[i].field] == '') {
            this.errorMessage('请补全' + this.formList[i].showName)
            return false
          }
        }
      }

      let params = this.getParams();
      if (isNaN(params.channelId)) {
        this.errorMessage("请选择一个栏目");
        return false;
      }
      this.saves(state, params)
    }
  },
  //初始获取数据
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.info.modelId = parseInt(this.params.modelId);
    this.getDataInfo();
    this.getChannelTree(0);
  },
  mounted() {
    this.selectedChannel = window.localStorage.getItem('channelShowList')
    this.finalChannelId = window.localStorage.getItem('chosenId')
    let clientHeight = document.body.clientHeight;
    $(".cms-body").css("minHeight", clientHeight - 110 + "px");
  }
};
</script>

<style scss scoped>
.w40p {
  width: 35% !important;
}
.content-inner-box{
  width: 400px;
  position: relative;
  left: -145px;
}
.inner-label{
  display: inline-block;
  text-align: right;
  width: 95px;
  margin-right: 22px;
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