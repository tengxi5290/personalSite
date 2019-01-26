<template>
  
  <div class="login-container">
    <div class="login-inner-box">
       <canvas id="root" width="1000" height="560" class="art-canvas"></canvas>
           <div class="login-form">
               <img src="./../assets/images/login-logo.png" alt="" class="login-img">
                  <div class="val user-after">
                    <input type="text" autocomplete="off" placeholder="用户名"
                       v-model="params.userName"
                       @blur="requireUserName" 
                       @keyup.enter="login"
                       class="login-input user">
                    <label id="userName"></label>
                </div>
                 <div class="val pwd-after">
                    <input type="password" autocomplete="new-password" placeholder="密码"
                      v-model="params.password"
                       @blur="requirePwd" 
                       @keyup.enter="login"
                       class="login-input user">
                    <label id="pwd"></label>
                </div>
                 <el-button :loading="loading"  class="login-input login-btn" @click="login" id="login">{{loginFont}}</el-button>
                
           </div>
           
    </div>
   <div class="fixed-bar">
       <p>ICP备案号：赣ICP备13005266号</p>
       <p>Powered by JeeCms Copyright © 2007-2017 www.jeecms.com, All Rights Reserved</p>
   </div>
  </div> 
</template>

<script>
import CanvasAnimate from "@/plugs/canvas";
export default {
  data() {
    return {
      loading: false,
      params: {
        userName: "",
        password: ""
      },
      loginFont: "登录"
    };
  },
  methods: {
    requireUserName() {
      if (this.params.userName == "") {
        $("#userName")
          .addClass("error")
          .text("请填写用户名");
      } else {
        $("#userName")
          .removeClass("error")
          .text(" ");
      }
    },
    requirePwd() {
      if (this.params.password == "") {
        $("#pwd")
          .addClass("error")
          .text("请填写密码");
        $("#login").css("background", "#ebcd41");
      } else {
        $("#pwd")
          .removeClass("error")
          .text(" ");
        $("#login").css("background", "#fee300");
      }
    },
    changePwd() {
      $("#pwd")
        .removeClass("error")
        .text("");
    },
    login() {
      if (this.params.userName == "" || this.params.password == "") {
        this.requireUserName();
        this.requirePwd();
      } else {
        this.loading = true;
        this.loginFont = "正在登录...";
        this.$store
          .dispatch("userLogin", this.params)
          .then(res => {
            if (res.code == "200") {
              this.$store
                .dispatch("setRouters")
                .then(res => {
                  if (res.code == "200") {
                   this.$router.addRoutes(this.$store.state.perms.addRouters);
                   this.$router.push("/work");
                    this.loginFont = "登录";
                   this.loading = false;     
                  } else {
                    this.restInfo();
                  }
                })
                .catch(error => {
                  this.restInfo();
                });
            } else if(res.code == "304"){
              this.errorMessage("用户或密码名错误!");
              this.restInfo();
            }else if(res.code == "301"){
              this.errorMessage(res.message+"!");
              this.restInfo();
            }else if(res.code == "209"){
              // this.errorMessage(res.message+"!");
              this.restInfo();
            }
          })
          .catch(error => {
            this.restInfo();
          });
      }
    },
    restInfo() {
      this.loading = false;
      this.loginFont = "登录";
      this.params.password = "";
    },
    canvas() {
      //画布背景
      var root = document.querySelector("#root");
      var a = new CanvasAnimate(root, {
        length: 15,
        clicked: false,
        moveon: true
      });
      a.Run();
    }
  },
  mounted() {
    this.canvas();
  }
};
</script>

<style scoped lang='scss'>
.val {
  width: 320px;
  margin: 0 auto;
  position: relative;
  z-index: 99;
}
.user-after::after {
  position: absolute;
  top: 8px;
  right: 15px;
  color: #8ba6ba;
  font-family: "iconfont";
  font-size: 24px;
  content: "\e65e";
}
.pwd-after::after {
  position: absolute;
  top: 10px;
  right: 16px;
  color: #8ba6ba;
  font-family: "iconfont";
  font-size: 24px;
  content: "\e65f";
}
.val label {
  position: absolute;
  top: 14px;
  right: 0px;
  z-index: 999;
  color: #ff0000;
  transition: 0.25s right linear;
  transform: translate(0, 0);
  font-size: 12px;
}

.val label.error {
  right: 48px;
  transition: 0.5s right;
}
</style>
