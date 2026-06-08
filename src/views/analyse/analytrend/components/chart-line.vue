<template>
  <div :id="id" :class="className"  />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted,onMounted } from "vue";
import http from "@/api/http.js";
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'
let myChart = null;
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
    default: "100%",
  },
  height: {
    type: String,
    default: "700px",
  },
});

watch(
  () => props.getParam,
  () => {
    pageInit();
  }
);
onMounted(() => {
    window.addEventListener("resize", handleResize);
});
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
  window.removeEventListener("resize", handleResize);
  myChart && myChart.dispose();
});

function handleResize() {
  myChart && myChart.resize();
}
function initChart() {
  chart = echarts.init(document.getElementById(props.id));
  myChart=chart;
  chart.setOption({
    title: {
      top: '32px',
      text: `数据展示`,
      textStyle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#666666",
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
      top: 40,
      left: 40,
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
      top: 200,
      left: "2%",
      right: "2%",
      bottom: "2%",
      containLabel: true,
    },
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
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
        // max: "dataMax",
        minInterval: 1,
        // max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
        axisLabel: {
          interval: "auto",
          formatter: function(value) {
            // 使用formatter保证即使在缩放时也只显示整数
            return Math.round(value);
          },
        },
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
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
            color: "#57617B",
          },
        },
      },
    ],
    animation: true,
    animationDuration: 5000,
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
      itemStyle: {
        normal: {
          color: `rgb(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]})`,
          borderColor: `rgba(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]},0.27)`,
          borderWidth: 12,
        },
      },
      data: data[index].valueList,
    };
    enhanceSeriesItem(singlelineConfig, state.chartParam.colorArr[index]);
    state.series.push(singlelineConfig);
  }
  initChart();
}

function pageInit() {
  clearChart();
  const param = JSON.parse(JSON.stringify(props.getParam));
  console.log("param", param);
  let url = `/api/Analysis/GetTrendingAnalysis?pointNum=${param.pointNum}`;
  http.get(url, {}, true).then((res) => {
    if (res.message === "获取成功") {
      // console.log("???????????????????", res);
      state.chartParam.legendData = res.data.series.map(
        (sery) => sery.displayName
      );
      state.xAxis.data = res.data.xAxis;
      compileData(res.data.series);
    }
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
  height:100%;
  padding:0 32px 32px;
}
</style>