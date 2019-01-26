<template>
 <section class="cms-body flex">
        <!-- 返回组件 -->
        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
          <cms-tree @click="getChannelId" treeType="page" :copy="true" :defaultOpen="[16,18]"></cms-tree> 
        <div class="cms-content-right">   
        
          <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px">
              <el-form-item label="上级栏目" class="flex-50"  prop="parentId"  v-loading="loading">
                  
                  <el-input class="cms-width" :value="selectedChannel" @focus="toggleShow" readonly></el-input> 
                  <div style="width: 100%;" v-if="showInputList">
                      <div class="triangle"></div>

                      <div class="input-list">
                          <cms-tree @click="getCurrentChannel" treeType="page"></cms-tree>
                      </div>
                  </div>
    
              </el-form-item>       
              
              <el-form-item label="栏目名称" class="flex-50"  prop="name">
                  <el-input v-model="info.name" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="访问路径" class="flex-50"  prop="uri">
                    <el-input v-model="info.uri" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="是否可用" class="flex-50"  prop="enable">
                    <el-radio v-model="info.enable" :label="true">是</el-radio>
                    <el-radio v-model="info.enable" :label="false">否</el-radio>
              </el-form-item>
              <el-form-item label="meta标题" class="flex-50"  prop="metaTitle">
                    <el-input v-model="info.metaTitle" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="meta关键字" class="flex-50"  prop="metaKeyword">
                    <el-input v-model="info.metaKeyword" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="meta描述" class="flex-100"  prop="metaDesc">
                    <el-input v-model="info.metaDesc" type="textarea" class="cms-width"></el-input>
              </el-form-item> 
            <!-- 动态表单 -->
                
          <!-- 动态表单 -->
              <div class="form-footer">
                <el-button  type="warning" @click="add(true)"
                      v-perms="'/channel/save'"
                  >提交并继续添加</el-button>
                  <el-button  type="primary"  @click="add(false)"
                      v-perms="'/channel/save'"
                  >提交</el-button>
                  <el-button type="info" @click="$reset">重置</el-button>
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
    let required = va.required();
    let number = va.number();
    let string = va.string();
    let channelPath= va.channelPath('栏目路径不能重复','');
    return {
      /**
       * parentId
       * modelId
       * https
       * hasCollect
       */
      params: this.$route.query, //前一个页面带过来的数据
      rules: {
        //校验规则
        name: [required],
        enable: [required],
        metaTitle: [required],
        uri: [required],

        path:[required,channelPath,string],
        // parentId: [required],
        // modelId: [required,number],
        priority:[required,number],
        display: [required],
      },
      fieldRequied:[
        { required: true,
          validator: (rule, value, callback) => {
          let reg=/^\s*$/g;
          if(reg.test(value)){
            callback(new Error('此项必填'));
          } else {
            callback();
        }
        },
        message: '此项必填', trigger: 'change' }
      ],
      dataState: false,
      channelList: [{ hasChild: true, id: "", name: "根栏目" } ], //栏目列表
      itemList: [], //动态列表
      modelList: [], //模型列表
      tplList: [], //栏目模版列表
      groupList: [], //用户组列表

      tplAll:[],//所有模型

      info: {
        name:'',//名称
        uri:'',//路径
        enable:true,//是否可用
        metaTitle:'',//meta标题
        metaKeyword:'',//meta关键字
        metaDesc:'',//mate描述
        parentId: "", //上层栏目id
      },
      parentChannel: null,
      tplContentVisbile:false,//选择模型模版弹窗
      ue:[],
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
    };
  },
  methods: {
    back(){
      this.routerLink('/channel/list','list',this.params.parentId); 
    },
    getChannelId(data, node){
      if(node.isLeaf){
          this.routerLink('/channel/update','update',data.id,); 
      }else if(data.id==-1){
        this.routerLink('list')
      }else{
          this.breadState=true;//在新建按钮旁边,显示当前栏目的路径
          this.routerLink('/channel/list','',data.id)
      }
    },  
    getPath(event){
        if(event.target.value!=''){
            axios.post(this.$api.channelCreatPath,{name:event.target.value}).then(res=>{
                this.info.path=res.body;
            }) 
        }
    },
    getMediaPath(path,field){//动态媒体路径
      
        this.info[field]=path;//媒体路径   
    },
    getUeditor(ue,index){
        this.ue[index]=ue;//获取ue实例 
    },
    getFieldImg(path,field,index,pindex){
      this.info[field]=path;
    },
    getTitleImg(path){
      this.info.titleImg=path;
    },
    getContentImg(path){
        this.info.contentImg=path;
    },
    getDataInfo(id) {
      this.loading = false;
      //先获取模型id
      let modelParams = {
        modelId: this.params.modelId,
        isChannel: true
      };
      axios.post(this.$api.itemList,modelParams)
        .then(res => {
          this.loading=false;
          this.$refs["form"].resetFields();
          this.info.titleImg='';//滞空处理
          this.info.contentImg='';//滞空处理
          let itemList = res.body;//渲染数据字段模型 
          for (let i in itemList) {
                if (itemList[i].custom) {
                  //判断是否是系统字段
                  if (itemList[i].dataType == 7) {
                    //判断是否为多选框
                    this.$set(this.info,"attr_" + itemList[i].field,itemList[i].defValue.split(",")); //转换为数组
                  } else {
                    this.$set(this.info, "attr_" + itemList[i].field, itemList[i].defValue);
                  }
                } else {
                    if (itemList[i].dataType == 7){
                          this.$set(this.info, itemList[i].field,itemList[i].defValue.split(","));
                    }else{
                        this.$set(this.info, itemList[i].field,itemList[i].defValue);
                    }     
                  }
            } 
               
         this.getAllList();//获取辅助字段列表
         this.getDefaultInfo(this.params.id);//数据回填
         this.itemList = itemList;
         
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getDefaultInfo(id){//数据回填
        if(id==0){
              this.info.display=true;
              this.info.allowShare=true;
              this.info.allowScore=true;
              this.info.allowUpdown=true;
              this.info.commentControl=3;
              this.info.pageSize=20;
              this.info.priority=10;          
        }else{

        }
    },
    getAllList() {
      //所有辅助请求
      this.loading=false;
      // let url=this.$api.channelList+'/'+
      // axiosProxy.get

    },
    getEditorContent(){//处理一下栏目的富文本内容,固定只有四个
       if(this.info.txt!=undefined){
           this.info.txt=this.ue[0].getContent();
       }
        if(this.info.txt1!=undefined){
           this.info.txt1=this.ue[1].getContent();  
       }
        if(this.info.txt2!=undefined){
        this.info.txt2=this.ue[2].getContent();  
       }
        if(this.info.txt3!=undefined){
         this.info.txt3=this.ue[3].getContent();   
       }  
   
    },
    getParams(){//获取到处理完成给后台提交的对象
          let params={} //数组对象换成字符串
          let modeArr=[];
          let mtpls=[];
          let tpls=[];
        //this.getEditorContent(); 
        for (let key in this.info) {
            params[key] = this.info[key];
        }
        params.parentId=params.parentId[0];
        return params;

    },
    add(state){//添加栏目  
          let form = this.$refs['form'];
          
          form.validate((valid)=>{
            if(valid){
              this.loading=false;
              let params=this.getParams();
              let url=this.$api.channel//这里的url需要改
              let parentId=localStorage.getItem('chosenId');//选中栏目当做是其父级,这里选中之后将其id作为新建的parentid
              if(parentId==-1){//选中根目录后,将其parentid幅值为null
                parentId=null
              }
              params.parentId=parentId

              axiosProxy.post(url,params)
                .then(res=>{
                  if(res.data.errorCode=='0'){
                    this.successMessage('操作成功')

                    if(state){//两个提交按钮,一个是提交并继续提交,一个只是提交,根据传来的state的不同分别进行
                      location.reload()
                    }else{
                      setTimeout(() => {
                        this.back();
                        }, 1000);
                    }
                  }
                  else {
                    if(res.data.errorMessage) {
                      this.errorMessage(res.data.errorMessage)
                    } else {
                      this.errorMessage('操作失败')
                    }
                  }
                })
                .catch(err=>{console.log(err)})
            }else{
              return false;
            }
          })
    },

    //上级栏目选择函数
    getCurrentChannel (data, node) {
        console.log('父组件中的获取当前选中的channel')
        if(node.parent.data==undefined){
          this.selectedChannel="根目录"
        }
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
    toggleShow () {
      if(this.showInputList == false) {
        this.showInputList = true
      } else {
        this.showInputList = false
      }
    },
  },
  created() {
    //初始获取数据
    // this.info.parentId = [this.params.parentId];
    // this.info.modelId = parseInt(this.params.modelId);
    // this.getDataInfo(this.id);
    this.getAllList();//渲染基本信息
  },
  mounted(){
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.dataState=true;
    let parentChannel = window.localStorage.getItem('currentChannel')
    if(parentChannel != undefined) {
      axiosProxy.get(this.$api.channelInfo + '/' + parentChannel).then(res=>{
        console.log('获取栏目的详细信息，主要是要名字')
        console.log(res)
        if(res.data.errorCode == '0') {
          this.parentChannel = res.data.data.name
          this.selectedChannel = res.data.data.name
        }
      }).catch(error=>{
        console.log(error)
      })
    }
  },
};
</script>

<style scoped>
  .model-select{
        margin-bottom: 12px;
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
</style>