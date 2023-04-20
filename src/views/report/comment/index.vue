<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="90px">
          <el-form-item label="评论关键字" prop="title">
            <el-input
              v-model="queryParams.content"
              placeholder="请输入评论关键字"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="用户昵称" prop="summary">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入用户昵称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete"
            >删除</el-button>
          </el-col>

          <!-- <right-toolbar
            :show-search.sync="showSearch"
            :columns="columns"
            @queryTable="getList"
          /> -->
        </el-row>

        <el-table :data="commentList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="记录序号" align="center"/>
          <el-table-column prop="nickName" label="被举报人昵称" align="center" />
          <el-table-column prop="reportCategoryName" label="举报类别" align="center" />
          <el-table-column prop="reportDescription" label="具体描述" align="center" />
          <el-table-column prop="summary" label="举报人信誉值" align="center" />
          <el-table-column :show-overflow-tooltip="true" prop="content" label="举报评论内容" align="center" />
          <el-table-column prop="createTime" label="举报时间" align="center" />

          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >处理</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      :page-size.sync="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="queryParams.pageNum"
      @current-change="getList"
      @size-change="getList"
    />
    <!-- 处理对话框 -->
    <el-dialog title="处理举报评论" :visible.sync="open" width="80%">
      <el-container class="comment-container">
        <el-main>
          <p class="article-text" v-html="form.content"></p>
        </el-main>
        <el-aside width="30%">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <h3>举报描述</h3>
            </el-col>
          </el-row>
          <el-row class="comment-report-span" :gutter="20">
            <el-col :span="6" :offset="0">
              <span>举报类型</span>
            </el-col>
            <el-col :span="18" :offset="0">
              <span style="color:tomato">{{ form.reportCategoryName }}</span>
            </el-col>
          </el-row>
          <el-row style="padding-bottom: 10px;border-bottom:1px solid #c5c5c5" class="comment-report-span" :gutter="20">
            <el-col :span="6" :offset="0">
              <span>具体描述</span>
            </el-col>
            <el-col :span="18" :offset="0">
              <span style="color:tomato">{{ form.reportDescription }}</span>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <h3>处理结果</h3>
            </el-col>
          </el-row>
          <el-row class="comment-report-span" :gutter="20">
            <el-col  :span="9" :offset="0">
              <span >是否存在违规内容</span>
            </el-col>
            <el-col :span="15" :offset="0">
              <el-radio-group v-model="form.repFlag">
                <el-radio :key="1" :label="1" >存在</el-radio>
                <el-radio :key="0" :label="0" >不存在</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="comment-report-span" :gutter="20">
            <el-col :span="12" :offset="0">
              <span>违规描述</span>
            </el-col>
          </el-row>
          <el-row v-show="form.repFlag" :gutter="20">
            <el-col :span="24" :offset="0">
              <el-input
                type="textarea"
                resize="none"
                :rows="6"
                placeholder="请输入内容"
                v-model="form.reportResult">
              </el-input>
            </el-col>
          </el-row>
          <div style="text-align:center;margin-top:20px">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-aside>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
import {
  listComment,
  getComment,
  updateRecord,
}
from '@/api/report/comment'

export default {
  name: 'ReportComment',
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        content: undefined,
        type: 1,
      },
      title: '',
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 0,
      commentList: [],
      showSearch: true,
      // 表单参数
      form: {},
    }
  },
  watch: {},
  created() {
    this.getList()
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        reportDescription:null,
        reportCategoryName:null,
        content:null,
        repFlag:null,
        reportResult:null,
        id:null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //确认修改
    submitForm(){
      updateRecord(this.form).then((response)=>{
        this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listComment(this.queryParams).then((response) => {
        this.commentList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
    this.reset()
    // this.getTreeselect()
    getComment(row.id).then(response => {
      this.form.content = response.content
      this.form.reportCategoryName = response.reportCategoryName
      this.form.reportDescription = response.reportDescription
      this.form.id = response.id
      this.open = true
      this.title = '处理举报评论'
    })
  },
    /** 新增用户 */
    handleAdd() {
      this.$router.push('/write')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除分类编号为"' + ids + '"的数据项？').then(function() {
        return delArticle(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less">
.comment-container .comment-report-span{
  margin: 10px 0;
  span{
    font-size: 14px;
    font-weight: 600;
    // color: #c5c5c5;
  }
}
.comment-container .el-aside{
  padding-left: 10px;
  overflow-x: hidden;
}
.comment-container .el-main{
  height: 50vh;
  background-color: rgb(236, 236, 236);
}
.comment-container .article-text{
  line-height: 1.6;
  line-height: 1.6;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
  