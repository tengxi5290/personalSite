<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header ">
              <span class="demonstration cms-label">支付时间: </span>
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
              <cms-input v-model="params.drawNum" label="单号"></cms-input>
              <cms-input v-model="params.payUserName" label="支付用户"></cms-input>
         </div>
         <div class="cms-list-header ">
              <cms-input v-model="params.drawUserName" label="提现用户"></cms-input>
              <el-button @click="query">查询</el-button> 
        </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
             <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="drawNum" label="单号" align="center"></el-table-column>
             <el-table-column prop="payAccount" label="支付账户" align="center"></el-table-column>
             <el-table-column prop="drawAccount" label="提现账户" align="center"></el-table-column>
             <el-table-column prop="payTime" label="支付时间" align="center"></el-table-column>
             <el-table-column prop="weixinNum" label="微信转账流水号" align="center"></el-table-column>
             <el-table-column prop="alipayNum" label="支付宝转账流水号" align="center"></el-table-column>
             <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="delete" @click.native="deleteBatch($api.accountPayDelete,scope.row.id)"
                         v-perms="'/accountPay/delete'"
                    ></cms-button>
                </div>
            </el-table-column>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
                 <el-button :disabled="disabled" @click="deleteBatch($api.accountPayDelete,ids)"
                        v-perms="'/accountPay/delete'"
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
        drawNum:'',
        pageNo:'1',
        pageSize:'10',
        payTimeBegin:'',
        payTimeEnd:'',
        payUserName:'',
        drawUserName:'',

      },
    };
  },
  methods:{
      getTime(){
         if(this.value4===null){
            this.params.payTimeBegin='';
            this.params.payTimeEnd='';
        }else{
          this.params.payTimeBegin=this.value4[0];
          this.params.payTimeEnd=this.value4[1];
        } 
      }

  },
  created(){
     this.initTableData(this.$api.accountPayList,this.params);   
  }
};
</script>

<style>

</style>
