<template>
  <div :id="id" :class="className" />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted,onMounted,ref } from "vue";
import http from "@/api/http.js";
import { evaluate,format } from 'mathjs'
let myChart = null;
let chart;
const unitshow = ref(true);
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
onMounted(() => {
    window.addEventListener("resize", handleResize);
});
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
      top: 0,
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
      top: 0,
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
      top: 40,
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
          formatter: unitshow?"{value} mm":"{value}",
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
  // 是否显示Y轴单位
  unitshow.value = true;
  const param = JSON.parse(JSON.stringify(props.getParam));
  if(JSON.stringify(props.getParam.formula_Config) == '{}') {
    http
    .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
    .then((res) => {
      state.chartParam.legendData = res.data.series.map(
        (sery) => sery.displayName
      );
      // state.xAxis.data = res.data.xAxis.filter((val, index, arr) => {
      //   return index !== 0;
      // });
      state.xAxis.data = res.data.xAxis;
      compileData(res.data.series);
    });
  }
  else {
      try{
        unitshow.value = false;
        const { configList,xdata,xkey,ydata,ykey } = props.getParam.formula_Config
        // 数据源相同
        if(xdata == ydata) {
          param.pointNum = xdata
          http
          .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
          .then((res) => {
            state.chartParam.legendData = configList.map(
              (sery) => sery.name
            );
            state.xAxis.data = res.data.xAxis;
            const xNumList = res.data.series.filter(item=>{
              return item.fieldName == xkey
            })[0]?.valueList
            const yNumList = res.data.series.filter(item=>{
              return item.fieldName == ykey
            })[0]?.valueList
            const arr = []
            configList.forEach(item=>{
              let obj = {
                name:item.name,
                valueList:[],
              }
              xNumList.forEach((num,index)=>{
                const scope = {x:num,y:yNumList[index]}
                const results = evaluate(item.expression,scope)
                obj.valueList.push(format(results, { notation: 'fixed', precision: 2 }))
              })
              arr.push(obj)
            })
            compileData(arr);
          });
        }
        else {
          const req1 = http.post("/api/Analysis/SingleIndicatorsAnalysis",{...param,pointNum:xdata},true)
          const req2 = http.post("/api/Analysis/SingleIndicatorsAnalysis",{...param,pointNum:ydata},true)
          Promise.all([req1, req2]).then(([res1, res2])=>{
            state.chartParam.legendData = configList.map(
                (sery) => sery.name
              );
            state.xAxis.data = res1.data.xAxis;
            const xNumList = res1.data.series.filter(item=>{
              return item.fieldName == xkey
            })[0]?.valueList
            const yNumList = res2.data.series.filter(item=>{
              return item.fieldName == ykey
            })[0]?.valueList
            const arr = []
            configList.forEach(item=>{
              let obj = {
                name:item.name,
                valueList:[],
              }
              xNumList.forEach((num,index)=>{
                const scope = {x:num,y:yNumList[index]}
                const results = evaluate(item.expression,scope)
                obj.valueList.push(format(results, { notation: 'fixed', precision: 2 }))
              })
              arr.push(obj)
            })
            compileData(arr);
          })
        }
      }
      catch(err){
          console.log(err)
      }
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

<style scoped lang="scss">
.chartspeed{
  width: 100%;
  height: 50%;
  padding:0 32px 32px;
}
</style>
