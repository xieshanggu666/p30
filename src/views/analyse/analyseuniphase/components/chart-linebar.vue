<template>
  <div :id="id" :class="className"  />
</template>

<script>
let myCharts = null;
import * as echarts from "echarts";
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'
export default {
  watch: {
    getParam() {
      this.pageInit();
    },
  },
  props: {
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
      default: "chartlinebar",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "600px",
    },
  },
  data() {
    return {
      xAxisdata: [],
      valueListY: [],
      valueListX: [],
      series: [],
      chartParam: {
        legendData: [],
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
    };
  },
  mounted() {
    this.pageInit();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    this.clearChart();
    window.removeEventListener("resize", this.handleResize);
    myCharts && myCharts.dispose();
  },
  methods: {
     handleResize() {
      myCharts && myCharts.resize();
    },
    initChart() {
      let chart = echarts.init(document.getElementById(this.id));
      myCharts=chart;
      const option = {
        title: {
          top: 20,
          text: ``,
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#999999",
          },
          left: "1%",
        },
        tooltip: {
          top: 20,
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        grid: {
          top: 50,
          bottom:30,
          left:80,
          right:80
        },
        toolbox: {},
        legend: {
          top: 0,
          data: this.chartParam.legendData,
        },
        xAxis: [
          {
            type: "category",
            data: this.xAxisdata,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: this.chartParam.legendData[0],
            axisLine: {
              show: true,
              color: "#5470C6",
            },
            axisLabel: {
              formatter: "{value} mm",
            },
        //     max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
            minInterval: 1,
          },
          {
            type: "value",
            name: this.chartParam.legendData[1],
        //     max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
            minInterval: 1,
            axisLabel: {
              formatter: "{value} mm",
            },
          },
        ],
        dataZoom: getZoomDataZoom(),
        toolbox: getZoomToolbox(),
        series: this.series,
      };
      chart.setOption(option);
    },
    compileData(data) {
      for (let index in this.chartParam.legendData) {
        let legend = this.chartParam.legendData[index];
        if (index == 0) {
          let singlelineConfig = {
            name: legend,
            type: "bar",
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function(value) {
                return value + " mm";
              },
            },
            itemStyle: {
              normal: {
                color: "#60c5f1",
              },
            },
            data: data[index].valueList,
          };
          enhanceSeriesItem(singlelineConfig);
          this.series.push(singlelineConfig);
        } else {
          let singlelineConfig1 = {
            name: legend,
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + " mm";
              },
            },
            data: data[index].valueList,
            itemStyle: {
              normal: {
                color: `rgb(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]})`,
                borderColor: `rgba(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]},0.27)`,
                borderWidth: 12,
              },
            },
          };
          enhanceSeriesItem(singlelineConfig1, this.chartParam.colorArr[index]);
          this.series.push(singlelineConfig1);
        }
      }
      this.initChart();
    },

    pageInit() {
      this.clearChart();
      const param = JSON.parse(JSON.stringify(this.getParam));
      this.http
        .post("/api/Analysis/SingleIndicatorsAnalysis", param, true)
        .then((res) => {
          this.chartParam.legendData = res.data.series.map(
            (sery) => sery.displayName
          );
          this.xAxisdata = res.data.xAxis;
          this.compileData(res.data.series);
          this.initChart();
        });
    },
    clearChart() {
      let chart = echarts.init(document.getElementById(this.id));
      this.series = [];
      if (!chart) {
        return;
      }
      chart.dispose();
      chart = null;
    },
  },
};
</script>

<style scoped lang="scss">
.chart{
  width: 100%;
  height: 100%;
  padding:0 32px 32px;
}
</style>
