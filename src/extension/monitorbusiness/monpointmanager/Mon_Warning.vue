<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看预警信息"
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
                <el-input v-model="options_id" :disabled="true"></el-input>
              </el-form-item>
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
      text: "预警信息管理",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
      columns: [
                {field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'Title',title:'预警标题',type:'string',width:110,readonly:true,require:true,align:'left',sort:true,showOverflowTooltip:true},
                {field:'Content',title:'预警内容',type:'string',width:220,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                {field:'Group_Id',title:'预警分组',type:'int',bind:{ key:'groupManager',data:[]},width:110,readonly:true,require:true,align:'left'},
                {field:'Dev_Id',title:'预警设备',type:'string',width:110,readonly:true,require:true,align:'left'},
                {field:'Point_Num',title:'预警点位',type:'string',width:110,readonly:true,require:true,align:'left'},
                {field:'Type_Id',title:'预警类型',type:'int',bind:{ key:'alarmInfoType',data:[]},width:110,readonly:true,require:true,align:'left'},
                {field:'Level',title:'预警等级',type:'int',bind:{ key:'alarmLevel',data:[]},width:110,readonly:true,require:true,align:'left'},
                {field:'Code',title:'预警编码',type:'string',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                {field:'Creator',title:'创建人',type:'string',width:130,hidden:true,align:'left'},
                {field:'CreateDate',title:'预警时间',type:'datetime',width:110,readonly:true,align:'left',sort:true},
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
                            width: 100,
                            align: "left",
                            sort: true,
                        },
                       {field:'Deal_Time',title:'处理时间',type:'datetime',sort:true,width:100,align:'left',sort:true},
                       {field:'Deal_Person',title:'处理人',type:'string',width:80,align:'left'},
                       {field:'Deal_Comment',title:'处理备注',type:'string',width:220,align:'left',showOverflowTooltip:true},
                {field:'ModifyID',title:'修改人id',type:'int',width:80,hidden:true,align:'left'},
                {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,align:'left',sort:true},
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
    openWarning(treeId) {
      this.model.box = true;
      this.options_id = treeId.Point_Num;
      this.getWarningInfo(this.options_id);
    },

    getWarningInfo(treeId) {
      var param = {
        order: "desc",
        page: 1,
        rows: 30,
        sort: "ID",
      };
      param.wheres = `[{\'name\':\ 'Point_Num', \'value\':\' ${treeId}\'}]`;
      this.http
        .post("/api/Ala_Infomation/getPageData", param, true)
        .then((result) => {
          this.monitorTableData = result.rows;
           this.total = result.total;
        });
    },
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getWarningInfo(this.options_id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getWarningInfo(this.options_id);
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
