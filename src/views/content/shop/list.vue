<template>
    <section class="cms-body">
        <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">
            <el-button type="success" @click="addShop">新增电商项</el-button>

            <cms-input label="标题" :width="240" @input="checkQueryTitle" v-model="queryShop.title"></cms-input>
            <el-button type="primary" v-if="titleQueryEnable" @click="searchByTitle">查询</el-button>
            <el-button type="primary" disabled v-else>查询</el-button>
            <el-switch v-model="queryShop.private" active-text="公有" inactive-text="私有" @change="searchByPrivate"></el-switch>
        </div>

        <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">
            <el-table :data="shopList" stripe style="width: 100%;" @selection-change="multiDelete">
                <el-table-column type="selection" width="65" align="center"></el-table-column>

                <el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>

                <el-table-column prop="title" label="标题" align="center" width="200"></el-table-column>

                <el-table-column prop="subTitle" label="副标题" align="center" width="200"></el-table-column>

                <el-table-column prop="thirdUrl" label="外链地址" align="center" width="300">
                    <div slot-scope="scope">
                        <span v-if="scope.row.type == 1">{{scope.row.thirdUrl}}</span>
                    </div>
                </el-table-column>

                <el-table-column prop="thirdId" label="内容id" align="center" width="160">
                    <div slot-scope="scope">
                        <span v-if="scope.row.type == 2">{{scope.row.thirdId}}</span>
                    </div>
                </el-table-column>

                <el-table-column prop="img" label="封面图" align="center" width="180">
                    <div slot-scope="scope">
                        <img :src="scope.row.img" height="100" width="auto" v-if="scope.row.img != null && scope.row.img != undefined" />
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
                    </div>
                </el-table-column>

                <el-table-column prop="private" label="权限" align="center" width="80">
                    <div slot-scope="scope">
                        <span v-if="scope.row.private == false">公有</span>
                        <span v-if="scope.row.private == true">私有</span>
                    </div>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>

                <el-table-column prop="updateTime" label="更新时间" align="center" width="200"></el-table-column>

                <el-table-column label="操作" align="center">
                    <div slot-scope="scope" v-if="scope.row.siteId !== 0">
                        <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>
                        <cms-button type="delete" @click="toDelete(scope.row)"></cms-button>
                    </div>
                </el-table-column>
            </el-table>

            <div class="cms-list-footer" style="padding-bottom:100px;">
                <el-button type="info" v-if="dataGroup.length > 0" @click="deleteGroup">批量删除</el-button>
                <el-button type="info" disabled v-else>批量删除</el-button>
                <cms-pagination :total="shopTotal" @change="getPages" :pageSize="queryShop.pageSize" :page="queryShop.page" :init="true"></cms-pagination>
            </div>
        </div>


        <el-dialog :title="fillTitle" :visible.sync="dialogFormVisible" @close="handleClose">
            <el-form :model="newShop">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="newShop.title"></el-input>
                </el-form-item>

                <el-form-item label="副标题" :label-width="formLabelWidth">
                    <el-input v-model="newShop.subTitle"></el-input>
                </el-form-item>

                <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-radio-group v-model="newShop.private">
                        <el-radio :label="false">公有</el-radio>
                        <el-radio :label="true">私有</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="newShop.type">
                        <el-radio :label="1">外链地址</el-radio>
                        <el-radio :label="2">内容id</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="外链地址" :label-width="formLabelWidth" v-if="newShop.type == '1'">
                    <el-input v-model="newShop.thirdUrl"></el-input>
                </el-form-item>

                <el-form-item label="内容id" :label-width="formLabelWidth" v-if="newShop.type == '2'">
                    <el-input type="number" v-model="newShop.thirdId"></el-input>
                </el-form-item>

                <el-form-item label="封面" :label-width="formLabelWidth">
                    <uploader @change="getUrl" v-if="showImage" :default="newShop.img"></uploader>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureAdd" v-if="currentMode == 'add'">确 定</el-button>
                <el-button type="warning" @click="sureUpdate" v-if="currentMode == 'update'">更 新</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import listMixins from "@/mixins/list"
    import axios from "axios"
    import {axiosProxy, checkErrorCode, isNull, timestampToTime} from "@/api/tool"
    export default {
        mixins: [listMixins],
        data() {
            return {
                queryShop: {
                    title: null,
                    page: 1,
                    pageSize: 10,
                    sid: null,
                    private: null
                }, // 查询参数对象
                titleQueryEnable: false, // 查询标题的按钮是否可用
                shopList: [], // 电商列表
                shopTotal: null, // 电商列表总量

                dialogFormVisible: false, // 新增电商项的蒙版是否可见
                newShop: {
                    id: null,
                    title: null,
                    subTitle: null,
                    img: null,
                    createTime: null,
                    updateTime: null,
                    siteId: null,
                    private: false,
                    thirdUrl: null,
                    type: 1,
                    thirdId: null
                }, // 新增电商项时的表单内容
                formLabelWidth: '120px', // 标签宽度
                showImage: true, // 图片上传组件是否可见
                currentMode: null, // 当前是编辑还是新增
                fillTitle: null, // 编辑或新增的表单蒙版标题

                dataGroup: [], // 批量删除的数据组
            }
        },
        methods: {
            // 获取已有电商列表
            getShopList(sid, page, pageSize, title) {
                let url = this.$api.shopList + '?sid=' + sid + '&page=' + page + '&pageSize=' + pageSize

                if(title !== '' && title !== undefined && title !== null) {
                    url = url + '&title=' + title
                }

                axiosProxy.get(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.shopList = res.data.data.list
                        this.shopTotal = res.data.data.total

                        for(let i in this.shopList) {
                            if(this.shopList[i].createTime !== null) {
                                this.shopList[i].createTime = timestampToTime(this.shopList[i].createTime)
                            }

                            if(this.shopList[i].updateTime !== null) {
                                this.shopList[i].updateTime = timestampToTime(this.shopList[i].updateTime)
                            }
                        }
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
            },

            // 查询的标题是否合法
            checkQueryTitle () {
                if(isNull(this.queryShop.title) || this.queryShop.title == null || this.queryShop.title == undefined) {
                    this.titleQueryEnable = false
                } else {
                    this.titleQueryEnable = true
                }
            },

            // 发起标题查询
            searchByTitle () {
                this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title)
            },

            // 发起公有私有查询
            searchByPrivate (value) {
                if(value == false) {
                    this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title)
                } else {
                    this.getShopList(0, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title)
                }
            },

            // 获取分页变化后的数据
            getPages (current, size) {
                this.queryShop.pageSize = size
                this.queryShop.page = current
                this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title)
            },

            // 添加新的电商项
            addShop () {
                this.currentMode = 'add'
                this.fillTitle = '新增电商项'
                this.dialogFormVisible = true
                this.resetForm()
            },

            // 上传图片之后的回调
            getUrl (imageUrl, index, imagePath, storageId) {
                this.newShop.img = imageUrl
            },

            // 确认新加电商项
            sureAdd () {
                this.postAdd(this.newShop, () => {
                    this.dialogFormVisible = false
                    this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, null)
                })
            },

            // 发送新增电商项网络请求
            postAdd (obj, callback) {
                let url = this.$api.shopAdd
                axiosProxy.post(url, obj).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        callback()
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
            },

            // 重置表单
            resetForm () {
                for (let i in this.newShop) {
                    this.newShop[i] = null
                }
                this.showImage = false
                this.newShop.type = 1
                this.newShop.siteId = this.queryShop.sid
                this.newShop.private = false
                setTimeout(() => {
                    this.showImage = true
                }, 100)
            },



            // 点击了编辑按钮
            toEdit (obj) {
                this.resetForm()
                this.newShop = obj
                this.dialogFormVisible = true
                this.currentMode = 'update'
                this.fillTitle = '编辑电商项'
            },

            // 确认提交编辑内容
            sureUpdate () {
                this.newShop.createTime = null
                this.newShop.updateTime = null
                this.postAdd(this.newShop, () => {
                    this.dialogFormVisible = false
                    this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, null)
                })
            },



            // 删除单个元素
            toDelete (tableData) {
                let ids = tableData.id

                this.$confirm('确定删除电商项?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(ids)
                }).catch( error => {
                    console.log(error)    
                })
            },

            // 删除接口
            postDelete (ids) {
                let url = this.$api.shopDelete + '?ids=' + ids
                axiosProxy.put(url).then( res => {
                    if(res.data.errorCode == 0) {
                        this.successMessage('操作成功')
                        this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, null)
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
            },

            // 获取多选数据组
            multiDelete (data) {
                this.dataGroup = data
            },

            // 批量删除按钮响应
            deleteGroup () {
                let idsGroup = []
                for (let i in this.dataGroup) {
                    idsGroup.push(this.dataGroup[i].id)
                }

                this.$confirm('确定删除电商项?', '警告', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                }).then(() => {
                    this.postDelete(idsGroup.join(','))
                }).catch( error => {
                    console.log(error)    
                })
            },

            // 关闭蒙版的响应
            handleClose () {
                this.resetForm()
                this.getShopList(this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, null)
            }
        },
        mounted() {
          let clientHeight = document.body.clientHeight
          $(".cms-body").css("minHeight", clientHeight - 110 + "px")
          this.$store.dispatch("setCollapse", true)
        },
        created() {
            let siteId = window.localStorage.getItem('_site_id_param')
            this.queryShop.sid = siteId
            this.newShop.siteId = siteId
            this.getShopList(siteId, this.queryShop.page, this.queryShop.pageSize, null)
        }
    }
</script>

<style lang="scss">
.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}
.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}
.tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}

.red-color {
  color: red;
}


.cms-table-button{
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height:1;
  border-radius: 4px;
  background: #000;
  color: #fff;
  position: relative;
  text-align: center;
  font-size: 14px;
  top:-2px;
  margin-left: 2px;
  transition: 0.2s;
  &:first-child{
    margin-left: 0px;
  }
  &:hover{
    opacity: 0.65;
  }
  &.edit{
    background: #17d57e;
    &::after{
      content: '\e662';
      position: relative;
      top:5px;
    }
  }
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-button-group .el-button--success:last-child {
  width: 50px;
  min-width: 50px;
}
.el-dialog {
  width: 80%;
  margin-top: 50px!important;
}
</style>
