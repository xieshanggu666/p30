<template>
  <div
    class="columnar"
    style="width: 137px; height: 137px"
    ref="radarChart"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    echartsConfig: {
      type: Object,
      default: () => {
        return {
          seriesData: {
            name: "设备数量",
            total: "1000",
            data: [
              { name: "在线", value: "660", color: "#02ad4f" },
              { name: "离线", value: "340", color: "#ff0000" },
            ],
          },
        };
      },
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  computed: {
    seriesData() {
      return this.echartsConfig.seriesData;
    },
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.radarChart);
    this.initColumnar();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.myChart && this.myChart.dispose();
  },
  watch: {
    "echartsConfig.seriesData": {
      handler() {
        this.initColumnar();
      },
      deep: true,
    },
  },
  methods: {
    handleResize() {
      this.myChart && this.myChart.resize();
    },
    initColumnar() {
      let option = {
        title: {
          textStyle: {
            color: "#fff",
            fontSize: 12,
          },
          itemGap: 10,
          x: "center",
          y: "center",
          text: "总数",
          subtext: this.seriesData.total,
          subtextStyle: {
            color: "#37E1FF",
            fontSize: 14,
          },
          top: "35%",
        },
        color: this.seriesData.data.map((item) => item.color),
        tooltip: {
          trigger: "item",
        },
        grid: {
          top: "10%",
          left: "0%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        series: {
          name: this.seriesData.name,
          type: "pie",
          radius: ["50%", "70%"],
          data: this.seriesData.data.map((item) => {
            return {
              value: item.value,
              name: item.name,
              label: { color: item.color },
            };
          }),
          labelLine: {
            show: false,
          },
          label: {
            color: "#fff",
            show: false,
          },
        },
      };
      option && this.myChart.setOption(option, true);
    },
  },
};
</script>

<style scoped lang="scss">
.columnar {
  width: 100% !important;
  height: 100% !important;
}
</style>
