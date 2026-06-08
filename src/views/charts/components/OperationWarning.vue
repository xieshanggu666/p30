<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="运行预警信息"
      :height="800"
      :width="1800"
      :padding="15"
      :before-close="handleClose"
      class="volbox"
    >
      <div class="right-table">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
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
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
  },
  computed: {

  },
  data() {
    return {
      model: {
        box: false,
      },
      contentStyleObj: {
        padding: "0 15px",
      },
      activeName: "second",
      shortcuts,

      options_id: "",
      text: "运行预警历史信息",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
      columns: [
                {field:'Level',title:'预警级别',type:'int',width:80,align:'left',sort:true,bind: {
                            key: "alarmLevel",
                            data: [
                                { key: 0, value: "蓝色预警" },
                                { key: 1, value: "黄色预警" },
                                { key: 2, value: "橙色预警" },
                                { key: 3, value: "红色预警" },
                            ],
                            },},
                 {field:'CreateDate',title:'预警时间',type:'datetime',sort:true,width:120,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'标题',type:'string',width:180,align:'left',showOverflowTooltip:true},
                       {field:'Content',title:'内容',type:'string',width:220,align:'left',showOverflowTooltip:true},
                       {field:'Dev_Id',title:'设备ID',type:'string',width:110,align:'left'},
                       {
                            field: "Deal_State",
                            title: "处理状态",
                            type: "int",
                            bind: {
                            key: "audit",
                            data: [
                                { key: -1, value: "忽略" },
                                { key: 0, value: "未处理" },
                                { key: 1, value: "已处理" },
                            ],
                            },
                            width: 80,
                            align: "left",
                            sort: true,
                        },
                       {field:'Deal_Time',title:'处理时间',type:'datetime',sort:true,width:100,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Deal_Person',title:'处理人',type:'string',width:80,align:'left'},
                       {field:'Deal_Comment',title:'处理备注',type:'string',width:220,align:'left',showOverflowTooltip:true},
                       {field:'Groud_Id',title:'分组ID',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Status',title:'状态',type:'int',width:110,align:'left',hidden:true},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,align:'left',sort:true},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
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
    openAnalyse(sTime,eTime) {
      this.model.box = true;
      this.getWarningInfo(sTime,eTime);
      this.sTime=sTime
      this.eTime=eTime
    },

    getWarningInfo(item) {
      console.log("item",item);
      var param = {
        order: "desc",
        page: this.currentPage,
        rows: this.pageSize,
        sort: "ID",
      };
     param.wheres =`[{"name":"Dev_Id","value":"${item.devID}"}]`
      this.http
        .post("/api/Ala_Operationinfo/getPageData", param, true)
        .then((result) => {
          console.log("result",result);
          this.monitorTableData = result.rows;
           this.total = result.total;
        });
    },
     handleSizeChange(val) {
      this.pageSize = val;
      this.getWarningInfo(this.sTime,this.eTime);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getWarningInfo(this.sTime,this.eTime);
    },
    },

   

};
</script>
<style lang="less">
.volbox{
  z-index: 99999999;
}
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
</style>

<style lang="less" scoped>
::v-deep .v-table .el-table__header th{
  /* padding: 0px !important; */
  background-color:rgba(39, 115, 207, 0.5) !important;
  font-size: 13px;
  height: 46px;
  color:black;
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
