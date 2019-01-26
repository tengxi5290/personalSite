<template>
    <div>
        <div class="show-info" v-if="showCropper">
            <h2>example1 基本例子 无限制</h2>
            <div class="test test1">
                <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :fixedBox="option.fixedBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :centerBox="option.centerBox"
                    :high="option.high"
                    :infoTrue="option.infoTrue"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                    @cropMoving="cropMoving"
                    :enlarge="option.enlarge"
                ></vueCropper>
            </div>
            <div class="test-button">
                <label class="btn" for="uploads">upload</label>
                <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
                <button @click="clearCrop" class="btn">clear</button>
                <button @click="refreshCrop" class="btn">refresh</button>
                <button @click="changeScale(1)" class="btn">+</button>
                <button @click="changeScale(-1)" class="btn">-</button>
                <button @click="rotateLeft" class="btn">rotateLeft</button>
                <button @click="rotateRight" class="btn">rotateRight</button>
                <button @click="finish('base64')" class="btn">preview(base64)</button>
                <button @click="finish('blob')" class="btn">preview(blob)</button>
                <a @click="down('base64')" class="btn">download(base64)</a>
                <a @click="down('blob')" class="btn">download(blob)</a>
                <a :href="downImg" download="demo.png" ref="downloadDom"></a>
            </div>
            
            <div class="pre">
                <p>截图框大小</p>
                <div class="show-preview" :style="previewStyle1">
                    <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>
                
                <p>中等大小</p>
                <div :style="previewStyle2" class="show-item"> 
                    <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>

                <p>迷你大小</p>
                <div :style="previewStyle3" class="show-picture"> 
                    <div :style="previews.div">
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import {VueCropper} from "vue-cropper"
    import {axiosProxy,axiosProxyFiles} from "@/api/tool"
    export default {
        props:{
          
        },

        data() {
            return {
                showCropper: true,
                previewStyle1: 'large',
                previewStyle2: 'middles',
                previewStyle3: 'small',
                previews: {
                    
                },
                option: {
                    img: null,
                    size: 1,
                    full: true,
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 200,
                    fixedBox: false,
 
                    downImg: '#'
                }    
            }
        },

        methods: {
            changeScale (num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft () {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight () {
                this.$refs.cropper.rotateRight()
            },
            finish (type) {  // 输出
                var test = window.open('about:blank')
                test.document.body.innerHTML = '图片生成中..'
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob((data) => {
                        var img = window.URL.createObjectURL(data)
                        this.model = true
                        this.modelSrc = img
                    })
                } else {
                    this.$refs.cropper.getCropData((data) => {
                        this.model = true
                        this.modelSrc = data
                    })
                }
            },
            realTime (data) {  // 实时预览函数
                this.previews = data
            },
            downImg (type) {
                // event.preventDefault()
                var aLink = document.createElement('a')
                aLink.download = 'author-img' // 输出
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob((data) => {
                        console.log(data)
                        this.downImg = window.URL.createObjectURL(data)
                        // aLink.download = this.downImg;
                        console.log(this.downImg)
                        aLink.href = window.URL.createObjectURL(data)
                        aLink.click()
                    })
                } else {
                    this.$refs.cropper.getCropData((data) => {
                        this.downImg = data
                        aLink.href = data
                        aLink.click()
                    })
                }
            },
            uploadImg (e, num) { //上传图片
                this.option.img
                var file = e.target.files[0]
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    return false
                };
                var reader = new FileReader()
                reader.onload = (e) => {
                    let data
                    if (typeof e.target.result === 'object') { // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    if (num === 1) {
                        this.option.img = data
                    } else if (num === 2) {
                        this.example2.img = data
                    }
                } // 转化为base64
                reader.readAsDataURL(file) // 转化为blob reader.readAsArrayBuffer(file)
            }, 
            imgLoad (msg) {
                console.log(msg)
            },
            cropMoving (data) {
                console.log(data)
            },
            clearCrop (data) {
                console.log(data)
                this.$refs.cropper.clearCrop()
            },
            refreshCrop (data) {
                console.log(data)
                this.showCropper = false
                setTimeout (() => {
                    this.showCropper = true
                }, 100)
            }
        },

        mounted () {
            
        }
    };
</script>

<style lang='scss' scoped>
    *{margin:0;padding:0}.content{margin:auto;max-width:1200px;margin-bottom:100px}.test-button{display:flex;flex-wrap:wrap}.btn{display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#fff;border:1px solid #c0ccda;color:#1f2d3d;text-align:center;box-sizing:border-box;outline:none;margin:20px 10px 0 0;padding:9px 15px;font-size:14px;border-radius:4px;color:#fff;background-color:#50bfff;border-color:#50bfff;transition:all .2s ease;text-decoration:none;user-select:none}.des{line-height:30px}code.language-html{padding:10px 20px;margin:10px 0;display:block;background-color:#333;color:#fff;overflow-x:auto;font-family:Consolas,Monaco,Droid,Sans,Mono,Source,Code,Pro,Menlo,Lucida,Type,Writer,Ubuntu;border-radius:5px;white-space:pre}.show-info{margin-bottom:50px}.show-info h2{line-height:50px}.title{display:block;text-decoration:none;text-align:center;line-height:1.5;margin:20px 0;background-image:-webkit-linear-gradient(left,#3498db,#f47920 10%,#d71345 20%,#f7acbc 30%,#ffd400 40%,#3498db 50%,#f47920 60%,#d71345 70%,#f7acbc 80%,#ffd400 90%,#3498db);color:transparent;-webkit-background-clip:text;background-size:200% 100%;animation:slide 5s infinite linear;font-size:40px}.test{height:500px}.model{position:fixed;z-index:10;overflow:auto;top:0;left:0;background:rgba(0,0,0,.8)}.model,.model-show{width:100vw;height:100vh}.model-show{display:flex;justify-content:center;align-items:center;text-align:center}.model img{margin:auto;max-width:80%;width:auto;background-position:0 0,10px 10px;background-size:20px 20px;background-image:linear-gradient(45deg,#eee 25%,transparent 0,transparent 75%,#eee 0,#eee),linear-gradient(45deg,#eee 25%,#fff 0,#fff 75%,#eee 0,#eee)}.c-item,.model img{display:block;user-select:none}.c-item{padding:10px 0}.pre{display:flex}.pre-item{padding-right:20px}@keyframes slide{0%{background-position:0 0}to{background-position:-100% 0}}@media screen and (max-width:1000px){.content{max-width:90%;margin:auto}.test{height:400px}}

    section code.language-html[data-v-7a4f1d74]{padding:10px 20px;margin:10px 0;display:block;background-color:#333;color:#fff;overflow-x:auto;font-family:Consolas,Monaco,Droid,Sans,Mono,Source,Code,Pro,Menlo,Lucida,Type,Writer,Ubuntu;border-radius:5px;white-space:pre}.preview[data-v-7a4f1d74]{position:relative;height:150px;overflow:hidden}.all[data-v-7a4f1d74]{position:relative}.show[data-v-7a4f1d74]{position:absolute;width:100%;text-align:center;left:0;bottom:0;line-height:50px;height:50px;cursor:pointer;background-color:hsla(0,0%,100%,.3);color:#fff}


    .vue-cropper[data-v-3e26d6fc]{position:relative;width:100%;height:100%;box-sizing:border-box;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;direction:ltr;touch-action:none;text-align:left;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC")}.cropper-box-canvas[data-v-3e26d6fc],.cropper-box[data-v-3e26d6fc],.cropper-crop-box[data-v-3e26d6fc],.cropper-drag-box[data-v-3e26d6fc],.cropper-face[data-v-3e26d6fc]{position:absolute;top:0;right:0;bottom:0;left:0;user-select:none}.cropper-box-canvas img[data-v-3e26d6fc]{position:relative;text-align:left;user-select:none;transform:none;max-width:none;max-height:none}.cropper-box[data-v-3e26d6fc]{overflow:hidden}.cropper-move[data-v-3e26d6fc]{cursor:move}.cropper-crop[data-v-3e26d6fc]{cursor:crosshair}.cropper-modal[data-v-3e26d6fc]{background:rgba(0,0,0,.5)}.cropper-view-box[data-v-3e26d6fc]{display:block;overflow:hidden;width:100%;height:100%;outline:1px solid #39f;outline-color:rgba(51,153,255,.75);user-select:none}.cropper-view-box img[data-v-3e26d6fc]{user-select:none;text-align:left;max-width:none;max-height:none}.cropper-face[data-v-3e26d6fc]{top:0;left:0;background-color:#fff;opacity:.1}.crop-info[data-v-3e26d6fc]{position:absolute;left:0;min-width:65px;text-align:center;color:#fff;line-height:20px;background-color:rgba(0,0,0,.8);font-size:12px}.crop-line[data-v-3e26d6fc]{position:absolute;display:block;width:100%;height:100%;opacity:.1}.line-w[data-v-3e26d6fc]{top:-3px;left:0;height:5px;cursor:n-resize}.line-a[data-v-3e26d6fc]{top:0;left:-3px;width:5px;cursor:w-resize}.line-s[data-v-3e26d6fc]{bottom:-3px;left:0;height:5px;cursor:s-resize}.line-d[data-v-3e26d6fc]{top:0;right:-3px;width:5px;cursor:e-resize}.crop-point[data-v-3e26d6fc]{position:absolute;width:8px;height:8px;opacity:.75;background-color:#39f;border-radius:100%}.point1[data-v-3e26d6fc]{top:-4px;left:-4px;cursor:nw-resize}.point2[data-v-3e26d6fc]{top:-5px;left:50%;margin-left:-3px;cursor:n-resize}.point3[data-v-3e26d6fc]{top:-4px;right:-4px;cursor:ne-resize}.point4[data-v-3e26d6fc]{top:50%;left:-4px;margin-top:-3px;cursor:w-resize}.point5[data-v-3e26d6fc]{top:50%;right:-4px;margin-top:-3px;cursor:e-resize}.point6[data-v-3e26d6fc]{bottom:-5px;left:-4px;cursor:sw-resize}.point7[data-v-3e26d6fc]{bottom:-5px;left:50%;margin-left:-3px;cursor:s-resize}.point8[data-v-3e26d6fc]{bottom:-5px;right:-4px;cursor:se-resize}@media screen and (max-width:500px){.crop-point[data-v-3e26d6fc]{position:absolute;width:20px;height:20px;opacity:.45;background-color:#39f;border-radius:100%}.point1[data-v-3e26d6fc]{top:-10px;left:-10px}.point2[data-v-3e26d6fc],.point4[data-v-3e26d6fc],.point5[data-v-3e26d6fc],.point7[data-v-3e26d6fc]{display:none}.point3[data-v-3e26d6fc]{top:-10px;right:-10px}.point4[data-v-3e26d6fc]{top:0;left:0}.point6[data-v-3e26d6fc]{bottom:-10px;left:-10px}.point8[data-v-3e26d6fc]{bottom:-10px;right:-10px}}
    
    .show-preview {
        overflow: hidden;
        margin: 5px;
        width: 200px;
        height: 150px;
    }
    .show-item {
        width: 200px;
        height: 150px;
        zoom: .5; 
        margin: 5px;
        overflow: hidden;
    }
    .show-picture {
        width: 200px;
        height: 150px;
        zoom: .2; 
        margin: 5px;
        overflow: hidden;
    }
    .large {
        width: 200px;
        height: 150px;
        overflow: hidden;
    }
    .middles {
        width: 200px;
        height: 150px;
        overflow: hidden;
    }
    .small {
        width: 200px;
        height: 150px;
        overflow: hidden;
    }
</style>
