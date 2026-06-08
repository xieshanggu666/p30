export default {
    name: "searchConfig",
    data() {
        return{
            //搜索基础配置
            searchConfig: {
                dataName: "searchConfig",
                labelWtdth: "120px",
                items: [
                  // {
                  //   label:'类型名称',
                  //   key: "Type_Name",
                  //   valueType: "text",
                  //   placeholder: "类型名称",
                  //   vague:true, //是否模糊查询
                  //   homeShow:false, //是否在首页展示
                  // },
                  // {
                  //   label:'类型编号',
                  //   key: "Type_Code",
                  //   valueType: "text",
                  //   placeholder: "类型编号",
                  //   vague:true, //是否模糊查询
                  //   homeShow:false, //是否在首页展示
                  // },
                  {
                    label:'设备',
                    key: "devId",
                    valueType: "select",
                    homeShow:true, //是否在首页展示
                    data: [
                        // {itemName:'你好',itemValue:1},
                    ],//matching.matchCode("ACTIVITY_STATUS"),
                    placeholder: "选择设备",
                    fn:(value)=>{
                      if(value!=''){
                        let warning=JSON.parse(localStorage.getItem('warning'));
                        this.devId=value;
                        //赋值设备id
                        warning.forEach(item => {
                          if(item.Dev_Id==value){
                            this.namels=item.title;
                          }
                        });
                        //数据初始化
                        this.linConfig=this.$options.data().linConfig;
                        this.templateData=[];
                        //查询列表数据
                        this.setSearchParams();
                      }
                    }
                  },
                  {
                    label:'开始时间',
                    key: "startTime",
                    valueType: "datetime",
                    placeholder: "请选择开始时间",
                    vague:true, //是否模糊查询
                    homeShow:true, //是否在首页展示
                  },
                  {
                    label:'结束时间',
                    key: "endTime",
                    valueType: "datetime",
                    placeholder: "请选择结束时间",
                    vague:true, //是否模糊查询
                    homeShow:true, //是否在首页展示
                  },
                ],
                //查询 重置按钮
                bttomArr:[
                    {
                        type:'search',
                        text:'查询',
                        fn:(search)=>{
                            this.setSearchParams();
                            //停止定时器
                            this.celfn();
                        }
                    },
                    {
                        type:'reset',
                        text:'重置',
                        fn:(search)=>{
                            this.searchParams=this.$options.data().searchParams;
                            //时间重置为当前时间
                            this.searchParams.startTime =this.getseo(); 
                            this.searchParams.endTime =this.getCur();
                            //下拉默认值
                            this.secharse();
                            this.searchData=this.$options.data().searchData;
                            this.setSearchParams();
                            //开启定时器
                            if(this.timefel){
                              clearInterval(this.timefel);
                              this.timefel=null;
                            }
                            this.timefel=setInterval(() => {
                                //获取前两个小时数据
                                this.searchParams.startTime =this.getseo(); 
                                this.searchParams.endTime =this.getCur();
                                this.setSearchParams();
                            }, 60000);
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
                    label: "编辑",
                    key: "Update",
                    icon: "el-icon-edit",
                    fn: () => {                   
                      let rowArr=this.selectData;
                      if(rowArr.length==0){
                        this.$message("请选择编辑行");
                        return false
                      }
                      if(rowArr.length>1){
                        this.$message("只能选择一条数据编辑");
                        return false
                      }
                      this.oneForm.visitDialogVisible=true;
                      this.oneForm.titles='编辑';
                    },
                  },
                  {
                    label: "删除",
                    key: "Delete",
                    icon: "el-icon-delete-solid",
                    fn: () => {
                      let rowArr=this.selectData;
                      if(rowArr.length==0){
                        this.$message("请选择一条数据！");
                        return;
                      }

                      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.$message({
                          type: 'success',
                          message: '删除成功!'
                        });
                      })
                    },
                  },
                  {
                    label: "导入",
                    key: "Import",
                    icon: "el-icon-bottom",
                    fn: (data) => {

                    },
                  },
                  {
                    label: "导出",
                    key: "Export",
                    path:"",
                    icon: "el-icon-top",
                    fn: (data) => {

                    },
                  },
                  
                ]
            },
            //搜索参数配置
            searchParams: {
                startTime:'',
                endTime:'',
                devId:"",
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
  