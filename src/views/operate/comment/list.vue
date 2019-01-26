<template>

  <section v-loading="loading" class="cms-body">
    <!-- 查询表单 -->
    <div class="cms-list-header">
      <el-row>
        <el-col :span="12">
          <el-select v-model="params.queryChecked" @change="custQuery">
            <el-option label="审核状态" value=''></el-option>
            <el-option label="等待审核" :value="'0'"></el-option>
            <el-option label="审核通过" :value="'1'"></el-option>
            <el-option label="审核不通过" :value="'2'"></el-option>
          </el-select> 
          <el-select v-model="params.queryRecommend"  @change="custQuery">
            <el-option label="是否推荐" value=''></el-option>
            <el-option label="是" :value="'true'"></el-option>
            <el-option label="否" :value="'false'"></el-option>
          </el-select> 
        </el-col>
        <el-col :span="12" class="text-right">
          <cms-input v-model="params.queryContentId" label="文章ID"></cms-input>
          <el-button @click="custQuery">查询</el-button> 
        </el-col>
      </el-row>
    </div> 
    <section v-for="(item,index) in tableData" :key="index" >
      <header class="header">
          <el-row>
            <el-col :span="8" class="title">
              <el-checkbox v-model="checks[index]"  @change="check(index)"></el-checkbox>&nbsp;&nbsp;
              <span >[{{tableData[index].channelName}}]</span>
              <a :href="tableData[index].contentURL" target="_blank">{{tableData[index].contentTitle}}</a>
            </el-col>
            <el-col :span="2">
               <span class="contentId">文章ID：{{tableData[index].contentId}}</span>
            </el-col>
            <el-col :span="2">
              <el-button v-perms="'/comment/itemList'" class="small-btn" @click="routerLink('/comment/itemList','list',tableData[index].contentId)">查看本文全部评论</el-button>
            </el-col>
          </el-row>
      </header>
      <section class="container">
        <div class="content-container">
            <el-row>
              <el-col :span="18">
                <!-- 评论显示区域 --> 
                <el-row v-show="tableData[index].commentDisplayDisabled">
                  <el-col :span="3">
                    <div class="tip primy tip-right">
                     评论内容
                    </div>
                  </el-col>
                  <el-col :span="19">
                    <div class="content-textarea">
                      <span class="read-color" v-show="tableData[index].recommend">[推荐]</span>
                      {{tableData[index].text}}
                    </div>
                  </el-col>
                </el-row>
                <!-- 修改评论框显示区域 -->
                <el-row class="reply comment" v-show="tableData[index].commentDisabled" >
                  <el-col :span="3">
                    <div class="tip primy tip-right">
                      评论内容
                    </div>
                  </el-col>
                  <el-col :span="19" >
                    <div class="reply-textarea comment-textarea" >
                      <el-input type="textarea" v-model="commentContent[index]" placeholder="请输入评论内容"></el-input>
                      <div class="btn-group">
                        <el-button class="small-btn submit" @click="submitComment(index,tableData[index].id)">提交</el-button> 
                        <el-button class="small-btn cancel" @click="cancelComment(index)">取消</el-button> 
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- 已回复显示区域 -->
                <el-row class="reply" v-show="tableData[index].replyDisplayDisabled">
                  <el-col :span="3">
                    <div class="tip warn tip-right">回复内容</div>
                  </el-col>
                  <el-col :span="19" >
                    <div class="content-textarea">
                      {{tableData[index].replyContent}}
                    </div>
                  </el-col>
                </el-row>
                <!-- 回复/修改回复框显示区域 -->
                <el-row class="reply" v-show="tableData[index].replyDisabled ">
                  <el-col :span="3">
                    <div class="tip warn tip-right">回复内容</div>
                  </el-col>
                  <el-col :span="19" >
                    <div class="reply-textarea" >
                      <el-input type="textarea" v-model="replyContent[index]" placeholder="请输入回复内容"></el-input>
                      <div class="btn-group">
                        <el-button class="small-btn submit" @click="submitReply(index,tableData[index].id)">提交</el-button> 
                        <el-button class="small-btn cancel" @click="cancelReply(index)">取消</el-button> 
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6" class="text-right">
                <p>
                  <span class="gray">审核状态：</span>
                  <span v-if="tableData[index].checked == 0" class="green-color">等待审核</span>
                  <span v-else-if="tableData[index].checked == 1" class="read-color">审核通过</span>
                  <span v-else-if="tableData[index].checked == 2" class="gray">审核不通过</span>
                </p>
              </el-col>
            </el-row>
        </div>
        <footer class="footer">
          <el-row>
            <el-col :span="12" class="gray">
              <span>评论者：{{tableData[index].commenteUsername}}</span>
              <span>评论时间：{{tableData[index].createTime}}</span>
              <span>IP：{{tableData[index].ip}}</span>
            </el-col>
            <el-col :span="12" class="text-right">
              <el-button v-perms="'/comment/aduit'" class="small-btn" @click="aduit(tableData[index].id,1)">审核通过</el-button> 
              <el-button v-perms="'/comment/aduit'" class="small-btn" @click="aduit(tableData[index].id,2)">审核不通过</el-button>
              <el-button v-perms="'/comment/updateComment'" class="small-btn" @click="clickComment(index)">修改评论</el-button> 
              <el-button v-perms="'/comment/reply'" v-show="!tableData[[index]].replyBtnDisabled" class="small-btn" @click="clickReply(index)">回复</el-button> 
              <el-button v-perms="'/comment/reply'" v-show="tableData[[index]].replyBtnDisabled" class="small-btn" @click="clickReply(index)">修改回复</el-button> 
              <el-button v-perms="'/comment/reCommend'" v-show="!tableData[index].recommend" class="small-btn" @click="clickRecommend(index,true)">推荐</el-button>  
              <el-button v-perms="'/comment/reCommend'" v-show="tableData[index].recommend" class="small-btn" @click="clickRecommend(index,false)">取消推荐</el-button>  
              <el-button v-perms="'/comment/delete'" class="small-btn" @click="deleteBatch($api.commentDelete,tableData[index].id)">删除</el-button> 
            </el-col>
          </el-row>
        </footer>
      </section>
    </section>

    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-checkbox v-model="checks[tableData.length]"  @change="check(-1)"></el-checkbox>&nbsp;&nbsp;
        
        <el-button :disabled="disabled" @click="aduit(ids,1)" v-perms="'/comment/aduit'"
        >审核通过</el-button>
        <el-button :disabled="disabled" @click="aduit(ids,2)" v-perms="'/comment/aduit'"
        >审核不通过</el-button>
        <el-button :disabled="disabled" @click="deleteBatch($api.commentDelete,ids)" v-perms="'/comment/delete'"
        >批量删除</el-button>
      </div>    
      <div>
      </div>
         <!-- cms分页组件 -->
        <cms-pagination :total="total" @change="getPages"></cms-pagination>
      </div>  
      </div>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
import { setBaseUrl } from '@/config.js'
export default {
  mixins:[listMixins],
  data(){
    return {
      globalUrl:setBaseUrl(),
      params:{
        queryChecked:'',
        queryContentId:'',
        queryRecommend:'',
        pageNo: 1,
        pageSize:10,
      },
      checks:[],
      replyContent:[],
      commentContent:[],
      commentTypes:[],
    }
  },
  methods:{
    //修改评论按钮点击事件
    clickComment(index){
      this.tableData[index].commentDisabled = true;
      this.tableData[index].commentDisplayDisabled = false;
      this.commentContent[index] = this.tableData[index].text;
    },
    //修改评论中取消按钮点击事件
    cancelComment(index){
      this.tableData[index].commentDisplayDisabled = true;
      this.tableData[index].commentDisabled = false;
    },
    //修改评论中提交按钮点击事件
    submitComment(index,commentId){
      let content = this.commentContent[index];
      if(content == '' || typeof(content) == 'undefined'){
        this.errorMessage('请填写评论信息');
        return false;
      }
      this.loading = true;
      let param = {};
      param.id = commentId;
      param.checked = this.tableData[index].checked;
      param.recommend = this.tableData[index].recommend;
      param.reply = this.tableData[index].reply;
      param.text = content;
      axios.post(this.$api.commentUpdate,param).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('修改评论成功');
          this.tableData[index].text = this.commentContent[index];
          
          this.tableData[index].commentDisabled = false;      
          this.tableData[index].commentDisplayDisabled = true;
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //修改回复及回复按钮点击事件
    clickReply(index){
      if(this.tableData[index].replyOperate =='update'){
        this.replyContent[index] = this.tableData[index].replyContent;
        this.tableData[index].replyDisplayDisabled = false;
      }
      this.tableData[index].replyDisabled = true;
    },
    //修改回复中取消按钮点击事件
    cancelReply(index){
      if(this.tableData[index].replyOperate =='update'){
         this.tableData[index].replyDisplayDisabled = true;
      }
      this.tableData[index].replyDisabled = false;
    },
    //修改回复中提交按钮点击事件
    submitReply(index,commentId){
      let content = this.replyContent[index];
      if(content == '' || typeof(content) == 'undefined'){
        this.errorMessage('请填写回复信息');
        return false;
      }
      this.loading = true;
      axios.post(this.$api.commentReply,{id:commentId,reply:content}).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          let mes = this.tableData[index].replyOperate =='update'? '修改回复成功':'回复成功';
          this.successMessage(mes);
          this.tableData[index].replyContent = this.replyContent[index];
          //回复控制属性
          this.tableData[index].replyDisabled = false;      
          this.tableData[index].replyDisplayDisabled = true;
          this.tableData[index].replyBtnDisabled = true;     
          if(this.tableData[index].replyOperate =='reply'){  
            this.tableData[index].replyOperate = 'update';   
          }
         
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //推荐点击事件
    clickRecommend(index,bool){
      this.loading = true;
      let commentId = this.tableData[index].id;
      axios.post(this.$api.commentRecommend,{id:commentId,isRecommend:bool}).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('操作成功');
          this.tableData[index].recommend = bool;
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //审核 bool :true 审核通过 false 不通过
    aduit(ids,status){
      this.loading = true;
      axios.post(this.$api.commentCheck,{ids:ids,isCheck:status}).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('操作成功');
          this.getTableData();
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //查询
    custQuery(){
      if(this.queryChecked == ''){
        delete this.params.queryChecked;
      }
      if(this.queryRecommend == ''){
        delete this.params.queryRecommend;
      }
      this.getTableData();
    },
    getTableData(){
      this.loading = true;
      axios.post(this.$api.commentList,this.params).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.tableData = [];
          this.checks = [];
          this.disabled = true;
          this.total = res.totalCount;
          for(let item of res.body){
            let obj = item;
            let disabled = obj.replyContent == ''? false : true;
            let replyOperate = obj.replyContent == ''? 'reply' : 'update';
            obj.replyDisplayDisabled = disabled;  //控制当前是否显示回复内容label布局
            obj.replyDisabled = false;            //控制当前是否显示回复textarea布局
            obj.replyBtnDisabled = disabled;      //控制当前显示修改回复或回复按钮
            obj.replyOperate = replyOperate;      //当前操作回复按钮类型reply:回复 update:修改回复

            //评论控制属性
            obj.commentDisabled = false;          //控制当前是否显示修改评论textarea布局
            obj.commentDisplayDisabled = true;    //控制当前是否显示评论label布局
            this.tableData.push(obj);
            this.checks.push(false);
          }
          this.checks.push(false);  //添加最后一个全选checkbox选中状态
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //checkbox选中触发事件
    check(index){
      if(index == -1){
        if(this.checks[this.checks.length-1]){
          this.checks = this.checks.map(function(e){return true;});
          this.disabled = false;
        }else{
          this.checks = this.checks.map(function(e){return false;});
          this.disabled = true;
        }
      }else{
        let checkFlaseCount = 0;
        for(let i = 0 ;i <  this.checks.length-1; i++){
          if(this.checks[i]){
            checkFlaseCount++;
          }
        }
        if(this.checks[index]){
          this.disabled = false;
          if(checkFlaseCount == this.checks.length-1){
            this.checks[this.checks.length-1] = true;
          }
        }else{
          if(checkFlaseCount > 0 ){
            this.disabled = false;
          }else{
            this.disabled = true;
          }
          this.checks[this.checks.length-1] = false;
        }
      }
      let ids = [];
      for(let i = 0 ;i <  this.checks.length-1; i++){
        if(this.checks[i]){
          ids.push(this.tableData[i].id);
        }
      }
      this.ids = ids.join(',');

    },
  },
  created(){
      this.getTableData();
  },
};
</script>
<style >
  .container{
    width: 100%;
    padding: 20px 24px;
    border-bottom: 1px dashed #e7ecf3;
  }
  .content-container{
    min-height: 60px;
  }
  .header,.container,.gray{
    font-size: 14px;
  }
  .gray{
    display: inline-block;
  }
  .read-color{
    color: red;
  }
  .green-color{
    color: #29D785;
  }
  .small-btn{
    padding: 5px 8px;
    min-width:50px;
  }
  .header{
    padding: 0px 24px;
    height: 50px;
    line-height: 50px;
    background-color: #F7F7F7;
    box-sizing: border-box;
  }
  .header .el-row{
    border-top: 1px #E7ECF3 solid；
    border-top
  }
  .header .title{
    overflow: hidden;
    min-width: 300px;
  }
  .header .title a{
    color: #5C93BF;
  }
  .header .contentId{
    color: #acb5bb
  }
  .footer{
    margin-top: 20px;
  }
  .footer .gray span{
    margin-right: 20px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .content-textarea{
    min-height: 50px;
    line-height: 30px;
  }
  .reply{
    margin-top: 30px;
  }
  .reply-textarea{
    position: relative;
    border:1px #EEE9DD solid;
    border-radius: 4px;
  }
  .reply-textarea textarea{
    border: 0px ;
    resize: none;
  }
  .reply-textarea .btn-group{
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
  .reply-textarea .btn-group span{
    color: #ffffff ;
  }
  .reply-textarea .submit{
    background-color: #00AEFF;
  }
  .reply-textarea .cancel{
    background-color: #C7C7C7;
  }
  .comment{
    margin-top: 0px;
  }
  .comment-textarea{
    border:1px #E7ECF3 solid; 
  }
</style>