<template>
  <section v-loading="loading" class="cms-body flex" id="try">
    <!-- 树组件 -->
    <div v-if="refresh">
        <cms-channel-tree @click="getChannelId" treeType="page" :copy="false" :hasContent='false' :expandAll="expandAll"></cms-channel-tree>
    </div>

    <div class="cms-content-right">
      <!-- 栏目 -->

      <!-- 栏目列表 -->
      <div class="channel-list" v-if="display.channel_list">
        <div class="cms-list-header clearfix flex">

          <div class="bread-box cms-left" v-if="breadState">
            <label class="">当前栏目:</label>
            <ul class="type-bread">
              <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
                <a href="javascript:void(0)">{{item.name}}</a>
              </li>
            </ul>
          </div>

          <div class="cms-left channel-group">
            <el-button type="primary" @click="toAdd">
              <i class="el-icon-plus"></i> 栏目添加 
            </el-button>
          </div>
        </div>

        <el-table :data="tableData" stripe @selection-change="multiCheck">
          <el-table-column type="selection" width="65" align="right"></el-table-column>
          <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
          <el-table-column label="栏目名称"  prop="name"  align="center"></el-table-column>
          <el-table-column label="栏目路径" prop="uri" align="center"></el-table-column>
          <el-table-column label="排列顺序" prop="topLevel" align="center">
              <div slot-scope="scope" >
                  <el-input  v-model="scope.row.topLevel"  @blur='checkP(scope.row.id,scope.row.topLevel)' type='number' class="w50"></el-input>
              </div>
          </el-table-column>
          <el-table-column label="显示" prop="enable" align="center">
                  <div slot-scope="scope">        
                        <span v-if="scope.row.enable">是</span>
                        <span v-else>否</span>
                  </div>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <div slot-scope="scope">
             <!--  <cms-button type="edit"  @click.native="routerLink('/channel/update','update',scope.row.id)"
                v-perms="'/channel/update'" 
              ></cms-button> -->

               <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>
            </div>
          </el-table-column>
        </el-table>


        <!-- 表格底部 -->
        <div class="cms-list-footer" style="padding-bottom:52px;">
          <div class="cms-left">
              <el-button @click="priorityBatch($api.channelPriority)" :disabled="disabled"  
                        v-perms="'/channel/savePriority'"     
              >保存排序</el-button> 
          </div>
        </div>  
      </div>
      <!-- 栏目列表结束 -->


      <!-- 添加栏目 -->
      <div class="channel-add" v-if="display.channel_add">

        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
        <!-- 返回按钮 -->

        <el-form ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px">
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
                
          <div class="form-footer">
            <el-button type="success" @click="add(true)" v-perms="'/channel/save'">提交并继续添加</el-button>
            <el-button  type="primary"  @click="add(false)" v-perms="'/channel/save'">提交</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </div>

        </el-form>
      </div>
      <!-- 添加栏目结束 -->


      <!-- 编辑栏目 -->
      <div class="channel-edit" v-if="display.channel_edit">
        
        <a class="cms-back" href="javascript:void(0)" @click="back"></a>
        <!-- 返回按钮 -->

        <el-form  ref="form_edit" :model="channelInfo" :rules="rules" class="cms-form" label-width="162px"  v-loading="loading" style="margin:0;padding:0">
          <el-form-item label="上级栏目" class="flex-50"  prop="parentId" >
            <el-input :disabled="true" class="cms-width" :value="family.third + family.second + family.first" @focus="toggleShow"></el-input> 
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


          <div class="form-footer">
            <el-button  type="primary"  @click="update"
                v-perms="'/channel/update'"
            >修改</el-button>
            <el-button type="info" @click="updateReset">重置</el-button>
          </div>
        </el-form>
      </div>
      <!-- 编辑栏目结束 -->

    </div>
  </section>
</template>
<script>
import listMixins from "@/mixins/list";
import axios from "axios";
import va from "@/rules";
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
  mixins: [listMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    let string = va.string();
    let channelPath= va.channelPath('栏目路径不能重复','');
    return {
      expandAll: false,
      refresh: true,
      currentChannel: null,
      param:this.$route.query,
      multiCheckGroup: [],
      params: {
        //请求参数
      },
      selectedChannel:'',//选择的栏目
      finalChannelId:'',//最后的栏目id
      breadState:false,
      allTotal: 0, //分页总数
      breadItems: [
        {
          name: "根目录",
          id: ""
        },
      ], //面包屑
      channelInfo: {}, //当前栏目信息
      tableData:[],
      display: {
        channel_list: true,
        channel_add: false,
        channel_edit: false
      },
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
      info: {
        name:'',//名称
        uri:'',//路径
        enable:true,//是否可用
        metaTitle:'',//meta标题
        metaKeyword:'',//meta关键字
        metaDesc:'',//mate描述
        parentId: "", //上层栏目id
      },
      showInputList: false,
      pidArr:[],//这个是存放上级栏目的id的数组
      channelShowList:'根目录',
      editId: null,
      family: {
        first: '根目录',
        second: '',
        third: ''
      }
    };
  },
  methods: {
    back () {
      setTimeout(() => {
        this.display.channel_add = false
        this.display.channel_edit = false
        this.display.channel_list = true
      }, 100);
    },
    update() {//修改栏目
      let form = this.$refs['form_edit'];
      form.validate((valid)=>{
        if(valid){
            this.loading=false;
            let params=this.getParams('edit');

            let id = this.editId;
            let url=this.$api.channelUpdate
            axiosProxy.put(url+'/'+id,params)
              .then(res=>{
                if(res.data.errorCode=='0'){
                  this.successMessage('操作成功');
                  this.getUserInfo(this.channelInfo.parentId)
                  setTimeout(() => {
                    this.display.channel_edit = false
                    this.display.channel_add = false
                    this.display.channel_list = true
                    this.breadState = true
                    this.refresh = false
                    setTimeout (() => {
                      this.refresh = true
                    }, 100)
                    this.expandAll = true
                  }, 1000);
                } else {
                  if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                  } else {
                    this.errorMessage('操作失败')
                  }
                }
              }).catch(error => {
                this.errorMessage(error)
              })
        }else {
          return false;
        }
      })
    },
    getChannelName(arr){//根据getlastchannelname中写出来的数组进行遍历.
      let pidArr=arr.reverse()
      pidArr.pop()
      let url=this.$api.channelInfo;
      for(let i in pidArr){
        axiosProxy.get(url+'/'+pidArr[i])
          .then(res=>{
            if(res.data.errorCode == '0') {
              let info =res.data.data;
              this.channelShowList=this.channelShowList+'/'+info.name;
            } else {
              if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
              } else {
                this.errorMessage('请求失败')
              }
            }
          })
          .catch(err=>{console.log(err)})
      }
    },
    getLastChannelName(id){
      this.pidArr.push(id);
      let url=this.$api.channelInfo;
      axiosProxy.get(url+'/'+id)
        .then(res=>{
          if(res.data.errorCode == '0') {
            let info=res.data.data;

            if(info.parentId==null){
              this.getChannelName(this.pidArr);
            }else{
              axiosProxy.get(url+'/'+info.parentId)
                .then(res=>{
                  if(res.data.errorCode == '0') {
                    let info=res.data.data;
                    this.getLastChannelName(info.id)
                  } else {
                    if(res.data.errorMessage) {
                      this.errorMessage(res.data.errorMessage)
                    } else {
                      this.errorMessage('请求失败')
                    }
                  }
                })
                .catch(err=>{console.log(err)})
            }
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          } 
        })
        .catch(err=>err)
    },
    toEdit () {
      this.editId = arguments[0].id
      this.getFormInfo(this.editId)
      setTimeout(() => {
        this.display.channel_list = false
        this.display.channel_add = false
        this.display.channel_edit = true
      })
    },
    seekParent(id, callback) {
      axiosProxy.get(this.$api.channelInfo + '/' + id)
      .then(res=>{
        if(res.data.errorCode == '0') {
          callback(res.data.data)
        } else {
          if (res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      })
      .catch(err=>err)
    },
    getFormInfo(id) {
      let url=this.$api.channelInfo+'/'+id
      axiosProxy.get(url)
      .then(res=>{
        if(res.data.errorCode == '0') {
          if(res.data.data.parentId) {
            this.seekParent(res.data.data.parentId, (obj) => {
              this.family.first = obj.name
              this.breadItems.push({
                name: obj.name,
                id: obj.id
              })
              if(obj.parentId) {
                this.seekParent(obj.parentId, (objs) => {
                  this.family.second = objs.name + '/'

                  this.breadItems.splice(1, 0, {
                    name: objs.name,
                    id: objs.id
                  })
                  if(objs.parentId) {
                    this.seekParent(objs.parentId, (objed) => {
                      this.family.third = objed.name + '/'
                      this.breadItems.splice(1, 0, {
                        name: objed.name,
                        id: objed.id
                      })
                    })
                  }
                })
              }
            })
          }

          this.channelInfo = res.data.data
          this.loading = false
          let empty = this.breadItems = [{
            name: "根目录",
            id: ""
          }]
          for (let i in this.breadItems) {
            if(JSON.stringify(empty).indexOf(JSON.stringify(this.breadItems[i])) == -1) {
              empty.push(this.breadItems[i])
            }
          }
          this.breadItems = empty           
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      })
      .catch(err=>{console.log(err)})
    },
    getParams(type){//获取到处理完成给后台提交的对象
      let params={} //数组对象换成字符串
      if(type == 'edit') {
        for (let key in this.channelInfo) {
            params[key] = this.channelInfo[key];
        }
        for(let key in params){
          if(params[key] instanceof Array){       
            params[key]=params[key].join(','); 
          }    
        }
      } else if (type == 'add') {
        for (let key in this.info) {
          params[key] = this.info[key];
        }
        params.parentId=params.parentId[0];
      }
      return params;
    },
    add (state) {
      let form = this.$refs['form']
          
      form.validate((valid)=>{
        if(valid){
          this.loading=false;
          let params=this.getParams('add');
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
                  setTimeout (() => {
                    this.reset()
                  }, 1000)
                }else{
                  localStorage.removeItem('chosenId')
                  this.getUserInfo(parentId)
                  setTimeout(() => {
                    this.display.channel_add = false
                    this.display.channel_edit = false
                    this.display.channel_list = true
                    this.refresh = false
                    setTimeout (() => {
                      this.refresh = true
                    }, 100)
                    this.expandAll = true
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
    reset () {
      for (let i in this.info) {
        if(i == 'enable') {
          this.info[i] = true
        } else {
          this.info[i] = ''
        }
      }
    },
    updateReset () {
      this.channelInfo.name = ''
      this.channelInfo.metaTitle = ''
      this.channelInfo.metaDesc = ''
      this.channelInfo.metaKeyword = ''
      this.channelInfo.enable = true
    },
    //上级栏目选择函数
    getCurrentChannel (data, node) {
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
    // 去添加栏目
    toAdd () {
      this.display.channel_list = false
      this.display.channel_edit = false
      this.display.channel_add = true
      let parentChannel = window.localStorage.getItem('chosenId')
      if(parentChannel != undefined) {
        axiosProxy.get(this.$api.channelInfo + '/' + parentChannel).then(res=>{
          if(res.data.errorCode == '0') {
            this.parentChannel = res.data.data.name
            this.selectedChannel = res.data.data.name
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        }).catch(error=>{
          console.log(error)
        })
      } else {
        this.selectedChannel = '根栏目'
      }
    },
    // 获取多选表格的值
    multiCheck (value) {
      this.multiCheckGroup = value
    },
    //检查排列顺序不能为空且不能超过4位数
    checkP(selectId,num) {
      let reg = /^([1-9]\d{0,3}|0)$/
      if (!reg.test(num)) {
        this.open()
      } else {
        var list=this.tableData;
        for(var i=0;i<list.length;i++){
          if(selectId==list[i].id){
            list[i].num=Number(num);
          }
        }
        this.tableData=list;
      }
    },
    open() {
      this.errorMessage('排列顺序不能为空且不能超过4位数')
    },
      checkChange(node, checkStatus, childStatus) {
      //栏目dialog节点选中事件，处理checkbox 只能选择一个
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
      }
    },

    getChannelId(data, node) {
      this.family.first = '根目录'
      this.family.second = ''
      this.family.third = ''

      this.breadItems = [
        {
          name: "根目录",
          id: ""
        },
      ],





      this.currentChannel = data.id
      this.editId = data.id
      let id
      let url=this.$api.channelList;

      if(node.isLeaf){
        this.getFormInfo(this.editId)
        setTimeout(() => {
          this.display.channel_list = false
          this.display.channel_add = false
          this.display.channel_edit = true
        })
      }else if(data.id==-1){
        this.breadState=true;//在新建按钮旁边,显示当前栏目的路径
        this.creatBread(node, []);//获得当前目录
        id = 0
        axiosProxy.get(url+'/'+id)
        .then(res=>{
          if(res.data.errorCode == '0') {
            this.tableData=res.data.data;
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(err=>{console.log(err)})
      }else{
        this.getFormInfo(this.editId)
        this.getCurrentChannel(data,node)
        this.breadState = true;//在新建按钮旁边,显示当前栏目的路径
        this.creatBread(node, []);//获得当前目录
        id = data.id
        axiosProxy.get(url+'/'+id)
        .then(res=>{
          if(res.data.errorCode == 0){
            this.tableData = res.data.data
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(err=>{console.log(err)})
      }
    },
    priorityBatch(url) {
      this.$confirm(
        '是否保存排序',
        '提示',
        { type: "warning" }
      )
        .then(mes => {
          let url=this.$api.channelPriority
          let checkedIds = []
          let checkedLevels = []
          for (let i in this.multiCheckGroup) {
            checkedIds = this.multiCheckGroup[i].id
            checkedLevels = this.multiCheckGroup[i].topLevel
          }
          axiosProxy.put(url + '/?ids=' + checkedIds.join(',') + '&tops=' + checkedLevels.join(','))
          .then(res=>{
            if(res.data.errorCode==0){
              this.successMessage("置顶成功!")
            } else {
              if(res.data.errorCode) {
                this.errorMessage(res.data.errorCode)
              } else {
                this.errorMessage('置顶失败')
              }
            }
          })
          .catch(err=>{console.log(err)})
        })
        .catch(error => {
          console.log(error)
        });
    },
    getUserInfo(id){
      if(id==undefined){
        id=0
      }
      axiosProxy.get(this.$api.user)
        .then(res=>{
          if(res.data.errorCode == '0') {
            //下面的是判断是否登录时执行的操作
            checkErrorCode(res)
            this.loading=false;

            //通过上方判断,获取用户对应的栏目列表
            axiosProxy.get(this.$api.channelList+'/'+id)
              .then(res=>{
                if(res.data.errorCode == '0') {
                  this.tableData=res.data.data;
                } else {
                  if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                  } else {
                    this.errorMessage('请求失败')
                  }
                }
              })
              .catch(error=>{
                console.log(error)
              })
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(error=>{
          console.log(error)
        })
    },
    // 获取当前目录的函数
    creatBread(node, arr) {
      this.breadItems = [{
        name: "根目录",
        id: ""
      }]

      if (node.parent != null) {
        let params = {
          name: node.data.name,
          id: node.data.id
        };
        arr.push(params);
        this.creatBread(node.parent, arr);
      } else {
        this.breadItems = arr.reverse();
        return false;
      }
      },
  },
  
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.loading = false;
    this.breadState=false;
    this.getUserInfo(this.param.id);//判断是否登录(超时),并获取根目录下的内容,渲染到列表上
  },
  mounted(){
    let clientHeight=document.body.clientHeight;
    $('.cms-body').css('minHeight',(clientHeight-110)+'px');
  }
};
</script>

<style scoped>

.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}
.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}
.tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}
/* .iconfont{
    color: #409EFF;
  } */
.dialog .tree-layout {
  min-height: 400px;
  width: 90%;
}
.dialog .tree-layout .tree {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: absolute;
  border-right: 0px solid #d4dde2;
}
.el-dialog__body {
  min-height: 450px;
  overflow: auto;
}
.red-color {
  color: red;
}


/*选择副栏目相关样式*/
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
