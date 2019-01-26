<template>
  <section  class="cms-body flex">
    <!-- 树组件 -->
    <cms-tree :hasContent='true' @click="getChannelId" treeType="page"></cms-tree>
    <div class="cms-content-right">
      <!-- 栏目 -->
      <div class="cms-list-header clearfix flex">
        <div class="bread-box cms-left">
          <label class="">当前栏目:</label>
          <ul class="type-bread">
            <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
              <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
            </li>
          </ul>
        </div>
        <div class="cms-left channel-group">
          <el-button type="primary" @click="addChannel">添加H5</el-button>
          <!-- <el-dropdown @command="addChannel">
            <el-button type="primary">
             <i class="el-icon-plus "></i> 添加H5
           </el-button>
           <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-for="item in modelList" :key="item.id"
            :command="item.id" v-if="item.enable == true">
          {{item.showName}}</el-dropdown-item>
          <el-dropdown-item  v-for="item in modelList" :key="item.id"
            :command="item.id" v-if="item.enable == false" disabled>
          {{item.showName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

<!--       <el-button type="success" v-if="asyncEnable" @click="asyncContents">同步内容</el-button>
      <el-button type="success" v-else disabled>同步内容</el-button>
 -->
      <el-dropdown class="dropdown-button" split-button type="success" @click="asyncContents" @command="handleCommand" v-if="asyncEnable">
        同步内容
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in apiList" :key="item.id" :command="item.id">{{item.showName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="success" v-else disabled>同步内容</el-button>

      <a :href="link" class="el-button el-button--warning" @click="quoteContents" v-if="showQuote">引用内容</a>


    </div>
  </div>
  <div class="cms-list-header clearfix flex" style="padding:0 24px 16px 24px;flex-wrap:wrap">
    <div style="margin-top:16px;flex:auto">
      <!-- 所有类型 -->
      <el-select class="cms-left" @change="doQueryModel" placeholder="所有类型" v-model="ask.modelId" style="width:120px">
        <el-option label="所有类型" value="all"></el-option>
        <el-option v-for="item in modelList" :key="item.id" :label="item.showName" :value="item.id"> </el-option>
      </el-select>
      <!-- 所有状态 -->
      <el-select  class="cms-left" @change="doQueryStatus"  placeholder="所有状态" v-model="ask.status" style=" width:120px">
        <el-option label="所有状态" value="all"></el-option>
        <el-option label="草稿" value="1"></el-option>
        <el-option label="已上线" value="5"></el-option>
        <el-option label="已下线" value="6"></el-option>
        <el-option label="删除" value="7"></el-option>
        <el-option label="禁用" value="8"></el-option>
      </el-select>
      <!-- 排序方式 -->
      <el-select v-model="ask.orderByClause" @change="doQueryOrder">
        <el-option label="默认排序" value="default"></el-option>
        <el-option label="ID降序" value="id desc"></el-option>
        <el-option label="ID升序" value="id asc"></el-option>
      </el-select>
    </div>
    <div  style="margin-top:16px;flex:auto" class="content-flex-right">
     <cms-input label="标题" v-model="ask.title" :width="280" ></cms-input>
     <el-button @click="doQuery">查询</el-button>
   </div>
 </div>
 <el-table :data="tableData" stripe @selection-change="checkIdsAndStatus" v-loading="loading" @select="checkForbidden" v-if="showTable">
  <el-table-column type="selection" width="65" align="center"></el-table-column>
  <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
  <el-table-column prop="title" label="标题" align="center" min-width="250px">
      <div slot-scope="scope" >
        <span class="cms-ups" v-if="scope.row.topLevel">[顶]</span>
        <span class="">{{scope.row.title}}</span>
      </div>
  </el-table-column>
  <el-table-column prop="poster" label="封面" align="center">
    <div slot-scope="scope">
      <img :src="scope.row.poster" height="60" width="80" v-if="scope.row.poster != null" />
      <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" height="60" width="80" v-else />
    </div>
  </el-table-column>
  <el-table-column prop="weight" label="权重" align="center">
    <div slot-scope="scope">
      <el-input v-model.number="scope.row.weight" class="w50" min="0" max="99" :maxlength="2"></el-input>
    </div>
  </el-table-column>
  <!--类型 -->
  <el-table-column label="类型" prop="modelShowName" align="center"></el-table-column>
  <!--发布者 -->
  <el-table-column label="SP名称" prop="spName" align="center"></el-table-column>
  <!--发布时间 -->
  <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
  <!-- 创建时间 -->
  <el-table-column :label="label" prop="publishTime" align="center"></el-table-column>
  <!--状态 -->
  <el-table-column label="状态" prop="status" align="center">
    <div slot-scope="scope">
      <span v-if="scope.row.status==1">草稿</span>
      <span v-if="scope.row.status==5">已上线</span>
      <span v-if="scope.row.status==6">已下线</span>
      <span v-if="scope.row.status==7">删除</span>
      <span v-if="scope.row.status==8">禁用</span>
    </div>
  </el-table-column>
  <!--操作 -->
  <el-table-column label="操作" align="center">
    <div slot-scope="scope">
      <a :href="link" class="cms-table-button iconfont edit" title="修改" @click="newPageEdit(scope.row.id)"></a>
      <cms-button type="delete" @click.native="deleteBatch($api.contentDelete, scope.row.id, 0)"></cms-button>
      <cms-button type="view" v-if="isWitness == true && scope.row.status == 5" @click="relateContent(scope.row)"></cms-button>
      <cms-button type="thriller" @click="relateThriller(scope.row)" v-if="scope.row.modelId == 1 && scope.row.status != 8"></cms-button>
      <cms-button type="shop" v-if="scope.row.modelId == 1 && scope.row.status !== 8" @click="relateShop(scope.row)"></cms-button>
      <cms-button type="introduce" v-if="scope.row.modelId == 2 && ( queryShop.sid == 26 || queryShop.sid == 22 ) && scope.row.status == 5" @click="introduce(scope.row)"></cms-button>
    </div>
  </el-table-column>
</el-table>
<!-- 表格底部 -->
<div class="cms-list-footer" style="padding-bottom:100px;">
  <div class="cms-left"></div>
  <!-- cms分页组件 -->
  <cms-pagination :total="allTotal" @change="getPages" :pageSize="ask.pageSize" :page="ask.page" :init="true"></cms-pagination>
</div>

<div class="content-fiexd" v-if="ask.status !== '8'">
 <el-button @click="deleteBatch($api.contentDelete,batchData, 1)" v-perms="'/content/delete'" :disabled="disable">删除</el-button>
 <el-button @click="saveWeight($api.contentWeight, batchData)" v-perms="'/content/priority'" :disabled="disable">保存权重</el-button>
 <el-button @click="toTop($api.contentTop, batchData)" v-perms="'/content/priority'" :disabled="disable">置顶</el-button>
 <el-button @click="cancelTop($api.contentTop, batchData)" v-perms="'/content/priority'" :disabled="disable">取消置顶</el-button>
 <el-button @click="operate('move')" v-perms="'/content/contentMove'" :disabled="disable">移动</el-button>
 <el-button @click="operate('copy')" v-perms="'/content/contentCopy'" :disabled="disable">复制</el-button>
 <el-button @click="online('up')" :disabled="disable">上线</el-button>
 <el-button @click="online('down')" :disabled="disable">下线</el-button>
</div>
<!-- 移动栏目弹窗 -->
<el-dialog class="dialog" :title="labelDialogTitle" :visible.sync="channelVisble" width="25%" :before-close="handleClose" :close-on-click-modal="false">
  <div class="tree-layout">
    <div class="tree">
      <cms-tree @change="getCurrentChannel" treeType="component"></cms-tree>
    </div>
  </div>
<span slot="footer" class="dialog-footer">
  <el-button @click="cancel">取消</el-button>
  <el-button type="primary" @click="confirm">选择</el-button>
</span>
</el-dialog>

<el-dialog title="目击者视频" :visible.sync="dialogTableVisible">
  <div style="margin-top:20px; flex:auto; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;" class="content-flex-right">
    <cms-input label="标题" :width="240" v-model="queryVideo.title" @input="checkQuery"></cms-input>
    <el-button type="primary" @click="doQueryTitle" v-if="queryVideo.enable == true">查询</el-button>
    <el-button type="primary" v-else disabled>查询</el-button>
  </div>
  <el-table :data="gridData">
    <el-table-column property="checked" label="关联" align="center" width="70">
      <div slot-scope="scope">
        <el-checkbox v-model="scope.row.checked"></el-checkbox>
      </div>
    </el-table-column>
    <el-table-column property="title" label="标题" width="300" align="center"></el-table-column>
    <el-table-column property="videoUrl" label="视频" width="200" align="center">
      <div slot-scope="scope">
        <video :src="scope.row.videoUrl" height="160" controls></video>
      </div>
    </el-table-column>
    <el-table-column property="userName" label="目击者" align="center"></el-table-column>
    <el-table-column property="duration" label="时长" align="center"></el-table-column>
    <el-table-column property="videoImg" label="封面" align="center">
      <div slot-scope="scope">
        <img :src="scope.row.videoImg" height="200" width="auto" v-if="scope.row.videoImg != null && scope.row.videoImg != undefined" />
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="200" width="auto" />
      </div>
    </el-table-column>
  </el-table>
  <div class="content-fixed" style="margin-top: 20px;">
    <el-button type="primary" @click="sureRelate">确认</el-button>
    <div class="cms-list-footer" style="padding-bottom:100px;" v-if="showPagination">
      <cms-pagination :total="videoTotal" @change="getVideoPages" :pageSize="queryVideo.pageSize" :page="queryVideo.page" :init="true"></cms-pagination>
    </div>
  </div>
</el-dialog>

<el-dialog :title="thrillerTitle" :visible.sync="thrillerVisible" @close="closeThriller">

  <div style="margin-top:20px; flex:auto; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;" class="content-flex-right">
    <el-button type="primary" v-if="thrillerStatus == 'checked'" @click="changeThrillerStatus">未关联的内容</el-button>
    <el-button type="warning" v-if="thrillerStatus == 'unchecked'" @click="changeThrillerStatus">已关联的片花</el-button>
    <cms-input label="标题" v-model="queryThriller.title" :width="280" v-if="thrillerStatus == 'unchecked'"></cms-input>
    <el-button @click="doQueryThrillerTitle" v-if="thrillerStatus == 'unchecked'">查询</el-button>
  </div>

  <el-table :data="thrillerTableChecked" v-if="thrillerStatus == 'checked'" key="checked">
    <el-table-column property="id" label="ID" align="center"></el-table-column>

    <el-table-column property="contentId" label="内容ID" align="center"></el-table-column>

    <el-table-column property="title" label="标题" align="center"></el-table-column>

    <el-table-column property="subTitle" label="副标题" align="center"></el-table-column>

    <el-table-column property="img" label="封面" align="center">
      <div slot-scope="scope">
        <img :src="scope.row.img" alt="" height="100" width="auto" v-if="scope.row.img != null && scope.row.img != undefined">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
      </div>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <div slot-scope="scope">
        <cms-button type="delete" @click="cancelRelation(scope.row.id)"></cms-button>
      </div>
    </el-table-column>
  </el-table>


  <el-table :data="thrillerTableUnchecked" v-if="thrillerStatus == 'unchecked'" key="unchecked">

    <el-table-column property="id" label="内容ID" align="center" width="100"></el-table-column>

    <el-table-column property="title" label="标题" width="400" align="center"></el-table-column>

    <!-- <el-table-column property="subTitle" label="副标题" width="400" align="center"></el-table-column> -->

    <el-table-column property="img" label="封面" align="center">
      <div slot-scope="scope">
        <img :src="scope.row.poster" height="100" width="auto" v-if="scope.row.poster != null && scope.row.poster != undefined" />
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
      </div>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <div slot-scope="scope">
        <cms-button type="thriller" @click="addRelation(scope.row)"></cms-button>
      </div>
    </el-table-column>

  </el-table>
  <div class="content-fixed" style="margin-top: 20px;">
    <!-- <el-button type="primary" @click="sureRelate">确认</el-button> -->
    <div class="cms-list-footer" style="padding-bottom:100px;" v-if="showThrillerPagination">
      <cms-pagination :total="thrillerTotal" @change="getThrillerPages" :pageSize="queryThriller.pageSize" :page="queryThriller.page" :init="false"></cms-pagination>
    </div>
  </div>
</el-dialog>

<el-dialog title="关联电商" :visible.sync="shopVisible">
  <div style="margin-top:20px; margin-bottom: 20px; margin-right: 20px; margin-left: 20px;">

      <cms-input label="标题" :width="240" @input="checkQueryTitle" v-model="queryShop.title"></cms-input>
      <el-button type="primary" v-if="titleQueryEnable" @click="searchByTitle">查询</el-button>
      <el-button type="primary" disabled v-else>查询</el-button>
  </div>
  <el-table :data="finalShopData" stripe style="width: 100%;" v-if="showShopTable">

    <el-table-column label="关联" align="center" width="70">
      <div slot-scope="scope">
        <el-checkbox v-model="scope.row.checked" @change="getRelatedGroup(scope.row)"></el-checkbox>
      </div>
    </el-table-column>

    <el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>

    <el-table-column prop="title" label="标题" align="center" width="200"></el-table-column>

    <el-table-column prop="subTitle" label="副标题" align="center" width="200"></el-table-column>

    <el-table-column prop="thirdUrl" label="外链地址" align="center" width="200">
        <div slot-scope="scope">
            <span v-if="scope.row.type == 1">{{scope.row.thirdUrl}}</span>
        </div>
    </el-table-column>

    <el-table-column prop="thirdId" label="内容id" align="center" width="80">
        <div slot-scope="scope">
            <span v-if="scope.row.type == 2">{{scope.row.thirdId}}</span>
        </div>
    </el-table-column>

    <el-table-column prop="img" label="封面图" align="center" width="100">
        <div slot-scope="scope">
            <img :src="scope.row.img" height="100" width="auto" v-if="scope.row.img != null && scope.row.img != undefined" />
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540800848352&di=53c3301bb98d9cbaf75e6ed04e2e6d6a&imgtype=0&src=http%3A%2F%2F58pic.ooopic.com%2F58pic%2F14%2F70%2F68%2F34858PIC6sf_1024.jpg" v-else height="100" width="auto" />
        </div>
    </el-table-column>

    <el-table-column prop="private" label="权限" align="center" width="80">
        <div slot-scope="scope">
            <span v-if="scope.row.private == false">公有</span>
            <span v-if="scope.row.private == true">私有</span>
        </div>
    </el-table-column>

    <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>

    <el-table-column prop="updateTime" label="更新时间" align="center" width="200"></el-table-column>

    <el-table-column label="操作" align="center">
        <div slot-scope="scope">
            <cms-button type="edit" @click="toEdit(scope.row)"></cms-button>
            <cms-button type="delete" @click="toDelete(scope.row)"></cms-button>
        </div>
    </el-table-column>
  </el-table>

  <div class="content-fixed" style="margin-top: 20px;">
    <div class="cms-list-footer" style="padding-bottom:100px;">
      <el-button type="info" @click="sureRelation">确定关联</el-button>
      <cms-pagination :total="shopTotal" @change="getShopPages" :pageSize="queryShop.pageSize" :page="queryShop.page" :init="true"></cms-pagination>
    </div>
  </div>
</el-dialog>


</div>
</section>
</template>

<script>
  import listMixins from "@/mixins/list";
  import axios from "axios";
  import {axiosProxy,checkErrorCode,isNull, timestampToTime} from "@/api/tool"
  export default {
    mixins: [listMixins],
    watch: {
      batchData(val) {
        if(val.length > 0) {
          this.disable = false
        } else {
          this.disable = true
        }
      }
    },
    data() {
      return {
        showQuote: false, 
        queryVideo: {
          title: '',
          enable: false,
          page: 1,
          pageSize: 10
        },
        showPagination: true,
        videoTotal: null,
        dialogTableVisible: false,
        gridData: [],
        disable: true,
        ask: {
          modelId: '',
          status: '',
          orderByClause: '',
          title: '',
          channelId: '',
          page: 1,
          pageSize: 10
        },
        showTable: true,
        askParam: {},
        params: {
        //请求参数
        queryShare: "",
        queryTitle: "",
        queryStatus: "",
        queryTypeId: "",
        queryTopLevel: false,
        queryInputUsername: "",
        queryRecommend: false,
        queryOrderBy: "4",
        cid: "",
        pageNo: "",
        pageSize: "",
        format: "",
        https: "",
        hasCollect: ""
      },
      isWitness: false,
      label: '',
      allTotal: 0, //分页总数
      breadItems: [
      {
        name: "根目录",
        id: ""
      }
      ], //面包屑
      modelList: {}, //当前栏目信息
      typeList: [], //内容类型接口
      topicList: [], //专题列表
      siteVisble: false,
      topicVisble: false, //专题弹窗
      channelVisble: false, //选择栏目弹窗,
      labelDialogTitle: "",
      rejectVisble: false, //退回弹窗
      stepList: [],
      currentCheckChannelId: 0, //当前选中栏目
      topicIds: [], //选中的专题数组
      pushSites: [],
      props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      rejectParams: {
        rejectText: "",
        rejectOpinion: ""
      },
      operateType: "",
      batchData: [],
      chosenSubChannelList: [],
      selectedChannel: null,
      moveIds: '',
      moveChannelId: '',
      copyChannelId: '',
      moveChannels: [],
      link: 'javascript: void(0)',
      asyncEnable: true,
      currentCid: null,
      alreadyRelated: [],
      apiList: [],
      checkedLoading: false,
      witnessLoading: false,
      videoTotalCount: null,
      queryThriller: {
        page: 1,
        pageSize: 10,
        contentId: null,
        title: null
      },
      thrillerVisible: false,
      thrillerTableUnchecked: [],
      thrillerTableChecked: [],
      thrillerTotal: null,
      showThrillerPagination: true,
      thrillerTitle: '片花',
      thrillerStatus: 'checked',

      shopVisible: false,
      shopData: [],
      shopTotal: null,
      shopList: [],
      finalShopData: [],
      queryShop: {
        title: null,
        page: 1,
        pageSize: 10,
        sid: null
      }, 
      titleQueryEnable: false,
      showShopTable: true,
      thrillerTableCheckedIds: []
    };
  },
  methods: {
    // selectWitness (value) {
    //   if(value.title == '' || value.title == undefined || value.title == null) {
    //     this.$confirm("不可以关联没有标题的目击者视频哦！", "警告", { type: "error" }).then( mes => {
    //         for (let i in this.gridData) {
    //           if(this.gridData[i].id == value.id) {
    //             this.gridData[i].checked = !value.checked
    //           }
    //         }
    //         return false
    //     }).catch(error => {
    //         console.log(error)
    //     })
    //   }
    // },
    
    doQueryThrillerTitle () {
      if(this.queryThriller.title !== null) {
        this.getAllList(this.queryThriller.page, this.queryThriller.pageSize, this.queryThriller.title, () => {
          
        })
      } else {
        this.errorMessage('请填写合适的查询标题哦')
        return false
      }
    },
    checkForbidden (selection, row) {
      if(row.status == 8) {
        this.showTable = false
        this.batchData = []
        this.errorMessage('禁止操作禁用状态的内容噻！')
        setTimeout (() => {
          this.showTable = true
        }, 100)
      }
    },
    quoteContents () {
      this.routerLink('/content/quote')
    },
    introduce (obj) {
      let id = obj.id
      this.$confirm('确定同步该内容到视讯中国吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.postIntroduce(id)
      }).catch( error => {
          console.log(error)    
      })
    },
    postIntroduce(id) {
      let url = this.$api.contentLive + '?contentId=' + id
      axiosProxy.put(url).then( res => {
        if (res.data.errorCode == 0) {
          this.successMessage('操作成功')
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    cancelRelation (id) {
      let url = this.$api.thrillerOmit + '/' + id
      axiosProxy.delete(url).then( res => {
        if(res.data.errorCode == 0) {
          this.successMessage('操作成功')
          this.getThrillerList(this.currentContentId, this.queryThriller.page, this.queryThriller.pageSize, () => {

          })
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },

    addRelation (obj) {
      let newObj = {}
      newObj.id = obj.id
      newObj.contentId = this.currentContentId
      newObj.contentType = obj.modelId
      newObj.contentUuid = obj.uuid
      newObj.img = obj.poster
      newObj.title = obj.title
      if(obj.subTitle) {
        newObj.subTitle = obj.subTitle
      }

      this.postAddRelation(newObj)
    },

    postAddRelation (obj) {
      let url = this.$api.thrillerSave + '?contentId=' + obj.id + '&videoId=' + obj.contentId
      axiosProxy.post(url).then( res => {
        if(res.data.errorCode == 0) {
          this.successMessage('操作成功')
          this.thrillerTableCheckedIds = []
          this.thrillerTableUnchecked = []
          this.thrillerTableChecked = []
          this.thrillerTotal = null
          this.thrillerStatus = 'default'
          this.showThrillerPagination = false
          this.getThrillerList(this.currentContentId, this.queryThriller.page, this.queryThriller.pageSize, () => {
            this.getAllList(this.queryThriller.page, this.queryThriller.pageSize, this.queryThriller.title, () => {
              this.thrillerStatus = 'unchecked'
              this.showThrillerPagination = true
            })
          })
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    
    // 获取已经关联的电商列表
    getRelatedShop (cid, callback) {
      let url = this.$api.shopRelationList + '/' + cid
      axiosProxy.get(url).then( res => {
        if(res.data.errorCode == 0) {
          this.shopData = res.data.data
          for (let i in this.shopData) {
            this.shopData[i].checked = true
          }
          callback()
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    getShopList(cid, sid, page, pageSize, title, callback) {
      let url = this.$api.shopList + '?sid=' + sid + '&page=' + page + '&pageSize=' + pageSize + '&cid=' + cid

        if(title !== '' && title !== undefined && title !== null) {
            url = url + '&title=' + title
        }

        axiosProxy.get(url).then( res => {
            if(res.data.errorCode == 0) {
                this.shopList = res.data.data.list
                if(this.shopData !== null) {
                  this.shopTotal = res.data.data.total + this.shopData.length
                } else {
                  this.shopTotal = res.data.data.total
                }

                for(let i in this.shopList) {
                    if(this.shopList[i].createTime !== null) {
                        this.shopList[i].createTime = timestampToTime(this.shopList[i].createTime)
                    }

                    if(this.shopList[i].updateTime !== null) {
                        this.shopList[i].updateTime = timestampToTime(this.shopList[i].updateTime)
                    }

                    this.shopList[i].checked = false
                }
                callback()
            } else {
                if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                } else {
                    this.errorMessage('操作失败')
                }
            }
        }).catch( error => {
            console.log(error)
        })
    },
    checkQueryTitle () {
        if(isNull(this.queryShop.title) || this.queryShop.title == null || this.queryShop.title == undefined) {
            this.titleQueryEnable = false
        } else {
            this.titleQueryEnable = true
        }
    },
    searchByTitle () {
      this.getShopList(this.currentContentId, this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title, () => {
        this.finalShopData = this.shopList
      })
    },
    getShopPages (current, size) {
      this.queryShop.pageSize = size
      this.queryShop.page = current
      this.getShopList(this.currentContentId, this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, this.queryShop.title, () => {
        this.finalShopData = this.shopList
      })
    },
    getRelatedGroup (data) {
      this.showShopTable = false
      for (let i in this.finalShopData) {
        if(data.id == this.finalShopData[i].id) {
          if(data.checked == false) {
            this.finalShopData[i].checked = false
          } else {
            this.finalShopData[i].checked = true
          }
        }
      }
      setTimeout (() => {
        this.showShopTable = true
      })
    },
    sureRelation () {
      let sureRelateGroup = []
      for(let i in this.finalShopData) {
        if(this.finalShopData[i].checked == true) {
          sureRelateGroup.push(this.finalShopData[i].id)
        }
      }
      if(sureRelateGroup.length > 6) {
        this.errorMessage('关联的电商不能超过6个哦！')
        return false
      } else {
        this.postRelation(this.currentContentId, sureRelateGroup.join(','))
      }
    },
    postRelation (cid, sids) {
      let url = this.$api.shopRelation + '?cid=' + cid + '&sids=' + sids
      axiosProxy.put(url).then( res => {
        if(res.data.errorCode == 0) {
          this.successMessage('操作成功')
          this.shopVisible = false
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    relateShop (node) {
      this.currentContentId = node.id
      this.shopVisible = true
      this.getRelatedShop(node.id, () => {
        this.getShopList(node.id, this.queryShop.sid, this.queryShop.page, this.queryShop.pageSize, null, () => {
          
          if(this.shopData !== null) {
            this.shopData = this.shopData.concat(this.shopList)
            this.finalShopData = this.shopData
          } else {
            this.finalShopData = this.shopList
          }
        })
      })
    },



    relateThriller (tableObj) {
      this.currentContentId = tableObj.id
      this.thrillerVisible = true
      this.getThrillerList(tableObj.id, this.queryThriller.page, this.queryThriller.pageSize, () => {

      })
    },
    getThrillerList(contentId, page, pageSize, callback) {
      let url = this.$api.thrillerSearch + '/' + contentId + '?page=' + page + '&pageSize=' + pageSize
      this.thrillerTableCheckedIds = []

      axiosProxy.get(url).then(res => {
        if(res.data.errorCode == 0) {
          this.thrillerTableChecked = res.data.data.list
          this.thrillerTotal = res.data.data.total
          for (let i in this.thrillerTableChecked) {
            this.thrillerTableCheckedIds.push(this.thrillerTableChecked[i].contentUuid)
          }

          callback()
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    getThrillerPages (current, size) {
      this.queryThriller.page = current
      this.queryThriller.pageSize = size
      if(this.thrillerStatus == 'checked') {
        this.getThrillerList(this.currentContentId, this.queryThriller.page, this.queryThriller.pageSize, () => {
          
        })
      } else if (this.thrillerStatus == 'unchecked') {
        this.getAllList(this.queryThriller.page, this.queryThriller.pageSize, this.queryThriller.title, () => {
        })
      }
    },
    closeThriller () {
      this.showThrillerPagination = false
      this.queryThriller.page = 1
      this.queryThriller.pageSize = 10
      this.thrillerTitle = '片花'
      this.thrillerStatus = 'checked'
      setTimeout (() => {
        this.showThrillerPagination = true
      }, 100)
    },
    changeThrillerStatus () {
      this.queryThriller.page = 1
      this.queryThriller.pageSize = 10
      this.showThrillerPagination = false
      setTimeout (() => {
        this.showThrillerPagination = true
      }, 100)
      if(this.thrillerStatus == 'checked') {
        this.thrillerStatus = 'unchecked'
        this.thrillerTitle = '内容'
        this.getThrillerList(this.currentContentId, this.queryThriller.page, this.queryThriller.pageSize, () => {
          this.getAllList(this.queryThriller.page, this.queryThriller.pageSize, this.queryThriller.title, () => {

          })
        })
      } else if(this.thrillerStatus == 'unchecked') {
        this.thrillerStatus = 'checked'
        this.thrillerTitle = '片花'
        this.getThrillerList(this.currentContentId, this.queryThriller.page, this.queryThriller.pageSize, () => {

        })
      }
    },
    getAllList (page, pageSize, title, callback) {
      let url
      if(title !== null && title !== undefined && title !== '') {
        url = this.$api.contentList + '?page=' + page + '&pageSize=' + pageSize + '&status=5' + '&title=' + title + '&modelId=1'
      } else {
        url = this.$api.contentList + '?page=' + page + '&pageSize=' + pageSize + '&status=5' + '&modelId=1'
      }
      axiosProxy.get(url).then(res => {
        if(res.data.errorCode == 0) {
          let uncheckedDataGroup = []
          for (let i in res.data.data.list) {
            if(this.thrillerTableCheckedIds.indexOf(res.data.data.list[i].uuid) == -1) {
              uncheckedDataGroup.push(res.data.data.list[i])
            }
          }
          this.thrillerTableUnchecked = uncheckedDataGroup
          this.thrillerTotal = res.data.data.total - this.thrillerTableCheckedIds.length
          callback()
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },



    getCheckedWitnessList (cid) {
        this.checkedLoading = true
        let url = this.$api.witnessCheckedList + '?cid=' + cid
        axiosProxy.get(url).then( res => {
            if(res.data.errorCode == 0) {
                for (let i in res.data.data) {
                  this.gridData.unshift(res.data.data[i])
                  this.alreadyRelated.push(res.data.data[i].id)
                }
                this.videoTotal = this.videoTotalCount + res.data.data.length
            } else {
                if(res.data.errorMessage) {
                    this.errorMessage(res.data.errorMessage)
                } else {
                    this.errorMessage('操作失败')
                }
            }
            this.checkedLoading = false
        }).catch( error => {
            console.log(error)
            this.checkedLoading = false
        })
    },
    getTableList () {
      axiosProxy.get(this.$api.syncApiList).then( res => {
          if(res.data.errorCode == '0') {
              this.apiList = res.data.data
              for (let i in this.apiList) {
                if(this.apiList[i].enable == false) {
                  this.apiList.splice(i, 1)
                }
              }
          } else {
              if(res.data.errorMessage) {
                  this.errorMessage(res.data.errorMessage)
              } else {
                  this.errorMessage('请求失败')
              }
          } 
      }).catch ( error => {
          console.log(error)
      })
    },
    handleClick () {
      alert('button click')
    },
    handleCommand (command) {
      this.asyncEnable = false
      let siteId = window.localStorage.getItem('_site_id_param')
      let url = this.$api.contentsAsync + '/' + siteId + '/' + command
      axiosProxy.get(url).then( res => {
        if(res.data.errorCode == 0) {
          let num, count
          if(res.data.data == null) {
            num = 0
            count = 0
          } else {
            if(JSON.stringify(res.data.data) == '{}') {
              num = 0
              count = 0
            } else {
              num = res.data.data.saveNum
              count = res.data.data.updateNum
            }
          }
          let sentence = '同步已完成  新增:' + num +'条 更新:' + count + '条'
          // let sentence = '已成功同步' + num + '条内容,更新' + count + '条内容'
          this.$alert(sentence, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.asyncEnable = true
              this.showTableData(this.queryString())
            }
          })
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('操作失败')
          }
        }
      }).catch( error => {
        console.log(error)
      })
    },
    checkQuery () {
      if(this.queryVideo.title != undefined && this.queryVideo.title != null && !isNull(this.queryVideo.title)) {
        this.queryVideo.enable = true
      } else {
        this.queryVideo.enable = false
      }
    },

    doQueryTitle () {
      this.getWitnessList(1, this.queryVideo.title, this.currentCid, () => {
        this.videoTotal = this.videoTotalCount
      })
    },

    relateContent (rowData) {
      let cid = rowData.id
      this.currentCid = rowData.id
      this.gridData = []
      this.dialogTableVisible = true
      this.getWitnessList(1, null, cid, (cid) => {
        this.getCheckedWitnessList(cid)
      })
    },

    getVideoPages(current, size) {
      this.queryVideo.page = current
      this.queryVideo.pageSize = size
      this.getWitnessList(this.queryVideo.page, null, this.currentCid, () => {
        return false
      })
    },

    sureRelate () {
      let currentRelated = []
      let addRelated = []
      let delRelated = []

      let addRelatedPure = []
      let delRelatedPure = []

      for (let i in this.gridData) {
        if(this.gridData[i].checked == true) {
          currentRelated.push(this.gridData[i].id)
        }
      }

      for (let i in currentRelated) {
        if(this.alreadyRelated.indexOf(currentRelated[i]) == -1) {
          addRelated.push(currentRelated[i])
        }
      }

      for (let i in this.alreadyRelated) {
        if(currentRelated.indexOf(this.alreadyRelated[i]) == -1) {
          delRelated.push(this.alreadyRelated[i])
        }
      }

      for (let i in addRelated) {
        if(addRelatedPure.indexOf(addRelated[i]) == -1) {
          addRelatedPure.push(addRelated[i])
        }
      }

      for (let i in delRelated) {
        if(delRelatedPure.indexOf(delRelated[i]) == -1) {
          delRelatedPure.push(delRelated[i])
        }
      }

      this.relatePut(addRelatedPure, delRelatedPure)
    },

    relatePut(addRelated, delRelated) {
      let addwids = addRelated.join(',')
      let delwids = delRelated.join(',')
      let cid = this.currentCid
      let url = this.$api.witnessContent + '?cid=' + cid
      if(addRelated.length > 0) {
        url = url + '&addwids=' + addwids
      }
      if(delRelated.length > 0) {
        url = url + '&delwids=' + delwids
      }
      // let url = this.$api.witnessContent + '?cid=' + cid + '&addwids=' + addwids + '&delwids=' + delwids
      axiosProxy.put(url).then( res => {
        this.showPagination = false
        this.queryVideo.page = 1
        this.queryVideo.pageSize = 10
        if(res.data.errorCode == 0) {
          this.successMessage('操作成功')
          setTimeout( () => {
            this.dialogTableVisible = false
            this.alreadyRelated = []
            this.gridData = []
            this.showPagination = true
          }, 500)
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
          setTimeout( () => {
            this.dialogTableVisible = false
            this.alreadyRelated = []
            this.gridData = []
            this.showPagination = true
          }, 500)
        }
      }).catch( error => {
        console.log(error)
      })
    },

    getWitnessList(page, title, cid, callback) {
      this.witnessLoading = true
      let url
      if(title == null) {
        url = this.$api.witnessRelateList + '?cid=' + cid + '&page=' + page
      } else {
        url = this.$api.witnessRelateList + '?cid=' + cid + '&title=' + title + '&page=' + page
      }
      axiosProxy.get(url).then( res=> {
        if(res.data.errorCode == 0) {
          this.gridData = res.data.data.list
          this.videoTotalCount = res.data.data.total
          for (let i in this.gridData) {
            
            if(this.gridData[i].title !== null) {
                if(this.gridData[i].title.indexOf('%') == -1) {
                    this.gridData[i].title = this.gridData[i].title
                } else {
                    this.gridData[i].title = decodeURIComponent(this.gridData[i].title)
                }
            } else {
                this.gridData[i].title = this.gridData[i].title
            }
          }
          callback(cid)
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
            this.errorMessage('操作失败')
          }
        }
        this.witnessLoading = false
      }).catch( error => {
        console.log(error)
        this.witnessLoading = false
      })
    },

    asyncContents () {
      this.asyncEnable = false
      let siteId = window.localStorage.getItem('_site_id_param')
      let url = this.$api.contentsAsync + '/' + siteId
      axiosProxy.get(url).then(res => {
        let num, count
        if(res.data.data == null) {
          num = 0
          count = 0
        } else {
          if(JSON.stringify(res.data.data) == '{}') {
            num = 0
            count = 0
          } else {
            num = res.data.data.saveNum
            count = res.data.data.updateNum
          }
        }
        let sentence = '同步已完成  新增:' + num +'条 更新:' + count + '条'
        // let sentence = '已成功同步' + num + '条内容,更新' + count + '条内容'

        if(res.data.errorCode == 0) {
          this.$alert(sentence, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.asyncEnable = true
              this.showTableData(this.queryString())
            }
          })
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    newPageEdit (contentId) {
      let routeData = this.$router.resolve({ path: '/content/update', query: {  id: contentId, type: 'update' } });
      window.open(routeData.href, '_blank');
    },
    saveWeight (url, datas) {
      let ids = []
      let weights = []
      for (let i in datas) {
        ids.push(datas[i].id)
        weights.push(datas[i].weight)
      }
      axiosProxy.put(url + '?ids=' + ids.join(',') + '&weights=' + weights.join(',')).then(res => {
        this.loading = false;
        if (res.data.errorCode == "0") {
          this.successMessage("操作成功");
          this.showTableData(this.queryString())
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    unable () {
      this.errorMessage('副栏目下不支持修改!')
    },
    online (type) {
      let status
      if(type == 'up') {
        status = 5
      } else if (type == 'down') {
        status = 6
      }
      let ids = []
      for (let i in this.batchData) {
        ids.push(this.batchData[i].id)
      }
      axiosProxy.put(this.$api.contentOnline + '?status=' + status + '&ids=' + ids.join(',')).then(res => {
        if (res.data.errorCode == "0") {
          this.successMessage("操作成功")
          this.showTableData(this.queryString())
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    getCurrentChannel (data,node) {
      this.moveChannels = data.checkedNodes

      let channelIds = []
      let contentIds = []

      for (let i = 0; i < this.batchData.length; i++) {
        contentIds.push(this.batchData[i].id)
      }
      var ids = contentIds.join(',') // 内容id
      this.moveIds = ids

      for(let i = 0; i < data.checkedNodes.length; i++) {
        channelIds.push(data.checkedNodes[i].id)
      }
      var cIds = channelIds.join(',')
      this.copyChannelId = cIds
    },
    checkIdsAndStatus (data) {
      if(data.length > 0) {
        this.disable = false
        this.batchData = data
      } else {
        this.disable = true
      }
    },
    cancelTop (url, datas) {
      let idsArray = []

      for (let i = 0; i < this.batchData.length; i++) {
        idsArray.push(this.batchData[i].id)
      }
      var ids = idsArray.join(',')

      axiosProxy.put(url + '?ids=' + ids + '&isTop=false').then(res => {
        this.loading = false;
        if (res.data.errorCode == "0") {
          this.successMessage("取消置顶成功");
          this.showTableData(this.queryString())
        } else {
          if(res.data.errorMessage) {
            this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    toTop (url, datas) {
        let idsArray = []

        for (let i = 0; i < this.batchData.length; i++) {
          idsArray.push(this.batchData[i].id)
        }
        var ids = idsArray.join(',')

        axiosProxy.put(url + '?ids=' + ids + '&isTop=true').then(res => {
          this.loading = false;
          if (res.data.errorCode == "0") {
            this.successMessage("置顶成功");
            this.showTableData(this.queryString())
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
          }
        });
    },
    addChannel() {
      let command = 4
      let chosenBread = []
      let chosenId = null
      for (let i = 0; i < this.breadItems.length; i++) {
        chosenBread.push(this.breadItems[i].name)
      }
      chosenBread.splice(0, 1)
      chosenId = this.breadItems[this.breadItems.length -1].id
      window.localStorage.setItem('channelShowList', chosenBread.join('/'))
      window.localStorage.setItem('chosenId', chosenId)
      this.params.parentId = this.params.cid;
      this.params.modelId = command;
      this.routerLink("/content/save", "save", 0, this.params);
    },
    deleteBatch(url, ids, count) {

      if(count == 1) {
        let array = []
        for (let i = 0; i < this.batchData.length; i++) {
          array.push(this.batchData[i].id)
        }
        ids = array.join(',')
      } else if(count == 0) {
        ids = ids
      }
      //删除
      this.$confirm("是否确认删除?", "警告", { type: "error" })
      .then(mes => {
        this.loading = true;
        axiosProxy.put(url + '&ids=' + ids).then(res => {
          this.loading = false;
          if (res.data.errorCode == "0") {
            this.successMessage("删除成功");
            this.showTableData(this.queryString())
          } else {
            if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
            } else {
                this.errorMessage('操作失败')
            }
          }
        });
      })
      .catch(error => {
        this.loading = false;
      });
    },

    operate(type) {
      //复制及引用打开dialog触发事件
      this.channelVisble = true;
      this.operateType = type;
    },
    //栏目dialog节点选中事件，处理checkbox 只能选择一个
    checkChange(node, checkStatus, childStatus) {
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
        this.$refs["channelTree"].setCheckedKeys([node.id], true);
      }
    },
    //栏目dialog取消按钮操作
    cancel() {
      this.channelVisble = false;
      this.$refs['channelTree'].setCheckedKeys([]);
    },
    //栏目dialog确认按钮操作
    confirm() {

      let url, ids, cIds

      if(this.operateType == 'move') {
        if(this.moveChannels.length == 1) {
          ids = this.moveIds
          cIds = this.copyChannelId
          url = this.$api.contentMove + '?contentIds=' + ids + '&channelId=' + cIds

          axiosProxy.put(url).then(res => {
            this.loading = false;
            this.channelVisble = false
            if (res.data.errorCode == "0") {
              this.successMessage("操作成功");
              this.showTableData(this.queryString())
            } else {
              if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
              } else {
                  this.errorMessage('操作失败')
              }
            }
          });
        } else {
          this.errorMessage('请选择一个目标栏目')
        }

      } else {
        if(this.moveChannels.length > 0) {
          ids = this.moveIds
          cIds = this.copyChannelId
          url = this.$api.contentCopy + '?contentIds=' + ids + '&channelIds=' + cIds

          axiosProxy.post(url).then(res => {
            this.loading = false;
            this.channelVisble = false
            if (res.data.errorCode == "0") {
              this.successMessage("操作成功");
              this.showTableData(this.queryString())
            } else {
              if(res.data.errorMessage) {
                this.errorMessage(res.data.errorMessage)
              } else {
                  this.errorMessage('操作失败')
              }
            }
          });
        } else {
          this.errorMessage('请至少选择一个目标栏目')
        }
      }
    },
    handleClose(done) {
     done();
   },
   topicCancel(){
      this.topicVisble = false;
    },

    handleChange() {
      this.$emit('change', this.checked)
    },
    getChannelId(data, node) {
      if(data.id == 77) {
        this.isWitness = true
      } else {
        this.isWitness = false
      }
      this.creatBread(node, []);
      this.params.cid = data.id; //传递栏目id
      this.getChannelInfo(data.id); //获取栏目信息
      if(data.id != '-1') {
        this.ask.channelId = data.id
        this.showQuote = true
        window.localStorage.setItem('currentChannelId', data.id)
      } else {
        this.ask.channelId = ''
        this.showQuote = false
      }
      this.showTableData(this.queryString())
    },
    getChannelInfo(channelId) {
      //获取模型信息
      axiosProxy
      .get(this.$api.modelList + '?enable=true')
      .then(res => {
        if(res.data.errorCode == '0') {
          this.modelList = res.data.data
          window.localStorage.setItem('modelList', JSON.stringify(this.modelList))
        } else {
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      });
    },
    clickBread(id, index) {
      //面包屑
    },
    creatBread(node, arr) {
      if (node.parent != null) {
        let params = {
          name: node.data.name,
          id: node.data.id
        };
        arr.push(params);
        this.creatBread(node.parent, arr);
      } else {
        this.breadItems = arr.reverse();
        return false;
      }
    },
    doQuery() {
      this.showTableData(this.queryString())
    },
    doQueryOrder (value) {
      if(value == 'default') {
        this.ask.orderByClause = ''
      } else {
        this.ask.orderByClause = value
      }
      this.showTableData(this.queryString())
    },
    doQueryStatus (value) {
      if(value == 'all') {
        this.ask.status = ''
      } else {
        this.ask.status = value
      }
      this.showTableData(this.queryString())
    },
    doQueryModel (value) {
      if(value == 'all') {
        this.ask.modelId = ''
      } else {
        this.ask.modelId = value
      }
      this.showTableData(this.queryString())
    },
    getPages(current, size) {
      this.ask.pageSize = size
      this.ask.page = current
      this.showTableData(this.queryString('page'))
    },
    timestampToTime(timestamp) {
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
    },
    queryString (data) {
      let url = this.$api.contentList
      if(data != 'page') {
        this.ask.page = 1
        // this.ask.pageSize = 10
      }
      for (let i in this.ask) {
        if(this.ask[i] != '') {
          if(url.indexOf('?') == -1) {
            url = url + '?' + i + '=' + this.ask[i]
          } else {
            url = url + '&' + i + '=' + this.ask[i]
          }
        }
      }
      return url
    },
    showTableData(api, datas) {
      axiosProxy
      .get(api, datas)
      .then(res => {
        this.loading = false;
        if (res.data.errorCode == '0') {
            this.tableData = res.data.data.list;
            for (var i = 0; i < this.tableData.length; i++) {
              this.tableData[i].createTime = this.timestampToTime(this.tableData[i].createTime)
              this.tableData[i].createTime = this.tableData[i].createTime.slice(5, 16)
              if(this.tableData[i].publishTime != null) {
                this.tableData[i].publishTime = this.timestampToTime(this.tableData[i].publishTime)
                this.tableData[i].publishTime = this.tableData[i].publishTime.slice(5, 16)
              }
              if(this.tableData[i].modelShowName == '直播') {
                this.label = '开始时间'
              } else {
                this.label = '发布时间'
              }
            }
            this.allTotal = res.data.data.total
        } else {
          this.tableData = [];
          if(res.data.errorMessage) {
              this.errorMessage(res.data.errorMessage)
          } else {
              this.errorMessage('操作失败')
          }
        }
      })
      .catch(error => {
        this.loading = false;
        this.state = false;
      });
    }
  },
  mounted() {
    let clientHeight = document.body.clientHeight;
    $(".cms-body").css("minHeight", clientHeight - 110 + "px");
  },
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    if (this.$route.query.type == "list") {
      if (this.$route.query.id == 0) {
        this.params.cid = "";
      } else {
        this.params.cid = this.$route.query.id;
      }
    }
    this.showTableData(this.queryString())
    this.getChannelInfo(); //模型列表
    this.getTableList()
    window.localStorage.setItem('currentChannelId', null)
    this.queryShop.sid = window.localStorage.getItem('_site_id_param')
  }
};
</script>

<style lang="scss">
.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}
.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}
.tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}

.red-color {
  color: red;
}


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
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-button-group .el-button--success:last-child {
  width: 50px;
  min-width: 50px;
}
.el-dialog {
  width: 80%;
  margin-top: 50px;
}
</style>
