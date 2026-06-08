<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="卡尔曼预测值"
      :height="400"
      :width="700"
      :padding="15"
    >
      <div>
        <el-form
          ref="form"
          :key="index"
          :model="tableData"
          label-width="110px"
        >
          <el-form-item label="X方向预测值：" label-width="110px">
            <el-input v-model="tableData.x_qv"></el-input>
          </el-form-item>
          <el-form-item label="X方向测量值：" label-width="110px">
            <el-input v-model="tableData.x_rv"></el-input>
          </el-form-item>
          <el-form-item label="Y方向预测值：" label-width="110px">
            <el-input v-model="tableData.y_qv"></el-input>
          </el-form-item>
          <el-form-item label="Y方向测量值：" label-width="110px">
            <el-input v-model="tableData.y_rv"></el-input>
          </el-form-item>
          <el-form-item label="Z方向预测值：" label-width="110px">
            <el-input v-model="tableData.z_qv"></el-input>
          </el-form-item>
          <el-form-item label="Z方向测量值：" label-width="110px">
            <el-input v-model="tableData.z_rv"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div>
          <el-button type="primary" size="mini" @click="submit()"
            >确认</el-button
          >
          <el-button type="default" size="mini" @click="model.box = false"
            >取消</el-button
          >
        </div></template
      >
    </vol-box>
  </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
export default {
  components: { "vol-box": VolBox },
  methods: {},
  data() {
    return {
      model: {
        box: false,
      },
      tableData: [
      ],
      dataTime: "",
      pointNum: "",
    };
  },
  methods: {
    submit() {
      this.http
        .post("/api/Mon_Point_Manager/SetKalmanData", this.tableData, true)
        .then((result) => {
          console.log("卡尔曼设置",result);
          if (result.status == true) {
             this.$message.success(result.message);
            this.model.box = false;
          }else{
             this.$message.error(result.message);
          }
        });
    },
    openKalmanInfo(row) {
      console.log("rrow", row);
      this.tableData = row.data;
      this.model.box = true;
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
