<template>
    <section class="cms-body flex tree-bottom">
            <div style="width: 100%;">
            
                <el-form  ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px">

                    <el-form-item label="上级" class="flex-100"  prop="path">
                        <el-input v-model="info.path" class="cms-width" disabled></el-input>
                    </el-form-item> 

                    <el-form-item label="名称" class="flex-100"  prop="name">
                        <el-input v-model="info.name" class="cms-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="行数" class="flex-50" prop="rowNum">
                        <el-input class="cms-width" type="number" @blur="checkRows" v-model="info.rowNum"></el-input>
                    </el-form-item>

                    <el-form-item label="排序" class="flex-50" prop="priority">
                        <el-input class="cms-width" type="number" @blur="checkPriority" v-model="info.priority"></el-input>
                    </el-form-item>

                    <el-form-item label="类型" class="flex-50" prop="blockType">
                        <el-select v-model="info.blockType" placeholder="请选择" @change="getType">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> 

                    <el-form-item label="角标" class="flex-50" prop="blockIcon">
                        <uploader @change="getUrl" v-if="showImage" :default="info.blockIcon"></uploader>
                        <!-- <span class="red">请选择上传角标图片或者直接输入图片路径</span>
                        <el-input class="cms-width" type="text" v-model="info.blockIcon" @blur="showPicture"></el-input> -->
                    </el-form-item> 

                        
                    <!-- 动态表单 -->
                    <div class="form-footer">
                        <el-button  type="primary" @click="add()"
                        >提交</el-button>
                        <el-button type="info" @click="reset">重置</el-button>
                    </div>

                </el-form>

                
            </div>
        </section>
</template>

<script>
import listMixins from "@/mixins/list";
import {axiosProxy,getPageTreeParams} from "@/api/tool"
import va from "@/rules";
export default {
    mixins: [listMixins],
    data(){
        let required = va.required();
        let number = va.number();
        let string = va.string();
        return{
            params:this.$route.query,//前页传过来的数据
            info:{},
            rules:{
                id:[required],
                name:[required],
                path:[required],
                type:[required],
                showName:[required],
                blockType:[required]
            },//校验规则
            listType:'',//当前页面类型
            pageId:'',//新建区块需要的父id
            options: [{
              value: 1,
              label: 'Banner'
            }, {
              value: 2,
              label: '横图大图'
            }, {
              value: 3,
              label: '竖图大图'
            }, {
              value: 4,
              label: '横图普通'
            }, {
              value: 5,
              label: '竖图普通'
            }, {
              value: 6,
              label: '横图横滑'
            }, {
              value: 7,
              label: '竖图横滑'
            }, {
              value: 8,
              label: '多大图'
            }],
            value: '',
            showImage: true
        }
    },
    created(){
        this.loading=false


        this.pageId = this.$store.state.pageId
        

        let lastPath=localStorage.getItem('bid')
        lastPath=lastPath.split(',')[0]
        this.info.path=lastPath

    },
    mounted() {
        let clientHeight = document.body.clientHeight;
        $(".cms-body").css("minHeight", clientHeight - 110 + "px");
        this.$set(this.info, 'rowNum', 1)
        this.$set(this.info, 'priority', 1)
    },
    methods:{
        checkRows (e) {
            if(e.target.value > 0 && e.target.value <= 10) {
                
            } else {
                this.$alert('行数不能为空且最大不超过10', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                       this.info.rowNum = 1  
                    }
                })
            }
        },
        checkPriority (e) {
            if(e.target.value > 0) {

            } else {
                this.$alert('排序需要正整数哦', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.info.priority = 1
                    }
                })
            }
        },
        showPicture () {
            this.showImage = false
            setTimeout (() => {
                this.showImage = true
            },100)
        },
        getType (value) {
            this.$set(this.info, 'blockType', value)
        },

        getUrl (imageUrl, index, imagePath, storageId) {
            this.$set(this.info, 'blockIcon', imageUrl)
        },
        // 回退到上一级
        back(){
          this.routerLink('/block/list','list')
        }, 

        reset () {
            this.info.name = ''
            this.info.showName = ''
            this.info.rowNum = 1
            this.info.priority = 1
            this.info.blockIcon = null
            this.showImage = false
            this.info.blockType = null
            setTimeout(() => {
                this.showImage = true
            }, 100)
        },

        add(){
            let element={}
            if(this.info.name != '' && this.info.name != null) {
                element.name = this.info.name
            } else {
                this.errorMessage('请补全名称')
                return false
            }

            if(this.info.blockType != '' && this.info.blockType != null) {
                element.blockType = this.info.blockType
            } else {
                this.errorMessage('请补全区块类型')
                return false
            }

            element.pageId=parseInt(this.pageId)
            element.blockIcon = this.info.blockIcon
            element.rowNum = this.info.rowNum
            element.priority = parseInt(this.info.priority)
            let url=this.$api.blockAdd

            axiosProxy.post(url,element)
            .then(res=>{
                if(res.data.errorCode==0){
                    this.successMessage("新建成功")
                    this.$set(this.$store.state, 'showTree', false)
                    setTimeout (() => {
                        this.$set(this.$store.state, 'showTree', true)
                        this.routerLink('/block/list', '', this.$store.state.pageId)
                    }, 1000)
                }else{
                    if(res.data.errorMessage) {
                        this.errorMessage(res.data.errorMessage)
                    } else {
                        this.errorMessage('新建失败')
                    }
                }
            })
        }
    }
}
</script>

<style>

</style>
