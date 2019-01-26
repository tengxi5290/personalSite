<template>
	<section class="cms-body">
		<div class="cms-list-header flex-between">
			<router-link to="/sync/channel/add">
				<el-button type="primary"  icon="el-icon-plus">添加同步栏目</el-button>
			</router-link> 
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="getSyncModify">
        	<el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="channelId" label="栏目ID" align="center"></el-table-column>
            <el-table-column prop="channelName" label="栏目名称"  align="center"></el-table-column> 
            <el-table-column prop="syncChannel" label="同步字段" align="center">
            	<div slot-scope="scope">
            		<el-input v-model="scope.row.syncChannel" class="w80"></el-input>
            	</div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
        	<el-button type="primary" @click="saveSyncName" v-if="pickedData.length > 0">保存同步字段</el-button>
        	<el-button type="primary" disabled v-else>保存同步字段</el-button>
        </div> 
	</section>
</template>

<script>
    import listMixins from "@/mixins/list";
    import axios from "axios";
    import {axiosProxy,checkErrorCode} from "@/api/tool"
    export default {
	    mixins: [listMixins],
	    data() {
	        return {
	        	tableData: [],
	        	pickedData: []
	        }
	    },
	    methods: {
	    	// 获取同步栏目列表
	    	getTableList () {
	    		axiosProxy.get(this.$api.syncChannelList).then( res => {
	    			if(res.data.errorCode == '0') {
	    				this.tableData = res.data.data
	    			} else {
	    				if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('请求失败')
                        }
	    			}
	    		}).catch ( error => {
	    			console.log(error)
	    		})
	    	},
	    	// 保存修改后的同步字段
	    	saveSyncName () {
	    		let ids = [], channels = []
	    		for (let i in this.pickedData) {
	    			ids.push(this.pickedData[i].id)
	    			channels.push(this.pickedData[i].syncChannel)
	    		}
	    		axiosProxy.put(this.$api.syncChannelUpdate + '?syncChannelIds=' + ids.join(',') + '&syncChannels=' + channels.join(',')).then (res => {
	    			if(res.data.errorCode == '0') {
	    				this.successMessage('操作成功')
	    				setTimeout (() => {
	    					this.getTableList()
	    				}, 1000)
	    			} else {
	    				if(res.data.errorMessage) {
                          	this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('操作失败')
                        }
	    			}
	    		}).catch (error => {
	    			console.log(error)
	    		})
	    	},
	    	// 获取需要保存的同步字段信息
	    	getSyncModify (value) {
	    		this.pickedData = value
	    	}
	    },
	  	created() {
	    	this.getTableList()
	    	this.$store.dispatch("setCollapse", true); //收缩状态栏
	  	}
	}
</script>