import appMain from "@/components/appMain.vue";
import grand from "@/components/grand.vue";
import son from "@/components/son.vue";
import blockGrand from "@/components/blockGrand.vue";
import blockSon from "@/components/blockSon.vue";
import cmsInput from './pagecomponents/cmsInput.vue'//横向标签组件
import cmsButton from './pagecomponents/cmsButton.vue'//cms图标按钮组件
import cmsPagination from './pagecomponents/cmsPagination.vue'//cms分页
import cmsBack from './pagecomponents/cmsBack.vue'//cms返回
import cmsRole from './pagecomponents/cmsRole.vue'//cms角色
import cmsUpload from './pagecomponents/cmsUpload.vue'//cms上传
import cmsTree from './cmscomponents/cmsTree.vue'
import cmsChannelTree from './cmscomponents/cmsChannelTree.vue'
import uploader from './cmscomponents/uploader.vue'//站点树插件
import cropper from './cmscomponents/cropper.vue'
import cmsSiteTree from './cmscomponents/cmsSiteTree.vue'//站点树插件
import cmsEditor from './pagecomponents/cmsEditor.vue'
import cmsFileUpload from './pagecomponents/cmsFileUpload.vue'
import cmsAdvertise from '@/views/config/directive/cmsAdvertise.vue'
import cmsChannel from '@/views/config/directive/cmsChannel.vue'
import cmsComment from '@/views/config/directive/cmsComment.vue'
import cmsContent from '@/views/config/directive/cmsContent.vue'
import cmsAttachUpload from './pagecomponents/cmsAttachUpload.vue'
import cmsMultipleUpload from './pagecomponents/cmsMultipleUpload.vue'
import cmsPictrues from './pagecomponents/cmsPictrues.vue'
import cmsExportUpload from './pagecomponents/cmsExportUpload'
import cmsTopic from '@/views/config/directive/cmsTopic.vue'
import cmsTag from '@/views/config/directive/cmsTag.vue'
import cmsSiteDialog from './cmscomponents/cmsSiteDialog.vue'
import cmsPicture from './pagecomponents/cmsPicture.vue'

import cmsPageTree from './cmscomponents/cmsPageTree.vue' //引入了页面的树,pagetree
import cmsFileTree from './cmscomponents/cmsFileTree.vue' //引入了文件数,filetree

// 这里是重点
const cmsComponents = {
    install: function (Vue) {
        Vue.component('cmsInput', cmsInput);
        Vue.component('cmsButton', cmsButton);
        Vue.component('cmsPagination', cmsPagination);
        Vue.component('cmsBack', cmsBack);
        Vue.component('cmsRole', cmsRole);
        Vue.component('appMain', appMain);
        Vue.component('grand', grand);
        Vue.component('blockGrand', blockGrand);
        Vue.component('son', son);
        Vue.component('blockSon', blockSon);
        Vue.component('cmsUpload', cmsUpload);
        Vue.component('cmsSiteTree',cmsSiteTree);
        Vue.component('cmsTree', cmsTree);
        Vue.component('cmsChannelTree', cmsChannelTree);
        Vue.component('cmsEditor', cmsEditor);
        Vue.component('cmsFileUpload',cmsFileUpload);
        Vue.component('cmsAdvertise', cmsAdvertise);
        Vue.component('cmsChannel', cmsChannel);
        Vue.component('cmsComment', cmsComment);
        Vue.component('cmsContent', cmsContent);
        Vue.component('cmsAttachUpload', cmsAttachUpload);
        Vue.component('cmsMultipleUpload', cmsMultipleUpload);
        Vue.component('cmsPictrues', cmsPictrues);   
        Vue.component('cmsTopic', cmsTopic);  
        Vue.component('cmsTag', cmsTag); 
        Vue.component('cmsSiteDialog', cmsSiteDialog);
        Vue.component('cmsExportUpload', cmsExportUpload);
        Vue.component('cmsPicture', cmsPicture); 
        Vue.component('uploader', uploader); 
        Vue.component('cropper', cropper);
        Vue.component('cms-pagetree',cmsPageTree);//页面管理的树
        Vue.component('cms-filetree',cmsFileTree);//文件树
    }
}

// 导出组件
export default cmsComponents