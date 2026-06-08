<template>
  <div class="com-tree">
    <div class="left-tree">
      <AnalyseMontypeTree :onChange="onChange"></AnalyseMontypeTree>
    </div>
    <div class="right-table">
      <div class="search-info">
        <div>
          <VolHeader :text="text" icon="md-podium"> </VolHeader>
        </div>
        <el-form class="usform"  ref="form" :model="form" label-width="100px">
            <el-form-item label="点位选择：">
              <el-select
                style="width: 140px;"
                v-model="options_id"
                placeholder="请选择点位"
                @change="getOptionsId"
              >
                <el-option
                  v-for="item in options"
                  :key="item.Point_Num"
                  :label="item.pointName"
                  :value="item.Point_Num"
                >
                </el-option>
              </el-select>
            </el-form-item>
        </el-form>
      </div>

      <!-- 图表 -->
      <div class="bsmaps">
        <div id="operation-data" class="dark">
          <div class="right-box">
            
        
            <div class="speed">
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
  </div>
</template>
<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import AnalyseMontypeTree from "../../monitor/monitorRecord/monitor/MonitorRecordTree.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "./components/chart-line.vue";

export default {
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    AnalyseMontypeTree: AnalyseMontypeTree,
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
      activeName: "second",
      shortcuts,
      form: {
        datePicker: {
          time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          defaultTime: [
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ],
        },
        radio: "0",
        checkAll: false,
        value: true,
      },
      startTime: "",
      endTime: "",
      showData: {
        radioGroup: [
          {
            key: "0",
            name: "小时",
          },
          {
            key: "1",
            name: "天",
          },
          {
            key: "2",
            name: "月",
          },
        ],
      },
      isIndeterminate: true,
      chartData: {},
      options_id: "",
      options: [], //接收监测点位
      icon: "el-icon-s-grid",
      text: "趋势分析",
      monitorTableData: [],
      groupId: "", //分组id
    };
  },
  created() {},
  methods: {
    // 图表传输信息
    ChartInit(e) {
      const getParam = {
        pointNum: e ? e : this.options_id,
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

    // 点击查询条件
    click() {
      this.getMonitorData(this.options_id);
      this.ChartInit(this.options_id);
    },

    // 点击树的方法
    onChange(treeId, type) {
      this.$nextTick(() => {
        this.text = treeId.nodeName + "—趋势分析";
        this.pointPosition(treeId);
      });
    },

    // 点击查询监测点位
    pointPosition(treeId) {
      var param = {
        order: "asc",
        page: 1,
        rows: 100,
        sort: "Point_Order",
      };
      param.wheres = `[{\'name\':\ '${treeId.nodeType}', \'value\':\' ${treeId.nodeValue}\'}]`;
      this.http
        .post("/api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          this.options = result.rows;
          this.options.map((item) => {
            item.pointName = item.Point_Name + `(${item.Point_Num})`;
          });
          this.options_id = result.rows[0].Point_Num;
          this.getMonitorData(this.options_id);
          this.ChartInit(this.options_id);
        });
    },

    // 选择点位编号的逻辑
    getOptionsId(data) {
      this.options_id = data;
      this.ChartInit(this.options_id);
    },

    getMonitorData() {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
    },
  },
};
</script>

<style lang="less" scoped>
.bsmaps{
  width: 100%;
  height: calc(100% - 62px);
}
  .ml12{
    margin-left: 12px !important;
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
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 62px;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  .living {
    display: flex;
  }
  .usform{
    width:calc(100% - 121px);
    display: flex;
    justify-content: left;
    align-items: center;
    ::v-deep .el-form-item--default{
      margin-bottom: 0 !important;
    }
  }
}
::v-deep .headerView {
  display: flex;
  margin-top: 10px;
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
.btns {
  background-color: #fff;
}
#operation-data {
  width: 100%;
  height: 100%;
  .right-box {
    height: 100%;
    padding: 0px;
  }

  .is-top {
    color: black;
  }

  ::v-deep .el-tabs__nav-scroll .el-tabs__item {
    padding: 0 6px !important;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

  .el-form-item__label {
    color: black;
  }

  .search-button {
    margin-left: 30px;
    width: 100px;
  }

  ::v-deep .el-range-input {
    color: black;
  }

  ::v-deep .el-form-item__label {
    color: black;
    margin-top: 5px;
  }

  .el-input__inner {
    color: black;
  }

  ::v-deep .el-date-editor {
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
.speed {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }
</style>
