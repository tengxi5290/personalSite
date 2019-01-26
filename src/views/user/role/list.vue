<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/role/save','save',0)"
                v-perms="'/role/save'"
            >添加</el-button> 
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="name" label="角色名"  align="center"></el-table-column> 
              <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/role/update','update',scope.row.id)"
                        v-perms="'/role/update'"
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.roleDelete,scope.row.id)"
                        v-perms="'/role/save'"
                    ></cms-button>
                    <cms-button type="user" @click.native="routerLink('/role/members','update',scope.row.id,scope.row)" 
                        v-perms="'/role/roleMembers'"
                    ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button @click="deleteBatch($api.roleDelete,ids)" v-perms="'/role/delete'" v-if="idGroup.length > 0">批量删除</el-button>
                  <el-button v-else disabled>批量删除</el-button>
                </div>               
                <div class="cms-right">
                  <cms-pagination :total="total" @change="getPages" :pageSize="currentPageSize" :page="currentPage"></cms-pagination>
                </div> 
          </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/list'
import {axiosProxy,checkErrorCode, axiosProxyFiles} from "@/api/tool"
export default {
  mixins:[listMixins],
  data() {
    return {
      currentPage: 1,
      currentPageSize: 10,
      idGroup: []
    };
  },
  methods: {
    deleteBatch (url,id) {
      this.$confirm('是否确定删除？', '警告', { type: "error" })
        .then(mes => {
            axiosProxy.delete(url + '/' + id).then(res => {
                if (res.data.errorCode == "0") {
                  this.successMessage('删除成功')
                  this.getRoleList(this.$api.roleList + '?page=' + this.currentPage + '&pageSize=' + this.currentPageSize)
                } else {
                  if(res.data.errorMessage) {
                      this.errorMessage(res.data.errorMessage)
                  } else {
                      this.errorMessage('删除失败')
                  }
                }
            });
      })
      .catch(error => { 

      });
    },
    getRoleList (url) {
      axiosProxy.get(url).then(res => {
        this.loading = false
        if (res.data.errorCode == "0") {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      });
    },
    checkIds (nodes, data) {
      this.idGroup = nodes
      let ids = []
      for (let i in nodes) {
        ids.push(nodes[i].id)
      }
      this.ids = ids.join(',')
    },
    getPages (current, size) {
      this.currentPage = current
      this.currentPageSize = size
      this.getRoleList(this.$api.roleList + '?page=' + current + '&pageSize=' + size);
    },
  },
  created(){
    this.getRoleList(this.$api.roleList + '?page=' + this.currentPage + '&pageSize=' + this.currentPageSize);
    this.$store.dispatch("setCollapse", true); //收缩状态栏
  }
};
</script>

<style>

</style>
