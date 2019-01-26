// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'//根组件
import router from './router'//vue-router
import store from "./store"//vuex
import i18n from '@/i18n'
import "babel-polyfill";
// import './permissions'//全局路由钩子
import '~/css/index.scss'//cms样式
import global from "@/untils/global"//全局方法
import cmsComponents from "@/components/index"
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import '@/directive/index'
import VueCropper from 'vue-cropper' 


Vue.use(cmsComponents)
Vue.use(ElementUI)
Vue.use(VueCodemirror)
Vue.use(VueCropper)




Vue.config.productionTip = false
Vue.use(global);
new Vue({
  router,
  store,
    i18n,
  template: '<App/>',
  components: { App }
}).$mount('#app')

