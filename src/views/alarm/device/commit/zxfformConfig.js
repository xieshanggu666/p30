export default{
    name:'formConfig',
    data(){
        return{
            zxfForm:{
                  handleVisitClose:()=>{
                    this.zxfForm.titles = '新增';
                    this.zxfForm.visitDialogVisible = false;
                    this.zxfForm.formConfig.disabled = false;
                    this.zxfForm.ruleForm=this.$options.data().zxfForm.ruleForm;
                  },
                  visitDialogVisible:false,
                  titles:'新增',
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
                        label: "故障记录",
                        col:2,
                      },
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