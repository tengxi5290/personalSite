<template>
   <div >
        <cms-back></cms-back>   
            <el-form :model="params" :rules="rules" ref="topicInfo"  class="cms-form" label-width="162px"
             style="padding:0;margin:0">
                <el-form-item label="原名称" class="flex-100">
                        {{params.origName}}
                </el-form-item>
                  
                 <el-form-item label="新名称"  prop="distName" class="flex-100">
                        <el-input v-model="params.distName" class="cms-width" style="width:280px"></el-input>                  
                </el-form-item>
                 
            </el-form>
            <div class="form-footer">
                 <el-button type="primary" @click="reName('topicInfo')"
                         v-perms="'/resourcerename'"
                 >修改</el-button>
                <el-button type="info">重置</el-button>
            </div>
    </div>
</template>

<script>
import * as fetch from '@/api/interface'

export default {
    data() {
        return {
            loading: true,
            rules: {
                distName: [{ required: true, message: '此项必填', trigger: 'blur' }]
            },
            params:{
                origName:'',
                distName:'',
                root:''
            }
        }
    },
    methods: {
        reName(formName) {//修改系统信息
            this.$refs[formName].validate((valid) => {
              
                if (valid) {
                    let params = this.params;
                    fetch.reName(params)
                        .then(res => {
                             this.loading = false;
                            if (res.code == 200) {
                                this.$message.success('修改成功');
                           this.$router.push({path: '/resourcelist',query:{name:this.params.root}})
                            } else {
                                this.$message.error(res.message);
                                 this.$router.push({path: '/resourcelist',query:{name:this.params.root}})
                            }
                        })
                        .catch(res => {
                             this.loading = false;
                            this.$message.error('修改失败');
                            this.$router.push({path: '/resourcelist',query:{name:this.params.root}})
                        })
                } else {
                     
                    return false;
                }
            });
        },
        back(){
              this.$router.push({path: '/resourcelist',query:{name:this.params.root}})
        }
    },

    created: function() {
        let name = this.$route.query.name;
        let root=this.$route.query.root;
        this.params.origName=name;
        this.params.distName=name;
        this.params.root=root;
    }
   
}
</script>
<style>

</style>
