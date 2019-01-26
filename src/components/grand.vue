<template>
	<section class="cms-body flex">
		<!-- 页面树组件 -->
		<div class="tree-container" v-if="$store.state.showTree">
			<cms-pagetree @click="treeClick" treeType="page" :hasContent='false' :highlight-current='true'></cms-pagetree>
		</div>
	    <div class="cms-content-right">
	    	<div class="cms-list-header clearfix flex">
            <!-- 右边内容的上方盒子 -->
                <div class="bread-box cms-left" v-if="breadState">
                    <label class="">当前目录:</label> 
                    <ul class="type-bread">
                        <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
                        <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
                        </li>
                    </ul>
                </div>

                <div class="cms-left channel-group" v-if="$store.state.enableButton">
                <!-- 两个按钮的区域 -->
                    <el-button type="primary" @click="catalogAdd" v-if="listType == 'ROOT' || listType == 'DIR'">新建目录</el-button>
                    <el-button type="success" @click="pageAdd" v-if="listType == 'DIR'">新建页面</el-button>
                    <el-button type="warning" @click="blockAdd" v-if="listType == 'PAGE'">新建区块</el-button>
                </div>

            </div>

	    	<son v-if="showList"></son>
	    </div>
	</section>
</template>

<script>
	import listMixins from "@/mixins/list"
	import {axiosProxy,getPageTreeParams} from "@/api/tool"
	import va from "@/rules"
	export default {
	    mixins: [listMixins],
	    data(){
	    	return{
	    		parentChannels: '',
	    		breadState:false,//默认当前目录不显示
	            breadItems: [
	                {
	                    name: "根目录",
	                    id: ""
	                },
	            ], //面包屑,用来存储并显示当前目录的数组
	            listType:'ROOT',//当前页面类型,决定是否可以新建目录和栏目
	            showList: true
		    }
	    },
	    methods:{
	    	//新建类型的判断,若当前为页面,则不能在其下面新建目录.
	        addType(data){
	            if(!data) {
	                this.listType = 'ROOT'
	            } else {
	               if(data.id == -1) {
	                this.listType = 'ROOT'
	                } else {
	                    if(data.type) {
	                        this.listType = data.type
	                    } else {
	                        this.listType = 'BLOCK'
	                    }
	                }
	            }
	            this.$set(this.$store.state, 'listType', this.listType)
	        },
	        // 获取当前目录的函数
	        creatBread(node, arr) {
	            if (node.parent != null) {
	                let params = {
	                name: node.data.name,
	                id: node.data.rid
	                };
	            arr.push(params);
	            this.creatBread(node.parent, arr);
	            } else {
	                this.breadItems = arr.reverse();

	                var breadStr ='';
	                let pid='';
	                for (let i = 0; i < this.breadItems.length - 1; i++) {
	                    breadStr=breadStr+this.breadItems[i].name+'/'; //属性
	                    pid=this.breadItems[i].id
	                }
	                
	                localStorage.setItem('treeBread', JSON.stringify(this.breadItems))
	                localStorage.setItem('bid',[breadStr,pid]);//将list页面保存到的,名字目录和id,存起来,到edit页面用
	                return false;
	            }
	        },
	        treeLink (url) {
	        	this.showList = false
                this.routerLink(url)
                setTimeout(() => {
                	this.showList = true
                }, 100)
	        },
		    //页面树点击事件
	        treeClick(data, node){
	            this.addType(data)
	            this.$store.state.enableButton = true

	            if(node.isLeaf){
	            	if(node.data.id == -1) {
	            		this.breadState=true;
	            		this.breadItems = [{
		                    name: "根目录",
		                    id: ""
		                }]
	            		let redirectUrl = '/page/list?real_id=' + 0
		                this.treeLink(redirectUrl)
	            	} else {
	            		//若为区块,跳转到区块编辑页面
		                if(this.listType == 'BLOCK') {
		                    this.creatBread(node, [])
		                    let redirectUrl = '/page/edit?real_id=' + node.data.rid + '&pageType=' + this.listType + '&parent=' + node.parent.data.rid + '&parentId=' + node.parent.data.rid 
		                    this.treeLink(redirectUrl)
		                } else {
		                	this.creatBread(node, []);
		                    let params=getPageTreeParams(node);//拼接好的参数
		                    let redirectUrl = '/page/list?real_id=' + params
		                    this.treeLink(redirectUrl)
		                    window.localStorage.setItem('parent', data.rid)
		                }
	            	}
	            }else if(data.id==-1){//点击根目录,不动
	                this.breadState=true;//在新建按钮旁边,显示当前目录的路径
	                this.creatBread(node, []);
	                let params=0;//拼接好的参数
	                let redirectUrl = '/page/list?real_id=' + params
	                this.treeLink(redirectUrl)
	                window.localStorage.setItem('parent', data.id)
	            }else{
	                window.localStorage.setItem('parent', data.rid) 
	                this.breadState=true;//在新建按钮旁边,显示当前目录的路径
	                this.creatBread(node, []);//获得当前目录

	                let params=getPageTreeParams(node);//拼接好的参数
	                let redirectUrl
	                if(this.listType == 'PAGE') {
	                	redirectUrl = '/page/list?real_id=' + data.rid + '&pageType=' + this.listType
	                } else {
	                	redirectUrl = '/page/list?real_id=' + params
	                }
	                this.treeLink(redirectUrl)
	            }
	        },
	        //下面两个为新建目录/页面函数
	        catalogAdd(){
	        	let parentId = window.localStorage.getItem('parent')
	            this.routerLink('/page/pageadd?parent=' + parentId + '&pageType=' + 'DIR' + '&parentId=' + parentId)
	        },
	        pageAdd(){
	        	let parentId = window.localStorage.getItem('parent')
	            this.routerLink('/page/pageadd?parent=' + parentId + '&pageType=' + 'PAGE' + '&parentId=' + parentId)
	        },
	        blockAdd () {
	        	let parentId = window.localStorage.getItem('parent')
	            this.routerLink('/page/blockadd?parent=' + parentId + '&pageType=' + 'BLOCK' + '&parentId=' + parentId)
	        }
	    },
	    created(){
	        this.$store.dispatch("setCollapse", true)
		    this.$set(this.$store.state, 'showTree', true)
		    this.$set(this.$store.state, 'listType', this.listType)
		    this.$set(this.$store.state, 'enableButton', true)
	    },
	    mounted(){
	        let clientHeight=document.body.clientHeight
	        $('.cms-body').css('minHeight',(clientHeight-110)+'px')
	    }
	}
</script>