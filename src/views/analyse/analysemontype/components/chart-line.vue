<template>
  <div :id="id" :class="className" :style="{ width, height }" />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted, onMounted, nextTick,defineEmits } from "vue";
import http from "@/api/http.js";
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'

let myChart = null;
const emit = defineEmits(['getDianList']);
const props = defineProps({
  getParam: {
    type: Object,
    default: () => ({}),
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
    default: "550px",
  },
  dianValue: {
    type: Boolean,
    default: ()=>{
      return []
    }
  }
});

const state = reactive({
  series: [],
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
    data: [],
  },
});

watch(
  () => props.getParam,
  () => {
    pageInit();
  },
  { deep: true } // 如果 getParam 是对象，建议开启 deep
);

onMounted(() => {
  window.addEventListener("resize", handleResize);
  // 组件挂载后再初始化
  nextTick(() => {
    pageInit();
  });
});

onUnmounted(() => {
  clearChart();
  window.removeEventListener("resize", handleResize);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});

function handleResize() {
  myChart && myChart.resize();
}

function initChart() {
  const dom = document.getElementById(props.id);
  if (!dom) return; // 防止DOM不存在时报错
  myChart = echarts.init(dom);
  myChart.setOption({
    title: {
      top: '32px',
      text: `数据展示`,
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
      top: 30,
      left: 80,
      width: 'auto',
      height: 75,
      type: 'scroll',
      orient: 'horizontal',
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
      top: 150,
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
        minInterval: 1,
        axisLabel: {
          interval: "auto",
          formatter: function(value) {
            return Math.round(value) + " mm";
          },
          margin: 10,
          textStyle: {
            fontSize: 14,
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
        splitLine: {
          lineStyle: {
            color: "#57617B",
          },
        },
      },
    ],
    series: state.series,
  });
}

function compileData(data) {
  // 数据安全校验
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("compileData: data is empty or not an array", data);
    return;
  }
  if (!Array.isArray(state.chartParam.colorArr) || state.chartParam.colorArr.length === 0) {
    console.warn("compileData: colorArr is empty or not an array", state.chartParam.colorArr);
    return;
  }

  state.series = [];
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    const legend = state.chartParam.legendData[index];
    // 颜色兜底：超出colorArr长度时循环取色
    const colorIndex = index % state.chartParam.colorArr.length;
    const color = state.chartParam.colorArr[colorIndex];

    if (!item || !Array.isArray(item.valueList)) {
      console.warn("compileData: item or valueList invalid", item);
      continue;
    }

    let singlelineConfig = {
      name: legend,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      showSymbol: false,
      lineStyle: {
        color: `rgb(${color[0]},${color[1]},${color[2]})`,
      },
      emphasis: {
        lineStyle: {
          color: `rgb(${color[0]},${color[1]},${color[2]})`,
        },
      },
      data: item.valueList,
    };
    enhanceSeriesItem(singlelineConfig, color);
    state.series.push(singlelineConfig);
  }
  // 确保DOM已渲染再初始化
  nextTick(() => {
    initChart();
  });
}

function pageInit() {
  clearChart();
  const param = JSON.parse(JSON.stringify(props.getParam));
  http
    .post("/api/Analysis/SameTypeIndicatorsAnalysis", param, true)
    .then((res) => {
      if (res.message === "获取成功" && res.data) {
        const { series, xAxis } = res.data;
        if (!Array.isArray(series) || !Array.isArray(xAxis)) {
          console.warn("pageInit: series or xAxis is invalid", res.data);
          return;
        }
        let arr = series.map((sery) => sery.pointName)
        
        emit('getDianList',arr)
        let _chartArr = series.filter((item) => {
          if(props.dianValue.length == 0) {
            return item
          }
          else {
            return props.dianValue.indexOf(item.pointName)>-1
          }
          
        })
        state.chartParam.legendData = _chartArr.map((sery) => sery.displayName);
        state.xAxis.data = xAxis;
        compileData(_chartArr);
      }
    })
    .catch(err => {
      console.error("pageInit request error:", err);
    });
}

function clearChart() {
  state.series = [];
  state.chartParam.legendData = [];
  state.xAxis.data = [];
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
}
</script>

<style scoped lang="scss">
.chart{
  width: 100%;
  height: 100%;
  padding:0 32px 32px;
}
</style>