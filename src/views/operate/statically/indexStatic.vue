<template>
    <section class="cms-body " style="text-align:center;padding-top:24px;">
         
            <el-button type="primary" @click="mak"
                    v-perms="'/statically/indexStatic'"
            >生成首页HTML</el-button>
            <el-button type="primary" @click="del" plain
                      v-perms="'/statically/indexDel'"                 
            >删除首页HTML</el-button>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    return {
    };
  },
  methods:{
     mak(){
          axios.post(this.$api.staticIndex).then(res=>{
              if(res.code=='200'){
                  this.successMessage('生成成功!');
              }   
          })  
     },       
     del(){
         axios.post(this.$api.staticIndexRemove).then(res=>{
          if(res.code=='200'){
              this.successMessage('删除成功!');
          }
         })
     },
   
  },
  created(){
    
  }
};
</script>

<style>

</style>
