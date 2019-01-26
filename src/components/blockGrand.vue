<template>
	<section class="cms-body flex">
		<!-- 页面树组件 -->
		<div class="tree-container" v-if="$store.state.showTree">
			<cms-pagetree @click="treeClick" treeType="page" :hasContent='false' :highlight-current='true'></cms-pagetree>
		</div>
	    <div class="cms-content-right">
	    	<div class="cms-list-header clearfix flex">
                <div class="bread-box cms-left">
                    <label class="">当前目录:</label>
                    <ul class="type-bread">
                        <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
                        <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
                        </li>
                    </ul>
                </div>

                <div class="cms-left channel-group" v-if="$store.state.listType == 'PAGE'">
                    <el-button type="warning" @click="blockAdd">新建区块</el-button>
                </div>

            </div>

	    	<blockSon v-if="showList"></blockSon>
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
	    		listType:'',
	    		showList: true,
	    		breadItems: [
	                {
	                    name: "根目录",
	                    id: ""
	                },
	            ],
		    }
	    },
	    methods:{
	    	//页面树点击事件
        	treeClick(data,node){
	            this.addType(data)
	            this.creatBread(node, []);

	            if(node.isLeaf){
	            	if(this.$store.state.listType == null) {
	            		if(node.data.rid == 200) {
	            			this.$set(this.$store.state, 'isPublish', true)
	            		} else {
	            			this.$set(this.$store.state, 'isPublish', false)
	            		}

	            		if(node.data.rid == 59) {
	            			this.$set(this.$store.state, 'isHot', true)
	            		} else {
	            			this.$set(this.$store.state, 'isHot', false)
	            		}

	            		this.showList = false
	                	this.routerLink('/block/edit', '', node.data.rid)
	                	setTimeout(() => {
		                	this.showList = true
		                }, 100)
	            	} else if (this.$store.state.listType == 'PAGE') {
	                	let goUrl = '/block/list'
	                	this.treeLink(goUrl, node.data.rid)
	                    this.$set(this.$store.state, 'pageId', node.data.rid)
	            	} else if (this.$store.state.listType == 'DIR') {
	            		let goUrl = '/block/list'
	                	this.treeLink(goUrl, node.data.rid)
	                    this.$set(this.$store.state, 'pageId', node.data.rid)
	            	}

	            }else if(data.id==-1){
	                let goUrl = '/block/list'
	                this.treeLink(goUrl, 0)
	                this.$set(this.$store.state, 'pageId', 0)
	            }else{
	                let goUrl = '/block/list'

	                this.treeLink(goUrl, node.data.rid)
	                this.$set(this.$store.state, 'pageId', node.data.rid)
	            }
	        },
	        treeLink (url, id, params) {
	        	this.showList = false
	        	if(this.$store.state.listType == 'PAGE') {
	        		this.routerLink(url, '', id)
	        	} else if(this.$store.state.listType == 'DIR') {
	        		this.routerLink(url, '', id)
	        	} 
                setTimeout(() => {
                	this.showList = true
                }, 100)
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
	                for (let i in this.breadItems) {
	                    breadStr=breadStr+this.breadItems[i].name+'/'
	                    pid=this.breadItems[i].id
	                }
	                
	                
	                localStorage.setItem('bid',[breadStr,pid])
	                localStorage.setItem('bread', JSON.stringify(this.breadItems))
	                return false;
	            }
	        },
	        //当前页面类型的判断,若为page,才可以新建区块.
	        addType(data){
	            if(data) {
	                if(data.id==-1){
	                    this.listType=''
	                }else if((typeof data)=="object"){
	                    let pid=data.rid;//保存父id
	                    this.listType=data.type;
	                }else if((typeof data)=="string"){
	                    let pid=data.split('?')[0]
	                    let arr=data.split("=");
	                    this.listType=arr[arr.length-1];
	                }
	            }
	            this.$set(this.$store.state, 'listType', this.listType)
	        },
	        //新建区块
	        blockAdd(){
	            this.routerLink('/block/add', '', this.pageId)
	        },
	    },
	    mounted(){
	    	this.$store.dispatch("setCollapse", true); //收缩状态栏
	        let clientHeight=document.body.clientHeight
	        $('.cms-body').css('minHeight',(clientHeight-110)+'px')
	        this.$set(this.$store.state, 'listType', 'ROOT')
	        this.$set(this.$store.state, 'showTree', true)
	    }
	}
</script>