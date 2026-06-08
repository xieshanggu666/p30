<template>
  <el-dialog
    title="公式计算器配置"
    v-model="visible"
    width="1050px"
    @close="resetForm"
  >
    <el-form :model="form" ref="formRef">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label-width="80px" label="测值1(x)">
            <el-input
              v-model.number="form.x"
              type="number"
              placeholder="请输入测值1"
              @input="handleVarChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="数据源">
            <el-select v-model="form.xdata" filterable>
              <el-option v-for="(item,index) in pointList" :key="index" :label="item.Point_Name" :value="item.Point_Num"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="对应key">
            <el-select v-model="form.xkey" filterable>
              <el-option v-for="(item,index) in ['V1','V2','V3','V4','V5','V6']" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label-width="80px" label="测值2(y)">
            <el-input
              v-model.number="form.y"
              placeholder="请输入测值2"
              @input="handleVarChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据源">
            <el-select v-model="form.ydata" filterable>
              <el-option v-for="(item,index) in pointList" :key="index" :label="item.Point_Name" :value="item.Point_Num"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="对应key">
            <el-select v-model="form.ykey" filterable>
              <el-option v-for="(item,index) in ['V1','V2','V3','V4','V5','V6']" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="config-section">
        <div class="section-title">公式配置项</div>
        <div class="config-list">
          <div
            class="config-item"
            v-for="(item, index) in form.configList"
            :key="index"
          >
            <el-row :gutter="10" align="middle">
              <el-col :span="7">
                <el-form-item label="名称" :prop="`configList[${index}].name`"  
                :rules="[                           
                  { required: true, message: '名称不能为空', trigger: 'blur' }
                ]">
                  <el-input v-model="item.name" placeholder="示例：偏移量" />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="公式模版" :prop="`configList[${index}].temp`"  
                :rules="[                           
                  { required: true, message: '公式模版不能为空', trigger: 'change' }
                ]">
                  <el-select v-model="item.temp" clearable @change="(val) => selectTemp(val, item, index)" filterable>
                    <el-option v-for="(item,index) in list" :key="index" :label="item.Name" :value="item.Config"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="计算结果">
                  <el-input
                    v-model="item.result"
                    placeholder="等待计算"
                    readonly
                    :class="{ 'error-result': item.result === '表达式错误' }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-button
                    style="margin-left: 20px;"
                    type="danger"
                    @click="handleDelete(index)"
                    :icon="Delete"
                  >
                    删除
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="item.temp">
              <e-row :gutter="10" align="middle">
                <el-col :span="24">
                  <el-form-item label="公式">
                    <el-input v-model="item.formula" readonly  />
                  </el-form-item>
                </el-col>
              </e-row>
            </div>
            <div v-for="(te,i) in item.list" :key="i">
              <el-row :gutter="10" align="middle">
                <el-col :span="6">
                  <el-form-item label="系数">
                    <el-input v-model="te.coeName" readonly  />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="系数值" :prop="`configList[${index}].list[${i}].coeNum`" :rules="[                           
                  { required: true, message: '系数值不能为空', trigger: 'blur' }
                ]">
                    <el-input
                      v-model="te.coeNum"
                      type="number"
                      placeholder="示例：1"
                      @input="handleVarChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="系数介绍" >
                    <el-input
                    v-model="te.coeIntro"
                    placeholder="系数描述"
                    readonly
                  />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <el-button
          type="success"
          class="add-btn"
          @click="handleAdd"
          :icon="Plus"
        >
          新增公式配置项
        </el-button>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="handleConfirm">确认保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive,defineExpose,watch } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElButton, ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { evaluate, parse,format } from 'mathjs'
import http from "@/api/http.js";

const emit = defineEmits(['refresh'])
const formRef = ref(null)
const visible = ref(false)
const list = ref([]);
const pointList = ref([]);
const open = (row) => {
  fetchFormulaConfig()
  getPointList(row)
  form.x = 10;
  form.y = 12;
  form.xdata = row.Point_Num;
  form.ydata = row.Point_Num;
  form.xkey = 'V1';
  form.ykey = 'V2';
  form.configList = [];
  visible.value = true
  // 编辑回显
  if (row && row.Formula_Config) {
    form.configList = JSON.parse(row.Formula_Config).configList;
    form.xdata = JSON.parse(row.Formula_Config).xdata;
    form.ydata = JSON.parse(row.Formula_Config).ydata;
    form.xkey = JSON.parse(row.Formula_Config).xkey;
    form.ykey = JSON.parse(row.Formula_Config).ykey;
    calculateAllResults()
  }
}
const fetchFormulaConfig = async () => {
await http
    .post("/api/mon_formula_config/getPageData", {
        order: "desc",
        page: 1,
        rows: 999,
    }, true)
    .then((res) => {
        list.value = res.rows;
    })
    .catch(err => {
        // 增加错误捕获，避免请求失败导致逻辑中断
        console.error("拉取公式配置失败：", err);
    });
};
const getPointList = async (row) => {
  const wheres = [{name:'Group_Id',value:row.Group_Id}]
  let parmas = {
    "page": 1,
    "rows": 30,
    "sort": "Point_Order",
    "order": "asc",
    "wheres": JSON.stringify(wheres)
  }
  await http.post('/api/Mon_Point_Manager/getPageData',parmas,false).then(res=>{
    pointList.value = res.rows;
  })
}
// 初始化表单数据
const form = reactive({
  x: 10,
  y: 12,
  xdata:'',
  ydata:'',
  xkey:'',
  ykey:'',
  unit:'',
  configList: []
})
// 计算单个配置项的结果
const calculateSingleResult = (item) => {
  if (!item.formula.trim()) {
    item.result = ''
    return
  }
  try {
    parse(item.formula)
    const scope = {
      x: form.x,
      y: form.y
    }
    item.list.forEach(ele => {
      scope[ele.coeName] = Number(ele.coeNum)
    })
    const res = evaluate(item.formula, scope)
    let expressionStr = item.formula;
    item.list.forEach(ele => {
      const reg = new RegExp(ele.coeName, 'g')
      expressionStr = expressionStr.replace(reg, ele.coeNum)
    })
    item.expression = expressionStr;
    // 结果格式化（避免科学计数法）
    item.result = Number.isFinite(res) ? format(res, { notation: 'fixed', precision: 2 }) : '表达式错误'
  } catch (e) {
    console.warn('表达式解析错误:', e)
    item.result = '表达式错误'
  }
}

// 计算所有配置项的结果
const calculateAllResults = () => {
  form.configList.forEach(item => {
    calculateSingleResult(item)
  })
}

// 变量x/y变化时，重新计算所有结果
const handleVarChange = () => {
  calculateAllResults()
}
// 选择公式模版
const selectTemp = (val,item,index) =>  {
  if(val) {
    form.configList[index].formula  = JSON.parse(val).formula
    form.configList[index].list  = JSON.parse(val).configList
  }
  else {
    form.configList[index].formula = ''
    form.configList[index].list = []
  }
  calculateAllResults()
}
// 新增配置项
const handleAdd = () => {
  form.configList.push({
    name: '',
    temp: '',
    result: '',
    formula: '',
    list:'',
  })
}

// 删除配置项
const handleDelete = (index) => {
  form.configList.splice(index, 1)
}

// 确认保存
const handleConfirm = async () => {
  try {
    // 1. 整体表单校验
    await formRef.value.validate()
    // 2. 配置项逐个校验
    let configValid = true
    form.configList.forEach((item, index) => {
      if (!item.name  || !item.temp) {
        configValid = false
        ElMessage.error(`第${index + 1}条配置项不能为空`)
      }
    })
    if (!configValid) return
    console.log(form.configList,'内容')
    emit("parentCall", ($parent) => {
        if(form.configList&&form.configList.length>0) {
          let obj = {
            configList:form.configList,
            xdata:form.xdata,
            xkey:form.xkey,
            ydata:form.ydata,
            ykey:form.ykey
          }
          $parent.editFormFields.Formula_Config = JSON.stringify(obj);
        }
        else {
          $parent.editFormFields.Formula_Config = '';
        }
    });
    visible.value = false;
  } catch (error) {
    console.error('表单校验失败：', error)
  }
}
defineExpose({open})
</script>

<style scoped>
.config-section {
  margin-top: 20px;
}
.section-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}
.config-list {
  border-radius: 4px;
}
.config-item {
  border-radius: 4px;
  padding: 20px 15px 0;
  background: #F8FAFF;
  border: 1px solid #E1E7F6;
  margin-bottom: 10px;
}
.config-item:last-child {
  margin-bottom: 0;
}
.add-btn {
  margin-top: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.error-result :deep(.el-input__inner) {
  color: #f56c6c;
}
</style>