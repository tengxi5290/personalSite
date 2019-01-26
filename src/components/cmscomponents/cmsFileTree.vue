<template>
    <div class="tree-layout">
        <section class="tree">
            <!-- <section class="file-tree-items"> -->

            <div class="reflash" @click="reflash"><span class="el-icon-refresh">刷新</span> </div>

            <el-tree 
            v-if="refresh&&hideTree"
            :load="ansyTree" :props="props" lazy :expand-on-click-node="toggle"
            :default-expanded-keys="[1]" :indent="16" node-key="prop.id"
            @node-click="getNodes" :render-content="renderContent">
                <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :title="node.label">{{ node.label }}</span>
                </span>  -->
            </el-tree>
        
        </section>
    </div>
</template>

<script>
import {axiosProxy,getPageTreeParams} from "@/api/tool"

export default {
    data(){
        return{
            toggle: false,
            refresh: true,
            hideTree:false,//是否显示树
            props: {
                label: "name",
                children: "child",
                isLeaf: "isChild",
                pid: "real_id",
                nid:'id',
                mid:'1',
                type:'type'
                },
            treeData:[{
                name: '根目录',
                id: '',
                child:[],
            }],
            treeInfo:[],//向接口请求,将获得的数据全部获取到
        }
    },

    methods:{
        getTreeInfo(){
            let url=this.$api.resoureTreeList;
            axiosProxy.get(url)
                .then(res=>{
                    if(res.data.errorCode==0){
						this.treeInfo=res.data.data;
                        this.hideTree=true;
                    }else{
                        if(res.data.errorMessage) {
							this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('文件树获取失败')
                        }
                    }

                })
                .catch(err=>{console.log(err)})
            
        },//获取树的完整信息

        renderContent (h, { node, data, store }) {
            return (
                <span class="custom-tree-node">
                    <i class={data.className}></i>
                    <span style="margin-left:5px;">{node.label}</span>
                </span>
                );
        },//树图标的设置


        //下面这两个是函数异步加载树形结构
        ansyTree(node,resolve) {
            
            
            if (node.level === 0) {
                
                return resolve([
                {
                    name: "根目录",
                    id: '-1',
                    className: 'el-icon-tickets',
                    
                }
                ]);
            }
            if(node.level == 1) {
                // this.getTreeNodes() 
                let info=this.treeInfo;
                let firstArr=[];
                for(let i in info){
                    if(info[i].pId==null){
                        info[i].isChild = !info[i].haveChildren;//判断是否为孩子
                        firstArr.push(info[i])
                    }
                }
                return resolve(firstArr)
                
            }
            if (node.level > 1) {
                this.getTreeNodes(node.data,resolve)
            }
        },
        getTreeNodes (data,resolve) {
            let info=this.treeInfo;
            let firstArr=[];

            for(let i in info){
                if(info[i].pId==data.id){
                    info[i].isChild = !(info[i].haveChildren);//判断是否为孩子
                    firstArr.push(info[i])
                }
            }
            return resolve(firstArr)
        },  

        //树的点击事件
        getNodes(data,node,param){
            this.$emit('click', data, node);
        },
        //刷新按钮的刷新事件
        reflash(){
            this.refresh = false
            setTimeout(() => {
                this.refresh = true
            }, 100)
        }
    },
    created(){
        this.getTreeInfo();//获取到树的完整信息
    }
}
</script>

<style lang="scss">
.trees {
    width: 200px;
    height: 100%;
    overflow: auto;
    position: absolute;
    border-right: 1px solid #d4dde2;
}
</style>
