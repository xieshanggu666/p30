export default{
    name:'formConfig',
    data(){
        return{
            oneForm:{
                  handleVisitClose:()=>{
                    this.oneForm.visitDialogVisible = false;
                    console.log('关闭触发',122);
                    this.oneForm.titles = '新增项目';
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
                        valueType: "select",      // 类型输入框
                        label: "所属项目",
                        col:1, 
                        hidden:(form)=>{
                          return form.clstatus==2
                        },
                        data: [
                          {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择所属项目" // 提示信息
                      },
                      {
                        valueType: "select",      // 类型输入框
                        label: "所属部位",
                        col:1, 
                        hidden:(form)=>{
                          return form.clstatus==2
                        },
                        data: [
                          {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择所属部位" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "部位编号",
                        disabled:true,
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "设备ID",
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入设备ID" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "设备编号",
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入设备编号" // 提示信息
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "设备备注",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "acreage",          // 表单key值
                        prop: "acreage",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      }
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