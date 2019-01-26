<template>

    <section class="cms-body flex">
		
		<el-card class="box-card editor-card">
			

			<div slot="header" class="clearfix">

				<a class="cms-back" href="javascript:void(0)" @click="back"></a>
				
				<span>文件名称: {{name}}</span>
				<br>
				<br>
				<span>文件地址: {{url}}</span>
				
			</div>
			<div class="code-text code-item">
				<codemirror ref="textArea" v-model="code" :options="cmOptions"></codemirror>
			</div>


			<el-button style="float: left; margin-left:20px;margin-top:6px;margin-botton:6px;" type="success" 
			ref="clickButton"
			@click='submitCode'
			>提交代码</el-button>
		</el-card>
		

    </section>
</template>



<script>

import {axiosProxy,getPageTreeParams,axiosProxyFiles} from "@/api/tool"
require("codemirror/mode/javascript/javascript.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/htmlmixed/htmlmixed.js")

export default {

    data(){
        return {
			params:this.$route.query,//前一页面传过来的参数
			code: '',//页面提取到的代码
        	cmOptions: {
		        // codemirror options
				tabSize: 4,
				mode:{
					name:'javascript',
					json:true,
				},
		        theme: 'base16-dark',
		        lineNumbers: true,
				line: true,
			},
			url:"",//这是目标url
			name:'',//文件名称
        }
    },
    methods:{
		back(){
			this.routerLink('/resource/list');
		},//跳转到上一页面
		getRes(){
			let api=this.$api.resourceGetText;
			axiosProxy.get(api+'?url='+this.url)
				.then(res=>{

					if(res.data.errorCode==0){
                        this.code=res.data.data;
                    }else{
                        if(res.data.errorMessage) {
                            this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('获取代码失败')
                        }
                    }
				})
				.catch(err=>{console.log(err)})
		},//获取到代码

		submitCode(){
			let eleTextarea = this.$refs.textArea;
			let eleButton = this.$refs.clickButton;
			let id=this.params.info.id
			this.funDownload(eleTextarea.value, id);    
		},//提交代码的点击事件

		funDownload(content, resourceId){
			let url=this.$api.resourceUploadChange;
			let jsonObj={"fileString":""};
			jsonObj.fileString=content
			
			axiosProxy.post(url+"/"+resourceId,jsonObj)
				.then(res=>{
					if(res.data.errorCode==0){
						this.successMessage("更新成功!")
                    }else{
                        if(res.data.errorMessage) {
							this.errorMessage(res.data.errorMessage)
                        } else {
                            this.errorMessage('更新失败')
                        }
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
		}
    },
    created(){
		this.name=this.params.info.name;
		this.url=this.params.info.httpUrl;
		this.getRes();
		this.$store.dispatch("setCollapse", true); //收缩状态栏
    },
}
</script>

<style>
	.code-text {
		font-size: 14px;
	}

	.code-item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}
	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 100%;
	}


.cm-s-base16-dark.CodeMirror { background: #151515; color: #e0e0e0; }
.cm-s-base16-dark div.CodeMirror-selected { background: #303030; }
.cm-s-base16-dark .CodeMirror-line::selection, .cm-s-base16-dark .CodeMirror-line > span::selection, .cm-s-base16-dark .CodeMirror-line > span > span::selection { background: rgba(48, 48, 48, .99); }
.cm-s-base16-dark .CodeMirror-line::-moz-selection, .cm-s-base16-dark .CodeMirror-line > span::-moz-selection, .cm-s-base16-dark .CodeMirror-line > span > span::-moz-selection { background: rgba(48, 48, 48, .99); }
.cm-s-base16-dark .CodeMirror-gutters { background: #151515; border-right: 0px; }
.cm-s-base16-dark .CodeMirror-guttermarker { color: #ac4142; }
.cm-s-base16-dark .CodeMirror-guttermarker-subtle { color: #505050; }
.cm-s-base16-dark .CodeMirror-linenumber { color: #505050; }
.cm-s-base16-dark .CodeMirror-cursor { border-left: 1px solid #b0b0b0; }

.cm-s-base16-dark span.cm-comment { color: #8f5536; }
.cm-s-base16-dark span.cm-atom { color: #aa759f; }
.cm-s-base16-dark span.cm-number { color: #aa759f; }

.cm-s-base16-dark span.cm-property, .cm-s-base16-dark span.cm-attribute { color: #90a959; }
.cm-s-base16-dark span.cm-keyword { color: #ac4142; }
.cm-s-base16-dark span.cm-string { color: #f4bf75; }

.cm-s-base16-dark span.cm-variable { color: #90a959; }
.cm-s-base16-dark span.cm-variable-2 { color: #6a9fb5; }
.cm-s-base16-dark span.cm-def { color: #d28445; }
.cm-s-base16-dark span.cm-bracket { color: #e0e0e0; }
.cm-s-base16-dark span.cm-tag { color: #ac4142; }
.cm-s-base16-dark span.cm-link { color: #aa759f; }
.cm-s-base16-dark span.cm-error { background: #ac4142; color: #b0b0b0; }

.cm-s-base16-dark .CodeMirror-activeline-background { background: #202020; }
.cm-s-base16-dark .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }
</style>