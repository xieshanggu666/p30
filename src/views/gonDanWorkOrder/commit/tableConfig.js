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
                label: "项目名称",
                prop: "Project_Name",
              },
              {
                label: "部位名称",
                prop: "Group_Name",
              },
              {
                label: "测点名称",
                prop: "Point_Name",
              },
              {
                label: "测点编号",
                prop: "Point_Num",
              },
              {
                label: "运维名称",
                prop: "Ops_Name",
              },
              {
                label: "工单类型",
                prop: "Gdstrat",
              },
              {
                label: "故障分类",
                prop: "Error_Type",
              },
              {
                label: "项目负责人",
                prop: "ParentAuditor",
              },
              {
                label: "指派人员",
                prop: "DispatchUser",
              },
              {
                label: "故障原因",
                prop: "Error_Reason",
              },
              {
                label: "处理办法",
                prop: "Handle_Method",
              },
              {
                label: "创建时间",
                prop: "CreateDate",
              },
              {
                label: "工单状态",
                type: "tag",
                style:{'0':"wcl",'1':"ycl",'2':"zfc",'3':"zxf",'-1':"wcl"}, 
                data:{'0':"未派发",'1':"已分派",'2':"待审核",'3':"已结束",'-1':"未通过"},
                prop: "AuditStatus",
              },
            ],
            rowButtons: {
              width: "240px",
              type: "plain",
              items: [
                {
                  label: "查看",
                  key: "Search",
                  fn: (data) => {
                    this.oneForm.visitDialogVisible=true;
                    this.oneForm.formConfig.disabled=true;
                    this.oneForm.titles='查看';
                    this.oneForm.ruleForm=data;
                  },
                },
                {
                  label: "处理",
                  key: "Add",
                  hidden:(e)=>{
                    //不为已派发状态 或者 不是接单人不是自己 不能进行处理
                    let userName=JSON.parse(localStorage.getItem('user')).userName;
                    return (e.AuditStatus!=1)||(e.DispatchUser!=userName) 
                  },
                  fn: (data) => {
                    
                  },
                },
                {
                  label: "审核",
                  key: "Audit",
                  hidden:(e)=>{
                    return e.AuditStatus!=2
                  },
                  fn: (data) => {
                     this.senheForm.visitDialogVisible=true;
                     this.shenheObj=JSON.parse(JSON.stringify(data));
                     //查询日志内容
                     this.uuriziArr(data.ID);
                  },
                },
                {
                  label: "编辑",
                  key: "Update",
                  hidden:(e)=>{
                    //未派发 
                    return e.AuditStatus!=0
                  },
                  fn: (data) => {
                    this.oneForm.ruleForm=JSON.parse(JSON.stringify(data));
                    this.oneForm.visitDialogVisible=true;
                    this.oneForm.titles='编辑';
                    //查询日志内容
                    this.uuriziArr(data.ID);
                  },
                },
                {
                  label: "删除",
                  key: "Delete",
                  hidden:(e)=>{
                    //未派发 且不是系统工单才可以删除
                    return e.AuditStatus!=0 &&e.Gdstrat!="系统工单"
                  },
                  icon: "icon-info",
                  fn: (data) => {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      let url="/api/Mon_DevOps_Manager/del";
                      this.http.post(url, [data.ID], true).then((result) => {
                          if(result.status){
                            this.$message({ type: 'success',message: '删除成功!'});
                            this.setSearchParams();
                          }
                      });
                    })
                  },
                },
                {
                  label: "日志",
                  key: "Search",
                  hidden:(e)=>{
                    //未派发 
                    return e.AuditStatus==0
                  },
                  fn: (data) => {
                    //查询流程日志
                    this.seleLiurizi(data.ID);
                    this.liucVisible=true;
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
    mounted() {

    },
    methods:{
       //查询日志内容
      uuriziArr(ids){
          let dataobj={
            page:1,
            rows:1,
            wheres:[{name:'DevOps_Id',value:ids}]
          }
          dataobj.wheres=JSON.stringify(dataobj.wheres);
          this.http.post('/api/Mon_OpsAuditRecord/GetPageData', dataobj).then(res => {
              let datasa=res.rows[0];
              this.uuRizis=datasa; 
          })
      }
    }
};
  