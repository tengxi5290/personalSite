<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
      <!-- 右操作 -->
      <div>
        <el-select v-model="ok" @change="queryEnable">
            <el-option label="启用" value="true"></el-option>
            <el-option label="禁用" value="false"></el-option>
            <el-option label="全部" value="all"></el-option>
        </el-select>
        <cms-input  label="用户名" v-model="params.userName"></cms-input>
        <cms-input  label="手机号码"  v-model="params.mobileNumber"></cms-input>
        <el-button @click="queryInfo">查询</el-button>           
      </div>
    </div>


    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID"align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="left"></el-table-column>
      <el-table-column prop="mobileNumber" label="手机号码" align="center"> </el-table-column>
      <el-table-column prop="" label="状态" align="center">
        <div slot-scope="scope">
          <span v-if='scope.row.enable'>启用</span> 
          <span v-else class="red">禁用</span> 
        </div>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center">
        <div slot-scope="scope">
          <cms-button type="user" v-if="userType == 'MASTER_ADMIN' || userType == 'SITE_ADMIN' || userType == 'SP_ADMIN'" @click="showDialog(scope.row.id, 'user')"></cms-button>
          <cms-button type="rename" v-if="userType == 'MASTER_ADMIN' || userType == 'SP_ADMIN'" @click="showDialog(scope.row.id, 'rename')"></cms-button>

          <cms-button type="user" v-if="userType == 'USER'" disabled></cms-button>
          <cms-button type="rename" v-if="userType == 'USER'" disabled></cms-button>
        </div>
      </el-table-column>
    </el-table>


    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <cms-pagination :total="total" @change="getPages" :pageSize="params.pageSize" :page="params.page" :init="true"></cms-pagination>
    </div> 

    <div class="dialog-container">
      <el-dialog title="角色分配" :visible.sync="dialogTableVisible" v-if="tableType == 'role'">
        <el-table :data="gridData" ref="table" key="role">
          <el-table-column align="center" property="haveRole" label="选择">
            <div slot-scope='scope'>
              <el-checkbox v-model="scope.row.haveRole" @change="shiftSingle(scope.row)"></el-checkbox>
            </div>
          </el-table-column>
          <el-table-column property="id" label="ID" align="center"></el-table-column>
          <el-table-column property="name" label="角色名" align="center"></el-table-column>
        </el-table>
        <div class="cms-list-footer">
          <el-button @click="postUserRoles">确定</el-button>
          <cms-pagination :total="totalRole" @change="getRolePages" :pageSize="pageSize" :page="page" :init="false"></cms-pagination>
        </div>
      </el-dialog>

      <el-dialog title="站点分配" :visible.sync="dialogTableVisible" v-if="tableType == 'site'">
        <el-table :data="gridData" ref="table" key="site">
          <el-table-column property="siteUser" label="选择" align="center">
            <div slot-scope='scope'>
                 <el-checkbox v-model="scope.row.siteUser" @change="shiftSiteUser(scope.row)"></el-checkbox>
            </div> 
          </el-table-column>
          <el-table-column property="siteName" label="站点" align="center"></el-table-column>
          <el-table-column property="siteAdmin" label="管理员" align="center">
            <div slot-scope='scope'>
                <el-checkbox v-model="scope.row.siteAdmin" v-if="scope.row.siteUser" @change="shiftAdmin(scope.row)"></el-checkbox>
                <el-checkbox v-model="scope.row.siteAdmin" v-else disabled></el-checkbox>
            </div> 
          </el-table-column>
        </el-table>
      </el-dialog>
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
      pageSize: 10,
      page: 1,
      ok: '启用',
      params: {
        userName: "",
        mobileNumber: '',
        enable: 1,
        page: 1,
        pageSize: 10,
      },
      tableData: [],
      userType: null,
      gridData: [],
      dialogTableVisible: false,
      tableType: '',
      toggleRoles: {
        additionRoles: [],
        omitRoles: [],
        currentRoles: []
      },
      totalRole: null
    };
  },
  methods: {
    showDialog (id, type) {
      this.currentUserId = id
      this.dialogTableVisible = true
      if(type == 'user') {
        this.tableType = 'role'
        switch (this.userType) {
          case 'MASTER_ADMIN':
            this.getRoleList(this.$api.userRolePermission + '/' + this.currentUserId + '?page=1&pageSize=10')
          break
          case 'SITE_ADMIN':
            this.getRoleList(this.$api.userRolePermission + '/' + this.currentUserId + '?page=1&pageSize=10')
          break
          case 'SP_ADMIN':
            this.getRoleList(this.$api.userRolePermission + '/' + this.currentUserId + '?page=1&pageSize=10')
          break
          default: 
            console.log('others')
        }
      } else if(type == 'rename') {
        this.tableType = 'site'
        switch (this.userType) {
          case 'MASTER_ADMIN':
            this.getSites()
          break
          case 'SP_ADMIN':
            this.getSites()
          break
          default:
            console.log('others')
        }
      }
    },
    shiftAdmin (row) {
      let obj = {}
      obj.userId = row.userId
      obj.siteUser = row.siteUser
      obj.siteAdmin = row.siteAdmin
      obj.siteId = row.siteId
      let url = this.$api.userSite
      axiosProxy.post(url, obj).then(res => {
        if(res.data.errorCode == '0') {
          this.getSites()
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
          this.getSites()
        }
      })
    },
    shiftSiteUser (row) {
      let obj = {}
      obj.userId = row.userId
      obj.siteUser = row.siteUser
      obj.siteAdmin = false
      obj.siteId = row.siteId
      let url = this.$api.userSite
      axiosProxy.post(url, obj).then(res => {
        if(res.data.errorCode == '0') {
          this.getSites()
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
          this.getSites()
        }
      })
    },
    getSites () {
      let url = this.$api.userSiteList
      axiosProxy.get(url + '/' + this.currentUserId).then(res => {
        this.loading = false
        if (res.data.errorCode == "0") {
          this.gridData = res.data.data
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    getRoleList (url) {
      this.toggleRoles.currentRoles = []
      axiosProxy.get(url).then(res => {
        if (res.data.errorCode == "0") {
          this.gridData = res.data.data.list
          for(let i in this.gridData) {
            if(this.gridData[i].haveRole == true) {
              this.toggleRoles.currentRoles.push(this.gridData[i].id)
            }
          }
          this.totalRole = res.data.data.total
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    getRolePages (current, size) {
      this.getRoleList(this.$api.userRolePermission + '/' + this.currentUserId + '?page=' + current + '&pageSize=' + size)
    },
    queryEnable(value) {
      if(value == 'all') {
        this.params.enable = ''
      } else {
        this.params.enable = value
      }
      this.getUserList(this.queryString())
    },
    queryInfo () {
      this.getUserList(this.queryString())
    },
    getUserList (url) {
      axiosProxy.get(url).then(res => {
        this.loading = false
        if (res.data.errorCode == "0") {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      })
    },
    queryString (data) {
      let url = this.$api.memberList
      if(data != 'page') {
        this.params.page = 1
      }
      for (let i in this.params) {
        if(this.params[i] != '') {
          if(url.indexOf('?') == -1) {
            url = url + '?' + i + '=' + this.params[i]
          } else {
            url = url + '&' + i + '=' + this.params[i] 
          }
        }
      }
      return url
    },
    getPages (current, size) {
      this.params.page = current
      this.params.pageSize = size
      this.getUserList(this.queryString('page'))
    },
    postUserRoles () {
      this.toggleRoles.additionRoles = []
      this.toggleRoles.omitRoles = []
      let currentDatas = []
      for(let i in this.$refs.table.data){
        if(this.$refs.table.data[i].haveRole == true) {
          currentDatas.push(this.$refs.table.data[i].id)
        }
      }

      for(let i in currentDatas) {
        if(this.toggleRoles.currentRoles.indexOf(currentDatas[i]) == -1) {
          this.toggleRoles.additionRoles.push(currentDatas[i])
        }
      }

      for (let i in this.toggleRoles.currentRoles) {
        if(currentDatas.indexOf(this.toggleRoles.currentRoles[i]) == -1) {
          this.toggleRoles.omitRoles.push(this.toggleRoles.currentRoles[i])
        }
      }

      let url = this.$api.roleUser
      let deleteUrl = this.$api.roleUserOmit

      if(this.toggleRoles.additionRoles.length > 0) {
        let newObj = {}
        let empty = []

        for (let i in this.toggleRoles.additionRoles) {
          let obj = {}
          obj.roleId = this.toggleRoles.additionRoles[i]
          obj.userId = this.currentUserId
          empty.push(obj)
        }

        newObj.userRoles = empty

        axiosProxy.post(url, newObj).then(res => {
          this.loading = false
          if (res.data.errorCode == "0") {
            this.successMessage('操作成功')
            this.dialogTableVisible = false
          } else {
            if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
          }
        })
      }

      if(this.toggleRoles.omitRoles.length > 0) {
        axiosProxy.delete(deleteUrl + '/' + this.currentUserId + '/' + this.toggleRoles.omitRoles.join(',')).then(res => {
          this.loading = false
          if (res.data.errorCode == "0") {
            this.successMessage('操作成功')
            this.dialogTableVisible = false
          } else {
            if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
          }
        })
      }


      if (this.toggleRoles.omitRoles.length == 0 && this.toggleRoles.additionRoles.length == 0) {
        this.open()
        return false
      }
    },
    shiftSingle () {

    },
    open() {
      this.$message({
        message: '没有改动',
        type: 'warning'
      })
    }
  },
  created(){
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.siteId = window.localStorage.getItem('_site_id_param')
    let userType = localStorage.getItem('userType')
    this.userType = userType
    this.getUserList(this.queryString())
  }
}
</script>

<style>

</style>
