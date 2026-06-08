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
    default: "100px",
  },
  height: {
    type: String,
    default: "100px",
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
    legend: {
      top: "bottom",
      left: "3%",
      right: "4%",
      bottom: 20,
      textStyle: {
        color: "#FFFFFF", // 设置图例文字颜色
        fontSize: 12,
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c}%",
      textStyle: {
        fontSize: 12,
      },
    },
    toolbox: {
      show: true,
    },
    series: [
      {
        name: "监测类型统计",
        type: "pie",
        radius: ["20%", "50%"],
        center: ["50%", "45%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 4,
          normal: {
                label: {
                  textStyle: {
                    color: '#FFFFFF',//用这个属性改变字体颜色
                  },
                },
              },
        },

        data: state.xAxis.data,
         label: {
                normal: {
                    show: true,
                    formatter: '{b}: {d}%' // 显示名称和百分比
                }
            }
      },
    ],
  });
}
function compileData(data) {
  // for (let index in state.chartParam.legendData) {
  //   let legend = state.chartParam.legendData[index];
  //   let singlelineConfig = {
  //     name: legend,
  //     type: "line",
  //     smooth: true,
  //     symbol: "circle",
  //     barWidth: 34,
  //     symbolSize: 5,
  //     showSymbol: false,
  //     lineStyle: {
  //       normal: {
  //         width: 3,
  //       },
  //     },
  //     data: data,
  //   };
  //   state.series.push(singlelineConfig);
  // }
  initChart();
}
function pageInit() {
  clearChart();

  const param = JSON.parse(JSON.stringify(props.getParam));
  http.get("/api/Mon_DevOps_Manager/GetFaultTypeRate", {}, true).then((res) => {
    console.log("res",res);
    state.xAxis.data = res.data.map(item => ({
						name: item.errorType,
						value: item.errorCount, 
					}));
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
