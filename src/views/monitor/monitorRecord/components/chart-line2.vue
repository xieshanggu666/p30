
<template>
  <div :id="id" :class="className" :style="{ height: props.height+`px`, width: width }" />
</template>

<script setup>
import * as echarts from "echarts"
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance";
import { watch, reactive, onUnmounted, onMounted } from "vue";
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
    default: "100%",
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
  },{deep:true}
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


onMounted(() => {
  pageInit();
})
onUnmounted(() => {
  clearChart();
});

function initChart() {
  chart = echarts.init(document.getElementById(props.id));
  chart.setOption({
    title: {
      top: 20,
      text: `数据展示`,
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
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
    xAxis: [
      {
        // type: 'time',
        // boundaryGap: false,
        min: 'dataMin',
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
        // minInterval: 1,
      //  max: function(value) {
      //     // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
      //     return Math.ceil(value.max + (value.max - value.min) * 0.5);
      //   },
        type: "value",
        minInterval: 1,
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
          formatter: "{value}",
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
      // areaStyle: {
      //   normal: {
      //     color: new echarts.graphic.LinearGradient(
      //       0,
      //       0,
      //       0,
      //       1,
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
    enhanceSeriesItem(singlelineConfig, state.chartParam.colorArr[index]);
    state.series.push(singlelineConfig);
  }
  initChart();
}
function pageInit() {
  clearChart();
  if(!props.getParam.pointNum) return;
  // 2026年3月18日修改：数据由列表传入不在请求接口
  if(props.getParam.list || props.getParam.chartLengdList) {
    state.chartParam.legendData = props.getParam.chartLengdList.map(
        (sery) => sery.DisplayName
      );
    state.xAxis.data = props.getParam.list.map((item=>{
      return item.DataTime
    })).reverse();
    state.chartParam.legendData = state.chartParam.legendData.reverse()
    const fieldMap = {};
    const dataCollector = {};
    props.getParam.chartLengdList.forEach(item=>{
      const { FieldName, DisplayName } = item;
      fieldMap[FieldName] = DisplayName;
      dataCollector[FieldName] = [];
    })
    props.getParam.list.forEach(row=>{
      Object.entries(row).forEach(([field, value]) => {
        if (dataCollector[field]) {
          dataCollector[field].unshift(value);
        }
      });
    })
    const arr = props.getParam.chartLengdList.map((item,index)=>{
      const { DisplayName,FieldName } = item;
      let singlelineConfig = {
        name: DisplayName,
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
        data: dataCollector[FieldName] || [],
      };
      return singlelineConfig
    })
    state.series = arr || [];
    initChart();
  }
  // /api/Mon_Point_Manager/GetMonitorDataList
  else{
    const param = JSON.parse(JSON.stringify(props.getParam));
    http
      .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
      .then((res) => {
        state.chartParam.legendData = res.data.series.map(
          (sery) => sery.displayName
        );
        state.xAxis.data = res.data.xAxis;
        // state.chartData = res;
        compileData(res.data.series);
      });
    }
  
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
