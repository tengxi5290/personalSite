<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header flex-between">
            <div>
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
            </div>
            <div >
                <cms-input v-model="params.username" label="用户名"></cms-input>
                <span class="demonstration cms-label">最后提现时间</span>
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
             <el-table-column label="" align="left" width="20"></el-table-column>
             <el-table-column :show-overflow-tooltip="true" prop="realname" label="作者" align="left"></el-table-column>
             <el-table-column prop="contentTotalAmount" label="总收益" align="right"></el-table-column>
             <el-table-column prop="contentYearAmount" label="年收益" align="right"></el-table-column>
             <el-table-column prop="contentMonthAmount" label="月额收益" align="right"></el-table-column>
             <el-table-column prop="contentDayAmount" label="日收益" align="right"></el-table-column>
             <el-table-column prop="contentBuyCount" label="被购买次数" align="right"></el-table-column>
             <el-table-column prop="drawCount" label="提现次数" align="right"></el-table-column>
             <el-table-column prop="contentNoPayAmount" label="账户余额" align="right"></el-table-column>
             <el-table-column label="" align="left" width="20"></el-table-column>
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
        username:'',
        pageNo:'1',
        pageSize:'10',
        drawTimeBegin:'',
        drawTimeEnd:'',
        orderBy:1,

      },
    };
  },
  methods:{
      getTime(){
        if(this.value4===null){
          this.params.drawTimeBegin='';
          this.params.drawTimeEnd='';
        }else{
             this.params.drawTimeBegin=this.value4[0];
             this.params.drawTimeEnd=this.value4[1];
        }     
      }

  },
  created(){
     this.initTableData(this.$api.contentBuyUserAccountList,this.params);   
  }
};
</script>
