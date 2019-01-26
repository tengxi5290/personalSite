<template>

  <section v-loading="loading" class="cms-body">
    <!-- 查询表单 -->
    <div class="cms-list-header">
       <el-row>
        <el-col :span="12">
          <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/guestbook/save','save',0)" v-perms="'/guestbook/add'" >添加
          </el-button>  
          <el-button   @click="routerLink('/guestbookType/list','list',0)" v-perms="'/guestbookType/list'" >留言类型管理
          </el-button>  
        </el-col>
        <el-col :span="12" class="text-right">
          <el-select v-model="params.queryCtgId" @change="custQuery">
            <el-option label="留言类型" value=''></el-option>
            <el-option v-for="(item,index) in guestbookTypes" :key="index" :label="guestbookTypes[index].name" :value="guestbookTypes[index].id"></el-option>
          </el-select> 
          <el-select v-model="params.queryChecked" @change="custQuery">
            <el-option label="审核状态" value=''></el-option>
            <el-option label="待审核" :value="'0'"></el-option>
            <el-option label="审核通过" :value="'1'"></el-option>
            <el-option label="审核不通过" :value="'2'"></el-option>
          </el-select> 
          <el-select v-model="params.queryRecommend"  @change="custQuery">
            <el-option label="是否推荐" value=''></el-option>
            <el-option label="是" :value="'true'"></el-option>
            <el-option label="否" :value="'false'"></el-option>
          </el-select> 
        </el-col>
      </el-row>
    </div> 
    <section v-for="(item,index) in tableData" :key="index" >
      <header class="header">
          <el-row>
            <el-col :span="8" class="title">
              <el-checkbox v-model="checks[index]"  @change="check(index)"></el-checkbox>&nbsp;&nbsp;
              留言类型:<a href="javasvript:;">[{{tableData[index].ctgName}}]</a>
              <a href="" target="_blank"></a>
            </el-col>
            <el-col :span="2">
               <span class="contentId">留言ID：{{tableData[index].id}}</span>
            </el-col>
          </el-row>
      </header>
      <section class="container">
        <div class="content-container">
            <el-row>
              <el-col :span="18">
                <!-- 评论显示区域 --> 
                <el-row v-show="tableData[index].guestbookDisplayDisabled">
                  <el-col :span="3">
                    <div class="tip primy tip-right">
                      留言内容
                    </div>
                  </el-col>
                  <el-col :span="19">
                    <div class="content-textarea">
                      <span class="read-color" v-show="tableData[index].recommend">[推荐]</span>
                      {{tableData[index].content}}
                    </div>
                  </el-col>
                </el-row>
                <!-- 修改评论框显示区域 -->
                <el-row class="reply guestbook" v-show="tableData[index].guestbookDisabled" >
                  <el-col :span="3">
                    <div class="tip primy tip-right">
                      留言内容
                    </div>
                  </el-col>
                  <el-col :span="19" >
                    <div class="reply-textarea guestbook-textarea" >
                      <el-input type="textarea" v-model="guestbookContent[index]" placeholder="请输入留言内容"></el-input>
                      <div class="btn-group">
                        <el-button class="small-btn submit" @click="submitguestbook(index,tableData[index].id)">提交</el-button> 
                        <el-button class="small-btn cancel" @click="cancelguestbook(index)">取消</el-button> 
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
                      {{tableData[index].reply}}
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
                  <span v-if="tableData[index].checked == 0" class="green-color">待审核</span>
                  <span v-else-if="tableData[index].checked == 1" class="read-color">审核通过</span>
                  <span v-else-if="tableData[index].checked == 2" class="gray">审核不通过</span>
                </p>
              </el-col>
            </el-row>
        </div>
        <footer class="footer">
          <el-row>
            <el-col :span="12" class="gray">
              <span>邮箱：{{tableData[index].email}}</span>
              <span>联系电话：{{tableData[index].phone}}</span>
              <span>QQ：{{tableData[index].qq}}</span>
            </el-col>
            <el-col :span="12" class="text-right">
              <el-button v-perms="'/guestbook/check'" class="small-btn" @click="aduit(tableData[index].id,1)">审核通过</el-button> 
              <el-button v-perms="'/guestbook/check'" class="small-btn" @click="aduit(tableData[index].id,2)">审核不通过</el-button>
              <el-button v-perms="'/guestbook/update'" class="small-btn" @click="clickguestbook(index)">修改留言</el-button> 
              <el-button v-perms="'/guestbook/update'" v-show="!tableData[[index]].replyBtnDisabled" class="small-btn" @click="clickReply(index)">回复</el-button> 
              <el-button v-perms="'/guestbook/update'" v-show="tableData[[index]].replyBtnDisabled" class="small-btn" @click="clickReply(index)">修改回复</el-button> 
              <el-button v-perms="'/guestbook/reCommend'" v-show="!tableData[index].recommend" class="small-btn" @click="clickRecommend(index,true)">推荐</el-button>  
              <el-button v-perms="'/guestbook/reCommend'" v-show="tableData[index].recommend" class="small-btn" @click="clickRecommend(index,false)">取消推荐</el-button>  
              <el-button v-perms="'/guestbook/delete'" class="small-btn" @click="deleteBatch($api.guestbookDelete,tableData[index].id)">删除</el-button> 
            </el-col>
          </el-row>
        </footer>
      </section>
    </section>

    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-checkbox v-model="checks[tableData.length]"  @change="check(-1)"></el-checkbox>&nbsp;&nbsp;
        
        <el-button :disabled="disabled" @click="aduit(ids,1)" v-perms="'/guestbook/check'"
        >审核通过</el-button>
        <el-button :disabled="disabled" @click="aduit(ids,2)" v-perms="'/guestbook/check'"
        >审核不通过</el-button>
        <el-button :disabled="disabled" @click="deleteBatch($api.guestbookDelete,ids)" v-perms="'/guestbook/delete'"
        >删除</el-button>
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
        queryCtgId:'',
        queryRecommend:'',
        pageNo: 1,
        pageSize:10,
      },
      checks:[],
      replyContent:[],
      guestbookContent:[],
      guestbookTypes:[],
    }
  },
  methods:{
    //修改留言按钮点击事件
    clickguestbook(index){
      this.tableData[index].guestbookDisabled = true;
      this.tableData[index].guestbookDisplayDisabled = false;
      this.guestbookContent[index] = this.tableData[index].content;
    },
    //修改留言中取消按钮点击事件
    cancelguestbook(index){
      this.tableData[index].guestbookDisplayDisabled = true;
      this.tableData[index].guestbookDisabled = false;
    },
    //修改留言中提交按钮点击事件
    submitguestbook(index,guestbookId){
      let content = this.guestbookContent[index];
      if(content == '' || typeof(content) == 'undefined'){
         this.errorMessage('请填写留言内容');
        return false;
      }
      this.loading = true;
      let object = this.tableData[index];
      let param = {};
      param.id = guestbookId;
      param.checked = object.checked;
      param.recommend = object.recommend;
      param.reply = object.reply;
      param.content = content;
      param.ctgId = object.ctgId;
      param.title = object.title;
      param.reply = object.reply;
      param.email = object.email;
      param.phone = object.phone;
      axios.post(this.$api.guestbookUpdate,param).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('修改留言成功');
          this.tableData[index].content = this.guestbookContent[index];
          
          this.tableData[index].guestbookDisabled = false;      
          this.tableData[index].guestbookDisplayDisabled = true;
        }
      }).catch(err=>{
        this.loading = false;
      });
    },
    //修改回复及回复按钮点击事件
    clickReply(index){
      if(this.tableData[index].replyOperate =='update'){
        this.replyContent[index] = this.tableData[index].reply;
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
    submitReply(index,guestbookId){
      let content = this.replyContent[index];
      let object = this.tableData[index];
      if(content == '' || typeof(content) == 'undefined'){
        this.errorMessage('请填写回复内容');
        return false;
      }
      this.loading = true;
      let obj = {
        id:guestbookId,
        ctgId:object.ctgId,
        title:object.title,
        content:object.content,
        reply:content,
        email:object.email,
        phone:object.phone,
        qq:object.qq,
        checked:object.checked,
        recommend:object.reCommend,
      }
      axios.post(this.$api.guestbookUpdate,obj).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          let mes = this.tableData[index].replyOperate =='update'? '修改回复成功':'回复成功';
          this.successMessage(mes);
          this.tableData[index].reply = this.replyContent[index];
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
      let guestbookId = this.tableData[index].id;
      axios.post(this.$api.guestbookRecommend,{id:guestbookId,isRecommend:bool}).then(res=>{
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
      axios.post(this.$api.guestbookCheck,{ids:ids,isCheck:status}).then(res=>{
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
    getGuestBookType(){
      axios.post(this.$api.guestbookTypeList).then(res=>{
        if(res.code == '200'){
          this.guestbookTypes = res.body;
        }
      })
    },
    getTableData(){
      this.loading = true;
      axios.post(this.$api.guestbookList,this.params).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.tableData = [];
          this.checks = [];
          this.disabled = true;
          this.total = res.totalCount;
          for(let item of res.body){
            let obj = item;
            let disabled = obj.reply == ''? false : true;
            let replyOperate = obj.reply == ''? 'reply' : 'update';
            obj.replyDisplayDisabled = disabled;  //控制当前是否显示回复内容label布局
            obj.replyDisabled = false;            //控制当前是否显示回复textarea布局
            obj.replyBtnDisabled = disabled;      //控制当前显示修改回复或回复按钮
            obj.replyOperate = replyOperate;      //当前操作回复按钮类型reply:回复 update:修改回复

            //评论控制属性
            obj.guestbookDisabled = false;          //控制当前是否显示修改评论textarea布局
            obj.guestbookDisplayDisabled = true;    //控制当前是否显示评论label布局
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
    this.getGuestBookType();
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
    max-height: 150px;
    overflow: hidden;
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
  .guestbook{
    margin-top: 0px;
  }
  .guestbook-textarea{
    border:1px #E7ECF3 solid !important; 
  }
   .el-dialog__body{
      min-height: 150px;
   }
</style>