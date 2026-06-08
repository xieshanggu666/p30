export default{
    name:'formConfig',
    data(){
        return{
            oneForm:{
                  handleVisitClose:()=>{
                    console.log('关闭触发',122);
                    this.oneForm.titles = '新增项目';
                    this.oneForm.visitDialogVisible = false;
                    this.oneForm.formConfig.disabled = false;
                    this.oneForm.ruleForm=this.$options.data().oneForm.ruleForm;
                  },
                  visitDialogVisible:false,
                  titles:'新增项目',
                  formConfig: {
                    disabled:false,            //禁用整个form表单
                    formStyle: {
                      colnum: "2", // 每行显示几列
                    },
                    items: [
                      {
                        valueType: "input",      // 类型输入框
                        label: "项目名称",
                        col:2,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "项目地址",
                        col:2,
                        disabled:false,
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "项目简介",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "switch",      // 类型输入框
                        label: "是否启用",
                        col:2,
                        disabled:false,
                        key: "qiyong",          // 表单key值
                        prop: "qiyong",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "upload",      // 类型输入框
                        label: "图片",
                        col:2,
                        limit:3, //最多上传3张
                        hidden:(form)=>{
                         
                        },
                        key: "imgurl",          // 表单key值
                        prop: "imgurl",         // 必传验证
                        disabled:false,
                      },
                      // {
                      //   valueType: "input",      // 类型输入框
                      //   inputType:'number',
                      //   label: "床位每天价格",
                      //   key: "price",          // 表单key值
                      //   prop: "price",         // 必传验证
                      //   placeholder: "请输入床位每天价格", // 提示信息
                      //   maxNum: 99999999,
                      //   fn: (data)=>{
                      //     if(data.length > 8){
                      //       this.$set(this.ruleForm, 'price', data.slice(0,8));
                      //     }
                      //   }
                      // }
                    ]
                  },
                  ruleForm: {
                      acreage:'',
                      name:'',
                      qiyong:true,
                      imgurl:'',
                      price:'',
                  },
                  buttonConfig: {
                    position: "flex-end",
                    //validateAll: ["ruleForm"],  多表单验证 提交 ruleForm与 publicForm的ref必须一致
                    buttons: [
                      {
                        type: "save",
                        loading: false,
                        fn: data => {
                          let dataus = JSON.parse(JSON.stringify(data));
                          console.log('dataus',dataus);
                          return false  
                          this.$http
                              .post(this.$api.addRoomType, dataus)
                              .then(res => {
                                if (res.statusCode === 200) {
                                  this.$message({message: '保存成功', type: 'success'}) 
                                  this.setSearchParams();
                                  this.oneForm.handleVisitClose();
                                }
                              });
                        }
                      },
                      {
                        type: "back",
                        fn: data => {
                          this.oneForm.handleVisitClose();
                        }
                      }
                    ]
                  },
                  rules: {
                      name: [
                       {required: true, message: '请输入人员姓名', trigger: 'blur'}
                      ],
                      acreage: [
                       {required: true, message: '请输入联系电话', trigger: 'blur'}
                      ],
                      price: [
                       {required: true, message: '请输入备注信息', trigger: 'blur'}
                      ]
                  },
            }
        }
    }
}