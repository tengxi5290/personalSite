<template>
    <section v-loading="loading" class="cms-body">
         <div class="cms-list-header flex-between">
            <div >

                <cms-input v-model="params.phone" label="手机号"></cms-input>
                <cms-input v-model="params.username" label="用户名"></cms-input>
                <span class="demonstration cms-label">发送时间</span>
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
            
                <br/>
                <br/>
                <span class="demonstration cms-label">验证类型</span>
                <el-select v-model="params.validateType">
                  <el-option  label="全部"></el-option> 
                  <el-option :value="1" label="注册验证"></el-option> 
                  <el-option :value="2" label="找回密码"></el-option>
                  <el-option :value="0" label="未知"></el-option> 
                 </el-select>
                <span class="demonstration cms-label">运营商</span>
                <el-select v-model="params.sms">
                  <el-option  label="全部"></el-option> 
                  <el-option :value="1" label="阿里云"></el-option> 
                  <el-option :value="2" label="腾讯云"></el-option>
                  <el-option :value="3" label="百度云"></el-option> 
                 </el-select>

                <el-button @click="query">查询</el-button> 
            </div>
         </div>
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="siteName" label="站点名" align="center"></el-table-column>
            <el-table-column prop="smsName" label="短信运营商" align="center"></el-table-column>
            <el-table-column prop="validateType" label="验证类型" align="center"></el-table-column>
            <el-table-column prop="sendTime" label="发送时间" align="center"></el-table-column>
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
        phone:"",
        validateType:"",
        sms:"",

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
     this.initTableData(this.$api.smsServersmsRecordList,this.params);   
  }
};
</script>
