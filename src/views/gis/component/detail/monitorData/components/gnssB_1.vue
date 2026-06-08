<template>
  <div id="gnss">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="日期范围">
        <el-date-picker ref="timeBox" v-model="form.datePicker.time" :picker-options="pickerOptions"
          type="datetimerange" range-separator="至" :start-placeholder="'开始时间'" :end-placeholder="'结束时间'"
          :clearable="true" :default-time="form.datePicker.defaultTime">
        </el-date-picker>
        <el-button class="search-button" type="primary" icon="el-icon-data-analysis" @click="ChartByButton">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="createGmt" label="系统时间">
      </el-table-column>
      <el-table-column prop="lng" label="经度">
      </el-table-column>
      <el-table-column prop="lat" label="纬度">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pagination.currentPage" :page-sizes="pagination.pageSizesArr" :page-size="pagination.pageSizes"
      layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
    </el-pagination>
  </div>
</template>
<script>
import moment from 'moment'
import commen from "./common"
// import { DASnavigationData } from "@/api/page/dataMonitor/index"
export default {
  mixins: [commen],
  props: ["currentDevice"],
  watch: {
    currentDevice() {
      this.GetPaginationList();
    }
  },
  components: {
  },
  computed: {
    startTime: function () {
      return this.form.datePicker.time[0]
    },
    endTime: function () {
      return this.form.datePicker.time[1]
    }
  },
  data() {
    return {
      loading: false,
      form: {
        datePicker: {
          time: [
            new Date(new Date().toLocaleDateString()),
            new Date(),
          ],
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)]
        },
      },
      tableData: []
    }
  },
  created() {
    this.GetPaginationList();
  }
  ,
  methods: {
    GetPaginationList() {
      const getParam = {
        deviceId: this.currentDevice.deviceNo,
        mnId: this.currentDevice.mnId,
        dataType: 2,
        startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
        page: this.pagination.currentPage,
        size: this.pagination.pageSizes,
      }
      this.loading = true;
      DASnavigationData(getParam).then(res => {
        console.log(res, 'res');
        this.tableData = res.pageList;
        this.pagination.total = res.total;
        this.pagination.currentPage = res.pages;
        this.loading = false;
      })
    },
    ChartByButton() {
      this.GetPaginationList();
    }
  }
}
</script>
<style lang="scss">
#gnssC_1 {


  .tips {
    display: block;
    margin: 10px 0 0 60px;
    color: red;
    font-size: 12px;
  }

}

.el-date-table td {
  color: #666666;
}
</style>