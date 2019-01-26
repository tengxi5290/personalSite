import axios from "axios";
import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
    data() {
        return {
            loading: true,//遮罩
            id: this.$route.query.id,//id
            type: this.$route.query.type,//操作类型
            dataInfo: {},//基础表单信息
            form: this.$refs['form']//
        }
    },
    methods: {
        /**
         * 获取数据方法
         * @param {number} id 
         * @param {object} obj 
         */
        getDataInfo(id, obj) {

        },
        /**
         * @param {booealn} state 是否继续添加
         * @param {string} url 添加方法的api地址 
         * @param {object} params 添加的参数
         * @param {string} backUrl ，返回列表的路由地址
         */
        saveDataInfo(state, url, params, backUrl, callback) {
            let form = this.$refs['form']
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true
                    let content = params
                    axiosProxy.post(url, content)
                        .then(res => {  
                            if (res.data.errorCode == "0") {
                                this.successMessage('添加成功')
                                if (state) {
                                    this.resetDataInfo(this.dataInfo)
                                } else {
                                    callback()
                                }
                            } else {
                                if(res.data.errorMessage) {
                                    this.errorMessage(res.data.errorMessage)
                                } else {
                                    this.errorMessage('添加失败')
                                }
                            }
                            this.loading = false
                        }).catch(
                            error => { 
                                this.loading = false;
                            }
                        )
                } else {
                    return false
                }
            })
        },
        updateDataInfo(url, params, backUrl) {
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                    axiosProxy.put(url, params)
                        .then(res => {
                            this.loading = false;
                            if (res.data.errorCode == "0") {
                                this.successMessage('修改成功')
                                setTimeout (() => {
                                    this.routerLink(backUrl)
                                }, 1000)
                            } else {
                                if(res.data.errorMessage) {
                                    this.errorMessage(res.data.errorMessage)
                                } else {
                                    this.errorMessage('修改失败')
                                }
                            }
                        }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
            })
        },
        /**
         * 
         * @param {string} type 判断添加还是修改 save，update 
         */
        isType(type) {
            return this.type == type ? true : false;
        },
        resetDataInfo(dataGroup) {
            for (let i in dataGroup) {
                if(i == 'single' || i == 'isRequire') {
                    dataGroup[i] = false
                } else {
                    dataGroup[i] = ""
                }

                if(i == 'priority') {
                    dataGroup[i] = 0
                }
            }
        }
    }

}