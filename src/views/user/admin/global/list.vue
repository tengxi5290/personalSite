<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/adminGlobal/add','save',0)"
              v-perms="'/adminGlobal/add'"          
              >添加</el-button>
            <cms-input v-model="params.queryUsername" label="用户名"></cms-input>
            <cms-input v-model="params.queryRealName" label="真实姓名"></cms-input>
            <cms-input v-model="params.queryEmail" label="电子邮箱"></cms-input>
            <el-checkbox v-model="params.queryStatu" true-label="1" false-label="" >禁用</el-checkbox>
        </div> 
         <div class="cms-list-header">  
            <el-select v-model="params.queryGroupId" @change="query">
                <el-option label="所有会员组" value=""></el-option>
                <el-option v-for="(item,index) in groups" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
         
            <el-select v-model="params.queryRoleId" @change="query">
                <el-option label="所有角色" value=""></el-option>
                <el-option v-for="(item,index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select> 
            <el-button @click="query">查询</el-button> 
        </div> 
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名"  align="center"></el-table-column>
            <el-table-column  label="站点"  align="center" :show-overflow-tooltip="true">
                <div slot-scope="scope" class="text-overflow">
                    <span v-for="(item,index) in scope.row.sites" :key="index">{{item.name}}<i v-if="index!=scope.row.sites.length-1">,</i></span>
                </div>  
            </el-table-column>
           <!-- <el-table-column prop="departmentName" label="部门"  align="center"></el-table-column> -->
            <el-table-column prop="rank" label="等级"  align="center"></el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录时间"  align="center"></el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.disabled">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
            <el-table-column prop="loginCount" label="登录次数"  align="center"></el-table-column>
            <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/adminGlobal/edit',scope.row.rank,scope.row.id)"
                        v-perms="'/adminGlobal/edit'" 
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.adminGlobleDelete,scope.row.id)"
                         v-perms="'/adminGlobal/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
        </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.adminGlobleDelete,ids)"
                        v-perms="'/adminGlobal/delete'"
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
  data() {
    return {
      params: {//只需要业务参数
        queryUsername: "",
        queryEmail: "",
        queryGroupId: "",
        queryStatu:"",
        queryRealName:"",
        queryDepartId:"",
        queryRoleId: "",
        pageNo: "",
        pageSize: "",
        https:""
      },
      roles:[],
      groups:[],
  
    };
  },methods:{
      getQueryParams(){
        let api = this.$api; //API地址
        axios
        .all([
          axios.post(api.roleList), //axios批量发送请求
          axios.post(api.groupList),
       
        ])
        .then(
            axios.spread((roles,groups)=>{
                this.roles=roles.body;     
                this.groups=groups.body;
             
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      }
  
  },
  created(){
     this.initTableData(this.$api.adminGlobleList,this.params);
     this.getQueryParams();
  }
};
</script>

<style>

</style>
