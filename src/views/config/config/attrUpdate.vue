<template>
    <section class="cms-body" v-loading="loading">

        <el-form ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="天数" class="flex-50" prop="dayNew">
                <el-input v-model="dataInfo.dayNew" class="cms-width" type='number'></el-input>
                <span class="gray">定义多少天内为New(1代表今日)</span>
            </el-form-item>
            <el-form-item label="new标记图片" class="flex-50" prop="pictureNew">
                <el-input v-model="dataInfo.pictureNew" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="预览部分内容" class="flex-50" prop="preview">
                <el-radio v-model="dataInfo.preview" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.preview" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="流量统计开关" class="flex-50" prop="flowSwitch">
                <el-radio v-model="dataInfo.flowSwitch" :label="true">是</el-radio>
                <el-radio v-model="dataInfo.flowSwitch" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="二维码宽度" class="flex-50" prop="codeImgWidth">
                <el-input v-model="dataInfo.codeImgWidth" class="cms-width" type='number'></el-input>
            </el-form-item>
            <el-form-item label="二维码高度" class="flex-50" prop="codeImgHeight">
                <el-input v-model="dataInfo.codeImgHeight" class="cms-width" type='number'></el-input>
            </el-form-item>
            <el-form-item label="微信小程序ID" class="flex-50" prop="weixinAppId">
                <el-input v-model="dataInfo.weixinAppId" class="cms-width" type='password'></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
            <el-form-item label="微信小程序密钥" class="flex-50" prop="weixinAppSecret">
                <el-input v-model="dataInfo.weixinAppSecret" class="cms-width" type='password'></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
            <!-- <el-form-item label="微信开放平台ID" class="flex-50" prop="weixinLoginId">
                <el-input v-model="dataInfo.weixinLoginId" class="cms-width" type='password'></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
            <el-form-item label="微信开放平台密钥" class="flex-50" prop="weixinLoginSecret">
                <el-input v-model="dataInfo.weixinLoginSecret" class="cms-width" type='password'></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item> -->

            <el-form-item label="百度推送Token" class="flex-50" prop="bdToken">
                <el-input v-model="dataInfo.bdToken" class="cms-width" type="password"></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
            <el-form-item label="是否开启百度推送" class="flex-50" prop="isBdSubmit">
                <el-radio v-model="dataInfo.isBdSubmit" label="true">是</el-radio>
                <el-radio v-model="dataInfo.isBdSubmit" label="false">否</el-radio>
            </el-form-item>

            <el-form-item label="内容查询缓存时间" class="flex-50" prop="contentFreshMinute">
                <el-input v-model="dataInfo.contentFreshMinute" class="cms-width" type='number'></el-input>
                <span class="gray">单位:分钟[0表示不缓存]</span>
            </el-form-item>
            <el-form-item class="flex-50">
                <el-button @click.native="clear($api.configAttrClear)" v-perms="'/config/configAttrUpdate'">清除缓存内容</el-button>
            </el-form-item>
            <div class="form-footer">
                <el-button type="primary" @click="update()" v-perms="'/globel/attrUpdate'">修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
            </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
export default {
  mixins: [listMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    return {
      params: {
        //只需要业务参数
      },
      rules: {
        //校验规则
        dayNew: [required, number],
        pictureNew: [required],
        preview: [required],
        flowSwitch: [required],
        codeImgWidth: [required, number],
        codeImgHeight: [required, number],
        contentFreshMinute: [required, number]
      }
    };
  },
  methods: {
    clear(url) {
      let api = this.$api; //API地址
      axios
        .all([
          axios.post(url) //axios批量发送请求
        ])
        .then(
          axios.spread(attr => {
            if (attr.message === "成功!") {
              this.$alert("清除缓存成功", "提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    getDataInfo() {
      let api = this.$api; //API地址
      axios
        .all([
          axios.post(api.configAttrGet) //axios批量发送请求
        ])
        .then(
          axios.spread(attr => {
            this.dataInfo = attr.body;
            this.dataInfo.weixinAppId = "";
            this.dataInfo.weixinAppSecret = "";
            this.dataInfo.weixinLoginId = "";
            this.dataInfo.weixinLoginSecret = "";
            this.dataInfo.bdToken = "";
            this.$refs["form"].resetFields();
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    update() {
      this.updateDataInfo(this.$api.configAttrUpdate, this.dataInfo, "");
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo();
  }
};
</script>

<style>
</style>