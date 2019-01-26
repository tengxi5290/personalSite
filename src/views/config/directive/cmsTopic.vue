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
          <cms-input label="简介长度" v-model="Params.textlen"></cms-input>  
          </br>      
          <cms-input label="条数" v-model="Params.count"></cms-input>  
          </br> 

      </section>    
</template>

<script>
export default {
  name: "cms-topic",
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
            descLen:'',
            count:'',
            module:'',
            name:'',
            description:'',
        },
    
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