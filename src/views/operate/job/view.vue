<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>  
        <!--startprint-->
            <div class="print-page"  style=" width: 210mm;
                        height: 297mm;
                        padding: 30px;
                        margin: 0 auto;
                        font-size: 12px;
                        text-align: center;">
            <div  id="doctitle">
                     <h2 class="print-title"
                     style="  text-align: center;
                              margin-bottom: 30px;"
                     >{{dataInfo.resumeName}}简历</h2>
                <table style=" margin: 0 auto;
                        border-collapse: collapse;
                        border-top: 1px solid #d8dce5;
                        border-right: 1px solid #d8dce5;
                        padding: 0;">
                     <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">姓名</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.realname}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">性别</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">
                              <span v-if="dataInfo.gender">  男</span>  
                                  <span v-else> 女 </span>                 
                         </td>
                     </tr>
                     <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">出生日期</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.birthday}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">来自</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.comefrom}}</td>
                     </tr>
                    <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">手机号</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.mobile}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">固定电话</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.phone}}</td>
                     </tr>
                     <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">学历</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.eduBack}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">专业</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.eduDiscipline}}</td>
                     </tr>
                      <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">毕业学校</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.eduSchool}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">毕业时间</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.eduGraduation}}</td>
                     </tr>
                      <tr>
                          <td colspan="4" style="border-left: 1px solid #d8dce5;   height: 16px;   border-bottom: 1px solid #d8dce5;"></td>
                      </tr>
                      <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">期望工作性质</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.targetWorknature}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">期望工作地点</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.targetWorkplace}}</td>
                     </tr>
                       <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">期望职位类型</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.targetCategory}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5;          border-left: 1px solid #d8dce5;">期望月薪</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.targetSalary}}</td>
                     </tr>
                      <tr>
                          <td colspan="4" style="border-left: 1px solid #d8dce5;   height: 16px;   border-bottom: 1px solid #d8dce5;"></td>
                      </tr>
                       <tr>
                          <td colspan="4" style="border-left: 1px solid #d8dce5;   height: 16px;   border-bottom: 1px solid #d8dce5; line-height:32px;text-align:center" >最近一次工作经历</td>
                      </tr>
                       <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;border-bottom:1px solid #d8dce5;border-left: 1px solid #d8dce5;">公司名称</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.recentCompany}}</td>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;border-bottom:1px solid #d8dce5; border-left: 1px solid #d8dce5;">职位名称</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;">{{dataInfo.jobName}}</td>
                     </tr>
                     <tr>
                         <td style="background: #f1f3f7; color: #999999;font-size: 12px;        width: 98px;        height: 32px;        text-align:center;         border-bottom:1px solid #d8dce5; border-left: 1px solid #d8dce5;">工作起止时间</td>
                         <td style="width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535; text-align: left;" colspan="3" >{{dataInfo.jobStart}}</td>
                     </tr>
                     <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center;  border-bottom:1px solid #d8dce5;  border-left: 1px solid #d8dce5;height:243px" >工作描述</td>
                         <td style=" width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535;   text-align: left;
                          padding-top: 15px;
  vertical-align: top;
                         
                         " colspan="3" >{{dataInfo.jobDescription}}</td>
                     </tr>
                      <tr>
                         <td style="background: #f1f3f7;        color: #999999;        font-size: 12px;        width: 98px;        height: 32px;        text-align:center; border-bottom:1px solid #d8dce5;border-left: 1px solid #d8dce5; height:100px" >自我评价</td>
                         <td style=" width: 170px;   border-left: 1px solid #d8dce5;   border-bottom: 1px solid #d8dce5;   padding-left: 15px;   color: #353535;   text-align: left;
                          padding-top: 15px;
  vertical-align: top;
                         " colspan="3" >{{dataInfo.selfEvaluation}}</td>
                     </tr>
                </table>
        </div>
         <!--endprint-->      
                   <el-button type="primary"  @click="print()"
                        v-perms="'/group/edit'"
                       style="margin-top:24px;" 
                    >打印简历</el-button>  
            </div>
          
           
    </section>
</template>

<script>
import listMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
import "~/js/jquery.PrintArea";
export default {
  mixins: [listMixins],
  data() {
    let self = this;
    return {
      params: {
        //只需要业务参数
        userId: "",
        contentId: ""
      },
      activeNames: ["1"],
      rules: {},
      memberGroup: [], //业务变量会员组
      roles: []
    };
  },
  methods: {
    getDataInfo(contentId, userId) {
      let api = this.$api; //API地址
      axios
        .all([
          axios.post(api.jobapplyView, {
            contentId: this.id,
            userId: this.type
          }) //axios批量发送请求
        ])
        .then(
          axios.spread(group => {
            this.dataInfo = group.body;

            this.$refs["form"].resetFields();
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    print() {
      var newWin=window.open('about:blank', '', '');   
  var titleHTML=document.getElementById("doctitle").innerHTML;   
  newWin.document.write(titleHTML);   
  newWin.document.location.reload();   
  newWin.print(); 
    }
  },
  created() {
    //初始获取数据

    this.getDataInfo(this.type, this.id);
  }
};
</script>

<style scoped  lang='scss'>
.print-page {
  width: 210mm;
  height: 297mm;
  padding: 30px;
  margin: 0 auto;
  font-size: 12px;
  text-align: center;
}
.print-page table {
  margin: 0 auto;
  border-collapse: collapse;
  padding: 0;

  border-top: 1px solid #d8dce5;
  border-right: 1px solid #d8dce5;
}
.print-title {
  text-align: center;
  margin-bottom: 30px;
}
.print-label {
  background: #f1f3f7;
  color: #999999;
  font-size: 12px;
  width: 98px;
  height: 32px;
  text-align: center;
  border-bottom: 1px solid #d8dce5;
  border-left: 1px solid #d8dce5;
}
.print-content {
  width: 170px;
  border-left: 1px solid #d8dce5;
  border-bottom: 1px solid #d8dce5;
  padding-left: 15px;
  color: #353535;
  text-align: left;
}
.print-seg {
  border-left: 1px solid #d8dce5;
  height: 16px;
  border-bottom: 1px solid #d8dce5;
}
.print-area {
  padding-top: 15px;
  vertical-align: top;
}
</style>
