import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import body from '@/components/body'
import work from '@/components/work.vue'
import error from '@/components/404.vue'
import childView from '@/components/appMain.vue'
const resourceTree = resolve => { require(['@/views/interface/resource/tree.vue'], resolve) }; //
const resourceList = resolve => { require(['@/views/interface/resource/list.vue'], resolve) }; //
const resourceEdit = resolve => { require(['@/views/interface/resource/edit.vue'], resolve) }; //
const resourceReName = resolve => { require(['@/views/interface/resource/rename.vue'], resolve) }; //
const templateTree = resolve => { require(['@/views/interface/template/tree.vue'], resolve) }; //
const templateList = resolve => { require(['@/views/interface/template/list.vue'], resolve) }; //
const templateEdit = resolve => { require(['@/views/interface/template/edit.vue'], resolve) }; //
const templateReName = resolve => { require(['@/views/interface/template/rename.vue'], resolve) }; //
const templateSetting = resolve => { require(['@/views/interface/template/setting.vue'], resolve) }; //

function $importViews(componentName) { //异步加载组件
    return resolve => {
        require(['@/views/' + componentName + '.vue'], resolve)
    }
}


Vue.use(Router)
/**
 * routes==默认路由节点
 */
export const routes = [{
    path: '/login',
    name: '登录',
    component: login,
    hidden: true
},
{
    path: '/',
    name: 'submenu.dashboard',
    meta: {
        role: 'work'
    },
    component: body,
    iconCls: 'icon-iconfontdesktop',
    leaf: true, //只有一个节点
    redirect: '/work',
    children: [{
        path: '/work',
        component: work,
    }
    ]
}
];
export const ansycRoutes = [{
    path: '/contentMange', //内容
    name: 'submenu.content',
    component: body,
    iconCls: 'icon-file',
    meta: {
        isLink: true
    },
    children: [{
        path: '/content',
        name: 'submenu.contentMange', //内容管理
        component: childView,
        isParent: true,
        redirect: '/content/list',
        children: [{
            path: '/content/list',
            name: 'submenu.contentList',
            component: $importViews('content/content/list')
        }, {
            path: '/content/save',
            name: '内容添加',
            component: $importViews('content/content/add')
        }, {
            path: '/content/update',
            name: 'submenu.内容修改',
            component: $importViews('content/content/edit')
        }]
    }, {
        path: '/topic',
        name: '专题管理', //专题管理
        component: childView,
        isParent: true,
        redirect: '/topic/list',
        children: [{
            path: '/topic/list',
            name: '专题管理列表',
            component: $importViews('content/topic/list')
        },
        {
            path: '/topic/save',
            name: '专题管理添加',
            component: $importViews('content/topic/edit')
        },
        {
            path: '/topic/update',
            name: '专题管理修改',
            component: $importViews('content/topic/edit')
        }
        ]

    }]
},
//页面
{
    path:'/page',
    component:body,
    iconCls:'',
    name:'page.control',
    children:[{
        path: '/page/list',
        name: 'page.list', //页面列表
        component: $importViews('page/list'),
        hidden: true,
    },{
        path: '/page/catalogadd',
        name: 'page.channeladd', //目录添加
        component: $importViews('page/add'),
        hidden: true,
    },{
        path: '/page/pageadd',
        name: 'page.pageadd', //页面添加
        component: $importViews('page/add'),
        hidden: true,
    },{
        path: '/page/block',
        name: 'page.block', //区块列表
        component: $importViews('page/block'),
        hidden: true,
    },{
        path: '/page/edit',
        name: 'page.block.edit', //区块编辑
        component: $importViews('page/edit'),
        hidden: true,
    },]
},
{
    path: '/channelMange', //栏目
    name: 'submenu.channel',
    component: body,
    iconCls: 'icon-appstoreo',
    redirect: '/channel/list',
    isParent: true,
    leaf: true, //只有一个节点  
    children: [{
        path: '/channel/list',
        name: 'submenu.channelList', //栏目列表
        component: $importViews('channel/list'),
        hidden: true,
    }, {
        path: '/channel/save',
        name: 'submenu.channelSave', //栏目添加
        component: $importViews('channel/add'),
        hidden: true,
    }, {
        path: '/channel/update',
        name: 'submenu.channelUpdate', //栏目修改
        component: $importViews('channel/edit'),
        hidden: true,
    }]
},
//数据中心
{
    path: "/dataCenter",
    name: '数据中心',//数据中心
    component: body,
    iconCls: 'icon-barschart',
    meta: {
        isLink: true,
    },
    children: [
        {
            path: '/traffic',//流量分析
            name: '流量分析',
            component: childView,
            children: [{
                path: '/traffic/trend',//趋势分析
                name: '趋势分析',
                component: $importViews('data/trendAnalysis'),
            }, {
                path: '/traffic/channel',//栏目访问量排行
                name: '栏目访问量排行',
                component: $importViews('data/channelAnalysis'),
            }]
        },
        {
            path: '/sourceanalysis',//来源分析
            name: '来源分析',
            component: childView,
            children: [{
                path: '/sourceanalysis/class',//来源分类
                name: '来源分类',
                component: $importViews('data/source/class'),
            },
            {
                path: '/sourceanalysis/engin',//搜索引擎
                name: '搜索引擎',
                component: $importViews('data/source/engine'),
            },
            {
                path: '/sourceanalysis/domain',//搜索引擎
                name: '来访域名',
                component: $importViews('data/source/domain'),
            }]
        },
        {
            path: '/surveyedanalysis',//受访分析
            name: '受访分析',
            component: childView,
            children: [{
                path: '/surveyedanalysis/surveyed',//受访页面
                name: '受访页面',
                component: $importViews('data/surveyed/surveyed'),
            },
            {
                path: '/surveyedanalysis/index',//入口页面
                name: '入口页面',
                component: $importViews('data/surveyed/index'),
            }]
        }, {
            path: '/siteProfile',//网站概况
            name: '网站概况',
            component: childView,
            children: [{
                path: '/siteProfile/contentnum',//内容发布数
                name: '内容发布数',
                component: $importViews('data/siteProfile/contentnum'),
            },
            {
                path: '/siteProfile/worknum',//工作量
                name: '工作量',
                component: $importViews('data/siteProfile/worknum'),
            },
            {
                path: '/siteProfile/commentnum',//评论数
                name: '评论数',
                component: $importViews('data/siteProfile/commentnum'),
            },
            {
                path: '/siteProfile/leavenum',//留言数
                name: '留言数',
                component: $importViews('data/siteProfile/leavenum'),
            },
            {
                path: '/siteProfile/usernum',//会员注册数
                name: '会员注册数',
                component: $importViews('data/siteProfile/usernum'),
            }]
        }]
},
{
    path: '/userMange',
    name: 'submenu.user', //用户管理
    component: body,
    iconCls: 'icon-user',
    meta: {
        isLink: true
    },
    children: [{
        path: '/user',
        name: 'submenu.member', //会员管理
        component: childView,
        isParent: true,
        redirect: '/user/list',
        children: [{
            path: '/user/list', //会员列表
            name: 'submenu.memberList',
            component: $importViews('user/userMange/list'),
        },
        {
            path: '/user/save', //会员添加
            name: 'submenu.memberSave',
            component: $importViews('user/userMange/add'),
            hidden: true
        },
        {
            path: '/user/update', //会员添加
            name: 'submenu.memberUpdate',
            component: $importViews('user/userMange/edit'),
            hidden: true
        }
        ]
    }, {
        path: '/role', //角色管理
        name: 'submenu.role',
        component: childView,
        isParent: true,
        redirect: '/role/list',
        children: [{
            path: '/role/list', //角色管理
            name: 'submenu.roleList',
            component: $importViews('user/role/list'),
        },
        {
            path: '/role/save', //成员添加
            name: 'submenu.roleSave',
            component: $importViews('user/role/edit'),
            hidden: true
        },
        {
            path: '/role/update', //成员修改
            name: 'submenu.roleUpdate',
            component: $importViews('user/role/edit'),
            hidden: true
        },
        {
            path: '/role/members', //成员列表
            name: 'submenu.roleMembers',
            component: $importViews('user/role/members'),
            hidden: true
        }
        ]
    }, {
        path: '/account',
        name: 'submenu.source', //会员管理
        component: childView,
        isParent: true,
        redirect: '/account/list',
        children: [{
            path: '/account/list', //会员列表
            name: 'submenu.sourceList',
            component: $importViews('user/account/list'),
        },]
    }, {
        path: '/adminGlobal',
        name: 'submenu.adminGlobal', //管理员(全站)
        component: childView,
        isParent: true,
        redirect: '/adminGlobal/list',
        children: [{
            path: '/adminGlobal/list', //管理员列表(全站)
            name: 'submenu.adminGlobalList',
            component: $importViews('user/admin/global/list'),
        }, {
            path: '/adminGlobal/edit', //管理员编辑页(全站)
            name: 'submenu.adminGlobalEdit',
            component: $importViews('user/admin/global/edit'),
            hidden: true
        }, {
            path: '/adminGlobal/add', //管理员添加页(全站)
            name: 'submenu.adminGlobalAdd',
            component: $importViews('user/admin/global/add'),
            hidden: true
        }]
    }, {
        path: '/adminGlocal',
        name: 'submenu.adminGlocal', //管理员(本站)
        component: childView,
        isParent: true,
        redirect: '/adminGlocal/list',
        children: [{
            path: '/adminGlocal/list', //管理员列表(本站)
            name: 'submenu.adminGlocalList',
            component: $importViews('user/admin/glocal/list'),
        }, {
            path: '/adminGlocal/edit', //管理员编辑页(本站)
            name: 'submenu.adminGlocalEdit',
            component: $importViews('user/admin/glocal/edit'),
        }, {
            path: '/adminGlocal/add', //管理员添加页(本站)
            name: 'submenu.adminGlocalAdd',
            component: $importViews('user/admin/glocal/add'),
        }]
    }, {
        path: '/log',
        name: 'submenu.operatLog', //操作日志
        component: childView,
        isParent: true,
        redirect: '/log/list',
        children: [{
            path: '/log/list', //日志列表
            name: 'submenu.operatList',
            component: $importViews('user/log/list'),
        }]
    }, {
        path: '/group',
        name: 'submenu.group', //会员组管理
        component: childView,
        isParent: true,
        redirect: '/group/list',
        children: [{
            path: '/group/list', //会员组列表
            name: 'submenu.groupList',
            component: $importViews('user/group/list'),
        }, {
            path: '/group/add', //会员组添加
            name: 'submenu.groupSave',
            component: $importViews('user/group/add'),
        }, {
            path: '/group/edit', //会员组修改
            name: 'submenu.groupUpdate',
            component: $importViews('user/group/edit'),
        }]
    }, {
        path: '/message',
        name: 'submenu.message', //站内信管理
        component: childView,
        isParent: true,
        redirect: '/message/list',
        children: [{
            path: '/message/list', //会员组列表
            name: 'submenu.messageList',
            component: $importViews('user/message/list'),
        }, {
            path: '/message/add', //发送站内信
            name: 'submenu.messageSend',
            component: $importViews('user/message/add'),
        }]
    }]
},
{
    path: '/operate',
    component: body,
    iconCls: 'icon-yunying',
    name: 'operate.menu', //
    meta: {
        isLink: true
    },
    children: [{
        path: '/fullTestSearch',
        isParent: true,
        name: 'operate.fullTextSearch.submenu.fullTextSearch', //全文检索
        component: $importViews('operate/fullTextSearch/input'),
    },
    {
        path: '/contentReuse',
        isParent: true,
        name: 'operate.contentReuse.submenu.contentReuse', //内容复用
        component: $importViews('operate/contentReuse/list'),
    },
    {
        path: '/crontab',
        name: 'operate.crontab.submenu.crontab', //定时任务
        component: childView,
        isParent: true,
        redirect: '/crontab/list',
        children: [{
            path: '/crontab/list', //定时任务列表
            name: 'operate.crontab.submenu.crontabList',
            component: $importViews('operate/crontab/list'),
        }, {
            path: '/crontab/save', //定时任务添加
            name: 'operate.crontab.submenu.crontabSave',
            component: $importViews('operate/crontab/edit'),
        }, {
            path: '/crontab/update', //定时任务修改
            name: 'operate.crontab.submenu.crontabUpdate',
            component: $importViews('operate/crontab/edit'),
        }]
    },
    {
        path: '/workflow',
        name: 'operate.workflow.submenu.workflow',//工作流
        component: childView,
        isParent: true,
        redirect: '/workflow/list',
        children: [{
            path: '/workflow/list',//工作流列表
            name: 'operate.workflow.submenu.workflowList',
            component: $importViews('operate/workflow/list'),
        }, {
            path: '/workflow/save',//工作流添加
            name: 'operate.workflow.submenu.workflowSave',
            component: $importViews('operate/workflow/edit'),
        }, {
            path: '/workflow/update',//工作流修改
            name: 'operate.workflow.submenu.workflowUpdate',
            component: $importViews('operate/workflow/edit'),
        }
        ]
    },
    {
        path: '/link',
        name: 'operate.link.submenu.link',//友情链接
        component: childView,
        isParent: true,
        redirect: '/link/list',
        children: [{
            path: '/link/list',//友情链接列表
            name: 'operate.link.submenu.linkList',
            component: $importViews('operate/link/list'),
        }, {
            path: '/link/save',//友情链接添加
            name: 'operate.link.submenu.linkSave',
            component: $importViews('operate/link/edit'),
        }, {
            path: '/link/update',//友情链接修改
            name: 'operate.link.submenu.linkUpdate',
            component: $importViews('operate/link/edit'),
        }, {
            path: '/link/typeList',//友情链接类别列表
            name: 'operate.link.submenu.typeList',
            component: $importViews('operate/link/typeList'),
        }
        ]
    },
    {
        path: '/ad',
        name: 'operate.ad.submenu.ad',//广告管理
        component: childView,
        isParent: true,
        redirect: '/ad/list',
        children: [{
            path: '/ad/list',//广告管理
            name: 'operate.ad.submenu.adList',
            component: $importViews('operate/ad/list'),
        }, {
            path: '/ad/save',//广告添加
            name: 'operate.ad.submenu.adSave',
            component: $importViews('operate/ad/edit'),
        }, {
            path: '/ad/update',//广告修改
            name: 'operate.ad.submenu.adUpdate',
            component: $importViews('operate/ad/edit'),
        }, {
            path: '/adSpace/list',//广告版位列表
            name: 'operate.ad.submenu.adTypeList',
            component: $importViews('operate/ad/typeList'),
        }
        ]
    },
    {
        path: '/file',
        name: 'operate.file.submenu.file',//附件管理
        component: childView,
        isParent: true,
        redirect: '/file/list',
        children: [
            {
                path: '/file/list',//附件管理
                name: 'operate.file.submenu.fileList',
                component: $importViews('operate/file/list'),
            },
        ]
    },
    {
        path: '/contentShare',
        name: 'operate.contentShare.submenu.contentShare',//共享管理
        component: childView,
        isParent: true,
        redirect: '/contentShare/list',
        children: [
            {
                path: '/contentShare/list',//共享列表
                name: 'operate.contentShare.submenu.contentShareList',
                component: $importViews('operate/contentShare/list'),
            },
            {
                path: '/contentShare/view',//内容查看
                name: 'operate.contentShare.submenu.contentShareView',
                component: $importViews('operate/contentShare/edit'),
            },
        ]
    },
    {
        path: '/contentBuy',
        name: 'operate.word.submenu.contentBuy',//内容购买记录
        component: childView,
        isParent: true,
        redirect: '/contentBuy/list',
        children: [
            {
                path: '/contentBuy/list',////内容购买记录列表
                name: 'operate.word.submenu.contentBuyList',
                component: $importViews('operate/contentBuy/list'),
            },
        ]
    },
    {
        path: '/userAccount',
        name: 'operate.word.submenu.userAccount',//用户账户统计
        component: childView,
        isParent: true,
        redirect: '/userAccount/list',
        children: [
            {
                path: '/userAccount/list',////用户账户统计列表
                name: 'operate.word.submenu.userAccountList',
                component: $importViews('operate/userAccount/list'),
            },
        ]
    },
    {
        path: '/charge',
        name: 'operate.word.submenu.charge',//内容收费统计
        component: childView,
        isParent: true,
        redirect: '/charge/list',
        children: [
            {
                path: '/charge/list',////内容收费统计列表
                name: 'operate.word.submenu.chargeList',
                component: $importViews('operate/charge/list'),
            },
            {
                path: '/charge/commission',////2）平台佣金所得
                name: 'operate.word.submenu.commission',
                component: $importViews('operate/charge/commissionStatic'),
            },
        ]
    },
    {
        path: '/accountPay',
        name: 'operate.word.submenu.accountPay',//转账管理
        component: childView,
        isParent: true,
        redirect: '/accountPay/list',
        children: [
            {
                path: '/accountPay/list',////转账管理列表
                name: 'operate.word.submenu.accountPayList',
                component: $importViews('operate/accountPay/list'),
            },
        ]
    },
    {
        path: '/drawApply',
        name: 'operate.word.submenu.drawApply',//提现管理
        component: childView,
        isParent: true,
        redirect: '/drawApply/list',
        children: [
            {
                path: '/drawApply/list',////提现管理列表
                name: 'operate.word.submenu.drawApplyList',
                component: $importViews('operate/drawApply/list'),
            },
            {
                path: '/drawApply/traAccount',////转账
                name: 'operate.word.submenu.traAccount',
                component: $importViews('operate/drawApply/TransferAccounts'),
            }
        ]
    },
    {
        path: '/dimensioncode',
        name: 'operate.word.submenu.dimensioncode',//二维码管理
        component: childView,
        isParent: true,
        redirect: '/dimensioncode/create',
        children: [
            {
                path: '/dimensioncode/create',////二维码管理创建
                name: 'operate.word.submenu.dimensioncodeCreate',
                component: $importViews('operate/dimensioncode/create'),
            },
        ]
    },
    {
        path: '/dictionary',
        name: 'operate.word.submenu.dictionary',//字典
        component: childView,
        isParent: true,
        redirect: '/dictionary/list',
        children: [
            {
                path: '/dictionary/list',////字典列表
                name: 'operate.word.submenu.dictionaryList',
                component: $importViews('operate/dictionary/list'),
            },
        ]
    },
    {
        path: '/contentCycle',
        name: 'operate.word.submenu.contentCycle',//内容回收站
        component: childView,
        isParent: true,
        redirect: '/contentCycle/list',
        children: [
            {
                path: '/contentCycle/list',////字典列表
                name: 'operate.word.submenu.contentCycleList',
                component: $importViews('operate/contentCycle/list'),
            },
        ]
    },
    {
        path: '/scoregroup',
        name: 'operate.word.submenu.scoregroup',//评分组管理
        component: childView,
        isParent: true,
        redirect: '/scoregroup/list',
        children: [
            {
                path: '/scoregroup/list',////评分组管理列表
                name: 'operate.word.submenu.scoregroupList',
                component: $importViews('operate/scoregroup/list'),
            },
            {
                path: '/scoregroup/add',////评分组管理添加
                name: 'operate.word.submenu.scoregroupAdd',
                component: $importViews('operate/scoregroup/edit'),
            },
            {
                path: '/scoregroup/edit',////评分组管理修改
                name: 'operate.word.submenu.scoregroupEdit',
                component: $importViews('operate/scoregroup/edit'),
            },
            {
                path: '/scoregroup/scoreitem/list',////评分项管理
                name: 'operate.word.submenu.scoreitem',
                component: childView,
                redirect: '/scoregroup/scoreitem/list',
                children: [
                    {
                        path: '/scoregroup/scoreitem/list',////评分项管理列表
                        name: 'operate.word.submenu.scoreitemList',
                        component: $importViews('operate/scoregroup/scoreitem/list'),
                    },
                    {
                        path: '/scoregroup/scoreitem/add',////评分项管理添加
                        name: 'operate.word.submenu.scoreitemAdd',
                        component: $importViews('operate/scoregroup/scoreitem/edit'),
                    },
                    {
                        path: '/scoregroup/scoreitem/edit',////评分项管理修改
                        name: 'operate.word.submenu.scoreitemEdit',
                        component: $importViews('operate/scoregroup/scoreitem/edit'),
                    },
                ]
            }
        ]
    },
    {
        path: '/word',
        name: 'operate.word.submenu.word',//词汇管理
        component: childView,
        children: [
            {
                path: '/tag',////tag管理
                name: 'operate.word.submenu.tag',
                component: childView,
                redirect: '/tag/list',
                children: [
                    {
                        path: '/tag/list',////tag管理列表
                        name: 'operate.word.submenu.tagList',
                        component: $importViews('operate/word/tag/list'),
                    },
                ]
            },
            {
                path: '/sensitivity',////敏感词管理
                name: 'operate.word.submenu.sensitivity',
                component: childView,
                redirect: '/sensitivity/list',
                children: [
                    {
                        path: '/sensitivity/list',////敏感词管理列表
                        name: 'operate.word.submenu.sensitivityList',
                        component: $importViews('operate/word/sensitivity/list'),
                    },
                ]
            },
            {
                path: '/keyword',////关键词管理
                name: 'operate.word.submenu.keyword',
                component: childView,
                redirect: '/keyword/list',
                children: [
                    {
                        path: '/keyword/list',////敏感词管理列表
                        name: 'operate.word.submenu.keywordList',
                        component: $importViews('operate/word/keyword/list'),
                    },
                ]
            },
            {
                path: '/origin',////来源管理
                name: 'operate.word.submenu.origin',
                component: childView,
                redirect: '/origin/list',
                children: [
                    {
                        path: '/origin/list',////来源管理列表
                        name: 'operate.word.submenu.originList',
                        component: $importViews('operate/word/origin/list'),
                    },
                ]
            },
            {
                path: '/searchwords',////热词管理
                name: 'operate.word.submenu.searchwords',
                component: childView,
                redirect: '/searchwords/list',
                children: [
                    {
                        path: '/searchwords/list',////热词管理列表
                        name: 'operate.word.submenu.searchwordsList',
                        component: $importViews('operate/word/searchwords/list'),
                    },
                ]
            }
        ]
    },
    ]
},


///界面
{
    path: '/interface',
    name: '界面',
    component: body,
    iconCls: 'icon-windowso',
    children: [
        {
            path: '/templatelist',
            name: '模版管理',
            component: childView,
            isParent: true,
            children: [
                {
                    path: '/',
                    name: '模版',
                    component: templateTree,
                    hidden: true,
                    children: [
                        {
                            path: '/templatelist',
                            name: '模版列表',
                            component: templateList,
                            hidden: true
                        },
                        {
                            path: '/templateadd',
                            name: '添加模版',
                            component: templateEdit,
                            hidden: true
                        },
                        {
                            path: '/templateedit',
                            name: '修改模版',
                            component: templateEdit,
                            hidden: true
                        },
                        {
                            path: '/templaterename',
                            name: '模版重命名',
                            component: templateReName,
                            hidden: true
                        }, {
                            path: '/templatesetting',
                            name: '模版设置',
                            component: templateSetting,
                            hidden: true
                        }
                    ]
                }
            ]
        },
        {
            path: '/resourcelist',
            name: '资源管理',
            isParent: true,
            component: childView,
            children: [
                {
                    path: '/',
                    name: '资源',
                    component: resourceTree,
                    hidden: true,
                    children: [
                        {
                            path: '/resourcelist',
                            name: '资源列表',
                            component: resourceList,
                            hidden: true
                        },
                        {
                            path: '/resourceadd',
                            meta: { role: 'resourceadd' },
                            name: '添加资源',
                            component: resourceEdit,
                            hidden: true
                        },
                        {
                            path: '/resourceedit',
                            name: '修改资源',
                            component: resourceEdit,
                            hidden: true
                        },
                        {
                            path: '/resourcerename',
                            name: '资源重命名',
                            component: resourceReName,
                            hidden: true
                        },
                    ]
                }
            ]
        }
    ]
},
//界面结束

//站点
{
    path: '/config',
    component: body,
    iconCls: 'icon-setting',
    name: 'submenu.config',//
    meta: {
        isLink: true
    },
    children: [
        {
            path: '/siteConfig',
            isParent: true,
            name: 'submenu.siteConfigGet',//站点设置
            component: $importViews('config/siteConfig/edit'),
        },
        {
            path: '/ftp',
            name: 'config.fullTextSearch.submenu.ftp',//ftp管理
            component: childView, isParent: true,
            redirect: '/ftp/list',
            children: [
                {
                    path: '/ftp/list',
                    name: 'config.fullTextSearch.submenu.ftpList',//ftp管理列表
                    component: $importViews('config/ftp/list'),
                }, {
                    path: '/ftp/add',
                    name: 'config.fullTextSearch.submenu.ftpAdd',//ftp管理添加
                    component: $importViews('config/ftp/edit'),
                }, {
                    path: '/ftp/edit',
                    name: 'config.fullTextSearch.submenu.ftpEdit',//ftp管理修改
                    component: $importViews('config/ftp/edit'),
                }
            ]
        },
        {
            path: '/type',
            name: 'config.fullTextSearch.submenu.type',//内容类型
            component: childView, isParent: true,
            redirect: '/type/list',
            children: [
                {
                    path: '/type/list',
                    name: 'config.fullTextSearch.submenu.typeList',//内容类型列表
                    component: $importViews('config/type/list'),
                },
                {
                    path: '/type/add',
                    name: 'config.fullTextSearch.submenu.typeAdd',//内容类型添加
                    component: $importViews('config/type/edit'),
                },
                {
                    path: '/type/edit',
                    name: 'config.fullTextSearch.submenu.typeEdit',//内容类型修改
                    component: $importViews('config/type/edit'),
                }
            ]
        },
        {
            path: '/model',
            name: 'config.fullTextSearch.submenu.model',//模型管理
            component: childView,
            isParent: true,
            redirect: '/model/list',
            children: [{
                path: '/model/list',
                name: 'config.fullTextSearch.submenu.modelList',//模型管理列表
                component: $importViews('config/model/list'),
            }, {
                path: '/model/add',
                name: 'config.fullTextSearch.submenu.modelAdd',//模型管理添加
                component: $importViews('config/model/edit'),
            }, {
                path: '/model/edit',
                name: 'config.fullTextSearch.submenu.modelEdit',//模型管理修改
                component: $importViews('config/model/edit'),
            },
            {
                path: '/channelModel/list',
                name: '栏目模型',//栏目模型
                component: $importViews('config/model/item/channel/list')
            },
            {
                path: '/channelModel/update',
                name: '栏目模型修改',//栏目模型项修改
                component: $importViews('config/model/item/channel/edit')
            },
            {
                path: '/channelModel/save',
                name: '栏目模型添加',//栏目模型项添加
                component: $importViews('config/model/item/channel/edit')
            },
            {
                path: '/contentModel/list',
                name: '内容模型',//内容模型
                component: $importViews('config/model/item/content/list')
            },
            {
                path: '/contentModel/update',
                name: '内容模型修改',//内容模型项修改
                component: $importViews('config/model/item/content/edit')
            },
            {
                path: '/contentModel/save',
                name: '内容模型添加',//内容模型项添加
                component: $importViews('config/model/item/content/edit')
            }
            ]
        },
        {
            path: '/globel',
            name: 'config.fullTextSearch.submenu.config',//全局设置
            component: childView,
            children: [
                {
                    path: '/globel/systemUpdate',
                    name: 'config.fullTextSearch.submenu.systemSet',//全局设置-系统设置
                    component: $importViews('config/config/systemUpdate'),
                },
                {
                    path: '/globel/loginUpdate',
                    name: 'config.fullTextSearch.submenu.loginSet',//全局设置-登录设置
                    component: $importViews('config/config/loginUpdate'),
                },
                {
                    path: '/globel/memberUpdate',
                    name: 'config.fullTextSearch.submenu.memberSet',//全局设置-会员设置
                    component: $importViews('config/config/memberUpdate'),
                },
                {
                    path: '/globel/registerModel',
                    name: 'config.fullTextSearch.submenu.registerModel',//全局设置-会员注册管理
                    component: childView,
                    redirect: '/globel/registerModel/list',
                    children: [{
                        path: '/globel/registerModel/list',
                        name: 'config.fullTextSearch.submenu.registerModelList',//全局设置-会员注册管理列表
                        component: $importViews('config/config/memberRegister/list'),
                    },
                    {
                        path: '/globel/registerModel/add',
                        name: 'config.fullTextSearch.submenu.registerModelAdd',//全局设置-会员注册管理添加
                        component: $importViews('config/config/memberRegister/edit'),
                    },
                    {
                        path: '/globel/registerModel/edit',
                        name: 'config.fullTextSearch.submenu.registerModelEdit',//全局设置-会员注册管理修改
                        component: $importViews('config/config/memberRegister/edit'),
                    }
                    ]
                },
                {
                    path: '/globel/markUpdate',
                    name: 'config.fullTextSearch.submenu.markSet',//全局设置-水印设置
                    component: $importViews('config/config/markUpdate'),
                },
                {
                    path: '/globel/firewallUpdate',
                    name: 'config.fullTextSearch.submenu.firewallSet',//全局设置-防火墙设置
                    component: $importViews('config/config/firewallUpdate'),
                },
                {
                    path: '/globel/attrUpdate',
                    name: 'config.fullTextSearch.submenu.attrSet',//全局设置-其他设置
                    component: $importViews('config/config/attrUpdate'),
                },
                {
                    path: '/globel/companyUpdate',
                    name: 'config.fullTextSearch.submenu.companySet',//全局设置-机构信息设置
                    component: $importViews('config/config/companyUpdate'),
                },
                {
                    path: '/globel/contentUpdate',
                    name: 'config.fullTextSearch.submenu.contentSet',//全局设置-内容佣金设置
                    component: $importViews('config/config/contentUpdate'),
                },
            ]
        },
        {
            path: '/site',
            component: childView, isParent: true,
            name: 'config.fullTextSearch.submenu.site',//站点管理
            redirect: '/site/list',
            children: [
                {
                    path: '/site/list',
                    name: 'config.fullTextSearch.submenu.siteList',//站点管理列表
                    component: $importViews('config/site/list'),
                },
                {
                    path: '/site/add',
                    name: 'config.fullTextSearch.submenu.siteAdd',//站点管理添加
                    component: $importViews('config/site/add'),
                },
                {
                    path: '/site/edit',
                    name: 'config.fullTextSearch.submenu.siteEdit',//站点管理修改
                    component: $importViews('config/site/list'),
                }
            ]
        },
        {
            path: '/apiManage',
            name: 'config.fullTextSearch.submenu.apiManage',//接口管理
            component: childView,
            children: [
                {
                    path: '/apiManage/apiUpdate',
                    name: 'config.fullTextSearch.submenu.apiUpdate',//接口管理-接口设置
                    component: $importViews('config/apiManage/apiUpdate'),
                },
                {
                    path: '/apiManage/apiSSOupdate',
                    name: 'config.fullTextSearch.submenu.apiSSOupdate',//接口管理-接口设置
                    component: $importViews('config/apiManage/ssoManage'),
                },
                {
                    path: '/apiManage/apiMan',
                    name: 'config.fullTextSearch.submenu.apiMan',//接口管理-接口管理
                    component: childView,
                    redirect: '/apiManage/apiMan/list',
                    children: [{
                        path: '/apiManage/apiMan/list',
                        name: 'config.fullTextSearch.submenu.apiManList',//接口管理-接口管理列表
                        component: $importViews('config/apiManage/apiMan/list'),
                    }, {
                        path: '/apiManage/apiMan/add',
                        name: 'config.fullTextSearch.submenu.apiManAdd',//接口管理-接口管理添加
                        component: $importViews('config/apiManage/apiMan/edit'),
                    }, {
                        path: '/apiManage/apiMan/edit',
                        name: 'config.fullTextSearch.submenu.apiManEdit',//接口管理-接口管理修改
                        component: $importViews('config/apiManage/apiMan/edit'),
                    }]
                },
                {
                    path: '/apiManage/apiUserMan',
                    name: 'config.fullTextSearch.submenu.apiUserMan',//接口管理-接口用户管理
                    component: childView,
                    redirect: '/apiManage/apiUserMan/list',
                    children: [{
                        path: '/apiManage/apiUserMan/list',
                        name: 'config.fullTextSearch.submenu.apiUserManList',//接口管理-接口用户管理列表
                        component: $importViews('config/apiManage/apiUserMan/list'),
                    }, {
                        path: '/apiManage/apiUserMan/add',
                        name: 'config.fullTextSearch.submenu.apiUserManAdd',//接口管理-接口用户管理添加
                        component: $importViews('config/apiManage/apiUserMan/edit'),
                    }, {
                        path: '/apiManage/apiUserMan/edit',
                        name: 'config.fullTextSearch.submenu.apiUserManEdit',//接口管理-接口用户管理修改
                        component: $importViews('config/apiManage/apiUserMan/edit'),
                    }]
                },
                {
                    path: '/apiManage/apiUseRecord',
                    name: 'config.fullTextSearch.submenu.apiUseRecord',//接口管理-接口使用记录
                    component: childView,
                    redirect: '/apiManage/apiUseRecord/list',
                    children: [{
                        path: '/apiManage/apiUseRecord/list',
                        name: 'config.fullTextSearch.submenu.apiUseRecordList',//接口管理-接口使用记录列表
                        component: $importViews('config/apiManage/apiUseRecord/list'),
                    }]
                },
                {
                    path: '/apiManage/apiRecord',
                    name: 'config.fullTextSearch.submenu.apiRecord',//接口管理-api接口记录
                    component: childView,
                    redirect: '/apiManage/apiRecord/list',
                    children: [{
                        path: '/apiManage/apiRecord/list',
                        name: 'config.fullTextSearch.submenu.apiRecordList',//接口管理-api接口记录列表
                        component: $importViews('config/apiManage/apiRecord/list'),
                    }]
                },
                {
                    path: '/apiManage/apiInfo',
                    name: 'config.fullTextSearch.submenu.apiInfo',//接口管理-接口使用记录
                    component: childView,
                    redirect: '/apiManage/apiInfo/list',
                    children: [{
                        path: '/apiManage/apiInfo/list',
                        name: 'config.fullTextSearch.submenu.apiInfoList',//接口管理-api接口管理列表
                        component: $importViews('config/apiManage/apiInfo/list'),
                    }, {
                        path: '/apiManage/apiInfo/add',
                        name: 'config.fullTextSearch.submenu.apiInfoAdd',//接口管理-api接口管理添加
                        component: $importViews('config/apiManage/apiInfo/edit'),
                    }, {
                        path: '/apiManage/apiInfo/edit',
                        name: 'config.fullTextSearch.submenu.apiInfoEdit',//接口管理-api接口管理删除
                        component: $importViews('config/apiManage/apiInfo/edit'),
                    }]
                },
                {
                    path: '/apiManage/apiAccount',
                    name: 'config.fullTextSearch.submenu.apiAccount',//接口管理-api接口账户管理
                    component: childView,
                    redirect: '/apiManage/apiAccount/list',
                    children: [{
                        path: '/apiManage/apiAccount/list',
                        name: 'config.fullTextSearch.submenu.apiAccountList',//接口管理-api接口账户管理列表
                        component: $importViews('config/apiManage/apiAccount/list'),
                    }, {
                        path: '/apiManage/apiAccount/add',
                        name: 'config.fullTextSearch.submenu.apiAccountAdd',//接口管理-api接口账户管理添加
                        component: $importViews('config/apiManage/apiAccount/add'),
                    }]
                }

            ]
        },
    ]
},
{
    path: '*',
    name: '404',
    component: error,
    meta: {
        role: 'index'
    },
    hidden: true
}
];
