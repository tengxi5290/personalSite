<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" class="cms-form" label-width="162px">
            <el-form-item label="发件人" class="flex-100"  prop="username">
               <el-input :disabled='true' v-model="dataInfo.msgReceiverUserName" class="cms-width" ></el-input>
            </el-form-item>       
            <el-form-item label="发送时间:" class="flex-100"  prop="sendTime">
               <el-input :disabled='true' v-model="dataInfo.sendTime" class="cms-width" ></el-input>
            </el-form-item>  
             <el-form-item label="标题" class="flex-100"  prop="msgTitle">
               <el-input :disabled='true' v-model="dataInfo.msgTitle" class="cms-width"></el-input>
            </el-form-item>  
              <el-form-item label="内容" class="flex-100"  prop="msgContent">
               <el-input :disabled='true' v-model="dataInfo.msgContent" class="cms-width"></el-input>
            </el-form-item>     

            <div class="form-footer">
                <el-button v-show="box===3" type="warning" @click="del($api.messageEmpty,id)"
                    v-perms="'/message/deletes'"
                >彻底删除</el-button>
                <el-button v-show="box===0" type="warning" @click="routerLink('/message/reply','',id)"
                    v-perms="'/message/reply'"
                >回复</el-button>
                <el-button type="primary"  @click="routerLink('/message/forward','',id)"
                    v-perms="'/message/forward'"
                >转发</el-button>
                <el-button v-show="box!=3" type="info" @click="del($api.messageTrash,id)"
                      v-perms="'/message/empty'"
                >删除</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import listMixin from '@/mixins/list';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins,listMixin],
    data() {
  
    return {
      box:'',
      params: {//只需要业务参数

      },

    };
  },
     methods:{
         del(url,id){
             axios.post(url,{ids:id}).then(res=>{
                   this.routerLink('list','',0) 
             })
         },
        getDataInfo(id){
         this.box= this.$route.query.box;
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.messageRead, {id:id,msgBox:this.$route.query.box}), //axios批量发送请求
        ])
        .then(
            axios.spread((message)=>{
                this.dataInfo=message.body;
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        add(state) {
          
        },
    
        
  },
  created(){
    //初始获取数据
    console.log(this.$route.query.box)
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>