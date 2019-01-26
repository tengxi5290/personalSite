import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
    data() {
        return {
            loading: true, //遮罩层
            disabled: true, //禁用状态
            ids: "", //多选id
            status: "", //审核状态
            tableData: [], //表格数据
            total: 0, //列表总数
            listUrl: '',//列表地址,
            params: {},
            checkedList: [],//选中的对象
            state: false,
        }
    },
    methods: {
        initTableData(url, params) {
            this.params = params;
            this.listUrl = url;
            this.test(params)
        },
        test (params) {
            this.loading = true;
            this.state = false;
            axiosProxy
                .get(this.listUrl, params)
                .then(res => {
                    this.loading = false;
                    if (res.data.errorCode == '0') {
                        this.tableData = res.data.data;
                        this.state = true;
                    } else {
                        this.tableData = [];
                        this.state = true;
                    }


                })
                .catch(error => {
                    this.loading = false;
                    this.state = false;
                });
        },
        getTableData(params) {//获取表格数据  
            this.loading = true;
            this.state = false;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    this.loading = false;
                    if (res.data.errorCode == '0') {
                        if (res.totalCount != undefined) {
                            this.total = res.totalCount;
                        }
                        this.tableData = res.body;
                        this.state = true;

                    } else {
                        this.tableData = [];
                        this.state = true;
                    }


                })
                .catch(error => {
                    this.loading = false;
                    this.state = false;
                });
        },
        getPages(pageNo, pageSize) {
            //获取翻页数据
            this.params.pageNo = pageNo;
            this.params.pageSize = pageSize;
            this.getTableData(this.params);
        },
        query() { //条件查询
            this.getTableData(this.params);
        },
        checkIds(val) {

            let ids = [];
            for (let i in val) {
                ids.push(val[i].id);
            }
            this.ids = ids.join(",");
            this.disabled = val.length > 0 ? false : true;
            this.checkedList = val;
        },
        checkBlockIds(val){
            let ids = [];
            for (let i in val) {
                ids.push(val[i].real_id);
            }
            this.ids = ids.join(",");
            this.disabled = val.length > 0 ? false : true;
            this.checkedList = val;
        },
        //获取选中id和状态status
        checkIdsAndStatus(val) {

            let ids = [];
            let status = [];
            for (let i in val) {
                ids.push(val[i].id);
                status.push(val[i].status);
            }
            this.ids = ids.join(",");
            this.status = status.join(",");
            this.disabled = val.length > 0 ? false : true;
            this.checkedList = val;
        },
        deleteBatch(url, ids) { //删除
            this.$confirm('是否确定删除？', '警告', { type: "error" })
                .then(mes => {
                    axiosProxy.delete(url + '/' + ids).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('删除成功')
                            this.initTableData(this.$api.modelList,null)
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('删除失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        deleteBlockBatch(url, ids) { //删除
            this.$confirm('是否确定删除？', '警告', { type: "error" })
                .then(mes => {
                    axiosProxy.delete(url + '/' + ids).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('删除成功');
                            setTimeout("location.reload()",2000)
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('删除失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        removeBatch(url, roleId, ids) { //移除
            this.$confirm('确定移除吗？', '提示', { type: "error" })
                .then(mes => {
                    this.$http.post(url, { roleId: roleId, userIds: ids }).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('移除成功');
                            this.getTableData(this.params);
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('移除失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        priorityBatch(url, ids, priorities, regDefId) { //保存排列循序
            this.$confirm('是否保存修改', '提示', { type: "warning" })
                .then(mes => {
                    this.$http.post(url, { ids: ids, priorities: priorities, regDefId: regDefId }).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('操作成功');
                            this.getTableData(this.params);
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('操作失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        prioritysBatchs(url, ids, priorities, disableds, regDefId) { //保存排列循序四个参数
            this.$confirm('是否保存修改？', '提示', { type: "warning" })
            .then(mes => {
                axiosProxy.put(url + '?ids=' + arguments[1] + '&priorities=' + arguments[2] + '&enables=' + arguments[3]).then(res => {
                    if (res.data.errorCode == "0") {
                        this.successMessage('操作成功');
                        this.initTableData(this.$api.modelList,{});
                    } else {
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
                        this.initTableData(this.$api.modelList,{});
                    }
                });
            })
            .catch(error => { })
        },
        prioritysBatch(url, ids, priorities) { //保存排列
            this.$confirm('是否保存修改？', '提示', { type: "warning" })
                .then(mes => {
                    this.$http.post(url, { ids: ids, priorities: priorities }).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('保存成功');
                            this.getTableData(this.params);
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('保存失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        revertBatch(url, ids) { //批量还原
            this.$confirm('是否确定还原？', '提示', { type: "warning" })
                .then(mes => {
                    this.$http.post(url, { ids: ids }).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('还原成功');
                            this.getTableData(this.params);
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('还原失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
        reviewBatch(url, ids) {//批量审核
            this.$confirm('是否批量审核', '提示', { type: "warning" })
                .then(mes => {
                    this.$http.post(url, { ids: ids }).then(res => {
                        if (res.data.errorCode == "0") {
                            this.successMessage('审核成功!');
                            setTimeout(() => {
                                this.getTableData(this.params);
                            }, 800);
                        } else {
                            if(res.data.errorMessage) {
                                this.errorMessage(res.data.errorMessage)
                            } else {
                                this.errorMessage('审核失败')
                            }
                        }
                    });
                })
                .catch(error => { });
        },
    }
}