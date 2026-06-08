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
            name:'设备故障记录',
            checkboxFn: (data) => {//全选
              this.selectData = data;
              console.log(data);
            },
            rows: [
              {
                label: "测点编号",
                prop: "Point_Num",
              },
              {
                label: "标题",
                width: "180px",
                prop: "Title",
              },
              {
                label: "故障时间",
                width: "180px",
                prop: "Start_Time",
              },
              {
                label: "恢复备注",
                prop: "Recovery_Comment",
              },
              {
                label: "创建人",
                prop: "Creator",
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
                //   hidden:(form)=>{
                //     //return 1==1
                //   },
                //   fn: (data) => {
                //     // this.yclForm.visitDialogVisible=true;
                //     // this.yclForm.formConfig.disabled=true;
                //     // this.yclForm.titles='已处理详情';


                //     // this.zxfForm.visitDialogVisible=true;
                //     // this.zxfForm.formConfig.disabled=true;
                //     // this.zxfForm.titles='自修复详情';

                //     this.zfcForm.visitDialogVisible=true;
                //     this.zfcForm.formConfig.disabled=true;
                //     this.zfcForm.titles='暂封存详情';
                //   },
                // },
                // {
                //   label: "处理",
                //   key: "Update",
                //   fn: (data) => {
                //     this.oneForm.visitDialogVisible=true;
                //     this.oneForm.formConfig.disabled=false;
                //     this.oneForm.titles='处理';
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
  