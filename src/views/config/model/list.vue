<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">

              <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/model/add','save',0)"
              v-perms="'/model/add'"
              >添加自定义模型</el-button>


              <el-dropdown @command="addDefault">
                <el-button type="primary">
                  添加默认模型<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index) in defaultList" :key="index" :command="item.id">{{item.showName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
             <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
             <el-table-column prop="name" label="模型名字" align="center"></el-table-column>
             <el-table-column prop="showName" label="展示名字" align="center"></el-table-column>
             <el-table-column prop="priority" label="排列顺序" align="center">
                <div slot-scope="scope">
                    <el-input v-model="scope.row.priority" @blur="checkP(scope.row)" type='number' class="w50"></el-input>
                </div>
             </el-table-column>
             <el-table-column prop="enable" label="可用" align="center">
              <div slot-scope='scope'>
                  <el-checkbox v-model="scope.row.enable"></el-checkbox>
              </div> 
            </el-table-column> 
             <el-table-column  label="内容模型操作" align="center">
                <div slot-scope='scope'>
                     <a href="javascript:void(0)" 
                      class="link" 
                      @click="routerLink('/contentModel/list','list',0,{modelId:scope.row.id,isChannel:false,modelName:scope.row.showName})" >[内容模型]</a>
                </div> 
             </el-table-column>    


            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/model/edit','update',scope.row.id)"
                        v-perms="'/model/edit'" 
                      ></cms-button>   
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
          <div class="cms-left">
              <el-button v-if="disabled" disabled>保存</el-button> 

              <el-button  @click.native="prioritysBatchs($api.modelPriority,ids,getPriority(checkedList),getDisableds(checkedList),regDefId)" v-perms="'/model/priority'" v-else>保存</el-button> 
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
      params: {//只需要业务参数
        
      },
      regDefId:0,
      tableData: null,
      defaultList: []
    };
  },methods:{
    addDefault (command) {
      let modelObj = {}
      modelObj.command = command
      this.routerLink('/model/add','save',0,modelObj)
    },
    getDefaultModel () {
      let url = this.$api.defaultModel
      axiosProxy.get(url).then(res => {
        if (res.data.errorCode == "0") {
          this.defaultList = res.data.data
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      });
    },
    //检查排列顺序不能为空且不能超过4位数
    checkP(value) {
      let reg = /^([1-9]\d{0,3}|0)$/
      if (!reg.test(value.priority)) {
        this.open()
      } else {
        this.$set(this.params,'enables', value.enable)
        this.$set(this.params,'priorities', value.priority)
        this.$set(this.params,'ids', value.id)
      }
    },
    open() {
      this.$alert('排列顺序不能为空且不能超过4位数', '提示', {
        confirmButtonText: '确定',
        callback: action => {
           this.initTableData(this.$api.modelList,this.params);   
        }
      })
    },      
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.getRegRefId(res.body)
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
            },
            getPriority(checkedList){
                let Prioritys=[];
                for (let i in checkedList) {
                    Prioritys.push(checkedList[i].priority);
                }
                return Prioritys.join(",");
            },
             getDisableds(checkedList){
                let disableds=[];
                for (let i in checkedList) {
                    disableds.push(checkedList[i].enable);
                }
                return disableds.join(",");
            },
            getRegRefId(obj){
            for(let a in obj){
                if(obj[a].def){
                    this.regDefId =obj[a].id;
                    break;
                }
            } 
            }


  },
  created(){
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.initTableData(this.$api.modelList,this.params);
    this.getDefaultModel()
  }
};
</script>
    
<style>

</style>