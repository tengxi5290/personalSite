<template>
      <section>
          <label class="cms-label">是否分页</label>
          <el-radio @change='rad' v-model='Params.page' :label='true'>是</el-radio>
          <el-radio @change='rad' v-model='Params.page' :label='false'>否</el-radio>
          </br>
          <label class="cms-label">推荐</label>
          <el-radio @change='rad' v-model='Params.recommend' label='all'>所有</el-radio>
          <el-radio @change='rad' v-model='Params.recommend' :label='true'>是</el-radio>
          <el-radio @change='rad' v-model='Params.recommend' :label='false'>否</el-radio>
          </br> 
          <label class="cms-label">审核</label>
          <el-radio @change='rad' v-model='Params.checked' label='all'>所有</el-radio>
          <el-radio @change='rad' v-model='Params.checked' :label='true'>是</el-radio>
          <el-radio @change='rad' v-model='Params.checked' :label='false'>否</el-radio>
          </br> 
          <label class="cms-label">排序</label>
          <el-radio @change='rad' v-model='Params.orderBy' :label='true'>按评论时间降序</el-radio>
          <el-radio @change='rad' v-model='Params.orderBy' :label='false'>按评论时间升序</el-radio>
          </br>
          <cms-input label="文本显示长度" v-model="Params.textlen"></cms-input>  
          </br>      
          <cms-input label="条数" v-model="Params.count"></cms-input>  
          </br> 

      </section>    
</template>

<script>
export default {
  name: "cms-comment",
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
        Params:{
            page:true,
            recommend:'all',
            checked:false,
            orderBy:false,
            textlen:'',
            count:'',
            module:'',
            name:'',
            description:'',
        },
        parentId:'',
         channelList: [{ hasChild: true, id: "", name: "根栏目" }], //栏目列表
    };
  },
  methods: {

     rad(){
         this.$emit('change',this.Params);
     }
  },
  created() {
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