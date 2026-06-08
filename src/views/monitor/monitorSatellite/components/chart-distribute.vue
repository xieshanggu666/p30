<template>
  <div :id="id" :class="className" :style="chartStyle" />
</template>

<script>
import * as echarts from "echarts";
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
      default: "chart",
    },
    width: {
      type: String,
      default: "380px",
    },
    height: {
      type: String,
      default: "400px",
    },
  },
  data() {
    return {
      resdata: {},
      currentSeries: [],
      legend: ["BDS", "GPS", "GLONASS", "Galileo"],
      legendData: {
        gb: "BDS",
        gp: "GPS",
        gl: "GLONASS",
        ga: "Galileo",
      },
      radiusAxisArr: [
        {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            rotate: 45,
          },
          inverse: true,
          min: 0,
          max: 90,
          axisLine: {},
        },
      ],
      chart: null,
      chartStyle: { height: this.height, width: this.width },
      color: [
        "#6be6c1",
        "#3b98ef",
        "#8368dd",
        "#49c9fe",
        "#97dee8",
        "#a0a7e6",
        "#c4ebad",
      ],
    };
  },
  mounted() {
    this.pageInit();
  },
  beforeUnmount() {
    this.clearChart();
  },
  methods: {
    initChart() {
      let chart = echarts.init(document.getElementById(this.id));
      const option = {
        color: this.color,
        legend: {
          type: "scroll",
          data: this.legend,
          left: "center",
          bottom: 0,
        },
        title: {
          top: 0,
          text: "卫星分布视图",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
          },
          left: "center",
        },
        polar: {},
        tooltip: {
          formatter: function(params) {
            return `<div>     
                      卫星名:${params.seriesName} <br/>
                      信噪比:${params.value[2]} <br/>
                      编号:${params.value[3]} <br/>
                    </div>`;
          },
        },
        //极坐标系的角度轴
       angleAxis: {
          type: "value",
          boundaryGap: false,
          interval: 90,
          splitLine: {
            show: true,
          },
          axisLine: {
            show: true,
          },
          axisTick: { //坐标轴刻度设置
            show: false,
          },
          min: 0,
          max: 360,
          
        },
        //极坐标系的径向轴。
        radiusAxis: {
          // type: "value",
          axisLine: {
            show: true,
          },
          axisLabel: {
            rotate: 45,
          },
          interval: 30,
          inverse: true,
          // axisLine: {},
          show: false,
        },
        series: this.currentSeries,
      };
      chart.setOption(option);
    },
    pageInit() {
      this.clearChart();
      if (this.getParam.data) {
        let resdata = this.getParam.data;
        delete resdata.dt;
        for (let index in resdata) {
          let item = resdata[index];
          let data = item.map((v) => [v.height, v.angle, v.snr, v.number]);
          let seriesItem = {
            name: this.legendData[index],
            type: "scatter",
            coordinateSystem: "polar",
            data,
          };
          if (item.length > 1) {
            this.currentSeries.push(seriesItem);
          }
        }
      }
      this.initChart();
    },
    clearChart() {
      let chart = echarts.init(document.getElementById(this.id));
      this.currentSeries = [];
      if (!chart) {
        return;
      }
      chart.dispose();
      chart = null;
    },
  },
};
</script>
