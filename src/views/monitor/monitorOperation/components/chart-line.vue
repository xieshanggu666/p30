<template>
  <div
    :id="props.id"
    :class="props.className"
    :style="{ height: props.height+`px`, width: props.width }"
  />
</template>

<script setup>
import * as echarts from "echarts";
import http from "@/api/http.js";
import ChartFilter from "@/uitils/chartFilter.js";
import { bindToolboxZoom } from "@/uitils/chartEnhance";
import { reactive, computed, ref, onMounted, onUnmounted, watch } from "vue";
let chart = null;
const yNumer = ref(0);
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
    default: "",
  },
});
pageInit();
onUnmounted(() => {
  clearChart();
});
watch(
  () => props.getParam,
  () => {
    pageInit();
  }
);

async function pageInit() {
  clearChart();
  if (props.getParam.pointNum) {
    const filterData = (
      await http.axios({
        url: "/api/Mon_Point_Manager/GetRunDataConfig",
        params: { pointNum: props.getParam.pointNum },
        method: "get",
        
      })
    ).data.data;
    http.get('/api/Mon_Point_Manager/GetRunDataList', props.getParam, true).then((result) => {
        const chartData = result.Data
        const compileData = ChartFilter(chartData, filterData);
        // return
        initChart(compileData);
      });
  }
}

function initChart(compileData) {
  chart = echarts.init(document.getElementById(props.id));
  chart.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        lineStyle: {
          color: "#57617B",
        },
      },
    },
    legend: {
      top: 20,
      icon: "rect",
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      data: compileData.legend,
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
    dataZoom: compileData.dataZoom,
    toolbox: compileData.toolbox,
    xAxis: [
      {
        type: "time",
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: "#57617B",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        // name: "温度(℃)",
        // max: function(value) {
        //   yNumer.value = Math.ceil(value.max);
        //   return yNumer.value
        // },
        // max:100,

        // max: function(value) {
        //   return Math.ceil(value.max-value.min);
        // },
        // minInterval: 1,
        axisLabel: {
          interval: "auto",
          formatter: function(value) {
            // 使用formatter保证即使在缩放时也只显示整数
            return Math.round(value);
          },
        },
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
          textStyle: {
            fontSize: 14,
          },
        },

        splitLine: {
          show:true,
          lineStyle: {
            color: "#57617B",
          },
        },
      },
      // {
      //   type: "value",
      //   name: "电压/信号(V)",
      //   // max: function(value) {
      //   //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
      //   //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
      //   // },
      //   // min: 0,
      //   // max:100,
      //   axisTick: {
      //     show: false,
      //   },
      //   axisLabel: {
      //     interval: "auto",
      //     formatter: function(value) {
      //       // 使用formatter保证即使在缩放时也只显示整数
      //       return Math.round(value);
      //     },
      //   },
      //   axisLine: {
      //     lineStyle: {
      //       color: "#57617B",
      //     },
      //   },
      //   axisLabel: {
      //     margin: 10,
      //     textStyle: {
      //       fontSize: 14,
      //     },
      //   },
      //   splitLine: {
      //     show:false,
      //     lineStyle: {
      //       color: "#57617B",
      //     },
      //   },
      // },
    ],
    series: compileData.series,
  });
  bindToolboxZoom(chart);
}
function clearChart() {
  if (!chart) {
    return;
  }
  chart.dispose();
  chart = null;
}
</script>
