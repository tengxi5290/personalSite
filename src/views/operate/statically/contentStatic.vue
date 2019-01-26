<template>
    <section class="cms-body" v-loading="loading">
            <el-form  ref="form"  class="cms-form" label-width="162px">
                <el-form-item label="栏目" class="flex-50">
                      <el-cascader  class="cms-width" 
                            :props="{'value':'id','label':'name','children':'child'}"
                            :options="channelList"
                            v-model="parentId"
                            change-on-select
                            filterable
                            >
                    </el-cascader>       
                </el-form-item>       
                <el-form-item label="开始时间" class="flex-100">
                   <el-date-picker
                        v-model="params.startDate"
                        type="date"
                        value-format = "yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item> 
            </el-form>
             <div class="cms-list-footer ">
                 <div class="cms-left" style=" margin-left: 185px;">
                       <el-button type="primary" @click="sub"
                            v-perms="'/statically/contentStatic'"    
                    >生成内容页HTML</el-button>
                 </div>
            </div>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    return {
        params:{
            channelId:'',
            startDate:'',
        },
        parentId:[],
        num:0,
        int:'',
        channelList: [{ hasChild: true, id: "", name: "根栏目" }], //栏目列表
        channelParams:{
            parentId:'',
            https:'',
            all:''
        }
    };
  },
  methods:{
     sub(){
           this.loading = true;
           let a=this.parentId[this.parentId.length-1];
           this.params.channelId=a;
           console.log(this.params);
           axios.post(this.$api.staticContent,this.params).then(res=>{
                 if(res.code==='200'){
                      this.loading = false;   
                      this.successMessage('生成成功');
                 }
           }).catch(error=>{
                this.loading = false;
           }) 
     },       

  },
  created(){
      this.$http.post(this.$api.fullTextSearchChannelList, { hasContentOnly: false }).then(res=>{
              this.channelList = this.channelList.concat(res.body); //栏目列表
             this.loading = false;
      }).catch(err=>{
           this.loading = false;
      })    
  },
  beforeRouteLeave (to, from, next) {
        clearInterval(this.int);
        next();
  },
};
</script>

<style>

</style>
