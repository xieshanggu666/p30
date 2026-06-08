<template>
  <div>
    <MesBox
      :before-close="addClose"
      v-if="addVisible"
      v-model="model"
      :lazy="true"
      title="类型监测数据配置"
      :height="400"
      :width="600"
      :padding="15"
    >
      <div class="block">
        <el-form ref="form" :model="tableData" label-width="50px">
          <el-form-item label="T0:">
            <el-input v-model="form.t0"></el-input>
          </el-form-item>
          <el-form-item label="N:">
            <el-input v-model="form.n"></el-input>
          </el-form-item>
          <el-form-item label="A:">
            <el-input v-model="form.a"></el-input>
          </el-form-item>
          <el-form-item label="B:">
            <el-input v-model="form.b"></el-input>
          </el-form-item>
          <el-form-item label="C:">
            <el-input v-model="form.c"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-left:440px">
          <el-button type="primary" size="mini" @click="closeVialog()"
            >确认</el-button
          >
          <el-button type="default" size="mini" @click="close()"
            >取消</el-button
          >
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
      form: { t0: "", n: "", a: "", b: "", c: "" },
      tableData: { t0: "", n: "", a: "", b: "", c: "" },
    };
  },
  methods: {
    addClose() {
      this.model = false;
      this.form = {};
    },
    open(data) {
      this.model = true;
      this.addVisible = true;
      console.log("data", data.Config);
      if (data.Config) {
        this.form = JSON.parse(data.Config);
      } else {
        console.log("2");
        this.tableData = {};
      }
    },

    closeVialog() {
      this.$emit("parentCall", ($parent) => {
        $parent.getRow(this.form);
      });
      this.model = false;
      this.form = {};
    },
    close() {
      this.model = false;
      this.form = {};
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
