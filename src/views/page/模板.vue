<template>
    <section class="cms-body flex">

        <!-- 页面树组件 -->
        <cms-pagetree @click="treeClick" treeType="page" 
        :hasContent='false' :highlight-current='true'></cms-pagetree>

        <!-- 页面list内容 -->
        <div class="cms-content-right">
        <!-- 右边内容的大盒子 -->

            <div class="cms-list-header clearfix flex">
            <!-- 右边内容的上方盒子 -->

                <div class="cms-left channel-group">
                <!-- 两个按钮的区域 -->

                    <el-button type="primary">新建目录</el-button>
                    <el-button type="success">新建页面</el-button>
                </div>

                <el-table :data="tableData" stripe @selection-change="checkIds">
                <!-- 中间内容部分 -->
                </el-table>


                <div class="cms-list-footer" style="padding-bottom:52px;">
                <!-- 底部盒子 -->
                    <div class="cms-left">
                    <!-- 装按钮的盒子 -->
                        <el-button  :disabled="disabled"
                        v-perms="'/channel/delete'"     
                        >批量删除</el-button>
                    </div>
                </div>
            
            </div>
        </div>

        <!-- <section class="cms-body flex">

        页面树组件
            <cms-pagetree @click="treeClick" treeType="page" 
            :hasContent='false' :highlight-current='true'></cms-pagetree>

            页面list内容
            <div class="cms-content-right">
            右边内容的大盒子

                <div class="cms-list-header clearfix flex">
                右边内容的上方盒子
                </div>

            </div>
        </section> -->

    </section>
</template>

<script>
export default {
    methods:{
        //下面这两个是函数异步加载树形结构
        ansyTree(node,resolve) {
            console.log(node.level)
            if (node.level === 0) {
                return resolve([
                {
                name: "根目录",
                id: '-1'
                }
                ]);
            }
            if(node.level == 1) {
                this.getTreeNodes(node, resolve, 0)  
            }
            if (node.level > 1) {
                this.getTreeNodes(node, resolve, node.data.id)  
            }
        },
        getTreeNodes (node, resolve, id) {
            let url=this.$api.pageTree
            this.rotating=true;
            axiosProxy.get(url + '/' + id).then(res => {
                this.rotating=false;
                const data = [];
                let list=res.data.data
                for (let i in list) {
                    let obj = {};
                    obj.id = list[i].id;
                    obj.isChild = !(list[i].haveBlock || list[i].havePage);
                    obj.name = list[i].name;
                    obj.data=list;

                    data.push(obj);
                }
                return resolve(data);
            }).catch(error=>{ this.rotating=false;});
        },
    }
}
</script>

<style>

</style>
