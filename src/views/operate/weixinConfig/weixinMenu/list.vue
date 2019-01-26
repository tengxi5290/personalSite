<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
               <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/weixinMenu/add','save',0)"
              v-perms="'/weixinMenu/add'"          
              >添加</el-button>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
            
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                     <button class="btn list"  @click="routerLink('/weixinMenu/child/list','update',scope.row.id)" title="查看子菜单列表"
                        v-perms="'/weixinMenu/list'" 
                    ><i class="iconfont icon-gengduo"></i></button>
                    <button class="btn edit" type="edit" @click="routerLink('/weixinMenu/edit','update',scope.row.id)" title="修改"
                        v-perms="'/weixinMenu/edit'" 
                    ><i class="iconfont icon-weibiaoti101"></i></button>
                    <button class="btn delete" type="delete" @click="deleteBatch($api.weixinMenuDelete,scope.row.id)" title="修改"
                         v-perms="'/weixinMenu/delete'"
                    ><i class="iconfont icon-shanchu1"></i></button>
                </div>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.weixinMenuDelete,ids)"
                       v-perms="'/weixinMenu/delete'"
                  >批量删除</el-button>
                 <el-button @click.native="addMenu"
                       v-perms="'/group/priority'"
                  >添加到微信菜单</el-button> 
            </div>
             
          </div>   
     </section>   
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {//只需要业务参数    
            parentId:'',
            pageNo:'',
            pageSize:'',
      },
     regDefId:0
    };
  },methods:{
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
       },
      addMenu(){
            this.loading = true;
            this.$http
                .post(this.$api.weixinMenuOMenu)
                .then(res => {
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
      },
  },
  created(){
     this.initTableData(this.$api.weixinMenuList,this.params);   


  }
};
</script>

<style>
   .cms-body table .btn {
    margin-top: 5px;
    display: inline-block;
    height: 24px;
    width: 24px;
    min-width: 0px;
    line-height: 24px;
    padding: 0px;
    font-size: 14px;
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .btn .iconfont{
  font-size: 14px;
  font-weight: 100;
  color: #ffffff;
}
.list{
 background-color: #409EFF;
}
.edit{
  background-color: #17D57E
}
.delete{
  background-color: #FF8B53;
}
.list:hover,
.delete:hover,
.edit:hover{
  cursor: pointer;
}
</style>
