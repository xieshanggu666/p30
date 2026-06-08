<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title=""
      :height="700"
      :width="1320"
      :padding="15"
      :before-close="handleClose"
      class="volbox"
    >
      <div class="hestop">
        <div class="yuxx" >预警信息</div>
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
      text: "",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
      columns: [
                {field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'Title',title:'预警标题',type:'string',width:110,readonly:true,require:true,align:'left',sort:true,showOverflowTooltip:true},
                {field:'Content',title:'预警内容',type:'string',width:220,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                {field:'Group_Id',title:'预警分组',type:'int',bind:{ key:'groupManager',data:[]},width:230,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                {field:'Dev_Id',title:'预警设备',type:'string',width:110,readonly:true,require:true,align:'left'},
                {field:'Point_Num',title:'预警点位',type:'string',width:110,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                {field:'Type_Id',title:'预警类型',type:'int',bind:{ key:'alarmInfoType',data:[]},width:110,readonly:true,require:true,align:'left'},
                {field:'Level',title:'预警等级',type:'int',bind:{ key:'alarmLevel',data:[]},width:110,readonly:true,require:true,align:'left'},
                {field:'Code',title:'预警编码',type:'string',width:110,hidden:true,readonly:true,require:true,align:'left'},
                {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                {field:'Creator',title:'创建人',type:'string',width:130,hidden:true,align:'left'},
                {field:'CreateDate',title:'预警时间',type:'datetime',width:110,readonly:true,align:'left',sort:true,showOverflowTooltip:true},
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
                       {field:'Deal_Time',title:'处理时间',type:'datetime',sort:true,width:120,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Deal_Person',title:'处理人',type:'string',width:80,align:'left',showOverflowTooltip:true},
                       {field:'Deal_Comment',title:'处理备注',type:'string',align:'left',showOverflowTooltip:true},
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
    openWarning(sTime,eTime) {
      this.model.box = true;
      this.getWarningInfo(sTime,eTime);
      this.sTime=sTime
      this.eTime=eTime
    },

    getWarningInfo(sTime,eTime) {
      var param = {
        order: "desc",
        page: this.currentPage,
        rows: this.pageSize,
        sort: "ID",
      };
      // param.wheres = `[{\'name\':\ 'CreateDate', \'value\':\' ${treeId}\'}]`;
     param.wheres =`[{"name":"CreateDate","value":"${sTime}","displayType":"thanorequal"},{"name":"CreateDate","value":"${eTime}","displayType":"lessorequal"}]`
      this.http
        .post("/api/Ala_Infomation/getPageData", param, true)
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
</style>
