<template>
  <div :id="id" :class="className"  />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted } from "vue";
import http from "@/api/http.js";
let myCharts = null;
let chart;
const props = defineProps({
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
  width: {
    type: String,
    default: "1400px",
  },
  height: {
    type: String,
    default: "320px",
  },
});
watch(
  () => props.getParam,
  () => {
    pageInit();
  }
);
const state = reactive({
  series: [],
  chartData: {},
  chartParam: {
    legendData: [],
    selected: {
      TPdwt05_X方向: true,
      TPdwt05_Y方向: false,
      TPdwt05_Z方向: false,
    },
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
  xAxis: {
    data: null,
  },
});

pageInit();
window.addEventListener("resize", handleResize);
onUnmounted(() => {
  clearChart();
  window.removeEventListener("resize", handleResize);
  myCharts && myCharts.dispose();
});
function handleResize() {
  myCharts && myCharts.resize();
}
function initChart() {
  chart = echarts.init(document.getElementById(props.id));
  myCharts=chart;
  chart.setOption({
    title: {
      top: 0,
      text: `单相分析`,
      textStyle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333333",
      },
      left: "0",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#999999",
        },
      },
    },
    legend: {
      top: 3,
      icon: "rect",
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      data: state.chartParam.legendData,
      selected: {
        TPdwt05_X方向: true,
        TPdwt05_Y方向: true,
        TPdwt05_Z方向: true,
      },
      right: "4%",
      textStyle: {
        fontSize: 12,
        color: "#999999",
      },
    },
    grid: {
      top: 50,
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true,
    },
    dataZoom: [
      {
        id: "dataZoomX",
        type: "inside",
        xAxisIndex: [0],
        filterMode: "filter",
      },
    ],
    xAxis: [
      {
        //type: 'category',
        // boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: "#57617B",
          },
        },
        data: state.xAxis.data,
      },
    ],
    yAxis: [
      {
        // min: function (value) {
        //   return Math.ceil(value.min);
        // },
        // max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 15);
        // },
        minInterval: 1,
        axisLabel: {
          interval: "auto",
          formatter: function(value) {
            // 使用formatter保证即使在缩放时也只显示整数
            return Math.round(value);
          },
        },
        type: "value",
        splitNumber: 5,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          color: "#5470C6",
        },
        axisLabel: {
          margin: 10,
          formatter: "{value}",
          textStyle: {
            fontSize: 14,
          },
        },
        splitLine: {
          lineStyle: {
            color: ["#eee"],
          },
        },
      },
    ],

    // graphic: [
    //   {
    //     type: "group",
    //     left: "130",
    //     top: "20%",
    //     children: [
    //       {
    //         type: "rect",
    //         z: 100,
    //         left: "center",
    //         top: "middle",
    //         shape: {
    //           width: 380,
    //           height: 90,
    //         },
    //         style: {
    //           fill: fillRGBA, //'rgba(64,158,255,0.6)'
    //           stroke: "#777",
    //           lineWidth: 0,
    //           shadowBlur: 20,
    //           shadowOffsetX: 3,
    //           shadowOffsetY: 3,
    //           shadowColor: "rgba(0,0,0,0.1)",
    //         },
    //       },
    //       {
    //         type: "text",
    //         z: 100,
    //         left: "center",
    //         top: "middle",
    //         style: {
    //           fill: "#fff",
    //           width: 360,
    //           overflow: "break",
    //           text: AnalysisMsg,
    //           font: "14px Microsoft YaHei",
    //         },
    //       },
    //     ],
    //   },
    // ],

    series: state.series,
  });
}
function compileData(data) {
  for (let index in state.chartParam.legendData) {
    let legend = state.chartParam.legendData[index];
    let singlelineConfig = {
      name: legend,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 3,
        },
      },
      itemStyle: {
        normal: {
          color: `rgb(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]})`,
          borderColor: `rgba(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]},0.27)`,
          borderWidth: 12,
        },
      },
      data: data[index].valueList,
    };
    state.series.push(singlelineConfig);
  }
  // console.log(state.series, "state.series");
  initChart();
}
function pageInit() {
  clearChart();
  const param = JSON.parse(JSON.stringify(props.getParam));
  // console.log(param, "param");
  http
    .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
    .then((res) => {
      state.chartParam.legendData = res.data.series.map(
        (sery) => sery.displayName
      );
      state.xAxis.data = res.data.xAxis;
      compileData(res.data.series, res.data.dataAnalysisStr);
    });
}
function clearChart() {
  state.series = [];
  if (!chart) {
    return;
  }
  chart.dispose();
  chart = null;
}
</script>
<style scoped lang="scss">
.chart{
  width: 100%;
  height: 50%;
  padding:0 32px 32px;
}
</style>