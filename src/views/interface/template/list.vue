<template>
    <div >
        <div class="cms-list-header clearfix flex">
                <div class="bread-box cms-left">
                    <label class=""> 当前目录：</label>
                    <ul class="type-bread">
                        <li class="bread-items">
                        <a href="javascript:void(0)" >{{params.root}}</a>
                        </li>
                    </ul>
                </div>
                 <el-button type="primary" @click="addResource" style="margin-right:10px;"
                         v-perms="'/templateadd'"
                 > 新建文件</el-button>
                   <div>
                        <el-upload :action="$store.state.sys.templateUpLoad" name="uploadFile" :data="upobj" :multiple="true" :on-success="upSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false" :on-progress="showProgress" class="tpl-block" style="display:inline-block">
                            <el-button :loading="state">{{statefont}}</el-button>
                        </el-upload>
                        <div class="po-progress">
                            <el-progress :percentage="progress" :stroke-width="5" v-show="progressState">
                            </el-progress>
                        </div>
                 </div>
                   <cms-input v-model="fileName" label="新建目录"
                   ></cms-input>
                    <el-button @click="newFile" :disabled="fileName==''" 
                             v-perms="'/templateadd'"
                    >新建</el-button>
                 </div>
        <div class="table-responsive" v-loading.body="loading">
            <form class="form-horizontal no-margin">
                <el-table style="width: 100%" :data="resourceList" @selection-change="checkIds">
                    <el-table-column type="selection" align="center" width="68"></el-table-column>
                    <el-table-column label="文件名" prop="filename" align="left">
                        <template slot-scope="scope">
                                <div class="cur" @click="queryChild(scope.row.name,scope.row.path,scope.row.isDirectory)">
                                    <i class="iconfont icon-wenjianjiabiheicon " v-show="scope.row.isDirectory"></i>
                                    {{scope.row.filename}}
                                </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="大小" prop="size" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.size}} KB</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后修改时间" prop="lastModifiedDate" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" :width="300">
                    <template slot-scope="scope">
                        <cms-button type="rename" @click.native="reName(scope.row.name)"
                              v-perms="'/templaterename'"
                        ></cms-button>
                        <cms-button type="edit"  @click.native="editResource(scope.row.name)" v-show="!scope.row.isDirectory"
                               v-perms="'/templateedit'"
                        ></cms-button> 
                         <cms-button type="delete" @click.native="deleteTemplateList(scope.row.name)"
                               v-perms="'/templatedelete'"
                         ></cms-button> 
                      
                    </template>
                    </el-table-column>
                </el-table>
                <!--收缩隐藏-->
            </form>

        </div>
        <!---bottom-->
        <div class="cms-list-footer">  
            <div class="pull-left">
                <el-button :disabled="disabled" @click="deleteTemplateList(names)"
                       v-perms="'/templatedelete'"
                >批量删除</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getRand } from "@/untils/random";
import { signParams } from "@/untils/sign";
import * as fetch from "@/api/interface";
export default {
  data() {
    return {
      progress: 0,
      progressState: false,
      state: false,
      statefont: "上传文件",
      loading: true,
      resourceList: [],
      names: "", //批量删除列表
      groupList: [], //会员组列表
      params: {
        //接口参数
        pageNo: 1,
        pageSize: 20,
        root: ""
      },
      upobj: {},
      fileName: "",
      totalCount: 0,
      currentPage: 1,
      changePageSize: localStorage.getItem("PageSize"),
      disabled: true
    };
  },
  methods: {
    getTemplateList() {
      //获取模版信息列表
      let params = this.params;
      fetch
        .getTemplateList(params)
        .then(res => {
          if (res.code == 200) {
            this.resourceList = res.body;
            this.totalCount = res.totalCount;
            if (res.body.length > 0) {
              this.params.root = res.body[0].path;
              this.upobj = signParams(
                {
                  appId: process.env.appId,
                  sessionKey: localStorage.getItem("sessionKey"),
                  root: res.body[0].path,
                  nonceStr: getRand()
                },
                 process.env.appKey
              );
            }
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message.error("网络异常");
        });
    },
    showProgress(event, file, fileList) {
      this.progressState = true;
      if (event.percent > 0 && event.percent < 100) {
        this.progress = parseInt(event.percent);
      } else if (event.percent == 100) {
        this.progressState = false;
        this.progress = 0;
        this.getTemplateList();
      }
    },
    beforeAvatarUpload(file) {
      const isHtml = file.type === "text/html";
      if (!isHtml) {
        this.$message.error("模版只能上传html文件");
      }
      return isHtml;
    },
    upSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.state = false;
        this.getTemplateList();
      } else if (response.code == 209) {
        this.errorMessage("无上传权限");
      } else {
        this.errorMessage("上传失败");
      }
    },
    queryChild(name, path, type) {
      //点击查询列表
      this.params.root = path;
      if (type) {
        this.$router.push({
          path: "/templatelist",
          query: {
            name: name
          }
        });
      }
    },
    newFile() {
      //创建新目录
      this.loading = true;
      let params = {
        root: this.params.root,
        dirName: this.fileName
      };
      fetch
        .creatTemplateFile(params)
        .then(res => {
          //console.log(res);
          if (res.code == 200) {
            this.params.root = this.params.root;
            this.getTemplateList();
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        })
        .catch(res => {
          this.loading = false;
          this.$message.error("创建失败");
        });
    },
    editResource(name) {
      //修改模版
      this.$router.push({
        path: "/templateedit",
        query: {
          type: "edit",
          id: name,
          root: this.params.root
        }
      });
    },
    addResource() {
      //添加模版
      this.$router.push({
        path: "/templateadd",
        query: {
          type: "add",
          id: this.params.root,
          root: this.params.root
        }
      });
    },
    reName(name) {
      //修改名称
      this.$router.push({
        path: "/templaterename",
        query: {
          name: name,
          root: this.params.root
        }
      });
    },
    deleteTemplateList(id) {
      //删除模版
      this.names = id;
      this.$confirm("您确定要删除吗?", "警告", {
        type: "warning"
      })
        .then(mes => {
          fetch
            .deleteTemplateList({
              names: this.names
            })
            .then(res => {
              //console.log(res);
              this.loading = false;
              if (res.code == 200) {
                this.$message.success("删除成功");
                this.getTemplateList();
              }
            })
            .catch(res => {
              this.loading = false;
              this.$message.error("网络异常");
            });
        })
        .catch(mes => {});
    },
    checkIds(res) {
      //选中当前的names
      let names = [];
      for (let i = 0; i < res.length; i++) {
        names.push(res[i].name);
      }
      if (names.length == 0) {
        this.names = "";
        this.disabled = true;
      } else {
        this.names = names.join(",");
        this.disabled = false;
      }
    }
  },
  created: function() {
    this.params.root = this.$route.query.name; //获取树形id
    this.upobj.root = this.$route.query.name;
    this.getTemplateList();
  },
  watch: {
    $route: function(to, from) {
      this.params.root = this.$route.query.name; //获取树形id
      this.upobj.root = this.$route.query.name;
      this.loading = true;
      this.getTemplateList();
      this.fileName = "";
    }
  }
};
</script>

<style scoped>
.cur {
  cursor: pointer;
  text-align:left;

}

.inline-block {
  display: inline-block;
  width: 500px;
}

.inline-block > * {
  float: left;
}
.icon-wenjianjiabiheicon{
  color: #ffc822;
    font-size: 20px;
    margin-right: 4px;
   position: relative;
   top:2px;
}
</style>
