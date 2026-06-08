<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
export default {
  watch: {
    getParam() {
      this.pageInit();
    },
  },
  props: {
    getParam: {
      type: Object,
      default: {},
    },
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "400px",
    },
    height: {
      type: String,
      default: "365px",
    },
  },
  data() {
    return {
      chart: null,
      series: [],
      dataAxis: [],
      seriesData: [],
      chartData: {},
      titleObj: {},
      styleArr: [],
    };
  },
  beforeDestroy() {
    this.clearChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      if (this.getParam.length === 0) {
        this.chart.showLoading({
          text: "暂无数据",
          fontSize: 18,
          color: "transparent", // loading颜色，设置成透明或白色，不然会显示loading状态
          textColor: "#ccc", // 文字颜色
          maskColor: "rgba(255, 255, 255, 0.2)", // 背景色
        });
      }
      let yMax = 500;
      let dataShadow = [];
      for (let i = 0; i < this.dataAxis.length; i++) {
        dataShadow.push(yMax);
      }
      this.chart.setOption({
        title: {
          text: this.title,
          left: "center",
          top: 10,
        },
        legend: {
          data: ["参与解算"],
          icon: "circle",
          bottom: 0,
          left: "center",
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            inside: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#999",
          },
        },
        dataZoom: [
          {
            type: "inside",
          },
        ],
        series: this.series,
      });
    },
    pageInit() {
      this.clearChart();
      this.getParam.map((v) => this.dataAxis.push(v.number));
      this.getParam.map((v) => this.seriesData.push(v.snr));

      switch (this.title) {
        case "BDS信噪比":
          this.styleArr = [
            {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: "#6be6c1" },
                { offset: 0.5, color: "#6be6c1" },
                { offset: 0, color: "#8AE6CA" },
              ]),
            },
          ];
          break;
        case "GPS信噪比":
          this.styleArr = [
            {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: "#3b98ef" },
                { offset: 0.5, color: "#3b98ef" },
                { offset: 0, color: "#188df0" },
              ]),
            },
          ];
          break;
        case "GLONASS信噪比":
          this.styleArr = [
            {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: "#9A85DD" },
                { offset: 0.5, color: "#9A85DD" },
                { offset: 0, color: "#886CE6 " },
              ]),
            },
          ];
          break;
        case "Galileo信噪比":
          this.styleArr = [
            {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: "#76D6FE" },
                { offset: 0.5, color: "#76D6FE" },
                { offset: 0, color: "#98E0FE" },
              ]),
            },
          ];
          break;

        default:
          break;
      }

      let seriesAtom = {
        type: "bar",
        name: "参与解算",
        label: {
          normal: {
            show: true,
            position: "top",
          },
          formatter: "{@value}",
        },
        showBackground: false,
        itemStyle: this.styleArr[0],
        emphasis: {
          focus: "self",
        },
        markLine: {
          //设置标记线
          data: [
            {
              type: "average",
              name: "符合",
              yAxis: 45,
              itemStyle: {
                normal: { borderType: "dotted", color: "green" },
              },
            },
            {
              type: "average",
              name: "不符合",
              yAxis: 35,
              itemStyle: {
                normal: { borderType: "dotted", color: "red" },
              },
            },
          ],
          lineStyle: {
            type: "dashed",
          },
        },

        data: this.seriesData,
      };
      this.series.push(seriesAtom);
      this.initChart();
    },
    clearChart() {
      this.series = [];
      this.dataAxis = [];
      this.chartData = {};
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
  },
};
</script>
