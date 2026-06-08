<template>
  <div :style="{ width: width || '100%' }">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      :disabled="formConfig.disabled || false"
      :label-width="formConfig.formStyle.labelWidth || 'auto'"
      :label-position="formConfig.labelPosition|| 'right'"
    >
      <div class='pad20'  :style="setFormStyle(formConfig.formStyle)">
        <template  v-for="(item, index) in formConfig.items" :key="index">
          <!-- 标题 -->
          <div class="buibotit" v-if="item.valueType === 'title'&&(item.hidden?(!item.hidden(formData)):true)"  :style="{
              gridRowStart: `span ${item.row || '1'}`,
              gridColumnStart: `span ${item.col || '1'}`
            }">
               {{item.label}}
          </div>
          <div
            :class="[item.display?'displays':'', item.className ? item.className : '']"
            v-if="item.valueType!='title'&&(item.hidden?(!item.hidden(formData)):true)"
            :style="{
              gridRowStart: `span ${item.row || '1'}`,
              gridColumnStart: `span ${item.col || '1'}`
            }"
          >  
            <el-form-item
              :prop="item.prop || item.prop1"
              :label-width="item.labelWidth?item.labelWidth:''"
              :class="item.itemClass ? item.itemClass : ''"
              :label="item.label"
            >
              <!-- 具名插槽 -->
              <div v-if="item.valueType === 'slot'">
                <slot :name="item.slotName"></slot>
              </div>
             
              <!-- input 输入框-->
              <el-input
                :style="{
                  width: item.inputWidth
                    ? item.inputWidth
                    : formConfig.formStyle.inputWidth
                    ? formConfig.formStyle.inputWidth
                    : '100%' 
                }"
                :disabled="item.disabled"
                :class="{ isNone: item.labelClass ? true : false }"
                @change="item.fn ? item.fn(formData[item.key], formData) : ''"
                :maxlength="item.maxlength || 30"  
                v-if="item.valueType === 'input'&&(item.hidden?(!item.hidden(formData)):true)"
                :show-password="item.noShowPassword ? false : (item.inputType=='password'? true:false)"
                :type="item.inputType || 'text'"
                :min="item.minNum !== undefined ? item.minNum : ''"
                :max="item.maxNum !== undefined ? item.maxNum : ''"
                v-model="formData[item.key]"
                :placeholder="item.placeholder || '请输入' + item.label"
                clearable
                @clear="clearFn(item)"
              >
              </el-input>
              <!-- textarea 多行输入框-->
              <el-input
                @change="item.fn ? item.fn(formData[item.key], formData) : ''"
                :maxlength="item.maxlength || 200"
                :rows="item.rows || 1"
                :style="{
                  width: item.inputWidth
                    ? item.inputWidth
                    : formConfig.formStyle.inputWidth
                    ? formConfig.formStyle.inputWidth
                    : '100%'
                }"
                v-if="item.valueType === 'textarea'"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 2}"
                show-word-limit
                v-model="formData[item.key]"
                :disabled="item.disabled"
                :placeholder="item.placeholder || '请输入' + item.label"
              ></el-input>
              <!-- select 下拉框 -->
              <div v-if="item.valueType === 'select'">
                  <el-select
                  :style="{
                    width: item.inputWidth
                      ? item.inputWidth
                      : formConfig.formStyle.inputWidth
                      ? formConfig.formStyle.inputWidth
                      : '100%'
                  }"
                  :disabled="item.disabled"
                  :filterable="item.filterable || false"
                  :multiple="item.multiple || false"
                  :remote="item.remote || false"
                  :clearable="item.clearable != undefined ? item.clearable : true"
                  @change="item.fn ? item.fn(formData[item.key], formData,item.data) : ''"
                  v-model="formData[item.key]"
                  :placeholder="item.placeholder || '请选择' + item.label"
                >
                  <el-option  
                    v-for="(i, index) in item.data"
                    :key="index"
                    :disabled="item.option ? item.option['disabled'] : (i.disabled ? i.disabled : false)"
                    :label="item.option && i[item.option['label']] ? i[item.option['label']] : i.itemName"
                    :value="item.option && i[item.option['value']] ? i[item.option['value']] : i.itemValue"
                  ></el-option>
                </el-select>
              </div>
              <!-- radio 单选框-->
              <el-radio-group
                :disabled="item.disabled"
                @change="item.fn ? item.fn(formData[item.key], formData) : ''"
                v-if="item.valueType === 'radio'"
                v-model="formData[item.key]"
              >
                <el-radio
                  v-for="(its, index) in item.data"
                  :key="index"
                  :label="item.option?its[item.option['value']]:its.value"
                  >{{ item.option?its[item.option["label"]]:its.label }}</el-radio
                >
              </el-radio-group>
              <!-- Switch 开关 -->
              <el-switch v-if="item.valueType === 'switch'" v-model="formData[item.key]" />
              <!--日期 或 日期时间 选择器-->
              <el-date-picker
                    v-if="item.valueType === 'datetime' ||
                      item.valueType === 'date' ||
                      item.valueType === 'month'"
                      v-model="formData[item.key]"
                      :type="item.valueType === 'datetime'? 'datetime'
                      :item.valueType === 'date'? 'date': 'month'"
                      :value-format="item.valueType === 'datetime'? 'YYYY-MM-DD HH:mm:ss': item.valueType === 'date'? 'YYYY-MM-DD': 'month'"
                      :placeholder="item.placeholder || '请选择'"
                  >
              </el-date-picker>
              <!-- 上传图片 -->
              <el-upload
                v-if="(item.valueType === 'upload')&&!(item.disabled?true:formConfig.disabled?true:false)"
                v-model:file-list="fileList"
                :disabled="item.disabled || false"
                :limit="item.limit || 1" 
                list-type="picture-card"
                :http-request="(e)=>{handleCustomUpload(e,item)}" 
                :on-preview="handlePictureCardPreview"
                :on-remove="(v1,v2)=>{handleRemove(v1,v2,item)}"
                :on-exceed="(e)=>{handleExceed(e,item.limit) } "
                :before-upload="beforeUpload"
              > 
                <i class="el-icon-plus"></i>
              </el-upload>
              <div  v-if="(item.valueType === 'upload')&&(item.disabled?true:formConfig.disabled?true:false)" >
                <el-image class="mr10" v-for="(item,index) in showUrl(formData[item.key])" :key="index" 
                 :preview-src-list="[item]" 
                  style="width: 100px; height: 100px" :src="item" fit="cover" />
              </div>
            </el-form-item>
          </div>
        </template>

      </div>
      <!-- 表单按钮配置 -->
      <div class='formbtns' v-if="!formConfig.disabled">
        <div  v-for="(i, index) in buttonConfig.buttons" :key="index">
          <el-button
            v-if="i.type === 'save' && i.show !== false"
            :disabled="i.disabled || false"
            :loading="i.loading"
            :type="i.btnType ? i.btnType : 'primary'"
            @click="beforeSubmit('formData', i.fn, i)"
            >{{ i.title || "确定" }}
          </el-button>
          <el-button
            v-if="i.type === 'back' && i.show !== false"
            :disabled="i.disabled || false"
            :loading="i.loading"
            class="resetBtn"
            @click="goBack(i, 'formData')"
            >{{ i.title || "取消" }}</el-button>
        </div>
      </div>
    </el-form>


    <el-image-viewer
        v-if="showPreview"
        :url-list="[dialogImageUrl]"
        show-progress
        :initial-index="0"
        @close="showPreview = false"
    />

  </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
let timese=null;
let isObj={};
export default {
  name: "publicForm",
  props: ["width","rules","ruleForm","formConfig","buttonConfig"],
  data() {
    return {
      showPreview:false,//图片预览
      dialogImageUrl:'', //图片预览地址
      fileList:[]
    };
  },
  computed: {
    formData: {
      // 表单配置
      get: function() {
        if (this.$refs.formData) {
          this.$refs.formData.clearValidate();
        }
        return this.ruleForm;
      },
      set: function(newValue) {
        return newValue;
      }
    }
  },
  created() {
      //图片反显
      this.imgShow();
  },
  methods: {
      //图片反显
      imgShow(){
        this.formConfig.items.forEach(item=>{
          if(item.valueType=='upload'){
            this.fileList=[];
            if(this.formData[item.key]==''||!this.formData[item.key]){
              this.fileList=[]
            }else{
              const imgarr =this.formData[item.key].split(','); 
              this.fileList=imgarr.map(item=>{
                return {url:this.http.ipAddress+item} 
              })
            }
          }
        })
      },
      /**
       * 图片上传 反显等相关方法
       */
      //图片详情状态反显图片
       showUrl(str){
        if(str==''||(!str)){return []}
        const arr = str.split(','); 
        return arr.map(item=>{
          return this.http.ipAddress+item
        })
       },
      //移除图片
      handleRemove (uploadFile, uploadFiles,item){
        let str='';
        this.fileList.forEach((item,index)=>{
          str+=item.url+','
        })
        str = str.replace(/,$/, ""); // "a,b,c"
        //去掉地址栏
        const jig = str.replaceAll(this.http.ipAddress, ""); // 替换所有匹配项
        this.formData[item.key]=jig;
      },
      //预览图片
      handlePictureCardPreview(uploadFile){
        this.dialogImageUrl = uploadFile.url
        this.showPreview=true;
      },
      //限制图片上传个数
      handleExceed(e,limit){
        ElMessage.warning(`最多只能上传${limit}个文件！`);//limit
      },
      //限制图片大小和类型
      beforeUpload(file){
        if (file.size > 5 * 1024 * 1024) {
          ElMessage.error("文件大小不能超过5MB！");
          return false;
        }
        return true;
      },
      // 可选：完全自定义上传逻辑
      async handleCustomUpload(options,items){
        const { file } = options;
        const formData = new FormData();
        formData.append("fileInput", file);  // 使用自定义字段名
        try {
          this.http.post('/api/Sys_User/Upload', formData, true).then((result) => {
               let str='';
               this.fileList.forEach((item,index)=>{
                  if(item.name==file.name){ item.url=this.http.ipAddress+result.data+file.name;}
                  str+=item.url+','
               })
               str = str.replace(/,$/, ""); // "a,b,c"
               //去掉地址栏
               const jig = str.replaceAll(this.http.ipAddress, ""); // 替换所有匹配项
               this.formData[items.key]=jig;
            });
        } catch (error) {
          console.error("上传失败", error);
        }
      },
      //设置表单样式
      setFormStyle(style) {
          let gridTemplateColumns;
          //每行显示几列
          if(style.colnum){
            gridTemplateColumns = `display: grid;gap: 18px;  grid-template-columns: repeat(${style.colnum}, 1fr)`;
          }else{//每行显示一列
            gridTemplateColumns = `display: grid;gap: 18px;  grid-template-columns: repeat(1, 1fr)`;
          }
          return gridTemplateColumns;
      },
      //提交表单验证
      beforeSubmit(formName, fn, i) {
        i.loading = true;
        const validateAll = this.buttonConfig.validateAll;
        if (validateAll && validateAll.length > 0) {
          // 需要验证多张表单
          this.formsValidate(validateAll, fn, i);
        } else {
          this.submitForm(formName, fn, i);
        }
      },
      //单表单验证
      submitForm(formName, fn, i) {
        this.$refs[formName].validate(valid => {
          if (valid&&fn) { 
              i.loading = true;
              if (!i.backLoading) {setTimeout(() => {i.loading = false;}, 1000);}  
              fn(this.formData);
          } else { 
              setTimeout(() => {i.loading = false;}, 1000);
              this.$message.error("请填写完所有必填项");
              return false;
          }
        });
      },
      // 多张表单验证
	    formsValidate(validateAll, fn, i) {
        isObj={}; //初始化
        //点击最外层表单
        this.xjcSubmit('formData',fn,false, i,'pub');
        this.$children[0].$children.forEach((item,index) => {
            if(item.$refs["formData"]){
              item.xjcSubmit('formData',fn, i,'cub'+index)
            }
        })
	    },
      //内嵌表单特殊处理
      xjcSubmit(formName, fn, i,names) {
        this.$refs[formName].validate(valid => {
          if (valid&&fn) { 
              isObj[names]=this.formData;
              if(JSON.stringify(isObj)!='{}'&&Object.values(isObj).every(value => value !== null)){
                if(timese){
                  clearTimeout(timese)
                }
                timese=setTimeout(() => {
                  i.loading = true;
                  fn(this.formData);
                }, 200);
                
              }  
          } else {
            isObj[names]=null;
            if(timese){clearTimeout(timese)}
            timese=setTimeout(() => {
              this.$message.error("请填写完所有必填项");
            }, 200);
            return false;
          }
        });
     },
      /* ----------------------表单重置--------------------- */
      goBack(i, formName) { //取消按钮
        if (i.fn) {i.fn(this.formData);}
        this.$refs[formName].resetFields();
      },
  }
};
</script>
  
<style lang="scss" scoped>
.formbtns{
  width: 100%;
  margin-top: 50px;
  display: flex;
  justify-content: right;
  .el-button--primary{
    background: #3570FC;

  }
  &>div{
    margin-left: 12px;
  }
}
.el-form-item--default{
  margin-bottom: 0px !important;
}
.el-form-item{
  margin-bottom: 0px !important;
}
.pad20{
  padding-bottom: 20px;
}
.buibotit{
  padding-top: 24px;
  border-top: 1px dashed #DCDFE6;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
}
.el-form-item__content{
  &>div{
    width: 100%;
  }
}
.mr10{
  margin-right: 10px;
}
::v-deep .el-date-editor.el-input, .el-date-editor.el-input__wrapper{
  width: 100%;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item{
  width: 80px;
  height: 80px;
}
::v-deep .el-upload--picture-card{
  width: 80px;
  height: 80px;
}
</style>
  