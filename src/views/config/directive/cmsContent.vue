<template>
      <section>
          <label class="cms-label">请选择分类(可不选) </label>
          <el-radio @change='rad' v-model='Params.type' label='list'>列表</el-radio>
          <el-radio @change='rad' v-model='Params.type' label='page'>分页</el-radio>
          <el-radio @change='rad' v-model='Params.type' label='single'>单个</el-radio>
          <el-radio @change='rad' v-model='Params.type' label='ids'>多个id</el-radio>
          </br>

       
                <span v-show="Params.type==='single'">
                    <label class="cms-label">请选择分类(可不选) </label>
                    <el-radio @change='rad' v-model='Params.singleType' label='n_'>下一篇</el-radio>
                    <el-radio @change='rad' v-model='Params.singleType' label='p_'>上一篇</el-radio>
                    <el-radio @change='rad' v-model='Params.singleType' label='a_'>某一篇</el-radio>
                </br>
                </span>

                <span v-show="Params.singleType==='a_'">  
                    <cms-input label="某一篇" v-model="Params.contentId"></cms-input>  
                    </br>  
                </span> 
                </span>
            <span v-show="Params.type!='single'">
       <span v-show="Params.type!='ids'">              
                    <label class="cms-label">调用系统模板 </label>
                    <el-radio @change='rad' v-model='Params.sys' label='list'>是</el-radio>
                    <el-radio @change='rad' v-model='Params.sys' label='page'>否</el-radio>
                    </br>
               <span v-show="Params.sys==='list'">     
                    <label class="cms-label">系统模板选择 </label>
                    <el-radio @change='rad' v-model='Params.tpl' label='1'>普通列表</el-radio>
                    <el-radio @change='rad' v-model='Params.tpl' label='2'>滚动列表</el-radio>
                    <el-radio @change='rad' v-model='Params.tpl' label='3'>焦点图</el-radio>
                    滚动列表、焦点图分页无效
                    </br>  
                    <label class="cms-label">普通列表 </label>
                    <el-radio @change='rad' v-model='Params.tpl1' label='1'>文字列表</el-radio>
                    <el-radio @change='rad' v-model='Params.tpl1' label='2'>图文列表</el-radio>
                    <el-radio @change='rad' v-model='Params.tpl1' label='3'>文字带点击量列表</el-radio>
                    </br>              
                    <cms-input label="行高" v-model="Params.lineHeight"></cms-input>  
                    </br>
                    <cms-input label="列表头图片" v-model="Params.headMarkImg"></cms-input>  
                    </br>  
                    <span>
                            <label class="cms-label">列表头编号 </label>
                            <el-radio @change='rad' v-model='Params.headMark' label='1'>小黑点</el-radio>
                            <el-radio @change='rad' v-model='Params.headMark' label='2'>小红点</el-radio>
                            <el-radio @change='rad' v-model='Params.headMark' label='3'>单箭头</el-radio>
                            <el-radio @change='rad' v-model='Params.headMark' label='4'>双箭头</el-radio>
                            <el-radio @change='rad' v-model='Params.headMark' label='all'>无列表头编号</el-radio>
                            </br> 
                    </span> 
                        <span>
                            <label class="cms-label">是否有下划线 </label>
                            <el-radio @change='rad' v-model='Params.bottomLine' label='1'>是</el-radio>
                            <el-radio @change='rad' v-model='Params.bottomLine' label='0'>否</el-radio>
                            </br> 
                    </span> 
                        <span>
                            <label class="cms-label">日期位置 </label>
                            <el-radio @change='rad' v-model='Params.datePosition' label='1'>后面左边</el-radio>
                            <el-radio @change='rad' v-model='Params.datePosition' label='2'>后面右边</el-radio>
                            <el-radio @change='rad' v-model='Params.datePosition' label='3'>前面</el-radio>
                            </br> 
                    </span>     
                        <span>
                            <label class="cms-label">类别 </label>
                            <el-radio @change='rad' v-model='Params.datePosition' label='0'>无</el-radio>
                            <el-radio @change='rad' v-model='Params.datePosition' label='1'>栏目</el-radio>
                            <el-radio @change='rad' v-model='Params.datePosition' label='2'>站点</el-radio>
                            </br> 
                    </span>  
                        <span>
                            <label class="cms-label">是否显示标题样式 </label>
                            <el-radio @change='rad' v-model='Params.showTitleStyle' label='0'>否</el-radio>
                            <el-radio @change='rad' v-model='Params.showTitleStyle' label='1'>是</el-radio>
                            </br> 
                    </span>  
                        <span>
                            <label class="cms-label">是否使用简短标题 </label>
                            <el-radio @change='rad' v-model='Params.useShortTitle' label='0'>否</el-radio>
                            <el-radio @change='rad' v-model='Params.useShortTitle' label='1'>是</el-radio>
                            </br> 
                    </span>
                </span>      
                        <span>
                                内容来源  优先级从高到低（例设置了tag 忽略tag下其他参数）
                                <cms-input label="TagID或Tag名称" v-model="Params.tag"></cms-input>  
                                <cms-input label="专题ID" v-model="Params.topic"></cms-input> 
                                <cms-input label="栏目ID" v-model="Params.channelId"></cms-input>  
                                <cms-input label="栏目路径" v-model="Params.channelPath"></cms-input> 
                                </br>  
                        </span>
                        <span>
                            <label class="cms-label">栏目选项 </label>
                            <el-radio @change='rad' v-model='Params.channelOption' label='0'>多个栏目</el-radio>
                            <el-radio @change='rad' v-model='Params.channelOption' label='1'>子栏目</el-radio>
                            <el-radio @change='rad' v-model='Params.channelOption' label='2'>副栏目</el-radio>
                            </br> 
                    </span> 
                        <span>
                            <label class="cms-label">内容类型 </label>
                            <el-checkbox-group @change='rad' v-model="typeId">
                                <el-checkbox label="普通"></el-checkbox>
                                <el-checkbox label="图文"></el-checkbox>
                                <el-checkbox label="焦点"></el-checkbox>
                                <el-checkbox label="头条"></el-checkbox>
                            </el-checkbox-group>
                            </br> 
                    </span> 
                        <span>
                            <label class="cms-label">推荐 </label>
                            <el-radio @change='rad' v-model='Params.recommend' label='all'>所有</el-radio>
                            <el-radio @change='rad' v-model='Params.recommend' label='0'>否</el-radio>
                            <el-radio @change='rad' v-model='Params.recommend' label='1'>是</el-radio>
                            </br> 
                    </span> 
                        <span>
                            <label class="cms-label">是否有标题图 </label>
                            <el-radio @change='rad' v-model='Params.image' label='all'>所有</el-radio>
                            <el-radio @change='rad' v-model='Params.image' label='0'>否</el-radio>
                            <el-radio @change='rad' v-model='Params.image' label='1'>是</el-radio>
                            </br> 
                    </span> 
                        <span>
                            <cms-input label="日期格式" v-model="Params.dateFormat"></cms-input>  
                            </br>  
                        </span> 
                        <span>
                            <label class="cms-label">是否新窗口打开 </label>
                            <el-radio @change='rad' v-model='Params.target' label='0'>否</el-radio>
                            <el-radio @change='rad' v-model='Params.target' label='1'>是</el-radio>
                            </br> 
                    </span>    
                        <span>
                            <cms-input label="标题" v-model="Params.title"></cms-input>  
                            </br>  
                        </span> 
                        <span>
                            <label class="cms-label">排序 </label>
                            <el-select v-model="Params.orderBy" @change="rad">
                                <el-option label="无" value=""></el-option>
                                <el-option label="ID降序" value="0"></el-option>
                                <el-option label="ID升序" value="1"></el-option>
                                <el-option label="发布时间降序" value="2"></el-option>
                                <el-option label="发布时间升序" value="3"></el-option>
                                <el-option label="固定降，发布降" value="4"></el-option>
                                <el-option label="固定降，发布升" value="5"></el-option>
                                <el-option label="日点击降" value="6"></el-option>
                                <el-option label="周点击降" value="7"></el-option>
                                <el-option label="月点击降" value="8"></el-option>
                                <el-option label="总点击降" value="9"></el-option>
                                <el-option label="日评论降" value="10"></el-option>
                                <el-option label="周评论降" value="11"></el-option>
                                <el-option label="月评论降" value="12"></el-option>
                                <el-option label="总评论降" value="13"></el-option>
                                <el-option label="日下载降" value="14"></el-option>
                                <el-option label="周下载降" value="15"></el-option>
                                <el-option label="月下载降" value="16"></el-option>
                                <el-option label="总下载降" value="17"></el-option>
                                <el-option label="日顶降" value="18"></el-option>
                                <el-option label="周顶降" value="19"></el-option>
                                <el-option label="月顶降" value="20"></el-option>
                                <el-option label="总顶降" value="21"></el-option>
                                <el-option label="推荐降,发布升" value="22"></el-option>
                                <el-option label="推荐升,发布降" value="23"></el-option>    
                            </el-select>
                            </br>  
                        </span> 
      </span>                    
                 <span v-show="Params.type==='ids'">
                    <cms-input label="指定ID(,分隔)" v-model="Params.ids"></cms-input>  
                    </br>  
                 </span> 
                 <span>
                    <cms-input label="标题长度" v-model="Params.titLen"></cms-input>  
                    </br>  
                 </span> 
                 <span>
                        <label class="cms-label">是否显示描述 </label>
                        <el-radio @change='rad' v-model='Params.showDesc' label='0'>否</el-radio>
                        <el-radio @change='rad' v-model='Params.showDesc' label='1'>是</el-radio>
                        </br> 
                </span> 
                 <span v-show="Params.showDesc==='1'">
                    <cms-input label="简介长度" v-model="Params.descLen"></cms-input>  
                    </br>  
                </span>    


                 <span>
                    <cms-input label="条数" v-model="Params.count"></cms-input>  
                    </br>  
                </span> 
    </span> 




      </section>    
</template>

<script>
export default {
  name: "cms-comment",
  props: {
      ad:{
         type:Object,
         default:function(){
           return {};
         },
         
      },
  },
  data() {
    return {
        typeId:[],
        Params:{
            type:'list',
            singleType:'n_',
            contentId:'',
            ids:'',
            idsTitLen:'',
            idsDateFormat:'',
            sys:'list',
            tpl:'1',
            tpl1:'1',
            tpl2:'',    
            tpl3:'',
            lineHeight:'',
            headMarkImg:'',
            headMark:'1',
            bottomLine:'0',
            datePosition:'2',
            ctgForm:'0',
            picWidth:'',
            picHeight:'',
            rightPadding:'',
            picFloat:'0',
            view:'1',
            viewTitle:'',
            rollDisplayHeight:'',
            rollLineHeight:'',
            rollCols:'',
            rollSpeed:'',
            rollSleepTime:'',
            rollRows:'',
            rollSpan:'',
            isSleep:'0',
            flashWidth:'',
            flashHeight:'',
            textHeight:'',
            showTitleStyle:'0',
            useShortTitle:'0',
            tag:'',
            topic:'',    
            channelId:'',
            channelPath:'',
            channelOption:'1',
            typeId:'',
            recommend:'all',
            image:'0',
            new:'0',
            dateFormat:'yyyy-MM-dd',
            target:'0',
            title:'',
            orderBy:'',
            titLen :'',   
            showDesc:'0',
            descLen:'',
            count:'',
            module:'',
            name:'',
            description:'',
        },
        parentId:[],

    };
  },
  methods: {
     rad(){
         let contentParams={};
         contentParams=this.Params;
         contentParams.typeId=contentParams.typeId.join(',');

        if(this.Params.type!='single'){
              this.Params.singleType='p_';
              this.Params.showDesc='0';
        }

         this.$emit('change',contentParams);
     }
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
.cms-pagination {
  display: flex;
}
.page-input {
  display: inline-block;
  display: flex;
  align-items: center;
  margin-right: 35px;
  > span {
    display: inline-block;
    color: #8a8e98;
    font-size: 14px;
    user-select: none;
    white-space: nowrap;
  }
  .small {
    width: 58px;
    padding: 0 5px;
  }
}
</style>