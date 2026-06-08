<template>
  <div class="header">
    <VolHeader :text="text" icon="md-podium"> </VolHeader>
  </div>
  <vol-table
    class="table"
    :columns="columns"
    :max-height="630"
    :index="true"
    :tableData="tableData"
    :paginationHide="true"
  ></vol-table>
  <div class="pagination">
    <el-pagination
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
  <MesBox
    class="infobox"
    v-model="model"
    :lazy="true"
    title="查看简报"
    :height="700"
    :width="900"
    :padding="15"
  >
    <div class="block" v-for="(item, index) in this.Process" :key="index">
      <div style="margin-top:20px">
        <span
          style="font-size:14px;font-weight:bold;margin-top:20px;color:black"
          >点位名称：</span
        >
        <span style="color:black">
          {{ item.PointName }}
        </span>
      </div>
      <div>
        <span
          style="font-size:14px;font-weight:bold;margin-bottom:10px;color:black"
          >点位报告：</span
        >
        <span style="color:black">
          {{ item.PointReport }}
        </span>
      </div>
    </div>
  </MesBox>
</template>

<script>
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";

import { h, resolveComponent } from "vue";

export default {
  props: ["groupInfo"],
  watch: {
    groupInfo() {
      this.getData();
    },
  },
  components: {
    VolTable: VolTable,
    VolHeader: VolHeader,
    MesBox: MesBox,
  },
  data() {
    return {
      model: false,
      Process: "",
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
        },
        startTime: "",
        endTime: "",
      },
      currentPage: 1,
      pageSize: 30,
      total: 0,
      tableData: [],
      text: "监测简报信息",
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
          field: "Group_Id",
          title: "简报项目分组",
          type: "int",
          bind: { key: "groupManager", data: [] },
          width: 110,
          require: true,
          align: "left",
          sort: true,
          showOverflowTooltip: true,
        },
        {
          field: "Title",
          title: "简报标题",
          type: "string",
          width: 110,
          require: true,
          align: "left",
          showOverflowTooltip: true,
        },
        {
          field: "Content",
          title: "简报内容",
          type: "string",
          width: 220,
          require: true,
          hidden: true,
          align: "left",
          showOverflowTooltip: true,
        },
        {
          field: "Report_Type",
          title: "简报类型",
          type: "string",
          width: 110,
          align: "left",
        },
        {
          field: "Url",
          title: "资源地址",
          type: "string",
          width: 180,
          hidden: true,
          align: "left",
        },
        {
          field: "Status",
          title: "数据状态",
          type: "int",
          width: 110,
          hidden: true,
          require: true,
          align: "left",
        },
        {
          field: "CreateDate",
          title: "创建日期",
          type: "datetime",
          width: 110,
          align: "left",
          sort: true,
        },
        {
          title: "操作",
          fixed: "right",
          align: "center",
          width: 130,
          render: (h, { row, column, index }) => {
            return h("div", { style: { cursor: "pointer" } }, [
              h(
                resolveComponent("el-button"),
                {
                  style: { padding: "0 7px" },
                  type: "primary",
                  plain: true,
                  size: "mini",
                  onClick: (e) => {
                    e.stopPropagation();
                    this.model = true;
                    let a = row.Content.replace(/[\r|\n|\t]/g, "");
                    this.Process = JSON.parse(a);
                  },
                },
                [h("i", { class: "el-icon-document" }, "简报内容")]
              ),
            ]);
          },
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
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
    getData() {
      this.tableData = [];
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      var param = {
        order: "desc",
        page: this.currentPage,
        rows: this.pageSize,
        sort: "ID",
      };
      param.wheres = ``;
      this.http
        .post("/api/Data_Simple_Report/getPageData", param, true)
        .then((result) => {
          this.tableData = result.rows;
          this.total = result.total;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  padding: 0 20px;
}
.table {
  padding: 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
