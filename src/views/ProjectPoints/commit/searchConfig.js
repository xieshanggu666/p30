export default {
    name: "searchConfig",
    data() {
        return{
            //搜索基础配置
            searchConfig: {
                dataName: "searchConfig",
                labelWtdth: "120px",
                items: [
                  {
                    label:'项目名称',

                    key: "Type_Name",
                    valueType: "text",
                    placeholder: "请输入项目名称",
                    vague:true, //是否模糊查询
                    homeShow:true, //是否在首页展示
                  }
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
                  // {
                  //   label: "编辑",
                  //   key: "Update",
                  //   icon: "el-icon-edit",
                  //   fn: () => {                   
                  //     let rowArr=this.selectData;
                  //     if(rowArr.length==0){
                  //       this.$message("请选择编辑行");
                  //       return false
                  //     }
                  //     if(rowArr.length>1){
                  //       this.$message("只能选择一条数据编辑");
                  //       return false
                  //     }
                  //     this.oneForm.visitDialogVisible=true;
                  //     this.oneForm.titles='编辑';
                  //   },
                  // },
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
                      console.log('rowArr',rowArr);
                    },
                  },
                  // {
                  //   label: "导入",
                  //   key: "Import",
                  //   icon: "el-icon-bottom",
                  //   fn: (data) => {

                  //   },
                  // },
                  // {
                  //   label: "导出",
                  //   key: "Export",
                  //   path:"",
                  //   icon: "el-icon-top",
                  //   fn: (data) => {

                  //   },
                  // },
                  
                ]
            },
            //搜索参数配置
            searchParams: {
                Type_Name:'',
                Type_Code:'',
                status:"",
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
  