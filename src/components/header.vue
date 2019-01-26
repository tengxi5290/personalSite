<template>

    <header class="bbs-header">
        <div class="header-left">
            <img :src="siteLogo" alt="Jeecms" class="header-logo" width="auto" height="48">
            <a href="javascript:void(0)" class="cms-slide-menu" @click="collapseMenu"></a>
        </div>
        <div class="header-right">
            <div class="header-user-group">
                <img :src="userHeadPhoto" alt="" class="user-logo">
                <span class="username">{{userName}}</span>
                </div>
                <span title="个人中心" class="iconfont icon-bianji-copy" @click="userCenter"></span>
                  <span title="查看首页"  class="iconfont icon-wangzhan-copy" @click="getIndex"></span>
                <span title="退出"  class="iconfont icon-out-copy" @click="logout"></span>

                <el-dropdown style="margin-left:22px;" class="cur" @command="setSiteId">
                  <span class="el-dropdown-link">
                    {{siteName}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <!-- 被选中的 -->

                  <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="(item,index) in siteItems" :key="index"
                    :command="item.id"
                    >
                      {{item.shortName}}</el-dropdown-item>
                  </el-dropdown-menu>
                  <!-- 下拉列表 -->
                </el-dropdown>

        </div>
    </header>

</template>

<script>
import axios from "axios";
import i18n from "@/i18n";
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
  name: "cms-header",
  data() {
    return {
      userHeadPhoto:'',
      userName:'',//用户名称
      siteItems:'',//获取到站点的名称
      siteId: localStorage.getItem('_site_id_param'),
      siteName:'',//被选中的站点,显示出来的名称
      currentId:'',//选中的那个站点的id
      siteLogo: '', // 站点logo
    };
  },
  created(){
    //页面创建之前得到用户信息及其站点信息
    this.getUserInfo()
  },
  methods: {
    handleCommand (command) {
      console.log(command)
    },
    siteDetail (siteId) {
      axiosProxy.get(this.$api.site + '/' + siteId)
        .then(res=>{
          if(res.data.errorCode == '0') {
            this.siteLogo = res.data.data.logo
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
      .catch(error=>{
        console.log(error)
      })
    },
    getUserInfo(){
      // 得到用户信息和站点信息
      axiosProxy.get(this.$api.user)
            .then(res=>{
              if(res.data.errorCode == '0') {
                //下面的是判断为未登录时执行的操作

                // checkErrorCode(res)
                this.loading=false;

                //通过了上方判断,读取登录用户的信息
                var userHeadPhoto=res.data.data.headShot;
                this.userHeadPhoto=userHeadPhoto;
                this.userName=res.data.data.userName;
                localStorage.setItem('userName',this.userName);
                localStorage.setItem('userType',res.data.data.role);


                //通过上方判断,获取到对应站点信息,渲染到右上角
                axiosProxy.get(this.$api.siteList)
                  .then(res=>{
                    if(res.data.errorCode == '0') {
                      var siteInfo=res.data.data
                      window.localStorage.setItem('siteList', JSON.stringify(siteInfo))
                      this.siteItems=siteInfo
                      this.getSiteName(this.siteItems);//获取到current为true的sitename,显示到页面上
                    } else {
                      if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                      } else {
                        this.errorMessage('请求失败')
                      }
                    }
                  })
                  .catch(error=>{
                    console.log(error)
                  })
              } else {
                if(res.data.errorMessage) {
                  this.errorMessage(res.data.errorMessage)
                } else {
                  this.errorMessage('请求失败')
                }
                setTimeout(()=>{
                  window.localStorage.clear();
                  location.href="http://cmstest.cnlive.com:8768/logout"
                },1000)
              }
            })
            .catch(error=>{
            console.log(error)
            })
    },
    getSiteName(data){
      //设置右上角current为true的站点名字
      for(let i in data){
        if(data[i].current){
          this.siteName=data[i].shortName;
          localStorage.setItem('_site_id_param',data[i].id);
          this.siteDetail(data[i].id)
        }
      }
    },
    setSiteId(val){
      localStorage.setItem('_site_id_param',val);
      this.$router.push("/work");

      let url=this.$api.siteChange;
      axiosProxy.put(url+'/'+val)//这里的val就是里面的下拉列表中绑定的item.id
        .then(res=>{
          if(res.data.errorCode==0){
            window.location.reload();//重新处理请求
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
              this.errorMessage('请求失败')
            }
          }
        })
        .catch(err=>{
          console.log(err)
        })

    },

    collapseMenu() {//侧边栏收缩
      this.$store.dispatch("setCollapse");
    },
    userCenter(){
      location.href="http://console.open.cnlive.com/open/console/user/info"
    },
    toggleLocal(){

    },
    logout() {//退出登录
      this.$confirm('确定退出吗？','提示', {type: "warning"})
        .then(mes => {
          window.localStorage.clear();
          location.href="http://cmstest.cnlive.com:8768/logout"
        })
        .catch(error => {});
    },
    getIndex(){//查看首页
        window.open(this.$store.state.sys.baseUrl);
    }
  }
};
</script>

<style lang="scss" scoped>
$header-height: 60px;
.bbs-header {
  width: 100%;
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid #e0e4e9;
  box-shadow: 10px 1px 15px rgba(0, 0, 0, 0.17);
  padding: 0 24px;
  position: fixed;
  position: fixed;
  top:0;
  z-index:1002;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);

}
.header-left {
  float: left;
  display: flex;
  align-items: center;
  height: $header-height;
}
.header-right {
  float: right;
  display: flex;
  align-items: center;
  height: $header-height;
  .iconfont {
    cursor: pointer;
    font-size: 20px;
    color: #777777;
    margin-left: 25px;
    &:hover{
        color: #188ae2;
    }
  }
}

@media screen and(max-width:700px) {
  .header-right {
    display: none;
  }
  .header-left {
    width: 100%;
    .header-logo {
      text-align: center;
      margin: 0 auto;
    }
  }
}
.header-user-group {
  display: flex;
  height: $header-height;
  line-height: $header-height;
  align-items: center;
}
.user-logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.header-logo {
  margin-left: 26px;
}
.cms-slide-menu {
  height: 16px;
  width: 18px;
  background: url("./../assets/images/collapse.png") no-repeat;
  margin-left: 73-26px;
}
.cur{
  cursor: pointer;
}

</style>
