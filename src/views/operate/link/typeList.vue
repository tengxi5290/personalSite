<template>
  <section v-loading="loading" class="cms-body">
     <!-- 返回组件 -->
    <cms-back></cms-back>        
  <!--   <div class="cms-list-header ">   
        <el-button type="primary" icon="iconfont  icon-fanhui" @click="routerLink('/link/list',0)" >返回</el-button>     
    </div> -->
    <!-- 新增表单 -->
    <div class="cms-list-header">
    	<el-form  ref="form" :model="info" :rules="rules"  label-width="162px">
    		<el-row :gutter="10">
			<!-- 名称 -->
                  <el-col :span="6">
			  	<el-form-item label="名称"  prop="name">
			  	 <el-input v-model="info.name"></el-input>
			  	</el-form-item>	
                  </el-col>
			<!-- 排序 -->
                  <el-col :span="6">
          	     	      <el-form-item label="排序" prop="priority">
          			  <el-input v-model="info.priority" type="number"></el-input>
          			</el-form-item>
			</el-col>
			<el-col :span="3">&nbsp;</el-col>
			<el-col :span="4">
			  	<el-button type="primary"  @click="add"v-perms="'/linkType/save'">
	                   添加
	                   </el-button>
			</el-col>
		</el-row>
    	</el-form>
    </div> 
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center">
        	<div slot-scope="scope">
              <el-input v-model="scope.row.name" class="input-name"></el-input>
         	 </div>     
        </el-table-column>
        <el-table-column width="100" label="排列顺序" align="center">
          <div slot-scope="scope">
              <el-input v-model="scope.row.priority" type="number"></el-input>
          </div>        
        </el-table-column>  
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="delete" @click.native="deleteBatch($api.linkTypeDelete,scope.row.id)" v-perms="'/linkType/delete'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.linkTypeDelete,ids)" v-perms="'/linkType/delete'">批量删除</el-button>
        <el-button :disabled="disabled" @click="saveContentBatch($api.linkTypePriority,ids,getPriority())" 
        	v-perms="'/linkType/update'">保存内容</el-button>
      </div>    
    </div> 
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
      info:{name:'',priority:10},
      LinkTypes:[],
	  rules: {//校验规则
	    name:[required],
	    priority:[required,number],
	  }
    }
  },
  methods:{
  	saveContentBatch(){
  		let ids = [];
  		let names = [];
  		let priorities = [];
  		let flage = false;
  		for(let item of this.checkedList){
  			ids.push(item.id);
  			names.push(item.name);
  			priorities.push(item.priority);
  			if(item.name == '' || item.priority == ''){
  				flage = true;
  				break ;
  			}
  		}
  		if(flage){
  			this.errorMessage('您所选择的保存数据条目中存在未填写的内容,请确认!'); 
  		}else{
  			axios.post(this.$api.linkTypeUpdate,{ids:ids.join(','),names:names.join(','),priorities:priorities.join(',')}).then(res=>{
  				if (res.code == "200") {
	                this.successMessage('保存成功');
	                this.getTableData(this.params);
	            }
  			})
  		}

  	},
  	add(){
	    let form = this.$refs['form'];
	    form.validate((valid) => {//验证方法
	        if (valid) {
	            this.loading = true;
	            axios.post(this.$api.linkTypeSave, this.info)
	                .then(res => {
	                    this.loading = false;
	                    if (res.code == "200") {
	                        this.successMessage('添加成功');
	                        this.getTableData(this.params);
	                        this.info = {};
	                    }
	                }).catch(error => { this.loading = false; })
	        } else {
	            return false
	        }
	    })
  	},
    getPriority(){
      let Prioritys=[];
      for (let item of this.checkedList) {
          Prioritys.push(item.priority);
      }
      return Prioritys.join(",");
    },
  },
  created(){
      this.initTableData(this.$api.linkTypeList,this.params);
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
      .iconfont  {
        color: #ffffff;
      }
      .el-dialog .el-dialog__header .el-dialog__body{
        min-height: 0;
      }
</style>
