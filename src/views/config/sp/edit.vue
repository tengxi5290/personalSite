<template>
    <section class="cms-body">
        <!-- 返回组件 -->
        <cms-back></cms-back> 

        <el-form  ref="form" :model="dataInfo" class="cms-form" label-width="162px">
            <el-form-item label="spId" class="flex-50" prop="id">
                <el-input v-model="dataInfo.id" class="cms-width"></el-input>
            </el-form-item> 

            <el-form-item label="sp名称" class="flex-50" prop="name">
                <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item> 

            <el-form-item label="详情" class="flex-50" prop="spDesc">
                <el-input type="textarea" :rows="2" resize="none" v-model="dataInfo.spDesc"></el-input>
            </el-form-item>
              
            <el-form-item label="房间公告" class="flex-50" prop="spLiveNotice">
                <el-input type="textarea" :rows="2" resize="none" v-model="dataInfo.spLiveNotice"></el-input>
            </el-form-item>

            <el-form-item label="缩略图" class="flex-50" prop="icon">
                <uploader @change="getUrl" :default="dataInfo.icon" v-if="showImage"></uploader>
            </el-form-item>


            <div class="form-footer">
                <el-button type="primary" v-if="pageType == 'add'" @click="addSp('add')">提交</el-button>
                <el-button type="primary" v-if="pageType == 'update'" @click="addSp('update')">更新</el-button>
                <el-button type="info" @click="reset">重置</el-button>
            </div>
        </el-form>       
      </section>    
</template>
<script>
    import axios from "axios";
    import {axiosProxy} from "@/api/tool"
    import va from "@/rules";
    export default {
        data() {
            return {
                dataInfo: {
                    id: null,
                    name: null,
                    icon: null,
                    spDesc: null,
                    spLiveNotice: null,
                },
                pageType: '',
                showImage: true
            }
        },
        methods:{
            reset() {
                this.dataInfo.id = null
                this.dataInfo.name = null
                this.dataInfo.spLiveNotice = null
                this.dataInfo.icon = null
                this.dataInfo.spDesc = null
                this.showImage = false
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            },
            getUrl (imageUrl) {
                this.dataInfo.icon = imageUrl
            },
            addSp (type) {
                axiosProxy.post(this.$api.spAdd, this.dataInfo).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.routerLink('/sp/list', '', '')
                    } else {
                        if(res.data.errorMessage) {
                          this.errorMessage(res.data.errorMessage)
                        } else {
                          this.errorMessage('操作失败')
                        }
                    }
                }).catch( error => {
                    console.log(error)
                })
            }
        },
        created(){   
            this.$store.dispatch("setCollapse", true)
        },
        mounted (){
            let id = this.$route.query.id
            this.pageType = this.$route.query.type
            if(this.pageType == 'update') {
                this.dataInfo.name = this.$route.query.name
                this.dataInfo.icon = this.$route.query.icon
                this.dataInfo.id = this.$route.query.id
                this.dataInfo.spDesc = this.$route.query.spDesc
                this.dataInfo.spLiveNotice = this.$route.query.spLiveNotice
                this.showImage = false
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            }
        }
    }
</script>
<style>
   
</style> 
