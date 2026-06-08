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
            name:'人员管理 ',
            checkboxFn: (data) => {//全选
              this.selectData = data;
              console.log(data);
            },
            rows: [
              {
                label: "人员姓名",
                prop: "Name",
              },
              {
                label: "联系电话",
                prop: "Phone",
              },
              {
                label: "备注信息",
                prop: "Description",
              },
              {
                label: "创建时间",
                prop: "CreateDate",
              }
            ],
            rowButtons: {
              width: "200px",
              type: "plain",
              items: [
                // {
                //   label: "查看",
                //   key: "Search",
                //   fn: (data) => {
                //     this.oneForm.visitDialogVisible=true;
                //     this.oneForm.formConfig.disabled=true;
                //     this.oneForm.titles='查看';
                //   },
                // },
                {
                  label: "编辑",
                  key: "Update",
                  fn: (data) => {
                    this.oneForm.visitDialogVisible=true;
                    this.oneForm.titles='编辑';
                    this.oneForm.ruleForm=JSON.parse(JSON.stringify(data));
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
                      this.http.post('/api/Mon_Contactlist/del', [data.ID]).then(res => {
                          if (res.status) {
                            this.$message({ type: 'success', message: '删除成功!'});
                            this.setSearchParams();
                            this.oneForm.handleVisitClose();
                          }
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
  