<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看单相分析"
      :height="870"
      :width="1500"
      :padding="15"
      :before-close="handleClose"
    >
      <div class="com-tree">
        <div class="right-table">
          <div class="search-info">
            <div>
              <VolHeader :text="text" icon="md-podium"> </VolHeader>
            </div>
          </div>

          <!-- 图表 -->
          <div class="wautos">
            <div id="operation-data" class="dark">
              <div class="right-box">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="点位选择：">
                        <el-input
                          v-model="this.Point_Name"
                          :disabled="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
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
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="分析方式：">
                        <el-radio-group v-model="form.radio">
                          <el-radio
                            :key="item.key + index"
                            v-for="(item, index) in showData.radioGroup"
                            :label="item.key"
                            >{{ item.name }}</el-radio
                          >
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="是否滤波：">
                        <el-switch
                          v-model="form.value"
                          active-color="#409eff"
                          inactive-color="#ff4949"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-rol :span="6">
                      <el-form-item label="显示切线角：">
                        <el-switch
                          v-model="showAngle"
                          active-color="#409eff"
                          inactive-color="#ff4949"
                        >
                        </el-switch>
                        <el-button
                          class="search-button"
                          type="primary"
                          @click="click"
                        >
                          生成图表
                        </el-button>
                        <el-button
                          class="search-button"
                          type="primary"
                          @click="report"
                        >
                          导出
                        </el-button>
                      </el-form-item>
                    </el-rol>
                  </el-row>
                </el-form>
                <div
                  class="tuxing"
                  v-if="
                    (this.analyseId == 2 && this.Type_Id === 15) ||
                      (this.analyseId == 2 && this.Type_Id === 19)
                  "
                >
                  <div class="box1">
                    <chartdeep
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chart-deep'"
                    ></chartdeep>
                  </div>
                  <div class="box2">
                    <chartdeepB
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chart-deep2'"
                    ></chartdeepB>
                  </div>
                </div>
                <!-- 1折柱混合 2折 3柱 -->

                <div
                  v-if="
                    this.analyseId == 2 &&
                      this.Type_Id != 15 &&
                      this.Type_Id != 17 &&
                      this.Type_Id != 19 &&
                      this.Type_Id != 10
                  "
                  class="speed"
                >
                  <div>
                    <chart
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-chart'"
                    ></chart>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div>
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

                <!-- 展示深部位移的数据 -->
                <!-- <div v-if="this.analyseId == 2 && this.Type_Id===15 || this.analyseId == 2 &&this.Type_Id===19" style="display:flex">
              <div>
                <chartdeep
                  class="chart-box"
                  :getParam="chartData"
                  :id="'chart-deep'"
                ></chartdeep>
                 <chartdeepB
                  class="chart-box"
                  :getParam="chartData"
                  :id="'chart-deep2'"
                ></chartdeepB>
              </div>
            </div> -->

                <!-- 倾斜 -->
                <div
                  v-if="this.analyseId == 2 && this.Type_Id === 17"
                  class="speed"
                >
                  <div>
                    <chartqx
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-chart'"
                    ></chartqx>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div>
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
                <!-- 渗压 -->
                <div
                  v-if="this.analyseId == 2 && this.Type_Id === 10"
                  class="speed"
                >
                  <div>
                    <chartsy
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-chartsy'"
                    ></chartsy>
                    <chartspeedsy
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chartsy'"
                    ></chartspeedsy>
                  </div>
                  <div>
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
                        <!-- <div>今日位移：1.51mm</div>
                    <div>本周位移：1.51mm</div>
                    <div>累计位移：1.51mm</div>
                    <div :span="24">今日变形速率：1.51mm</div> -->
                      </div>
                    </el-card>
                  </div>
                </div>

                <div v-if="this.analyseId == 1">
                  <chartlinebar
                    class="chart-box"
                    :getParam="chartData"
                    :id="'chartlinebar'"
                  ></chartlinebar>
                </div>
                <div v-if="this.analyseId == 3" class="speed">
                  <div>
                    <chartbar
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chartbar'"
                    ></chartbar>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div>
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
      <template #footer>
        <div>
          <el-button type="default" size="mini" @click="clear()"
            >取消</el-button
          >
        </div></template
      >
    </vol-box>
  </div>
</template>
<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "../../../views/analyse/analyseuniphase/components/chart-line.vue";
import chartspeed from "../../../views/analyse/analyseuniphase/components/chart-speed.vue";
import chartlinebar from "../../../views/analyse/analyseuniphase/components/chart-linebar.vue";
import chartbar from "../../../views/analyse/analyseuniphase/components/chart-bar.vue";
// 深部位移
import chartdeep from "../../../views/analyse/analyseuniphase/components/chart-deep.vue";
import chartdeepB from "../../../views/analyse/analyseuniphase/components/chart-deepB.vue";
// 倾斜
import chartqx from "../../../views/analyse/analyseuniphase/components/chart-qx.vue";
// 渗压
import chartsy from "../../../views/analyse/analyseuniphase/components/chart-sy.vue";
import chartspeedsy from "../../../views/analyse/analyseuniphase/components/chart-speedsy.vue";

export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    chart: chart,
    chartlinebar: chartlinebar,
    chartbar: chartbar,
    chartspeed: chartspeed,
    chartdeep: chartdeep,
    chartdeepB: chartdeepB,
    chartqx: chartqx,
    chartsy: chartsy,
    chartspeedsy: chartspeedsy,
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
      model: {
        box: false,
      },
      Point_Name: "",
      downStow: true,
      downFold: false,
      foldMsg: "收起",
      activeName: "second",
      shortcuts,
      showAngle: false,
      form: {
        datePicker: {
          // time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          time: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
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
      text: "单相分析",
      monitorTableData: [],
      Type_Id: "", //用于展示点位图表类型
      analyseId: "",
    };
  },
  created() {},
  methods: {
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

    handleClose() {
      this.model.box = false;
    },
    clear() {
      this.model.box = false;
    },

    // 图表传输信息
    ChartInit(e) {
      if (this.showAngle) {
        const getParam = {
          pointNum: e ? e : this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
          showAngle: 0,
        };
        this.chartData = getParam;
      } else {
        const getParam = {
          pointNum: e ? e : this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
        };
        this.chartData = getParam;
      }
    },

    // 导出方法
    report() {
      let url = `/api/Analysis/ExportSingleAnalysisData`;
      const parems = {
        pointNum: this.options_id,
        startTime: this.startTime,
        endTime: this.endTime,
        total: 5000,
        timeType: this.form.radio,
      };
      this.http
        .post(url, parems, true, { responseType: "blob" })
        .then((result) => {
          this.$message.success("导出成功！");
          var eleLink = document.createElement("a");
          let filename = this.options_id + "单相分析.xls";
          eleLink.download = filename;
          eleLink.style.display = "none";
          // 字符转blob
          var blob = new Blob([result]);
          eleLink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          document.body.removeChild(eleLink);
        });
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

    openAnalyse(value) {
      if (value.ID === 276||value.ID === 282 ||value.ID === 283||value.ID === 297) {
        this.$nextTick(() => {
          this.form.radio = "0";
          this.form.datePicker.time=[new Date(new Date().toLocaleDateString()),new Date(),]
        });
        this.form.radio = "0";
        this.form.datePicker.time=[new Date(new Date().toLocaleDateString()),new Date(),]
      }else{
        this.$nextTick(() => {
          this.form.radio = "1";
          this.form.datePicker.time=[new Date(new Date() - 168 * 60 * 60 * 1000), new Date()]
        });
        this.form.radio = "1";
        this.form.datePicker.time=[new Date(new Date() - 168 * 60 * 60 * 1000), new Date()]

      }
      this.model.box = true;
      this.pointPosition(value);
    },

    // 点击查询监测点位
    pointPosition(treeId) {
      this.options_id = treeId.pointNum;
      this.Point_Name = treeId.pointNum;

      var param = {
        order: "desc",
        page: 1,
        rows: 30,
        wheres: `[{\"name\":\"Point_Name,Point_Num,Dev_Id\",\"value\":\"${treeId.pointNum}\",\"displayType\":\"like\"}]`,
      };
      this.http
        .post("api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          this.Type_Id = result.rows[0].Type_Id;
          this.getAnalyseId(this.Type_Id);
          this.getMonitorData(this.options_id);
          this.ChartInit(this.options_id);
        });
    },

    // 选择点位编号的逻辑
    getOptionsId(data) {
      this.options_id = data;
      let run = this.options.filter((item) => {
        return item.Point_Num === this.options_id;
      });
      this.Type_Id = run[0].Type_Id;
      this.getAnalyseId(this.Type_Id);
      this.ChartInit();
    },

    // 匹配接口
    getAnalyseId(e) {
      var param = {
        order: "desc",
        page: 1,
        rows: 30,
        sort: "Type_Order",
      };
      param.wheres = `[]`;
      this.http
        .post("/api/Mon_Type_Manager/getPageData", param, true)
        .then((result) => {
          let data = result.rows.filter((item) => {
            return item.ID === e;
          });
          this.analyseId = data[0].Display_Config;
        });
    },

    getMonitorData(data) {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
    },
  },
};
</script>

<style lang="less" scoped>
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
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
  .living {
    display: flex;
  }
}
::v-deep .headerView {
  display: flex;
  margin-top: 10px;
}

.com-tree {
  display: flex;
  > .left-tree {
    width: 215px;
  }
  > .right-table {
    flex: 1;
  }
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;

  .right-box {
    height: 100%;
    padding: 0px;
    border: 1px solid #f8f8f9;
    .tuxing {
      display: flex;
      // justify-content: space-between;
      .box1 {
        margin-left: 30px;
      }
    }
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
    margin-left: 50px;
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
    display: flex;
    position: relative;
    width: 100%;
    height: calc(100% - 110px) ;
    &>div:nth-child(1){
      width: 100%;
      height: 100%;
    }
  }

  .box-card {
    width: 320px;
    position: absolute;
    right: 10px;
    // z-index: 999;
  }
  .foldMsg {
    cursor: pointer;
    color: #999;
    margin-top: -5px;
  }
}

.wautos{
  width: 100%;
  height: calc(100% - 57px);
}
::v-deep .el-scrollbar__view{
  height: 100% !important;
}
.com-tree{
  height: 100%;
}
#operation-data{
  height: 100%;
}
</style>
