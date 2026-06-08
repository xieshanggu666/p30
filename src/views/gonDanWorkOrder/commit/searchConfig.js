export default {
    name: "searchConfig",
    data() {
        return{
            //搜索基础配置
            searchConfig: {
                dataName: "searchConfig",
                labelWtdth: "120px",
                seniorClose: 'close',

                items: [
                  {
                    label:'搜索内容',
                    key: "Project_Name,Ops_Name,Dev_Id",
                    valueType: "text",
                    placeholder: "请输入项目名称/运维名称/设备id",
                    vague:true, //是否模糊查询
                    homeShow:true, //是否在首页展示
                  },
                  {
                    label:'工单状态',
                    key: "AuditStatus",
                    valueType: "select",
                    homeShow:true, //是否在首页展示
                    data: [
                        {itemName:'未派发',itemValue:'0'},
                        {itemName:'已派发',itemValue:1},
                        {itemName:'待审核',itemValue:2},
                        {itemName:'已结束',itemValue:3},
                        {itemName:'未通过',itemValue:-1},
                    ],//matching.matchCode("ACTIVITY_STATUS"),
                    placeholder: "工单状态",
                    fn:(value)=>{
                   
                    }
                  },
                  {
                    label:'创建时间',
                    key: "CreateDate",
                    valueType: "datetimerange",
                    width:'400px',
                    vague:true, //是否模糊查询
                    homeShow:true, //是否在首页展示
                    fn:(value)=>{
                      console.log(value)
                    }
                  },
                ],
                //查询 重置按钮
                bttomArr:[
                    {
                        type:'search',
                        text:'查询',
                        fn:(search)=>{
                            this.setSearchParams();
                        }
                    },
                    {
                        type:'reset',
                        text:'重置',
                        fn:(search)=>{
                            this.searchParams=this.$options.data().searchParams;
                            this.searchData=this.$options.data().searchData;
                            this.setSearchParams();
                        }
                    }
                ],
                //新建 编辑 删除 导入 导出 操作
                operationArr:[
                  {
                    key:'Add',
                    label:'新增',
                    icon: "el-icon-plus",
                    fn:()=>{
                      this.oneForm.visitDialogVisible=true;
                    }
                  },
                  {
                    label: "导出",
                    key: "Update",
                    icon: "el-icon-top",
                    fn: () => {                   
                      let rowArr=this.selectData;
                      if(rowArr.length==0){
                        this.$message("请选择一条数据！");
                        return;
                      }
                      this.exportExcel(rowArr)
                    },
                  },
                  // {
                  //   label: "删除",
                  //   key: "Delete",
                  //   icon: "el-icon-delete-solid",
                  //   fn: () => {
                  //     let rowArr=this.selectData;
                  //     if(rowArr.length==0){
                  //       this.$message("请选择一条数据！");
                  //       return;
                  //     }

                  //     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  //       confirmButtonText: '确定',
                  //       cancelButtonText: '取消',
                  //       type: 'warning'
                  //     }).then(() => {
                  //       this.$message({
                  //         type: 'success',
                  //         message: '删除成功!'
                  //       });
                  //     })
                  //     console.log('rowArr',rowArr);
                  //   },
                  // },
                  // {
                  //   label: "导入",
                  //   key: "Import",
                  //   icon: "el-icon-bottom",
                  //   fn: (data) => {

                  //   },
                  // },
                  
                ]
            },
            //搜索参数配置
            searchParams: {
                // Project_Name,
                // Ops_Name,
                // Dev_Id
                AuditStatus:'',
                // Type_Name:'',
                // Type_Code:'',
                // status:"",
            },
            //搜索结果条件参数
            searchData:{
                order:'desc',
                page: 1,
                rows: 30,
                sort:'Type_Order',
                wheres:"[]"
            }
        }
    }
};
  