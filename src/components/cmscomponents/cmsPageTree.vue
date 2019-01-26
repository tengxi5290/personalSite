<template>
    <div class="tree-layout">
        <section class="tree">
            <!-- <section class="file-tree-items"> -->

            <div class="reflash" @click="reflash"><span class="el-icon-refresh">刷新</span> </div>

            <el-tree 
                v-if="refresh"
                :load="ansyTree" :props="props" lazy :expand-on-click-node="toggle"
                :indent="16" node-key="prop.id"
                @node-click="getNodes" :render-content="renderContent">
            </el-tree>
        
        </section>
    </div>
</template>

<script>
import {axiosProxy,getPageTreeParams} from "@/api/tool"

export default {
    props: {
        
    },
    data(){
        return{
            toggle: false,
            refresh: true,
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
        }
    },
    methods:{
        renderContent (h, { node, data, store }) {
            return (
              <span class="custom-tree-node">
                <i class={data.className + ' ' + data.colorName}></i>
                <span style="margin-left:5px;" class={data.colorName}>{node.label}</span>
              </span>
              );
        },
        //下面这两个是函数异步加载树形结构
        ansyTree(node,resolve) {
            if (node.level === 0) {
                return resolve([
                {
                name: "根目录",
                id: '-1',
                className: 'el-icon-news'
                }
                ]);
            }
            if(node.level == 1) {
                this.getTreeNodes(node,resolve,0)  
            }
            if (node.level > 1) {
                this.getTreeNodes(node,resolve)  
            }
        },
        getTreeNodes (node,resolve,rid) {
            let url=this.$api.pageTree
            this.rotating=true;
            let params='';
            if(rid==0){
                params='0'
            }else{
                params=getPageTreeParams(node);
            }
            axiosProxy.get(url+'/'+params).then(res => {

                this.rotating=false;
                const data = [];

                if(res.data.errorCode==0){
                    let list=res.data.data
                    for (let i in list) {
                        let obj = {};
                        obj.rid=list[i].real_id;//真实id
                        obj.nid = list[i].id;//假id,当前id
                        obj.isChild = !(list[i].haveBlock || list[i].havePage)//判断是否为孩子
                        if(list[i].showName) {
                            obj.name = list[i].showName
                        } else {
                            obj.name = list[i].name
                        }
                        obj.type=list[i].type;//类型,为dir还是page
                        if(list[i].enable == false) {
                            obj.colorName = 'forbidden'
                        } else {
                            obj.colorName = 'normal'
                        }
                        switch (list[i].type) {
                            case 'PAGE':
                                obj.className = 'el-icon-tickets'
                            break
                            case 'DIR':
                                obj.className = 'el-icon-news'
                            break
                            default:
                                obj.className = 'el-icon-menu'
                        }

                        obj.data=list;
                        data.push(obj);
                    }
                    return resolve(data);
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('获取页树失败')
                    }
                }
            }).catch(error=>{ this.rotating=false;});

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
.forbidden {
    color: #c0c0c0;
}
.normal {
    color: inherit;
}
</style>
