/*****************************************************************************************
**  Author:jxx 2022
**  QQ:283591387
**完整文档见：http://v2.volcore.xyz/document/api 【代码生成页面ViewGrid】
**常用示例见：http://v2.volcore.xyz/document/vueDev
**后台操作见：http://v2.volcore.xyz/document/netCoreDev
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import VisualAngle from './VisualAngle.vue'
import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: '',
    modelBody: VisualAngle,
    modelFooter: ''
  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    editClick(row, $e) {
      $e.stopPropagation()
      this.edit(row)
    },
    getRow(data) {
      this.editFormFields["Layer_Res"]= JSON.stringify(data) 
    },
     //下面这些方法可以保留也可以删除
    onInit() {  
      this.initColumnButton();
        //示例：设置修改新建、编辑弹出框字段标签的长度
        this.boxOptions.labelWidth = 120;
        this.editFormOptions.forEach(x => {
          x.forEach(item => {
            if (item.field == 'Layer_Res') {
              //editFormOptions更多配置见volform组件api
              item.extra = {
                icon: "el-icon-zoom-out",
                text: "配置图层",
                style: "color:blue;font-size: 14px;cursor: pointer;",
                click: item => {
                  this.$refs.modelBody.open(this.editFormFields);
                }
              }
            }

          })
        })
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
                  this.edit(row);
                },
              },
                [h('i', { class: 'el-icon-edit' }, '修改')]
              ),
            h(
              resolveComponent("el-button"), {
              style: { padding: '0 7px' },
              type: "danger",
              plain: true,
              size: 'mini',
              onClick: (e) => {
                e.stopPropagation()
                this.del([row]);
              },
            },
              [h('i', { class: 'el-icon-delete' }, '删除')]
            ),
           
          ])
        }
      })
    },
    onInited() {
      //框架初始化配置后
      //如果要配置明细表,在此方法操作
      //this.detailOptions.columns.forEach(column=>{ });
    },
    searchBefore(param) {
      //界面查询前,可以给param.wheres添加查询参数
      //返回false，则不会执行查询
      return true;
    },
    searchAfter(result) {
      //查询后，result返回的查询数据,可以在显示到表格前处理表格的值
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
      // 
      if(this.currentAction=='Add'){
        let a=""
        this.editFormFields["Layer_Res"]='{}'  //JSON.stringify(a)
      }
      let isEDIT = this.currentAction == this.const.EDIT;
      this.editFormOptions.forEach(item => {
        item.forEach(x => {
          //如果是编辑就将配置设为只读
          if (x.field == "Layer_Res") {
              x.disabled=isEDIT
          }
        })
    })
    }
  }
};
export default extension;
