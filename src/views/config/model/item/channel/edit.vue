<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <a class="cms-back" href="javascript:void(0)" @click="cmsBack"></a>
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="字段" class="flex-50"  prop="field">
               <el-input v-if="this.id==0" v-model="dataInfo.field" class="cms-width" ></el-input> 
               <span v-else>{{dataInfo.field}}</span>          
            </el-form-item>       
            <el-form-item label="名称:" class="flex-50"  prop="label">
               <el-input  v-model="dataInfo.label" class="cms-width" ></el-input> 
            </el-form-item>   
         
            
             <el-form-item label="数据类型:" class="flex-50"  prop="dataType">
               <el-select v-model="dataInfo.dataType" class="cms-width" :disabled="type=='update'">
                  <el-option label="字符串文本" :value="1"></el-option>
                  <el-option label="整形文本" :value="2"></el-option>
                  <el-option label="浮点形文本" :value="3"></el-option>
                  <el-option label="文本区" :value="4"></el-option>
                  <el-option label="日期" :value="5"></el-option>
                  <el-option label="下拉列表" :value="6"></el-option>
                  <el-option label="复选框" :value="7"></el-option>
                  <el-option label="单选框" :value="8"></el-option>
                  <el-option label="附件" :value="9"></el-option>
                  <el-option label="图片" :value="10"></el-option>                    
               </el-select>
            </el-form-item>  
              <el-form-item label="默认值:" class="flex-50"  prop="defValue">
               <el-input  v-model="dataInfo.defValue" class="cms-width" ></el-input> 
            </el-form-item>
             <el-form-item label="可选项:" class="flex-100"  prop="optValue">
               <el-input  v-model="dataInfo.optValue" class="cms-width" :disabled="type=='update'"></el-input> 
                <span class="gray">多个值用","分开</span> 
            </el-form-item>  
             <el-form-item label="帮助信息:" class="flex-100"  prop="help">
               <el-input  v-model="dataInfo.help" class="cms-width" ></el-input> 
            </el-form-item>  
           <el-form-item label="是否必填:" class="flex-50"  prop="required">
                 <el-radio-group v-model="dataInfo.required">
                     <el-radio :label="true">是</el-radio> 
                     <el-radio :label="false">否</el-radio>
                 </el-radio-group>           
            </el-form-item>  
            <el-form-item label="独占一行:" class="flex-50"  prop="single">
                 <el-radio-group v-model="dataInfo.single">
                     <el-radio :label="true">是</el-radio> 
                     <el-radio :label="false">否</el-radio>
                 </el-radio-group>           
            </el-form-item>  

            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/channelModel/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(true)"
                    v-perms="'/channelModel/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/channelModel/update'"
                >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import formMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
export default {
  mixins: [formMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    let string=va.string();
  
    return {
      params: {
        //只需要业务参数
      },
      rules: {
        //校验规则
        field: [string,required],
        label: [required],
        dataType:[required],
        required: [required],
        single:[required]
      },
      checkRes: false
    };
  },
  methods: {
    checkId(value) {
      let api = this.$api; //API地址
      axios
        .all([
          axios.post(api.typeCheckId, { id: value }) //axios批量发送请求
        ])
        .then(
          axios.spread(res => {
            if (res.body.result) {
              this.checkRes = true;
            } else {
              this.checkRes = false;
            }
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    getDataInfo(id) {
      let api = this.$api; //API地址
      axios
        .post(api.itemGet,{id:id }) //axios批量发送请求
        .then(res => {
          this.dataInfo = res.body;
          this.$refs["form"].resetFields();
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    update() {
      //  var flag = this.updateDataInfo(this.$api.itemUpdate, this.dataInfo);
      //  if(flag){
      //     setTimeout(() => {
      //       this.routerLink('/channelModel/list','list',0,this.$route.query);
      //     }, 1000);
      //  }
      let form = this.$refs['form'];
      form.validate((valid) => {//验证方法
          if (valid) {
              this.loading = true;
              axios.post(this.$api.itemUpdate, this.dataInfo)
                  .then(res => {
                      this.loading = false;
                      if (res.code == "200") {
                          this.successMessage('修改成功');
                          setTimeout(() => {
                            this.routerLink('/channelModel/list','list',0,this.$route.query);
                          }, 500);
                      }
                  }).catch(error => { this.loading = false; });
          } else {
              return false;
          }
      });
    },
    add(state) {
        console.log(this.$route.query.modelId);
        this.dataInfo.modelId=this.$route.query.modelId;
        // this.saveDataInfo(true,this.$api.itemSave,this.dataInfo, "list");
        if(state){
              let form = this.$refs['form'];
              form.validate((valid) => {//验证方法
                  if (valid) {
                      this.loading = true;
                      axios.post(this.$api.itemSave, this.dataInfo)
                          .then(res => {       
                              if (res.code == "200") {
                                  this.successMessage('添加成功');
                                  setTimeout(() => {
                                  this.routerLink('/contentModel/list','list',0,this.$route.query);
                                }, 500);
                              }
                              this.loading = false;
                          }).catch(error => { this.loading = false; });
                  } else {
                      return;
                  }
              });
         }else{
          return;
         }
    },
    cmsBack(){
        setTimeout(() => {
            this.routerLink('/channelModel/list','list',0,this.$route.query);
          }, 500);
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>