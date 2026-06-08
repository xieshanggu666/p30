<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="配置雷达参数"
      :height="600"
      :width="1200"
      :padding="15"
      :on-model-close="closeCustomModel"
    >
      <div>配置雷达参数</div>
      <div
        :id="this.id"
        :class="className"
        :style="{ height: this.height, width: this.width }"
      />

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
import * as echarts from "echarts";

export default {
  components: { "vol-box": VolBox },
  methods: {}, 
  data() {
    return {
      model: {
        box: false,
      },
      id: "chart",
      width: "1100px",
      height: "500px",
      series: [],
      chartParam: {
        legendData: [],
        colorArr: [
          [255, 0, 0],
          [255, 140, 0],
          [255, 255, 0],
          [0, 128, 0],
          [0, 255, 255],
          [128, 0, 128],
          [0, 0, 255],
          [165, 4, 4],
        ],
      },
    };
  },
  methods: {
    openConfiguration(row) {
      this.model.box = true;
      this.$nextTick(() => {
        this.initChart();
      });
    },

    closeCustomModel() {
      this.clearChart();
    },

    initChart() {
      let chart = echarts.init(document.getElementById(this.id));

      // for (var t = 0; t < 25; t += 0.001) {
      //   var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
      //   var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
      //   var z = t + 2.0 * Math.sin(75 * t);
      //   // data.push([x, y, z]);
      //   console.log("data",[x, y, z]);
      // }


      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };
      chart.setOption(option);
    },

    clearChart() {
      let chart = echarts.init(document.getElementById(this.id));
      this.series = [];
      if (!chart) {
        return;
      }
      chart.dispose();
      chart = null;
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
