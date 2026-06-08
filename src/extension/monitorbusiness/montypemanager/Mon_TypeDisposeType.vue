<template>
  <div>
    <MesBox
      :before-close="addClose"
      v-if="addVisible"
      v-model="model"
      :lazy="true"
      title="类型状态数据配置"
      :height="700"
      :width="1250"
      :padding="15"
    >
      <div class="block">
        <div class="example-tb">
          <div class="tb">
            <div class="btns" style="margin-bottom: 10px;">
              <el-button type="primary" size="small" @click="addRow"
                ><i class="el-icon-plus"></i>添加行</el-button
              >
              <el-button type="success" size="small" @click="closeVialog"
                ><i class="el-icon-check"></i>完成配置</el-button
              >
            </div>
            <!-- :single="true"设置为单选  -->
            <vol-table
              ref="table"
              :columns="columns"
              :max-height="500"
              :index="true"
              @rowClick="rowClick"
              :tableData="tableData"
              :paginationHide="true"
              :endEditBefore="endEditBefore"
              :endEditAfter="endEditAfter"
              @rowChange="rowChange"
              :single="true"
              :beginEdit="beginEdit"
            ></vol-table>
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
      model: false,
      addVisible: "",
      tableData: [],
      columns: [
        //表配置
        {
          field: "Id", //数据库表字段,必须和数据库一样，并且大小写一样
          title: "主键ID", //表头显示的名称
          type: "int", //数据类型
          isKey: true, //是否为主键字段
          width: 80, //表格宽度
          hidden: true, //是否显示
          readonly: true,
          require: true,
          align: "left", //文字显示位置left、center
        },
        {
          field: "DisplayName",
          title: "名称",
          type: "string",
          width: 90,
          onKeyPress: (row, column, $event) => {
            console.log(row);
          },
          align: "left",
          edit: { type: "string"},
        },
        {
          field: "FieldName",
          title: "字段名",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: "V1", value: "V1" },
              { key: "V2", value: "V2" },
              { key: "V3", value: "V3" },
              { key: "V4", value: "V4" },
              { key: "V5", value: "V5" },
              { key: "V6", value: "V6" },
              { key: "V7", value: "V7" },
            ],
          },
          edit: { type: "select" },
          width: 100,
          align: "left",
          onChange: (row, column) => {
            this.$message.success(row.FieldName + "");
          },
        },
        {
          field: "AggregationType",
          title: "聚合方式",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: "Max", value: "Max" },
              { key: "Min", value: "Min" },
              { key: "Avg", value: "Avg" },
              { key: "Sum", value: "Sum" },
            ],
          },
          edit: { type: "select" },
          width: 100,
          align: "left",
          onChange: (row, column) => {
            this.$message.success(row.AggregationType + "");
          },
        },
        {
          field: "Precision",
          title: "精度属性",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: 0, value: 0 },
              { key: 1, value: 1 },
              { key: 2, value: 2 },
              { key: 3, value: 3 },
              { key: 4, value: 4 },
              { key: 5, value: 5 },
              { key: 6, value: 6 },
            ],
          },
          edit: { type: "select" },
          width: 100,
          align: "left",
          onChange: (row, column) => {
            this.$message.success(row.AggregationType + "");
          },
        },
        {
          field: "UnitCoefficient",
          title: "单位系数",
          type: "string",
          width: 90,
          onKeyPress: (row, column, $event) => {
            console.log(row);
          },
          edit: { type: "decimal", },
        },
        {
          field: "MaxValue",
          title: "最大值",
          type: "string",
          width: 90,
          onKeyPress: (row, column, $event) => {
            console.log(row);
          },
          edit: { type: "decimal",},
        },
        {
          field: "MinValue",
          title: "最小值",
          type: "string",
          width: 90,
          onKeyPress: (row, column, $event) => {
            console.log(row);
          },
          edit: { type: "decimal",},
        },
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
    };
  },
  methods: {
    addClose() {
      this.tableData = [];
      this.model = false;
    },
    open(data) {
      this.model = true;
      this.addVisible = true;
      if(data.Run_Config){
        this.tableData=JSON.parse(data.Run_Config)
      }else{
        this.tableData=[]
      }
    },
    closeVialog() {
      this.$emit("parentCall", ($parent) => {
        $parent.getTypeRow(this.tableData);
      });
      this.model = false;
      this.tableData = [];
    },

    rowChange(row) {
      //选中checkbox事件
      // return this.$message.success("点击checkbox,第" + row.elementIndex + "行");
    },
    rowClick({ row, column, $event }) {
      //点击行事件
      // return this.$message.success("点击的行：" + row.elementIndex);
    },
    beginEdit(row, column, index) {
      // console.log("编辑开始前" + JSON.stringify(row));
      return true;
    },
    endEditBefore(row, column, index) {
      // console.log("结束编辑前" + JSON.stringify(row));
      return true;
    },
    endEditAfter(row, column, index) {
      // console.log("结束编辑后" + JSON.stringify(row));
      return true;
    },
    del() {
      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) {
        return this.$message.error("请先选中行");
      }
      this.$refs.table.delRow();
    },
    clear() {
      this.tableData.splice(0);
    },
    addRow() {
      //添加行
      this.tableData.push({});
    },
    getSelect() {
      //获取选中的行
      let rows = this.$refs.table.getSelected();
      return this.$message.error("请先选中行:" + JSON.stringify(rows));
    },
  },
};
</script>
<style lang="less" scoped>
.example-tb {
  padding: 15px;
}
.tb {
  margin-top: 15px;
}
.v-header {
  background: white;
  padding: 10px;
}
</style>
