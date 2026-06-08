<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看音频记录"
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
                <el-input v-model="Point_Num" :disabled="true"></el-input>
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
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div>
          <vol-table
            :style="contentStyleObj"
            ref="table"
            :columns="columns"
            :max-height="620"
            :index="true"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#fff"
            :tableData="tableData"
            :paginationHide="true"
            :single="true"
          ></vol-table>
          <div class="pagination">
            <el-pagination
              v-if="!loading"
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
      </div>
    </vol-box>
  </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import shortcuts from "@/uitils/shortcuts";
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
  },
  computed: {},
  data() {
    return {
      loading: false,
      model: {
        box: false,
      },
      contentStyleObj: {
        padding: "0 15px",
      },
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
      },
      Point_Num: "",
      startTime: "",
      endTime: "",
      text: "录音历史记录",
      pageIndex: 1,
      pageSize: 30,
      total: 0,
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
          field: "Point_Num",
          title: "点位名称",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
          sort: true,
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
          field: "FilePath",
          title: "音频文件",
          type: "string",
          width: 220,
          readonly: true,
          require: true,
          align: "left",
          showOverflowTooltip: true,
        },
        {
          field: "dataTime",
          title: "最新获取时间",
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
    window.getFile = this.getFile;
  },
  methods: {
    handleClose() {
      this.model.box = false;
      this.tableData = [];
    },
    clear() {
      this.model.box = false;
      this.tableData = [];
    },
    click() {
      this.getFrequencyInfo();
    },
    openFrequency(treeId) {
      this.model.box = true;
      this.Point_Num = treeId.Point_Num;
      this.loading = true;
      this.getFrequencyInfo();

      this.columns.forEach((x) => {
        if (x.field == "FilePath") {
          x.width = 110;
          x.formatter = (row, column, event) => {
            if (row.FilePath) {
              const fileServerIp = process.env.VUE_APP_FILE_SERVER_IP;
              const fileServerPort = process.env.VUE_APP_FILE_SERVER_PORT;
              const filePath = row.FilePath;
              const fileUrl = `http://${fileServerIp}:${fileServerPort}/${filePath}`;
              return `<a  style="color:blue;font-size: 14px;cursor: pointer;" onClick="getFile('${fileUrl}')">点击播放</a>`;
            }
          };
        }
      });
    },

    getFrequencyInfo() {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      let url = `/api/Mon_Point_Manager/GetHistoryRecordData?pointNum=${this.Point_Num}&startTime=${this.startTime}&endTime=${this.endTime}&pageSize=${this.pageSize}&pageIndex=${this.pageIndex}`;
      this.http.get(url, {}, true).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },

    getFile(file) {
      window.open(file, '_blank', 'width=800, height=600');
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getFrequencyInfo();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getFrequencyInfo();
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
