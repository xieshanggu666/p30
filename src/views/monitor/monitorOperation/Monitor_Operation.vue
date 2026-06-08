<template>
  <div class="com-tree">
    <!-- <div id="appLoading">
      <div class="lmask"></div>
    </div> -->
    <div class="left-tree">
      <MonitorOperationTree
        :onChange="onChange"
        :pointTreeId="pointTreeId"
      ></MonitorOperationTree>
    </div>
    <div class="right-table">
      <div class="search-info">
        <div>
          <VolHeader :text="text" icon="md-podium"> </VolHeader>
        </div>
        <div class="r-info">
          <div class="headerView">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="日期范围：">
                <el-date-picker
                  ref="timeBox"
                  v-model="form.datePicker.time"
                  :shortcuts="shortcuts"
                  type="datetimerange"
                  range-separator="至"
                  :start-placeholder="'开始时间'"
                  :end-placeholder="'结束时间'"
                  :clearable="true"
                  :default-time="form.datePicker.defaultTime"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="click" style="margin-left:15px"
              >查询</el-button
            >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="列表管理" name="second"></el-tab-pane>
              <el-tab-pane label="图表管理" name="first"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="nidomh" v-if="view == 1">
        <vol-table
          :style="contentStyleObj"
          ref="table"
          :columns="columns"
          :max-height="720"
          :index="true"
          :tableData="monitorTableData"
          :paginationHide="true"
          :single="true"
        ></vol-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[30, 60, 100, 120]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 图表 -->
      <div class="egis" v-if="view == 2">
        <div id="operation-data" class="dark">
          <div class="right-box">
            <chart
              class="chart-box"
              :getParam="chartData"
              :id="'point-chart'"
            ></chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import MonitorOperationTree from "../monitorRecord/monitor/MonitorRecordFilterTree.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "./components/chart-line.vue";
export default {
  // inject:['loading','loaded'],
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    MonitorOperationTree: MonitorOperationTree,
    chart: chart,
  },
  computed: {
    startTime: function() {
      return this.form.datePicker.time[0];
    },
    endTime: function() {
      return this.form.datePicker.time[1];
    },
  },
  data() {
    return {
      pointTreeId: "",
      contentStyleObj: {
        height: "",
        overflow: "auto",
        padding: "0 15px",
      },
      activeName: "second",
      shortcuts,
      form: {
        datePicker: {
          time: [
            new Date(new Date().toLocaleDateString()),
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),
          ],
          defaultTime: [
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ],
        },
        radio: "REAL_TIME",
        radio_display: 1,
        checkAll: false,
      },
      startTime: "",
      endTime: "",
      showData: {
        displayMode: [
          { label: "图表统计", value: "1" },
          { label: "列表统计", value: "2" },
        ],
        radioGroup: [
          {
            key: "REAL_TIME",
            name: "实时",
            tips: "展示一天内时间粒度为秒的数据",
          },
          {
            key: "HOURS",
            name: "小时",
            tips: "展示时间粒度为1小时的数据,最大查询时间31天,不可跨年",
          },
          {
            key: "DAY",
            name: "自然日",
            tips:
              "展示时间粒度为天的数据,最大查询时间15天,不展示今日数据,不可跨年",
          },
        ],
      },
      isIndeterminate: true,
      chartData: {},
      view: 1,
      searchFields: {
        CreateDate: [],
      },
      formOptions: [
        //表单配置见表单组件文档
        [
          {
            title: "创建时间",
            range: true,
            colSize: 6,
            field: "CreateDate",
            type: "date",
            onChange: (val) => {},
          },
        ],
      ],
      options_id: "",
      options: [], //接收监测点位
      value: "",
      pagination: { total: 0 }, //从表分页配置数据
      icon: "el-icon-s-grid",
      text: "运行数据管理",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
      columns: [
        {
          field: "ID",
          title: "ID",
          type: "int",
          width: 110,
          hidden: true,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "DataTime",
          title: "创建时间",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
      ],
      detail: {
        cnName: "#detailCnName",
        table: "#detailTable",
        columns: [],
        sortName: "",
        key: "",
      },
    };
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.pointTreeId = this.$store.getters.getTreeValue();
  },
  unmounted() {
    window.removeEventListener("resize", this.getHeight);
  },

  methods: {
    // loading
    loading() {
      document.getElementById("app").style.display = "block";
      document.getElementById("appLoading").style.display = "block";
    },
    loaded() {
      document.getElementById("app").style.display = "block";
      document.getElementById("appLoading").style.display = "none";
    },
    
    getHeight() {
      if (window.innerHeight < 768 || window.innerHeight < 1080) {
        this.contentStyleObj.height = "731px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 200 + `px`;
      }
    },
    // 点击tabs
    handleClick(tab, event) {
      if (tab.props.name == "first") {
        this.ChangeOne(2);
      } else {
        this.ChangeOne(1);
      }
    },
    ChangeOne(e) {
      this.view = e;
      if (this.view == 2) {
        this.ChartInit();
      } else {
        this.getMonitorData(this.options_id);
      }
    },

    // 图表传输信息
    ChartInit(e) {
      const getParam = {
        pointNum: e ? e : this.options_id,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      this.chartData = getParam;
    },

    filterTime(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMonitorData(this.options_id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMonitorData(this.options_id);
    },

    // 查询方法
    click() {
      if (this.view == 1) {
        this.getMonitorData(this.options_id);
      } else {
        this.getDispose(this.options_id);
        this.getMonitorData(this.options_id);
        this.ChartInit(this.options_id);
        this.columns.splice(0, this.columns.length - 3);
      }
    },

    // 点击树的方法
    onChange(treeId, type) {
      this.$nextTick(() => {
        //调用table刷新方法
        // console.log("type", type);
        this.text = treeId.nodeName + "—运行数据管理";
        this.columns.splice(0, this.columns.length - 1);
        // 点击树默认触发
        if (type == 1 && this.view == 1) {
          this.pointPositionLast(treeId);
        } else if (type == 2 && this.view == 1) {
          this.pointPositionLast(treeId);
        } else if (type == 2 && this.view == 2) {
          this.pointPosition(treeId);
        }
      });
    },

    // 默认查询监测点位
    pointPositionLast(treeId) {
      this.options_id = treeId.nodeValue;
      this.getDispose(this.options_id);
    },

    // 点击查询监测点位
    pointPosition(treeId) {
      this.options_id = treeId.nodeValue;
      this.getDispose(this.options_id);
      this.ChartInit(this.options_id);
    },

    // 获取监测点的监测类型配置信息
    getDispose(data) {
      let url = `/api/Mon_Point_Manager/GetRunDataConfig?pointNum=${data}`;
      this.http.get(url, {}, true).then((result) => {
        this.tableData = JSON.parse(result.data).reverse();
        // console.log("this.tableData", this.tableData);
        this.tableData.forEach((x) => {
          this.columns.unshift({
            field: x.FieldName,
            title: x.DisplayName,
            type: "string",
            width: 110,
            readonly: true,
            require: true,
            align: "left",
            sort: true,
          });
        });
        this.getMonitorData(data);
      });
    },

    // 获取运行数据
    getMonitorData(data) {
      // this.loading()
      this.monitorTableData = [],
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      let url = `/api/Mon_Point_Manager/GetRunData?pointNum=${data}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.rows;
        // this.loaded()
        this.total = result.total;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.egis{
  height: calc(100% - 62px);
}
.nidomh{
  position: relative;
  height: calc(100% - 62px);
  padding: 24px 24px 0;
}
::v-deep .vol-table{
  height:100% !important;
  padding: 0 !important;
}
::v-deep .v-header {
  background: white;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  .v-left-text {
    font-size: 14px;
  }
}
::v-deep .v-header {
  border-bottom: 0px solid #dcdee2;
}
::v-deep .el-input__wrapper {
  width: 140px;
  height: 33px;
}
::v-deep .el-tabs__header {
  height: 33px;
  margin-bottom: 0 !important;
}
::v-deep .el-tabs {
  --el-tabs-header-height: 33px;
  margin-left: 15px;
}
::v-deep .el-date-editor {
  width: 400px;
}

.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 24px;
  height: 62px;
  border-bottom: 1px solid #f5f5f5;
  .living {
    display: flex;
  }
}
::v-deep .headerView {
  display: flex;
  align-items: center;
  // margin-top: 10px;
}
::v-deep .el-form-item--default{
  margin-bottom: 0 !important;
}

.com-tree {
  display: flex;
  height: 100%;
  > .left-tree {
    width: 240px;
    height: 100%;
    background: #fff;
    margin-right: 5px;
  }
  > .right-table {
    width: calc(100% - 245px);
    height: 100%;
    background: #fff;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 24px;
  right: 24px;
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;
  height: 100%;
  .right-box {
    // background: #0c2751;
    // height: 800px;
    height: 100%;
    padding: 24px;
    border: 1px solid #f8f8f9;
    .chart-box{
      height: 100% !important;
    }
  }

  .is-top {
    color: black;
  }

  ::v-deep .el-tabs__nav-scroll .el-tabs__item {
    // background: #0c2751;
    padding: 0 6px !important;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

  .el-form-item__label {
    color: black;
  }

  .search-button {
    margin-left: 56px;
    width: 140px;
  }

  ::v-deep .el-range-input {
    // background: #11305f;
    color: black;
  }

  ::v-deep .el-form-item__label {
    color: black;
    margin-top: 5px;
  }

  .el-input__inner {
    // background: #11305f;
    // border: 1px solid #2e4975;
    color: black;
  }

  ::v-deep .el-date-editor {
    // background: #11305f;
    color: black !important;

    * {
      border: none;
    }
  }

  .tips {
    display: block;
    margin: 10px 0 0 60px;
    color: red;
    font-size: 12px;
  }
}

// .lmask {
//   position: absolute;
//   height: 100%;
//   width: 100%;
//   background-color: #000;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   top: 0;
//   z-index: 9999;
//   opacity: 0.4;
//   &.fixed {
//     position: fixed;
//   }
//   &:before {
//     content: "";
//     background-color: rgba(0, 0, 0, 0);
//     border: 5px solid rgba(0, 183, 229, 0.9);
//     opacity: 0.9;
//     border-right: 5px solid rgba(0, 0, 0, 0);
//     border-left: 5px solid rgba(0, 0, 0, 0);
//     border-radius: 50px;
//     box-shadow: 0 0 35px #2187e7;
//     width: 50px;
//     height: 50px;
//     -moz-animation: spinPulse 1s infinite ease-in-out;
//     -webkit-animation: spinPulse 1s infinite linear;

//     margin: -25px 0 0 -25px;
//     position: absolute;
//     top: 50%;
//     left: 50%;
//   }
//   &:after {
//     content: "";
//     background-color: rgba(0, 0, 0, 0);
//     border: 5px solid rgba(0, 183, 229, 0.9);
//     opacity: 0.9;
//     border-left: 5px solid rgba(0, 0, 0, 0);
//     border-right: 5px solid rgba(0, 0, 0, 0);
//     border-radius: 50px;
//     box-shadow: 0 0 15px #2187e7;
//     width: 30px;
//     height: 30px;
//     -moz-animation: spinoffPulse 1s infinite linear;
//     -webkit-animation: spinoffPulse 1s infinite linear;

//     margin: -15px 0 0 -15px;
//     position: absolute;
//     top: 50%;
//     left: 50%;
//   }
// }

// @-moz-keyframes spinPulse {
//   0% {
//     -moz-transform: rotate(160deg);
//     opacity: 0;
//     box-shadow: 0 0 1px #2187e7;
//   }
//   50% {
//     -moz-transform: rotate(145deg);
//     opacity: 1;
//   }
//   100% {
//     -moz-transform: rotate(-320deg);
//     opacity: 0;
//   }
// }
// @-moz-keyframes spinoffPulse {
//   0% {
//     -moz-transform: rotate(0deg);
//   }
//   100% {
//     -moz-transform: rotate(360deg);
//   }
// }
// @-webkit-keyframes spinPulse {
//   0% {
//     -webkit-transform: rotate(160deg);
//     opacity: 0;
//     box-shadow: 0 0 1px #2187e7;
//   }
//   50% {
//     -webkit-transform: rotate(145deg);
//     opacity: 1;
//   }
//   100% {
//     -webkit-transform: rotate(-320deg);
//     opacity: 0;
//   }
// }
// @-webkit-keyframes spinoffPulse {
//   0% {
//     -webkit-transform: rotate(0deg);
//   }
//   100% {
//     -webkit-transform: rotate(360deg);
//   }
// }
</style>
