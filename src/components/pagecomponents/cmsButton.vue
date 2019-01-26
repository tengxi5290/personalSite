<template>
       <a href="javascript:void(0)" 
       class="cms-table-button iconfont" 
       :class="type"
       :title="title" 
       @click="clickButton"
       > 
       </a>
    
</template>

<script>
export default {
    name:'cms-button',
    props: {
        type:{
            type:String,
            default:'edit'
        },
    },
    data(){
        return{}   
    },
    computed:{
        title(){
            let titie="";
                if(this.type=='edit'){
                     titie='修改'; 
                }
                if(this.type=='delete'){
                     titie='删除'; 
                }
                if(this.type=='rename'){
                     titie='站点管理'; 
                }
                if(this.type=='view'){
                     titie='查看'; 
                }
                if(this.type=='user'){
                    titie='成员/角色管理'
                }
                if(this.type=='down'){
                    titie='下载'
                }
                if(this.type=='online'){
                    titie='上线'
                }
                if(this.type=='offline'){
                    titie='下线'
                }
                if(this.type=='show'){
                    titie='显示'
                } 
                if(this.type=='hide'){
                    titie='隐藏'
                }

                if(this.type=='top'){
                    titie='置顶'
                }
                if(this.type=='bottom'){
                    titie='置底'
                }
                if(this.type=='prev'){
                    titie='上移'
                } 
                if(this.type=='next'){
                    titie='下移'
                }
                if(this.type=='thriller'){
                    titie='关联片花'
                }
                if(this.type=='shop'){
                    titie='关联电商'
                }
                if(this.type=='introduce'){
                    titie='同步至视讯中国'
                }
            return titie;
        }
    },
    methods:{
        clickButton () {
            this.$emit('click')
        }
    }
}
</script>

<style scoped lang="scss">
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
        &.delete{
             background: #ff8b53;
            &::after{
                content: "\e604";
                position: relative;
                top:4px;
                font-size:12px; 
            }        
        }  
        &.rename{
             background: #d573ea;
            &::after{
                content: "\e670";
                position: relative;
                top:4px;
                font-size:12px; 
            }        
         
        }
        &.online{
             background: #f32277;
            &::after{
                content: "\e60d";
                position: relative;
                top:4px;
                font-size:12px; 
            }        
         
        }
        &.offline{
             background: #eacb29;
            &::after{
                content: "\e609";
                position: relative;
                top:4px;
                font-size:12px; 
            }        
         
        }
        &.show{
            background: #001fff;
            &::after{
                content: "\e603";
                position: relative;
                top: 4px;
                font-size: 12px;
            }
        }
        &.hide{
            background: #8c2708;
            &::after{
                content: "\e7af";
                position: relative;
                top: 4px;
                font-size: 12px;
            }
        }
        &.view{
             background: #50c3e4;
            &::after{
                content: "\e797";
                position: relative;
                top:4px;
                font-size:12px; 
            }        
        }
        &.user{
            background: #ffae38;
             &::after{
                content: "\e659";
                position: relative;
                top:4px;
                font-size:14px; 
            }    
        }
        &.down{
            background: #409EFF;
             &::after{
                content: "\eb8e";
                position: relative;
                top:4px;
                font-size:14px; 
            }  
        }
        &.top{
            background-color: rgb(211, 212, 212);
            &::after{
                content: "\e7dc";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.bottom {
            background-color: rgb(144, 14, 210);
            &::after{
                content: "\eb8e";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.prev{
            background-color: rgb(239, 150, 158);
            &::after{
                content: "\e60d";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.next{
            background-color: #e9ea5c;
            &::after{
                content: "\e609";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.thriller{
            background-color: #7351f7;
            &::after{
                content: "\e670";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.shop{
            background-color: #f30bb4;
            &::after{
                content: "\e60e";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
        &.introduce{
            background-color: #e6a23c;
            &::after{
                content: "\e62b";
                position: relative;
                top: 4px;
                font-size: 14px;
            }
        }
    }
</style>
