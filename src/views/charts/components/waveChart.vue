<template>
    <div
      :id="id"
      class="wiauto"
    />
  </template>
  
  <script setup>
  import * as echarts from "echarts"
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance";
  import { watch, reactive, onUnmounted ,onMounted} from "vue";
  import http from "@/api/http.js";
  let myChart = null;
  let chart;
  const props = defineProps({
    getParam: {
      type: Object,
      default: {},
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "400px",
    },
    height: {
      type: String,
      default: "260px",
    },
  });
  watch(
    () => props.getParam,
    () => {
      pageInit();
    }
  );
  const chartParam = {
    colorArr: [
      [81, 225, 251],
      [243, 193, 61],
      [255, 125, 47],
      [255, 0, 0],
      [131, 104, 221],
      [73, 201, 254],
      [59, 152, 239],
      [150, 222, 232],
      [160, 167, 230],
    ],
  };
  const state = reactive({
    series: [],
    chartData: {},
    chartParam: {
      legendData: "",
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
  window.addEventListener("resize", handleResize);
  onUnmounted(() => {
    clearChart();
    window.removeEventListener("resize", handleResize);
    myChart && myChart.dispose();
  });
  //跟随屏幕缩放
  function handleResize() {
    myChart && myChart.resize();
  }
  function initChart() {
    chart = echarts.init(document.getElementById(props.id));
    myChart =chart;
    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "red",
          },
        },
      },
      legend: {
        top: 10,
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
        right: "2%",
        textStyle: {
          fontSize: 14,
          color: "#fff",
        },
      },
      grid: {
        top: 50,
        left: "1%",
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
              color: "rgba(181, 214, 255, .15)",
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {color: "#fff"},
          },  
          data: state.xAxis.data,
        },
      ],
      yAxis: [
        {
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
          minInterval: 1,
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#fff",
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
              color: "rgba(181, 214, 255, .15)",
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
      console.log("legend", legend);
      // let data = chartData.map(item => [item.alarmDate, item[filter.FieldName]]);
      let datas = data[index];
      const alarmCounts = datas.map((item) => [item.alarmDate, item.alarmCount]);
  
      let singlelineConfig = {
        name: legend,
        type: "line",
        smooth: true,
        symbol: "circle",
        barWidth: 34,
        symbolSize: 8,
        showSymbol: false,
        lineStyle: {
          color: "#ab3fcc",
          normal: {
            width: 2,
          },
        },
        coordinateSystem: "cartesian2d",
        ffect: {
          show: true,
          smooth: true,
          period: 6,
          symbolSize: 4,
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 1)`,
                },
                {
                  offset: 0.8,
                  color: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 0.2)`,
                },
              ],
              false
            ),
            shadowColor: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 0.1)`,
            shadowBlur: 10,
          },
        },
        itemStyle: {
          normal: {
            color: `rgb(${chartParam.colorArr[index][0]},${chartParam.colorArr[index][1]},${chartParam.colorArr[index][2]})`,
            borderColor: `rgba(${chartParam.colorArr[index][0]},${chartParam.colorArr[index][1]},${chartParam.colorArr[index][2]},0.27)`,
            borderWidth: 12,
          },
        },
  
        data: alarmCounts,
      };
      enhanceSeriesItem(singlelineConfig, state.chartParam.colorArr[index]);
    state.series.push(singlelineConfig);
    }
    initChart();
  }
  function pageInit() {
    clearChart();
    http.get("/api/BigScreen/GeAlarmStatistics", {}, true).then((res) => {
      state.xAxis.data = res.data.map((sery) => sery.alarmDate);
      state.data = res.data.map((sery) => sery.alarmCount);
      const alarmLevels = ["level1", "level2", "level3", "level4"].map(
        (level) => {
          return [];
        }
      );
      res.data.forEach((item) => {
        const levelIndex = item.alarmLevel - 1;
        alarmLevels[levelIndex].push(item);
      });
      state.data = alarmLevels;
      console.log("res.data", res.data);
  
      // 获取今天日期
      let today = new Date();
      let currentDateString = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`; // 注意月份从0开始计数
  
      // 减去一个月
      today.setMonth(today.getMonth() - 1); // 减一是因为减去的是月份，不是天数
      let oneMonthAgoDateString = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  
      console.log("今天日期:", currentDateString);
      console.log("一个月前日期:", oneMonthAgoDateString);
  
      let Level1 = state.data[0];
      let Level2 = state.data[1];
      let Level3 = state.data[2];
      let Level4 = state.data[3];
  
      // 调用函数
      const filledData1 = fillMissingDates(
        Level1,
        oneMonthAgoDateString,
        currentDateString,
        "蓝色预警"
      );
      const filledData2 = fillMissingDates(
        Level2,
        oneMonthAgoDateString,
        currentDateString,
        "黄色预警"
      );
      const filledData3 = fillMissingDates(
        Level3,
        oneMonthAgoDateString,
        currentDateString,
        "橙色预警"
      );
      const filledData4 = fillMissingDates(
        Level4,
        oneMonthAgoDateString,
        currentDateString,
        "红色预警"
      );
  
      const mergedArray = [filledData1, filledData2, filledData3, filledData4];
      let legendData = res.data;
      // state.chartParam.legendData = [
      //   ...new Set(legendData.map((item) => item.alarmLevelName)),
      // ];
      state.chartParam.legendData = [
        "蓝色预警",
        "黄色预警",
        "橙色预警",
        "红色预警",
      ];
      compileData(mergedArray);
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
  function fillMissingDates(data, startDate, endDate, obj) {
    const result = [];
    const dateArray = [];
  
    // 将输入数据按照日期排序
    data.sort((a, b) => new Date(a.alarmDate) - new Date(b.alarmDate));
  
    // 创建从开始到结束的所有日期对象
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // 遍历所有日期，如果存在添加老数据，不存在则创建新的
    if (obj === "蓝色预警") {
      dateArray.forEach((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingEntry = data.find((item) => item.alarmDate === dateString);
  
        if (existingEntry) {
          result.push(existingEntry);
        } else {
          result.push({
            alarmDate: dateString,
            alarmCount: 0,
            alarmLevel: 1,
            alarmLevelName: "蓝色预警",
          });
        }
      });
    } else if ((obj = "黄色预警")) {
      dateArray.forEach((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingEntry = data.find((item) => item.alarmDate === dateString);
  
        if (existingEntry) {
          result.push(existingEntry);
        } else {
          result.push({
            alarmDate: dateString,
            alarmCount: 0,
            alarmLevel: 1,
            alarmLevelName: "黄色预警",
          });
        }
      });
    } else if ((obj = "橙色预警")) {
      dateArray.forEach((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingEntry = data.find((item) => item.alarmDate === dateString);
  
        if (existingEntry) {
          result.push(existingEntry);
        } else {
          result.push({
            alarmDate: dateString,
            alarmCount: 0,
            alarmLevel: 1,
            alarmLevelName: "橙色预警",
          });
        }
      });
    } else if ((obj = "红色预警")) {
      dateArray.forEach((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingEntry = data.find((item) => item.alarmDate === dateString);
  
        if (existingEntry) {
          result.push(existingEntry);
        } else {
          result.push({
            alarmDate: dateString,
            alarmCount: 0,
            alarmLevel: 1,
            alarmLevelName: "红色预警",
          });
        }
      });
    }
  
    return result;
  }
  </script>

<style scoped lang="scss">
.wiauto{
    width: 100%;
    height: 100%;
}
</style>
  