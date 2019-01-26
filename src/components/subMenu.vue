<template>
  <div id="aside">
    <el-menu 
      class="el-menu-vertical-demo"
      background-color="#188ae2"
      text-color="#fff"
      active-text-color="#fff"
      :collapse="$store.state.sys.collapse"
      :default-active="activeIndex"
      unique-opened 
      router
      >
        <span class="cms-menu-title" v-if="!$store.state.sys.collapse">系统菜单</span>

          <template v-for="(item,index) in treeList" >            

          <el-submenu :index="item.id.toString()" v-if="item.haveChildren == true" :key="index">
            <template slot="title">
              <i :class="item.icon" class="iconfont iconfont1"></i>
              <span class="collapse-font" slot="title">{{item.name}}</span>
            </template>

            <template v-for="(child,index2) in item.childrenNodes" >   
                <el-menu-item 
                  v-if="child.haveChildren == false"
                  :index="child.href == null? '/work': child.href" 
                  :key="child.id"
                  class="parent-padding"
                  >
                  {{child.name}}                                    
                </el-menu-item>

                <el-submenu v-else :index="child.id.toString()" class="child-padding" :key="index2">

                  <template slot="title">
                    <span class="collapse-font">{{child.name}}</span>
                  </template>

                  <el-menu-item 
                      v-for="child2 in child.childrenNodes"
                      v-if="!child2.hidden"
                      :index="child2.href == null? '/work': child2.href" 
                      :key="child2.id">
                      {{child2.name}}
                  </el-menu-item>

                </el-submenu>
            </template>
          
          </el-submenu>

          <el-menu-item v-else :index="item.href == null? '/work': item.href" class="" :key="index"> 
              <i :class="item.icon" class="iconfont iconfont1"></i>
              <span class="collapse-font" slot="title">{{item.name}}</span>
          </el-menu-item>

        </template>

    </el-menu>
  </div>
</template>

<script>
import '@/plugs/slimscroll.min.js'
import VueI18n from 'vue-i18n'
import cmsZhLocale from '@/i18n/lang/zh_CN'
import cmsEnLocale from '@/i18n/lang/en'
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
  name: "cms-submenu",
  data() {
    return {
      activeIndex: null,
      isCollapse: false,
      menuList: [],
      treeList: [],
      currentSiteId: null
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      
    },
    handleClose(key, keyPath) {
      
    },
    getSideMenu () {
      let url = this.$api.menuListGet
      axiosProxy.get(url).then(res => {
        if(res.data.errorCode == '0') {
          this.menuList = res.data.data
          if(this.currentSiteId != 1) {
            for (let i in this.menuList) {
              if(this.menuList[i].id == 24) {
                this.menuList.splice(i, 1)
              }

              if(this.menuList[i].id == 28) {
                this.menuList.splice(i, 1)
              }
            }
          }
          this.setTree(this.menuList)
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('请求失败')
          }
        }
      });
    },
    setTree (array) {
      for (let i = 0; i < array.length; i++) {
        array[i].childrenNodes = []
        if(array[i].parentId) {
          for(let j = 0; j < array.length; j++) {
            if(array[i].parentId == array[j].id) {
              array[j].childrenNodes.push(array[i])
            }
          }
        } else {
          this.treeList.push(array[i])
        }
      }
    }
  },
    watch: {
      $route: function(to, from) {
        this.activeIndex = this.$route.path;
      }
  },
  mounted(){
    this.activeIndex = this.$route.matched[1].path;
      $("#aside").slimScroll({
        height: "100%",
        width: "auto",
        wrapperClass: "asidebar",
        color: "#fff",
        opacity: 0
      });

      this.getSideMenu()
      this.currentSiteId = window.localStorage.getItem('_site_id_param')
  }
};
</script>

<style lang="scss" scoped>
.full-height {
  width: 220px;
  height: 100%;
}
.el-menu{
  
  position: relative;
  z-index: 55;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;

}
.el-menu-vertical-demo{

}
.cms-menu-title{
  display: inline-block;
  padding: 20px 24px 15px 24px;
  width: 100%;
  font-size: 14px;
  color: #3caeff;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.collapse-font{
  margin-left: 12px;
}
.el-menu--collapse{
  position: fixed;
  z-index: 500;
}
.el-menu--collapse .iconfont{
  font-size: 24px;
  margin-left: 0;
  position: relative;
  left:-7px;
}
.parent-padding{
  padding-left:56px !important;
}
.el-menu-item.is-active{
  /*background: #1c6fb3 !important;*/
}
.iconfont{
  color: #fff;
}
</style>

