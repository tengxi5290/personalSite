
let href = location.href;//截取URL地址区分是否带项目路径
let cutTag ='/jeeadmin';

export function setBaseUrl(state) {
    let apiUrl = '';
    if (process.env.NODE_ENV == 'production') {
        let localHref = href.substring(0, href.indexOf(cutTag));
        apiUrl = process.env.baseUrl == '' ? localHref : process.env.baseUrl;//判断是否分离部署
    }else{
        let localHref = href.substring(0, href.indexOf(cutTag));
        apiUrl = process.env.baseUrl == '' ? localHref : process.env.baseUrl;//判断是否分离部署
    }

    return apiUrl;
};