<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <a class="cms-back" href="javascript:void(0)" @click="cmsBack"></a>
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="字段" class="flex-50"  prop="field">
               <el-input v-if="this.id==0" v-model="dataInfo.field" class="cms-width" ></el-input> 
               <el-input v-else v-model="dataInfo.field" class="cms-width" disabled ></el-input> 
               <div v-if="dataInfo.dataType == 11"><span class="red">富文本数据类型，字段请以“text0”、“text1”、“text2”、“text3”命名</span></div>      
            </el-form-item>       
            <el-form-item label="名称:" class="flex-50"  prop="label">
               <el-input  v-model="dataInfo.showName" class="cms-width" ></el-input> 
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
                  <el-option label="图片" :value="10"></el-option>   
                  <el-option label="富文本" :value="11"></el-option>                 
               </el-select>
            </el-form-item>

            <el-form-item label="排序:" class="flex-50"  prop="priority">
               <el-input  v-model="dataInfo.priority" class="cms-width" type="number" ></el-input> 
            </el-form-item>

              <el-form-item label="默认值:" class="flex-100"  prop="defValue">
               <el-input  v-model="dataInfo.defValue" class="cms-width" ></el-input> 
            </el-form-item>
             <el-form-item label="可选项:" class="flex-100"  prop="optValue" >
               <el-input  v-model="dataInfo.optValue" class="cms-width" :disabled="type=='update'"></el-input> 
                <span class="gray">多个值用","（英文逗号）分开</span> 
            </el-form-item>  
             <el-form-item label="帮助信息:" class="flex-100"  prop="description">
               <el-input  v-model="dataInfo.description" class="cms-width" ></el-input> 
            </el-form-item>  
           <el-form-item label="是否必填:" class="flex-50"  prop="isRequire">
                 <el-radio-group v-model="dataInfo.isRequire">
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
                    v-perms="'/contentModel/add'"
                >保存并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/contentModel/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/contentModel/update'"
                >修改</el-button>
                <el-button type="info" @click="reset()">重置</el-button>
         </div>
        </el-form>
    </section>
</template>

<script>
import formMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
import {axiosProxy,checkErrorCode, getUrlParams} from "@/api/tool"
export default {
  mixins: [formMixins],
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let string=va.string('只能输入字母');
  
    return {
      dataInfo: {
        priority: 0,
        isRequire: false,
        single: true
      },
      params: {
        //只需要业务参数
      },
      rules: {
        //校验规则
        field: [string,required],
        label: [required],
        dataType:[required],
        required: [required],
        single:[required],
        priority: [required]
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
      axiosProxy
        .get(api.itemGet + '/' + id) //axios批量发送请求
        .then(res => {
          if(res.data.errorCode == '0') {
            this.loading = false;
          } else {
            if (res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    update() {
      this.dataInfo.channel=false;
      this.updateDataInfo(this.$api.itemUpdate, this.dataInfo, '/model/list')
    },
    add(state) {
        this.dataInfo.channel=false;
        this.dataInfo.contentModelId=this.$route.query.modelId;
        let url = this.$api.itemSave
        let backUrl = '/contentModel/list'
        this.saveDataInfo(state, url, this.dataInfo, backUrl, () => {
          setTimeout(() => {
            this.routerLink('/contentModel/list', 'list', 0, this.$route.query);
          }, 500);
        })
    },
    cmsBack(){
      setTimeout(() => {
        this.routerLink('/contentModel/list', 'list', 0, this.$route.query);
      }, 500);
    },
    reset () {
      this.dataInfo.showName = ''
      this.dataInfo.priority = ''
      this.dataInfo.defValue = ''
      this.dataInfo.description = ''
    },
    getItem (id) {
      let api = this.$api; //API地址
      axiosProxy
        .get(api.modelItem + '/' + id) //axios批量发送请求
        .then(res => {
          if(res.data.errorCode == '0') {
            this.loading = false;
            this.dataInfo = res.data.data
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
  },
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    let id = getUrlParams('id')
    let type = getUrlParams('type')
    if(type == 'update') {
      this.getItem(id)
    } else {
      this.getDataInfo(0);
    }
  },
  
};
</script>

<style>

</style>