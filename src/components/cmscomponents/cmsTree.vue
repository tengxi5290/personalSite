<template>
  <div class="tree-layout">
    <div class="tree">
      <div class="reflash"  >
        <div @click="reflashClick"><span class="el-icon-refresh" :class="[rotating?'rotating':'']"> </span> 刷新 </div>
        <div v-if="copy" @click.self="clickEvent" class="copy-channel">复制栏目</div>
      </div>

    <el-tree :props="props" :load="ansyTree" lazy :indent='16' node-key="props.id" 
      :default-expanded-keys="['']"
      @node-click="getNodes"
      :default-checked-keys="defaultTree"
      v-if="refash&&treeType == 'component'"
      show-checkbox
      :check-strictly="checkStrict"
      @check="check"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :title="node.label">{{ node.label }}</span>
      </span> 
    </el-tree>

    <el-tree :props="props" :load="ansyTree" lazy :indent='16' node-key="props.id" ref="tree"
      @node-click="getNodes"
      :expand-on-click-node="action"
      v-else-if="refash&&treeType == 'page'"
      :default-expand-all='expandAll'
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :title="node.label">{{ node.label }}</span>
      </span> 
    </el-tree>

  </div>
</div>
</template>

<script>
  import axios from "axios";
  import {axiosProxy,checkErrorCode} from "@/api/tool"
  export default {
    props:{
      expandAll: '',
      copy:{
        type:Boolean,
        default:false
      },
      hasContent:{
        type:Boolean,
        default:true
      },
      test: null,
      treeType:'',
      defaultTree: null,
    },

    data() {
      return {
        checkStrict: true,
        action: false,
        props: {
          label: "name",
          children: "zones",
          isLeaf: "isChild",
          id: "id"
        },
        root:'',
        refash:true,
        rotating:true,
        chosenChannel: [],
        selectedTree: []
      };
    },
    methods: {
      clickEvent(){
        this.routerLink('/channel/copy','copy',0);
      }, 
      check(data, datas) {
          this.chosenChannel = datas
          this.$emit('change', this.chosenChannel, data);
      },
      reflashClick(){
        this.refash=false;
        setTimeout(() => {
          this.refash=true;      
        },100);
      },
      getNodes(data,node,param){
        this.$emit('click', data, node);
      },
      getTreeNodes (node, resolve, id) {
        let api=this.$api;
        this.rotating=true;
        axiosProxy.get(api.contentChannel + '/' + id).then(res => {

          if(res.data.errorCode == '0') {
            this.rotating=false;
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
              this.errorMessage('请求失败')
            }
          }
        }).catch(error=>{ this.rotating=false;});
      },
      ansyTree(node, resolve) {

        //异步加载树形结构
        if (node.level === 0) {

          return resolve([
          {
            name: "根目录",
            id: '-1',
            disabled: true
          }
          ]);

        }

        if(node.level == 1) {
          this.getTreeNodes(node, resolve, 0)  
        }
        if (node.level > 1) {
          this.getTreeNodes(node, resolve, node.data.id)  
        }
      }
    }
};
</script>

<style lang='scss' scoped>
@keyframes rotating{
  from{transform:rotate(0)}
  to{transform:rotate(360deg)}
}
.rotating{
  animation:rotating 1.2s linear infinite
}
.copy-channel{
  color: #4184b7;
}
</style>