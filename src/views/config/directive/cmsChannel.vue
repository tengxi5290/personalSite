<template>
      <section>
          <label class="cms-label">是否列表</label>
          <el-radio @change='rad' v-model='channelParams.list' :label='false'>单个</el-radio>
          <el-radio @change='rad' v-model='channelParams.list' :label='true'>列表</el-radio>
          </br>
          <label class="cms-label">栏目模板</label>
          <el-radio @change='rad' v-model='channelParams.channel' :label='true'>是</el-radio>
          <el-radio @change='rad' v-model='channelParams.channel' :label='false'>否</el-radio>
          </br> 
           <span v-show='channelParams.list'> 
                <label class="cms-label">包含内容的栏目</label>
                <el-radio @change='rad' v-model='channelParams.hasContent' :label='true'>是</el-radio>
                <el-radio @change='rad' v-model='channelParams.hasContent' :label='false'>所有</el-radio>
                </br> 
            </span>   
            <span v-show='channelParams.list&&channelParams.channel'>   
                <label class="cms-label">列表分类</label>
                <el-radio @change='rad' v-model='channelParams.listType' label='childs'>子栏目</el-radio>
                <el-radio @change='rad' v-model='channelParams.listType' label='top'>一级栏目</el-radio>
                <el-radio @change='rad' v-model='channelParams.listType' label='borthers'>兄弟栏目</el-radio>
                </br> 
             </span>
             <span v-show='!channelParams.list'>            
                <label class="cms-label">所要栏目	</label>
                <el-radio @change='rad' v-model='channelParams.singleType' label='channel'>当前栏目信息</el-radio>
                <el-radio @change='rad' v-model='channelParams.singleType' label='top'>顶层栏目</el-radio>
                <el-radio @change='rad' v-model='channelParams.singleType' label='parent'>父栏目</el-radio>
                <el-radio @change='rad' v-model='channelParams.singleType' label='navigation'>栏目导航</el-radio>
                 </br>  
              </span>
              <span v-show='!channelParams.channel'>   
                    <el-cascader @change="chanId"  class="cms-width" 
                        :props="{'value':'id','label':'name','children':'child'}"
                        :options="channelList"
                        v-model="parentId"
                        change-on-select
                        filterable
                        >
                    </el-cascader> 
               </span>
      </section>    
</template>

<script>
export default {
  name: "cms-channel",
  props: {
      ad:{
         type:Object,
         default:function(){
           return {};
         },
         
      },
  },
  data() {
    return {
        channelParams:{
            list:true,
            channel:true,
            hasContent:false,
            listType:'childs',
            singleType:'channel',
            channelId:'',
            module:'',
            name:'',
            description:'',
        },
        parentId:[],
         channelList: [{ hasChild: true, id: "", name: "根栏目" }], //栏目列表
    };
  },
  methods: {
     chanId(){
        let a=this.parentId[this.parentId.length-1];
        this.channelParams.channelId=a;
        this.$emit('change',this.channelParams);
     },
     rad(){
         if(channelParams.list){
             this.channelParams.channelId='';
         }

         this.$emit('change',this.channelParams);
     }
  },
  created() {
      this.$http.post(this.$api.fullTextSearchChannelList, { hasContentOnly: false }).then(res=>{
              this.channelList = this.channelList.concat(res.body); //栏目列表
      })  
  }
};
</script>

<style lang="scss" scoped>
.cms-pagination {
  display: flex;
}
.page-input {
  display: inline-block;
  display: flex;
  align-items: center;
  margin-right: 35px;
  > span {
    display: inline-block;
    color: #8a8e98;
    font-size: 14px;
    user-select: none;
    white-space: nowrap;
  }
  .small {
    width: 58px;
    padding: 0 5px;
  }
}
</style>