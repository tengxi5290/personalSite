<template>
    <div >
    
        <div class="cms-list-header clearfix flex">
            <span class="forum-name" style="font-size:14px">{{$route.name}}-{{mobileState}}</span>
        </div>
        
            <el-form class="cms-form" label-width="162px" style="margin:0;padding:0"> 
                <el-form-item label="默认方案" class="flex-100" >
                    <el-col :span="4">
                        <el-select v-model="params.solution">
                            <el-option v-for="item in solutions" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" style="margin-left:15px" @click="setSolutions"
                        >设置</el-button>
                    </el-col>
                </el-form-item>

                <el-form-item label="导出方案" class="flex-100">
                    <el-col :span="4">
                        <el-select v-model="solution">
                            <el-option v-for="item in solutions" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                         <a :href="exportLink" class="el-button el-button--primary" style="margin-left:15px">导出</a>
                    </el-col>
                </el-form-item>

                 <el-form-item label="导入" class="flex-100">
                    <el-col :span="6">
                                  <el-upload
                      :action="$store.state.sys.importTpl"
                      name="uploadFile" 
                      :data="upobj"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                        style="display:inline-block">
                      <el-button type="primary">导入</el-button>
                      </el-upload>
                    </el-col>
                </el-form-item>
            </el-form>
            <div class="margin-md">

            </div>
        </div>
   
</template>

<script>
import * as fetch from "@/api/interface";
import * as exportExcel from "@/api/exportLink";
import { getRand } from "@/untils/random";
import { signParams } from "@/untils/sign";
 import axios from "axios"
export default {
  data() {
    var rand = getRand();
    return {
      solutions: [], //方案
      params: {
        //接口参数
        solution: "",
        mobile: true
      },
      solution: "",
      exportLink: "#",
      mobileState: "PC",
      upobj: signParams(
        {
          appId: process.env.appId,
          sessionKey: localStorage.getItem("sessionKey"),
          nonceStr: rand
        },
        process.env.appKey
      )
    };
  },
  methods: {
    getSolutions() {
      fetch.getSolutions().then(res => {
      
        this.solutions = res.body;
          axios.post(this.$api.siteGet,{id:this.$getSiteId()}).then(res1=>{
            if(this.mobileState=='PC'){
             this.params.solution = res1.body.tplSolution;
                this.solution = res1.body.tplSolution;
              this.params.mobile='';  
            }else{
                   this.params.solution =res1.body.tplMobileSolution;;
                   this.solution = res1.body.tplMobileSolution;
                   this.params.mobile=res1.body.tplMobileSolution;  
            }
          })

      
      });
    },
    setSolutions() {
        if(this.mobileState=='PC'){
            this.params.mobile='';
        }else{
            this.params.mobile=this.params.solution;
            this.params.solution='';
        }
      fetch.setSolutions(this.params).then(res => {
        if (res.code == "200") {
          this.$message.success("设置成功");
           this.getSolutions();
        } else {
          this.$message.error("设置失败");
           this.getSolutions();
        }
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
          this.successMessage('导入成功');
      } else if (res.code == 209) {
        this.errorMessage("无上传权限");
      } else {
        this.errorMessage("上传失败");
      }
    }
  },
  created: function() {
    this.params.mobile = this.$route.query.mobile;
    if (this.$route.query.mobile) {
      this.mobileState = "mobile";
    } else {
      this.mobileState = "PC";
    }
    this.getSolutions();
    this.exportLink = exportExcel.templateExport({ solution: this.solution });
  },
  watch: {
    $route: function(to, from) {
      if (this.$route.query.mobile) {
        this.mobileState = "mobile";
      } else {
        this.mobileState = "PC";
      }
       this.getSolutions();
    },
    solution: {
      handler(curVal, oldVal) {
        this.exportLink = exportExcel.templateExport({
          solution: this.solution
        });
      }
    }
  }
};
</script>

<style>

</style>
