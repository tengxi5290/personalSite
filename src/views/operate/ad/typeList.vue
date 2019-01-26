<template>
  <section v-loading="loading" class="cms-body">
        <!-- 返回组件 -->
    <cms-back></cms-back>        
    <div class="cms-list-header ">   
      <!--   <el-button type="primary" icon="iconfont  icon-fanhui" @click="routerLink('/ad/list',0)" >返回</el-button>  -->
        <el-button type="primary"  icon="el-icon-plus" @click="loadDialog('save',0)" v-perms="'/adSpace/save'"
        >添加</el-button>    
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center">
        </el-table-column>
        <el-table-column width="100" label="启用" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled">是</span>
            <span v-if="!scope.row.enabled">否</span>
          </template>      
        </el-table-column>  
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
            <cms-button type="edit" @click.native="loadDialog('update',scope.row.id)" v-perms="'/adSpace/update'">
            </cms-button>
             <cms-button type="delete" @click.native="deleteBatch($api.adSpaceDelete,scope.row.id)" v-perms="'/adSpace/delete'">
            </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.adSpaceDelete,ids)" v-perms="'/adSpace/delete'">批量删除</el-button>
      </div>    
    </div> 
    <!-- 新增及修改dialog -->
    <el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="dialogVisible" width="27%":before-close="handleClose">
      <el-form  ref="form" :model="dataInfo" :rules="rules"  label-width="80px"  >
        <!-- 名称 -->
        <el-form-item label="名称" prop="name">
          <el-input class="cms-width" v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 启用 -->
        <el-form-item label="启用"   prop="enabled">
           <el-radio-group v-model="dataInfo.enabled"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item label="描述"   >
          <el-input class="cms-width" v-model="dataInfo.description" type="textarea" maxlength="255"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="modifyData">{{operateType == 'save' ?'新增':'修改'}}</el-button>
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
  	    enabled:[required],
  	  },
      labelDialogTitle:'',
      operateType:'',
    }
  },
  methods:{
    loadDialog(type,id){
      this.operateType = type;
      axios.post(this.$api.adSpaceGet,{id:id}).then(res=>{
          if(res.code == '200'){
            this.dataInfo = res.body;
          }
      });
      this.labelDialogTitle = '广告版位'+(type == 'save' ? '新增' : '修改');
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    modifyData(){
      let form = this.$refs['form'];
      let url = this.operateType == 'save'?this.$api.adSpaceSave:this.$api.adSpaceUpdate;
      form.validate((valid) => {//验证方法
          if (valid) {
            this.loading = true;
            axios.post(url, this.dataInfo).then(res => {
              this.loading = false;
              if (res.code == "200") {
                this.successMessage(this.operateType == 'save' ? '新增成功' : '修改成功');
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
      this.initTableData(this.$api.adSpaceList,this.params);
  }
};
</script>

<style scoped>
	.el-col .el-form-item{
		margin-bottom: 0px;
	}
	.el-form-item__error{
		left: 102%
	}
	.input-name{
		width: 350px
	}
.el-button--primary{
  height: 34px;
}
.el-dialog__body{
  min-height: 0px !important;
}
</style>
