import Mon_Initialization from './Mon_Initialization.vue'
import Mon_Record from './Mon_Record.vue'
import Mon_Operation from './Mon_Operation.vue'
import Mon_Satellite from './Mon_Satellite.vue'
import Analyse_Uniphase from './Analyse_Uniphase.vue'
import Mon_InitializationKalman from './Mon_InitializationKalman.vue'
import Mon_KalmanInfo from './Mon_KalmanInfo.vue'
import Mon_timelyRadar from './Mon_timelyRadar.vue'
import Mon_HistoryRadar from './Mon_HistoryRadar.vue'
import Mon_Frequency from './Mon_Frequency.vue'
import Mon_Configuration from './Mon_Configuration.vue'
import Mon_gridShake from './Mon_gridShake.vue'
import Mon_gridMovie from './Mon_gridMovie.vue'
import Mon_Pressure from './Mon_Pressure.vue'
import Mon_Math from './Mon_math.vue'
import Mon_mathSet from './Mon_mathSet.vue'
import Xjcyis from './Xjcyis.vue'
import Qinxie from './Qinxie.vue'
import { h, resolveComponent } from 'vue';
let extension = {
  components: {
    // 新增计算数据
    gridMath:Mon_Math,
    gridMathSet:Mon_mathSet,
    gridHeader: Mon_Satellite,
    gridBody: Mon_Record,
    gridFooter: Mon_Operation,
    gridCenter:Mon_Initialization,
    gridAnalysis:Analyse_Uniphase,
    gridXjcyis:Xjcyis, //设备分析 4.8
    gridKalman:Mon_InitializationKalman,
    gridKalmanInfo:Mon_KalmanInfo,
    // 四维
    gridTimelyRadar:Mon_timelyRadar,
    gridHistoryRadar:Mon_HistoryRadar,
    gridFrequency:Mon_Frequency,
    gridConfiguration:Mon_Configuration,
    gridShake:Mon_gridShake,
    gridMovie:Mon_gridMovie,

    modelHeader:Qinxie,
    modelBody: Mon_Pressure,
    modelFooter: '',

  },
  tableAction: '', //指定某张表的权限(这里填写表名,默认不用填写)
  buttons: { view: [], box: [], detail: [] }, //扩展的按钮
  methods: {
    editClick(row, $e) {
      $e.stopPropagation()
      this.edit(row)
    },
    delClick(row, $e){
      $e.stopPropagation()
      this.del([row])
    },
    dropdownClick(value,row,column) {
      switch (value) {
        case "计算数据":
          // 存在公式配置才可查看计算数据
          if(row.Formula_Config) {
            this.$refs.gridMath?.openRecord(row)
          }
          else {
            this.$message({
              message: '点位配置公式后，可查看计算数据',
              type: 'warning'
            });
          }
          break;
        case "初始化":
          let url = `/api/Mon_Point_Manager/GetInitialPointInfo?pointNum=${row.Point_Num}`;
          this.http.get(url, {}, true).then((result) => {
            this.$refs.gridCenter.open3(row.Point_Num,result)
          });
          break;
        case "监测数据":
          // this.$router.push({path:'/Monitor_Record',query:{Point_Name:row.Point_Name,Point_Num:row.Point_Num}})
          this.$refs.gridBody.openRecord(row)
          break;
        case "运行数据":
          this.$refs.gridFooter.openOperation(row)
          break;
        case "卫星数据":
          this.$refs.gridHeader.openSatellite(row)
          break;
        case "单相分析":
          // 深部位移页面多传入一个参数 用于时间范围与分析方式
          // 时间为一个时间
          // 分析方式不用选 默认为时
          console.log('单相分析点击')
          const type_text = (row.Type_Id == 29 || row.Type_Id == 44)? 'shenbu' :'default';
          this.$refs.gridAnalysis.openAnalyse(row, type_text)
          break;
        case "设备分析":
          let obj={title:row.Point_Name,Dev_Id:row.Dev_Id};
          localStorage.setItem('warning',JSON.stringify([obj]));
          this.$refs.gridXjcyis.opense(row)
          break;  
        // case "卡尔曼初始值":
        //   this.$refs.gridKalman.openInKalman(row)
        //   break;
        case "设置卡尔曼":
          let urlkal = `/api/Mon_Point_Manager/GetKalmanData?pointNum=${row.Point_Num}`;
          this.http.get(urlkal, {}, true).then((result) => {
            console.log("result",result);
            this.$refs.gridKalmanInfo.openKalmanInfo(result)
          });
          break;
        case "实时点云数据":
          this.$refs.gridTimelyRadar.openTimeRadar(row)
          break;
        case "历史点云数据":
          this.$refs.gridHistoryRadar.openHistoryRadar(row)
          break;
        case "音频记录":
          this.$refs.gridFrequency.openFrequency(row)
          break;
        case "配置雷达参数":
          this.$refs.gridConfiguration.openConfiguration(row)
          break;
        case "震动数据":
          this.$refs.gridShake.openShake(row)
          break;
        case "监控视频":
          this.$refs.gridMovie.openMovie(row)
          break;
        case "更改状态":
          let tips = row.Enabled == 1 ?'确认要停用选择设备吗？':'确认要启用选择设备吗？'
          this.$confirm(tips, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.http.post('/api/Mon_Point_Manager/EnableMonitor', {pointNums:[row.Point_Num],enabled:row.Enabled == 1?false:true}, true).then((result) => {
              if(result.status) {
                this.$message.success(result.message);
                this.refresh();
              }
              else {
                this.$message.error(result.message)
              }
            });
          });
        default:
          break;
      }
    },
    getRow(data){
      this.editFormFields["Config"]= JSON.stringify(data) 
      console.log("this.editFormFields",this.editFormFields["Config"]);

    },
    //点击边树节点刷新右边表格
    nodeClick(data){ 
      // console.log("nodeType",data);
      this.table.cnName=data.nodeName+'—监测点位管理'
      this.data=data;
      this.refresh();
    },
    onInit() {  
      //缓存当前table页面，点击树刷新页面
      this.$store.getters.data().MonPointManager = this;
      //默认不加载表格数据,由Tree组件中created方法来触发默认加载数据
      this.load=false;
      this.nodeValue1 = 2;
      //表格上添加自定义按钮
      this.columns.push({
        title: "操作",
        field: "操作",
        width: 200,
        align: "center",
        render: (h, { row, column, index }) => {
          if(row.NeedInitial==1&&row.KalmanConfig){
          //   return <div >
          //   <el-button onClick={($e) => { this.editClick(row, $e) }} type="primary" plain size="small" style="padding: 10px !important;">编辑</el-button>
          //   <el-button onClick={($e) => { this.delClick(row, $e) }} type="danger" plain size="small" style="padding: 10px !important;">删除</el-button>

            
          //   <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
          //     dropdown: () => (
          //       <el-dropdown-menu>
          //         <el-dropdown-item><div onClick={() => { this.dropdownClick('初始化',row,column) }}>初始化</div></el-dropdown-item>
          //         <el-dropdown-item><div onClick={() => { this.dropdownClick('监测数据',row,column) }}>监测数据</div></el-dropdown-item>
          //         <el-dropdown-item><div onClick={() => { this.dropdownClick('运行数据',row,column) }}>运行数据</div></el-dropdown-item>
          //         <el-dropdown-item><div onClick={() => { this.dropdownClick('卫星数据',row,column) }}>卫星数据</div></el-dropdown-item>
          //         <el-dropdown-item><div onClick={() => { this.dropdownClick('单相分析',row,column) }}>单相分析</div></el-dropdown-item>
          //       </el-dropdown-menu>
          //     )
          //   }}
          //   >
          //    <span style="font-size: 12px;color: #409eff;margin: 5px 0 0 10px; cursor: pointer;" class="el-dropdown-link">
          //       更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
          //     </span>
          //   </el-dropdown>
            
          // </div>
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
           
          ],
          <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
              dropdown: () => (
                <el-dropdown-menu>
                  {row.Formula_Config ? h(resolveComponent("el-dropdown-item"), {}, [
                    h("div", {
                      onClick: () => { this.dropdownClick('计算数据', row, column) }
                    }, "计算数据")
                  ]) : null}
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('初始化',row,column) }}>初始化</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('监测数据',row,column) }}>监测数据</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('运行数据',row,column) }}>运行数据</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('卫星数据',row,column) }}>卫星数据</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('单相分析',row,column) }}>单相分析</div></el-dropdown-item>
                  {/* <el-dropdown-item><div onClick={() => { this.dropdownClick('卡尔曼初始值',row,column) }}>卡尔曼初始值</div></el-dropdown-item> */}
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('设置卡尔曼',row,column) }}>设置卡尔曼</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('设备分析',row,column) }}>设备分析</div></el-dropdown-item>
                  <el-dropdown-item><div onClick={() => { this.dropdownClick('更改状态',row,column) }}>{row.Enabled == 1?'停用设备':'启用设备'}</div></el-dropdown-item>
                </el-dropdown-menu>
              )
            }}
            >
             <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
                更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </el-dropdown>)
          }else if(row.NeedInitial==0&&!row.KalmanConfig&&row.Type_Id!=14){
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
             
            ],
            <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
                dropdown: () => (
                  <el-dropdown-menu>
                    {row.Formula_Config ? h(resolveComponent("el-dropdown-item"), {}, [
                      h("div", {
                        onClick: () => { this.dropdownClick('计算数据', row, column) }
                      }, "计算数据")
                    ]) : null}
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('监测数据',row,column) }}>监测数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('运行数据',row,column) }}>运行数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('卫星数据',row,column) }}>卫星数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('单相分析',row,column) }}>单相分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('设备分析',row,column) }}>设备分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('更改状态',row,column) }}>{row.Enabled == 1?'停用设备':'启用设备'}</div></el-dropdown-item>
                    {/* <el-dropdown-item><div onClick={() => { this.dropdownClick('卡尔曼初始值',row,column) }}>卡尔曼初始值</div></el-dropdown-item> */}


                  </el-dropdown-menu>
                )
              }}
              >
               <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
                更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </el-dropdown>)
          }else if(row.NeedInitial==1&&!row.KalmanConfig){
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
             
            ],
            <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
                dropdown: () => (
                  <el-dropdown-menu>
                    {row.Formula_Config ? h(resolveComponent("el-dropdown-item"), {}, [
                      h("div", {
                        onClick: () => { this.dropdownClick('计算数据', row, column) }
                      }, "计算数据")
                    ]) : null}
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('初始化',row,column) }}>初始化</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('监测数据',row,column) }}>监测数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('运行数据',row,column) }}>运行数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('卫星数据',row,column) }}>卫星数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('单相分析',row,column) }}>单相分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('设备分析',row,column) }}>设备分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('更改状态',row,column) }}>{row.Enabled == 1?'停用设备':'启用设备'}</div></el-dropdown-item>
                    {/* <el-dropdown-item><div onClick={() => { this.dropdownClick('卡尔曼初始值',row,column) }}>卡尔曼初始值</div></el-dropdown-item> */}
                  </el-dropdown-menu>
                )
              }}
              >
               <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
                  更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </el-dropdown>)
          }else if(row.NeedInitial==0&&row.KalmanConfig){
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
             
            ],
            <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
                dropdown: () => (
                  <el-dropdown-menu>
                    {row.Formula_Config ? h(resolveComponent("el-dropdown-item"), {}, [
                      h("div", {
                        onClick: () => { this.dropdownClick('计算数据', row, column) }
                      }, "计算数据")
                    ]) : null}
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('初始化',row,column) }}>初始化</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('监测数据',row,column) }}>监测数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('运行数据',row,column) }}>运行数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('卫星数据',row,column) }}>卫星数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('单相分析',row,column) }}>单相分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('设置卡尔曼',row,column) }}>设置卡尔曼</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('设备分析',row,column) }}>设备分析</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('更改状态',row,column) }}>{row.Enabled == 1?'停用设备':'启用设备'}</div></el-dropdown-item>
                  </el-dropdown-menu>
                )
              }}
              >
               <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
                  更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </el-dropdown>)
          }else if(row.NeedInitial==0&&!row.KalmanConfig&&row.Type_Id===14){
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
             
            ],
            <el-dropdown onClick={(value) => { this.dropdownClick(value) }} trigger="click" v-slots={{
                dropdown: () => (
                  <el-dropdown-menu>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('实时点云数据',row,column) }}>实时点云数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('历史点云数据',row,column) }}>历史点云数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('音频记录',row,column) }}>音频记录</div></el-dropdown-item>
                    {/* <el-dropdown-item><div onClick={() => { this.dropdownClick('配置雷达参数',row,column) }}>配置雷达参数</div></el-dropdown-item> */}
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('震动数据',row,column) }}>震动数据</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('监控视频',row,column) }}>监控视频</div></el-dropdown-item>
                    <el-dropdown-item><div onClick={() => { this.dropdownClick('更改状态',row,column) }}>{row.Enabled == 1?'停用设备':'启用设备'}</div></el-dropdown-item>
                  </el-dropdown-menu>
                )
              }}
              >
               <el-button plain size="small" type="primary" style="font-size: 12px;cursor: pointer; margin-left:10px" class="el-dropdown-link">
                  更多操作<i style="color:blue" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
              </el-dropdown>)
          }
        }
      })
      // 新增数据时类型数据配置
      this.editFormOptions.forEach(x => {
        x.forEach(item => {
          if (item.field == 'Config') {
            //editFormOptions更多配置见volform组件api
            item.extra = {
              icon: "el-icon-zoom-out",
              text: "配置数据",
              style: "color:blue;font-size: 14px;cursor: pointer;",
              click: item => {
                let forms=this.editFormFields;
                //深部位移(测斜版)
                if(forms.Type_Id=='29' || forms.Type_Id=='44'){
                  if(forms.Dev_Id==''){
                    this.$Message.error("请输入设备id");
                    return;
                  }
                  this.$refs.modelHeader.open(forms);
                }else{
                  this.$refs.modelBody.open(this.editFormFields);
                }
              }
             }
          }
          else if(item.field == 'Formula_Config') {
            item.extra = {
              list:[
                {
                  icon: "el-icon-setting",
                  text: "公式配置",
                  style: "color:blue;font-size: 14px;cursor: pointer;",
                  click: item => {
                    this.$refs.gridMathSet?.open(this.editFormFields)
                  }
                },
                {
                  icon: "el-icon-view",
                  text: "数据预览",
                  style: "color:blue;font-size: 14px;cursor: pointer;",
                  click: item => {
                    if(!this.editFormFields.Formula_Config){
                      this.$message({
                        message: '请先配置数据公式',
                        type: 'warning'
                      });
                      return
                    }
                    this.$refs.gridMath?.openRecord(this.editFormFields)
                  }
                }
              ],
              
             }
          }
         })
        })

      this.boxOptions.height=670
      this.boxOptions.labelWidth = 120;
    },
    onInited() {
    },
    searchBefore(param) {
      // 默认加载第一条数据
      param.order="asc"
      let nodeType = this.$store.getters.data().MonPointTreeData.nodeType;
      let nodeValue = this.$store.getters.data().MonPointTreeData.nodeValue;
      param.wheres = [{ name: nodeType, value: nodeValue }];
      // tree点击事件触发后加载当前
      if (this.data.nodeType || this.searchFormFields.Point_Name) {
        param.wheres = [{ name: this.data.nodeType, value: this.data.nodeValue},{ name: "Point_Name,Point_Num,Dev_Id", value: this.searchFormFields.Point_Name}];
      }else{
        param.wheres = [{ name: this.data.nodeType, value: this.data.nodeValue}]
      }
      return true;
    },
    searchAfter(result) {
      return true;
    },
    addBefore(formData) {
      // let formData = this.$store.getters.data().MonPointTreeData.treeId;
      // if (formData === undefined) {
      //   this.$Message.error("请选择左侧区域")
      //   return false;
      // }
      return true;
    },
    updateBefore(formData) {
      return true;
    },
    rowClick({ row, column, event }) {
    },
    modelOpenAfter(row) {
      let nodeValue = this.data.nodeValue;
      let lv=this.data.lv
      if(this.currentAction=='Add'&& lv==4 ){
        this.editFormFields.Group_Id=nodeValue;
      }
    }
  }
};
export default extension;
