export default {
    name: "tableConfig",
    data() {
      return {
        //表格勾选的数据
        selectData: [], 
        //表格组件属性配置
        tableLoading: true, //表格加载状态
        tableConfig: {
            checkbox: true,
            index: true,
            name:'项目管理 ',
            checkboxFn: (data) => {//全选
              this.selectData = data;
              console.log(data);
            },
            rows: [
              {
                label: "项目名称",
                prop: "Type_Code",
              },
              {
                label: "项目地址",
                prop: "Type_Name",
              },
              {
                label: "是否启用",
                prop: "Type_Order",
              },
              {
                label: "创建人",
                prop: "Type_Order",
              }, 
              {
                label: "创建时间",
                prop: "Type_Description",
              },
              {
                label: "修改人",
                prop: "Type_Order",
              }, 
              {
                label: "创建时间",
                prop: "Type_Order",
              }, 
            ],
            rowButtons: {
              width: "200px",
              type: "plain",
              items: [
                {
                  label: "查看",
                  key: "Search",
                  fn: (data) => {
                    this.oneForm.visitDialogVisible=true;
                    this.oneForm.formConfig.disabled=true;
                    this.oneForm.titles='查看';
                  },
                },
                {
                  label: "编辑",
                  key: "Update",
                  fn: (data) => {
                    this.oneForm.visitDialogVisible=true;
                    this.oneForm.titles='编辑';
                  },
                },
                {
                  label: "删除",
                  key: "Delete",
                  icon: "icon-info",
                  fn: (data) => {
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
              ],
            },
        },
        //表格数据
        templateData:[],
        //表格分页数据
        pagination: {
          show: true,
          total: 0,
          sizeChange: (size) => {
            this.searchData.rows = size;
            this.setSearchParams();
          },
          pageChange: (page) => {
            this.searchData.page = page;
            this.setSearchParams();
          },
        },
      };
    },
    methods:{

    }
};
  