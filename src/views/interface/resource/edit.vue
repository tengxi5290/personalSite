<template>
  <div>    
         <cms-back></cms-back>
            <el-form :rules="rules" :model="params" ref="topicInfo"  
            class="cms-form" label-width="162px" style="padding:0;margin:0">

                <el-form-item label="文件名" class="flex-100"  prop="showFileName" >
                        <el-input class="cms-width" v-model="params.showFileName" :disabled="true" v-if="$route.query.type=='edit'"></el-input>
                        <el-input class="cms-width" v-model="params.showFileName" v-if="$route.query.type=='add'"></el-input>
                </el-form-item>
                 <el-form-item label="内容" class="flex-100" >
                        <textarea rows="25" style="outline:none;width:100%;" 
                        
                        v-model="resourceInfo.source" id="tmp">
                        </textarea>                  
                </el-form-item>
            </el-form>
            <div class="form-footer">
                <el-button   type="primary" 
                v-if="$route.query.type=='edit'"
                 @click="updateResourceInfo('topicInfo')" 

                  v-perms="'/resourceedit'"  
                  >
                    修改
                </el-button>
                <el-button  value="" type="primary" v-if="$route.query.type=='add'" @click="addResourceInfo('topicInfo')" 
                     v-perms="'/resourcesave'"
                >
                   添加
                </el-button>
                <el-button  type="info" @click="resetForm">重置</el-button>
            </div>
        </div>
</template>

<script>
import * as fetch from '@/api/interface'
export default {
    data() {
        return {
            loading: true,
            count: 0,
            state: false,
            resourceInfo: {
                filename: '',
                source: ''
            },
              params: {
        showFileName: ""
      },
            rules: {
                showFileName: [{ required: true, message: '请填写一个主题分类名', trigger: 'blur' }],
                path: [{ required: true, message: '请填写一个路径', trigger: 'blur' }],
                priority: [{ required: true, type: 'number', message: '请填写一个数字排序', trigger: 'blur' }]
            },
        }
    },
    methods: {
        getResourceInfo(id) {//获取分类主题信息
            fetch.getResourceInfo({ name: id })
                .then(res => {
                    this.loading = false;
                    //console.log(res);
                    this.resourceInfo.source = res.body
                })
                .catch(res => {
                    this.loading = false;
                    this.$message.error('网络异常');
                })
        },
        updateResourceInfo(formName) {//修改主题
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = this.resourceInfo;
                    fetch.updateResourceInfo(params)
                        .then(res => {
                            
                            if (res.code == 200) {
                                this.$message.success('修改成功');
                               
                            }
                        })
                        .catch(res => {
                            this.$message.error('修改失败');
                        })
                } else {
                    return false;
                }
            });
        },
        addResourceInfo(formName) {//添加主题
            this.$refs[formName].validate((valid) => {
                if (valid) {
                      this.resourceInfo.root=this.resourceInfo.filename;
                      this.resourceInfo.filename=this.params.showFileName;
                    let params = this.resourceInfo;
                    fetch.addResourceInfo(params)
                        .then(res => {
                            if (res.code == 200) {
                                this.$message.success('添加成功');
                              this.resourceInfo.filename='';
                              this.params.showFileName=""; 
                              this.resourceInfo.source=""; 
                            } 
                        })
                        .catch(res => {
                            this.$message.error('添加失败');
                        })
                } else {
                    return false;
                }
            });
        },
        back() {
            this.$router.push({
                path: '/resourcelist',
                query: {
                    name: this.$route.query.root,
                    noceStr: Math.round(Math.random() * 10)
                }
            })
        },
        resetForm(formName) {//重置表单
            let id = this.$route.query.id;
            this.$refs[formName].resetFields();
            this.getTemplateInfo(id);   
        },
        stringReplace(str) {
            var index = str.lastIndexOf("\/");
            str = str.substring(index + 1, str.length);
            return str;
        }
    },
    created: function() { $(window).scrollTop(0);
        $("#tmp").slimScroll({
            height: '100%',
            width: '100%',
            color: '#999',
            opacity: 0.5
        });
        let type = this.$route.query.type;
        let id = this.$route.query.id;
        let rootId = this.$route.query.rootId;//上级目录
        if (type == 'add') {
            this.resourceInfo.filename = id;
            this.loading = false;
        } else if (type == 'edit') {
            this.resourceInfo.filename = id;
            this.params.showFileName = this.stringReplace(id);
            this.getResourceInfo(id);
        }
    },
    watch: {
        '$route': function(to, from) {
            this.loading = true;
            let id = this.$route.query.id;
             this.params.showFileName = this.stringReplace(id); 
              this.resourceInfo.filename = id;
             $(window).scrollTop(0);
            this.getResourceInfo(id);
        }
    }
}
</script>
<style>
.left-group .el-form-item__label{
  width: auto;
  padding-right:6px;
}
</style>
