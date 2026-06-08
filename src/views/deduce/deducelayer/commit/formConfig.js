export default{
    name:'formConfig',
    data(){
        return{
            oneForm:{
                  handleVisitClose:()=>{
                    console.log('关闭触发',122);
                    this.oneForm.titles = '新增';
                    this.oneForm.visitDialogVisible = false;
                    this.oneForm.formConfig.disabled = false;
                    this.oneForm.ruleForm=this.$options.data().oneForm.ruleForm;
                  },
                  visitDialogVisible:false,
                  titles:'新增',
                  formConfig: {
                    disabled:false,            //禁用整个form表单
                    formStyle: {
                      colnum: "2", // 每行显示几列
                    },
                    items: [
                      {
                        valueType: "input",      // 类型输入框
                        label: "房间类型名称",
                        col:1,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入房间类型名称" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "面积大小",
                        disabled:false,
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入面积大小 单位㎡" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        inputType:'number',
                        label: "床位每天价格",
                        key: "price",          // 表单key值
                        prop: "price",         // 必传验证
                        placeholder: "请输入床位每天价格", // 提示信息
                        maxNum: 99999999,
                        fn: (data)=>{
                          if(data.length > 8){
                            this.$set(this.ruleForm, 'price', data.slice(0,8));
                          }
                        }
                      }
                    ]
                  },
                  ruleForm: {
                      acreage:'',
                      name:'',
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
                       {required: true, message: '请输入房间类型', trigger: 'blur'}
                      ],
                      acreage: [
                       {required: true, message: '请输入房间面积', trigger: 'blur'}
                      ],
                      
                      picList: [
                       {required: true, message: '请上传房间图片', trigger: 'blur'}
                      ],
                      price: [
                       {required: true, message: '床位每天价格', trigger: 'blur'}
                      ]
                  },
            }
        }
    }
}