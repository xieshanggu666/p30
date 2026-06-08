<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看监测数据"
      class="boxvol"
      :height="800"
      :width="1800"
      :padding="15"
      :before-close="handleClose"
    >
      <div class="right-table">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
          </div>
        </div>
        <div class="r-info" style="margin-top: 5px">
          <div class="headerView">
            <el-form-item label="当前点位：">
              <el-input v-model="options_id" :disabled="true"></el-input>
              <!-- <el-select
                  v-model="options_id"
                  placeholder="请选择点位"
                  @change="Onchange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.Point_Num"
                    :label="item.pointName"
                    :value="item.Point_Num"
                  >
                  </el-option>
                </el-select> -->
            </el-form-item>

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
            <el-button type="primary" @click="click" style="margin-left: 15px"
              >查询</el-button
            >
            <el-button type="success" @click="report" style="margin-left: 15px"
              >导出</el-button
            >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="列表管理" name="second"></el-tab-pane>
              <el-tab-pane label="图表管理" name="first"></el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <!-- 列表 -->
        <div v-if="view == 1">
          <vol-table
            :style="contentStyleObj"
            ref="table"
            :columns="columns"
            :max-height="620"
            :index="true"
            :tableData="monitorTableData"
            :paginationHide="true"
            :single="true"
          ></vol-table>
          <div class="pagination">
            <el-pagination
              style="margin-top: 3px"
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

        <div v-if="view == 2">
          <div id="operation-data" class="dark">
            <div class="right-box">
              <chart
                class="chart-box"
                :getParam="chartData"
                :height="600"
                :id="'point-gnssC-3'"
              ></chart>
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
import { resolveComponent } from "vue";
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import shortcuts from "@/uitils/shortcuts";
import chart from "../../../views/monitor/monitorRecord/components/chart-line.vue";

export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    chart: chart,
  },
  computed: {
    startTime: function () {
      return this.form.datePicker.time[0];
    },
    endTime: function () {
      return this.form.datePicker.time[1];
    },
  },
  data() {
    return {
      text: "",
      type: "",
      info: "",
      pointTreeId: "",
      activeName: "second",
      shortcuts,
      startTime: "",
      endTime: "",
      options_id: "",
      model: {
        box: false,
      },
      view: 1,

      contentStyleObj: {
        padding: "0 15px",
      },
      activeName: "second",
      shortcuts,
      nodeName: "",
      options_id: "",
      options: [], //接收监测点位
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
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
        radio: 0,
        radio_display: 1,
        checkAll: false,
        check_list: ["三维合位移差值"],
      },
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
          field: "DataType",
          title: "数据类型",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Status",
          title: "状态",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
          bind: {
            //如果后面返回的数据为数据源的数据，请配置此bind属性，可以从后台字典数据源加载，也只以直接写上
            key: "audit",
            data: [
              { key: "0", value: "异常" },
              { key: "1", value: "正常" },
            ],
          },
        },
        {
          field: "ID",
          title: "编号",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "DataTime",
          title: "数据时间",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          title: "操作",
          field: "操作",
          width: 80,
          align: "center",
            render: (h, { row, column, index }) => {
            const ElButton = resolveComponent("el-button");
            let type = "";
            let typeVal = "";
            if (row.Status == 1) {
              type = "danger";
              typeVal = "设为异常";
            } else {
              type = "success";
              typeVal = "设为正常";
            }
            return h("div", [
              h(
                ElButton,
                {
                  type: type,
                  plain: true,
                  size: "small",
                  style: {
                    padding: "10px !important",
                  },
                  onClick: ($e) => {
                    this.IsAbnormal(row, $e, typeVal);
                  },
                },
                typeVal
              ),
            ]);
          },
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
  created() {},
  methods: {
    handleClose() {
      this.model.box = false;
      this.monitorTableData = [];
    },
    close() {
      this.model.box = false;
      this.monitorTableData = [];
    },
    clear() {
      this.model.box = false;
    },
    openRecord(treeId) {
      this.model.box = true;
      this.columns.splice(0, this.columns.length - 3);
      this.pointPositionLast(treeId);

      //   this.info=e
      //   this.getGnssInfo(type,e);
    },

    pointPositionLast(treeId) {
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      param.wheres = `[{\'name\':\ 'Group_Id', \'value\':\' ${treeId.groupID}\'}]`;
      this.http
        .post("/api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          this.options_id = treeId.pointNum;
          this.getMonitorData(this.options_id);
          this.getDispose(this.options_id);
          this.ChartInit(this.options_id);
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
    getMonitorData(data) {
      // this.pageSize=30,
      // this.total=0
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${data}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.rows;
        this.total = result.total;
      });
    },

    getDispose(data) {
      let url = `/api/Mon_Point_Manager/GetMonitorDataConfig?pointNum=${data}`;
      this.http.get(url, {}, true).then((result) => {
        this.tableData = JSON.parse(result.data).reverse();
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
      });
    },
    ChartInit(e) {
      const getParam = {
        pointNum: e ? e : this.options_id,
        timeType: this.form.radio,
        total: 5000,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      this.chartData = getParam;
    },

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

    ChangeOne(e) {
      this.view = e;
      if (this.view == 2) {
        this.ChartInit();
      } else {
        this.getMonitorData(this.options_id);
      }
    },

    // 监测数据设为异常
    IsAbnormal(row, $e, type) {
      if (type == "设为异常") {
        let url = `/api/Mon_Point_Manager/SetExceptionData?id=${row.ID}`;
        this.http.post(url, {}, true).then((result) => {
          this.$message.success("设置数据状态成功，当前状态为【异常】");
          this.getMonitorData(this.options_id);
        });
      } else {
        let url = `/api/Mon_Point_Manager/SetNormalData?id=${row.ID}`;
        this.http.post(url, {}, true).then((result) => {
          this.$message.success("设置数据状态成功，当前状态为【正常】");
          this.getMonitorData(this.options_id);
        });
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

    // 导出数据
    report() {
      let url = `/api/Mon_Point_Manager/ExportMonitorData?pointNum=${this.options_id}&startTime=${this.startTime}&endTime=${this.endTime}`;
      this.http.post(url, {}, true, { responseType: "blob" }).then((result) => {
        this.$message.success("导出成功！");
        // 下载文件方法
        var eleLink = document.createElement("a");
        let filename = "监测数据.xls";
        eleLink.download = filename;
        eleLink.style.display = "none";
        // 字符内容转变成blob地址
        var blob = new Blob([result]);
        eleLink.href = URL.createObjectURL(blob);
        // 自动触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getMonitorData(this.options_id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMonitorData(this.options_id);
    },
  },
};
</script>
<style lang="less">
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
</style>

<style lang="less" scoped>
.boxvol {
  position: relative;
  z-index: 9999999;
}
::v-deep .v-table .el-table__header th {
  /* padding: 0px !important; */
  background-color: rgba(39, 115, 207, 0.5) !important;
  font-size: 13px;
  height: 46px;
  color: black;
}
::v-deep .el-table td.el-table__cell {
  // background-color: rgba(39, 115, 207, 0.3) !important;
  color: #3f3d3d;
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

::v-deep .headerView {
  display: flex;
  margin-top: 10px;
  margin-left: 15px;
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
.pagination {
  // display: flex;
  // justify-content: flex-end;
  // z-index: 99999999;
  margin: 3rem auto;
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;

  .right-box {
    height: 800px;
    padding: 24px;
    border: 1px solid #f8f8f9;
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
</style>
<style lang="less">
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
</style>

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
.pagination {
  display: flex;
  justify-content: flex-end;
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;

  .right-box {
    height: 800px;
    padding: 24px;
    border: 1px solid #f8f8f9;
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
</style>
