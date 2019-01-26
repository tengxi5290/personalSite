
import Vue from 'vue'
import store from '@/store/index'
Vue.directive("perms", {
    bind(el, binding) {
        let perms = store.state.perms.permsList;//按钮权限指令
    }
});