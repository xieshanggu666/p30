<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      :title="this.text"
      :height="700"
      :width="1320"
      :padding="15"
      :before-close="handleClose"
    >
    <div class="hestop">
        <div class="yuxx" >{{this.text}}</div>
        <img @click="handleClose" src="@/assets/home/mfans.png"/>
      </div>
      <div class="tabBody">
          <vol-table
            :style="contentStyleObj"
            ref="table"
            :columns="columns"
            class="nimeitab"
            :index="false"
            :tableData="monitorTableData"
            :paginationHide="true"
            :single="true"
          ></vol-table>
      </div>
      <div class="pageFy">
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
      <!-- <div class="right-table" v-if="1==2">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
          </div>
        </div>
        <div>
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
      </div> -->
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
      text:'',
      type:'',
      info:'',
      model: {
        box: false,
      },
      contentStyleObj: {
        padding: "0 15px",
      },
      activeName: "second",
      shortcuts,

      options_id: "",
      text: "预警信息管理",
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
          field: "type_Icon",
          title: "类型",
          type: "img",
          width: 80,
          align: "left",
        },
        {
          field: "point_Num",
          title: "点位编号",
          type: "string",
          width: 110,
          require: true,
          align: "left",
        },
        {
          field: "point_Name",
          title: "点位名称",
          type: "string",
          width: 110,
          require: true,
          align: "left",
          sort: true,
        },
         {
        field: "dev_Id",
        title: "设备编号",
        type: "int",
        //bind: { key: "groupManager", data: [] },
        width: 110,
        require: true,
        align: "left",
      },
      {
        field: "state_Run",
        title: "运行状态",
        type: "string",
        width: 110,
        align: "left",
        bind: {
             //如果后面返回的数据为数据源的数据，请配置此bind属性，可以从后台字典数据源加载，也只以直接写上
             key: "State_Run",
             data: [
               { key: "离线", value: "离线" }          
             ]
           },
        showOverflowTooltip:true
      },
       {
        field: "recent_T",
        title: "最新通信时间",
        type: "string",
        width: 110,
        align: "left",
        sort: true,
      },
      {
        field: "isInitial",
        title: "初始化",
        type: "int",
        bind: {
          key: "audit",
          data: [
          { key: -1, value: "无" },
            { key: 0, value: "否" },
            { key: 1, value: "是" },
          ],
        },
        width: 80,
        align: "left",
        sort: true,
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
    },
    clear() {
      this.model.box = false;
    },
    openGnssDevice(type,e) {
      this.model.box = true;
      this.info=e
      this.getGnssInfo(type,e);
    },

    getGnssInfo(type,e) {
      this.type=type
      if(e==true){
        this.text="设备在线情况"
      }else{
        this.text="设备离线情况"
      }
      if(type==='gnss'){
        let url = `/api/BigScreen/GetOnlineDevices?isGnss=${e}`;
          this.http.get(url, {}, true).then((result) => {
            this.monitorTableData = result.data;
            this.total = result.total;
          });
      }else{
        let url = `/api/BigScreen/GetOfflineDevices?isGnss=${e}`;
        this.http.get(url, {}, true).then((result) => {
          this.monitorTableData = result.data;
          this.total = result.total;
        });
      }
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getGnssInfo(this.type,this.info)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGnssInfo(this.type,this.info)
     
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
.hestop{
  padding:  28px 24px 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &>img{
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .yuxx{
    width: 311px;
    height: 47px;
    padding-left: 26px;
    line-height: 47px;
    background: url(../../../assets/home/buitsx.png) no-repeat;
    background-size: 100% 100%;
    font-size: 16px;
    font-weight: bold;
    color: #53E1FA;
  }
}
.tabBody{
  width: 100%;
  height: calc(100% - 169px);
  padding: 0 25px;
}
.pageFy{
  width: 100%;
  height: 80px;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: right;
  ::v-deep .el-pagination__total{
    font-weight: 500;
    font-size: 14px;
    color: #37E1FF !important;
  }
  ::v-deep .el-input__wrapper{
    background-color: transparent !important;
    box-shadow:none !important;
    border: 1px solid #37E1FF;
    .el-input__inner{
      color: #37E1FF !important;
    }
  }
  ::v-deep .el-pagination__jump{
    color: #37E1FF !important;
  }
  ::v-deep .el-pager li{
    background: none !important;
    font-weight: 500;
    font-size: 14px;
    margin-right: 6px;
    color: #37E1FF;
    border: 1px solid #37E1FF;
  }
  ::v-deep .el-pager li.is-active{
    background: rgba(118, 228, 255, .5) !important;
  }
  ::v-deep .el-pagination .btn-next{
      background-color: transparent !important;
      color: #76E4FF !important;
      border: 1px solid #37E1FF;
  }
  ::v-deep .el-pagination .btn-prev{
     background-color: transparent !important;
      color: #76E4FF !important;
      border: 1px solid #37E1FF;
      margin-right: 6px;
  }
}
::v-deep .el-dialog{
  width: 1322px !important;
  height: 702px !important;
  background: url(../../../assets/home/dolhsa.png) no-repeat;
  background-size: 100% 100%;
}
::v-deep .dia-footer{
  display: none !important;
}
::v-deep .el-dialog__body{
  height: calc(100% - 50px) !important;
}
::v-deep .dia-content{
  height: 100% !important;
}
::v-deep .search-info{
  display: none !important;
}
::v-deep .el-dialog__header{
  display: none !important;
}
::v-deep .srcoll-content{
  padding: 0 !important;
  height: 100% !important;
}
::v-deep .el-scrollbar__view{
  height: 100% !important;
}
::v-deep .el-dialog__body{
  height: 100% !important;
}
::v-deep .vol-table{
  padding: 0 !important;
  .el-table{
    height: 100% !important;
  }
}

::v-deep .nimeitab{
  .el-table{
    background: none !important;
    --el-table-border-color:none !important;

  }
  .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
    background: none !important;
    color:  #fff !important;
  }
  .el-table .cell{
    line-height: normal !important;
  }
  .v-table .el-table__header th{
    background: rgba(11, 27, 56, .5) !important;
  }
  .el-table__header-wrapper{
    height: 36px !important;
    background: transparent !important;
    th{
      height: 36px !important;
      font-size: 14px !important;
      color: #53E1FA !important;
      background: transparent !important;
    }
    tr{
      height: 36px !important;
      font-size: 14px;
      color: #78BFFF;
      background: rgba(11, 27, 56, .5) !important;
    }
  }
  .el-table__row{
      height: 36px !important;
      font-size: 14px;
      color: #78BFFF !important;
      background: rgba(188, 212, 255, .1) !important;
  }
  tr:nth-child(2n){
    background: rgba(11, 27, 56, .5) !important;
  }
  tr:nth-child(2n+1){
    background: rgba(188, 212, 255, .1);
  }

  .el-table td.el-table__cell{
    color: #fff !important;
  }
  .el-table__row td{
    border-bottom: none;
    height: 76px;
  }
  .el-table tbody tr:hover>td {
    background-color:transparent !important;
  }
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
