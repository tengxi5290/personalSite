function setAdminApi(path) {
    let global='/api/admin/';
    return global+path;
}

const api={
    bsaeUpload:'/api/member/upload/o_upload',//普通文件上传
    userLogin: '/api/front/user/login',//登录
    getPerms:'/api/admin/user/getPerms',// 获取用户权限
    loginOut:'/api/member/user/logout',//退出登录
    personalGet:'/api/personal/get',//获取个人资料详情

    //站点接口
    siteList:'/site/user/list',//查询用户下所有站点信息,站点列表
    site:'/site',//后面加id查询特定站点
    siteChange:'/site/change',//后面加id切换站点
    siteUpdate:'/site',//后面接id更新站点信息,put方法
    user:'/user',//查询用户
    siteAll: '/site/all', // 获取站点列表，可以排除当前站点

    //栏目接口
    channelList:'/channel/list',//获得栏目列表的接口
    contentTree:'/channel/list',//栏目左侧树的接口
    channel:'/channel',//新建栏目
    channelInfo:'/channel/info',//获得某一栏目的详细内容
    channelUpdate:'/channel',//修改某一栏目的内容
    channelPriority: '/channel/top', // 修改栏目置顶值


    //页面接口
    pageTree:'/page/tree/list',//获得页面树的接口
    getCatalog:'/page/tree',//获得目录接口
    catalogEdit:'/page/tree',//修改目录接口
    getPage:'/page',//获得页面接口
    pageEdit:'/page',//修改页面
    pageAdd:'/page',//新建页面
    catalogAdd:'/page/tree',//新建目录
    pagePriority: '/block/priority', // 修改页面中区块优先级


    //区块接口
    blockAdd:'/block',//新建区块
    blockDelete:'/block',//删除单个区块
    blockDeleteMany:'/block/ids',//删除多个区块
    blockPage:'/block/list',//根据页面id来查询区块的信息
    blockName:'/block',//修改区块名
    blockContents:'/block/contents',//根据区块id获取内容信息
    blockContentAdd: '/block/content', // 创建区块内容
    blockContentDelete: '/block/content', // 删除单个区块内容
    blockContentDetail: '/block/content', // 获取区块内容的详情
    getBlock: '/block', // 获取区块详情
    blockEnable: '/block/enable', // 改变区块可用状态


    //存储管理接口
    storageList:'/storage/list',//根据站点获取存储信息列表
    storageAdd:'/storage',//新建存储配置
    storageUpdate:'/storage/update',//更新已有存储配置
    ossInfo:'/storage/oss',//根据存储id获取oss存储信息
    ftpInfo:'/storage/ftp',//根据存储id获取ftp存储信息
    storageListIsDefault:'/storage/list/isdefault',//存储是否默认信息更新
    enableUpdate:'/storage/list/enable',//存储可用信息更新
    defaultUpdate:'/storage/list/isdefault',//存储是否默认信息更新


    //上传文件,资源管理接口
    resoureTreeList:'/resource/tree/list',//根据站点id获取存储路径树
    resourcePage:'/resource/page',//获取上传文件信息分页
    resourceTree:'/resource/tree',//新建文件的接口,插入存储路径配置
    resourceTreeUpdate:'/resource/tree/update',//更改文件的接口,更新存储路径配置
    resourceGetText:'/resource/getText',//获取html,js,css文件的代码
    resourceGetPpi:'/resource/ppi',//获取图片的分辨率
    resourceUploadChange:'/upload/change/string',//重新上传文件,字符串格式


    modelGet:'/content/model', //模型管理详情接口
    modelUpdate: '/content/model/update', //修改模型管理接口
    modelSave:'/content/model', //添加模型管理接口
    modelList:'/content/model/list', //模型管理列表接口
    modelDelete:'/content/model/del', //删除模型管理接口
    modelPriority:'/content/model/list/update', //批量保存模型管理接口
    defaultModel: '/content/model/default/list', // 默认模型列表


    itemList:'/content/modelItem/list', //获取模型项列表信息

    menuListGet: '/menu/list', //获取侧导航内容

    itemGet:'/content/modelItem/list', //获取模型项详细信息
    itemSave:'/content/modelItem', //添加模型项信息
    modelItem:'/content/modelItem', //获取单挑模型项信息
    itemUpdate:'/content/modelItem/update',//修改模型项信息
    itemPriority:'/content/modelItem/list/update',//批量保存模型项信息


    contentSave: '/content',//发布内容接口
    contentList: '/content/page',//内容列表接口
    contentQuoteList: '/content/otherPage', // 引用内容列表
    contentDelete: '/content/status?status=7',//删除内容接口
    contentTop: '/content/top', //置顶
    contentMove: '/content/move', // 移动
    contentCopy:'/content/copy', //复制
    contentGet: '/content',//获取内容
    contentBlockGet: '/block/content', // 获取区块内容详情
    contentBLockCopyGet: '/content', // 内容详情
    contentUpdate: '/content/update',//修改内容接口
    contentOnline: '/content/status', // 操作文章上线下线
    contentWeight: '/content/weight',  // 保存内容列表权重
    contentChannel: '/channel/list/content', // 内容部分的栏目树
    contentsAsync: '/job/getcontent', // 同步内容
    contentLive: '/content/copyByLive', // 直播站内推荐
    contentLiveNum: '/contentApi/notifyLiveNum', // 在线人数更改
    contentCopyCheck: '/content/copyCheck', // 内容引用筛选
    contentStorage: '/contentDetail/catchCache', // 清理模板缓存

    uploadFiles: '/upload', //上传文件接口
    storageId: '/storage/list', // 获取storageId

    roleSave: '/role', //角色添加
    roleList: '/role/list', //角色列表
    roleDelete: '/role', //角色删除
    rolePermission: '/privilege/tree/role', // 角色的权限树
    setRolePermission: '/role/privilege', // 更新角色权限
    roleGet: '/role', // 单项角色信息
    roleUpdate: '/role', //角色更新
    roleMembers: '/user/role/list', //角色成员
    roleMembersDelete: '/user/role', //角色成员
    roleMembersDeleteMultiple: '/user/role/list',//角色成员
    roleUser: '/user/role/addList', // 批量给用户角色权限
    roleUserDelete: '/user/role/listr', // 批量删除用户角色权限
    roleUserOmit: '/user/role/listu',
    roleUsers: '/user/role/listr', // 角色下的成员列表

    memberList: '/user/list',//会员分页列表接口
    userSite: '/user/site', // 给用户分配站点权限
    userSiteList: '/user/site/list', // 用户下有权限的角色列表
    userRoles: '/user/roles', // 查询用户拥有的角色
    userRolePermission: '/user/role/listu', // 查询用户拥有的角色，最终版

    syncChannelList: '/sync/channel/list', // 获取同步栏目列表
    syncChannel: '/sync/channel', // 给栏目新增同步字段
    syncChannelUpdate: '/sync/channel/updateName', // 更新栏目同步字段

    syncModelList: '/sync/model/list', // 获取同步模型列表
    syncModel: '/sync/model', // 给模型新增同步字段
    sncModelUpdate: '/sync/model/updateName', // 更新模型同步字段

    syncApiList: '/sync/content/list', // 获取同步接口列表
    syncApi: '/sync/content', // 新增同步内容
    syncApiDetail: '/sync/content/id', // 同步内容详情
    syncApiUpdate: '/sync/content/update', // 更新同步内容
    syncApiEnable: '/sync/content/enable', // 启用同步内容
    syncApiDisable: '/sync/content/disable', // 禁用同步内容

    spList: '/spMsg/list', // 获取sp列表
    spAdd: '/spMsg ', // 新增和更新sp
    spDelete: '/spMsg/deletes', // 删除sp
    spDetail: '/spcount/list', // 获取sp统计详情


    witnessList: '/witness/list', // 目击者列表
    witnessUpdate: '/witness/update', // 编辑目击者
    witnessContent: '/witness/content', // 关联目击者视频
    witnessToggle: '/witness/updateStatus', // 切换目击者视频上线下线
    witnessRelateList: '/witness/listByTitle', // 待关联的目击者视频列表
    witnessCheckedList: '/witness/listChecked', // 选中的关联内容
    witnessTagList: '/witness/witnessTagList', // 获取目击者标签列表
    witnessTagUpdate: '/witness/addWitnessTag', // 添加或更新目击者标签

    spStatistic: '/spcount/page', // 获取sp统计表格
    spCount: '/spcount/count', // 获取首页统计数据

    blockContentList: '/blockContent/contents', // 获取区块中的内容列表
    blockContentLink: '/blockContent/link', // 关联内容和区块
    blockContentOmit: '/blockContent', // 删区块中的内容
    blockContentUpdate: '/blockContent/content', // 更新内容或者新增h5内容
    blockContentPriority: '/blockContent/priority', // 修改区块内容排序
    blockContentDetail: '/blockContent', // 获取内容详情

    styleList: '/style/list', // 获取sp样式列表
    styleDetail: '/style', // 获取sp样式详情
    styleUpdate: '/style', // 提交更改
    styleAdd: '/style', // 新增sp样式
    styleDelete: '/style', // 删除sp样式
    styleToggle: '/style', // 切换默认显示或隐藏


    thrillerSave: '/thriller/save', // 添加片花关联
    thrillerSearch: '/thriller', // 查询片花详情
    thrillerOmit: '/thriller', // 删除片花关联


    shopList: '/shop/list', // 获取电商列表
    shopAdd: '/shop', // 新增电商项
    shopDelete: '/shop/del', // 删除单条或多条电商项
    shopRelationList: '/shop/list', // 关联的电商列表
    shopRelation: '/shop/relevance', // 关联内容和电商


    templatesList: '/contentDetail/block', // 区块模块列表
    templatesSave: '/contentDetail/block/save', //  新增区块模块
    templatesDelete: '/contentDetail/block', // 删除区块模块


    eventsList: '/contentDetail/spread', // 获取活动推荐列表
    eventsSave: '/contentDetail/spread/save', // 新增推荐活动
    eventsDelete: '/contentDetail/spread', // 删除推荐活动

    errorLogList: '/errorlog/list', // 错误日志列表
}


export default api;


