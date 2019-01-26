<template>
      <div class="tree border-none">
             <el-tree :load="ansySiteAndChannelTree" lazy  :props="props"
                 ref="tree"
               :default-expanded-keys="['']"   @check-change="checkChange"   show-checkbox :indent="16" node-key="id">
            </el-tree>
      </div>
</template>
<script>
// import listMixins from '@/mixins/list'
import axios from "axios";
export default {
  data() {
    return {
      props: {
        label: "name",
        children:"zones",
        isLeaf: "isChild",
        id: "id",
        disabled:"disabled"
      }
    };
  },methods:{
     //栏目dialog节点选中事件，处理checkbox 只能选择一个
    checkChange(node,checkStatus,childStatus){
            this.$emit('change', this.$refs['tree'].getCheckedKeys());
      
    },
    formateSiteData(data){
        let siteTreeData = [];
        for(let item  of data){
            if(item.id == this.$getSiteId()){
                continue;
            }
            let obj = {name:item.name,id:'s'+item.id,isChild:false,siteId:item.id,channelId:'',};
            obj.isLastSite = true;   //是否最后一级site层
            obj.disabled =  true;
            siteTreeData.push(obj);
        }
      return  siteTreeData;
    },
    //异步加载栏目树形结构  
    ansySiteAndChannelTree(node, resolve){

      if (node.level === 0) {
        return resolve([
          {
            name: '根目录',
            id: '',
            isChild:true,
            isLastSite:false,
            channelId:'',
            disabled:true
          }
        ]);
      }
      if(node.level  > 0){
             
            //是否为最后一级站点
             let siteId = node.data.siteId; 
             let channelId =  node.data.channelId;
            if(node.data.isLastSite || channelId > 0  ){
                   let param = {parentId:channelId,_site_id_param:siteId};
                   axios.post(this.$api.channelList,param).then(res => {
                        let data = [];
                        for (let i in res.body) {
                          let obj = {};
                          obj.id = res.body[i].id;
                          obj.isChild = res.body[i].childCount > 0  ? false : true;
                          obj.name = res.body[i].name;
                          obj.siteId = siteId;
                          obj.channelId =  res.body[i].id;
                           obj.disabled = !obj.isChild;
                          data.push(obj);
                        }
                        return resolve(data);
                   });
            }else{
                axios.post(this.$api.siteTree,{root: '',all:true}).then(res => {
                    return resolve(this.formateSiteData(res.body))
                }); 
            }
      }
     
    },

  },
  created(){
  }
};
</script>
<style lang="scss" scoped>
.border-none{
    width:90%;
    max-height: 400px;
    overflow: auto;
    position: absolute;
    border-right: none;
}
</style>
