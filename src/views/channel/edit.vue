<template>
<section class="cms-body flex">
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
      <cms-tree @click="getChannelId" treeType="page" :copy="true" :test="defaultOpen"></cms-tree> 
        <div class="cms-content-right">
          <!-- <el-dropdown @command="addChannel" style="margin:12px 0 0 68px;"> -->
              <router-link to="/channel/save" >
                  <el-button type="primary">
                    <i class="el-icon-plus"
                      v-perms="'/channel/save'" 
                    ></i>栏目添加   
                  </el-button>
                </router-link>
            <!-- </el-dropdown> -->

          <el-form  ref="form" :model="channelInfo" :rules="rules" class="cms-form" label-width="162px"  v-loading="loading" style="margin:0;padding:0">
              <el-form-item label="上级栏目" class="flex-50"  prop="parentId" >
                
                <el-input :disabled="true" class="cms-width" :value="channelShowList" @focus="toggleShow"></el-input> 

              </el-form-item>       
              
              <el-form-item label="栏目名称" class="flex-50"  prop="name">
                  <el-input v-model="channelInfo.name" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="访问路径" class="flex-50"  prop="uri">
                    <el-input :disabled="true" v-model="channelInfo.uri" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="是否可用" class="flex-50"  prop="enable">
                    <el-radio v-model="channelInfo.enable" :label="true">是</el-radio>
                    <el-radio v-model="channelInfo.enable" :label="false">否</el-radio>
              </el-form-item>
              <el-form-item label="meta标题" class="flex-50"  prop="metaTitle">
                    <el-input v-model="channelInfo.metaTitle" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="meta关键字" class="flex-50"  prop="metaKeyword">
                    <el-input v-model="channelInfo.metaKeyword" class="cms-width"></el-input>
              </el-form-item> 
              <el-form-item label="meta描述" class="flex-100"  prop="metaDesc">
                    <el-input v-model="channelInfo.metaDesc" type="textarea" class="cms-width"></el-input>
              </el-form-item> 
            <!-- 动态表单 -->


              <div class="form-footer">

                  <el-button  type="primary"  @click="update()"
                      v-perms="'/channel/update'"
                  >修改</el-button>
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
    let required = va.required();
    let number = va.number();
    let string = va.string();
    return {
      /**
       * parentId
       * modelId
       * https
       * hasCollect
       */
      defaultOpen: [],
      params: this.$route.query, //前一个页面带过来的数据
      dataState: false,
      rules: {
        //校验规则
        uri: [required],
        enable: [required],
        metaTitle: [required],
        name: [required],
        path: [required, string],
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
      channelInfo: {}, //当前栏目信息
      channelList: [{ hasChild: true, id: "", name: "根栏目" }], //栏目列表
      itemList: [], //动态列表
      modelList: [], //模型列表
      tplList: [], //栏目模版列表
      groupList: [], //用户组列表
    
      tplAll: [], //所有模型
      modelIds:[],

      channelInfo: {
        parentId: "", //上层栏目id
        name:'',
        enable:true,
        metaTitle:'',
        metaKeyword:'',
        metaDesc:'',

        txt:'',
      },
      tplContentVisbile: false, //选择模型模版弹窗
      ue: [],
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
      channelShowList:'根目录',
      pidArr:[],//这个是存放上级栏目的id的数组
    };
  },
  methods: {
    reset () {
      this.channelInfo.metaDesc = ''
      this.channelInfo.metaKeyword = ''
      this.channelInfo.name = ''
      this.channelInfo.enable = ''
      this.channelInfo.metaTitle = false
    },
    back(){
       this.routerLink('/channel/list','list',this.params.parentId); 
    },
    addChannel(command){//添加子栏
      let params={
             parentId:this.params.id,
             modelId:command
           }
           this.routerLink("/channel/save", "save", 0,params);
       },
    getChannelId(data, node){
        if(node.isLeaf){
          location.reload()
          this.routerLink('/channel/update','update',data.id,); 
        }else if(data.id==-1){
          this.routerLink('/channel/list')
        }else{
              this.breadState=true;//在新建按钮旁边,显示当前栏目的路径

              this.routerLink('/channel/list','',data.id)
        }
    },
    getFieldImg(path,field,index,pindex){
      this.info[field]=path;
    },
     getMediaPath(path,field){//动态媒体路径
         this.info[field]=path;//媒体路径   
    },
    getPath(event) {
      axios
        .post(this.$api.channelCreatPath, { name: event.target.value })
        .then(res => {
          this.info.path = res.body;
        });
    },
    getUeditor(ue, index) {
      this.ue[index] = ue; //获取ue实例
    },
    getTitleImg(path) {
      this.info.titleImg = path;
    },
    getContentImg(path) {
      this.info.contentImg = path;
    },
    getChannelInfo(id) {
      //获取栏目默认信息
      let url=this.$api.channelInfo+'/'+id
      axiosProxy.get(url)
        .then(res=>{
          this.channelInfo = res.data.data;
          this.loading=false;
        })
        .catch(err=>{console.log(err)})
    },
    getDataInfo() {
      this.loading = true;
      //先获取模型id
      let modelParams = {
        modelId: this.params.modelId,
        isChannel: true
      };
      axios
        .post(this.$api.itemList, modelParams)
        .then(res => {
          this.$refs["form"].resetFields();
          let itemList = res.body; //渲染数据字段模型
            
          for (let i in itemList) {
            if (itemList[i].custom) {
              //判断是否是系统字段
              if (itemList[i].dataType == 7) {
                //判断是否为多选框
                this.$set(
                  this.info,
                  "attr_" + itemList[i].field,
                  this.channelInfo["attr_" + itemList[i].field]
                 ); //转换为数组
              } else {
                this.$set(
                  this.info,
                  "attr_" + itemList[i].field,
                  this.channelInfo["attr_" + itemList[i].field]
                );
              }
            } else {
              if (itemList[i].dataType == 7) {
                this.$set(
                  this.info,
                  itemList[i].field,
                  this.channelInfo[itemList[i].field]
                );
              } else {
                this.$set(
                  this.info,
                  itemList[i].field,
                  this.channelInfo[itemList[i].field]
                );
              }
            }
          }
         this.loading = false;
          this.itemList = itemList;
         this.getDefaultInfo(); //数据回填
         
        })
        .catch(err => {
          this.loading = false;
          
        });
    },
    getDefaultInfo() {
        let api = this.$api; //API地址
       this.$set(this.info,'modelId',this.channelInfo.modelId);
       this.$set(this.info,'staticChannel',this.channelInfo.staticChannel);
       this.$set(this.info,'staticContent',this.channelInfo.staticContent);
       this.$set(this.info,'accessByDir',this.channelInfo.accessByDir);
       this.$set(this.info,'listChild',this.channelInfo.listChild);
       this.$set(this.info,'pageSize',this.channelInfo.pageSize);
       this.$set(this.info,'hasTitleImg',this.channelInfo.hasTitleImg);
       this.$set(this.info,'hasContentImg',this.channelInfo.hasContentImg);
       this.$set(this.info,'blank',this.channelInfo.blank);
        if (this.params.parentId != "") {
        //栏目数据回填
        axios.post(api.channelGet, { id: this.params.parentId }).then(res => {
          this.info.parentId = res.body.nodeIds; //层级id[]
        });
      } else {
        this.info.parentId = [""]; //层级id[]
      }
      this.dataState=true;
    },
    getAllList() {//所有辅助请求
     let api = this.$api; //API地址
      axios
        .all([
          axios.post(api.fullTextSearchChannelList, { hasContentOnly: false,excludeId:this.params.id }), //栏目列表
          axios.post(api.modelList, { containDisabled: false }), //模型列表
          axios.post(api.tplModelList, { modelId: this.params.modelId }), //模型列表
          axios.post(api.groupList), //会员组列表
          axios.post(api.tplSelectContentModel)
        ])
        .then(
          axios.spread((channels, models, tpls, groups, tplAll) => {
            this.channelList = this.channelList.concat(channels.body); //栏目列表
            this.modelList = models.body; //模型列表
            this.tplList = tpls.body; //所有的模版列表
            this.groupList = groups.body; //会员组列表
            this.tplAll = tplAll.body; //所有模型
            for (let i in this.tplAll) {               
                this.info.modelIds.push(this.channelInfo.models[i].id);
                this.info.tpls.push(this.channelInfo.tpls[i]);
                this.info.mtpls.push(this.channelInfo.mtpls[i]); 
            }
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    getEditorContent() {
      if(this.channelInfo.txt==''){
        return;
      }
        //处理一下栏目的富文本内容,固定只有四个
      //     if(this.info.txt!=undefined){
      //      this.info.txt=this.ue[0].getContent();
      //  }
      //   if(this.info.txt1!=undefined){
      //      this.info.txt1=this.ue[1].getContent();  
      //  }
      //   if(this.info.txt2!=undefined){
      //   this.info.txt2=this.ue[2].getContent();  
      //  }
      //   if(this.info.txt3!=undefined){
      //    this.info.txt3=this.ue[3].getContent();   
      //  } 
    },
    getParams() {
        let params={} //数组对象换成字符串

        for (let key in this.channelInfo) {
            params[key] = this.channelInfo[key];
        }

  
      for(let key in params){
          if(params[key] instanceof Array){       
            params[key]=params[key].join(','); 
        }    
        }
      return params;
    },
    
    update() {//修改栏目
      let form = this.$refs['form'];
      console.log(form)
      form.validate((valid)=>{
        if(valid){
            this.loading=false;
            let params=this.getParams();
            let parentId=localStorage.getItem('chosenId');//得到选择的上一级栏目的id,作为父id
            if(parentId==-1){
              parentId=null
            }
            params.parentId=parentId

            let id=params.id;
            let url=this.$api.channelUpdate
            axiosProxy.put(url+'/'+id,params)
              .then(res=>{
                if(res.data.errorCode=='0'){
                  this.successMessage('添加成功');
                  setTimeout(() => {
                        this.back();
                        }, 1000);
                }
              })
        }else {
          return false;
        }
      })
    },
    getLastChannelName(id){

      this.pidArr.push(id);
      let url=this.$api.channelInfo;
      axiosProxy.get(url+'/'+id)
        .then(res=>{
          let info=res.data.data;

          if(info.parentId==null){
            this.getChannelName(this.pidArr);
          }else{
            axiosProxy.get(url+'/'+info.parentId)
              .then(res=>{
                let info=res.data.data;
                this.getLastChannelName(info.id)
              })
              .catch(err=>{console.log(err)})
          }
        })
        .catch(err=>err)
    },
    getChannelName(arr){//根据getlastchannelname中写出来的数组进行遍历.
      // arr.pop()
      let pidArr=arr.reverse()
      pidArr.pop()
      let url=this.$api.channelInfo;
      for(let i in pidArr){
        axiosProxy.get(url+'/'+pidArr[i])
          .then(res=>{
            let info =res.data.data;
            this.channelShowList=this.channelShowList+'/'+info.name;
          })
          .catch(err=>{console.log(err)})
      }
    },
    toggleShow () {
      if(this.showInputList == false) {
        this.showInputList = true
      } else {
        this.showInputList = false
      }
    }
  },
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    //初始获取数据
    this.loading=true;
    let childId=parseInt(this.params.id);
    this.getChannelInfo(childId);//通过子id,获取子id详细内容,渲染到页面上
    this.getLastChannelName(childId);//通过子id,获得上级栏目的遍历值

    let selection = window.localStorage.getItem('currentChannel')
    this.defaultOpen.push(selection)
  }
}
</script>

<style  scoped>
      .model-select{
        margin-bottom: 12px;
      }


.input-list {
  width: 100%;
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