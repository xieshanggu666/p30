<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted } from "vue";
import http from "@/api/http.js";

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

onUnmounted(() => {
  clearChart();
});

function initChart() {
  chart = echarts.init(document.getElementById(props.id));
  chart.setOption({
    title: {
      top: 20,
      text: `数据分析`,
      textStyle: {
        fontWeight: "normal",
        fontSize: 16,
        color: "#999999",
      },
      left: "1%",
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
      top: 20,
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
      top: 100,
      left: "2%",
      right: "2%",
      bottom: "2%",
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
        max: function(value) {
          return Math.ceil(value.max)*2;
        },
        minInterval: 1,
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#57617B",
          },
        },
        axisLabel: {
          margin: 10,
          formatter: "{value} mm",
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
    series: state.series,
  });
}
function compileData(data) {
  for (let index in state.chartParam.legendData) {
    let legend = state.chartParam.legendData[index];
    let singlelineConfig = {
      name: legend,
      type: "bar",
      smooth: true,
      symbol: "circle",
      barWidth: 34,
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 3,
        },
      },
      // areaStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(0,0,0,1,
      //       [
      //         {
      //           offset: 0,
      //           color: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0.3)`,
      //         },
      //         {
      //           offset: 0.8,
      //           color: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0)`,
      //         },
      //       ],
      //       false
      //     ),
      //     shadowColor: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0.1)`,
      //     shadowBlur: 10,
      //   },
      // },
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
  initChart();
}
function pageInit() {
  clearChart();

  const param = JSON.parse(JSON.stringify(props.getParam));
  http
    .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
    .then((res) => {
      state.chartParam.legendData = res.data.series.map(
        (sery) => sery.displayName
      );
      state.xAxis.data = res.data.xAxis;
      compileData(res.data.series);
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
