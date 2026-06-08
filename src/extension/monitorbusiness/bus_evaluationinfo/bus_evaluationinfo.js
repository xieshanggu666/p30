/*****************************************************************************************
**  Author:jxx 2022
**  QQ:283591387
**完整文档见：http://v2.volcore.xyz/document/api 【代码生成页面ViewGrid】
**常用示例见：http://v2.volcore.xyz/document/vueDev
**后台操作见：http://v2.volcore.xyz/document/netCoreDev
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import busInfo from './bus_info.vue'
import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: busInfo,
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: '',
    modelBody: '',
    modelFooter: ''
  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  
  methods: {
    editClick(row, $e) {
      $e.stopPropagation()
      this.$refs.gridHeader.open(row)
    },
    nodeClick(data){ 
      this.data=data;
      this.refresh();
    },
    onInit() { 
      this.$store.getters.data().viewGridEvaluationInfo = this;
      this.load=false;
      // this.columns.push({
      //   title: "操作",
      //   field: "操作",
      //   width: 120,
      //   align: "center",
      //   render: (h, { row, column, index }) => {
      //     return <div >
      //       <el-button onClick={($e) => { this.editClick(row, $e) }} type="primary" plain size="small" style="padding: 10px !important;">简报</el-button>
      //     </div>
      //   }
      // }),
      this.initColumnButton()
      this.boxOptions.labelWidth = 120;
    },
    onInited() {
      
    },
    initColumnButton() {
      //在表最后添加操作列
      this.columns.push({
        title: '操作',
        fixed: 'right',
        align: "center",
        width: 130,
        render: (h, { row, column, index }) => {
          return h(
            "div", { style: { cursor: 'pointer' } }, [
             h(
                resolveComponent("el-button"), {
                style: { padding: '0 7px' },
                type: "primary",
                plain: true,
                size: 'mini',
                onClick: (e) => {
                  e.stopPropagation()
                  this.$refs.gridHeader.open(row)
                },
              },
                [h('i', { class: 'el-icon-document' }, '日报')]
              ),
          ])
        }
      })
    },
    searchBefore(param) {
      // 默认加载第一条数据
      let nodeType = this.$store.getters.data().MonPointTreeData.nodeType;
      let nodeValue = this.$store.getters.data().MonPointTreeData.nodeValue;
      param.wheres = [{ name: 'GroupID', value: nodeValue }];
      // tree点击事件触发后加载当前
      if (this.data.nodeType) {
        param.wheres = [{ name:'GroupID', value: this.data.nodeValue},{ name: "tableName", value:''}];
      }
      return true;
    },
    searchAfter(result) {
      return true;
    },
    addBefore(formData) {
      //新建保存前formData为对象，包括明细表，可以给给表单设置值，自己输出看formData的值
      return true;
    },
    updateBefore(formData) {
      //编辑保存前formData为对象，包括明细表、删除行的Id
      return true;
    },
    rowClick({ row, column, event }) {
      //查询界面点击行事件
      // this.$refs.table.$refs.table.toggleRowSelection(row); //单击行时选中当前行;
    },
    modelOpenAfter(row) {
      //点击编辑、新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
      //(1)判断是编辑还是新建操作： this.currentAction=='Add';
      //(2)给弹出框设置默认值
      //(3)this.editFormFields.字段='xxx';
      //如果需要给下拉框设置默认值，请遍历this.editFormOptions找到字段配置对应data属性的key值
      //看不懂就把输出看：console.log(this.editFormOptions)
    }
  }
};
export default extension;
