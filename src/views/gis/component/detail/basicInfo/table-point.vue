<template>
  <div id="component-table">
    <div class="title" :style="titleBack">
      <span>监测点</span><span style="display: inline-block; margin: 0 5px; font-size: 16px">{{ total
      }}</span><span>个</span>
    </div>
    <el-table :data="tableData" style="width: 100%; background: none" :row-style="tableRowStyle" :border="false"
      height="248px">
      <el-table-column prop="name" label="监测点名称"> </el-table-column>
      <el-table-column prop="type" label="监测点类型">
        <template #default="scope">
          <span style="margin-left: 10px">{{
              scope.row.type 
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="longitude" label="经度"> </el-table-column>
      <el-table-column prop="latitude" label="纬度"> </el-table-column>
      <el-table-column prop="offOn" label="设备状态">
        <template #default="scope">
          <el-tag :type="scope.row.offOn ? 'success' : 'info'">
            <i :class="
              scope.row.offOn ? 'el-icon-success' : 'el-icon-warning'
            "></i>
            <span style="margin-left: 10px">{{
                scope.row.offOn ? "在线" : "离线"
            }}</span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import {
//   GetMonNodeList,
//   GetPrAllNum,
//   GisMapCameras,
// } from "@/api/page/gis/detail";
import diagonalLine from "@/assets/gis/state/diagonalLine.png";

export default {
  props: ['mgId'],
  watch: {
    mgId() {
      this.pageInit();
    }
  },
  data() {
    return {
      titleBack: {
        background: `url(${diagonalLine}) no-repeat left`,
      },
      tableData: [],
      total: 0
    };
  },
  mounted() {
    this.pageInit();
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      let styleJson = {
        color: "#ffffff",
        background: "none",
      };

      return styleJson;
    },
    pageInit() {
      GetMonNodeList({ page: 1, size: 10000, mgId: this.mgId }).then(res => {
        this.tableData = res.pageList;
        this.total = res.total;
      })
    }
  },
};
</script>

<style lang="scss">
@import "./table.scss"
</style>