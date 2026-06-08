<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
  <!-- <div :id="id" :class="className" style="width: calc(100vw - 240px);" /> -->
</template>

<script setup>
import * as echarts from "echarts"
import { enhanceSeriesItem, getBarEmphasis, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance";
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
    default: "",
  },
  height: {
    type: String,
    default: "",
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
    legendData: ["预警数"],
    selected: {
      TPdwt05_X方向: true,
      TPdwt05_Y方向: false,
      TPdwt05_Z方向: false,
    },
    colorArr: [
      [73, 201, 254],
      [131, 104, 221],
      [107, 230, 193],
      [55, 230, 252],
      [59, 152, 239],
      [196, 235, 173],
      [150, 222, 232],
      [160, 167, 230],
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function(datas) {
        return datas[0].name + "：" + datas[0].value;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "25%",
      top: "10%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05","2024-06"],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: "#FFFFFF",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#FFFFFF",
        },
      },
    ],
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
    series: [
      {
        name: "预警数",
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: function(data) {
            return data.value;
          },
          textStyle: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "bold",
            fontStyle: "italic",
            fontFamily: "Arial",
          },
        },
        barWidth: "60%",
        emphasis: getBarEmphasis(),
        data: [10, 52, 102, 104, 110, 12],
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#3484ff", // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "#536AF9", // 50% 处的颜色
              },
              {
                offset: 1,
                color: "#6F5DFE", // 100% 处的颜色
              },
            ],
          },
        },
      },
    ],
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
      barWidth: 34,
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        normal: {
          width: 3,
        },
      },
      data: data,
    };
    enhanceSeriesItem(singlelineConfig, state.chartParam.colorArr[index]);
    state.series.push(singlelineConfig);
  }
  initChart();
}
function pageInit() {
  clearChart();

  // const param = JSON.parse(JSON.stringify(props.getParam));
  http.get("/api/BigScreen/GeAlarmStatistics", {}, true).then((res) => {
    state.xAxis.data = res.data.map((sery) => sery.alarmDate);
    state.data = res.data.map((sery) => sery.alarmCount);
    compileData(state.data);
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
