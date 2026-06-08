/*****************************************************************************************
**  Author:jxx 2022
**  QQ:283591387
**完整文档见：http://v2.volcore.xyz/document/api 【代码生成页面ViewGrid】
**常用示例见：http://v2.volcore.xyz/document/vueDev
**后台操作见：http://v2.volcore.xyz/document/netCoreDev
*****************************************************************************************/
//此js文件是用来自定义扩展业务代码，可以扩展一些自定义页面或者重新配置生成的代码
import Mon_MapSearch from './Mon_MapSearch.vue'
import Group_AlarmConfig from './Group_AlarmConfig.vue'
import GroupManagerGridHeader from './GroupManagerGridHeader.vue'
import { h, resolveComponent } from 'vue';
import VisualAngle from './VisualAngle.vue'
import Mon_Angle from './Mon_Angle.vue'

let extension = {
  components: {
    //查询界面扩展组件
    gridHeader: '',
    gridBody: '',
    gridFooter: '',
    //新建、编辑弹出框扩展组件
    modelHeader: VisualAngle,
    modelBody: Mon_Angle,
    modelFooter: Group_AlarmConfig
  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    editClick(row, $e) {
      // 阻止事件派发到其他节点
      $e.stopPropagation()
      this.edit(row)
    },
    delClick(row, $e){
      $e.stopPropagation()
      this.del([row])
    },
    viewClick(row,$e){
      $e.stopPropagation()
      console.log(row);
      this.$refs.gridHeader.open1(row.ID,row.Group_Name)
    },
    //点击边树节点刷新右边表格
    nodeClick(data){ 
      // console.log("nodeType",data);
      this.data=data;
      this.table.cnName=data.nodeName+'—监测分组管理'
      this.refresh();
    },
    // 从弹框页面传回的方法
    getRow(data) {
      // this.editFormFields["Group_Long"]=data.longitude
      // this.editFormFields["Group_Lat"]=data.latitude
      this.editFormFields["Covering_Config"]= JSON.stringify(data) 
    },
    getRowAngle(data){
      this.editFormFields["GIS_Config"]= JSON.stringify(data) 

    },
    getAlarmConfig(single,combine){
      this.editFormFields["Alarm_Single"]=JSON.stringify(single);
      this.editFormFields["Alarm_Combine"]=JSON.stringify(combine);
    },
    // IsAbnormal(row, $e, type) {
    //   if (type == "取消收藏") {
    //     let url = `/api/Sys_MyCollection/CancelMyCollection?groupId=${row.ID}`;
    //     this.http.post(url, {}, true).then((result) => {
    //     this.$message.success("该监测点取消收藏成功");
    //     this.refresh();

    //     });
    //   } else {
    //     let url = `/api/Sys_MyCollection/AddMyCollection?groupId=${row.ID}`;
    //     this.http.post(url, {}, true).then((result) => {
    //     this.$message.success("该监测点收藏成功");
    //     this.refresh();

    //     });
    //   }
    // },

    onInit() {  
      //缓存当前table页面，点击树刷新页面
      this.$store.getters.data().viewGridManager = this;
      //默认不加载表格数据,由Tree组件中created方法来触发默认加载数据
      this.load=false;
      // 增加操作内编辑按钮
      // this.columns.push({
      //   title: "操作",
      //   field: "操作",
      //   width: 120,
      //   align: "center",
      //   render: (h, { row, column, index }) => {
      //     // Collectioned 下面按钮逻辑可使用
      //     let type = "";
      //       let typeVal = "";
      //       if (row.Collectioned == 1) {
      //         type = "warning";
      //         typeVal = "取消收藏";
      //       } else {
      //         type = "success";
      //         typeVal = "收藏";
      //       }
      //     return <div >
      //        {/* <el-button
      //             onClick={($e) => {
      //               this.IsAbnormal(row, $e, typeVal);
      //             }}
      //             type={type}
      //             plain
      //             size="small"
      //             style="padding: 10px !important;"
      //           >
      //             {typeVal}
      //           </el-button> */}
      //       <el-button onClick={($e) => { this.editClick(row, $e) }} type="primary" plain size="small" style="padding: 10px !important;">编辑</el-button>
      //       <el-button onClick={($e) => { this.delClick(row, $e) }} type="danger" plain size="small" style="padding: 10px !important;">删除</el-button>
      //       {/* <el-button onClick={($e) => { this.viewClick(row, $e) }} type="primary" plain size="small" style="padding: 10px !important;">查看监测点</el-button> */}
      //     </div>
      //   }
      // }),
      this.initColumnButton();
      this.editFormOptions.forEach(x => {
        x.forEach(item => {
          if(item.field=="Alarm_Enable"){
            item.extra = {
              icon: "el-icon-zoom-out",
              text: "预警配置",
              style: "color:blue;font-size: 14px;cursor: pointer;",
              click: item => {
                this.$refs.modelFooter.open(this.editFormFields);
              }
            }
          }else if(item.field == 'Covering_Config'){
            item.extra = {
              icon: "el-icon-zoom-out",
              text: "图层配置",
              style: "color:blue;font-size: 14px;cursor: pointer;",
              click: item => {
                this.$refs.modelHeader.open(this.editFormFields);
              }
            }
          }else if(item.field == 'GIS_Config'){
            item.extra = {
              icon: "el-icon-zoom-out",
              text: "视角配置",
              style: "color:blue;font-size: 14px;cursor: pointer;",
              click: item => {
                this.$refs.modelBody.open(this.editFormFields);
              }
            }
          }
        })
      })
      this.boxOptions.height=570;
      this.boxOptions.labelWidth = 120;
      this.columns.forEach(x => {
        if (x.field == "Collectioned") {
          //将要点击的单元格格式化突出出来
          x.formatter = (row, column, event) => {
            if (row.Collectioned == 1) {
              this.btnbg = "#ecf5ff";
              this.btncolor="#409eff"
              this.typeVal = "是";
            } else {
              this.btnbg = "#f0f9eb";
              this.btncolor="#67c23a"
              this.typeVal = "否";
            }
            return `<div style=";cursor: pointer;
            width: 30px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size:12px;
            background-color: ${this.btnbg};color:${this.btncolor}">` + this.typeVal + '</div>'
          };
          //绑定点击事件
          x.click = (row, column, event) => {
            if (row.Collectioned == 1) {
                let url = `/api/Sys_MyCollection/CancelMyCollection?groupId=${row.ID}`;
                this.http.post(url, {}, true).then((result) => {
                this.$message.success("该监测点取消收藏成功");
                this.refresh();
              });
            } else {
                let url = `/api/Sys_MyCollection/AddMyCollection?groupId=${row.ID}`;
                this.http.post(url, {}, true).then((result) => {
                this.$message.success("该监测点收藏成功");
                this.refresh();
              });
            }
          };
        }
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
      // 默认加载第一条数据
      param.order="asc"
      let nodeType = this.$store.getters.data().treeData.nodeType;
      let nodeValue = this.$store.getters.data().treeData.nodeValue;
      param.wheres = [{ name: nodeType, value: nodeValue }];
      // tree点击事件触发后加载当前
      if (this.data.nodeType || this.searchFormFields.Project) {
        param.wheres = [{ name: this.data.nodeType, value: this.data.nodeValue},{ name: "Group_Name,Group_Num", value: this.searchFormFields.Project}];
      }
      return true;
    },
    searchAfter(result) {
      //查询后，result返回的查询数据,可以在显示到表格前处理表格的值
      return true;
    },
    addBefore(formData) {
      // let formData = this.$store.getters.data().treeData.treeId;
      // if (formData === undefined) {
      //   this.$Message.error("请选择左侧区域")
      //   return false;
      // }
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
      if(this.currentAction=='Add'){
        let a=""
        this.editFormFields["Covering_Config"]=JSON.stringify(a)
        this.editFormFields["GIS_Config"]=JSON.stringify(a)
      }
      else{
        if(this.editFormFields.Covering_Config==""){
          let a=1
          this.editFormFields["Covering_Config"]=JSON.stringify(a)
        }
        if(this.editFormFields.GIS_Config==""){
          let a=""
          this.editFormFields["GIS_Config"]=JSON.stringify(a)
        }
      }
      let isEDIT = this.currentAction == this.const.EDIT;

      this.editFormOptions.forEach(item => {
        item.forEach(x => {
          //如果是编辑就将配置设为只读
          if (x.field == "Covering_Config") {
              x.disabled=isEDIT
          }
          if (x.field == "GIS_Config") {
            x.disabled=isEDIT
        }
        })
    })
      

    }
  }
};
export default extension;
