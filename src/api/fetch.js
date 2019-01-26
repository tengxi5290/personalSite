import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import router from '../router/index'
import { getRand } from '@/untils/random'
import { signParams } from '@/untils/sign'
import { Message } from 'element-ui'
import { setBaseUrl } from '@/config.js'
function showMessage(value) {
    return Message({
        showClose: true,
        message: value,
        type: 'error',
        duration: 3500
    });
}


axios.defaults.baseURL = setBaseUrl();
axios.defaults.timeout = 15000;
/**
 * 请求拦截器
 * 
 */
axios.interceptors.request.use(config => {//在此处统一配置公共参数
   
    let appId = process.env.appId; //appid
    let appKey = process.env.appKey; //appkey
    let sessionKey = localStorage.getItem('sessionKey'); //sessionkey
    let _site_id_param = localStorage.getItem('_site_id_param')|| '';//站点id
    let params = {
        appId: appId,//appid
        nonce_str: getRand(),//随机数
        _site_id_param: _site_id_param
    };
    if (sessionKey && sessionKey != '') {
        params.sessionKey = sessionKey;
    }
    for (let key in config.data) {
        params[key] = config.data[key]; //添加进参数列表
    }
    params = signParams(params, appKey);//返回签名后的对象
    config.data = qs.stringify(params);//序列化
    return config;
}, error => {
  
    Promise.reject(error);// 错误提示
})


/**响应拦截器 */
axios.interceptors.response.use(response => {
    let res = response.data;
    switch (response.code) {
        case '200':

            break;
        case '301':
            
            break;
        case '304':

            break;
        case '3':
            showMessage(response.status + ":" + response.statusText);
            localStorage.setItem('sessionKey', '');
            localStorage.setItem('userName', '');
            router.push('/login');
            break;
        case '302':
            showMessage(response.status + ":" + response.statusText);
            localStorage.setItem('sessionKey', '');
            localStorage.setItem('userName', '');
            router.push('/login');
            break;
        case '40001':
            showMessage("没有权限!");
            break;
        default:
            break;
    }
    return response.data;
},
    error => {
        showMessage('服务器响应失败');

        return Promise.reject(error)
    }
);

export default axios
