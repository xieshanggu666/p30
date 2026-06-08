<template>
  <el-dialog
    title="公式计算器配置"
    v-model="visible"
    width="1050px"
    @close="resetForm"
  >
    <el-form :model="form" ref="formRef">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label-width="80px" label="测值1(x)">
            <el-input
              v-model.number="form.x"
              type="number"
              placeholder="请输入测值1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="80px" label="测值2(y)">
            <el-input
              v-model.number="form.y"
              type="number"
              placeholder="请输入测值2"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label-width="80px" label="公式名称" prop="Name" :rules="[
            {
              required: true,
              message: '请输入公式名称',
              trigger: 'blur',
            }
          ]">
            <el-input v-model="form.Name" placeholder="请输入公式名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="80px" label="公式编号" prop="Code" :rules="[
            {
              required: true,
              message: '请输入公式编号',
              trigger: 'blur',
            }
          ]">
            <el-input v-model="form.Code" placeholder="请输入公式编号" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label-width="80px" label="公式内容" prop="formula" :rules="[
            {
              required: true,
              message: '请输入基础公式内容',
              trigger: 'blur',
            }
          ]">
            <el-input  v-model="form.formula" placeholder="输入基础公式，公式内容必须包含x,y，例如：k*(x - F0) + b*(y - T0)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label-width="80px" label="公式备注">
            <el-input show-word-limit  type="textarea" v-model="form.Comment" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="config-section">
        <div class="section-title">系数配置项</div>
        <div class="config-list">
          <div
            class="config-item"
            v-for="(item, index) in form.configList"
            :key="index"
          >
            <el-row :gutter="10" align="middle">
              <el-col :span="6">
                <el-form-item label="系数名称" :prop="`configList[${index}].coeName`"  
                :rules="[                           
                  { required: true, message: '名称不能为空', trigger: 'blur' }
                ]">
                  <el-input v-model="item.coeName" readonly  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="系数初始值" :prop="`configList[${index}].coeNum`"  
                :rules="[                           
                  { required: true, message: '系数初始值不能为空', trigger: 'blur' }
                ]">
                  <el-input
                    v-model="item.coeNum"
                    type="number"
                    placeholder="示例：1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系数描述">
                  <el-input
                    v-model="item.coeIntro"
                    placeholder="系数描述"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="section-title" style="margin-top: 20px;" v-if="form.formula">
          公式计算结果 
          <span :class="{ 'error-text': formulaResult.error }">{{ formulaResult.value }}</span>
        </div>
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
import { ref, reactive, watch, defineExpose } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElButton, ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import { evaluate, parse,format } from 'mathjs'
import http from "@/api/http.js";

// 防抖函数
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

const emit = defineEmits(['update:modelValue', 'save'])
const formRef = ref(null)
const visible = ref(false)
// 编辑时 第一次进页面不调用系数监听
const editFlag = ref(false); 
// 公式计算结果
const formulaResult = reactive({
  value: '', // 显示的结果文本
  error: false // 是否是错误状态
})

// 初始化表单数据
const form = reactive({
  Name: '',
  Comment: '',
  Code: '',
  formula: '',
  x: 10,
  y: 12,
  configList: []
})

// 打开弹窗（编辑回显）
const open = (row) => {
  visible.value = true
  // 编辑回显
  if (row && row.ID) {
    editFlag.value = true;
    form.ID = row.ID
    form.Name = row.Name || ''
    form.Comment = row.Comment || ''
    form.Code = row.Code
    form.formula = JSON.parse(row.Config).formula
    form.configList = JSON.parse(row.Config).configList
    // 如果有公式内容，触发系数提取
    if (row.formula) {
      form.formula = row.formula
      debouncedExtract(row.formula)
    }
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, {
    Name: '',
    Code: '',
    Comment: '',
    ID: '',
    formula: '',
    configList: []
  })
  // 重置数据
  editFlag.value = false;
  formulaResult.value = ''
  formulaResult.error = false
}

// 确认保存
const handleConfirm = async () => {
  try {
    await formRef.value.validate()
    if(formulaResult.error) {
      ElMessage.error(formulaResult.value)
      return
    }
    const apiUrl = form.ID 
      ? '/api/mon_formula_config/update' 
      : '/api/mon_formula_config/Add' 
    
    const parmas = {
      delKeys: null,
      detailData: null,
      mainData: {
        ID: form.ID,
        Name: form.Name,
        Comment: form.Comment,
        Code: form.Code,
        Config: JSON.stringify({
          formula:form.formula, //公式内容
          configList:form.configList, //系数信息
        })
      }
    }
    const res = await http.post(apiUrl, parmas, true)

    if (res.status) {
      ElMessage.success(form.ID ? '编辑成功' : '新增成功')
      visible.value = false
      emit('refresh')
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('表单校验失败：', error)
  }
}

/**
 * 提取数学公式中所有系数
 * @param {string} formulaStr - 数学公式字符串
 * @returns {Array} 系数数组
 */
const extractFormulaCoefficients = (formulaStr) => {
  const variableRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g
  const allVariables = formulaStr.match(variableRegex) || []
  if (allVariables.indexOf('x')==-1 || allVariables.indexOf('y')==-1) {
    ElMessage.error('公式必须同时包含变量 x 和 y！')
    return []
  }
  const coefficients = allVariables.filter(item => item !== 'x' && item !== 'y')
  return [...new Set(coefficients)]
}

// 防抖提取系数
const debouncedExtract = debounce((val) => {
  const res = extractFormulaCoefficients(val)
  const arr = [];
  if (res && res.length > 0) {
    for (let i in res) {
      let obj = {
        coeName: res[i],
        coeNum: undefined,
        coeIntro: '',
      }
      arr.push(obj)
    }
    form.configList = JSON.parse(JSON.stringify(arr));
  } else {
    form.configList = []
  }
  // 提取系数后触发公式计算校验
  calculateFormulaResult()
}, 500)

/**
 * 公式计算核心方法：验证公式、校验参数、计算结果
 */
const calculateFormulaResult = () => {
  try {
    const formulaStr = form.formula.trim()
    if (!formulaStr) {
      formulaResult.value = ''
      formulaResult.error = false
      return
    }
    parse(formulaStr)
    if (form.x === undefined || form.x === null || isNaN(form.x) ||
        form.y === undefined || form.y === null || isNaN(form.y)) {
      formulaResult.value = '系数值与测值未填写完成'
      formulaResult.error = true
      return
    }
    const hasEmptyCoe = form.configList.some(item => 
      item.coeNum === undefined || item.coeNum === null || isNaN(item.coeNum)
    )
    if (hasEmptyCoe) {
      formulaResult.value = '系数值与测值未填写完成'
      formulaResult.error = true
      return
    }
    const calcParams = {
      x: Number(form.x),
      y: Number(form.y)
    }
    form.configList.forEach(item => {
      calcParams[item.coeName] = Number(item.coeNum)
    })

    // 执行计算
    const result = evaluate(formulaStr, calcParams)
    formulaResult.value = format(result, { notation: 'fixed', precision: 2 })
    formulaResult.error = false

  } catch (error) {
    // 公式语法错误
    formulaResult.value = '公式有误'
    formulaResult.error = true
    console.error('公式计算错误：', error)
  }
}

// 防抖执行公式计算（避免频繁计算）
const debouncedCalculate = debounce(calculateFormulaResult, 500)

// 监听公式、测值、系数变化，触发计算
watch([() => form.formula, () => form.x, () => form.y, () => form.configList], () => {
  debouncedCalculate()
}, { deep: true })

// 初始监听公式变化提取系数
watch(
  () => form.formula,
  (val) => {
    if(editFlag.value) {
      editFlag.value = false;
      return
    }
    if (val) {
      debouncedExtract(val)
    } else {
      form.configList = []
      formulaResult.value = ''
      formulaResult.error = false
    }
  }
)

defineExpose({ open })
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
/* 错误文本样式 */
.error-text {
  color: #f56c6c;
}
</style>