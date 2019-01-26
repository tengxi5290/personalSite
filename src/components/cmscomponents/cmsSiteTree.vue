<template>
  <div class="tree-layout">
            <div class="tree">
                <div class="reflash" @click="reflash"><span class="el-icon-refresh">刷新</span> </div>
                <el-tree :data="treeData" ref="cmsSiteTree" v-if="refresh" :props="props"  @node-click="nodeClik"  :default-expanded-keys="[1]" :indent="16" node-key="id"></el-tree>
            </div>
  </div>
</template>

<script>
import axios from "axios";
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
  data() {
    return {
        refresh: true,
        props: {
          label: "shortName",
          children: "child",
          isLeaf: "hasChild",
          id: "id"
        },
        treeData:[{
          name: '根目录',
          id: '',
          child:[],
        }],
    };
  },
  methods: {
    initData(){
        let url=this.$api.siteList;
        axiosProxy.get(url)
          .then(res=>{
            if(res.data.errorCode == '0') {
              let siteList=res.data.data;
              this.treeData[0].child=siteList;
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
    nodeClik(data){
      this.$emit("node-click",data);
    },
    reflash(){
      this.refresh = false
      setTimeout(() => {
        this.refresh = true
      }, 100)
    }
  },
  created(){
    this.initData()
  }
};
</script>

<style>

</style>
