<template>
     <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
              <!-- 排序方式 -->           
          <div>
          <el-select v-model="params.queryOrderBy" @change="query">
            <el-option label="无" value=""></el-option>
            <el-option label="ID降序" value="0"></el-option>
            <el-option label="ID升序" value="1"></el-option>
            <el-option label="发布时间降序" value="2"></el-option>
            <el-option label="发布时间升序" value="3"></el-option>
            <el-option label="固定降，发布降" value="4"></el-option>
            <el-option label="固定降，发布升" value="5"></el-option>
            <el-option label="日点击降" value="6"></el-option>
            <el-option label="周点击降" value="7"></el-option>
            <el-option label="月点击降" value="8"></el-option>
            <el-option label="总点击降" value="9"></el-option>
            <el-option label="日评论降" value="10"></el-option>
            <el-option label="周评论降" value="11"></el-option>
            <el-option label="月评论降" value="12"></el-option>
            <el-option label="总评论降" value="13"></el-option>
            <el-option label="日下载降" value="14"></el-option>
            <el-option label="周下载降" value="15"></el-option>
            <el-option label="月下载降" value="16"></el-option>
            <el-option label="总下载降" value="17"></el-option>
            <el-option label="日顶降" value="18"></el-option>
            <el-option label="周顶降" value="19"></el-option>
            <el-option label="月顶降" value="20"></el-option>
            <el-option label="总顶降" value="21"></el-option>
            <el-option label="推荐降,发布升" value="22"></el-option>
            <el-option label="推荐升,发布降" value="23"></el-option>
          </el-select>
        </div>
        <div >  
          <cms-input label="标题" v-model="params.queryTitle"></cms-input>
          <cms-input label="发布者" v-model="params.queryInputUsername"></cms-input>
          <el-button @click="query">查询</el-button>
        </div>
     </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="title" label="标题" align="left" width="300px">
              <div slot-scope="scope" class="overflow-text">
                <span class="cms-ups" v-if="scope.row.topLevel>0">[顶{{scope.row.topLevel}}]</span>
                <span class="cms-recommend" v-if="scope.row.recommend">[推荐{{scope.row.recommendLevel}}]</span>
                <span class="cms-channel-name">[{{scope.row.channelName}}]</span>
                <a class="link" :href="scope.row.url" :title="scope.row.title" target="_blank">{{scope.row.title}}</a>
              </div>
            </el-table-column>

             <!--类型 -->
            <el-table-column label="类型" prop="typeName" align="center"></el-table-column>
            <!--发布者 -->
            <el-table-column label="发布者" prop="userName" align="center"></el-table-column>
            <!--点击 -->
            <el-table-column label="点击" prop="views" align="center"></el-table-column>

            <!--日点击 -->
            <el-table-column v-if="params.queryOrderBy==='6'" label="日点击" prop="viewsDay" align="center"></el-table-column>
            <!--周点击 -->
            <el-table-column v-if="params.queryOrderBy==='7'" label="周点击" prop="viewsWeek" align="center"></el-table-column>
            <!--月点击 -->
            <el-table-column v-if="params.queryOrderBy==='8'" label="月点击" prop="viewsMonth" align="center"></el-table-column>

            <!--日评论 -->
            <el-table-column v-if="params.queryOrderBy==='10'" label="日评论" prop="commentsDay" align="center"></el-table-column>
            <!--周评论 -->
            <el-table-column v-if="params.queryOrderBy==='11'" label="周评论" prop="commentsWeek" align="center"></el-table-column>
            <!--月评论 -->
            <el-table-column v-if="params.queryOrderBy==='12'" label="月评论" prop="commentsMonth" align="center"></el-table-column>
            <!--总评论 -->
            <el-table-column v-if="params.queryOrderBy==='13'" label="评论" prop="commentCount" align="center"></el-table-column>
            <!--日下载 -->
            <el-table-column v-if="params.queryOrderBy==='14'" label="日下载" prop="downloadsDay" align="center"></el-table-column>
            <!--周下载 -->
            <el-table-column v-if="params.queryOrderBy==='15'" label="周下载" prop="downloadsWeek" align="center"></el-table-column>
            <!--月下载 -->
            <el-table-column v-if="params.queryOrderBy==='16'" label="月下载" prop="downloadsMonth" align="center"></el-table-column>
            <!--总下载 -->
            <el-table-column v-if="params.queryOrderBy==='17'" label="下载" prop="downloads" align="center"></el-table-column>
            <!--日顶数 -->
            <el-table-column v-if="params.queryOrderBy==='18'" label="日顶数" prop="upsMonth" align="center"></el-table-column>
            <!--周顶数 -->
            <el-table-column v-if="params.queryOrderBy==='19'" label="周顶数" prop="upsWeek" align="center"></el-table-column>
            <!--月顶数 -->
            <el-table-column v-if="params.queryOrderBy==='20'" label="月顶数" prop="upsMonth" align="center"></el-table-column>
            <!--顶数 -->
            <el-table-column v-if="params.queryOrderBy==='21'" label="顶数" prop="ups" align="center"></el-table-column>


            <!--发布时间 -->
            <el-table-column label="发布时间" prop="releaseDate" align="center"></el-table-column>
            <!--状态 -->
            <el-table-column label="状态" prop="status" align="center">
              <div slot-scope="scope">
                <span v-if="scope.row.status==-1">退回</span>
                <span v-if="scope.row.status==0">草稿</span>
                <span v-if="scope.row.status==1">审核中</span>
                <span v-if="scope.row.status==2">已终审</span>
                <span v-if="scope.row.status==3">回收站</span>
                <span v-if="scope.row.status==4">投稿</span>
                <span v-if="scope.row.status==5">归档</span>     
              </div>
            </el-table-column>
    
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="open2(scope.row.id)"
                        v-perms="'/contentCycle/Recycle'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.contentCycleDelete,scope.row.id)"
                     v-perms="'/contentCycle/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.contentCycleDelete,ids)"
                   v-perms="'/contentCycle/delete'"  
                  >批量删除</el-button>
                  <el-button :disabled="disabled" @click="open2(ids)"
                   v-perms="'/contentCycle/Recycle'"  
                  >还原</el-button>
                </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
     </section> 
</template>

<script>
import listMixin from '@/mixins/form';
import listMixins from '@/mixins/list';
export default {
    mixins:[listMixins,listMixin],
  data() {
    return {
      params: {//只需要业务参数
        queryStatus:'recycle',
        pageNo:'',
        pageSize:'',
        queryShare: "",
        queryTitle: "",
        queryInputUsername:'',
        queryOrderBy:'',
      }
    };
  },
  methods:{
      reduction(ids){
           this.$http
            .post(this.$api.contentCycleRecycle,{ids:ids})
            .then(res => {
                this.initTableData(this.$api.contentList,this.params);
                this.loading = false;
            })
            .catch(error => {
                this.loading = false;
            })
      },
      open2(ids) {
        this.$confirm('你确定要还原?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            actions:this.reduction(ids),
            type: 'success',            
            message:'还原成功!',          
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消还原'
          });          
        });
      }
  },
  created(){
     this.initTableData(this.$api.contentList,this.params);
  }
};
</script>
    
<style>

</style>