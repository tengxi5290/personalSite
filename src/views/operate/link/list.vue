<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header ">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/link/save','save',0)" v-perms="'/link/save'"
        >添加</el-button>     
        <el-button type="primary"  @click="routerLink('/link/typeList',0)" v-perms="'/linkType/list'"
        >友情链接类别<i class="el-icon-arrow-right"></i></el-button>     
    </div>
    <!-- 手动查询表单 -->
    <div class="cms-list-header">
        <el-select v-model="params.queryCtgId" @change="query">
          <el-option v-for="(item,index) in LinkTypes" :key="index" :label="LinkTypes[index].name" :value="LinkTypes[index].id"></el-option>
        </el-select> 
    </div> 
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center"></el-table-column>
        <el-table-column prop="logo" label="Logo"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.logo == ''">无Logo</span>
            <span v-if="scope.row.logo != ''"><img class="logo" :src="globalUrl+scope.row.logo"></span>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="点击次数"  align="center"></el-table-column>
        <el-table-column width="100" label="排列顺序" align="center">
          <div slot-scope="scope">
              <el-input v-model="scope.row.priority" @blur='checkP(scope.row.priority)' type='number' class="w50"></el-input>
          </div>        
        </el-table-column>  
        <el-table-column prop="enabled" label="显示"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled">是</span>
            <span v-if="!scope.row.enabled">否</span>
          </template>
        </el-table-column>
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/link/update','update',scope.row.id)" v-perms="'/link/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.linkDelete,scope.row.id)" v-perms="'/link/delete'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.linkDelete,ids)" v-perms="'/link/delete'"
        >批量删除</el-button>
        <el-button :disabled="disabled" @click="priorityBatch($api.linkPriority,ids,getPriority())" v-perms="'/link/priority'"
        >保存排列顺序</el-button>
      </div>    
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
import { setBaseUrl } from '@/config.js'
export default {
  mixins:[listMixins],
  data(){
    return {
      globalUrl:this.$getUrl(),
      params:{
        queryCtgId:'',
      },
      LinkTypes:[],
    }
  },
  methods:{
    //检查排列顺序不能为空且不能超过4位数
    checkP(value) {
      let reg = /^([1-9]\d{0,3}|0)$/
      if (!reg.test(value)) {
        this.open()
      } else {
      }
    },
    open() {
      this.$alert('排列顺序不能为空且不能超过4位数', '提示', {
        confirmButtonText: '确定',
        callback: action => {
           this.initTableData(this.$api.linkList,this.params);   
        }
      })
    },    
    getLinkTypes(){
      this.LinkTypes = [{"name":"所有类别","id": ''}];
      axios.post(this.$api.linkTypeList).then(res=>{
        if(res.code == '200'){
          this.LinkTypes =  this.LinkTypes.concat(res.body);
        }
      });
    },
    getPriority(){
      let Prioritys=[];
      for (let item of this.checkedList) {
          Prioritys.push(item.priority);
      }
      return Prioritys.join(",");
    },
  },
  created(){
      this.initTableData(this.$api.linkList,this.params);
      this.getLinkTypes();
  }
};
</script>
<style>
  
  .logo{
    height: 45px;
  }
</style>
