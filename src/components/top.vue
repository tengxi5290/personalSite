<template>
  <div class="back-to-top" @click="backToTop" 
  v-show="showReturnToTop" @mouseenter="show" 
  @mouseleave="hide">
    <i :class="[bttOption.iClass]"></i>
  </div>
</template>

<script>
  import { scrollIt } from '@/plugs/scrollIt'; // 引入动画过渡的实现
  export default {
    name: 'cms-top',
    props: {
      text: { // 文本提示
        type: String,
        default: '返回顶部'
      },
      textColor: { // 文本颜色
        type: String,
        default: '#f00'
      },
      iPos: { // 文本位置
        type: String,
        default: 'right'
      },
      iClass: { // 图标形状
        type: String,
        default: 'iconfont icon-huidaodingbu'
      },
      iColor: { // 图标颜色
        type: String,
        default: '#f00'
      },
      iFontsize: { // 图标大小
        type: String,
        default: '32px'
      },
      pageY: { // 默认在哪个视图显示返回按钮
        type: Number,
        default: 200
      },
      transitionName: { // 过渡动画名称
        type: String,
        default: 'easeOutQuad'
      }
    },
    data: function () {
      return {
        showTooltips: false,
        showReturnToTop: false
      }
    },
    computed: {
      bttOption () {
        return {
          text: this.text,
          textColor: this.textColor,
          iPos: this.iPos,
          iClass: this.iClass,
          iColor: this.iColor,
          iFontsize: this.iFontsize
        }
      }
    },
    methods: {
      show () { // 显示隐藏提示文字
        return this.showTooltips = true;
      },
      hide () {
        return this.showTooltips = false;
      },
      currentPageYOffset () {
          console.log(this.pageY);
        // 判断滚动区域大于多少的时候显示返回顶部的按钮
        window.pageYOffset > this.pageY ? this.showReturnToTop = true : this.showReturnToTop = false;

      },
      backToTop () {
        scrollIt(0, 200, this.transitionName, this.currentPageYOffset);
      }
    },
    created () {
      window.addEventListener('scroll', this.currentPageYOffset);
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.currentPageYOffset)
    }
  }
</script>

<style scoped lang="scss">
  .back-to-top {
    position: fixed;
    bottom: 5%;
    right: 5%;
    z-index: 9998;
    cursor: pointer;
     width: 50px;
     height: 50px;
      background-color: rgba(0, 0, 0, 0.52);
      border-radius: 5px;
    i {
      font-size: 32px;
      line-height: 32px;
      display: inline-block;
      position: relative;
      text-align: center;
      margin-top: 7px;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s linear;
      
    }
   &:hover {
         background-color: rgba(0, 0, 0, 1); 
        color: #fff;
      }
   
  }
</style>