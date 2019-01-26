<template>
	<section class="cms-body">
		编辑目击者视频信息
	</section>
</template>

<script>
	import axios from "axios"
    import {axiosProxy} from "@/api/tool"

    export default {
        data() {
            return {
                
            }
        },
        methods: {
            
        },
        created() {
            this.$store.dispatch("setCollapse", true); //收缩状态栏
        },
        mounted() {
            console.log('查询来的信息')
            console.log(this.$route.query)
        }
    }
</script>

<style lang="scss">
    
</style>