import api from '@/api/api'

/**
 * 
 * {
    name: '',
    role: '',
    api: [],
    children:[]
}
 * 
 */
const roles = [{
    name: '工作台',
    role: '/work',
    isHidden: true,
    checked:true,
    api: [
        api.userLogin,
        api.flowSourceList,
        api.statisticMemberList,
        api.globalStatistic,
        api.flowPvList,
    ]
},
{
    name: '内容',
    role: '/contentMange',
    children: [{
        name: '内容',
        role: '/content',
         api:[
            api.topicListAll,
            api.channelList,
            api.contentTree,
            api.typeList,
            api.contentPage,
            api.contentList,
            api.contentShareTree,
            api.configContentChargeGet,
            api.typeGet,
            api.tplModelList,
            api.groupList,
            api.fullTextSearchChannelList,
            api.channelGet,
            api.itemList,
            api.contentGet,
            api.modelList,
            '/content/list'
        ],
        children: [
            {
                name: '列表',
                role: '/content/list',
                api: [api.contentList]
            }, {
                name: '添加',
                role: '/content/save',
                api: [api.contentSave]
            }, {
                name: '修改',
                role: '/content/update',
                api: [api.contentUpdate]
            }, {
                name: '删除',
                role: '/content/delete',
                api: [api.contentDelete]
            }, {
                name: '保存置顶',
                role: '/content/priority',
                api: [api.contentPriority]
            }, {
                name: '推荐',
                role: '/content/contentRecommend',
                api: [api.contentRecommend]
            }, {
                name: '移动',
                role: '/content/contentMove',
                api: [api.contentMove]
            }, {
                name: '复制',
                role: '/content/contentCopy',
                api: [api.contentCopy]
            }, {
                name: '审核',
                role: '/content/contentCheck',
                api: [api.contentCheck]
            }, {
                name: '退回',
                role: '/content/contentReject',
                api: [api.contentReject]
            }, {
                name: '提交',
                role: '/content/contentSubmit',
                api: [api.contentSubmit]
            }, {
                name: '生成静态页',
                role: '/content/contentStatic',
                api: [api.contentStatic]
            }, {
                name: '推送',
                role: '/content/contentPush',
                api: [api.contentPush]
            }, {
                name: '推送至专题',
                role: '/content/contentSend',
                api: [api.contentSend]
            }, {
                name: '归档',
                role: '/content/contentPigeonhole',
                api: [api.contentPigeonhole]
            }
            , {
                name: '出档',
                role: '/content/contentUnpigeonhole',
                api: [api.contentUnpigeonhole]
            }, {
                name: '群发微信',
                role: '/content/contentSendToWeixin',
                api: [api.contentSendToWeixin]
            }
        ]
    }, {
        name: '专题管理',
        role: '/topic',
        api: [api.topicGet],
        children: [
            {
                name: '列表',
                role: '/topic/list',
                api: [api.topicList]
            },
            {
                name: '添加',
                role: '/topic/save',
                api: [api.topicSave,
                api.topicTplList]
            },
            {
                name: '删除',
                role: '/topic/delete',
                api: [api.topicDelete]
            },
            {
                name: '修改',
                role: '/topic/update',
                api: [api.topicUpdate,
                api.topicTplList]
            }, {
                name: '保存排序',
                role: '/topic/priority',
                api: [api.topicPriority]
            }
        ]
    }]
},
{
    name: '栏目',
    role: '/channel',
    api: [api.channelList, api.channelTree, api.channelCopy,'/channel/list'],
    children: [
        {
            name: '列表',
            role: '/channel/list',
            api: [api.channelList, api.modelList],
        },
        {
            name: '详情',
            role: '/channel/get',
            api: [
                api.channelGet, api.itemList,
                api.channelCreatPath,
                api.fullTextSearchChannelList,
                api.modelList, api.tplModelList,
                api.groupList,
                api.workflowList,
                api.tplSelectContentModel
            ],
        },
        {
            name: '保存',
            role: '/channel/save',
            api: [api.channelSave, api.channelCheckPath],
        },
        {
            name: '保存排序',
            role: '/channel/savePriority',
            api: [api.channelPriority],
        },
        {
            name: '修改',
            role: '/channel/update',
            api: [api.channelUpdate, api.channelCheckPath],
        },
        {
            name: '删除',
            role: '/channel/delete',
            api: [api.channelDelete],
        },
        {
            name: '复制',
            role: '/channel/copy',
            api: [api.channelCopy],
        },
    ]
},
{
    name: '数据中心',
    role: '/dataCenter',
    children: [
        {
            name: '流量分析',
            role: '/traffic',
            api: [],
            children: [
                {
                    name: '趋势分析',
                    role: '/traffic/trend',
                    api: [api.flowPvList]
                },
                {
                    name: '栏目访问量排行',
                    role: '/traffic/channel',
                    api: [api.statisticChannelList]
                }
            ]
        },
        {
            name: '来源分析',
            role: '/sourceanalysis',
            api: [],
            children: [
                {
                    name: '来源分类',
                    role: '/sourceanalysis/class',
                    api: [api.flowSourceList]
                },
                {
                    name: '搜索引擎',
                    role: '/sourceanalysis/engin',
                    api: [api.flowSourceList]
                },
                {
                    name: '来访域名',
                    role: '/sourceanalysis/domain',
                    api: [api.flowSourceList]
                },
                {
                    name: '来访地区',
                    role: '/sourceanalysis/city',
                    api: [api.flowAreaList]
                },
                {
                    name: '搜索词',
                    role: '/sourceanalysis/keywords',
                    api: [api.flowSourceList]
                }
            ]
        },
        {
            name: '受访分析',
            role: '/surveyedanalysis',
            api: [],
            children: [
                {
                    name: '受访页面',
                    role: '/surveyedanalysis/surveyed',
                    api: [api.flowPagesList]
                },
                {
                    name: '路口页面',
                    role: '/surveyedanalysis/index',
                    api: [api.flowEnterpageList]
                }
            ]
        },
        {
            name: '忠诚度',
            role: '/loyalty',
            api: [api.flowVisitorList],
        },
        {
            name: '网站概况',
            role: '/siteProfile',
            api: [],
            children: [
                {
                    name: '内容发布数',
                    role: '/siteProfile/contentnum',
                    api: [api.statisticContentList, api.statisticContentList, api.fullTextSearchChannelList]
                },
                {
                    name: '工作量',
                    role: '/siteProfile/worknum',
                    api: [api.statisticWorkloadList, api.statisticContentList, api.fullTextSearchChannelList,api.localAll]
                },
                {
                    name: '评论量',
                    role: '/siteProfile/commentnum',
                    api: [api.statisticCommentList]
                },
                {
                    name: '留言量',
                    role: '/siteProfile/leavenum',
                    api: [api.statisticGuestbookList]
                },
                {
                    name: '会员注册量',
                    role: '/web/usernum',
                    api: [api.statisticMemberList]
                }
            ]
        },
    ]
},
{
    name: '用户管理',
    role: '/userManager',
    children: [{
        name: '会员管理',
        role: '/user',
        api: [api.memberGet,
        api.groupList],
        children: [{
            name: '会员列表',
            role: '/user/list',
            api: [api.memberList]
        }, {
            name: '添加',
            role: '/user/save',
            api: [api.memberSave]
        }, {
            name: '删除',
            role: '/user/delete',
            api: [api.memberDelete]
        }, {
            name: '修改',
            role: '/user/update',
            api: [api.memberUpdate]
        }, {
            name: '审核',
            role: '/user/check',
            api: [api.memberCheck]
        }]
    }, {
        name: '第三方账户绑定',
        role: '/account',
        children: [{
            name: '列表',
            role: '/account/list',
            api: [api.accountList]
        }, {
            name: '删除',
            role: '/account/delete',
            api: [api.accountDelete]
        }]
    }, {
        name: '管理员（全站）',
        role: '/adminGlobal',
        api: [
            api.adminGlobleList,
            api.adminGlobleGet,
            api.departmentList,
            api.adminValRank,
            api.roleList,
            api.siteList,
            api.groupList
        ],
        children: [{
            name: '列表',
            role: '/adminGlobal/list',
            api: [
                api.adminGlobleList,
            ]
        }, {
            name: '删除',
            role: '/adminGlobal/delete',
            api: [api.adminGlobleDelete]
        }, {
            name: '修改',
            role: '/adminGlobal/edit',
            api: [api.adminGlobleUpdate,api.adminGlobleGet]
        }, {
            name: '添加',
            role: '/adminGlobal/add',
            api: [api.adminGlobleSave,api.adminGlobleGet]
        }]
    }, {
        name: '管理员（本站）',
        role: '/adminGlocal',
        api: [
            api.adminGlocalList,
            api.adminGlocalGet,
            api.departmentList,
            api.adminValRank,
            api.roleList,
            api.siteList,
            api.groupList
        ],
        children: [{
            name: '列表',
            role: '/adminGlocal/list',
            api: [
                api.adminGlocalList,
            ]
        }, {
            name: '删除',
            role: '/adminGlocal/delete',
            api: [api.adminGlocalDelete]
        }, {
            name: '修改',
            role: '/adminGlocal/edit',
            api: [api.adminGlocalUpdate]
        }, {
            name: '添加',
            role: '/adminGlocal/add',
            api: [api.adminGlocalSave]
        }]
    }, {
        name: '操作日志',
        role: '/log',
        api: [
            api.logList,
        ],
        children: [{
            name: '列表',
            role: '/log/list',
            api: [
                api.logList,
            ]
        }]
    }, {
        name: '会员组管理',
        role: '/group',
        api: [
            api.groupList,
        ],
        children: [{
            name: '列表',
            role: '/group/list',
            api: [api.groupList]
        }, {
            name: '添加',
            role: '/group/add',
            api: [api.groupSave]
        }, {
            name: '修改',
            role: '/group/edit',
            api: [api.groupUpdate]
        }, {
            name: '删除',
            role: '/group/delete',
            api: [api.groupDelete]
        }]
    },  {
        name: '站内信管理',
        role: '/message',
        api: [
            api.messageList, api.memberCheckName
        ],
        children: [{
            name: '列表',
            role: '/message/list',
            api: [api.messageList]
        }, {
            name: '发送',
            role: '/message/add',
            api: [api.messageSend,api.messageGet]
        }, {
            name: '查看',
            role: '/message/seek',
            api: [api.messageRead]
        }, {
            name: '回复',
            role: '/message/reply',
            api: [api.messageSend, api.messageReply]
        }, {
            name: '转发',
            role: '/message/forward',
            api: [api.messageSend, api.messageForward]
        }, {
            name: '还原',
            role: '/message/revert',
            api: [api.messageRevert]
        }, {
            name: '删除',
            role: '/message/delete',
            api: [api.messageTrash]
        }, {
            name: '彻底删除',
            role: '/message/deletes',
            api: [api.messageEmpty]
        }]
    }, {
        name: '角色管理',
        role: '/role',
        api: [
            api.roleList,
        ],
        children: [{
            name: '列表',
            role: '/role/list',
            api: [api.roleList]
        }, {
            name: '详情',
            role: '/role/get',
            api: [api.roleGet]
        }, {
            name: '添加',
            role: '/role/save',
            api: [api.roleSave]
        }, {
            name: '更改',
            role: '/role/update',
            api: [api.roleUpdate]
        }, {
            name: '删除',
            role: '/role/roleDelete',
            api: [api.roleDelete]
        }, {
            name: '成员列表',
            role: '/role/members',
            api: [api.roleMembers]
        }, {
            name: '成员移除',
            role: '/role/roleMembersDelete',
            api: [api.roleMembers, api.roleMembersDelete]
        }]
    }]
},
{
    name: '运营',
    role: '/operate',
    children: [
      
        {
            name: '友情链接',
            role: '/link',
            api: [api.workflowList],
            children: [
                {
                    name: '列表',
                    role: '/link/list',
                    api: [api.linkList, api.linkTypeList]
                },
                {
                    name: '详情',
                    role: '/link/get',
                    api: [api.linkGet, api.linkTypeList]
                },
                {
                    name: '添加',
                    role: '/link/save',
                    api: [api.linkSave,]
                },
                {
                    name: '修改',
                    role: '/link/update',
                    api: [api.linkUpdate]
                },
                {
                    name: '删除',
                    role: '/link/delete',
                    api: [api.linkDelete]
                },
                {
                    name: '保存排序',
                    role: '/link/priority',
                    api: [api.linkPriority]
                },
                {
                    name: '友情链接类别列表',
                    role: '/linkType/list',
                    api: [api.linkTypeList]
                },
                {
                    name: '友情链接类别添加',
                    role: '/linkType/save',
                    api: [api.linkTypeSave,]
                },
                {
                    name: '友情链接类别修改',
                    role: '/linkType/update',
                    api: [api.linkTypeUpdate]
                },
                {
                    name: '友情链接类别删除',
                    role: '/linkType/delete',
                    api: [api.linkTypeDelete]
                },
            ]
        },
        {
            name: '广告管理',
            role: '/ad',
            api: [api.adList],
            children: [
                {
                    name: '列表',
                    role: '/ad/list',
                    api: [api.adList]
                },
                {
                    name: '详情',
                    role: '/ad/get',
                    api: [api.adGet, api.adSpaceList]
                },
                {
                    name: '添加',
                    role: '/ad/save',
                    api: [api.adSave,]
                },
                {
                    name: '修改',
                    role: '/ad/update',
                    api: [api.adUpdate]
                },
                {
                    name: '删除',
                    role: '/ad/delete',
                    api: [api.adDelete]
                },
                {
                    name: '广告版位列表',
                    role: '/adSpace/list',
                    api: [api.adSpaceList]
                },
                {
                    name: '广告版位添加',
                    role: '/adSpace/save',
                    api: [api.adSpaceSave,]
                },
                {
                    name: '广告版位详情',
                    role: '/adSpace/get',
                    api: [api.adSpaceGet]
                },
                {
                    name: '广告版位修改',
                    role: '/adSpace/update',
                    api: [api.adSpaceUpdate]
                },
                {
                    name: '广告版位删除',
                    role: '/adSpace/delete',
                    api: [api.adSpaceDelete]
                },
            ]
        },
       
        {
            name: '内容购买记录',
            role: '/contentBuy',
            api: [api.contentBuyUserOrderList],
            children: [
                {
                    name: '列表',
                    role: '/contentBuy/list',
                    api: [api.contentBuyUserOrderList]
                }
            ]
        },
        {
            name: '用户账户统计',
            role: '/userAccount',
            api: [api.contentBuyUserAccountList],
            children: [
                {
                    name: '列表',
                    role: '/userAccount/list',
                    api: [api.contentBuyUserAccountList]
                }
            ]
        },
        {
            name: '内容收费统计',
            role: '/charge',
            api: [api.contentBuyChargeList],
            children: [
                {
                    name: '列表',
                    role: '/charge/list',
                    api: [api.contentBuyChargeList]
                },
                {
                    name: '平台佣金所得统计',
                    role: '/charge/commission',
                    api: [api.contentBuyCommissionStatic]
                }
            ]
        },
        {
            name: '转账管理',
            role: '/accountPay',
            api: [api.accountPayList],
            children: [
                {
                    name: '列表',
                    role: '/accountPay/list',
                    api: [api.accountPayList]
                },
                {
                    name: '删除',
                    role: '/accountPay/delete',
                    api: [api.accountPayDelete]
                }
            ]
        },
        {
            name: '提现管理',
            role: '/drawApply',
            api: [api.accountPayDrawApplyList],
            children: [
                {
                    name: '列表',
                    role: '/drawApply/list',
                    api: [api.accountPayDrawApplyList]
                },
                {
                    name: '审核/退回',
                    role: '/drawApply/check',
                    api: [api.accountPayDrawApplyCheck]
                },
                {
                    name: '删除',
                    role: '/drawApply/delete',
                    api: [api.accountPayDrawApplyDelete]
                },
                {
                    name: '转账',
                    role: '/drawApply/traAccount',
                    api: [api.accountPayPayByWXGet, api.accountPayPayByWX]
                }
            ]
        },
        {
            name: '职位申请',
            role: '/job',
            api: [api.jobapplyList],
            children: [
                {
                    name: '列表',
                    role: '/job/list',
                    api: [api.jobapplyList]
                },
                {
                    name: '删除',
                    role: '/job/delete',
                    api: [api.jobapplyDelete]
                },
                {
                    name: '查看简历',
                    role: '/job/seek',
                    api: [api.jobapplyView,]
                },
            ]
        },
        {
            name: '数据备份',
            role: '/db',
            api: [],
            children: [
                {
                    name: '备份',
                    role: '/backups',
                    api:
                        [
                            api.frameGetDB,
                            api.mysqlDataList,
                            api.oracleDataList,
                            api.sqlserverDataList,
                            api.db2DataList,
                            api.mysqDataListfields,
                            api.mysqlDataBackup,
                            api.oracleDataBackup,
                            api.sqlserverDataBackup,
                            api.db2DataBackup
                        ],
                    children: [
                        {
                            name: '列表',
                            role: '/backups/list',
                            api: [],
                        },
                        {
                            name: '查看',
                            role: '/backups/seek',
                            api:
                                [
                                    api.db2DataList,
                                    api.mysqlDataListfields,
                                    api.sqlserverDataListfields,
                                    api.db2DataListfields,
                                    api.oracleDataListfields,
                                ],
                        },
                    ]


                },
                {
                    name: '恢复',
                    role: '/revert',
                    api: [api.frameGetDB, api.mysqlDataList, api.oracleDataList, api.sqlserverDataList, api.db2DataList,
                    api.mysqlDataFiles, api.oracleDataFiles, api.sqlserverDataFiles, api.db2DataFiles,
                    api.mysqlDataListDataBases, api.sqlserverDataListDataBases,
                    api.mysqlDataRevert, api.oracleDataRevert, api.sqlserverDataRevert, api.db2DataRevert,
                    api.mysqlDataDefaultCatalog, api.sqlserverDataDefaultCatalog
                    ]
                },
                {
                    name: '备份列表',
                    role: '/backupsDir',
                    api: [api.frameGetDB, api.mysqlDataFiles, api.oracleDataFiles, api.sqlserverDataFiles, api.db2DataFiles],
                    children: [
                        {
                            name: '列表',
                            role: '/backupsDir/list',
                            api: [],
                        },
                        {
                            name: '删除',
                            role: '/backupsDir/delete',
                            api: [api.mysqlDataDelete, api.oracleDataDelete, api.sqlserverDataDelete, api.db2DataDelete],
                        },
                        {
                            name: '下载',
                            role: '/backupsDir/download',
                            api: [api.mysqlDataExport, api.oracleDataExport, api.sqlserverDataExport, api.db2DataExport],
                        },
                        {
                            name: '重命名',
                            role: '/backupsDir/rename',
                            api: [api.mysqlDataRename, api.oracleDataRename, api.sqlserverDataRename, api.db2DataRename],
                        }
                    ]

                },
            ]
        },

        {
            name: '页面静态化',
            role: '/statically',
            api: [],
            children: [
                {
                    name: '首页生成静态化',
                    role: '/statically/indexStatic',
                    api: [api.staticIndex]
                },
                {
                    name: '首页删除静态化',
                    role: '/statically/indexDel',
                    api: [api.staticIndexRemove]
                },
                {
                    name: '栏目静态化',
                    role: '/statically/channelStatic',
                    api: [api.staticChannel, api.fullTextSearchChannelList, api.staticChannel]
                },
                {
                    name: '内容静态化',
                    role: '/statically/contentStatic',
                    api: [api.staticContent, api.staticContent, api.fullTextSearchChannelList]
                },
            ]
        },
        {
            name: '评论管理',
            role: '/comment',
            api: [api.commentList],
            children: [
                {
                    name: '列表',
                    role: '/comment/list',
                    api: [api.commentList]
                },
                {
                    name: '查看',
                    role: '/comment/itemList',
                    api: [api.commentItemList]
                },
                {
                    name: '审核',
                    role: '/comment/aduit',
                    api: [api.commentCheck,]
                },
                {
                    name: '修改评论',
                    role: '/comment/updateComment',
                    api: [api.commentUpdate]
                },
                {
                    name: '回复',
                    role: '/comment/reply',
                    api: [api.commentReply]
                },
                {
                    name: '修改回复',
                    role: '/comment/updatereply',
                    api: [api.commentReply]
                },
                {
                    name: '推荐',
                    role: '/comment/reCommend',
                    api: [api.commentRecommend]
                },
                {
                    name: '删除',
                    role: '/comment/delete',
                    api: [api.commentDelete]
                }
            ]
        },
        {
            name: '问卷调查',
            role: '/vote',
            api: [api.voteList],
            children: [
                {
                    name: '列表',
                    role: '/vote/list',
                    api: [api.voteList]
                },
                {
                    name: '保存内容',
                    role: '/vote/saveContent',
                    api: [api.voteSaveContent]
                },
                {
                    name: '详情',
                    role: '/vote/view',
                    api: [api.voteGet]
                },
                {
                    name: '添加',
                    role: '/vote/save',
                    api: [api.voteSave,]
                },
                {
                    name: '修改',
                    role: '/vote/updateComment',
                    api: [api.voteupdate]
                },
                {
                    name: '删除',
                    role: '/vote/delete',
                    api: [api.voteDelete]
                },
            ]
        },
        {
            name: '留言管理',
            role: '/guestbook',
            api: [api.guestbookList],
            children: [
                {
                    name: '列表',
                    role: '/guestbook/list',
                    api: [api.guestbookList]
                },
                {
                    name: '添加',
                    role: '/guestbook/add',
                    api: [api.guestbookSave]
                },
                {
                    name: '审核',
                    role: '/guestbook/check',
                    api: [api.guestbookCheck]
                },
                {
                    name: '修改留言/回复',
                    role: '/guestbook/update',
                    api: [api.guestbookUpdate]
                },
                {
                    name: '推荐/取消推荐',
                    role: '/guestbook/reCommend',
                    api: [api.guestbookRecommend,]
                },
                {
                    name: '删除',
                    role: '/guestbook/delete',
                    api: [api.guestbookDelete]
                },
                {
                    name: '查看留言类别',
                    role: '/guestbookType/list',
                    api: [api.guestbookTypeList]
                },
                {
                    name: '留言类别新增',
                    role: '/guestbookType/add',
                    api: [api.guestbookTypeSave]
                },
                {
                    name: '留言类别修改',
                    role: '/guestbookType/update',
                    api: [api.guestbookTypeUpdate]
                },
                {
                    name: '留言类别删除',
                    role: '/guestbookType/delete',
                    api: [api.guestbookTypeDelete]
                },
            ]
        },
        {
            name: '公众号设置',
            role: '/weixin',
            children: [
                {
                    name: '公众号设置',
                    role: '/weixinConfig',
                    api: [api.weixinGet, api.weixinConfig]
                },
                {
                    name: '默认回复',
                    role: '/weixinMessageDef',
                    api: [api.weixinMessageDefaultGet, api.weixinMessageUpdate]
                },
                {
                    name: '自定义菜单',
                    role: '/weixinMenu',
                    api: [api.weixinMenuList],
                    children: [
                        {
                            name: '列表',
                            role: '/weixinMenu/list',
                            api: [api.weixinMenuList]
                        },
                        {
                            name: '详情',
                            role: '/weixinMenu/get',
                            api: [api.weixinMenuGet]
                        },
                        {
                            name: '添加',
                            role: '/weixinMenu/add',
                            api: [api.weixinMenuSave]
                        },
                        {
                            name: '修改',
                            role: '/weixinMenu/edit',
                            api: [api.weixinMenuUpdate]
                        },
                        {
                            name: '删除',
                            role: '/weixinMenu/delete',
                            api: [api.weixinMenuDelete]
                        },
                        {
                            name: '自定义菜单二级菜单',
                            role: '/weixinMenu/child',
                            api: [api.weixinMenuList],
                            children: [
                                {
                                    name: '列表',
                                    role: '/weixinMenu/child/list',
                                    api: [api.weixinMenuList]
                                },
                                {
                                    name: '添加',
                                    role: '/weixinMenu/child/add',
                                    api: [api.weixinMenuSave, api.weixinMenuGet]
                                },
                                {
                                    name: '修改',
                                    role: '/weixinMenu/child/edit',
                                    api: [api.weixinMenuUpdate, api.weixinMenuGet]
                                },
                                {
                                    name: '删除',
                                    role: '/weixinMenu/child/delete',
                                    api: [api.weixinMenuDelete]
                                },
                            ]
                        },
                    ]
                },
                {
                    name: '自定义回复',
                    role: '/weixinMessage',
                    api: [api.weixinMessageList],
                    children: [
                        {
                            name: '列表',
                            role: '/weixinMessage/list',
                            api: [api.weixinMessageList, api.weixinMenuOMenu]
                        },
                        {
                            name: '详情',
                            role: '/weixinMessage/get',
                            api: [api.weixinMessageGet]
                        },
                        {
                            name: '添加',
                            role: '/weixinMessage/add',
                            api: [api.weixinMessageSave]
                        },
                        {
                            name: '修改',
                            role: '/weixinMessage/edit',
                            api: [api.weixinMessageUpdate]
                        },
                        {
                            name: '删除',
                            role: '/weixinMessage/delete',
                            api: [api.weixinMessageDelete]
                        },
                    ]
                },
            ]
        },
        {
            name: '采集管理',
            role: '/collection',
            children: [
                {
                    name: '采集列表',
                    role: '/collectionmanage',
                    api: [api.collectList],
                    children: [
                        {
                            name: '列表',
                            role: '/collectionmanage/list',
                            api: [api.collectList]
                        },
                        {
                            name: '添加',
                            role: '/collectionmanage/save',
                            api: [api.collectSave]
                        },
                        {
                            name: '详情',
                            role: '/collectionmanage/get',
                            api: [api.collectGet]
                        },
                        {
                            name: '修改',
                            role: '/collectionmanage/update',
                            api: [api.collectUpdate]
                        },
                        {
                            name: '删除',
                            role: '/collectionmanage/delete',
                            api: [api.collectDelete]
                        },
                        {
                            name: '开始',
                            role: '/collectionmanage/start',
                            api: [api.collectStart]
                        },
                        {
                            name: '暂停',
                            role: '/collectionmanage/suspend',
                            api: [api.collectPause]
                        },
                        {
                            name: '停止',
                            role: '/collectionmanage/stop',
                            api: [api.collectEnd]
                        },
                    ]
                },
                {
                    name: '采集历史记录',
                    role: '/collectionhistory',
                    api: [api.collectHistoryLIst],
                    children: [
                        {
                            name: '列表',
                            role: '/collectionhistory/list',
                            api: [api.collectHistoryLIst]
                        },
                        {
                            name: '删除',
                            role: '/collectionhistory/delete',
                            api: [api.collectHistoryDelete]
                        },
                    ]
                },
                {
                    name: '采集进度查看',
                    role: '/collectionspeed/view',
                    api: [api.collectSpeedData]
                },
            ]
        },
    ]
},
{
    name: '辅助',
    role: '/help',
    children: [
        {
            name: '生成索引',
            role: '/fullTextSearch',
            api: [api.fullTextSearchChannelList],
            children: [
                {
                    name: '生成索引',
                    role: '/fullTextSearch/createIndex',
                    api: [api.fullTextSearchCreate]
                }]
        },
        {
            name: '字典',
            role: '/dictionary',
            api: [api.dictionaryList],
            children: [
                {
                    name: '列表',
                    role: '/dictionary/list',
                    api: [api.dictionaryList]
                },
                {
                    name: '删除',
                    role: '/dictionary/delete',
                    api: [api.dictionaryDelete]
                },
                {
                    name: '添加',
                    role: '/dictionary/add',
                    api: [api.dictionarySave, api.dictionaryCheckValue]
                },
                {
                    name: '详情',
                    role: '/dictionary/get',
                    api: [api.dictionaryGet,]
                },
                {
                    name: '修改',
                    role: '/dictionary/update',
                    api: [api.dictionaryUpdate, api.dictionaryCheckValue]
                }
            ]
        },
        {
            name: '内容回收站',
            role: '/contentCycle',
            api: [api.contentList],
            children: [
                {
                    name: '列表',
                    role: '/contentCycle/list',
                    api: [api.contentList]
                },
                {
                    name: '删除',
                    role: '/contentCycle/delete',
                    api: [api.contentCycleDelete]
                },
                {
                    name: '还原',
                    role: '/contentCycle/Recycle',
                    api: [api.contentCycleRecycle]
                },
            ]
        },
        {
            name: '定时任务',
            role: '/crontab',
            api: [api.crontabList],
            children: [
                {
                    name: '列表',
                    role: '/crontab/list',
                    api: [api.crontabList]
                },
                {
                    name: '详情',
                    role: '/crontab/get',
                    api: [api.crontabGet]
                },
                {
                    name: '添加',
                    role: '/crontab/save',
                    api: [api.crontabSave, api.fullTextSearchChannelList, api.ftpList, api.acquisitionList]
                },
                {
                    name: '修改',
                    role: '/crontab/update',
                    api: [api.crontabUpdate, api.fullTextSearchChannelList, api.ftpList, api.acquisitionList]
                },
                {
                    name: '删除',
                    role: '/crontab/delete',
                    api: [api.crontabDelete]
                },
            ]
        },

        {
            name: '附件管理',
            role: '/file',
            api: [api.fileList,
                api.siteConfigGet],
            children: [
                {
                    name: '列表',
                    role: '/file/list',
                    api: [api.adList]
                },
                {
                    name: '删除',
                    role: '/file/delete',
                    api: [api.fileDelete]
                },
                {
                    name: '删除所有失效文件',
                    role: '/file/fileInvalid',
                    api: [api.fileInvalid,]
                },
                {
                    name: '标志原有附件有效',
                    role: '/file/fileEffective',
                    api: [api.fileEffective]
                }
            ]
        },

        {
            name:'二维码生成',
            role:'/dimensioncode',
            api: [api.dimensioncodeCreate],
            children:[
                {
                    name: '创建',
                    role: '/dimensioncode/create',
                    api: []    
                }
            ] 
         },
        {
            name: '评分组管理',
            role: '/scoregroup',
            api: [api.scoregroupList],
            children: [
                {
                    name: '列表',
                    role: '/scoregroup/list',
                    api: [api.scoregroupList]
                },
                {
                    name: '删除',
                    role: '/scoregroup/delete',
                    api: [api.scoregroupDelete]
                },
                {
                    name: '添加',
                    role: '/scoregroup/add',
                    api: [api.scoregroupSave]
                },
                {
                    name: '详情',
                    role: '/scoregroup/get',
                    api: [api.scoregroupGet,]
                },
                {
                    name: '修改',
                    role: '/scoregroup/update',
                    api: [api.scoregroupUpdate]
                },
                {
                    name: '评分项管理',
                    role: '/scoregroup/scoreitem',
                    api: [api.scoreitemList],
                    children: [
                        {
                            name: '列表',
                            role: '/scoregroup/scoreitem/list',
                            api: [api.scoreitemList]
                        },
                        {
                            name: '详情',
                            role: '/scoregroup/scoreitem/get',
                            api: [api.scoreitemGet]
                        },
                        {
                            name: '添加',
                            role: '/scoregroup/scoreitem/add',
                            api: [api.scoreitemSave]
                        },
                        {
                            name: '修改',
                            role: '/scoregroup/scoreitem/edit',
                            api: [api.scoreitemUpdate]
                        },
                        {
                            name: '删除',
                            role: '/scoregroup/scoreitem/delete',
                            api: [api.scoreitemDelete]
                        }
                    ]
                }
            ]
        },
        {
            name: '词汇管理',
            role: '/word',
            children: [
                {
                    name: 'tag管理',
                    role: '/word/tag',
                    api: [api.wordTagList],
                    children: [
                        {
                            name: '列表',
                            role: '/word/tag/list',
                            api: [api.wordTagList],
                        },
                        {
                            name: '详情',
                            role: '/word/tag/get',
                            api: [api.wordTagGet],
                        },
                        {
                            name: '添加',
                            role: '/word/tag/add',
                            api: [api.wordTagSave, api.wordTagCheckName],
                        },
                        {
                            name: '修改',
                            role: '/word/tag/edit',
                            api: [api.wordTagUpdate, api.wordTagCheckName],
                        },
                        {
                            name: '删除',
                            role: '/word/tag/delete',
                            api: [api.wordTagDelete],
                        }
                    ]
                },
                {
                    name: '敏感词管理',
                    role: '/word/sensitivity',
                    api: [api.wordSensitivityList],
                    children: [
                        {
                            name: '列表',
                            role: '/word/sensitivity/list',
                            api: [api.wordSensitivityList],
                        },
                        {
                            name: '详情',
                            role: '/word/sensitivity/get',
                            api: [api.wordSensitivityGet],
                        },
                        {
                            name: '添加',
                            role: '/word/sensitivity/add',
                            api: [api.wordSensitivitySave],
                        },
                        {
                            name: '修改',
                            role: '/word/sensitivity/edit',
                            api: [api.wordSensitivityUpdate],
                        },
                        {
                            name: '删除',
                            role: '/word/sensitivity/delete',
                            api: [api.wordSensitivityDelete],
                        }
                    ]
                },
                {
                    name: '关键词管理',
                    role: '/word/keyword',
                    api: [api.wordKeywordList],
                    children: [
                        {
                            name: '列表',
                            role: '/word/keyword/list',
                            api: [api.wordKeywordList],
                        },
                        {
                            name: '详情',
                            role: '/word/keyword/get',
                            api: [api.wordSensitivityGet],
                        },
                        {
                            name: '添加',
                            role: '/word/keyword/add',
                            api: [api.wordSensitivitySave],
                        },
                        {
                            name: '修改',
                            role: '/word/keyword/edit',
                            api: [api.wordSensitivityUpdate],
                        },
                        {
                            name: '删除',
                            role: '/word/keyword/delete',
                            api: [api.wordSensitivityDelete],
                        }
                    ]
                },
                {
                    name: '来源管理',
                    role: '/word/origin',
                    api: [api.wordOriginList],
                    children: [
                        {
                            name: '列表',
                            role: '/word/origin/list',
                            api: [api.wordOriginList],
                        },
                        {
                            name: '详情',
                            role: '/word/origin/get',
                            api: [api.wordOriginGet],
                        },
                        {
                            name: '添加',
                            role: '/word/origin/add',
                            api: [api.wordOriginSave],
                        },
                        {
                            name: '修改',
                            role: '/word/origin/edit',
                            api: [api.wordOriginUpdate],
                        },
                        {
                            name: '删除',
                            role: '/word/origin/delete',
                            api: [api.wordOriginDelete],
                        }
                    ]
                },
                {
                    name: '热词管理',
                    role: '/word/searchwords',
                    api: [api.wordSearchwordsList],
                    children: [
                        {
                            name: '列表',
                            role: '/word/searchwords/list',
                            api: [api.wordSearchwordsList],
                        },
                        {
                            name: '详情',
                            role: '/word/searchwords/get',
                            api: [api.wordSearchwordsGet],
                        },
                        {
                            name: '添加',
                            role: '/word/searchwords/add',
                            api: [api.wordSearchwordsSave],
                        },
                        {
                            name: '修改',
                            role: '/word/searchwords/edit',
                            api: [api.wordSearchwordsUpdate],
                        },
                        {
                            name: '删除',
                            role: '/word/searchwords/delete',
                            api: [api.wordSearchwordsDelete],
                        }
                    ]
                }
            ]
        },
    ]
},
{
    name: '界面',
    role: '/interface',
    children: [
        {
            name: '模板',
            role: '/template',
            api: ['/api/admin/template/tree', 
            
            '/api/admin/template/getSolutions', 
            '/api/admin/template/solutionupdate',
             '/api/admin/template/get',
             '/template/mange' ],
            children: [
                {
                    name: '列表',
                    role: '/templatelist',
                    api: ['/api/admin/template/list']
                },
                {
                    name: '删除',
                    role: '/templatedelete',
                    api: ['/api/admin/template/delete']
                },
                {
                    name: '重命名',
                    role: '/templaterename',
                    api: ['/api/admin/template/rename']
                },
                {
                    name: '修改',
                    role: '/templateedit',
                    api: ['/api/admin/template/update']
                },
                {
                    name: '新建文件/文件夹',
                    role: 'templateadd',
                    api: ['api/admin/template/dir_save']
                },
                {
                    name: '保存',
                    role: '/templatesave',
                    api: ['/api/admin/template/save']
                }
            ]
        },
        {
            name: '资源',
            role: '/resource',
            api: ['/api/admin/resource/tree', '/api/admin/resource/get',
            '/resource/mange' ],
            children: [
                {
                    name: '列表',
                    role: '/resourcelist',
                    api: ['/api/admin/resource/list']
                },
                {
                    name: '删除',
                    role: '/resourcedelete',
                    api: ['/api/admin/resource/delete']
                },
                {
                    name: '重命名',
                    role: '/resourcerename',
                    api: ['/api/admin/resource/rename']
                },
                {
                    name: '修改',
                    role: '/resourceedit',
                    api: ['/api/admin/template/update']
                },
                {
                    name: '新建文件/文件夹',
                    role: '/resourceadd',
                    api: ['api/admin/resource/dir_save']
                },
                {
                    name: '保存',
                    role: '/resourcesave',
                    api: ['/api/admin/resource/save']
                }
            ]
        },
    ]
},
{
    name: '配置',
    role: '/config',
    children: [{
        name: '站点设置',
        role: '/siteConfig',
        api:
            [
                api.siteConfigGet,
                api.ftpList,
                api.ossList,
                api.tplList,
                api.siteCheckMaster,
                api.siteCheckDomain,
                api.siteCheckAccessPath
            ],
        children: [
            {
                name: '详情',
                role: '/siteConfig/get',
                api: [api.siteConfigGet, api.configGet]
            }, {
                name: '修改',
                role: '/siteConfig/edit',
                api: [api.siteConfigUpdate]
            }]
    }, {
        name: 'ftp管理',
        role: '/ftp',
        api: [api.ftpList],
        children: [
            {
                name: '列表',
                role: '/ftp/list',
                api: [api.ftpList]
            }, {
                name: '详情',
                role: '/ftp/get',
                api: [api.ftpGet]
            }, {
                name: '编辑',
                role: '/ftp/edit',
                api: [api.ftpUpdate]
            }, {
                name: '删除',
                role: '/ftp/delete',
                api: [api.ftpDelete]
            }]
    }, {
        name: 'oss管理',
        role: '/oss',
        api: [api.ossList],
        children: [
            {
                name: '列表',
                role: '/oss/list',
                api: [api.ossList]
            }, {
                name: '详情',
                role: '/oss/get',
                api: [api.ossGet]
            }, {
                name: '编辑',
                role: '/oss/edit',
                api: [api.ossUpdate]
            }, {
                name: '添加',
                role: '/oss/add',
                api: [api.ossSave]
            }, {
                name: '删除',
                role: '/oss/delete',
                api: [api.ossDelete]
            }]
    }, {
        name: '内容类型',
        role: '/type',
        api: [api.typeList],
        children: [
            {
                name: '列表',
                role: '/type/list',
                api: [api.typeList]
            }, {
                name: '详情',
                role: '/type/get',
                api: [api.typeGet]
            }, {
                name: '编辑',
                role: '/type/edit',
                api: [api.typeUpdate]
            }, {
                name: '添加',
                role: '/type/add',
                api: [api.typeSave, api.typeCheckId]
            }, {
                name: '删除',
                role: '/type/delete',
                api: [api.typeDelete]
            }]
    }, {
        name: '模型管理',
        role: '/model',
        api: [api.modelList],
        children: [
            {
                name: '列表',
                role: '/model/list',
                api: [api.modelList]
            },
            {
                name: '详情',
                role: '/model/get',
                api: [api.modelGet]
            },
            {
                name: '编辑',
                role: '/model/edit',
                api: [api.modelUpdate, api.modelPriority]
            },
            {
                name: '添加',
                role: '/model/add',
                api: [api.modelSave, api.modelCheckId]
            },
            {
                name: '删除',
                role: '/model/delete',
                api: [api.modelDelete]
            },
            {
                name: '保存排序',
                role: '/model/priority',
                api: [api.modelPriority]
            },
            {
                name: '栏目模型',
                role: '/channelModel',
                api: [api.itemList],
                children: [
                    {
                        name: '列表',
                        role: '/channelModel/list',
                        api: [api.itemList]
                    },
                    {
                        name: '详情',
                        role: '/channelModel/get',
                        api: [api.typeCheckId, api.itemGet]
                    },
                    {
                        name: '保存默认选中字段',
                        role: '/channelModel/save',
                        api: [api.itemListSave]
                    },
                    {
                        name: '添加',
                        role: '/channelModel/add',
                        api: [api.itemSave]
                    },
                    {
                        name: '修改',
                        role: '/channelModel/update',
                        api: [api.itemUpdate]
                    },
                    {
                        name: '删除',
                        role: '/channelModel/delete',
                        api: [api.itemDelete]
                    },
                    {
                        name: '保存内容',
                        role: '/channelModel/savePriority',
                        api: [api.itemPriority]
                    },
                ]
            },
            {
                name: '内容模型',
                role: '/contentModel',
                api: [api.itemList],
                children: [
                    {
                        name: '列表',
                        role: '/contentModel/list',
                        api: [api.itemList]
                    },
                    {
                        name: '详情',
                        role: '/contentModel/get',
                        api: [api.typeCheckId, api.itemGet]
                    },
                    {
                        name: '保存默认选中字段',
                        role: '/contentModel/save',
                        api: [api.itemListSave]
                    },
                    {
                        name: '添加',
                        role: '/contentModel/add',
                        api: [api.itemSave]
                    },
                    {
                        name: '修改',
                        role: '/contentModel/update',
                        api: [api.itemUpdate]
                    },
                    {
                        name: '删除',
                        role: '/contentModel/delete',
                        api: [api.itemDelete]
                    },
                    {
                        name: '保存内容',
                        role: '/contentModel/savePriority',
                        api: [api.itemPriority]
                    },
                ]
            },
        ]
    }, {
        name: '全局设置',
        role: '/globel',
        children: [
            {
                name: '系统设置',
                role: '/globel/systemUpdate',
                api: [api.configGet, api.configSystemUpdate]
            }, {
                name: '登录设置',
                role: '/globel/loginUpdate',
                api: [api.configLoginGet, api.configLoginUpdate]
            }, {
                name: '会员设置',
                role: '/globel/memberUpdate',
                api: [api.configMemberGet, api.configMemberUpdate]
            }, {
                name: '会员注册模型',
                role: '/globel/registerModel',
                api: [api.configRegisterItemList],
                children: [
                    {
                        name: '列表',
                        role: '/globel/registerModel/list',
                        api: [api.configGet, api.configSystemUpdate]
                    }, {
                        name: '详情',
                        role: '/globel/registerModel/get',
                        api: [api.configRegisterItemGet]
                    }, {
                        name: '添加',
                        role: '/globel/registerModel/add',
                        api: [api.configRegisterItemSave]
                    }, {
                        name: '修改',
                        role: '/globel/registerModel/edit',
                        api: [api.configRegisterItemUpdate]
                    }, {
                        name: '删除',
                        role: '/globel/registerModel/delete',
                        api: [api.configRegisterItemDelete]
                    }, {
                        name: '保存排序',
                        role: '/globel/registerModel/savePriority',
                        api: [api.configRegisterItemPriority]
                    }

                ]
            }, {
                name: '水印设置',
                role: '/globel/markUpdate',
                api: [api.configMarkGet, api.configMarkUpdate]
            }, {
                name: '网站防火墙配置',
                role: '/globel/firewallUpdate',
                api: [api.configFirewallGet, api.configFirewallUpdate]
            }, {
                name: '其他配置',
                role: '/globel/attrUpdate',
                api: [api.configAttrGet, api.configAttrUpdate, api.configAttrClear]
            }, {
                name: '机构信息设置',
                role: '/globel/companyUpdate',
                api: [api.configCompanyGet, api.configCompanyUpdate, api.dictionaryType]
            }, {
                name: '内容佣金配置',
                role: '/globel/contentUpdate',
                api: [api.configContentGet, api.configContentUpdate]
            }
        ]
    }, {
        name: '站点管理',
        role: '/site',
        api: [api.siteList, api.siteTree, api.siteCheckMaster, api.siteCheckAccessPath, api.siteCheckDomain],
        children: [
            {
                name: '列表',
                role: '/site/list',
                api:
                    [
                        api.siteList,
                        api.listUrl,
                        api.configGet,
                        api.siteGet,
                        api.ftpList,
                        api.ossList,
                        api.tplList
                    ]
            },
            {
                name: '详情',
                role: '/site/get',
                api: [api.siteGet]
            },
            {
                name: '添加',
                role: '/site/add',
                api: [api.siteSave, api.siteGet]
            },
            {
                name: '修改',
                role: '/site/edit',
                api: [api.siteUpdate]
            },
            {
                name: '删除',
                role: '/site/delete',
                api: [api.siteDelete]
            }
        ]
    }, {
        name: '接口管理',
        role: '/apiManage',
        api: [],
        children: [
            {
                name: '接口设置',
                role: '/apiManage/apiUpdate',
                api: [api.apiGet, api.apiUpdate]
            }, {
                name: '单点登录认证',
                role: '/apiManage/apiSSOupdate',
                api: [api.apiSSOGet, api.apiSSOUpdate]
            }, {
                name: '接口管理',
                role: '/apiManage/apiMan',
                api: [api.apiWebserviceList],
                children: [{
                    name: '列表',
                    role: '/apiManage/apiMan/list',
                    api: [api.apiWebserviceList]
                }, {
                    name: '详情',
                    role: '/apiManage/apiMan/get',
                    api: [api.apiWebserviceGet]
                }, {
                    name: '添加',
                    role: '/apiManage/apiMan/add',
                    api: [api.apiWebserviceSave]
                }, {
                    name: '修改',
                    role: '/apiManage/apiMan/edit',
                    api: [api.apiWebserviceUpdate]
                }, {
                    name: '删除',
                    role: '/apiManage/apiMan/delete',
                    api: [api.apiWebserviceDelete]
                }]
            }, {
                name: '接口用户管理',
                role: '/apiManage/apiUserMan',
                api: [api.apiWebserviceAuthList],
                children: [{
                    name: '列表',
                    role: '/apiManage/apiUserMan/list',
                    api: [api.apiWebserviceAuthList]
                }, {
                    name: '详情',
                    role: '/apiManage/apiUserMan/get',
                    api: [api.apiWebserviceAuthGet]
                }, {
                    name: '添加',
                    role: '/apiManage/apiUserMan/add',
                    api: [api.apiWebserviceAuthSave]
                }, {
                    name: '修改',
                    role: '/apiManage/apiUserMan/edit',
                    api: [api.apiWebserviceAuthUpdate]
                }, {
                    name: '删除',
                    role: '/apiManage/apiUserMan/delete',
                    api: [api.apiWebserviceAuthDelete]
                }]
            }, {
                name: '接口调用记录',
                role: '/apiManage/apiUseRecord',
                api: [api.apiWebserviceRecordList],
                children: [{
                    name: '列表',
                    role: '/apiManage/apiUseRecord/list',
                    api: [api.apiWebserviceRecordList]
                }, {
                    name: '删除',
                    role: '/apiManage/apiUseRecord/delete',
                    api: [api.apiWebserviceRecordDelete]
                }]
            }, {
                name: 'API接口记录',
                role: '/apiManage/apiRecord',
                api: [api.apiRecordList],
                children: [{
                    name: '列表',
                    role: '/apiManage/apiRecord/list',
                    api: [api.apiRecordList]
                }, {
                    name: '删除',
                    role: '/apiManage/apiRecord/delete',
                    api: [api.apiRecordDelete]
                }]
            },
            {
                name: 'API接口管理',
                role: '/apiManage/apiInfo',
                api: [api.apiInfoList],
                children:
                    [
                        {
                            name: '列表',
                            role: '/apiManage/apiInfo/list',
                            api: [api.apiInfoList]
                        }, {
                            name: '详情',
                            role: '/apiManage/apiInfo/get',
                            api: [api.apiInfoGet]
                        }, {
                            name: '添加',
                            role: '/apiManage/apiInfo/add',
                            api: [api.apiInfoSave]
                        }, {
                            name: '修改',
                            role: '/apiManage/apiInfo/edit',
                            api: [api.apiInfoUpdate]
                        }, {
                            name: '删除',
                            role: '/apiManage/apiInfo/delete',
                            api: [api.apiInfoDelete]
                        }
                    ]
            },
            {
                name: 'API接口账户管理',
                role: '/apiManage/apiAccount',
                api: [api.apiInfoList],
                children:
                    [
                        {
                            name: '列表',
                            role: '/apiManage/apiAccount/list',
                            api: [api.apiAccountList]
                        },
                        {
                            name: '添加',
                            role: '/apiManage/apiAccount/add',
                            api: [api.apiAccountSave, api.apiAccountGet, api.apiAccountValPwd]
                        }
                    ]
            },

        ]
    }, {
    name:'短信服务',
    role:'/smsServer',
    api: [],
    children:[
        {
            name: '短信服务管理',
            role: '/smsServer/smsServer',
            api: [api.smsServerList],
            children:[
                {
                    name: '列表',
                    role: '/smsServer/smsServer/list',
                    api: []                           
                },{
                    name: '添加',
                    role: '/smsServer/smsServer/add',
                    api: [api.smsServerSave,api.smsServerGET]                           
                },{
                    name: '修改',
                    role: '/smsServer/smsServer/edit',
                    api: [api.smsServerUpdate,api.smsServerGET]                           
                },{
                    name: '删除',
                    role: '/smsServer/smsServer/delete',
                    api: [api.smsServerDelete]                           
                }
            ]   
        },{
            name: '短信使用记录',
            role: '/smsServer/smsServer/smsRecord',
            api: [api.smsServersmsRecordList]    
        }
    ]
}
    ]
},
]
export default roles