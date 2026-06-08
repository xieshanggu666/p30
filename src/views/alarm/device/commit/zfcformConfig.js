export default{
    name:'formConfig',
    data(){
        return{
            zfcForm:{
                  handleVisitClose:()=>{
                    this.zfcForm.titles = '暂封存详情';
                    this.zfcForm.visitDialogVisible = false;
                    this.zfcForm.formConfig.disabled = false;
                    this.zfcForm.ruleForm=this.$options.data().zfcForm.ruleForm;
                  },
                  visitDialogVisible:false,
                  titles:'暂封存详情',
                  ruleForm: {
                      clstatus:1,
                      acreage:'',
                      name:'',
                      price:'',
                      imgurl:'Upload/Tables/Sys_User/202505151015277612/cpg.png,Upload/Tables/Sys_User/202505151128528376/zfj.png',//
                  },
                  formConfig: {
                    disabled:false,            //禁用整个form表单
                    formStyle: {
                      colnum: "2", // 每行显示几列
                    },
                    items: [
                      {
                        valueType: "input",      // 类型输入框
                        label: "项目名称",
                        col:1,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "部位名称",
                        disabled:true,
                        hidden:(form)=>{
                          //return 1==1
                        },
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "采集设备",
                        col:1,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "采集设备编号",
                        col:1,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "测点名称",
                        col:1,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "测点编号",
                        col:1,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        //inputType:'number',
                        disabled:true,
                        label: "故障时间",
                        key: "price",          // 表单key值
                        prop: "price",         // 必传验证
                        placeholder: "请输入", // 提示信息
                        //maxNum: 99999999,
                        fn: (data)=>{
                          // if(data.length > 8){
                          //   this.$set(this.ruleForm, 'price', data.slice(0,8));
                          // }
                        }
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "故障内容",
                        col:2,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "title",      // 类型输入框
                        label: "是否封存：已封存",
                        col:2,
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "封存原因",
                        col:2,
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "封存时间",
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "封存人",
                        disabled:true,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "upload",      // 类型输入框
                        label: "图片",
                        disabled:true,
                        col:2,
                        limit:3, //最多上传3张
                        key: "imgurl",          // 表单key值
                        prop: "imgurl",         // 必传验证
                        disabled:false,
                      }
                    ]
                  },
                  buttonConfig: {
                    position: "flex-end",
                    //validateAll: ["ruleForm"],  多表单验证 提交 ruleForm与 publicForm的ref必须一致
                    buttons: [
  
                    ]
                  },
                  rules: {

                  },
            }
        }
    }
}