<template>
  <section class="cms-body" v-loading="loading">     
    <el-form  ref="form" :model="dataInfo" class="cms-form" label-width="162px">
         <el-form-item label="栏目" class="flex-50"  prop="channelId">
            <el-cascader
              :props="{'value':'id','label':'name','children':'child'}"
              :options="channels"
              change-on-select
              filterable
              v-model="selectChannels" class="cms-width">
            </el-cascader>
         </el-form-item>
         <el-form-item  class="flex-50"  >
         </el-form-item> 
         <el-form-item label="时间范围" class="flex-50" >
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              :editable="false"
              align="right"
              value-format = "yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions2" class="cms-width">
            </el-date-picker>
         </el-form-item> 
          <el-form-item class="flex-50"  >
         </el-form-item> 
          <el-form-item label="每次生成数量" class="flex-50"  prop="max">
                <el-input v-model="dataInfo.max" class="cms-width" type="number"></el-input>
         </el-form-item> 
         <el-form-item  class="flex-50"  >
         </el-form-item>
      
         <div class="form-footer">
              <el-button type="primary"  @click="createIndex(true)" >生成索引</el-button>
              <el-button type="info" @click="reset">取消</el-button>
         </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    return {
      pickerOptions2: {
        shortcuts: [{
          text: "最近一周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text:"最近三个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dateRange:[],
      channels:[],
      selectChannels:[],
      dataInfo:{
        max:1000,
      }
    };
  },
  methods: {
    reset(){
      this.selectChannels = [];
      this.dateRange = [];
      this.dataInfo = {};
      this.dataInfo.max= 1000;
    },
    createIndex(state) {     
      if(this.selectChannels.length > 0 ){
        this.dataInfo.channelId = this.selectChannels[this.selectChannels.length-1];
      }
      if(this.dateRange.length > 0){
        this.dataInfo.startDate = this.dateRange[0];
        this.dataInfo.endDate = this.dateRange[1];
      }
      this.loading = true;
      axios.post(this.$api.fullTextSearchCreate, this.dataInfo).then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.successMessage('生成成功！');
        }
      }).catch(error => { this.loading = false; })
    },
  },
  created() {
    //初始获取数据
    axios.post(this.$api.fullTextSearchChannelList,{hasContentOnly:true}).then(res => {
        this.loading = false;
        this.channels = res.body; 
        this.dataInfo.all=false;
    }).catch(err => {
      this.loading = false;
    });
  }
};
</script>

<style scoped>
.el-date-editor .el-range-separator{
 margin-top: -1px
}
.el-date-editor .el-range-separator{
  width: 6%;
}
</style>
