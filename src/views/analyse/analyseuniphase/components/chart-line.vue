<template>
  <div :id="id" :class="className"  />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted,onMounted,ref } from "vue";
import http from "@/api/http.js";
import { evaluate,format } from 'mathjs'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'
let myCharts = null;
let chart;
const unitshow = ref(true);

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
  grid:{
    top: 50,
    left: "0%",
    right: "0%",
    containLabel: true,
  },
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
      top: 0,
      text: `单相分析`,
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
    grid: state.grid,
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
      },
    ],
    yAxis: [
      {
        // min: function (value) {
        //   return Math.ceil(value.min);
        // },
        // max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 15);
        // },
        minInterval: 1,
        axisLabel: {
          interval: "auto",
          formatter: function(value) {
            // 使用formatter保证即使在缩放时也只显示整数
            return Math.round(value);
          },
        },
        type: "value",
        splitNumber: 5,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          color: "#5470C6",
        },
        axisLabel: {
          margin: 10,
          formatter: unitshow.value?"{value} mm":"{value}",
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

    // graphic: [
    //   {
    //     type: "group",
    //     left: "130",
    //     top: "20%",
    //     children: [
    //       {
    //         type: "rect",
    //         z: 100,
    //         left: "center",
    //         top: "middle",
    //         shape: {
    //           width: 380,
    //           height: 90,
    //         },
    //         style: {
    //           fill: fillRGBA, //'rgba(64,158,255,0.6)'
    //           stroke: "#777",
    //           lineWidth: 0,
    //           shadowBlur: 20,
    //           shadowOffsetX: 3,
    //           shadowOffsetY: 3,
    //           shadowColor: "rgba(0,0,0,0.1)",
    //         },
    //       },
    //       {
    //         type: "text",
    //         z: 100,
    //         left: "center",
    //         top: "middle",
    //         style: {
    //           fill: "#fff",
    //           width: 360,
    //           overflow: "break",
    //           text: AnalysisMsg,
    //           font: "14px Microsoft YaHei",
    //         },
    //       },
    //     ],
    //   },
    // ],

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
  // console.log(state.series, "state.series");
  initChart();
}
function pageInit() {
  clearChart();
  const param = JSON.parse(JSON.stringify(props.getParam));
  delete param.options_type_id
  delete param.formula_Config
  // 是否显示Y轴单位
  unitshow.value = true;
  if(param.type && param.type == 'deepDetail') {
    http
    .get("/api/Analysis/GetDeepDisplacementData", param, true)
    .then((res) => {
      console.log(res)
      state.chartParam.legendData = [param.Point_Name+'__A向位移',param.Point_Name+'__B向位移'];
      state.xAxis.data = res.data.map(item=>{
        return item.dt
      });
      const data = [{valueList:[]},{valueList:[]}]
      data[0].valueList = res.data?.map(item=>{
        return item.v1
      }) || []
      data[1].valueList = res.data?.map(item=>{
        return item.v2
      }) || []
      state.grid['height'] = '90%'
      state.grid['width'] = '95%'
      state.grid['left'] = '3%'
      compileData(data, res.data.dataAnalysisStr);
      
    });
  }
  else {
    // 判断是否要显示计算属性值
    if(JSON.stringify(props.getParam.formula_Config) == '{}') {
      http
      .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
      .then((res) => {
        state.chartParam.legendData = res.data.series.map(
          (sery) => sery.displayName
        );
        state.grid['bottom'] = '0%'
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
            state.grid['bottom'] = '0%'
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
            state.grid['bottom'] = '0%'
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
  height: 50%;
  padding:0 32px 32px;
}
</style>
