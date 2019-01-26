<template>
  <div  v-loading="loading" class="cms-body">
        <cms-back></cms-back>
        <div class="table-top-bar clearfix">
             <div class="query-inline-box">
                <div class="bread-box">
                <label class="" style="font-size:14px;">当前内容模型：</label>  
                <ul class="type-bread">
                    <li class="bread-items">
                      <a href="javascript:void(0)">{{modelName}} 
                           <el-button type="primary" 
                            icon="el-icon-plus"
                            @click="routerLink('/contentModel/save','save',0,params)"
                            v-perms="'/contentModel/add'"          
                             >添加</el-button> 
                          <span class="red">(标红字段为必选字段,无法删除，未勾选独占一行的字段不间断的个数必须是2的倍数，否则后台栏目页会乱)</span></a>
                    </li>            
                    </ul> 
                </div>
          </div>
        </div>



        <!-- table -->    
        <el-table style="width:100%" :data="items"  stripe  @selection-change="checkIds">
            <el-table-column type="selection" align="center" :width="68"></el-table-column>
            <el-table-column label="字段" prop="field" align="center">
                     <template slot-scope="scope">
                        <span  class="word" :class="scope.row.change? '': 'red'">{{scope.row.field}}</span>
                        <!-- <span  class="word" :class="[defaultParams.indexOf(scope.row.field)>=0?'red':'']">{{scope.row.field}}</span> -->
                     </template>
            </el-table-column>
            <!-- <el-table-column label="数据类型" prop="dataType" align="center"  v-if="items.length>0"> -->
            <el-table-column label="数据类型" prop="dataType" align="center" >
                    <template slot-scope="scope">
                      <span v-if="scope.row.dataType==1">字符串文本</span>
                      <span v-if="scope.row.dataType==2">整形文本</span>
                      <span v-if="scope.row.dataType==3">浮点形文本</span>
                      <span v-if="scope.row.dataType==4">文本区</span>
                      <span v-if="scope.row.dataType==5">日期</span>
                      <span v-if="scope.row.dataType==6">下拉列表</span>
                      <span v-if="scope.row.dataType==7">复选框</span>
                      <span v-if="scope.row.dataType==8">单选框</span>
                      <span v-if="scope.row.dataType==9">附件</span>
                      <span v-if="scope.row.dataType==10">图片</span>
                      <span v-if="scope.row.dataType==11">富文本</span>
                    </template>
            </el-table-column>
           <el-table-column label="名称" prop="showName" align="center"></el-table-column>
            <el-table-column label="排序" prop="priority" align="center" >
              <template slot-scope="scope">
                <el-input class="w50" type='number' @blur="checkP(scope.row)" v-model="scope.row.priority"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="独占一行" prop="single" align="center" width="100">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.single"></el-checkbox>
              </template>
            </el-table-column>
            
             <el-table-column label="操作" align="center" >
                     <template slot-scope="scope">
                          <cms-button type="edit"
                           v-if="scope.row.change"
                           @click.native="routerLink('/contentModel/update','update',scope.row.id,params)"
                                  v-perms="'/contentModel/update'"   
                           ></cms-button>
                           <!-- <cms-button type="delete" 
                            v-if="!(defaultParams.indexOf(scope.row.field)>=0)"
                           @click.native="deleteItems([scope.row])"
                                  v-perms="'/contentModel/delete'"   
                           ></cms-button> -->
                    </template>
            </el-table-column>
        </el-table>


        <div class="default-size"  v-if="copyDefaultTypeList.length>0">系统默认字段<span class="red">(标红字段为必选字段)</span></div>
        <el-table :data="copyDefaultTypeList"
         ref="multipleTable" 
        stripe  v-if="copyDefaultTypeList.length>0"  
         @selection-change="defaultTypeChange">
                <el-table-column type="selection" align="center" :width="68"
                 :selectable='checkboxInit'
                ></el-table-column>
            <el-table-column label="字段" prop="field" align="center">
                       <template slot-scope="scope">
                         <span class="word" :class="[defaultParams.indexOf(scope.row.field)>=0?'red':'']">{{scope.row.field}}</span>
                     </template>
            </el-table-column>
            <el-table-column label="数据类型" prop="dataType" align="center">
                    <template slot-scope="scope">
                         <span v-if="scope.row.dataType==1">字符串文本</span>
                          <span v-if="scope.row.dataType==2">整形文本</span>
                           <span v-if="scope.row.dataType==3">浮点形文本</span>
                            <span v-if="scope.row.dataType==4">文本区</span>
                             <span v-if="scope.row.dataType==5">日期</span>
                              <span v-if="scope.row.dataType==6">下拉列表</span>
                              <span v-if="scope.row.dataType==7">复选框</span>
                              <span v-if="scope.row.dataType==8">单选框</span>
                            
                                <span v-if="scope.row.dataType==9">附件</span>
                                  <span v-if="scope.row.dataType==10">图片</span>
                    </template>
            </el-table-column>
           <el-table-column label="名称" prop="label" align="center">
           </el-table-column>
            <el-table-column label="排序" prop="priority" align="center" >
            </el-table-column>
               <el-table-column label="独占一行" prop="single" align="center" width="100">
                     <template slot-scope="scope">
                         <el-checkbox v-model="scope.row.single" disabled></el-checkbox>
                    </template>
            </el-table-column>
             <el-table-column label="显示" prop="display" align="center" width="100">
                     <template slot-scope="scope">
                         <el-checkbox v-model="scope.row.display" disabled></el-checkbox>
                    </template>
            </el-table-column>
              <el-table-column label="操作" align="center" >
                     
            </el-table-column>
        </el-table>



        <!---分页底部-->
        <div class="cms-list-footer">
            <div class="pull-left">
              <!-- <el-button   @click="saveDefaultItems(checkDefaultTypeList)" v-if="copyDefaultTypeList.length>0"
                       :disabled="checkDefaultTypeList.length<=0"
                        v-perms="'/contentModel/save'"   
               >保存默认选中字段</el-button>  -->
              <el-button @click="saveItems(saveTypeList)" v-if="saveTypeList.length > 0" v-perms="'/contentModel/savePriority'">保存内容</el-button>
              <el-button v-else disabled>保存内容</el-button> 
            </div>
        </div>
       
    </div>
</template>

<script>
import axios from "axios";
import defaultContentModel from "./defaultContentModel";
import {axiosProxy,checkErrorCode, getUrlParams} from "@/api/tool"
export default {
  data() {
    return {
      loading: false, //提示变量
      modelName: "默认",
      items: [], //列表通用变量
      params: {
        modelId: 0,
        isChannel: false, //是否为栏目模型
        modelName:'',
      },
      defaultTypeList: defaultContentModel,
      // copyDefaultTypeList: defaultContentModel,
      copyDefaultTypeList: [],
      checkDefaultTypeList: [],
      saveTypeList: [],
      disabledDefault: true,
      disabled: true, //禁用
      defaultParams: "channelId,title",
    };
  },
  methods: {
    //检查排列顺序不能为空且不能超过4位数
    checkP(value) {
      let reg = /^([1-9]\d{0,3}|0)$/
      if (!reg.test(value.priority)) {
        this.open()
      } else {
        this.$set(this.params,'enables', value.enable)
        this.$set(this.params,'priorities', value.priority)
        this.$set(this.params,'ids', value.id)
      }
    },
    open() {
      this.$alert('排列顺序不能为空且不能超过4位数', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.getItems();
        }
      })
    },  
    getItems() {
      //获取接口数据
      this.loading = true;
      axiosProxy.get(this.$api.itemList + '/' + parseInt(this.params.modelId)).then(res => {
        if(res.data.errorCode == '0') {
          this.items = res.data.data
          this.loading = false;
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      });
    },
    saveDefaultItems(defObj) {
      let params = {
        modelId: this.$route.query.modelId,
        isChannel: this.$route.query.isChannel,
        fields: [],
        labels: [],
        dataTypes: [],
        prioritys: [],
        singles: [],
        displays: []
      };
      for (let i in defObj) {
        params.fields.push(defObj[i].field);
        params.labels.push(defObj[i].label);
        params.dataTypes.push(defObj[i].dataType);
        params.prioritys.push(defObj[i].priority);
        params.singles.push(defObj[i].single);
        params.displays.push(defObj[i].display);
      }
      params.fields = params.fields.join(",");
      params.labels = params.labels.join(",");
      params.prioritys = params.prioritys.join(",");
      params.dataTypes = params.dataTypes.join(",");
      params.singles = params.singles.join(",");
      params.displays = params.displays.join(",");
      axios.post(this.$api.itemListSave, params).then(res => {
        if (res.code == 200) {
          this.successMessage("保存默认字段成功");
          this.getItems();
        }
      });
    },
    saveItems(defObj) {
      let params = {
        modelId: this.$route.query.modelId,
        isChannel: this.$route.query.isChannel,
        ids: [],
        labels: [],
        dataTypes: [],
        priorities: [],
        singles: [],
        displays: [],
        showNames: [],
        enables:[],
      };

      for (let i in defObj) {
        params.ids.push(defObj[i].id);
        params.labels.push(defObj[i].label);
        params.dataTypes.push(defObj[i].dataType);
        params.priorities.push(defObj[i].priority);
        params.singles.push(defObj[i].single);
        params.displays.push(defObj[i].display);
        params.showNames.push(defObj[i].showName);
        params.enables.push(defObj[i].enable);
      }
      params.ids = params.ids.join(",");
      params.labels = params.labels.join(",");
      params.priorities = params.priorities.join(",");
      params.dataTypes = params.dataTypes.join(",");
      params.singles = params.singles.join(",");
      params.displays = params.displays.join(",");
      params.showNames = params.showNames.join(",");
      params.enables = params.enables.join(",");

      axiosProxy.post(this.$api.itemPriority + '?ids=' + params.ids + '&names=' + params.showNames + '&priorities=' + params.priorities + '&singles=' + params.singles + '&enables=' + params.enables).then(res => {
        if(res.data.errorCode == '0') {
          this.successMessage("保存成功");
          this.getItems();
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('保存失败')
          }
        }
      });
    },
    deleteItems(defObj) {
      let ids = [];
      for (let i in defObj) {
        if (this.defaultParams.indexOf(defObj[i].field) < 0) {
          ids.push(defObj[i].id);
        }
      }
      if (ids.length > 0) {
        this.$confirm("确定要删除吗?", "警告", { type: "error" })
          .then(mes => {
            axios
              .post(this.$api.itemDelete, { ids: ids.join(",") })
              .then(res => {
                if (res.data.errorCode == 0) {
                  this.successMessage("删除成功");
                  this.defaultTypeList = defaultContentModel;
                  setTimeout(() => {
                    this.getItems();
                  }, 500);
                } else {
                  if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                  } else {
                    this.errorMessage('删除失败')
                  }
                }
              });
          })
          .catch(error => {});
      } else {
        this.errorMessage("您所选择的为系统字段,无法删除");
      }
    },
    defaultTypeChange(val) {
      this.checkDefaultTypeList = val;
    },
    checkIds(res) {
      //选中的对象
      this.saveTypeList = res;
      //选中当前的ids
      let ids = [];
      for (let i = 0; i < res.length; i++) {
        ids.push(res[i].id);
      }
      if (ids.length == 0) {
        this.ids = "";
        this.disabled = true;
      } else {
        this.ids = ids.join(",");
        this.disabled = false;
      }
    },
    checkboxInit(row, index) {
      let str = this.defaultParams;
      if (str.indexOf(row.field) >= 0) {
        return 0;
      } else {
        return 1;
      }
    },
    toggleSelection() {
      let str = this.defaultParams;
      let arrs = this.copyDefaultTypeList;
      let tmp = [];
      for (let i in arrs) {
        if (str.indexOf(arrs[i].field) >= 0) {
          tmp.push(arrs[i]);
        }
      }
      tmp.forEach(row => {
        // this.$refs["multipleTable"].toggleRowSelection(row, true);
      });
    },
    changeDefaultList() {
      this.copyDefaultTypeList = [];
      for (let i in this.defaultTypeList) {
        let count = 0;
        for (let j in this.items) {
          if (this.items[j].field == this.defaultTypeList[i].field) {
            count++;
          }
        }
        if (count == 0) {
          this.copyDefaultTypeList.push(this.defaultTypeList[i]);
        }
      }
    }
  },
  created: function() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    let modelId = this.$route.query.modelId;
    let isChannel = this.$route.query.isChannel;
    this.modelName = this.$route.query.modelName;
    this.params.modelId = modelId;
    this.params.isChannel = isChannel;
    this.params.modelName=this.modelName;    
    this.getItems();
  }
};
</script>

<style scoped>
.default-size {
  padding: 12px 24px;
  font-size: 14px;
}
.red {
  color: red;
}
.word {
  text-transform: none;
}
</style>

