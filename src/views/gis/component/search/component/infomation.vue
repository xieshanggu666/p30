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
</template>

<script>
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
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
  },
  data() {
    return {
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
      text: "监测预警信息",
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
          field: "Title",
          title: "预警标题",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
          sort: true,
          showOverflowTooltip: true,
        },
        {
          field: "Content",
          title: "预警内容",
          type: "string",
          width: 220,
          readonly: true,
          require: true,
          align: "left",
          showOverflowTooltip: true,
        },
        {
          field: "Group_Id",
          title: "预警分组",
          type: "int",
          bind: { key: "groupManager", data: [] },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Dev_Id",
          title: "预警设备",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Point_Num",
          title: "预警点位",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Type_Id",
          title: "预警类型",
          type: "int",
          bind: { key: "alarmInfoType", data: [] },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Level",
          title: "预警等级",
          type: "int",
          bind: { key: "alarmLevel", data: [] },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Code",
          title: "预警编码",
          type: "string",
          width: 110,
          hidden: true,
          readonly: true,
          require: true,
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
          field: "CreateID",
          title: "创建人id",
          type: "int",
          width: 80,
          hidden: true,
          align: "left",
        },
        {
          field: "Creator",
          title: "创建人",
          type: "string",
          width: 130,
          hidden: true,
          align: "left",
        },
        {
          field: "CreateDate",
          title: "预警时间",
          type: "datetime",
          width: 110,
          readonly: true,
          align: "left",
          sort: true,
        },
        {
          field: "ModifyID",
          title: "修改人id",
          type: "int",
          width: 80,
          hidden: true,
          align: "left",
        },
        {
          field: "Modifier",
          title: "修改人",
          type: "string",
          width: 130,
          hidden: true,
          align: "left",
        },
        {
          field: "ModifyDate",
          title: "修改时间",
          type: "datetime",
          width: 110,
          hidden: true,
          align: "left",
          sort: true,
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
      param.wheres = `[{\"name\":\"Group_Id\",\"value\":\"${this.groupInfo.id}\",\"displayType\":\"select\"},{\"name\":\"CreateDate\",\"value\":\"${this.startTime}\",\"displayType\":\"thanorequal\"},{\"name\":\"CreateDate\",\"value\":\"${this.endTime}\",\"displayType\":\"lessorequal\"}]`;
      this.http
        .post("/api/Ala_Infomation/getPageData", param, true)
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
