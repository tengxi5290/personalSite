<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 采集名称 -->
        <el-form-item label="采集名称" class="flex-50 "  prop="name">
          <el-input class="cms-width" v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 入库类型 -->
        <el-form-item label="入库类型" class="flex-50 "  prop="domain">
          <el-select v-model="dataInfo.typeId" class="cms-width">
            <el-option v-for="(item,index) in types" :key="index" :label="types[index].name" :value="types[index].id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 入库栏目 -->
        <el-form-item  label="入库栏目" class="flex-50"  prop="channelId" >
             <el-cascader
              :props="{'value':'id','label':'name','children':'child'}"
              :options="channels"
              change-on-select
              filterable
              v-model="selectChannels" class="cms-width">
            </el-cascader>
        </el-form-item> 
        <!-- 页面编码-->
        <el-form-item label="页面编码" class="flex-50 "  prop="pageEncoding">
          <el-input class="cms-width" v-model="dataInfo.pageEncoding" > </el-input>
        </el-form-item>
        <!-- 暂停时间 -->
        <el-form-item label="暂停时间" class="flex-50 "  prop="pauseTime">
          <el-input class="cms-width" v-model="dataInfo.pauseTime" type="number"> </el-input>
          <span class="gray">每采集一篇文章暂停时间。单位(毫秒)</span>
        </el-form-item>
        <!-- 是否采集图片 -->
        <el-form-item label="是否采集图片" class="flex-50 "  prop="imgAcqu">
          <el-radio-group v-model="dataInfo.imgAcqu"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
          <span class="采集图片耗时较长，请酌情选择"></span>
        </el-form-item>
        <!-- 发布格式 -->
        <el-form-item label="发布时间格式" class="flex-50 ">
          <el-input class="cms-width" v-model="dataInfo.releaseTimeFormat"> </el-input>
          <span class="gray">例如：yyyy-MM-dd HH:mm:ss</span>
        </el-form-item>
          <!-- 是否默认类型图片 -->
        <el-form-item label="是否默认类型图片" class="flex-50 "  prop="defTypeImg">
          <el-radio-group v-model="dataInfo.defTypeImg"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
          <span class="gray">选择是：默认正文第一张为类型图 否：自定义</span>
        </el-form-item>
        <!-- 采集地址 -->
        <el-form-item label="采集地址" class="flex-100" >
          <el-input v-model="dataInfo.planList" class="cms-width" type="textarea" ></el-input>
          <span class="gray">多个地址请换行填写</span>
        </el-form-item>
        <!-- 动态地址-->
        <el-form-item label="动态地址" class="flex-100 "  >
          <el-input  v-model="dataInfo.dynamicAddr"  class="cms-col5"> </el-input>
          页码从<el-input  v-model="dataInfo.dynamicStart" class="cms-col1" type="number"> </el-input>至
          <el-input  v-model="dataInfo.dynamicEnd" class="cms-col1" type="number"> </el-input>
          <span class="gray">分页变量用[page]代替</span>
        </el-form-item>
         <!-- 内容地址补全url-->
        <el-form-item label="内容地址补全url" class="flex-100 "  >
          <el-input  v-model="dataInfo.contentPrefix" class="cms-width" > </el-input>
        </el-form-item>
          <!-- 分页链接地址补全url-->
        <el-form-item label="分页链接地址补全url" class="flex-100 "  >
          <el-input  v-model="dataInfo.contentPagePrefix" class="cms-width" > </el-input>
        </el-form-item>
        <!-- 图片地址补全url-->
        <el-form-item label="图片地址补全url" class="flex-100 "  >
          <el-input  v-model="dataInfo.imgPrefix" class="cms-width"> </el-input>
        </el-form-item>
        <!-- 内容地址集-->
        <el-form-item label="内容地址集" class="flex-100 "  >
          <el-row>
              <el-col :span="12">开始HTML</el-col>
              <el-col :span="12">结束HTML</el-col>
          </el-row>
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.linksetStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.linksetEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 内容地址-->
        <el-form-item label="内容地址" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.linkStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.linkEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
         <!-- 内容分页地址-->
        <el-form-item label="内容分页地址" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.contentPageStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.contentPageEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
         <!-- 内容分页链接地址-->
        <el-form-item label="内容分页链接地址" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.pageLinkStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.pageLinkEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
         <!-- 类型图-->
        <el-form-item label="类型图" class="flex-100 "  v-if="!dataInfo.defTypeImg">
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.typeImgStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.typeImgEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 标题-->
        <el-form-item label="标题" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.titleStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.titleEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 描述-->
        <el-form-item label="描述" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.descriptionStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.descriptionEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 内容-->
        <el-form-item label="内容" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.contentStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.contentEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 浏览量-->
        <el-form-item label="浏览量" class="flex-100 ">
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.viewStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.viewEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 浏览量访问地址-->
        <el-form-item label="浏览量访问地址" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.viewLink" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.viewIdEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 作者-->
        <el-form-item label="作者" class="flex-100 " >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.authorStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.authorEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 来源-->
        <el-form-item label="来源" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.originStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.originEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
         <!-- 指定来源-->
        <el-form-item label="指定来源" class="flex-100 "  >
          <el-row>
              <el-col :span="24">
                <el-input v-model="dataInfo.originAppoint" class="cms-width" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
        <!-- 发布时间-->
        <el-form-item label="发布时间" class="flex-100 "  >
          <el-row>
              <el-col :span="12">
                <el-input v-model="dataInfo.releaseTimeStart" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="dataInfo.releaseTimeEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
              </el-col>
          </el-row>
        </el-form-item>
         <!-- 屏蔽内容-->
        <el-form-item class="flex-100 "  >
            <el-button type="warning" @click="addShield()" > 添加屏蔽内容</el-button> 
        </el-form-item>
        <el-form-item v-for="(item,index) in shields" :key="index" label="内容屏蔽" class="flex-100 "  >
            <el-row>
                <el-col :span="12">
                  <el-input v-model="item.shieldStart" class="cms-width" type="textarea" maxlength="255"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-input v-model="item.shieldEnd" class="cms-width" type="textarea" maxlength="255"></el-input>
                </el-col>
                <el-col :span="2">
                  <cms-button  @click.native="deleteIndex(index)" type="delete"></cms-button>
                </el-col>
            </el-row>         
          </el-form-item>
          <!-- 批量替换-->
        <el-form-item class="flex-100 "  >
            <el-button type="warning" @click="addReplace()" > 添加替换</el-button> 
        </el-form-item>
        <el-form-item v-for="(item,index) in replaces" :key="index" label="替换" class="flex-100 "  >
            <el-row>
                <el-col :span="12">
                  <el-input v-model="item.keyword" class="cms-width" type="textarea" maxlength="255"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-input v-model="item.replaceWord" class="cms-width" type="textarea" maxlength="255"></el-input>
                </el-col>
                <el-col :span="2">
                  <cms-button  @click.native="deleteReplace(index)" type="delete"></cms-button>
                </el-col>
            </el-row>         
          </el-form-item>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')" @click="add(true)" v-perms="'/collectionmanage/save'">
             提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)" v-perms="'/collectionmanage/save'">
             提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()" v-perms="'/collectionmanage/update'">
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
    let required = va.required();
    let number = va.number();
    return {
      dataInfo:{
      },
      types:[],
      channels:[],
      selectChannels:[],
      shields:[],//屏蔽内容
      replaces:[],//替换内容
      rules: {//校验规则
        name:[required],
        pageEncoding:[required],
        channelId:[required,number],
        imgAcqu:[required],
        pauseTime:[required],
      }
    };
  },  
  methods: {
    getTypeList(val){
      axios.post(this.$api.typeList,{hasContentOnly:true}).then(res => {
        if(res.code == '200'){
          this.types = res.body; 
           if(this.dataInfo.typeId == ''){
             if(res.body.length > 0){
                this.dataInfo.typeId = res.body[0].id; 
             }
           }
        }
      }).catch(err => {
      });
    },
    getChannels(){
      axios.post(this.$api.fullTextSearchChannelList,{hasContentOnly:true}).then(res => {
        if(res.code == '200'){
          this.channels = res.body; 
          if(this.dataInfo.channelId == ''){
             if(res.body.length > 0){
                this.dataInfo.channelId = res.body[0].id; 
             }
           }
            axios.post(this.$api.channelGet,{id:this.dataInfo.channelId}).then(data=>{
                if(data.code == '200'){
                  this.selectChannels = data.body.nodeIds;
                }
              });
        }
      }).catch(err => {
      });
    },
    addShield(){
       let obj={id:"",shieldStart:'',shieldEnd:''};
       this.shields.push(obj);
    },
    addReplace(){
       let obj={id:"",keyword:'',replaceWord:''};
       this.replaces.push(obj);
    },
    deleteIndex(index){
       this.shields.splice(index,1);
    },
    deleteReplace(index){
       this.replaces.splice(index,1);
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.collectGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body.acq; 
          this.shields=res.body.shields;
          this.replaces=res.body.replaces;
          if(id == 0){
            this.dataInfo.dynamicStart= 2;
            this.dataInfo.dynamicEnd= 10;
            this.dataInfo.pageEncoding= 'utf-8';
            this.dataInfo.releaseTimeFormat= 'yyyy-MM-dd HH:mm:ss';
            this.dataInfo.imgAcqu=false;
            this.dataInfo.pauseTime = 500;
          }
          this.getChannels();
          this.getTypeList();
        }).catch(err => {
          this.loading = false;
        });
    },
    initParam(){
      if(this.selectChannels.length > 0){
        this.dataInfo.channelId = this.selectChannels[this.selectChannels.length-1]; 
      }
    },
    update() {
      this.initParam();
      this.dataInfo['shieldArrs']=JSON.stringify(this.shields);
      this.dataInfo['replaceArrs']=JSON.stringify(this.replaces);
      this.updateDataInfo(this.$api.collectUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.initParam();
      this.dataInfo['shieldArrs']=JSON.stringify(this.shields);
      this.dataInfo['replaceArrs']=JSON.stringify(this.replaces);
      this.saveDataInfo(state,this.$api.collectSave, this.dataInfo, "list");
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);

  }
};
</script>
<style scoped>
.cms-col5{
  width: 50%
}
.cms-col1{
  width: 10%
}
</style>
