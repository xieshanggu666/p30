<template>
  <div class="com-tree">
    <div class="left-tree">
      <MonitorSatelliteTree
        :onChange="onChange"
        :pointTreeId="pointTreeId"
      ></MonitorSatelliteTree>
    </div>
    <div class="right-table">
      <div class="box">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
          </div>
          <div class="r-info" style="margin-top: 5px;">
            <div class="headerView"></div>
          </div>
        </div>
        <!-- div -->
        <div class="rightSide">
          <div class="flex-box">
            <!-- <chartPolarDistribute class="polar" :getParam="choosedDeviceItemInfo" :id="'polar-1'"></chartPolarDistribute>
          <chartPolarDistribute class="polar" :getParam="choosedDeviceItemInfo" :id="'polar-2'"></chartPolarDistribute> -->
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
  </div>
</template>

<script>
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import MonitorSatelliteTree from "../monitorRecord/monitor/MonitorRecordFilterTree.vue";
import chartPolarDistribute from "./components/chart-distribute.vue";
import chartBar from "./components/chart-bars.vue";
export default {
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    MonitorSatelliteTree: MonitorSatelliteTree,
    chartPolarDistribute: chartPolarDistribute,
    chartBar: chartBar,
  },
  data() {
    return {
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
  created() {
    this.pointTreeId = this.$store.getters.getTreeValue();
  },
  methods: {
    onChange(treeId, type) {
      this.$nextTick(() => {
        //调用table刷新方法
        // console.log("treeId", treeId);
        this.text = treeId.nodeName + "—卫星数据管理";
        this.columns.splice(0, this.columns.length - 3);
        if (type == 1) {
          this.pointPositionLast(treeId);
        } else {
          this.pointPosition(treeId);
        }
        this.$refs.distribute.clearChart();
      });
    },
    // 默认查询监测点位
    pointPositionLast(treeId) {
      this.options_id = treeId.nodeValue;
      this.getDispose(this.options_id);
      this.getSatelliteData(this.options_id);
    },
    // 点击查询监测点位
    pointPosition(treeId) {
      this.options_id = treeId.nodeValue;
      this.getDispose(this.options_id);
      this.getSatelliteData(this.options_id);
    },

    // 获取监测点的监测类型配置信息
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
      this.getMonitorData(data);
    },

    // 获取监测数据
    getMonitorData(data) {
      let time1 = "2023-02-22 04:02:58";
      let time2 = "2023-02-28 04:02:58";
      let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${data}&startTime=${time1}&endTime=${time2}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.rows;
        this.total = result.total;
      });
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

<style lang="less" scoped>
::v-deep .v-header {
  background: white;
  height: 57px;
  // padding: 10px 0 10px 5px;
  // margin: 0px 0px !important;
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
  align-items: center;
  width: 100%;
  padding: 0 24px;
  height: 62px;
  border-bottom: 1px solid #f5f5f5;
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
.rightSide::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: #ddd !important;
}
.rightSide::-webkit-scrollbar {
    background: #f5f5f5 !important;
    width: 8px !important;
    height: 5px;
}
.rightSide::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #ddd !important;
    border-radius: 5px !important;
    background: transparent !important;
}
.rightSide {
  height:calc(100% - 62px);
  padding: 24px 24px 0;
  overflow: hidden;
  overflow-y: scroll;
  .flex-box {
    height: 100%;
    display: flex;
    justify-content: space-between;
    // padding: 12px;
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
