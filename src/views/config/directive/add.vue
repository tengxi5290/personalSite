<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
             <el-form-item  label="模块:" class="flex-100"  prop="module">
                <el-select v-model="dataInfo.module">
                    <el-option value="channel" label="栏目"></el-option>
                    <el-option value="content" label="内容"></el-option>
                    <el-option value="comment" label="评论"></el-option>    
                    <el-option value="topic" label="专题"></el-option>     
                    <el-option value="vote" label="投票"></el-option>
                    <el-option value="guestbook" label="留言"></el-option>
                    <el-option value="advertise" label="广告"></el-option>
                    <el-option value="link" label="友情链接"></el-option>
                    <el-option value="tag" label="Tag"></el-option>
                </el-select>
            </el-form-item>    

            <el-form-item  label="参数:" class="flex-100" >
                <span v-if="dataInfo.module==='channel'">
                    <cms-channel :ad="ad" @change="getAd"></cms-channel>
                </span>
                 <span v-if="dataInfo.module==='comment'">
                    <cms-comment :ad="ad" @change="getAd"></cms-comment>
                </span>
                <span v-if="dataInfo.module==='content'">
                    <cms-content :ad="ad" @change="getAd"></cms-content>
                </span>
                <span v-if="dataInfo.module==='advertise'">
                    <cms-advertise :ad="ad" @change="getAd"></cms-advertise>
                </span>
                <span v-if="dataInfo.module==='topic'">
                    <cms-topic :ad="ad" @change="getAd"></cms-topic>
                </span>
                 <span v-if="dataInfo.module==='tag'">
                    <cms-tag :ad="ad" @change="getAd"></cms-tag>
                </span>
            </el-form-item>     



            <el-form-item  label="标签名:" class="flex-100"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width" type='required'></el-input>
            </el-form-item>       
            <el-form-item  label="标签描述:" class="flex-100"  prop="description">
                 <el-input
                    class=' cms-width'
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="dataInfo.description">
                </el-input>
            </el-form-item> 

            <div class="form-footer">
                <el-button type="warning" @click="add(true)"
                    v-perms="'/directive/add'"
                >提交并继续添加</el-button>
                <el-button type="primary"  @click="add(false)"
                    v-perms="'/directive/add'"
                >提交</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required();
    return {
      params: {//只需要业务参数
       
      },
      str:'',
      ad:{

      },
      rules: {
        //校验规则
        name:[required],
        module:[required],
      },
    };
  },
    methods:{
        getAd(value){
            this.ad=value;
            console.log(value)
        },
        getDataInfo(id){
            let api = this.$api; //API地址
            axios
            .all([
                axios.post(api.directiveGet, {id:id}), //axios批量发送请求
            ])
            .then(
                axios.spread((con)=>{                  
                    this.dataInfo=con.body;
                    this.$refs["form"].resetFields();
                    this.loading = false;
                })
            )
            .catch(err => {
            this.loading = false;
            });
         },
        add(state) {  
             let AddParam={};
             AddParam=this.ad;
             AddParam.module=this.dataInfo.module;
             AddParam.name=this.dataInfo.name;
             AddParam.description=this.dataInfo.description;
             this.saveDataInfo(state,this.$api.directiveSave, AddParam, "list");
        }      
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>
