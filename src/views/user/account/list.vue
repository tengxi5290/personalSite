<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
            <el-select v-model="params.source" @change="query">
                <el-option label="所有" value=""></el-option>
                <el-option label="QQ" value="QQ"></el-option>
                 <el-option label="微信" value="WEIXIN"></el-option>
                <el-option label="新浪微博" value="SINA"></el-option>
                <el-option label="腾讯微博" value="QQWEBO"></el-option>   
            </el-select>
            <cms-input v-model="params.username" label="用户名"></cms-input>
            <el-button @click="query">查询</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="source" label="第三方平台" align="center"></el-table-column>
            <el-table-column prop="userIntro" label="来自" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.userIntro==''">--</span>
                    <span v-else>{{scope.row.userIntro}}</span>
                </div>
            </el-table-column>
            <el-table-column prop="userRealName" label="真实姓名" align="center"></el-table-column>
            <el-table-column prop="userGender" label="性别" align="center">
                 <div slot-scope="scope">
                    <span v-if="scope.row.userIntro">男</span>
                    <span v-else>女</span>
                </div>   
            </el-table-column>
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                     <cms-button type="delete" @click.native="deleteBatch($api.accountDelete,scope.row.id)"
                     v-perms="'/account/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.accountDelete,ids)"
                  v-perms="'/account/delete'"
                  >批量删除</el-button>
                </div>
                <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
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
        username: "",
        source: "",
        pageNo: "",
        pageSize: ""
      }
    };
  },
  created(){
     this.initTableData(this.$api.accountList,this.params);
  }
};
</script>
    
<style>

</style>
