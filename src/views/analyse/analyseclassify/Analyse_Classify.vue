<template>
  <div class="com-tree">
    <div class="left-tree">
      <AnalyseClassifyTree :onChange="onChange"></AnalyseClassifyTree>
    </div>
    <div class="right-table">
      <div class="search-info">
        <div>
          <VolHeader :text="text" icon="md-podium"> </VolHeader>
        </div>
        <el-form class="usform" ref="form" :model="form" label-width="100px">
              <el-form-item label="日期范围：">
                <el-col :span="20">
                  <el-date-picker
                    ref="timeBox"
                    v-model="form.datePicker.time"
                    :shortcuts="shortcuts"
                    @change="timelet"
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
              <el-form-item label="分析方式：">
                <el-select v-model="form.radio" placeholder="请选择分析方式" style="width: 80px">
                  <el-option
                     :key="item.key + index"
                     v-for="(item, index) in showData.radioGroup"
                    :label="item.name"
                    :value="item.key">
                  </el-option>
                </el-select>
                <el-button class="search-button ml12" type="primary" @click="click">
                  查询
                </el-button>
                <el-button class="ml12"  @click="resute">
                  重置
                </el-button>
              </el-form-item>
            </el-form>

      </div>
      <!-- 图表 -->
      <div class="bsmaps">
        <div id="operation-data" class="dark">
          <div class="right-box">
            <!-- 1折柱混合 2折 3柱 -->
            <div class="speed">
              <chart
                class="chart-box"
                :getParam="chartData"
                :id="'point-chart'"
              ></chart>
              <div style="display: none;">
                <div class="fold" v-if="downStow">
                  <span @click="hanldeDownStow" class="foldMsg">{{
                    foldMsg
                  }}</span>
                </div>

                <div class="foldStow" v-if="downFold">
                  <span @click="hanldeDownFold" class="foldMsg">{{
                    foldMsg
                  }}</span>
                </div>
                <el-card class="box-card" v-if="downFold">
                  <h4>结论分析</h4>
                  <div class="text item">
                    <div>今日位移：1.51mm</div>
                    <div>本周位移：1.51mm</div>
                    <div>累计位移：1.51mm</div>
                    <div :span="24">今日变形速率：1.51mm</div>
                  </div>
                </el-card>
              </div>
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
import AnalyseClassifyTree from "../../monitor/monitorRecord/monitor/MonitorRecordTree.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "./components/chart-line.vue";

export default {
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    AnalyseClassifyTree: AnalyseClassifyTree,
    chart: chart,
  },
  computed: {
    // startTime: function() {
    //   return this.form.datePicker.time[0];
    // },
    // endTime: function() {
    //   return this.form.datePicker.time[1];
    // },
  },
  data() {
    return {
      downStow: true,
      downFold: false,
      foldMsg: "收起",
      activeNames: ["1"],
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
      chartData: {},
      options_id: "",
      icon: "el-icon-s-grid",
      text: "多元分析",
    };
  },
  created() {
    this.getTime();
  },
  methods: {
    timelet(e) {
      this.startTime = this.filterTime(e[0]);
      this.endTime = this.filterTime(e[1]);
    },
    hanldeDownStow() {
      this.foldMsg = "展开";
      this.downStow = !this.downStow;
      this.downFold = true;
      // setTimeout(()=>{
      // }, 1000);
    },
    hanldeDownFold() {
      this.foldMsg = "收起";
      this.downFold = !this.downFold;
      this.downStow = true;
    },
    handleChange(val) {
      console.log(val);
    },
    // 图表传输信息
    ChartInit(e) {
      const getParam = {
        groupId: e,
        startTime: this.startTime,
        endTime: this.endTime,
        total: 5000,
        timeType: this.form.radio,
      };
      this.chartData = getParam;
      console.log("getParam", getParam);
    },
    getTime() {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
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
    // 加载树的方法
    onChange(treeId, type) {
      this.$nextTick(() => {
        console.log("treeId", treeId);
        this.text = treeId.nodeName + "—多元分析";
        console.log("nodeValue", treeId.nodeValue);
        this.options_id = treeId.nodeValue;
        this.ChartInit(this.options_id);
      });
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
    width:calc(100% - 221px);
    display: flex;
    justify-content:right;
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
  // padding: 0 15px;
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
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 15px;
    div {
      font-size: 14px;
      line-height: 30px;
      color: #999;
    }
  }
  .speed {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }

  .box-card {
    width: 320px;
    position: absolute;
    right: 20px;
  }
  .fold {
    width: 40px;
    margin-left: -10px;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    margin-top: -10px;
  }
  .foldStow {
    width: 40px;
    margin-left: -10px;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    margin-top: -10px;
  }
}
</style>
