<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/directive/add','save',0)"
              v-perms="'/directive/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
           
            <el-table-column prop="name" label="标签名" align="center"></el-table-column>
            <el-table-column prop="code" label="标签代码" align="center">
                  <div slot-scope="scope">
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="scope.row.code">
                      </el-input>
                  </div>
            </el-table-column>
            <el-table-column prop="username" label="创建者" align="center"></el-table-column>
            
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                       <cms-button type="view" @click.native="view(scope.row.code)"
                        v-perms="'/directive/get'" 
                       ></cms-button>
                      <cms-button type="edit" @click.native="edit(scope.row.id)"
                        v-perms="'/directive/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.directiveDelete,scope.row.id)"
                     v-perms="'/directive/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.directiveDelete,ids)"
                   v-perms="'/directive/delete'"  
                  >批量删除</el-button>
                </div>
               
          </div>
      <!-- 标签详情 -->
        <el-dialog
            title="标签向导 - 标签详情"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
              <span>
                   <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="code">
                    </el-input>           
              </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
         </el-dialog>
      <!-- 标签修改-->
          <el-dialog title="收货地址"  :visible.sync="dialogFormVisible">
            <el-form :model="updateTable" :rules="rules">
              <el-form-item label="标签名:" :label-width="formLabelWidth" prop="name">
                 <el-input v-model="updateTable.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="标签描述:" :label-width="formLabelWidth" prop="description">
                 <el-input v-model="updateTable.description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="标签代码:" :label-width="formLabelWidth" prop="code">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="updateTable.code">
                    </el-input>  
              </el-form-item>  

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sub">确 定</el-button>
            </div>
          </el-dialog>
 
     </section> 
</template>

<script>
import listMixins from '@/mixins/list';
import listMixin from '@/mixins/form';
import va from "@/rules";
export default {
    mixins:[listMixins,listMixin],
  data() {
    let self = this;
    let required = va.required();
    return {
      code:'',
      dialogVisible: false,
      dialogFormVisible: false,
       rules: {
        //校验规则
      name:[required],
       },
      formLabelWidth: '120px',
      updateTable:[],
      params: {//只需要业务参数
        pageNo:'',
        pageSize:"",
      }
    };
  },methods:{
    view(val){
       this.dialogVisible=true;
       this.code=val;
    },
    sub(){
        this.$http.post(this.$api.directiveUpdate,this.updateTable).then(res=>{
             this.$alert(res.message, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                   
                }
                });
        })
        this.dialogFormVisible=false;
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    edit(id){
      this.$http.post(this.$api.directiveGet,{id:id}).then(res=>{
          this.updateTable=res.body;
          this.dialogFormVisible=true;
      })

    }
  },
  created(){
     this.initTableData(this.$api.directiveList,this.params);
  }
};
</script>
    
<style>

</style>