<template>
  <section class="cms-body" v-loading="loading">
    <section class="cms-list-header">
        <span>当前目录: {{params.root}}</span>&nbsp;
        <el-radio-group v-model="params.valid">
          <el-radio :label="'1'">有效</el-radio>
          <el-radio :label="'0'">无效</el-radio>
        </el-radio-group>
        <el-button type="primary"  @click="query" v-perms="'/file/list'"
        >查询</el-button>    
        <el-button v-if="params.root !='/u/cms/www' " type="primary"  @click="backFolder(params.root)" v-perms="'/file/list'"
        >返回上一层目录</el-button>   
        <cmsMultipleUpload class="uploadDiv" btnLabel="上传" :showFileList="false" @change="uploadChange" :uploadPath="params.root"></cmsMultipleUpload>
      </section>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column  width="50" align="center"></el-table-column>
        <el-table-column  label="名称"  align="left">
          <template slot-scope="scope">
            
            <i v-if="scope.row.isDirectory" class="  iconfont icon-wenjianjiabiheicon"></i>
            <i v-if="scope.row.isImage" class="iconfont icon-unie62e"></i>
            <i v-else-if="scope.row.isFile" class="iconfont icon-file"></i>
            <a v-if="scope.row.isDirectory" @click="queryItem(scope.row.name)" >{{scope.row.filename}}</a>
            <span v-else>{{scope.row.filename}}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.size}}KB</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifiedDate" label="最后修改时间"  align="center">
        </el-table-column>
       
        <el-table-column prop="valid" label="是否有效"  align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.valid">有效</span>
            <span v-if="!scope.row.valid">无效</span>
          </template>
        </el-table-column> -->

        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="delete" @click.native="deleteBatch($api.fileDelete,scope.row.name,scope.row.path)" v-perms="'/file/delete'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.fileDelete,names,params.root)" v-perms="'/file/delete'"
        >批量删除</el-button>
        <el-button type="" @click="deleteInvalid" v-perms="'/file/fileInvalid'"
        >删除所有失效文件</el-button>   
        <el-button type=""  @click="enclosure" v-perms="'/file/fileEffective'"
        >标志原有附件有效</el-button>    
      </div>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
import { setBaseUrl } from '@/config.js'
export default {
  mixins:[listMixins],
  data(){
    return {
      globalUrl:setBaseUrl(),
      fileTypes:[],
      names:'',
      params:{
        valid:'',
        root:'/u/cms/www',
      }
    }
  },
  methods:{
     setPath(){
       axios.post(this.$api.siteConfigGet).then(res=>{
        
         this.params.root='/u/cms/'+res.body.path
          this.initTableData(this.$api.fileList,this.params);
       })
    },
    uploadChange(){
        this.getTableData(this.params);
    },
    backFolder(root){
      root = root.substring(0,root.lastIndexOf('/'));
      this.params.root = root;
      this.getTableData(this.params);
    },
    queryItem(root){
      this.params.root = root;
      this.getTableData(this.params);
    },
    checkIds(val) {
        let names = [];
        for (let i in val) {
            names.push(val[i].name);
        }
        this.names = names.join(",");
        this.disabled = val.length > 0 ? false : true;
        this.checkedList=val;
    },
    //删除所有失效文件
    deleteInvalid(){
      axios.post(this.$api.fileInvalid,{root:this.params.root}).then(res=>{
        if(res.code == '200'){
          this.successMessage('删除成功');
          this.getTableData(this.params);
        }
      }).catch(error=>{
          this.loading =  false;
      });
    },
    //标志原有附件失效
    enclosure(){
      this.loading = true;
      axios.post(this.$api.fileEffective,{root:this.params.root}).then(res=>{
        if(res.code == '200'){
          this.loading = false;
          this.successMessage('还原成功');
          this.getTableData(this.params);
        }
      }).catch(error=>{
          this.loading =  false;
      });
    },
    deleteBatch(url,name,root){
      this.loading = true;
      axios.post(url,{root:root,names:name}).then(res=>{
        if(res.code == '200'){
          this.loading = false;
          this.successMessage('删除成功');
          this.getTableData(this.params);
        }
      }).catch(error=>{
          this.loading =  false;
      });
    }
  },
  created(){
    this.setPath()
  }
};
</script>

<style scoped>
.cms-list-header span{
  text-transform:lowercase ;
}
.el-table__row .cell .icon-wenjianjiabiheicon,
.el-table__row .cell .icon-file{
  color: #ffc822; 
}
.upload-demo{
  margin-left: 6px
}
.icon-wenjianjiabiheicon,
.icon-shijian,
.icon-file{
  font-size: 20px;
  position: relative;
  top:3px;
}
.icon-unie62e{
  color: #00aeff;
}
.uploadDiv,
.uploading {
  display: inline-block;
}

</style>
