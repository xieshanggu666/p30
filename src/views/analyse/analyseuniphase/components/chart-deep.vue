<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: '630px', width: '480px' }"
  />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, reactive, onUnmounted } from "vue";
import http from "@/api/http.js";
import { max } from "moment";
import { defineEmits } from "vue";
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'
let currentOffset = 50; // 初始偏移量（50 → -50~50）
let chart;

const emits = defineEmits(['setDeepList','getkongshen'])
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
    default: "460px",
  },
  height: {
    type: String,
    default: "280px",
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
  xValues: [],
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

function initChart() {
  chart = echarts.init(document.getElementById(props.id));
  let option = {
    title: {
      text: "深部位移A向",
      top: 0,
      textStyle: {
        fontWeight: "normal",
        fontSize: 16,
        color: "#999999",
      },
      left: "1%",
    },
    tooltip: {
      trigger: "item",
      formatter: function(params) {
        var res = `
                  <div>
                    <div
                      style='display: inline-block;
                      width:  10px;
                      height: 20px;
                      color: ${params.color}'
                      >●</div>
                    <span>时间：${params.seriesName}</span>
                  </div>
                  <div>
                    <div
                      style='display: inline-block;
                      width: 10px;
                      height: 20px;
                      color: ${params.color}'
                    >●</div>
                    <span>累计偏移：${params.data[0]}(mm)</span>
                  </div>
                  <div>
                    <div
                      style='display: inline-block;
                      width: 10px;
                      height: 20px;
                      color: ${params.color}'
                    >●</div>
                    <span>孔深：${params.data[1]}(m)</span>
                  </div>
                `;
        return params.name + res;
      },
    },
    legend: {
      show: props.getParam.typeText == 'shenbu' ? false: true,
      orient: 'vertical',
      right: 'right',
      top: 100,
      // right:-50,
      icon: "rect",
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      type: 'scroll',
      width: '100%',
      right: "1%",
      textStyle: {
        fontSize: 12,
        color: "#999999",
      },
    },
    xAxis: {
      show: true,
      name: "孔深（m）",
      // position: "bottom",
      offset: 0,
      type: "value",
      nameLocation: "middle",
       nameTextStyle: {
        padding: [30, 50, -560, 50],
      },
      inverse: true,
      position: "top",
      min: -50,
      max:50,
      splitNumber:20,
      // inverse:true,
	//  min: function(value) {
  //          return Math.ceil(value.max)*-1 ;
  //        },
  //         max: function(value) {
  //          return Math.ceil(value.max)+2
  //           ;
  //        },
	    interval: 20,
    },
    grid: {
      top: 65,
      left: "13%",
      right: "52%",
      bottom: "3%",
      containLabel: true,
    },
    yAxis: {
      name: "累计偏移（mm） ",
      nameLocation: "start",
      axisLabel: {
            // 设置刻度值显示位置
            position: 'outside' // 设置为 'inside' 可将刻度值放置到上方
        },
      inverse: true,
      show: true,
      position: "top",
      offset: 0,
      type: "value",
      nameTextStyle: {
        padding: [10, 50, 10, 5],
      },
     
    },
    series: state.series,
    toolbox: getZoomToolbox(),
    dataZoom: getZoomDataZoom(),
  };
  chart.setOption(option);
  chart.on('dataZoom', (params) => {
    if(params.batch instanceof Array) {  
      const { start, end } = params.batch[0];
      const scaleRatio = (end - start) / 100;
      currentOffset = 50 * scaleRatio;
      chart.setOption({
        xAxis: {
          min: -currentOffset,
          max: currentOffset
        },
        dataZoom: [{
          start: 50 - (currentOffset / 50 * 50), 
          end: 50 + (currentOffset / 50 * 50) 
        }]
      });
    }
  });
  if(props.getParam.typeText == 'shenbu'){
    chart.on('click', (params) => {
      if (params.seriesIndex !== undefined && params.dataIndex !== undefined) {
        const seriesData = params.data;
        const offset = seriesData[0];
        const depth = seriesData[1];
        emits('getkongshen', depth)
      }
    });
  }
}

function pageInit() {
  clearChart();
  const param = JSON.parse(JSON.stringify(props.getParam));
  http
    .post("/api/Analysis/DeepDisplacementAnalysis", param, true)
    .then((res) => {
      state.chartParam.legendData = res.data.timeData.map((sery) => sery.time);
      state.xAxis.data = res.data.timeData.map((sery) => sery.data);
      for (let index in res.data.timeData) {
        let legend = res.data.timeData[index].time;
        let singlelineConfig = {
          name: legend,
          type: "line",
          data: res.data.timeData[index].data.map((item) => [item.x, item.d]),
        };
        enhanceSeriesItem(singlelineConfig);
        state.series.push(singlelineConfig);
      }
      // 获取孔深列表
      emits('setDeepList',res.data.datatype)
      // res.data.timeData.forEach(item => {
      //   item.data.sort((a, b) => b.x - a.x);
      // });
      // console.log("res.data.timeData2",res.data.timeData);

      // res.data.timeData.bottom
      
      // res.data.initValue.map(
      //   (sery) => sery.y
      // );
      initChart();
    

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
