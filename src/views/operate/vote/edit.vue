<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 名称 -->
        <el-form-item label="标题" class="flex-100 "  prop="title">
          <el-input class="cms-width" v-model="dataInfo.title"> </el-input>
        </el-form-item>
        <!-- 说明 -->
        <el-form-item label="说明" class="flex-100" >
          <el-input v-model="dataInfo.description" class="cms-width" type="textarea" ></el-input>
        </el-form-item>
        <!-- 有效时间 -->
        <el-form-item label="有效期" class="flex-50" >
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            align="right"
            value-format = "yyyy-MM-dd HH:mm:ss"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            >
          </el-date-picker>
          <!-- 修改后 -->
          <!-- <el-date-picker
            v-model="dateRange"
            :editable="false"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"  
            >
          </el-date-picker> -->
          <span class="gray">留空为不限制时间</span>
        </el-form-item> 
        <!-- 重复答卷限制 -->
        <el-form-item label="重复答卷限制" class="flex-50" prop="repeateHour">
          <el-input class="cms-width" v-model="dataInfo.repeateHour"></el-input>
          <span class="gray">单位：小时。为空禁止重复投票；0为不限制重复投票。</span>
        </el-form-item>
        <!-- 是否开启答卷限制 -->
        <el-form-item label="答卷限制" class="flex-50 ">
          <el-radio-group v-model="dataInfo.restrictMember"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
          <span class="gray">选择开启则表示必须登录才能参与答卷</span>
        </el-form-item>
        <el-form-item class="flex-50"> 
        </el-form-item>
        <!-- 设置问题区域 -->
        <el-form-item label=" " class="flex-100 ">
          <div class="cms-width el-input que-conent" v-for="(item,index) in queItems" :key="index">
            <el-row class="que-item">
              <el-col  :span="15">
                <el-input class="cms-width" placeholder="请输入问题标题" v-model="queItems[index].title" prop="queTitle">
                </el-input>
              </el-col>
              <el-col  :span="9">
                <el-form-item label="更换题型:" >
                  <el-select  placeholder="请选择"  v-model="queItems[index].type"  @change="swithcVoteType(index)">
                    <el-option label="单选题" :value="1"></el-option>
                    <el-option label="多选题" :value="2"></el-option>
                    <el-option label="问答题" :value="3"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="queItems[index].type != 3">
              <el-row class="que-item-title" >
                  <el-col :span="14">选项</el-col>
                  <el-col :span="5">图片</el-col>
                  <el-col :span="5">操作</el-col>
              </el-row>
              <el-row v-for="(obj,objIndex) in queItems[index].voteItems" :key="objIndex"> 
                <el-row class="que-item">
                  <el-col  :span="14" >
                    <el-input class="cms-width" placeholder="选项" v-model="queItems[index].voteItems[objIndex].title" prop="itemTitle">
                    </el-input>
                  </el-col>
                  <el-col  :span="5">
                    <cms-upload :src='queItems[index].voteItems[objIndex].picture' :pIndex="index" :index="objIndex" @change='getPath'></cms-upload>
                  </el-col>
                  <el-col  :span="5" >
                    <el-button icon="iconfont  icon-icon--3"  title="删除" @click="itemDelete(index,objIndex)"></el-button>
                    <el-button icon="iconfont  icon-icon--"  title="上移" @click="itemUp(index,objIndex)"></el-button>
                    <el-button icon="iconfont  icon-icon--1"  title="下移" @click="itemDown(index,objIndex)"></el-button>
                  </el-col>
                </el-row>
              </el-row>
            </template>
            <el-row class="que-item-btn text-right">
              <el-button  v-if="queItems[index].type != 3" @click="itemAdd(index)" icon="iconfont icon-tianjia" size="small">添加</el-button>
              <el-button @click="queUp(index)" icon="iconfont icon-jiantoushang" size="small">上移</el-button>
              <el-button @click="queDown(index)" icon="iconfont icon-jiantouxia" size="small">下移</el-button>
              <el-button @click="queTop(index)" icon="iconfont icon-huidaodingbu" size="small">最前</el-button>
              <el-button @click="queUnder(index)" icon="iconfont icon-huidaodingbu-copy" size="small">最后</el-button>
              <el-button @click="queDelete(index)" icon="iconfont icon-shanchu1" size="small">删除题目</el-button>
            </el-row>
          </div>
          <div class="cms-width el-input btn-add-group"  align="center">
            <el-button @click="queAdd(1)"  icon="el-icon-plus" size="small">添加单选题</el-button>
            <el-button @click="queAdd(2)"  icon="el-icon-plus" size="small">添加多选题</el-button>
            <el-button @click="queAdd(3)" icon="el-icon-plus" size="small">添加问答题</el-button>
          </div>
        </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')" @click="add(true)" v-perms="'/vote/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)" v-perms="'/vote/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/vote/update'">
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
    let number = va.number('请输入数字');
    return {
      dataInfo:{
      },
      dateRange:'',
      queItems:[],
      defaultRole:{},
      ftp_div_show:false,
      rules: {//校验规则
        title:[required],
        repeateHour:[number],
      },
      queFlage:false,
      voteFlage:false,
      fromFlage:false,
    };
  },
  methods: {
    //重置排序
    resetSort(arr){
      for(let i in arr){
        arr[i].priority = parseInt(i)+1;
      }
    },
    //切换题型事件
    swithcVoteType(index){
      let type = this.queItems[index].type;
      let obj = this.queItems[index];
      if(type == 3){
        delete obj.voteItems;
      }else{
        obj.voteItems = [{id:'', percent:0,title:'',voteCount:0,priority:1,picture:'', }];
      }
      this.$set(this.queItems,obj,index);
    },
    //单选题或多选题中选项 “删除” 按钮点击事件
    itemDelete(index,objIndex){
      this.queItems[index].voteItems.splice(objIndex,1);
    },

    //单选题或多选题中选项 “上移” 按钮点击事件
    itemUp(index,objIndex){
      if(objIndex == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems,objIndex);
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
    },
    //单选题或多选题中选项 “下移” 按钮点击事件
    itemDown(index,objIndex){
      if(this.queItems[index].voteItems.length == (objIndex+1)){
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems[index].voteItems,objIndex,'down');
      //重置排序
      this.resetSort(this.queItems[index].voteItems);
    },
    //单选题或多选题中选项 添加 按钮点击事件
    itemAdd(index){
      this.queItems[index].voteItems.push({id:'', percent:0,title:'',voteCount:0,priority:1,picture:'', });
    },
    //问题 “删除” 按钮点击事件
    queDelete(index){
      this.queItems.splice(index,1);
    },
    //问题 “上移” 按钮点击事件
    queUp(index){
      if(index == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems,index);
      //重置排序
      this.resetSort(this.queItems);
    },
    //问题 “下移” 按钮点击事件
    queDown(index){
      if(this.queItems.length == (index+1)){
        this.errorMessage("当前选项已经是最后一项，无法移动");
        return false;
      }
      //调换数组顺序
      this.$switchArrOrder(this.queItems,index,'down');
      //重置排序
      this.resetSort(this.queItems);
    },
    //问题 移动至最前 按钮点击事件
    queTop(index){
      if(index == 0){
        this.errorMessage("当前选项已经是第一项，无法移动");
        return false;
      }
      //调换数组顺序
      let objs = [];
      objs.push(this.queItems[index]);
      this.queItems.splice(index,1);
      objs = objs.concat(this.queItems);
      this.queItems = objs ;
      //重置排序
      this.resetSort(this.queItems);
    },
    //问题 移动至最后 按钮点击事件
    queUnder(index){
       if(this.queItems.length == (index+1)){
        this.errorMessage("当前选项已经是第后一项，无法移动");
        return false;
      }
      //调换数组顺序
      let obj = this.queItems[index];
      this.queItems.splice(index,1);
      this.queItems.push(obj);    
      //重置排序
      this.resetSort(this.queItems);
    },
    //添加问题点击事件
    queAdd(type){
      let que = {id:'',title:'',type:type,priority:1,voteItems:[{id:'',percent:0,title:'', voteCount:0, priority:1,picture:'',} ]}
      if(type == 3){
        que = {id:'',title:'', type:3,priority:1};
      }
      this.queItems.push(que);
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.voteGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          if(id == 0){
            this.queItems = [];
            this.queAdd(1);
          }else{
            if(res.body.subtopics.length > 0){
              this.queItems = res.body.subtopics;
              for(let i in this.queItems){
                if(this.queItems[i].type != 3 && !this.queItems[i].hasOwnProperty('voteItems')){
                  this.queItems[i].voteItems =  [{id:'', percent:0,title:'',voteCount:0,priority:1,picture:'', }];
                }
              }
            }
            this.dateRange = [res.body.startTime,res.body.endTime];
          }
        }).catch(err => {
          this.loading = false;
        });
    },
    getParam(){
        if(this.dateRange != null && this.dateRange.length > 1){
            this.dataInfo.startTime = this.dateRange[0];
            this.dataInfo.endTime = this.dateRange[1];
         }    
        this.dataInfo.source = JSON.stringify(this.queItems);
        delete this.dataInfo.subtopics;
    },
    getPath(path,objIndex,pIndex){
      this.queItems[pIndex].voteItems[objIndex].picture = path;
    },
    valiate(){
      this.fromFlage = this.voteFlage = this.queFlage = false;
      let arr = this.queItems;
      if(arr.length == 0){
        this.queFlage = true;
        return ;
      }
      for(let item of arr){
        if(item.title == ''){
          this.fromFlage = true;
          return ;
        }
        if(item.type != 3){
          if(item.voteItems == ''){
            this.voteFlage = true;
            return ;
          }
          if(item.voteItems.length == 0){
            this.voteItems = true;
            return ;
          }
          let arr1 = item.voteItems;
          for(let item1 of arr1){
            if(item1.title == ''){
              this.fromFlage = true;
              return ;
            }
          }
        }
      }
    },
    update(state) {
      this.valiate();
      if(this.queFlage){
        this.errorMessage('调查问卷至少添加一项题目，请确认!');
        return false;
      }
      if(this.voteFlage){
        this.errorMessage('单选题或多选题至少添加一项选项，请确认!');
        return false;
      }
      if(this.fromFlage){
        this.errorMessage('题目或题目选项未填写，请确认!');
        return false;
      }
      this.getParam();
      console.log(this.$api.voteUpdate);
      this.updateDataInfo(this.$api.voteUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.valiate();
      if(this.queFlage){
        this.errorMessage('调查问卷至少添加一项题目，请确认!');
        return false;
      }
      if(this.voteFlage){
        this.errorMessage('单选题或多选题至少添加一项选项，请确认!');
        return false;
      }
      if(this.fromFlage){
        this.errorMessage('题目或题目选项未填写，请确认!');
        return false;
      }
      this.getParam();
      this.saveDataInfo(state,this.$api.voteSave, this.dataInfo, "list");
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>
<style >
.que-conent,
.btn-add-group{
  padding: 10px;
  box-sizing: border-box;
  background-color: #FBFDFF;
  border: 1px dashed #E8EFF4;
  margin-top:10px;
}
.el-row .el-col .cms-upload .cms-upload-box ,
.el-row .el-col .cms-upload .avatar-uploader-icon,
.el-row .el-col .cms-upload .cms-upload-box .cms-progress,
.el-row .el-col .cms-upload .cms-upload-box .el-progress-circle{
  width: 60px !important;
  height: 60px !important;
  line-height: 60px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-icon{
  width: 50px;
  left:50%;
  margin-left: -20px;
  margin-top: -20px;
  font-size: 13px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-zoom-font{
  font-size: 10px;
}
.el-row .el-col .cms-upload .cms-upload-box .cms-img-bottom{
  height: 20px;
  line-height: 20px;
}
.que-item-title{
  height: 20px;
  line-height: 20px;
}
.que-item{
  height: 70px;
  line-height: 70px;
}
.que-item .el-button{
  padding: 0px 0px;
  min-width: 0px;
  border: 0px solid #dcdfe6;
  color:#9DBED7;
}
.que-item .el-button:hover,
.que-item-btn .el-button:hover{
  background-color: #FFFFFF;
}
.que-item .el-button:focus,
.que-item-btn .el-button:focus {
  background-color: #FFFFFF;
} 
.que-item .el-button:active,
.que-item-btn .el-button:active {
  background-color: #FFFFFF;
} 
.que-item .el-button .iconfont{
  font-size: 30px;
}
.que-item-btn .el-button{
  margin: 20px 0px;
  padding: 7px 10px;
  min-width: 0px;
  border: 1px solid #FFCBA1;
  color:#FFCBA1;
}
.que-item-btn .el-button .iconfont {
  font-size: 12px;
  font-weight: 100;
}
.que-item .el-form-item{
  border:0px;
}
.el-form-item__error {
    left: 84%;
}

</style>
