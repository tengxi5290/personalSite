<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header ">
              <cms-input v-model="params.orderNum" label="订单号"></cms-input>
              <cms-input v-model="params.buyusername" label="购买用户"></cms-input>
              <cms-input v-model="params.authorusername" label="作者"></cms-input>
              <label class="cms-label">交易类型</label>
              <el-radio-group v-model="params.payMode">
                <el-radio :label="0">所有</el-radio>
                <el-radio :label="1">收费</el-radio>
                <el-radio :label="2">打赏</el-radio>
             </el-radio-group>  
              <el-button @click="query">查询</el-button> 
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column  width="20" ></el-table-column>
            
            <el-table-column :show-overflow-tooltip="true" prop="contentTitle"label="内容" align="center"></el-table-column>

              <el-table-column :show-overflow-tooltip="true" prop="buyRealname" label="购买的用户" align="center">
                    <div slot-scope="scope">
                        <span v-if="scope.row.buyRealname===''">匿名</span>
                        <span v-else>{{scope.row.buyRealname}}</span>
                    </div>
              </el-table-column>
              <el-table-column prop="authorRealname" label="作者" align="center"></el-table-column>
              <el-table-column prop="chargeAmount" label="成交金额" align="center"></el-table-column>
              <el-table-column prop="authorAmount" label="作者所得金额" align="center"></el-table-column>
              <el-table-column prop="platAmount" label="平台平分金额" align="center"></el-table-column>
              <el-table-column prop="buyTime" label="购买时间" align="center"></el-table-column>          
               <el-table-column  label="付款方式" align="center">
                    <div slot-scope="scope">
                      <span v-if="scope.row.orderNumWeiXin!=''">微信支付</span>
                      <span v-if="scope.row.orderNumAliPay!=''">支付宝支付</span>
                      <span v-if="scope.row.orderNumAliPay===''&&scope.row.orderNumWeiXin===''">其他</span>
                  </div>
               </el-table-column>
               <el-table-column prop="chargeReward" label="交易类型" align="center">
                  <div slot-scope="scope">
                      <span v-if="scope.row.chargeReward===1">收费</span>
                      <span v-else>打赏</span>
                  </div>
               </el-table-column>
             
               <el-table-column :show-overflow-tooltip="true" prop="orderNumber" label="订单号/流水号" align="center"></el-table-column>
              
            </el-table-column>
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
      params: {//只需要业务参数    
        orderNum:'',
        pageNo:'',
        pageSize:'',
        buyusername:'',
        authorusername:'',
        payMode:'0',

      },
    };
  },
  methods:{
     

  },
  created(){
     this.initTableData(this.$api.contentBuyUserOrderList,this.params);   


  }
};
</script>

<style>

</style>
