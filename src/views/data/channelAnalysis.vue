<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">栏目访问量({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.view" @change="query">
                            <el-radio-button  label="view">今年</el-radio-button>
                            <el-radio-button  label="viewMonth">本月</el-radio-button>
                            <el-radio-button  label="viewDay">今日</el-radio-button>
                        </el-radio-group>
                        </div>  
                         <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">选择栏目: </label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.channelLevel" @change="query">
                            <el-radio-button  :label="1">顶层栏目</el-radio-button>
                            <el-radio-button  :label="2" >底层栏目</el-radio-button>
                        </el-radio-group>
                        </div>
            </div>
                  <table class="data-table">
                              <tr>
                                <th >排名</th>
                                <th >栏目</th>
                                <th >访问量</th> 
                              </tr>
                                <tr  v-for="(item,index) in dataInfo" :key="index">
                                <td >{{index+1}}</td>
                                <td >{{item.name}}</td>
                                <td >{{item.views}}</td>      
                              </tr>      
                            </table>
  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dateArr:'',
      time:'',
      date:{
          year:'',
          month:'',
          day:''
      },
      params: {
        view:'viewDay',
        channelLevel:1,
       
      },
      dataInfo: {},
     
    };
  },
  methods: {
     query(val){
        if(val==='viewDay'){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val==='viewMonth'){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val==='view'){
            this.time=this.date.year
        }
        this.getDataInfo();
     }, 
    getDataInfo() {
      axios.post(this.$api.statisticChannelList,this.params).then(res => {
       this.dataInfo=res.body
      });
    },
  },
  created() {
    let now = new Date();
    let Y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    this.date.year=Y;
    this.date.month=m;
    this.date.day=d;
    this.year=Y;
    this.month=m;
    this.time=Y+'-'+m+'-'+d  
    this.getDataInfo();
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
