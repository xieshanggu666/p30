<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted } from "vue";
import http from "@/api/http.js";
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'

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

function initChart(AnalysisMsg, fillRGBA) {
  chart = echarts.init(document.getElementById(props.id));
  chart.setOption({
    title: {
      top: 0,
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
      left: "2%",
      right: "2%",
      bottom: "2%",
      containLabel: true,
    },
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
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
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        // min: function (value) {
        //   return Math.ceil(value.min) * 2;
        // },
        // max: function(value) {
        //   return Math.ceil(value.max) * 4;
        // },
        min: "dataMin",
        max: "dataMax",
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          color: "#5470C6",
        },
        axisLabel: {
          margin: 10,
          formatter: "{value} °",
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

    graphic: [
      {
        type: "group",
        left: "130",
        top: "20%",
        children: [
          {
            type: "rect",
            z: 100,
            left: "center",
            top: "middle",
            shape: {
              width: 380,
              height: 90,
            },
            style: {
              fill: fillRGBA, //'rgba(64,158,255,0.6)'
              stroke: "#777",
              lineWidth: 0,
              shadowBlur: 20,
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              shadowColor: "rgba(0,0,0,0.1)",
            },
          },
          {
            type: "text",
            z: 100,
            left: "center",
            top: "middle",
            style: {
              fill: "#fff",
              width: 360,
              overflow: "break",
              text: AnalysisMsg,
              font: "14px Microsoft YaHei",
            },
          },
        ],
      },
    ],

    series: state.series,
  });
}
function compileData(data, AnalysisMsg, fillRGBA) {
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
    enhanceSeriesItem(singlelineConfig, state.chartParam.colorArr[index]);
    state.series.push(singlelineConfig);
  }
  initChart(AnalysisMsg, fillRGBA);
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
      var fillRGBA = "";
      // console.log(res.data.dataAnalysisNeep);
      if (res.data.dataAnalysisNeep == "0") {
        fillRGBA = "rgba(64,158,255,0.6)";
      } else if (res.data.dataAnalysisNeep == "1") {
        fillRGBA = "rgba(255,211,8,0.6)";
      } else {
        fillRGBA = "rgba(255,24,6,0.6)";
      }
      initChart(res.data.dataAnalysisStr, fillRGBA);
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
