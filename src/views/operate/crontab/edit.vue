<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 任务类型 -->
        <el-form-item label="任务类型" class="flex-100 flex-no-border"  prop="type">
          <el-select v-model="dataInfo.type" class="cms-col3" @change="clickType">
            <el-option label="首页静态化" :value="1"></el-option>
            <el-option label="栏目静态化" :value="2"></el-option>
            <el-option label="内容静态化" :value="3"></el-option>
            <el-option label="采集" :value="4"></el-option>
            <el-option label="分发" :value="5"></el-option>
          </el-select> 
        </el-form-item>
        <!-- 栏目层级选择器 -->  
        <el-form-item v-if="typeDisabled[0]" label="栏目" class="flex-100 ">
          <el-cascader  class="cms-col3" 
            :props="{'value':'id','label':'name','children':'child'}"
            :options="channels"
            change-on-select
            filterable
            v-model="selectChannels" >
          </el-cascader>
        </el-form-item>
        <!-- 采集下拉列表 -->
        <el-form-item v-if="typeDisabled[1]" label="采集" class="flex-100 ">
          <el-select  v-model="dataInfo.attr_acqu_id" class="cms-col3">
            <el-option v-for="item in collections" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select> 
        </el-form-item>
         <!-- FTP下拉列表 -->
        <el-form-item v-if="typeDisabled[2]" label="FTP" class="flex-100 ">
          <el-select  v-model="dataInfo.attr_ftp_id" class="cms-col3">
            <el-option v-for="item in ftps" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select> 
          <el-button @click="ftpAdd">增加</el-button> 
          <div class="ftp-div cms-col2"> <span>分发文件夹 相对根目录(例/Main/Channel)</span></div>
          <div class="ftp-div cms-col3" v-for="(item,index) in ftpForld" :key="index">
            <el-input class="cms-col6" v-model="ftpForld[index]"> </el-input>
            <el-button @click="ftpDelete(index)" class="cms-col1"> 删除</el-button>
          </div>
        </el-form-item>
        <!-- 任务名称 必填 -->
        <el-form-item label="任务名称" class="flex-100"  prop="name">
          <el-input v-model="dataInfo.name" class="cms-col3" ></el-input>
        </el-form-item> 
        <!-- 执行方式 -->
        <el-form-item label="执行方式" class="flex-100"   >
          <el-radio-group v-model="dataInfo.execycle" @change="execyClick" class="cms-col10"> 
            <el-radio :label="1">执行周期</el-radio>
            <el-radio :label="2">执行方式</el-radio>
          </el-radio-group>  
        </el-form-item> 
        <!-- 执行周期  -->  
        <el-form-item v-if="execycleDisplay" label="执行周期" class="flex-100" >
          <el-select v-model="dataInfo.intervalUnit" class="cms-col1"  @change="interValUnitClick">
            <el-option label="分" :value="1"></el-option>
            <el-option label="时" :value="2"></el-option>
            <el-option label="天" :value="3"></el-option>
            <el-option label="周" :value="4"></el-option>
            <el-option label="月" :value="5"></el-option>
          </el-select> 
          <el-input v-if="intervalUnitDisabled[0]" type="number" v-model="dataInfo.intervalMinute">
            <template slot="prepend">每隔</template>
            <template slot="append">分钟</template>
          </el-input>
          <el-input v-if="intervalUnitDisabled[1]" type="number" v-model="dataInfo.intervalHour">
            <template slot="prepend">每隔</template>
            <template slot="append">小时</template>
          </el-input>
           <el-input v-if="intervalUnitDisabled[2]" type="number" v-model="dataInfo.dayOfWeek">
            <template slot="append">星期</template>
          </el-input>
          <el-input v-if="intervalUnitDisabled[3]" type="number" v-model="dataInfo.dayOfMonth">
            <template slot="append">日</template>
          </el-input>
          <el-input v-if="intervalUnitDisabled[4]" type="number" v-model="dataInfo.hour">
            <template slot="append">时</template>
          </el-input>
          <el-input v-if="intervalUnitDisabled[5]" type="number" v-model="dataInfo.minute">
            <template slot="append">分</template>
          </el-input>
        </el-form-item> 
        <!-- cron表达式: -->
        <el-form-item v-if="!execycleDisplay" label="cron表达式" class="flex-100"  >
          <el-input v-model="dataInfo.cronExpression" class="cms-col2" ></el-input>
        </el-form-item>
        <!-- 状态 必填 -->
        <el-form-item label="状态" class="flex-50"  prop="enable">
          <el-switch v-model="dataInfo.enable" active-text="启用" 
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
         <el-form-item  class="flex-50" > 
        </el-form-item>
        <!-- 备注 -->
         <el-form-item label="备注" class="flex-100" >
          <el-input v-model="dataInfo.remark" class="cms-col3" type="textarea" ></el-input>
        </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')"    @click="add(true)" v-perms="'/crontab/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)"v-perms="'/crontab/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()"v-perms="'/crontab/update'">
             修改
            </el-button>
            <el-button type="info" @click="$reset">重置</el-button>
            <span class="gray" v-if="isType('save')">选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
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
    let required = va.required('此项必填');
    let number = va.number('必须为数字');
    return {
      dataInfo:{
      },
      typeDisabled:[
        false,
        false,
        false,
      ],
      intervalUnitDisabled:[
        true,
        false,
        false,
        false,
        false,
        false,
      ],
      jobClass:[
        'com.jeecms.cms.task.job.IndexStaticJob',
        'com.jeecms.cms.task.job.ChannelStaticJob',
        'com.jeecms.cms.task.job.ContentStaticJob',
        'com.jeecms.cms.task.job.AcquisiteJob',
        'com.jeecms.cms.task.job.DistributeJob',
      ],
      execycleDisplay:true,
      channels:[
        {hasChild:true,id:'',name:"所有栏目"}
      ],
      ftps:[],
      ftpForld:[],
      collections:[],
      selectChannels:[],
      rules: {//校验规则
        type:[required],
        name:[required],
        enable:[required]
      }
    };
  },
  methods: {
    clickType(val){
      this.typeDisabled = this.typeDisabled.map(function(e){return false;});
      //初始栏目
      if(val == 2 || val == 3 ){
        this.selectChannels = [''];
        this.typeDisabled[0] = true;
        if(this.channels.length == 1){
          this.loading = true;
          axios.post(this.$api.fullTextSearchChannelList,{hasContentOnly:false}).then(res => {
              this.loading = false;
              this.channels = this.channels.concat(res.body);
          }).catch(err => {
            this.loading = false;
          });
        }
      }else if(val == 4){
        this.typeDisabled[1] = true;
        //获取采集
        if(this.collections.length == 0){
          this.loading = true;
          axios.post(this.$api.acquisitionList).then(res => {
            if(res.code == '200'){
              this.dataInfo.attr_acqu_id = res.body.length > 0 ?res.body[0].id:'';
              this.loading = false;
              this.collections = res.body; 
            }
          }).catch(err => {
            this.loading = false;
          });
        }
      }else if(val == 5){
        this.typeDisabled[2] = true;
        if(this.ftpForld.length == 0){
          this.ftpForld = [''];
        }
        //获取ftp 
        if(this.ftps.length == 0){
          this.loading = true;
          axios.post(this.$api.ftpList).then(res => {
            if(res.code = '200'){
              this.dataInfo.attr_ftp_id = res.body.length > 0 ?res.body[0].id:'';
              this.loading = false;
              this.ftps = res.body; 
            } 
          }).catch(err => {
            this.loading = false;
          });
       }
      }
    },
    interValUnitClick(val){
      this.intervalUnitDisabled = this.intervalUnitDisabled.map(function(e){return false;});
      if(val == 1){
        this.intervalUnitDisabled[0] = true;
      }else if(val ==2){
        this.intervalUnitDisabled[1] = true;
      }else if(val ==3){
        this.intervalUnitDisabled[4] = true;
        this.intervalUnitDisabled[5] = true;
      }else if(val ==4){
        this.intervalUnitDisabled[2] = true;
        this.intervalUnitDisabled[4] = true;
        this.intervalUnitDisabled[5] = true;
      }else if(val ==5){
        this.intervalUnitDisabled[3] = true;
        this.intervalUnitDisabled[4] = true;
        this.intervalUnitDisabled[5] = true;
      }
    },
    execyClick(val){
      if(val == 1){
         this.execycleDisplay =  true;
         this.dataInfo.intervalUnit = 1;
         this.interValUnitClick(this.dataInfo.intervalUnit);
      }else{
         this.execycleDisplay = false;  
      }
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.crontabGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          if(id == 0){            
            this.dataInfo.type = 1;
            this.dataInfo.execycle = 1;
            this.dataInfo.intervalUnit = 1;
            this.selectChannels = [''];
            this.ftpForld = [''];
          }else{
            if(this.dataInfo.type == 2 || this.dataInfo.type == 3){
              axios.post(this.$api.channelGet,{id:this.dataInfo.attr_channel_id}).then(data=>{
                if(data.code == '200'){
                  this.selectChannels = data.body.nodeIds;
                }
              });
            }
            if(res.body.attr_ftp_id != null && typeof(res.body.attr_ftp_id)!="undefined"){
              for(let key in res.body){ 
                if(key.indexOf('attr_floder') >= 0 ){
                    this.ftpForld.push(res.body[key]);
                }
              }  
            }
            this.execyClick(this.dataInfo.execycle)
            this.clickType(this.dataInfo.type);
            this.interValUnitClick(this.dataInfo.intervalUnit);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getParam(){
      switch(this.dataInfo.type){
        case 2:
        case 3:
           //栏目
          this.ftpForld = []; 
          this.dataInfo.attr_acqu_id = '';
          this.dataInfo.attr_ftp_id = '';
          break;
        case 4:
          this.ftpForld = [];
          this.dataInfo.attr_channel_id = '';
          this.dataInfo.attr_ftp_id = '';  
          break;
        case 5:
           //分发
          this.dataInfo.attr_channel_id = '';
          this.dataInfo.attr_acqu_id = '';
          break;
        default:
          this.ftpForld = [];
          this.dataInfo.attr_ftp_id = '';
          this.dataInfo.attr_acqu_id = '';
          this.dataInfo.attr_channel_id = '';
          break;
      }


      if(this.dataInfo.execycle == 1){
         //执行周期
        this.dataInfo.cronExpression = '';
        switch(this.dataInfo.intervalUnit){
          case 1:
            this.dataInfo.hour = '';
            this.dataInfo.dayOfWeek = '';
            this.dataInfo.dayOfMonth = '';
            this.dataInfo.intervalHour = '';
            this.dataInfo.minute = '';
            break;
          case 2:
            this.dataInfo.hour = '';
            this.dataInfo.dayOfWeek = '';
            this.dataInfo.dayOfMonth = '';
            this.dataInfo.intervalMinute = '';
            this.dataInfo.minute = '';
            break;
          case 3:
            this.dataInfo.dayOfWeek = '';
            this.dataInfo.dayOfMonth = '';
            this.dataInfo.intervalMinute = '';
            this.dataInfo.intervalHour = '';
            break;
          case 4:
            this.dataInfo.dayOfMonth = '';
            this.dataInfo.intervalMinute = '';
            this.dataInfo.intervalHour = '';
            break;
          case 5:
            this.dataInfo.dayOfWeek = '';
            this.dataInfo.intervalMinute = '';
            this.dataInfo.intervalHour = '';
            break;
        }
      }else{
        //ctor表达式
        this.dataInfo.intervalMinute = '';
        this.dataInfo.intervalHour = '';
        this.dataInfo.dayOfMonth = '';
        this.dataInfo.dayOfWeek = '';
        this.dataInfo.dayOfWeek = '';
        this.dataInfo.minute = '';
      }

      if(this.dataInfo.attr_ftp_id != null && typeof(this.dataInfo.attr_ftp_id)!="undefined"){
        for(let key in this.dataInfo){ 
          if(key.indexOf('attr_floder') >= 0 ){
              delete this.dataInfo[key];
          }
        }  
      }
      for(let index in this.ftpForld){
        this.dataInfo['attr_floder_'+index] = this.ftpForld[index];
      }
      if(this.selectChannels.length > 0){
        this.dataInfo.attr_channel_id = this.selectChannels[this.selectChannels.length-1]; 
      }
      this.dataInfo.jobClass = this.jobClass[this.dataInfo.type-1];
    },
    update(state) {
      this.getParam();
      this.updateDataInfo(this.$api.crontabUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.getParam();
      this.saveDataInfo(state,this.$api.crontabSave, this.dataInfo, "list");
    },
    ftpDelete(index){
      this.ftpForld.splice(index,1);
    },
    ftpAdd(){
      this.ftpForld.push('');
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>


<style scoped>
.el-input-group{
  width: 20%;
} 
.cms-body .cms-form .flex-100,.cms-body .cms-form .flex-50{
  border-top: 1px dashed #eee;
}
.cms-body .cms-form .flex-no-border{
 border-top: 0px dashed #eee; 
}
.cms-body .cms-col1{
  width: 10%
}
.cms-body .cms-col2{
  width: 20%
}
.cms-body .cms-col3{
  width: 30%
}
.cms-body .cms-col4{
  width: 40%
}
.cms-body .cms-col5{
  width: 50%
}
.cms-body .cms-col6{
  width: 60%
}
.cms-body .cms-col7{
  width: 70%
}
.cms-body .cms-col8{
  width: 80%
}
.cms-body .cms-col9{
  width: 90%
}
.cms-body .cms-col10{
  width: 100%
}
.el-form-item__error {
 left:35%;
}
.ftp-div{
  margin-top: 16px;
}
</style>
