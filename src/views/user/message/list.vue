<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header"> 
              <el-button type="primary" 
                @click="routerLink('/message/add','save',0)"
                v-perms="'/message/add'"          
              >发送站内信</el-button>         
         </div> 
         <div class="cms-list-header">  
                  <span class="demonstration cms-label">发送时间</span>
                  <el-date-picker
                    v-model="value4"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    :editable='false'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"	
                    @change='getTime()'
                    >
                  </el-date-picker>
          </div>
          <div class="cms-list-header">  
            <cms-input v-model="params.title" label="标题"></cms-input>
            <label class="cms-label">消息来源</label> 
            <el-select v-model="params.box" @change="query">
                <el-option label="收件箱" value="0"></el-option>
                <el-option label="发件箱" value="1"></el-option>
                <el-option label="垃圾箱" value="3"></el-option>   
            </el-select> 
            <label class="cms-label">消息状态 </label> 
            <el-select v-model="params.status" @change="query">
                <el-option label="已读" value="true"></el-option>
                <el-option label="未读" value="false"></el-option> 
            </el-select> 

            <el-button @click="query">查询</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="msgTitle" label="标题" align="center">
                  <div slot-scope="scope">
                      <a @click="routerLink('/message/seek','',scope.row.id,{box:scope.row.msgBox})">{{scope.row.msgTitle}}</a>
                  </div>
            </el-table-column>
            <el-table-column prop="msgSendUserUserName" label="发件人" align="center"></el-table-column>
            <el-table-column prop="sendTime" label="发送时间" align="center"></el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div v-if="params.box!=3" class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.messageTrash,ids)"
                       v-perms="'/message/delete'"
                  >批量删除</el-button>
                </div>

                <div v-if="params.box==3" class="cms-left">
                  <el-button :disabled="disabled" @click="revertBatch($api.messageRevert,ids)"
                      v-perms="'/message/revert'"
                  >还原</el-button>
                </div>
                <div v-if="params.box==3" class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.messageEmpty,ids)"
                       v-perms="'/message/deletes'"
                  >彻底删除</el-button>
                </div>
                <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
     </section> 
</template>

<script>
import listMixins from '@/mixins/list'
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
        title: "",
        sendBeginTime: "",
        sendEndTime: "",
        status:"",
        box:'',
        pageNo:'',
        pageSize:'',
      }
    };
  },methods:{
      getTime(){
          if(this.value4===null){
            this.params.sendBeginTime='';
            this.params.sendEndTime='';
          }else{
            this.params.sendBeginTime=this.value4[0];
            this.params.sendEndTime=this.value4[1];
          }  
          this.query();
      }
  },
  created(){
     this.initTableData(this.$api.messageList,this.params);
  }
};
</script>
    
<style>

</style>
