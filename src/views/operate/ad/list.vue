<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header ">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/ad/save','save',0)" v-perms="'/ad/save'"
        >添加</el-button>     
        <el-button type="primary"  @click="routerLink('/adSpace/list',0)" v-perms="'/adSpace/list'"
        >广告版位<i class="el-icon-arrow-right"></i></el-button>     
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center"></el-table-column>
        <el-table-column prop="adspaceName" label="版位"  align="center">
        </el-table-column>
        <el-table-column prop="category" label="类型"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.category == 'text'">文字</span>
            <span v-if="scope.row.category == 'image'">图片</span>
            <span v-if="scope.row.category == 'flash'">Flash</span>
            <span v-if="scope.row.category == 'code'">代码</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重"  align="center">
        </el-table-column>  
        <el-table-column  label="点击/展现=点击率"  align="center">
          <template slot-scope="scope">
            <span>{{calculation(scope.row.clickCount,scope.row.displayCount)}}</span>
          </template>
        </el-table-column>  
        <el-table-column prop="enabled" label="启用"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled">是</span>
            <span v-if="!scope.row.enabled">否</span>
          </template>
        </el-table-column>
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/ad/update','update',scope.row.id)"v-perms="'/ad/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.adDelete,scope.row.id)" v-perms="'/ad/delete'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.adDelete,ids)" v-perms="'/ad/delete'"
        >批量删除</el-button>
      </div>
      <!-- cms分页组件 -->
      <cms-pagination :total="total" @change="getPages"></cms-pagination>    
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
      globalUrl:setBaseUrl(),
      adTypes:[],
    }
  },
  methods:{
    calculation(clickCount,displayCount){
      if(displayCount == 0){
        return clickCount+'/'+displayCount+'=0.00%';
      }
      return clickCount+'/'+displayCount+'='+(clickCount/displayCount*100).toFixed(2)+'%';
    },
  },
  created(){
      this.initTableData(this.$api.adList,this.params);
  }
};
</script>
