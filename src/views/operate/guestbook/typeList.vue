<template>
  <section v-loading="loading" class="cms-body">
    <!-- 返回组件 -->
    <cms-back></cms-back>       
    <div class="cms-list-header ">   
        <!-- <el-button type="primary" icon="iconfont  icon-fanhui" @click="routerLink('/guestbook/list',0)" >返回</el-button>  -->
        <el-button type="primary"  icon="el-icon-plus" @click="loadDialog('save',0)" v-perms="'/guestbookType/add'"
        >添加</el-button>    
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center">
        </el-table-column>
        <el-table-column  prop="priority"  width="100" label="排序" align="center"> 
        </el-table-column>  
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
            <cms-button type="edit" @click.native="loadDialog('update',scope.row.id)" v-perms="'/guestbookType/update'">
            </cms-button>
             <cms-button type="delete" @click.native="deleteBatch($api.guestbookTypeDelete,scope.row.id)" v-perms="'/guestbookType/delete'">
            </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.guestbookTypeDelete,ids)" v-perms="'/guestbookType/delete'">批量删除</el-button>
      </div>    
    </div> 
    <!-- 新增及修改dialog -->
    <el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="dialogVisible" width="30%":before-close="handleClose">
      <el-form  ref="form" :model="dataInfo" :rules="rules"  label-width="80px">
        <!-- 名称 -->
        <el-form-item label="名称"  prop="name">
          <el-input  v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item label="排序"  prop="priority">
           <el-input    v-model="dataInfo.priority"></el-input>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item label="描述"   >
          <el-input  v-model="dataInfo.description" type="textarea" maxlength="255"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="modifyData">{{operateType == 'save' ? '新增' : '修改'}}</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import va from "@/rules";
import axios from "axios";
import { setBaseUrl } from '@/config.js'
export default {
  mixins:[listMixins],
  data(){
  	let required = va.required('此项必填');
    let number = va.number('必须为数字');
    return {
      globalUrl:setBaseUrl(),
      params:{},
      dataInfo:{},
      dialogVisible:false,
	    rules: {//校验规则
  	    name:[required],
  	    priority:[required],
  	  },
      labelDialogTitle:'',
      operateType:'',
    }
  },
  methods:{
    loadDialog(type,id){
      this.operateType = type;
      axios.post(this.$api.guestbookTypeGet,{id:id}).then(res=>{
          if(res.code == '200'){
            this.dataInfo = res.body;
          }
      });
      this.labelDialogTitle = type =='save'?'新增留言类别':'修改留言类别';
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    modifyData(){
      let form = this.$refs['form'];
      let url = this.operateType == 'save'?this.$api.guestbookTypeSave:this.$api.guestbookTypeUpdate;
      form.validate((valid) => {//验证方法
          if (valid) {
            this.loading = true;
            axios.post(url, this.dataInfo).then(res => {
              this.loading = false;
              if (res.code == "200") {
                this.successMessage(this.operateType  == 'save' ? '新增成功' : '修改成功');
                this.getTableData(this.params);
                this.dialogVisible = false;
                this.dataInfo={};
              }
            }).catch(error => { this.loading = false; })
          } else {
            return false
          }
      })
    },
  },
  created(){
      this.initTableData(this.$api.guestbookTypeList,this.params);
  }
};
</script>

<style scoped>
.el-col .el-form-item{
	margin-bottom: 0px;
}
.el-form-item__error{
	left: 83%
}
.input-name{
	width: 350px
}
.el-button--primary{
  height: 34px;
}
.iconfont{
  color: #ffffff;
}
</style>
