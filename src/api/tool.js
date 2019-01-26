
import axios from "axios";

let  axiosProxy= axios.create({
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            // 'contentType':"application/json"
        },
        withCredentials:true,
    })
//创造了一个axios实例

let axiosProxyFiles = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data'
  },
  withCredentials:true,
})
// 传文件的axios实例

let checkErrorCode=function(res){
    var errorCode=res.data.errorCode
    var url=res.data.data.loginUrl
    if(errorCode==4000){
        // 等于4000则表示未登录或者登录失效,直接跳转
        location.href=url
        // 还有一个errorcode等于40001,在api/tool.js 中的拦截器中拦截到,弹窗,没有权限
    }else return
}
//检查errorCode的函数


let getPageTreeParams=function(node){//页面树获取子树需要params,用这个函数来得到拼接好的参数
    let params='';
    params=node.data.rid+'?nowPid='+node.data.nid
    let mid=node.data.data[node.data.data.length-1].id;
    params=params+'&maxId='+mid+'&type='+node.data.type;
    return params;
}


let getUrlParams = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let timestampToTime = function(timestamp) {
  var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '/'
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/'
  var D
  if(date.getDate() < 10) {
    D = '0' + date.getDate() + ' '
  } else {
    D = date.getDate() + ' '
  }
  var h 
  if(date.getHours() < 10) {
    h = '0' + date.getHours() + ':'
  } else {
    h = date.getHours() + ':'
  }
  var m
  var s

  if(date.getSeconds() < 10) {
    s = '0' + date.getSeconds()
  } else {
    s = date.getSeconds()
  }

  if(date.getMinutes() < 10) {
    m = '0' + date.getMinutes() + ':'
  } else {
    m = date.getMinutes() + ':'
  }
  return Y+M+D+h+m+s
}

let isNull = function(str){
  if ( str == "" ) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}



export {
    axiosProxy,
    checkErrorCode,
    getUrlParams,
    axiosProxyFiles,
    getPageTreeParams,
    timestampToTime,
    isNull
}
//将创建好的方法暴露出去
