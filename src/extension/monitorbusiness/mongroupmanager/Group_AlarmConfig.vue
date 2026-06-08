<template>
  <div>
    <MesBox :before-close="addClose" v-if="addVisible" v-model="model" :lazy="true" title="监测分组预警配置" :height="700"
      :width="1250" :padding="15">
      <div class="block">
        <el-tabs v-model="activeName" class="demo-tabs" >
          <el-tab-pane label="单项预警配置" name="单项预警配置">
              <div class="tb">
                  <div class="btns" style="margin-bottom: 10px;">
                    <el-button type="primary" size="small" @click="addRow"><i class="el-icon-plus"></i>添加行</el-button>
                    <el-button type="success" size="small" @click="closeVialog"><i class="el-icon-check"></i>完成配置</el-button>
                  </div>
                  <!-- :single="true"设置为单选  -->
                  <vol-table ref="table" :columns="singleColumns" :max-height="552" :index="true" @rowClick="rowClick"
                    :tableData="tableData" :paginationHide="true" :endEditBefore="endEditBefore" :endEditAfter="endEditAfter"
                    @rowChange="rowChange" :single="true" :beginEdit="beginEdit"></vol-table>
              </div>
          </el-tab-pane>
          <el-tab-pane label="组合预警配置" name="组合预警配置">
            <div class="tb2">
                <span>
                  <p>组合预警配置</p>
                </span>
                <div class="btns" style="margin-bottom: 10px;">
                  <el-button type="warning" size="default" @click="addCombineRule"><i
                      class="el-icon-plus"></i>添加组合预警项</el-button>
                </div>
                <!-- :single="true"设置为单选  -->
                <!-- <vol-table ref="combineTable" :columns="combineColumns" :max-height="500" :index="true" @rowClick="rowClickForCombine"
                  :tableData="combineTableData" :paginationHide="true" :endEditBefore="endCombineEditBefore" :endEditAfter="endCombineEditAfter"
                  @rowChange="rowChangeForCombine" :single="true" :beginEdit="beginEdit"></vol-table> -->
             
             
             
                    <div v-for="(a, index) in forTest" :key="a" style="margin-bottom: 10px;">
                        <div class="btns" style="margin-bottom: 10px;">
                          <el-button type="primary" size="small" @click="addRowCombine(index)"><i
                              class="el-icon-plus"></i>添加行</el-button>
                          <el-button type="warning" size="small" @click="removeRowCombine(index)"><i
                              class="el-icon-minus"></i>删除行</el-button>
                          <el-button type="danger" size="small" @click="removeCombineRule(index)"><i
                              class="el-icon-minus"></i>删除该组合预警项</el-button>
                        </div>
                        <vol-table ref="a.combineTable" :columns="a.combineColumns" :max-height="500" :index="true"
                          @rowClick="rowClickForCombine" :tableData="a.combineTableData" :paginationHide="true"
                          :endEditBefore="endCombineEditBefore" :endEditAfter="endCombineEditAfter" @rowChange="rowChangeForCombine"
                          :single="true" :ck="false" :beginEdit="beginEdit"></vol-table>
                      </div>
                </div>

          </el-tab-pane>
        </el-tabs>

        <div class="example-tb" v-if="1==2">
          <div class="tb">
            <div class="btns" style="margin-bottom: 10px;">
              <el-button type="primary" size="small" @click="addRow"><i class="el-icon-plus"></i>添加行</el-button>
              <el-button type="success" size="small" @click="closeVialog"><i class="el-icon-check"></i>完成配置</el-button>
            </div>
            <!-- :single="true"设置为单选  -->
            <vol-table ref="table" :columns="singleColumns" :max-height="500" :index="true" @rowClick="rowClick"
              :tableData="tableData" :paginationHide="true" :endEditBefore="endEditBefore" :endEditAfter="endEditAfter"
              @rowChange="rowChange" :single="true" :beginEdit="beginEdit"></vol-table>
          </div>
          <br />
          <div class="tb">
            <span>
              <p>组合预警配置</p>
            </span>
            <div class="btns" style="margin-bottom: 10px;">
              <el-button type="warning" size="default" @click="addCombineRule"><i
                  class="el-icon-plus"></i>添加组合预警项</el-button>
            </div>
            <!-- :single="true"设置为单选  -->
            <!-- <vol-table ref="combineTable" :columns="combineColumns" :max-height="500" :index="true" @rowClick="rowClickForCombine"
              :tableData="combineTableData" :paginationHide="true" :endEditBefore="endCombineEditBefore" :endEditAfter="endCombineEditAfter"
              @rowChange="rowChangeForCombine" :single="true" :beginEdit="beginEdit"></vol-table> -->
          </div>
          <div v-for="(a, index) in forTest" :key="a" style="margin-bottom: 10px;">
            <div class="btns" style="margin-bottom: 10px;">
              <el-button type="primary" size="small" @click="addRowCombine(index)"><i
                  class="el-icon-plus"></i>添加行</el-button>
              <el-button type="warning" size="small" @click="removeRowCombine(index)"><i
                  class="el-icon-minus"></i>删除行</el-button>
              <el-button type="danger" size="small" @click="removeCombineRule(index)"><i
                  class="el-icon-minus"></i>删除该组合预警项</el-button>
            </div>
            <vol-table ref="a.combineTable" :columns="a.combineColumns" :max-height="500" :index="true"
              @rowClick="rowClickForCombine" :tableData="a.combineTableData" :paginationHide="true"
              :endEditBefore="endCombineEditBefore" :endEditAfter="endCombineEditAfter" @rowChange="rowChangeForCombine"
              :single="true" :ck="false" :beginEdit="beginEdit"></vol-table>
          </div>
        </div>

      </div>
    </MesBox>
  </div>
</template>
<script>
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import VolUpload from "@/components/basic/VolUpload.vue";
export default {
  components: {
    MesBox: MesBox,
    VolTable: VolTable,
    VolHeader: VolHeader,
    VolUpload: VolUpload,
  },
  data() {
    return {
      //切换单向预警 以及组合预警
      activeName:'单项预警配置',

      model: false,
      addVisible: "",
      tableData: [],
      combineTableData: [[]],
      alarmTemp: [],
      singleColumns: [
        //表配置
        // link: true, //设置link=true后此单元格可以点击获取当前行的数据进行其他操作
        {
          field: 'TempId',
          title: '预警模板',
          type: 'int',
          bind: { data: [] },
          edit: { type: "select" },
          width: 110,
          require: false,
          align: 'left',
          onChange: (row, column) => {
            this.alarmTemp.filter(x => x.ID === row.TempId).forEach(element => {
              // console.log("element",element);
              row.Type_Id = element.Type_Id;
              row.FieldName = element.FieldName;
              row.CalType = element.CalType;
              row.TimeMinute = element.TimeMinute;
              row.ThresholdValue = element.ThresholdValue;
              row.Method = element.Method;
              row.Level = element.Level;
            });
          },
        },
        { field: 'Level', title: '预警等级', type: 'string',bind: { key: 'alarmLevel', data: [] }, width: 120, require: true, align: 'left', edit: { type: "select" }, sort: true },
        { field: 'Point_Num', title: '监测点', type: 'string', bind: { data: [] }, width: 120, require: true, align: 'left', edit: { type: "select" }, sort: true },
        { field: 'Type_Id', title: '监测类型', type: 'int', bind: { key: 'typeManager', data: [] }, edit: { type: "select" }, width: 110, require: true, align: 'left' },
        { field: 'FieldName', title: '指标字段', type: 'string', width: 110, require: true, edit: { type: "string" }, align: 'left' },
        { field: 'CalType', title: '数据计算类型', type: 'int', bind: { key: 'calType', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
        { field: 'TimeMinute', title: '预警时间范围', type: 'bigint', bind: { key: 'alarmTime', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
        { field: 'ThresholdValue', title: '预警阈值标准', type: 'string', width: 110, require: true, edit: { type: "string" }, align: 'left' },
        { field: 'Method', title: '数据比对方式', type: 'string', bind: { key: 'alarmMethod', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
        {
          field: "操作",
          title: "操作",
          width: 120,
          fixed: "right",
          align: "center",
          render: (h, { row, column, index }) => {
            return h("div", { style: {} }, [
              h("div", {}, [
                h(
                  "span",
                  {
                    class: [
                      "el-icon-edit el-tag el-tag--success el-tag--light",
                    ],
                    style: {
                      cursor: "pointer",
                      "margin-right": "8px",
                    },
                    onClick: (e) => {
                      e.stopPropagation();
                      //开启编辑
                      let _index = this.$refs.table.edit.rowIndex;
                      if (_index != -1) {
                        return this.$message.error(
                          "请先完成第" +
                          (_index) +
                          "行的编辑,点击表头可完成编辑"
                        );
                      }
                      this.$refs.table.rowBeginEdit(row, column);
                    },
                  },
                  "编辑"
                ),
                h(
                  "span",
                  {
                    class: [
                      "el-icon-delete el-tag el-tag--danger el-tag--light",
                    ],
                    style: {
                      cursor: "pointer",
                    },
                    onClick: (e) => {
                      e.stopPropagation();
                      //删除行
                      this.tableData.splice(index, 1);
                      this.$message.success("删除成功");
                    },
                  },
                  "删除"
                ),
              ]),
            ]);
          },
        },
      ],
      forTest: [],
      points: [],
    };
  },
  setup() {
    //console.log('setup')
  },
  watch: {
    alarmTempDicByTypeIds(val) {
      this.singleColumns.filter(x => x.field == 'TempId')[0].bind.data = val
    }
  },
  computed: {
    pointNums() {
      return this.points.map(x => {
        return {
          key: x.Point_Num,
          value: x.Point_Num
        }
      })
    },
    alarmTempDicByTypeIds() {
      if (this.alarmTemp.length > 0 && this.points.length > 0) {
        let typeIds = [];
        let dic = [];
        this.points.forEach(item => {
          if (!typeIds.includes(item.Type_Id)) {
            typeIds.push(item.Type_Id)
            let currentDic = this.alarmTemp.filter(k => k.Type_Id === item.Type_Id).map(x => {
              return {
                key: x.ID,
                value: x.Title
              }
            })
            if (currentDic.length > 0) {
              currentDic.forEach(c=>dic.push(c))
            }
          }
        })
        return dic
      } else {
        return this.alarmTempDic
      }
    },

    alarmTempDic() {
      return this.alarmTemp.map(x => {
        return {
          key: x.ID,
          value: x.Title
        }
      })
    }
  },
  methods: {
    addClose() {
      this.tableData = [];
      this.combineTableData = [[]];
      this.model = false;
      this.points = [];
      this.forTest = []
    },
    open(data) {
      this.model = true;
      this.addVisible = true;
      //绑定预警配置（单指标与组合预警）
      if (data.Alarm_Single) {
        this.tableData = JSON.parse(data.Alarm_Single)
      } else {
        this.tableData = [];
      }
      if (data.Alarm_Combine) {
        this.combineTableData = JSON.parse(data.Alarm_Combine)
        this.combineTableData.forEach((el) => {
          this.addCombineRule(null, el)
        })
      } else {
        this.combineTableData = [[]];
      }
      this.getPoints(data.ID);
      this.getAlarmTemp();
    },
    //获取该项目下的监测点信息
    getPoints(groupId) {
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      param.wheres = `[{\'name\':\ 'Group_Id', \'value\':\' ${groupId}\'}]`;
      this.http
        .post("/api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          this.points = result.rows;
          this.singleColumns.filter(x => x.field == 'Point_Num')[0].bind.data = [...this.pointNums]
        });
    },
    //获取预警模板,该页面只获取一次
    getAlarmTemp() {
      if (this.alarmTemp.length > 0) {
        return
      }
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      param.wheres = '[]';
      this.http
        .post("/api/Ala_SingleTemp/getPageData", param, true)
        .then((result) => {
          this.alarmTemp = result.rows;
        });
    },
    closeVialog() {
      this.combineTableData = [...this.forTest.map(x => x.combineTableData)]
      this.$emit("parentCall", ($parent) => {
        $parent.getAlarmConfig(this.tableData, this.combineTableData);
      });
      this.tableData = [];
      this.combineTableData = [[]];
      this.forTest = [];
      this.model = false;
    },

    rowChange(row) {
      //选中checkbox事件
      return this.$message.success("点击checkbox,第" + row.elementIndex + "行");
    },
    rowChangeForCombine(row) {

    },
    rowClick({ row, column, $event }) {
      //点击行事件
      // return this.$message.success("点击的行：" + row.elementIndex);
    },
    rowClickForCombine() {

    },
    beginEdit(row, column, index) {
      return true;
    },
    endEditBefore(row, column, index) {
      // console.log("结束编辑前" + JSON.stringify(row));
      return true;
    },
    endCombineEditBefore(row, column, index) {
      // console.log("结束编辑前" + JSON.stringify(row));
      return true;
    },
    endEditAfter(row, column, index) {
      // console.log("结束编辑后" + JSON.stringify(row));
      return true;
    },
    endCombineEditAfter(row, column, index) {
      // console.log("结束编辑后" + JSON.stringify(row));
      return true;
    },
    addRow() {
      //添加行
      this.tableData.push({});
    },

    addRowCombine(index) {
      this.forTest[index].combineTableData.push({})
    },
    removeRowCombine(index) {
      let lastIndex = this.forTest[index].combineTableData.length;
      if (lastIndex > 0) {
        this.forTest[index].combineTableData.splice(lastIndex - 1, 1)
      }
    },
    removeCombineRule(index) {
      this.forTest.splice(index, 1)
    },
    addCombineRule(e, combineData) {
      let indexCombineRule = this.forTest.length + 1
      this.forTest.push(
        {
          combineTable: `combineTable${indexCombineRule}`,
          combineColumns: [
            {
              field: 'TempId',
              title: '预警模板',
              type: 'int',
              bind: { data: this.alarmTempDicByTypeIds },
              edit: { type: "select" },
              width: 110,
              require: false,
              align: 'left',
              onChange: (row, column) => {
                this.alarmTemp.filter(x => x.ID === row.TempId).forEach(element => {
                  row.Type_Id = element.Type_Id;
                  row.FieldName = element.FieldName;
                  row.CalType = element.CalType;
                  row.TimeMinute = element.TimeMinute;
                  row.ThresholdValue = element.ThresholdValue;
                  row.Method = element.Method;
                });

              },
            },
            {
              field: 'Point_Num',
              title: '监测点',
              type: 'string',
              width: 120,
              bind: { data: this.pointNums },
              require: true,
              align: 'left',
              edit: { type: "select" }
            },
            { field: 'Type_Id', title: '监测类型', type: 'int', bind: { key: 'typeManager', data: [] }, edit: { type: "select" }, width: 110, require: true, align: 'left' },
            { field: 'FieldName', title: '指标字段', type: 'string', width: 110, require: true, edit: { type: "string" }, align: 'left' },
            { field: 'CalType', title: '数据计算类型', type: 'int', bind: { key: 'calType', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
            { field: 'TimeMinute', title: '预警时间范围', type: 'bigint', bind: { key: 'alarmTime', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
            { field: 'ThresholdValue', title: '预警阈值标准', type: 'string', width: 110, require: true, edit: { type: "string" }, align: 'left' },
            { field: 'Method', title: '数据比对方式', type: 'string', bind: { key: 'alarmMethod', data: [] }, width: 110, require: true, edit: { type: "select" }, align: 'left' },
          ],
          combineTableData: combineData ?? []
        }
      )
    }
  },
};
</script>
<style lang="less" scoped>
//新加代码 
.block{
  padding:0 20px;
  height: 100%;
}
::v-deep .el-table__body-wrapper{
  overflow: auto;
  max-height: 513px;
}
::v-deep .srcoll-content{
  height: 100% !important;
}
::v-deep .el-tabs{
  height: 100%;
  .el-tabs__content{
    height: calc(100% - 55px);
    .el-tab-pane{
      height: 100%;
    }
  }
}
::v-deep .el-table{
  height: auto !important;
  max-height: 100%  !important;
}
.tb2{
  height:calc(100% - 15px);
  overflow-y: auto;
}
.tb2::-webkit-scrollbar{
  width: 0px;
}

.example-tb {
  padding: 15px;
}

.tb {
  margin-top: 15px;
  height:calc(100% - 15px);
}

.v-header {
  background: white;
  padding: 10px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: #0486FE !important;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    background: #f5f5f5 !important;
    width: 10px !important;
    height: 5px;
}
::v-deep.el-table__body-wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #ddd !important;
    border-radius: 5px !important;
    background: transparent !important;
}
</style>
