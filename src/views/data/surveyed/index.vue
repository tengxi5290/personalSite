<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">入口页面</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">排列顺序：</label>
                           <el-select v-model="params.orderBy" @change="query">
                               <el-option  label="浏览降序" :value="1"></el-option>
                                <el-option label="访客降序" :value="2"></el-option>
                                 <el-option label="停留时长降序" :value="3"></el-option>
                           </el-select>
                        </div>  
                       
            </div>
                  <table class="data-table">
                              <tr>
                                <th >入口页面</th>
                                <th >浏览量(pv)</th>
                                <th >独立访客数(uv)</th> 
                                  <th >平均停留时长(秒)</th>                              
                              </tr>
                                <tr  v-for="(item,index) in tableData" :key="index">
                                <td >{{item[0]}}</td>
                                <td >{{item[1]}}</td>
                                <td >{{item[2]}}</td>
                                 <td >{{item[3]}}</td>  
                              </tr>      
                            </table>
  </section>
</template>

<script>
import axios from "axios";
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      dateArr:'',
      params: {
        orderBy:1,
        pageSize:10,
        pageNo:1
      },
    };
  },
  methods:{
      getTableData(params){
            axios.post(this.$api.flowEnterpageList,this.params).then(res=>{
              this.tableData=JSON.parse(res.body.data); 
            })
      },
     
  },
  created() {
     this.initTableData(this.$api.flowEnterpageList,this.params);
  }
};
</script>

<style scoped lang='scss'>
.data-item {
  float: left;
  min-width: 170px;
  margin-top: 30px;
  .data-title {
    font-size: 12px;
    color: #878d99;
    margin-bottom: 17px;
  }
  .data-num {
    color: #353535;
    font-size: 24px;
  }
}
.chart-style {
  width: 100%;
  height: 380px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 15px;
}
</style>
