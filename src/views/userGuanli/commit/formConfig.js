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
                        label: "人员名称",
                        col:2,
                        key: "Name",          // 表单key值
                        prop: "Name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "联系电话",
                        col:2,
                        disabled:false,
                        key: "Phone",          // 表单key值
                        prop: "Phone",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "备注信息",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "Description",          // 表单key值
                        prop: "Description",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "upload",      // 类型输入框
                        label: "头像",
                        col:2,
                        limit:1, //最多上传3张
                        key: "Address",          // 表单key值
                        prop: "Address",         // 必传验证
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
                      Name:'',
                      Phone:'',
                      Description:'', 
                      Address:''      //头像
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
                          let obj={ delKeys: null,detailData: null,mainData:dataus }
                          let Apis='';
                          //编辑
                          if(this.oneForm.titles=='编辑'){
                            Apis='/api/Mon_Contactlist/update'
                          }else{
                            //新增
                            Apis='/api/Mon_Contactlist/Add';
                          }
                          this.http.post(Apis, obj).then(res => {
                                if (res.status) {
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
                      Name: [
                       {required: true, message: '请输入人员姓名', trigger: 'blur'}
                      ],
                      Phone: [
                       {required: true, message: '请输入联系电话', trigger: 'blur'}
                      ]
                  },
            }
        }
    }
}