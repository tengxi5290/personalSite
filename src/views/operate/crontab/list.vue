<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/crontab/save','save',0)" v-perms="'/crontab/save'"
        >添加</el-button>       
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column label="任务类型"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">首页静态化</span>
            <span v-if="scope.row.type == 2">栏目静态化</span>
            <span v-if="scope.row.type == 3">内容静态化</span>
            <span v-if="scope.row.type == 4">采集</span>
            <span v-if="scope.row.type == 5">分发</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="任务名称"  align="center"></el-table-column>
        <el-table-column prop="username" label="创建用户"  align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"  align="center"></el-table-column>
        <el-table-column label="状态"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enable">启用</span>
            <span v-if="!scope.row.enable">禁用</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/crontab/update','update',scope.row.id)"v-perms="'/crontab/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.crontabDelete,scope.row.id)" v-perms="'/crontab/delete'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.crontabDelete,ids)" v-perms="'/crontab/delete'"
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
export default {
  mixins:[listMixins],
  methods:{
  },
  created(){
      this.initTableData(this.$api.crontabList,this.params);
  }
};
</script>
