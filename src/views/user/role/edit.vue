<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back> 

    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
      <el-form-item label="角色名" class="flex-50"  prop="name">
        <el-input v-model="dataInfo.name" class="cms-width"></el-input>
      </el-form-item>


   <div class="form-footer">
    <el-button type="primary" @click="next" 
    v-perms="'/role/save'"
    v-if="page != 'update'"
    >下一步</el-button>
   </div>

    <el-form-item label="选择权限树新建" class="flex-100" v-if="role.showTree && page != 'update'">
      <el-tree ref="addTree" :props="props2" :load="ansyTree" lazy :indent='16' node-key="props.id" :default-expanded-keys="['']" :default-checked-keys="['']" show-checkbox :check-strictly="checkStrict">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :title="node.label">{{ node.label }}</span>
        </span> 
      </el-tree>
    </el-form-item>

    <el-form-item label="选择权限树编辑" class="flex-100" v-if="role.showTree && page == 'update'">
      <el-tree :props="props2" :load="ansyTree" lazy :indent='16' ref="tree" :default-checked-keys="checkedTree" node-key="id" :default-expanded-keys="['']"  show-checkbox :check-strictly="checkStrict" @node-expand="nodeExpand">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :title="node.label">{{ node.label }}</span>
        </span> 
      </el-tree>
    </el-form-item>
    
    <div class="form-footer" v-if="role.showTree">
      <el-button type="warning" v-if="isType('save')"  @click="add(true)" 
      v-perms="'/role/save'"
      >保存并继续添加</el-button>

      <el-button type="primary" v-if="isType('save')" @click="add(false)"
      v-perms="'/role/save'"
      >提交</el-button>

      <el-button type="primary" v-if="isType('update')" @click="update()"
      v-perms="'/role/update'"
      >修改</el-button>
      <el-button type="info" @click="reset">重置</el-button>
   </div>

 </el-form>
</section>
</template>
<script>
  import axios from "axios";
  import va from "@/rules";
  import formMixns from "@/mixins/form";
  import {axiosProxy,checkErrorCode,getUrlParams} from "@/api/tool"
  export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      firstLevel: [],
      checkStrict: false,
      props2: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      ready:false,
      dataInfo: {
        priority: 0,
        level: 0,
        all: false
      },
      rules: {//校验规则
        name:[required],
        priority:[required,number],
        level:[required,number],
        all:[required],
      },
      roleAll:true, //超级管理员权限
      loading: false,
      role: {
        newRoleId: null, // 新创建的角色id
        showTree: false,
      },
      updateId: null,
      treeListParent: [],
      defaultProps1: {
        children: 'childrenNodes',
        label: 'name'
      },
      page: '',
      chosenTreeIds: [],
      checkedTree: [],
      checkedUri: [],
      props:{
        copy:{
          type:Boolean,
          default:false
        },
        hasContent:{
          type:Boolean,
          default:true
        },
        treeType:''
      },
      totalChilds: []
    };
  },
  methods: {
    nodeExpand (data, node, slot) {
      for (let i in node.childNodes) {
        if(this.checkedTree.indexOf(node.childNodes[i].data.id) == -1) {
          node.childNodes[i].checked = false
        }
      }

      
      let childArr = node.childNodes;

      //判断没有全部选中时
      let falseArr = [];
      let trueArr = [];
      for(let i in childArr){
        if(childArr[i].checked == false){
          falseArr.push(childArr[i]);
        } else {
          trueArr.push(childArr[i])
        }
      }
      if(falseArr.length == childArr.length){
        
      }else if(trueArr.length < childArr.length){
        node.checked = false;
        node.indeterminate = true;
      }

      //未展开情况下,选中父节点,那么让其所有子节点都被选中.
      if(node.checked == true){
        for(let i in childArr){
          childArr[i].checked = true;
        }
      }

    },
    getAllLeaves (id) {
      let childs = []
      this.totalChilds.push(id)
      for (let i in this.originalTree) {
        if(this.originalTree[i].parentId == id) {
          childs.push(this.originalTree[i].id)
        }
      }
      this.totalChilds = this.totalChilds.concat(childs)

      for (let i in childs) {
        this.getAllLeaves(childs[i])
      }
    },
    ansyTree (node, resolve) {
      if(node.level == 0) {
        let array = this.originalTree 
        for (let i = 0; i < array.length; i++) {
          array[i].childrenNodes = []
          if(array[i].parentId == null) {
            this.firstLevel.push(array[i])
          } 
        }
        const data = [];
        for (let i in this.firstLevel) {
          let obj = {};
          obj.id = this.firstLevel[i].id;
          obj.isChild = !this.firstLevel[i].haveChildren
          obj.name = this.firstLevel[i].name;
          obj.data=this.firstLevel;
          obj.haveChildren = this.firstLevel[i].haveChildren;
          data.push(obj);
        }
        return resolve(data);
      }

      if (node.level >= 1) {
        this.getTreeNodes(node, resolve, node.data.id)  
      }
    },
    getUri (id) {
      let uri
      for (let i = 0; i < this.originalTree.length; i++) {
        if(id == this.originalTree[i].id) {
          uri = this.originalTree[i].uri
        }
      }
      return uri
    },
    // 通过id查子项
    getTreeNodes (node, resolve, id) {
      let searchResult = []
      for (let i = 0; i < this.originalTree.length; i++) {
        if(id == this.originalTree[i].parentId) {
          searchResult.push(this.originalTree[i])
        }
      }

      const data = [];
        for (let i in searchResult) {
          let obj = {};
          obj.id = searchResult[i].id;
          obj.isChild = !searchResult[i].haveChildren
          obj.name = searchResult[i].name;
          obj.data = searchResult;
          obj.haveChildren = searchResult[i].haveChildren;
          data.push(obj);
        }
        return resolve(data);
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axiosProxy.get(api.roleGet + '/' + id)
      .then(res => {
        if(res.data.errorCode == '0') {
          this.loading = false;
          this.dataInfo = res.data.data
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });
    },
    getRole(role){
      this.dataInfo.perms=this.$refs.role.creatRoles()    
    },
    reset () {
      this.role.showTree = false
      this.firstLevel = []
      this.checkedTree = []
      setTimeout (() => {
        this.role.showTree = true
      },100)
    },
    compareChange (previousData, currentData, type) {
      let newUris = []
      if(type == 'omit') {
        for (let i in previousData) {
          if(currentData.indexOf(previousData[i]) == -1) {
            newUris.push(previousData[i])
          }
        }
      } else if(type == 'increase') {
        for (let j = 0; j < currentData.length; j ++) {
          if(previousData.indexOf(currentData[j])  == -1) {
            newUris.push(currentData[j])
          }
        }
      }
      return newUris
    },
    update() {
      let afterRepeat = []
      let selectedNodes = this.$refs.tree.getCheckedNodes()

      let selectedIds = [] // 选中的节点的id组
      let selectedFamily = [] // 带孩子的选中的节点组
      let finalParents = [] // 最终处理完了的id组


      for (let j in selectedNodes) {

        this.getAllLeaves(selectedNodes[j].id)

        for (let i in this.totalChilds) {
          if(afterRepeat.indexOf(this.totalChilds[i]) == -1) {
            afterRepeat.push(this.totalChilds[i])
          }
        }

        selectedIds = afterRepeat
      }


      for (let i in selectedIds) {
        let obj = {}
        obj.id = selectedIds[i]
        obj.children = this.getAllChildsIds(selectedIds[i])
        selectedFamily.push(obj)
      }



      for (let i in selectedFamily) {
        if(selectedFamily[i].children.length > 0) {
          let hasArray = this.isContained(selectedIds, selectedFamily[i].children)
          if(hasArray == false) {
            
          } else {
            finalParents = this.array_diff(selectedIds, selectedFamily[i].children)
          }
        }
      }



      for (let i in afterRepeat) {
        this.chosenTreeIds.push(this.getUri(afterRepeat[i]))
      }

      let deleteUris = escape(this.compareChange(this.checkedUri, this.chosenTreeIds, 'omit').join(','))
      let additionUris = escape(this.compareChange(this.checkedUri, this.chosenTreeIds, 'increase').join(','))
      let url = this.$api.setRolePermission
      let backUrl = '/role/list'

      axiosProxy.put(url + '/' + this.updateId + '?adduris=' + additionUris + '&deluris=' + deleteUris).then(res => {
        this.loading = false;
        if(res.data.errorCode == '0') {
          this.successMessage('操作成功')
          setTimeout (() => {
            this.routerLink(backUrl)
          },1000)
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('操作失败')
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });

      this.dataInfo.id = this.updateId
      axiosProxy.put(this.$api.roleUpdate, this.dataInfo)
      .then(res => {
        this.loading = false;
        if(res.data.errorCode == '0') {
          // this.role.showTree = true
        } else {
          this.role.newRoleId = null
          this.role.showTree = false
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });
    },
    getAllChildsIds(parentId) {
      let children = []
      for (let i in this.originalTree) {
        if(this.originalTree[i].parentId == parentId) {
          children.push(this.originalTree[i].id)
        }
      }
      return children
    },
    add(state) {
      let afterRepeat = []
      let selectedNodes = this.$refs.addTree.getCheckedNodes()

      let selectedIds = [] // 选中的节点的id组
      let selectedFamily = [] // 带孩子的选中的节点组
      let finalParents = [] // 最终处理完了的id组


      for (let j in selectedNodes) {

        this.getAllLeaves(selectedNodes[j].id)

        for (let i in this.totalChilds) {
          if(afterRepeat.indexOf(this.totalChilds[i]) == -1) {
            afterRepeat.push(this.totalChilds[i])
          }
        }

        selectedIds = afterRepeat
      }


      for (let i in selectedIds) {
        let obj = {}
        obj.id = selectedIds[i]
        obj.children = this.getAllChildsIds(selectedIds[i])
        selectedFamily.push(obj)
      }


      for (let i in selectedFamily) {
        if(selectedFamily[i].children.length > 0) {
          let hasArray = this.isContained(selectedIds, selectedFamily[i].children)
          if(hasArray == false) {
            
          } else {
            finalParents = this.array_diff(selectedIds, selectedFamily[i].children)
          }
        }
      }



      for (let i in afterRepeat) {
        this.chosenTreeIds.push(this.getUri(afterRepeat[i]))
      }


      this.saveRole(state)
    },
    array_diff(a, b) {    
      for(var i=0;i<b.length;i++) {
        for(var j=0;j<a.length;j++) {
          if(a[j]==b[i]){
            a.splice(j,1);          
            j=j-1;        
          }      
        }    
      }   
      return a;
    },
    isContained(a, b) {
      if(!(a instanceof Array) || !(b instanceof Array)) return false;
      if(a.length < b.length) return false;
      var aStr = a.toString();
      for(var i = 0, len = b.length; i < len; i++){
        if(aStr.indexOf(b[i]) == -1) return false;
      }
      return true;
    },
    // 通过id找父id
    getParentId (id) {
      let result
      for (let i in this.originalTree) {
        if(this.originalTree[i].id == id) {
          result = this.originalTree[i].parentId
        }
      }
      return result
    },
    getRoleTree (id) {
      this.loading = true
      let url = this.$api.rolePermission
      axiosProxy.get(url + '/' + id)
      .then(res => {
        this.loading = false;
        if(res.data.errorCode == '0') {
          this.originalTree = res.data.data
          if(this.page == 'update') {
            this.checkStrict = true
            for(let i = 0; i < this.originalTree.length; i++) {
              if(this.originalTree[i].checked == true) {
                this.checkedTree.push(this.originalTree[i].id)
                this.checkedUri.push(this.originalTree[i].uri)
              }
            }
          }
          this.setTree(res.data.data, (() => {
            this.setChildTree()
          }))
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });
    },
    setChildTree () {
      for(let i = 0; i < this.originalTree.length; i++) {
        for(let j in this.treeListParent) {
          if(this.treeListParent[j].id == this.originalTree[i].parentId) {
            this.treeListParent[j].childrenNodes.push(this.originalTree[i])
          }
        }
      }
      setTimeout(() => {
        this.role.showTree = true
        this.checkStrict = false
      }, 0)
    },
    setTree (array, callback) {
      for (let i = 0; i < array.length; i++) {
        array[i].childrenNodes = []
        if(array[i].parentId == null) {
          this.treeListParent.push(array[i])
        } 
      }
      callback()
    },
    next () {
      if(this.page == 'update') {
        
      } else {
        let url = this.$api.roleSave
        axiosProxy.post(url, this.dataInfo)
        .then(res => {
          this.loading = false;
          if(res.data.errorCode == '0') {
            this.role.newRoleId = res.data.data.id
            this.getRoleTree(this.role.newRoleId)
          } else {
            this.role.newRoleId = null
            this.role.showTree = false
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('操作失败')
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
      }
    },
    saveRole (state) {
      let url = this.$api.setRolePermission
      let adduris = escape(this.chosenTreeIds.join(','))
      let backUrl = '/role/list'
      axiosProxy.put(url + '/' + this.role.newRoleId + '?adduris=' + adduris).then(res => {
        this.loading = false;
        if(res.data.errorCode == '0') {
          if(state) {
            this.reset()
            this.role.showTree = false
            this.firstLevel = []
          } else { 
            this.successMessage('操作成功')
            setTimeout (() => {
              this.routerLink(backUrl)
            }, 1000)
          }
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      })
      .catch(err => {
        this.loading = false;
      });
    }
  },
  created () {
    let id = this.$route.query.id
    let type = this.$route.query.type
    this.updateId = id
    if(type == 'update') {
      this.page = 'update'
      this.getDataInfo(id);
      this.getRoleTree(id)
    }
  }
};
</script>

<style>

</style>
