<template>
  <section class="cms-body flex">
    <cms-back></cms-back>
    <!-- 树组件 -->
    <cms-tree @change="getChannelId" :copy="true" ></cms-tree>
    <div class="cms-content-right" style="margin:30px 45px">
     <div>
         <div class="info-gray">
         <p> 说明：1、复制栏目只会在原有的基础上添加，并不会覆盖已存在的栏目；</p>
         <p> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、若遇到与原有栏目访问路径一样时，复制过去的栏目路径将会带上数字“1”；</p>
         <p> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 例：当前站点已存在名称为“新闻”，路径为“news”的栏目，若再从其他站点复制名称为“新闻”，路径为“news”的栏目过来，那原有的“新闻”栏目保留并将新增一个名称为“新闻”，
         路径为“news1”的栏目。</p>
         </div>
         <section class="transfer-box">
          <!--穿梭框-->
                <div class="transfer-panel">
                    <div style="margin-bottom:24px;">
                    <label style="font-size:14px;color:#999">来源站点：</label>      
                    <el-select v-model="siteId"   @change="changeSite">
                        <el-option v-for="(item,index) in siteItems" :key="index"
                        :label="item.name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                    </div>
                        <div  class="tree copy-tree">
                            <el-tree :load="siteTree" lazy ref="channelTree" :props="props" v-if="siteTreeState"
                                :default-expanded-keys="['']" 
                                 @check-change="checkChange"
                                show-checkbox :indent="10" node-key="id">
                            </el-tree>
                        </div> 
                    </div>
                    <span class="iconfont icon-youyi-xuanzhong"></span>
                    <div class="transfer-panel">
                            <div style="margin-bottom:24px;">
                                <label style="font-size:14px;color:#999">当前站点</label>      
                                {{currentName}}
                            </div>
                            <div  class="tree copy-tree">
                                <el-tree :load="currentTree" lazy ref="currentTree" 
                                :default-checked-keys="['']"
                                  :default-expanded-keys="['']" 
                                :props="props" v-if="currentTreeState"

                               
                                     show-checkbox :indent="10" node-key="id">
                                </el-tree>
                            </div> 
                           <div class="solution-box">
                                <div style="margin-bottom:12px;"> 
                                    <label style="font-size:12px;color:#999">
                                        电脑模板方案:
                                        </label>      
                                    <el-select v-model="mobileSolution">
                                        <el-option v-for="item in solutions" :key="item"
                                        :label="item"
                                        :value="item"
                                        ></el-option>
                                    </el-select>
                                </div>
                                <div >
                                    <label style="font-size:12px;color:#999"> 手机模板方案:</label>
                                   
                                    <el-select v-model="solution">
                                        <el-option v-for="item in solutions" :key="item"
                                        :label="item"
                                        :value="item"
                                        ></el-option>
                                    </el-select>
                                    </div>  
                        </div>     
                    </div>
       </section>    
     </div>    
      <el-button type="primary" style="width:178px;text-align:center;margin:50px 0 0 380px;" :disabled="!params.ids.length>0" @click="copyChannel"
              v-perms="'/channel/copy'"
      >复制</el-button> 
    </div>
    
  </section>
</template>

<script>
import * as fetch from "@/api/interface";
import axios from "axios";
export default {
  data() {
    return {
        currentTreeState:true,
      siteTreeState: false,
      siteId:'',
       currentName:'',
       solutions:[],
       mobileSolution:'',
       solution:'',
      siteItems: this.$store.state.perms.siteItems, //站点id
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      params:{
          ids:[],
          solution:'',
          mobileSolution:''
      }
    };
  },
  methods: {
     getCurrentSite(){
         let  siteId=localStorage.getItem('_site_id_param');
          for(let i in this.siteItems){
              if(this.siteItems[i].id==siteId){
                  this.currentName=this.siteItems[i].name;
              }
          }     
     }, 
      getSolutions() {
      fetch.getSolutions().then(res => {
        
        this.solutions = res.body;

      });
    },
    changeSite(id) {
        this.siteTreeState=false;
         this.siteId = id;
       setTimeout(() => {
            this.siteTreeState = true;
       }, 10);
    },
    checkChange(node){
        this.params.ids=this.$refs['channelTree'].getCheckedKeys()
      
    },
    currentTree(node, resolve) {
      if (node.level === 0) {
        return resolve([
          {
            name:'全选',
            id: "",
            isChild: true
          }
        ]);
      }
      if (node.level > 0) {
        axios
          .post(this.$api.channelList, {
            parentId: node.data.id,
          })
          .then(res => {
            const data = [];
            for (let i in res.body) {
              let obj = {};
              obj.id = res.body[i].id;
              obj.isChild = res.body[i].childCount > 0 ? false : true;
              obj.name = res.body[i].name;
              data.push(obj);
            }
              
            return resolve(data);
          });
      }
    },
    siteTree(node, resolve) {
      if (node.level === 0) {
        return resolve([
          {
            name:'全选',
            id: "",
            isChild: true
          }
        ]);
      }
      if (node.level > 0) {
        axios
          .post(this.$api.channelList, {
            parentId: node.data.id,
            _site_id_param: this.siteId
          })
          .then(res => {
            const data = [];
            for (let i in res.body) {
              let obj = {};
              obj.id = res.body[i].id;
              obj.isChild = res.body[i].childCount > 0 ? false : true;
              obj.name = res.body[i].name;
              data.push(obj);
            }
            return resolve(data);
          });
      }
    },
    copyChannel() {
        this.params.ids=this.params.ids.join(',');
     axios.post(this.$api.channelCopy,this.params).then(res=>{
        if(res.code=='200'){
            this.successMessage('复制成功！');
            this.currentTreeState=false;
            setTimeout(() => {
                this.currentTreeState=true;
            }, 10);
        } 
     })      

    },
    

    getChannelId(data, node) {
         this.routerLink('/channel/list','list',data.id);  
    }
  },
  created() {
      this.getSolutions();
      this.getCurrentSite();
  }
};
</script>

<style scoped lang='scss'>
.transfer-box{
    display: flex;
   align-items: center;
   margin-left: 80px;
}
.transfer-panel {
  width: 325px;
  height: 500px;
  border: 1px solid #e7ecf3;
  border-radius: 4px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 24px;
  position: relative;
  z-index: 888;
}
.info-gray {
  font-size: 12px;
  color: #999999;
  margin-bottom: 35px;
}
.copy-tree{
    width: 325px;
    height: 340px;
    overflow-x:hidden;
    position: absolute;
    border-right: none;
}
.icon-youyi-xuanzhong{
    font-size: 40px;
    color: #00aeff;
    margin: 0 40px;
}
.solution-box{
    z-index: 999;
    width: 100%;
    padding:10px 20px;
    background: #f8f9fb;
    position: absolute;
    bottom:0;
    left: 0;
   
}
</style>
