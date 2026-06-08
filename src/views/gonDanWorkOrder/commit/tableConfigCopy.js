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
            name:'工单管理 ',
            checkboxFn: (data) => {//全选
              this.selectData = data;
              console.log(data);
            },
            rows: [
              {
                label: "运维名称",
                prop: "Ops_Name",
              },
              {
                label: "派发人",
                prop: "User_Name",
              },
              {
                label: "项目负责人",
                prop: "ParentAuditor",
              },
              {
                label: "被指派人",
                prop: "DispatchUser",
              },
              {
                label: "项目名称",
                prop: "Project_Name",
              },
              {
                label: "工单类型",
                prop: "Gdstrat",
              },
              {
                label: "运维时间",
                prop: "Ops_Date",
              },
              {
                label: "创建时间",
                prop: "CreateDate",
              },
              {
                label: "工单状态",
                prop: "AuditStatusName",
              },
            ],
            rowButtons: {
              width: "240px",
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
                // {
                //   label: "审核",
                //   key: "Audit",
                //   fn: (data) => {
                //     this.senheForm.visitDialogVisible=true;
                //   },
                // },
                // {
                //   label: "编辑",
                //   key: "Update",
                //   fn: (data) => {
                //     this.oneForm.visitDialogVisible=true;
                //     this.oneForm.titles='编辑';
                //   },
                // },
                // {
                //   label: "删除",
                //   key: "Delete",
                //   icon: "icon-info",
                //   fn: (data) => {
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
                //   },
                // },
                // {
                //   label: "日志",
                //   key: "Search",
                //   fn: (data) => {
                //     this.liucVisible=true;
                //   },
                // },
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
    mounted() {

    },
    methods:{

    }
};
  