<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/vote/save','save',0)" v-perms="'/vote/save'"
        >添加</el-button>   
        <el-radio-group v-model="params.voteStatus" @change="query" size="small">
          <el-radio-button label="">所有</el-radio-button>
          <el-radio-button :label="1">未开始</el-radio-button>
          <el-radio-button :label="2">进行中</el-radio-button>
          <el-radio-button :label="3">已结束</el-radio-button>
        </el-radio-group>
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="标题"  align="center"></el-table-column>
        <el-table-column width="100" label="默认" align="center">
            <div slot-scope="scope">
               <el-radio name="radio" v-model="defaultId" :label="scope.row.id">&nbsp;</el-radio>    
            </div>        
        </el-table-column>
        <el-table-column width="100" label="状态" align="center">
            <div slot-scope="scope">
                <span v-if="scope.row.voteStatus == 1 ">未开始</span>
                <span v-if="scope.row.voteStatus == 2 ">进行中</span>
                <span v-if="scope.row.voteStatus == 3 ">已结束</span>
            </div>        
        </el-table-column>
        <el-table-column width="100" label="暂停" align="center">
            <div slot-scope="scope">
               <el-checkbox v-if="scope.row.voteStatus == 2 " v-model="scope.row.disabled"></el-checkbox>
            </div>        
        </el-table-column>
        <el-table-column prop="totalCount" label="总投票数"  align="center"></el-table-column>
        <el-table-column width="100" label="结果" align="center">
            <div v-if="scope.row.voteStatus != 1 " slot-scope="scope">
               <a class="voteview" target="_blank" :href="$store.state.sys.baseUrl+'/vote_result.jspx?voteId='+scope.row.id">查看</a>
            </div>        
        </el-table-column>
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/vote/update','update',scope.row.id)" v-perms="'/vote/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.voteDelete,scope.row.id)" v-perms="'/vote/save'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.voteDelete,ids)" v-perms="'/vote/delete'"
        >批量删除</el-button>
        <el-button  @click="saveContent()" v-perms="'/vote/saveContent'"
        >保存内容</el-button>
      </div>    
      <!-- cms分页组件 -->
      <cms-pagination :total="total" @change="getPages"></cms-pagination>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
export default {
  mixins:[listMixins],
  data(){
    return {
      params:{
        pageNo: 1,
        pageSize:10,
        voteStatus:'',
      },
      defaultId:'',
    }
  },
  methods:{
    saveContent(){
      console.log(this.defaultId);
      let disabled = [];
      let ids = [];
      for(let item of this.tableData){
        disabled.push(item.disabled);
        ids.push(item.id);
      }
      let obj = {ids:ids.join(','),disableds:disabled.join(','),defId:this.defaultId};
      this.loading = true;
      axios.post(this.$api.voteSaveContent,obj).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('保存成功');
        }
      }).catch(err=>{
        this.loading = false;
      })
    },
    getTableData(params) {//获取表格数据   
      this.loading = true;
      axios.post(this.listUrl, params).then(res => {
        this.loading = false;
        if(res.code=='200'){
          this.total = res.totalCount;
          this.tableData = res.body;
          for(let item of this.tableData){
            if(item.def){
              this.defaultId =  item.id;
              break;
            }
          }
        }       
      }).catch(error => {
        this.loading = false;
      });
    },
  },
  created(){
    this.initTableData(this.$api.voteList,this.params);
  }
};
</script>
<style type="text/css">
  .voteview{
    color: #4687B8;
  }
</style>
