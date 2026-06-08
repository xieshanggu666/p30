<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看卫星数据"
      :height="800"
      :width="1500"
      :padding="15"
    >
      <div class="right-table">
        <div class="box">
          <div class="search-info">
            <div>
              <VolHeader :text="text" icon="md-podium"> </VolHeader>
            </div>
            <div class="r-info" style="margin-top: 5px;">
              <div class="headerView">
                <el-form ref="form" label-width="100px">
                  <el-form-item label="当前点位：">
                    <el-input v-model="options_id" :disabled="true"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <!-- div -->
          <div class="rightSide">
            <div class="flex-box">
              <!-- 卫星分布视图 -->
              <div class="left">
                <chartPolarDistribute
                  class="polar"
                  :getParam="choosedDeviceItemInfo"
                  :id="'polar-3'"
                  ref="distribute"
                ></chartPolarDistribute>
              </div>

              <div
                class="right"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <chart-bar
                  ref="bar1"
                  :width="'48%'"
                  :id="'bar-1'"
                  :title="'BDS信噪比'"
                  :getParam="choosedDeviceItemInfoGb"
                ></chart-bar>
                <chart-bar
                  ref="bar2"
                  :width="'48%'"
                  :id="'bar-2'"
                  :title="'GPS信噪比'"
                  :getParam="choosedDeviceItemInfoGp"
                ></chart-bar>
                <chartBar
                  ref="bar4"
                  :width="'48%'"
                  :id="'bar-4'"
                  :title="'GLONASS信噪比'"
                  :getParam="choosedDeviceItemInfoGl"
                ></chartBar>
                <chart-bar
                  ref="bar3"
                  :width="'48%'"
                  :id="'bar-3'"
                  :title="'Galileo信噪比'"
                  :getParam="choosedDeviceItemInfoGa"
                ></chart-bar>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <el-button type="default" size="mini" @click="model.box = false"
            >取消</el-button
          >
        </div></template
      >
    </vol-box>
  </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import chartPolarDistribute from "../../../views/monitor/monitorSatellite/components/chart-distribute.vue";
import chartBar from "../../../views/monitor/monitorSatellite/components/chart-bars.vue";
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    chartPolarDistribute: chartPolarDistribute,
    chartBar: chartBar,
  },
  data() {
    return {
      model: {
        box: false,
      },
      pointTreeId: "",
      options_id: "",
      options: [], //接收监测点位
      value: "",
      text: "卫星数据管理",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      searchFormOptions: [
        [
          {
            dataKey: "groupManager",
            data: [],
            title: "设备选择",
            field: "Group_Id",
            type: "select",
          },
          {
            dataKey: "groupManager",
            data: [],
            title: "设备选择",
            field: "Group_Id",
            type: "select",
          },
        ],
      ],
      monitorTableData: [],
      choosedDeviceItemInfo: [],
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
  methods: {
    openSatellite(treeId) {
      this.model.box = true;
      this.text = "卫星数据管理";
      this.pointPositionLast(treeId);
      this.$refs.distribute.clearChart();
    },

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
          this.getMonitorData(this.options_id);
          this.getSatelliteData(this.options_id);
        });
    },

    getMonitorData(data) {
      let time1 = "2023-02-22 04:02:58";
      let time2 = "2023-02-28 04:02:58";
      let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${data}&startTime=${time1}&endTime=${time2}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.rows;
        this.total = result.total;
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

    // 获取卫星数据
    getSatelliteData(data) {
      let url = `/api/Mon_Point_Manager/GetSatelliteData?pointNum=${data}`;
      this.http.get(url, {}, true).then((result) => {
        this.choosedDeviceItemInfo = result;
        this.choosedDeviceItemInfoGl = result.data.gl;
        this.choosedDeviceItemInfoGp = result.data.gp;
        this.choosedDeviceItemInfoGa = result.data.ga;
        this.choosedDeviceItemInfoGb = result.data.gb;
      });
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

.search-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
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
.box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
//卫星
.rightSide {
  height: 700px;
  padding: 12px 15px;

  .flex-box {
    height: 700px;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    flex-wrap: wrap;
    .left {
      width: 30%;
      display: flex;
      justify-content: center;
    }
    .right {
      width: 70%;
      display: flex;
      justify-content: space-between;
      padding: 12px;
      flex-wrap: wrap;
    }
  }
}
</style>
