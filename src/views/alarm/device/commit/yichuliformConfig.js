export default{
    name:'formConfig',
    data(){
        return{
            yclForm:{
                  handleVisitClose:()=>{
                    this.yclForm.titles = '新增';
                    this.yclForm.visitDialogVisible = false;
                    this.yclForm.formConfig.disabled = false;
                    this.yclForm.ruleForm=this.$options.data().yclForm.ruleForm;
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
                        label: "处理详情",
                        col:2,
                      },
                      {
                        valueType: "radio",      // 类型输入框
                        label: "处理结果",
                        col:2,
                        key: "clstatus",          // 表单key值
                        prop: "name",         // 必传验证 
                        data:[
                          {label:'生成工单',value:1},
                          {label:'暂封存',value:2},
                        ]
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "运维名称",
                        col:2,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入运维名称" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "故障原因",
                        col:2,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入故障原因" // 提示信息
                      },
                      {
                        valueType: "input",      // 类型输入框
                        label: "处理办法",
                        col:2,
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请输入处理办法" // 提示信息
                      },
                      {
                        valueType: "select",      // 类型输入框
                        label: "故障分类",
                        col:1, 
                        data: [
                          {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择故障分类" // 提示信息
                      },
                      {
                        valueType: "select",      // 类型输入框
                        label: "运维类型",
                        col:1,
                        data: [
                          {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择运维类型" // 提示信息
                      },
                      {
                        valueType: "select",      // 类型输入框
                        label: "指派人员",
                        col:1,
                        data: [
                          {itemName:'你好',itemValue:1},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择指派人员" // 提示信息
                      },
                      {
                        valueType: "select",      // 类型输入框
                        label: "项目负责人",
                        col:1,
                        multiple:true,
                        data: [
                          {itemName:'李小龙',itemValue:1},
                          {itemName:'希岛爱理',itemValue:2},
                          {itemName:'纱纱原百合',itemValue:3},
                        ],//matching.matchCode("ACTIVITY_STATUS"),
                        key: "name",          // 表单key值
                        prop: "name",         // 必传验证
                        placeholder: "请选择项目负责人" // 提示信息
                      },
                    //   {
                    //     valueType: "title",      // 类型输入框
                    //     label: "上传记录",
                    //     col:2,
                    //   },
                    //   {
                    //     valueType: "input",      // 类型输入框
                    //     label: "故障复核",
                    //     col:2,
                    //     key: "name",          // 表单key值
                    //     prop: "name",         // 必传验证
                    //     placeholder: "请输入故障复核" // 提示信息
                    //   },
                    //   {
                    //     valueType: "textarea",      // 类型输入框
                    //     label: "处理办法",
                    //     col:2,
                    //     disabled:true,
                    //     key: "name",          // 表单key值
                    //     prop: "name",         // 必传验证
                    //     placeholder: "请输入处理办法" // 提示信息
                    //   },
                    //   {
                    //     valueType: "upload",      // 类型输入框
                    //     label: "图片",
                    //     col:2,
                    //     limit:3, //最多上传3张
                    //     key: "imgurl",          // 表单key值
                    //     prop: "imgurl",         // 必传验证
                    //     disabled:false,
                    //   },
                    ]
                  },
                  buttonConfig: {
                    position: "flex-end",
                    //validateAll: ["ruleForm"],  多表单验证 提交 ruleForm与 publicForm的ref必须一致
                    buttons: [
  
                    ]
                  },
                  rules: {
                      imgurl: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                      ],
                      // acreage: [
                      //  {required: true, message: '请输入房间面积', trigger: 'blur'}
                      // ],
                      
                      // picList: [
                      //  {required: true, message: '请上传房间图片', trigger: 'blur'}
                      // ],
                      // price: [
                      //  {required: true, message: '床位每天价格', trigger: 'blur'}
                      // ]
                  },
            }
        }
    }
}