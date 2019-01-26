<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <div class="cms-list-header">
      <el-button type="primary"  @click="open" >
       前台预览
      </el-button>
    </div>
    <article class="article">
      <header class="article-header">
        <h2 class="article-title">{{dataInfo.title}}</h2>
        <p class="gray">
          作者：{{dataInfo.username}}&nbsp;&nbsp;
          点击量：{{dataInfo.views}}&nbsp;&nbsp;
          发布时间：{{dataInfo.releaseDate}}
        </p>
      </header>
      <section class="article-body" v-html="dataInfo.txt">
      </section>
    </article>
</section>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dataInfo:{
      },
      id: this.$route.query.id,//id
      loading:false,
    };
  },
  methods: {
    getInfo(){
      this.loading = true;
      axios.post(this.$api.contentView,{id:this.id}).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.dataInfo = res.body;
        }
      }).catch(error => { 
        this.loading = false;
      });
    },
    open(){
      window.open(this.dataInfo.urlDynamic);
    }
  },
  created() {
    this.getInfo();
  }
};
</script>
