<template>
   <section class="cms-body flex">
     <div class="tree-layout">
        <!--文件夹-->
        <section class="file-tree-items">
             <div class="reflash"  @click="refresh">
                    <span class="el-icon-refresh">刷新</span> 
                    
                    </div>             
            <!--文件树-->
            <el-tree :data="treeInfo" :props="defaultProps" 
            @node-click="handleNodeClick" 
            accordion :highlight-current="true"
              node-key="id"
              :default-expanded-keys="[0]"
            ></el-tree>
            <!--文件树-->
        </section>
         </div>
        <!--文件列表-->
        <router-view  class="cms-content-right"></router-view>
 </section>
</template>

<script>
 import * as fetch from '@/api/interface'
export default {
    data() {
        return {
            treeInfo: [{
                name: '根目录',
                path: '',
                child: [],
                id:0
            }],
            defaultProps: {
                children: 'child',
                label: 'name',
                id: 'id'
            },
            root: ''
        };
    },
    methods: {
        getResourceTree() {
            fetch.getResourceTree({root:this.root })
                .then(res => {
                     //console.log(res);
                       this.treeInfo[0].path=res.body.rootPath
                    this.treeInfo[0].child = res.body.resources;
                     setTimeout(()=>{
                    $('#refresh').removeClass('an-circle');
                    },1000);
                })
        },
        refresh(){
             $('#refresh').addClass('an-circle');
             this.getResourceTree();
        },
        handleNodeClick(data) {
                $(window).scrollTop(0);
            let childType = typeof data.child;//判断类型
            if (childType == 'object') {
                let params=data.path;
                this.$router.push({
                    path: '/resourcelist',
                    query:{
                        name:params,
                        noceStr:Math.round(Math.random()*10)
                    }
                })
            } else {
                this.$router.push({
                    path: '/resourceedit',
                     query:{
                        id:data.path,
                        root:data.root,
                        type:'edit'
                    }
                })
            }

        },
        viewHeight(){
          var he=  $(window).height();
            he= parseInt(he-170);
            $('.js-height').css('minHeight',he+'px');
        }
    },
    created: function() {
        this.$router.push({ path: '/resourcelist'})
        this.getResourceTree();
    },
    mounted(){
       let clientHeight=document.body.clientHeight;
          $('.cms-body').css('minHeight',(clientHeight-110)+'px');
    }
};
</script>

<style scoped lang='scss'>

</style>
