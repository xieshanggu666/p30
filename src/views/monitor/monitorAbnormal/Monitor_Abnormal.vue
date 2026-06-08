<template>
  <div class="heibaie">
    <div class="search-info">
      <div>
        <VolHeader :text="text" icon="md-podium"> </VolHeader>
      </div>
      <div>
        <el-tabs
         v-model="activeName" @tab-click="handleClick" type="card"
        >
          <el-tab-pane label="日变化" name="first"></el-tab-pane>
          <el-tab-pane label="周变化" name="second"></el-tab-pane>
          <el-tab-pane label="月变化" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="tableData">
      <vol-table
        :style="contentStyleObj"
        ref="table"
        :columns="columns"
        :max-height="620"
        :index="true"
        :tableData="monitorTableData"
        :paginationHide="true"
        :single="true"
        :titleField="titleField"
      ></vol-table>
    </div>
  </div>
</template>

<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";

export default {
  components: {
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
  },
  data() {
    return {
      text: "异常排行榜",
      monitorTableData: [],
      activeName: "first",
      contentStyleObj: {
        padding: "0 15px",
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
          field: "pointName",
          title: "点位名称",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "dayChangeValue",
          title: "日变化值",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
         {
          field: "weekChangeValue",
          title: "周变化值",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
         {
          field: "monthChangeValue",
          title: "月变化值",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "groupName",
          title: "分组名称",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "pointNum",
          title: "点位编号",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "projectName",
          title: "项目名称",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "typeName",
          title: "监测类型",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
      ],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log("tab",tab.props.name);
      console.log("event",event);
      let top = 10;
      if (tab.props.name==='first') {
        let url = `/api/Mon_DevOps_Manager/GetDeformationRankingStatistic?top=${top}`;
        this.http.get(url, {}, true).then((result) => {
          this.monitorTableData = result.data.dayTop;
          this.columns[2].hidden=false,
          this.columns[3].hidden=true,
          this.columns[4].hidden=true,
          this.total = result.total;
        });
      } else if (tab.props.name==='second') {
        let url = `/api/Mon_DevOps_Manager/GetDeformationRankingStatistic?top=${top}`;
        this.http.get(url, {}, true).then((result) => {
          this.monitorTableData = result.data.weekTop;
          this.columns[2].hidden=true,
          this.columns[3].hidden=false,
          this.columns[4].hidden=true,
          this.total = result.total;
        });
      } else {
        let url = `/api/Mon_DevOps_Manager/GetDeformationRankingStatistic?top=${top}`;
        this.http.get(url, {}, true).then((result) => {
          this.monitorTableData = result.data.monthTop;
           this.columns[2].hidden=true,
          this.columns[3].hidden=true,
          this.columns[4].hidden=false,
          this.total = result.total;
        });
      }
    },

    getMonitorData() {
      let top = 10;
      let url = `/api/Mon_DevOps_Manager/GetDeformationRankingStatistic?top=${top}`;
      this.http.get(url, {}, true).then((result) => {
        this.monitorTableData = result.data.dayTop;
       this.columns[2].hidden=false,
        this.columns[3].hidden=true,
        this.columns[4].hidden=true,
        this.total = result.total;
      });
    },
  },

  created() {
    this.getMonitorData();
  },
};
</script>

<style lang="less" scoped>
.heibaie{
  height: 100% !important;
  background: #fff;
}
::v-deep .v-left-text span{
    font-size: 14px;
}
.search-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 62px;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  .living {
    display: flex;
  }
}
.tableData{
  width: 100%;
  height: calc(100% - 62px);
  padding:24px 9px 0px;
}
</style>
