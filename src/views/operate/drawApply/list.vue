<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header  flex-between">
               <div>
                   <span class="demonstration cms-label">状态</span>
                 <el-select v-model="params.status" @change="query">
                      <el-option label="所有" :value="-1"></el-option>
                      <el-option label="申请中" :value="0"></el-option>
                      <el-option label="申请成功待支付" :value="1"></el-option>
                      <el-option label="申请失败" :value="2"></el-option>
                      <el-option label="提现成功" :value="3"></el-option>
                  </el-select> 
               </div>
              <div >
                   <cms-input v-model="params.queryUsername" label="用户名"></cms-input>
                  <span class="demonstration cms-label">申请时间</span>
                  <el-date-picker
                    v-model="value4"
                    :editable="false"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"  
                    @change='getTime()'
                    >
                  </el-date-picker>
              <el-button @click="query">查询</el-button> 
            </div>  
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="50" align="right"></el-table-column>
             <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="drawUserName" label="提现用户" align="left"></el-table-column>
             <el-table-column prop="applyAccount" label="提现账户" align="left"></el-table-column>
             <el-table-column prop="applyAmount" label="提现金额" align="right"></el-table-column>
             <el-table-column prop="applyTime" label="申请时间" align="center"></el-table-column>
             <el-table-column prop="applyStatus" label="状态" align="center">
                  <div slot-scope="scope">
                      <span v-if="scope.row.applyStatus===0">申请中</span>
                      <span v-if="scope.row.applyStatus===1">申请成功待支付</span>
                      <span v-if="scope.row.applyStatus===2">申请失败</span>
                      <span v-if="scope.row.applyStatus===3">提现成功</span>
                  </div>
             </el-table-column>     
             <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                      <button class="btn aduit" @click="open2($api.accountPayDrawApplyCheck,true,scope.row.id)" title="审核" v-perms="'/drawApply/check'" ><i class="el-icon-check"></i></button>
                      <button class="btn refuse" @click="open2($api.accountPayDrawApplyCheck,false,scope.row.id)" title="退回" v-perms="'/drawApply/check'" ><i class="iconfont icon-jinzhi"></i></button>
                       <button class="btn transfer " @click="routerLink('/drawApply/traAccount','',scope.row.id)"title="转账"  v-perms="'/drawApply/traAccount'" ><i class="iconfont icon-renminbi"></i></button>
                        <button class="btn delete" @click="deleteBatch($api.accountPayDrawApplyDelete,scope.row.id)" title="删除" v-perms="'/drawApply/delete'"><i class="iconfont icon-shanchu1"></i></button>
                </div>
            </el-table-column>


            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                <el-button :disabled="disabled" @click="open2($api.accountPayDrawApplyCheck,true,ids)"
                        v-perms="'/drawApply/check'"
                  >审核</el-button>

                  <el-button :disabled="disabled" @click="open2($api.accountPayDrawApplyCheck,false,ids)"
                        v-perms="'/drawApply/check'"
                  >退回</el-button>

                 <el-button :disabled="disabled" @click="deleteBatch($api.accountPayDrawApplyDelete,ids)"
                        v-perms="'/drawApply/delete'"
                  >批量删除</el-button>
            </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>  
     </section>   
</template>

<script>
import listMixins from '@/mixins/list';
import axios from "axios";
export default {
    mixins:[listMixins],
  data() {
    return {
       pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value4: '',
      params: {//只需要业务参数    
        queryUsername:'',
        pageNo:'1',
        pageSize:'10',
        timeBegin:'',
        timeEnd:'',
        status:'',

      },
    };
  },
  methods:{
      getTime(){
          if(this.value4===null){
            this.params.timeBegin='';
            this.params.timeEnd='';
          }else{
            this.params.timeBegin=this.value4[0];
            this.params.timeEnd=this.value4[1];
          }  
      },
      open2(url,status,id) {
        this.$confirm(status?'确认审核吗?':'确定退回吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            action: axios.post(url,{ids:id,checks:status}) .then((res)=>{this.initTableData(this.$api.accountPayDrawApplyList,this.params)}),
            message: status?'审核成功!':'退回成功',        
          });
        }).catch(() => {
        });
      }

  },
  created(){
     this.initTableData(this.$api.accountPayDrawApplyList,this.params);   


  }
};
</script>
<style scoped>
  .cms-body table .btn {
    display: inline-block;
    height: 24px;
    width: 24px;
    min-width: 0px;
    line-height: 24px;
    padding: 0px;
    font-size: 14px;
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .btn .iconfont{
  font-size: 14px;
  font-weight: 100;
}
.aduit{
 background-color: #409EFF;
}
.refuse{
  background-color: #E07CF2;
}
.transfer{
  background-color: #17D57E;
}
.delete{
  background-color: #FF8B53;
}
.refuse:hover,
 .aduit:hover,
 .transfer:hover,
 .delete:hover{
  cursor: pointer;
}
</style>
