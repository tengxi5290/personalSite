<template>
  <div class="cms-pagination">
      <div class="page-input">
         <span>每页显示</span>
          <el-input class="small" style="padding:0 5px;" type="number" min="0"
           v-model.number="inputNum"
           @blur="setPage"
           placeholder="1-30"
          @keyup.enter.native="setPage"
          ></el-input>
          <span>条，输入后按回车键</span>
      </div>
      <el-pagination
          background
          layout="total,prev, pager, next"
          :page-size="size"
          :total="total"
          :current-page="current"
          @current-change="handleCurrentChange"
          > 
      </el-pagination>
  </div>
</template>

<script>


export default {
  name: "cms-pagination",
  props: {
    init: "",
    page: null,
    pageSize: null,
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      inputNum: 10, //默认输入的条数
      size: 0,
      current: 1,
      initPage: ''
    };
  },
  methods: {
    setPage(event) {
      let state
      let num = event.target.value;
      if(num > 0 && num <= 30) {
        state = true
      } else {
        state = false
      }
      if (state) {
        this.size = parseInt(num);
      } else {
        this.size = 10;
        this.inputNum=10;
      }
      this.current=1;
     this.$emit("change", this.current, this.size);
    },
  
    handleCurrentChange(val) {
      this.current = val;
      this.$emit("change", this.current, this.size);
    }
  },
  created() {
    this.initPage = this.init
    this.size = this.pageSize
    this.inputNum = this.pageSize
    this.current = this.page
  },
  updated () {
    if(this.initPage == true) {
      this.size = this.pageSize
      this.current = this.page
    }
  },


};
</script>

<style lang="scss" scoped>
.cms-pagination {
  display: flex;
}
.page-input {
  display: inline-block;
  display: flex;
  align-items: center;
  margin-right: 35px;
  > span {
    display: inline-block;
    color: #8a8e98;
    font-size: 14px;
    user-select: none;
    white-space: nowrap;
  }
  .small {
    width: 58px;
    padding: 0 5px;
  }
}
</style>