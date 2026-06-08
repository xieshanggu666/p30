<template>
  <div class="weiyis">
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看运行数据"
      :height="800"
      :width="1500"
      :padding="15"
      :before-close="handleClose"
    >
      <div class="right-table">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
          </div>
          <div class="r-info" style="margin-top: 5px;">
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
              <el-button type="primary" @click="click" style="margin-left:15px"
                >查询</el-button
              >

              <el-tabs
                v-model="activeName"
                type="card"
                @tab-click="handleClick"
              >
                <el-tab-pane label="列表管理" name="second"></el-tab-pane>
                <el-tab-pane label="图表管理" name="first"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="intab" v-if="view == 1">
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
              style="margin-top:3px"
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
        <div class="tuEcharts" v-if="view == 2">
          <div id="operation-data" class="dark">
            <div class="right-box">
              <div>图表</div>
              <chart
                class="chart-box"
                :getParam="chartData"
                :height="600"
                :id="'point-chart'"
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
        </div></template>
    </vol-box>
  </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import shortcuts from "@/uitils/shortcuts";
import chart from "../../../views/monitor/monitorOperation/components/chart-line.vue";
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
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
      model: {
        box: false,
      },
      pointTreeId: "",
      contentStyleObj: {
        // height: "640px",
        // overflow: "auto",
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
        radio: 0,
        radio_display: 1,
        checkAll: false,
        check_list: ["三维合位移差值"],
      },
      startTime: "",
      endTime: "",
      showData: {
        displayMode: [
          { label: "图表统计", value: "1" },
          { label: "列表统计", value: "2" },
        ],
        radioGroup: [
          { key: 0, name: "时" },
          { key: 1, name: "天" },
          { key: 2, name: "月" },
        ],
      },
      isIndeterminate: true,
      chartData: {},
      view: 1,
      nodeName: "",
      options_id: "",
      options: [], //接收监测点位
      value: "",
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
  created() {},
  methods: {
    handleClose(){
      this.model.box=false;
      this.monitorTableData=[];
    },
    clear(){
      this.model.box=false;
      this.monitorTableData=[];
    },
    openOperation(treeId) {
      this.model.box = true;
      this.columns.splice(0, this.columns.length - 1);
      this.pointPositionLast(treeId);
       this.activeName='first'
      this.ChangeOne(2)
    },

    // 默认查询监测点位
    pointPositionLast(treeId) {
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      param.wheres = `[{\'name\':\ 'Group_Id', \'value\':\' ${treeId.Group_Id}\'}]`;
      this.http
        .post("/api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          this.options_id = treeId.Point_Num;
          this.getDispose(this.options_id);
          this.getMonitorData(this.options_id);
          this.ChartInit(this.options_id)
        });
    },

    // 获取监测点的监测类型配置信息
    getDispose(data) {
      let url = `/api/Mon_Point_Manager/GetRunDataConfig?pointNum=${data}`;
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

    // 获取监测数据
    getMonitorData(data) {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      let url = `/api/Mon_Point_Manager/GetRunData?pointNum=${data}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.rows;
        this.total = result.total;
      });
    },

    // 选择点位编号的逻辑
    // Onchange(data) {
    //   this.columns.splice(0, this.columns.length - 1);
    //   this.options_id = data;
    //   if (this.view == 1) {
    //     this.getDispose(data);
    //     this.getMonitorData(data);
    //   } else {
    //     this.ChartInit(data);
    //   }
    // },

    // 给图表传输的信息
    ChartInit(e) {
      const getParam = {
        pointNum: e ? e : this.options_id,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      this.chartData = getParam;
    },

    // 查询图表方法
    click() {
      if (this.view == 1) {
        this.getMonitorData(this.options_id);
      } else {
        this.getDispose(this.options_id);
        // this.getMonitorData(this.options_id);
        this.ChartInit(this.options_id);
        this.columns.splice(0, this.columns.length - 3);
      }
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

    ChangeOne(e) {
      this.view = e;
      if (this.view == 2) {
        this.ChartInit();
      } else {
        this.getMonitorData(this.options_id);
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
.weiyis{
  ::v-deep .dia-content .dia-footer{
    padding: 0 24px 19px 0;
  }
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
.right-table{
  height: 100%;
  .search-info{
    height: 66px;
  }
  .intab{
    height: calc(100% - 106px);
  }
  .tuEcharts{
    height: calc(100% - 66px);
    ::v-deep #operation-data .right-box{
      height: 100% ;
      padding: 0 24px;
    }
  }
  ::v-deep .v-table{
    height: 100% !important;
  }
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
