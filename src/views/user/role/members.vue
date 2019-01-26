<template>
    <section v-loading="loading" class="cms-body">
        <!-- 返回组件 -->
        <cms-back></cms-back>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="selectedIds">
                <el-table-column type="selection" width="65" align="right"></el-table-column>
                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名"  align="center"></el-table-column> 
                <el-table-column label="角色名"  align="center" prop="roleName"></el-table-column> 
                <el-table-column prop="userEnable" label="可用"  align="center">
                    <div slot-scope="scope">
                         <span v-if="scope.row.userEnable">是</span> 
                         <span v-else>否</span>   
                    </div>
                </el-table-column> 
                <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="delete" @click.native="removeBatch($api.roleMembersDelete, id,scope.row.id, scope.row)"
                        v-perms="'/role/roleMembersDelete'"
                    ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
            <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button @click="removeBatchs" v-if="selectedItems.length > 0">移除成员</el-button>
                  <el-button v-else disabled>移除成员</el-button>
                </div>    

                <div class="cms-right">
                  <cms-pagination :total="total" @change="getPages" :pageSize="currentPageSize" :page="currentPage"></cms-pagination>
                </div>             
            </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/list'
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
  mixins:[listMixins],
   data() {
    return {
      selectedItems: [],
      id:this.$route.query.id,
      params: {//只需要业务参数
        roleId:this.id, 
        roleName: '', 
        pageNo:'',
        pageSize:'',
      },
      currentPage: 1,
      currentPageSize: 10
    };
  },
  methods: {
    getPages (current, size) {
      this.getRoleTable(this.$api.roleUsers + '/' + this.id + '?page=' + current + '&pageSize=' + size)
    },
    removeBatch () {
      let url = this.$api.roleUserDelete
      let id 
      let roleId = arguments[3].roleId
      let userId = arguments[3].userId
      this.$confirm('确定移除吗？', '提示', { type: "error" })
      .then(res => {
          axiosProxy.delete(url + '/' + roleId + '/' + userId).then(res => {
              if (res.data.errorCode == "0") {
                this.successMessage('移除成功');
                this.getRoleTable(this.$api.roleUsers + '/' + this.id + '?page=' + this.currentPage + '&pageSize=' + this.currentPageSize)
              } else {
                if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                } else {
                    this.errorMessage('移除失败')
                }
              }
          });
      })
      .catch(error => {});
    },
    removeBatchs () {
      let userIds = []
      for (let i in this.selectedItems) {
        userIds.push(this.selectedItems[i].userId)
      }
      let url = this.$api.roleUserDelete
      let roleId = this.params.roleId
      this.$confirm('确定移除吗？', '提示', { type: "error" })
      .then(res => {
          axiosProxy.delete(url + '/' + roleId + '/' + userIds.join(',')).then(res => {
              if (res.data.errorCode == "0") {
                this.successMessage('移除成功');
                this.getRoleTable(this.$api.roleUsers + '/' + this.id + '?page=' + this.currentPage + '&pageSize=' + this.currentPageSize)
              } else {
                if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                } else {
                    this.errorMessage('移除失败')
                }
              }
          });
      })
      .catch(error => { });
    },
    getRoleTable(url) {
      axiosProxy
      .get(url)
      .then(res => {
        if(res.data.errorCode == '0') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          for(let i in this.tableData) {
            this.tableData[i].roleName = this.params.roleName
          }
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      });
    },
    selectedIds (val) {
      this.selectedItems = val
    },
  },
  created(){
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.params.roleName = this.$route.query.name
    this.params.roleId=this.id;
    this.getRoleTable(this.$api.roleUsers + '/' + this.id + '?page=' + this.currentPage + '&pageSize=' + this.currentPageSize)
  }
};
</script>

<style>

</style>
