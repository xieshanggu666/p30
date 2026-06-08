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
    default: "chartspeed",
  },
  id: {
    type: String,
    default: "chartspeed",
  },
  width: {
    type: String,
    default: "100%",
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
      top: 20,
      text: `速率分析`,
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
      top: 70,
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
        // type: 'time',
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
        // min: function(value) {
        //   return Math.ceil(value.min)*2;
        // },
        // max: function(value) {
        //   return Math.ceil(value.max)*5;
        // },
        // min: 0,
        max: function(value) {
          // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
          return Math.ceil(value.max + (value.max - value.min) * 0.5);
        },
        min:"dataMin",
        minInterval: 1,
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#57617B",
          },
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
            color: ['#eee'],
          },
        },
      },
    ],
    // animation: true,
    // animationDuration: 20000,
    series: state.series,
  });
}
function sixNum(num) {
  return Math.floor(num * 1000000) / 1000000;
}
function compileData(data) {
  for (let index in state.chartParam.legendData) {
    let legend = state.chartParam.legendData[index];
    let f0 = data[index].valueList;
    let brr = [];
    for (let i in f0) {
      if (i > 0) {
        brr.push((f0[i] - f0[i - 1]).toFixed(6));
      }
    }
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
      data: brr,
    };
    // console.log("singlelineConfig", singlelineConfig);
    state.series.push(singlelineConfig);
  }
  // console.log(state.series, "state.series");
  initChart();
}
function pageInit() {
  clearChart();

  const param = JSON.parse(JSON.stringify(props.getParam));
  console.log(param, "param");
  http
    .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
    .then((res) => {
      state.chartParam.legendData = res.data.series.map(
        (sery) => sery.displayName
      );
      state.xAxis.data = res.data.xAxis.filter((val, index, arr) => {
        return index !== 0;
      });
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

<style scoped lang="scss">
.chartspeed{
  width: 100%;
  height: 50%;
  padding:0 32px 32px;
}
</style>
