<template>
  <div class="config-management-container">
    <!-- 顶部搜索栏 + 按钮 -->
    <div class="top-bar">
      <el-input
        v-model="Name"
        placeholder="请输入配置名称搜索"
        style="width: 300px; margin-right: 10px"
        clearable
      />
      <el-button type="primary" @click="handleSearch" style="margin-left: 30px;">查询</el-button>
      <el-button type="success" @click="openAddModal" style="margin-left: 10px">新增配置</el-button>
    </div>

    <!-- 主表格 -->
    <div class="table_box">
      <el-table :data="data.list" height="100%" >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="公式编号" prop="Code" align="center" />
        <el-table-column label="公式名称" prop="Name" align="center" />
        <el-table-column label="公式详情" align="center">
          <template #default="scope">
            {{JSON.parse(scope.row.Config).formula}}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="Comment" align="center" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.ID)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-block">
      <el-pagination
        :currentPage="queryParmas.page"
        :page-size="queryParmas.rows"
        :page-sizes="[30, 60, 90, 120]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <addModal ref="addDialog" @refresh="getData()"></addModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from "@/api/http.js";
import addModal from './modal/addDialog.vue'
// 搜索
const addDialog = ref();
const Name = ref('')
const data = reactive({
  list:[],
  total:0
})
const queryParmas = reactive({
  order: "desc",
  page: 1,
  rows: 30,
})
// 新增/编辑弹窗
const openAddModal = () => {
  addDialog.value.open()
}

// 搜索
const handleSearch = () => {
  queryParmas.page = 1;
  getData()
}

// 编辑
const handleEdit = (row) => {
  addDialog.value.open(row)
}

// 删除
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该公示？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  http
    .post("/api/mon_formula_config/del",[id], true)
    .then((res) => {
      if(res.status) {
        ElMessage.success('删除成功！')
      }else {
        ElMessage.error(res.msg || '操作失败')
      }
      handleSearch()
    });
  
}

const handleSizeChange = (val) => {
  queryParmas.page = 1;
  queryParmas.rows = val
  getData()
}
const handleCurrentChange = (val) => {
  queryParmas.page = val;
  getData()
}
const getData = () => {
  const parmas = JSON.parse(JSON.stringify(queryParmas))
  if(Name.value) {
    const wheres = {name:'Name',value:Name.value}
    parmas.wheres = JSON.stringify([wheres])
  }
  http
    .post("/api/mon_formula_config/getPageData", parmas, true)
    .then((res) => {
      data.list = res.rows;
      data.total = res.total;
    });
}
onMounted(()=>{
  handleSearch()
})
</script>

<style scoped>
.config-management-container {
  padding: 20px;
  background: #fff;
  height: calc(100% - 10px);
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
}
.pagination-block {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.config-item {
  background: #f7f8fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.detail-text {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}

.preview-content {
  white-space: pre-wrap;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
}

.dialog-footer {
  text-align: right;
}
.table_box {
  flex: 1;
  overflow: hidden;
  margin-top: 20px;
}
</style>