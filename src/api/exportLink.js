import qs from 'qs'
import store from '@/store/index'
import { setBaseUrl } from '@/config.js'

export function incomeStatisticExport(params){//收益统计导出
    let link = setBaseUrl()+'/api/admin/data/incomeStatistic_export'
    params.appId = process.env.appId;
    params.sessionKey=localStorage.getItem('sessionKey');
    let url=link+'?'+qs.stringify(params);
    return url   
}

export function forumStatisticExport(params){//数据中心导出
    let link = setBaseUrl() +'/api/admin/data/forumstatistic_export'
    params.appId = process.env.appId;
    params.sessionKey=localStorage.getItem('sessionKey');
    let url=link+'?'+qs.stringify(params);
    return url   
}

export function templateExport(params){//模版导出
    let link = setBaseUrl() +'/api/admin/template/exportTpl'
    params.appId=process.env.appId;
    params.sessionKey=localStorage.getItem('sessionKey');
    let url=link+'?'+qs.stringify(params);
    return url   
}



