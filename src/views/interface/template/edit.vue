<template>
<div>    
       
         <cms-back></cms-back>
            <el-form :rules="rules" :model="params" ref="topicInfo"  
            class="cms-form" label-width="162px" style="padding:0;margin:0">
                <el-form-item label="新建文件" class="flex-100"  prop="showFileName" >
                        <el-input class="cms-width" v-model="params.showFileName" :disabled="true" v-if="$route.query.type=='edit'"></el-input>
                        <el-input class="cms-width" v-model="params.showFileName" v-if="$route.query.type=='add'"></el-input>
                  
                </el-form-item>
                <el-form-item label="内容" class="flex-100" >
                        <textarea rows="25" style="outline:none" 
                        class="cms-width"
                        v-model="resourceInfo.source" id="tmp">
                        </textarea>

                </el-form-item>
            </el-form>
            <div class="form-footer">
                <el-button   type="primary" 
                v-if="$route.query.type=='edit'"
                  @click="updateResourceInfo('topicInfo')"   
                  v-perms="'/templateedit'"
                  >
                  修改
                </el-button>
                <el-button  value="" type="primary" v-if="$route.query.type=='add'" @click="addTemplateInfo('topicInfo')" 
                 v-perms="'/templatesave'"
                >
                  添加
                </el-button>
                <el-button  type="info"  @click="resetForm">重置</el-button>
            </div>
        </div>
 
</template>

<script>
import * as fetch from "@/api/interface";
export default {
  data() {
    return {
      loading: true,
      count: 0,
      state: false,
      resourceInfo: {
        filename: "",
        source: ""
      },
      params: {
        showFileName: ""
      },

      rules: {
        showFileName: [{ required: true, message: "请填写一个文件名", trigger: "blur" }]
      }
    };
  },
  methods: {
    getTemplateInfo(id) {
      //
      fetch
        .getTemplateInfo({ name: id })
        .then(res => {
          this.loading = false;
          //console.log(res);
          this.resourceInfo.source = res.body;
        })
        .catch(res => {
          this.loading = false;
          this.$message.error("网络异常");
        });
    },
    updateResourceInfo(formName) {
      //修改主题
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.resourceInfo;
          fetch.updateResourceInfo(params).then(res => {
            if (res.code == 200) {
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    addTemplateInfo(formName) {
      //添加主题
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.resourceInfo.root = this.resourceInfo.filename;
          this.resourceInfo.filename = this.params.showFileName;
          let params = this.resourceInfo;
          fetch
            .addTemplateInfo(params)
            .then(res => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                 this.resourceInfo.filename='';
                              this.params.showFileName=""; 
                              this.resourceInfo.source=""; 
                // setTimeout(() => {
                //   this.back();
                // }, 1000);
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(res => {
              this.$message.error("添加失败");
            });
        } else {
          return false;
        }
      });
    },
    back() {
      this.$router.push({
        path: "/templatelist",
        query: {
          name: this.$route.query.root,
          noceStr: Math.round(Math.random() * 10)
        }
      });
    },
    resetForm(formName) {
      //重置表单
      let id = this.$route.query.id;
        this.getTemplateInfo(id);   
    },
    stringReplace(str) {
      var index = str.lastIndexOf("/");
      str = str.substring(index + 1, str.length);
      return str;
    }
  },
  created: function() {
    $(window).scrollTop(0);
    let type = this.$route.query.type;
    let id = this.$route.query.id;
    let rootId = this.$route.query.rootId; //上级目录

    if (type == "add") {
      this.resourceInfo.filename = id;
      this.loading = false;
    } else {
      if (type == "edit") {
        this.resourceInfo.filename = id;
        this.params.showFileName = this.stringReplace(id);
        this.getTemplateInfo(id);
      }
    }
  },
  mounted() {
    $("#tmp").slimScroll({
      height: "100%",
      width: "100%",
      color: "#999",
      opacity: 0.5
    });
    $(window).scrollTop(0);
  },
  watch: {
    $route: function(to, from) {
      let id = this.$route.query.id;
      this.params.showFileName = this.stringReplace(id);
      this.resourceInfo.filename = id;
     
      this.loading = true;
      this.getTemplateInfo(id);
      $(window).scrollTop(0);
    }
  }
};
</script>
<style scoped>
.w128 {
  width: 320px;
}
</style>
