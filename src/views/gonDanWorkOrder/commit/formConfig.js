//码表数据匹配
function codeTable(code){
  let codesArr=JSON.parse(localStorage.getItem('codeTable'))||[];  
  let datas = [];
  codesArr.forEach(item => { 
    if(item.dicNo == code) datas= item.data.map(ite=>({itemName:ite.value,itemValue:isStrictStringNumber(ite.key)?ite.key*1:ite.key}));
  });
  return datas
}
function isStrictStringNumber(str) {
  if (typeof str !== "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
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
                        label: "项目名称",
                        key: "Project_Name",          // 表单key值
                        prop: "Project_Name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        label:'部位名称',
                        key: "Group_Id",
                        prop: "Group_Id",         // 必传验证
                        valueType: "select",
                        data: codeTable('groupManager'),
                        placeholder: "请选择部位",
                        fn:(value)=>{}
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "设备ID ",
                        disabled:false,
                        key: "Dev_Id",          // 表单key值
                        prop: "Dev_Id",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "采集设备编号",
                        disabled:false,
                        key: "Sim_Num",          // 表单key值
                        prop: "Sim_Num",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "测点名称",
                        disabled:false,
                        key: "Point_Name",          // 表单key值
                        prop: "Point_Name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "测点编号 ",
                        disabled:false,
                        key: "Point_Num",          // 表单key值
                        prop: "Point_Num",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "datetime",      // 类型输入框
                        label: "故障时间 ",
                        disabled:false,
                        key: "ErrorTime",          // 表单key值
                        prop: "ErrorTime",         // 必传验证
                        placeholder: "请选择故障时间",// 提示信息
                        hidden:(e)=>{
                          return (!e.ErrorTime);
                        }
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "故障内容",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "Error_Reason",          // 表单key值
                        prop: "Error_Reason",         // 必传验证
                        placeholder: "请输入", // 提示信息
                        hidden:(e)=>{
                          return (!e.ErrorTime);
                        }
                      },
                      {
                        valueType: "title",      // 类型输入框
                        label:'处理详情',
                        col:2
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "运维名称 ",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "Ops_Name",          // 表单key值
                        prop: "Ops_Name",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "故障原因 ",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "Error_Reason",          // 表单key值
                        prop: "Error_Reason",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "处理办法 ",
                        col:2,
                        disabled:false,
                        key: "Handle_Method",          // 表单key值
                        prop: "Handle_Method",         // 必传验证
                        placeholder: "请输入" // 提示信息
                      },
                      {
                        valueType: "datetime",      // 类型输入框
                        label: "运维时间 ",
                        disabled:false,
                        key: "Ops_Date",          // 表单key值
                        prop: "Ops_Date",         // 必传验证
                        placeholder: "请选择运维时间" // 提示信息
                      },
                      {
                        label:'运维类型',
                        key: "Ops_Type",
                        prop: "Ops_Type",         // 必传验证
                        valueType: "select",
                        data: codeTable('devopsType'),
                        placeholder: "请选择运维类型",
                        fn:(value)=>{}
                      },
                      {
                        label:'故障分类',
                        key: "Error_Type",
                        prop: "Error_Type",         // 必传验证
                        valueType: "select",
                        data: codeTable('errorType'),
                        placeholder: "请选择故障分类",
                        fn:(value)=>{}
                      },
                      {
                        label:'指派人员',
                        key: "DispatchId",
                        valueType: "select",
                        data: [
                            // {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        placeholder: "指派人员",
                        fn:(value,form,data)=>{
                           data.forEach(item=>{
                            if(item.itemValue==value){
                               this.oneForm["ruleForm"].DispatchUser=item.itemName;
                            }
                           })
                        }
                      },
                      {
                        label:'项目负责人',
                        key: "ParentAuditId",
                        prop: "ParentAuditId",         // 必传验证
                        valueType: "select",
                        data: [
                            // {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        placeholder: "项目负责人",
                        fn:(value,form,data)=>{
                          data.forEach(item=>{
                           if(item.itemValue==value){
                              this.oneForm["ruleForm"].ParentAuditor=item.itemName;
                           }
                          })
                        }
                      },
                      {
                        valueType: "title",      // 类型输入框
                        label:'处理信息',
                        col:2,
                        hidden:(e)=>{
                          return (!e.ReasonReview);
                        }
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "故障复核 ",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "ReasonReview",          // 表单key值
                        prop: "ReasonReview",         // 必传验证
                        placeholder: "请输入", // 提示信息
                        hidden:(e)=>{
                          return (!e.ReasonReview);
                        }
                      },
                      {
                        valueType: "textarea",      // 类型输入框
                        label: "处理结果 ",
                        row:2,
                        col:2,
                        disabled:false,
                        key: "ErrorPrediction",          // 表单key值
                        prop: "ErrorPrediction",         // 必传验证
                        placeholder: "请输入", // 提示信息
                        hidden:(e)=>{
                          return (!e.ReasonReview);
                        }
                      },
                      {
                        valueType: "upload",      // 类型输入框
                        label: "图片",
                        col:2,
                        limit:3, //最多上传3张
                        hidden:(e)=>{
                          return (!e.ReasonReview);
                        },
                        key: "Acc_Num",          // 表单key值
                        prop: "Acc_Num",         // 必传验证
                        disabled:false,
                      },
                    ]
                  },
                  ruleForm: {
                      Project_Name:'',
                      Group_Id:'',
                      Dev_Id:'',
                      Sim_Num:'',
                      Point_Name:'',
                      Point_Num:'',
                      Ops_Name:'',
                      Error_Reason:'',
                      Handle_Method:'',
                      Ops_Date:'',
                      Ops_Type:'',
                      Error_Type:'',
                      DispatchId:'',
                      ParentAuditId:'',
                      ReasonReview:'',
                      ErrorPrediction:'',
                      Acc_Num:''
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
                          let user=JSON.parse(localStorage.getItem('user'));
                          //项目负责人与指派人员不能是同一个人
                            if(dataus.ParentAuditId==dataus.DispatchId){
                              this.$message({message: '项目负责人与指派人员不能是同一个人', type: 'error'}) 
                              return false
                          }
                          //如果有被指派人员 则添加工单时改为待审核 如果没有则为待分派
                          if(dataus.DispatchId&&dataus.DispatchId!=''){
                            dataus.AuditStatus=2; //待审核
                          }else{
                            dataus.AuditStatus=0; //待分派
                          }
                          dataus.Creator=user.userName;  //创建人
                          dataus.User_Name=user.userName;  //操作人
                          dataus.Modifier=user.userName;  //操作人
                          let obj={mainData:dataus};
                          let kousApi=this.oneForm.titles=='编辑'?'update':'Add';
                          this.http.post('/api/Mon_DevOps_Manager/'+kousApi, obj).then(res => {
                              if (res.status) {
                                let datas=JSON.parse(res.data).data;
                                this.$message({message: '操作成功', type: 'success'}) 
                                this.setSearchParams();
                                //添加流程日志
                                let dierzon,Records;
                                if(this.oneForm.titles=='编辑'){
                                    let Recordse=JSON.parse(this.uuRizis.Record);  
                                    let onbs= {  
                                        Status: '生成工单(手动添加)',
                                        Image:user.img,  
                                        Name:user.userName,   
                                        CreateDate:this.selectDay(),
                                        Remarks:'',
                                    };
                                    Recordse.push(onbs);  
                                    this.uuRizis.Record=JSON.stringify(Recordse);
                                }else{
                                    Records=[  //无指派人员情况 进入待分派状态 
                                      {  
                                          Status: '派发工单',
                                          Image:user.img,  
                                          Name:user.userName,   
                                          CreateDate:this.selectDay(),
                                          Remarks:'',
                                      }
                                    ];
                                    dierzon=[  //有指派人员情况 进入待审核状态
                                        {  
                                            Status: '生成工单(手动添加)',
                                            Image:user.img,  
                                            Name:user.userName,   
                                            CreateDate:this.selectDay(),
                                            Remarks:'',
                                        },
                                        {  
                                            Status: '派发工单',
                                            Image:user.img,  
                                            Name:user.userName,   
                                            CreateDate:this.selectDay(),
                                            Remarks:'',
                                        },
                                    ]
                                }
                                
                                let dataobj={mainData:{
                                    DevOps_Id:datas.ID, //工单id
                                    Record:JSON.stringify(data.DispatchId?dierzon:Records ),  //操作记录
                                    Creator:user.userName,  
                                }}; 
                                if(this.oneForm.titles=='编辑'){
                                  dataobj={mainData:this.uuRizis};
                                }
                                let rizhiApi=this.oneForm.titles=='编辑'?'update':'Add';
                                this.http.post('/api/Mon_OpsAuditRecord/'+rizhiApi, dataobj).then(res => {
                                  this.oneForm.handleVisitClose();
                                })
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
                    Project_Name: [
                       {required: true, message: '请输入项目名称', trigger: 'blur'}
                      ],
                      Group_Id: [
                       {required: true, message: '请选择部位', trigger: 'blur'}
                      ],
                      Dev_Id: [
                       {required: true, message: '请输入设备ID', trigger: 'blur'}
                      ],

                      Sim_Num: [
                        {required: true, message: '请输入采集设备编号', trigger: 'blur'}
                       ],
                      Ops_Name: [
                        {required: true, message: '请输入运维名称', trigger: 'blur'}
                      ],
                      Error_Reason: [
                        {required: true, message: '请输入故障原因', trigger: 'blur'}
                      ],
                      Handle_Method: [
                        {required: true, message: '请输入处理办法', trigger: 'blur'}
                      ],
                      Ops_Date: [
                        {required: true, message: '请选择运维时间', trigger: 'blur'}
                      ],
                      Ops_Type: [
                        {required: true, message: '请选择运维类型', trigger: 'blur'}
                      ],
                      Error_Type: [
                        {required: true, message: '请选择故障分类', trigger: 'blur'}
                      ],
                      ParentAuditId: [
                        {required: true, message: '请选择项目负责人', trigger: 'blur'}
                      ],  
                  },
            }
        }
    },
    created() {
        this.xmfuzUser();
        this.seleZpai();
    },
    methods:{
      //获取项目负责人
      xmfuzUser(){
          this.http.get('/api/Mon_DevOps_Manager/GetAuditUserList', {}, true).then((result) => {
              console.log('项目负责人打印',result);
              this.oneForm.formConfig.items[16].data = result.data.map(item=>({itemName:item.userTrueName,itemValue:item.user_Id}));
          });
      },
      //获取指派人员
      seleZpai(){
          this.http.get('/api/Mon_DevOps_Manager/GetDispatchUserList', {}, true).then((result) => {
              console.log('获取指派人员',result);
              this.oneForm.formConfig.items[15].data = result.data.map(item=>({itemName:item.userTrueName,itemValue:item.user_Id}));;
          });
      }
    }
}