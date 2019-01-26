<template>
      <section>
          <el-radio @change='rad' v-model='advertiseParams.page' :label='false'>广告</el-radio>
          <el-radio @change='rad' v-model='advertiseParams.page' :label='true'>广告版位</el-radio>
          </br>
          <span v-show="!advertiseParams.page">
                <label class="cms-label">广告</label>
                <el-select @change='ra' v-model="advertiseParams.aid">
                      <el-option v-for="(item,index) in adList" :key="index" :value="item.id" :label="item.name">
                      </el-option>
                </el-select>
          </span>
          <span v-show="advertiseParams.page">
                <label class="cms-label">广告版位</label>
                <el-select @change='ra' v-model="advertiseParams.sid">
                      <el-option v-for="(item,index) in adVer" :key="index" :value="item.id" :label="item.name">
                      </el-option>
                </el-select>
          </span>
      </section>    
</template>

<script>
export default {
  name: "cms-advertise",
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
        advertiseParams:{
            page:false,
            aid:'',
            sid:'',
            module:'',
            name:'',
            description:'',
        },
        adList:[],
        adVer:[], 
    };
  },
  methods: {
      rad(val){
         if(val){
            this.advertiseParams.aid='';
         }else{
            this.advertiseParams.sid='';
         }
          this.$emit('change',this.advertiseParams);
      },
     ra(){
        this.$emit('change',this.advertiseParams);
     },
  },
  created() {
        this.$http.post(this.$api.adList,{queryAdspaceId:'',queryEnabled:'',pageNo:'',pageSize:''}).then(res=>{
          //广告列表
            this.adList=res.body;
        })
         this.$http.post(this.$api.adSpaceList,{}).then(res=>{
          //广告版位列表
            this.adVer=res.body;
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