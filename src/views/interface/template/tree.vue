<template>
 <section class="cms-body flex">
     <div class="tree-layout">
        <!--文件夹-->
        <section class="file-tree-items">
             <div class="reflash"  @click="refresh">
                    <span class="el-icon-refresh">刷新</span> 
                    <div>
                             <a href="javascript:void(0)" @click="settingTpl(false)" title="PC端"><i class="iconfont icon-iconfontdesktop" style="font-size: 20px"></i></a>
                            <a href="javascript:void(0)" @click="settingTpl(true)" title="移动端"><i class="iconfont icon-shouji" style="font-size: 20px;margin-left: 10px"></i></a>   
                       </div>
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
                name: '模版根目录',
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
        getTemplateTree() {
            fetch.getTemplateTree({root:this.root })
                .then(res => {
                     
                       this.treeInfo[0].path=res.body.rootPath
                    this.treeInfo[0].child = res.body.resources;
                    setTimeout(()=>{
                    $('#refresh').removeClass('an-circle');
                    },500);
                    
                })
        },
        refresh(){
            $('#refresh').addClass('an-circle');
            this.getTemplateTree();
        },
        settingTpl(mobile){
             this.$router.push({
                    path: '/templatesetting',
                    query:{
                        mobile:mobile,
                        noceStr:Math.round(Math.random()*10)
                    }
                })
        },
        handleNodeClick(data) {
            //console.log(data);  
            let childType = typeof data.child;//判断类型
             $(window).scrollTop(0);
            if (childType == 'object') {
                let params=data.path;
                this.$router.push({
                    path: '/templatelist',
                    query:{
                        name:params,
                        noceStr:Math.round(Math.random()*10)
                    }
                })
            } else {
                this.$router.push({
                    path: '/templateedit',
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
    mounted(){
       let clientHeight=document.body.clientHeight;
          $('.cms-body').css('minHeight',(clientHeight-110)+'px');
    },
    created: function() {
        this.$router.push({ path: '/templatelist'})
        this.getTemplateTree();
    }
};
</script>

<style scoped lang='scss'>



 .bbs-iconfontdesktop{
   top:0;
   margin-right: 0;
}


</style>
