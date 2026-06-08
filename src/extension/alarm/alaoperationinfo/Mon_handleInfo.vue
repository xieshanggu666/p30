<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="处理预警信息"
      :height="250"
      :width="700"
      :padding="15"
      :on-model-close="closeCustomModel"
    >
      <div>
        <div class="time">
          <div class="timeout">处理备注：</div>
          <el-form-item>
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <template #footer>
        <div>
          <el-button type="primary" size="mini" @click="submit()"
            >确认</el-button
          >
          <el-button type="default" size="mini" @click="clear()"
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
      form: [],
      ID: "",
      textarea: "",
    };
  },
  methods: {
    closeCustomModel() {
    },
    clear(){
      this.model.box = false
    },
    submit() {
      var param = {
          id: this.ID,
          comment: this.textarea,
      };
      this.http
        .post("/api/Ala_Operationinfo/DealOperationinfo", param, true)
        .then((result) => {
          this.model.box = false;
          this.$emit("parentCall", ($parent) => {
              $parent.getRow();
            });
          this.$message.success(result.message);
        });
    },
    open3(row) {
      this.textarea = "";
      this.ID = row.ID;
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
.el-textarea__inner {
  width: 600px;
}
</style>
