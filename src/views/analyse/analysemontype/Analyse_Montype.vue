<template>
  <div class="com-tree">
    <div class="left-tree">
      <AnalyseMontypeTree :onChange="onChange"></AnalyseMontypeTree>
    </div>
    <div class="right-table">
      <div class="search-info">
        
        <el-form class="usform" ref="form" :model="form" :inline="true" label-width="90px">
              <el-form-item>
                <div>
                  <VolHeader :text="text" icon="md-podium"> </VolHeader>
                </div>
              </el-form-item>
              <el-form-item label="监测类型：">
                <el-select
                  v-model="options_id"
                  placeholder="请选择点位"
                  @change="getOptionsId"
                  style="width: 140px;"
                  filterable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.ID"
                    :label="item.Type_Name"
                    :value="item.ID"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="监测点位：">
                <el-select
                  v-model="dianValue"
                  placeholder="请选择点位"
                  style="width: 140px;"
                  multiple
                  collapse-tags
                  filterable
                >
                  <el-option
                    v-for="(item,index) in dianList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期范围：">
                <el-col :span="20">
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
                </el-col>
              </el-form-item>
              <el-form-item label="显示方式：">
                <el-select v-model="form.radio" placeholder="请选择分析方式" style="width: 80px;">
                  <el-option
                     :key="item.key + index"
                     v-for="(item, index) in showData.radioGroup"
                    :label="item.name"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="0">
                <div style="display: flex;">
                  <el-button
                      type="primary"
                      @click="click"
                    >
                      查询
                </el-button>
                <el-button class="ml12"  @click="resute">
                  重置
                </el-button>
                </div>
              </el-form-item>
            </el-form>
      </div>

      <!-- 图表 -->
      <div class="bsmaps">
        <div id="operation-data" class="dark">
          <div class="right-box">

            <!-- 折柱混合 雨量设备 -->
            <div class="speed" v-if="this.options_id == 4 || this.options_id == 3||this.options_id == 5">
              <chartlinebar
                class="chart-box"
                :getParam="chartData"
                :id="'point-chart'"
                @getDianList="getDianList"
                :dianValue="dianValue"
              ></chartlinebar>
            </div>

            <!-- 折现 -->
            <div class="speed" v-else>
              <chart
                class="chart-box"
                :getParam="chartData"
                :id="'point-chart'"
                @getDianList="getDianList"
                :dianValue="dianValue"
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
import chartlinebar from "./components/chart-linebar.vue";

export default {
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    AnalyseMontypeTree: AnalyseMontypeTree,
    chart: chart,
    chartlinebar: chartlinebar,
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
      options: [], //接收监测类型
      dianList:[], //接收监测点位列表
      dianValue:[], //选中监测点
      icon: "el-icon-s-grid",
      text: "分类分析",
      monitorTableData: [],
      groupId: "", //分组id
    };
  },
  created() {},
  methods: {
    // 获取点位列表
    getDianList(arr) {
      this.dianList = Array.from(new Set(arr));
    },
    // 图表传输信息
    ChartInit(e) {
      const getParam = {
        groupId: this.groupId,
        typeId: e ? e : this.options_id,
        startTime: this.startTime,
        endTime: this.endTime,
        total: 5000,
        timeType: this.form.radio,
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
     //重置
     resute(){
      this.form.datePicker=this.$options.data().form.datePicker;
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      this.form.radio=this.$options.data().form.radio;
      this.ChartInit(this.options_id);
    },
    // 点击树的方法
    onChange(treeId, type) {
      this.$nextTick(() => {
        this.text = treeId.nodeName + "—分类分析";
        // 分组id
        this.groupId = treeId.nodeValue;
        this.pointPosition(treeId);
      });
    },

    // 查询监测类型
    pointPosition() {
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "Type_Order",
      };
      param.wheres = `[]`;
      this.http
        .post("/api/Mon_Type_Manager/getPageData", param, true)
        .then((result) => {
          console.log("result", result);
          this.options = result.rows;
          // 监测类型id
          this.options_id = result.rows[0].ID;
          this.dianValue = []
          this.getMonitorData();
          this.ChartInit(this.options_id);
        });
    },

    // 选择点位编号的逻辑
    getOptionsId(data) {
      this.options_id = data;
      this.dianValue = [];
      this.ChartInit();
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
  width: 100%;
  // height: 62px;
  padding: 0px 24px 10px;
  border-bottom: 1px solid #f5f5f5;
  .living {
    display: flex;
  }
  .usform{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap:10px;
    align-items: center;
    ::v-deep .el-form-item--default{
      margin-bottom: 0 !important;
    }
    ::v-deep .el-form-item {
      margin-right: 0 !important;
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
    // margin-left: 30px;
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
  }
</style>
