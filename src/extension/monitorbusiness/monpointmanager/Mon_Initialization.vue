<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="初始化"
      :height="300"
      :width="700"
      :padding="15"
    >
      <div>
        <div class="time">
          <div class="timeout">初始化时间：</div>
          <el-form-item>
            <el-date-picker
              v-model="dataTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <el-form
          ref="form"
          v-for="(item, index) in tableData"
          :key="index"
          :model="form"
          label-width="80px"
        >
          <el-form-item :label="item.displayName + `:`">
            <el-input v-model="item.value"></el-input>
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
        </div></template>
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
      tableData: [],
      form: [],
      dataTime: "",
      pointNum: "",
    };
  },
  methods: {
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
    submit() {
      var param = {
        pointNum: this.pointNum,
        dataTime: this.filterTime(this.dataTime),
        data: this.tableData,
      };
      this.http
        .post("/api/Mon_Point_Manager/InitialPoint", param, true)
        .then((result) => {
          if (result.message == "初始化成功") {
            this.model.box = false;
            this.$emit("parentCall", ($parent) => {
              $parent.getRow();
            });
          }else{
             this.$message.error(result.message);
          }
        });
    },
    open3(point, row) {
      // console.log(row);
      this.pointNum = point;
      this.tableData = row.data.data;
      this.dataTime = row.data.dataTime;
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
