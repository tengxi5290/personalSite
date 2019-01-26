<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <div>
               <span class="demonstration cms-label">排序类型：</span>
                   <el-select v-model="params.orderBy" @change="query">
                      <el-option label="总收益倒序" :value="1"></el-option>
                      <el-option label="总收益升序" :value="2"></el-option>
                      <el-option label="年收益倒序" :value="3"></el-option>
                      <el-option label="年收益升序" :value="4"></el-option>
                      <el-option label="月收益倒序" :value="5"></el-option>
                      <el-option label="月收益升序" :value="6"></el-option>
                      <el-option label="日收益倒序" :value="7"></el-option> 
                      <el-option label="日收益升序" :value="8"></el-option>
                      <el-option label="被购买次数降序" :value="9"></el-option>
                      <el-option label="被购买次数升序" :value="10"></el-option>
                      <el-option label="账户余额降序" :value="11"></el-option>
                      <el-option label="账户余额升序" :value="12"></el-option>
                  </el-select> 
                   <cms-input v-model="params.contentTitle" label="标题"></cms-input>
                  <cms-input v-model="params.author" label="用户名"></cms-input>
             </div>
             <div style="margin-top:15px;">             
                      <span class="demonstration cms-label">最后提现时间：</span>
                      <el-date-picker
                        v-model="value4"
                        type="datetimerange"
                        :editable="false"
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
                  <el-button  @click="routerLink('/charge/commission',0)" 
                       v-perms="'/charge/commission'" type="primary"
                  >平台佣金所得统计</el-button> 
             </div>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column width="20"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="contentTitle" label="标题" align="left"></el-table-column>
             <el-table-column prop="chargeAmount" label="成交金额" align="right"></el-table-column>
             <el-table-column prop="totalAmount" label="累计收费" align="right"></el-table-column>
             <el-table-column prop="yearAmount" label="今年收费" align="right"></el-table-column>
             <el-table-column prop="monthAmount" label="本月收费" align="right"></el-table-column>
             <el-table-column prop="dayAmount" label="今日收费" align="right"></el-table-column>
             <el-table-column prop="lastBuyTime" label="最新购买时间" align="center"></el-table-column>
            
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
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
        contentTitle:'', 
        author:'',
        pageNo:'1',
        pageSize:'10',
        buyTimeBegin:'',
        buyTimeEnd:'',
        orderBy:'',

      },
    };
  },
  methods:{
      getTime(){
          if(this.value4===null){
            this.params.buyTimeBegin='';
            this.params.buyTimeEnd='';
          }else{
            this.params.buyTimeBegin=this.value4[0];
            this.params.buyTimeEnd=this.value4[1];
          }  
      }

  },
  created(){
     this.initTableData(this.$api.contentBuyChargeList,this.params);   


  }
};
</script>

<style>

</style>
