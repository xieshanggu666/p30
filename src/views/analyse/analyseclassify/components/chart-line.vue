<template>
  <div class="eqos">
    <div class="usit"><i class="el-icon-warning-outline ml12"></i>提示：{{titles}}  </div>
    <div :id="id" :class="className"  />
  </div>
 
</template>

<script>
import * as echarts from "echarts"
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance";
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
      default: "650px",
    },
  },
  data() {
    return {
      titles:'',
      chart:null,
      xAxisdata: [],
      valueListY: [],
      valueListX: [],
      series: [],
      chartParam: {
        legendData: [],
        colorArr: [
          [255,0,0],
          [255,140,0],
          [255,255,0],
          [0,128,0],
          [0,255,255],
          [128,0,128],
          [0,0,255],
          [165,4,4],
        ],
      },
    };
  },
  mounted() {
    this.pageInit();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    this.clearChart();
  },
  methods: {
    handleResize() {
      this.chart &&  this.chart.resize();
    },
    initChart(AnalysisMsg, fillRGBA) {
      let chart= echarts.init(document.getElementById(this.id));
      this.chart=chart;
      const option = {
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
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },

        // graphic: [
        //   {
        //     type: "group",
        //     left: "100",
        //     top: "20%",
        //     children: [
        //       {
        //         type: "rect",
        //         z: 100,
        //         left: "center",
        //         top: "middle",
        //         shape: {
        //           width: 380,
        //           height: 120,
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
        toolbox: {},
        grid: {
          top: 120,
          left: "0%",
          right: "0%",
          bottom: "2%",
          containLabel: true,
        },
        legend: {
          top: 30,
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
            name: "雨量(mm)",
            axisLabel: {
              formatter: "{value}mm",
            },
            axisLine: {
              show: false,
              color: "#5470C6",
            },
            // min: function (value) {
            //   return Math.ceil(value.min) * 2;
            // },
            max: function(value) {
              return Math.ceil(value.max) * 3;
            },
          },
          {
            type: "value",
            name: "位移(mm)",
            axisLabel: {
              formatter: "{value}mm",
            },
            axisLine: {
              show: false,
              color: "#5470C6",
            },
            minInterval: 1,
            max: function(value) {
              return Math.ceil(value.max) * 3;
            },
        //     max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
          },
        ],
        dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
        series: this.series,
      };
      chart.setOption(option);
      chart.on("click", function(param) {
        console.log(param);
      });
    },
    compileData(data, AnalysisMsg, fillRGBA) {
      for (let index in this.chartParam.legendData) {
        let legend = this.chartParam.legendData[index];

        if (legend.indexOf("雨量") > -1) {
          let singlelineConfig = {
            name: legend,
            type: "bar",
            tooltip: {
              valueFormatter: function(value) {
                return value + "mm";
              },
            },
            itemStyle: {},
            data: data[index].valueList,
          };
          enhanceSeriesItem(singlelineConfig, this.chartParam.colorArr[index]);
          this.series.push(singlelineConfig);
        } else {
          let singlelineConfig1 = {
            name: legend,
            type: "line",
            symbol: "circle",   //设定为实心点
            symbolSize: 5,   //设定实心点的大小
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + "mm";
              },
            },
            data: data[index].valueList,
            // itemStyle: {
            //   normal: {
            //     color: `rgb(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]})`,
            //     borderColor: `rgba(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]},0.27)`,
            //     borderWidth: 12,
            //   },
            // },
          };
          enhanceSeriesItem(singlelineConfig1, this.chartParam.colorArr[index]);
          this.series.push(singlelineConfig1);
        }
      }

      this.initChart(AnalysisMsg, fillRGBA);
    },

    pageInit() {
      this.clearChart();
      const param = JSON.parse(JSON.stringify(this.getParam));
      this.http
        .post("/api/Analysis/MultiIndicatorsAnalysis", param, true)
        .then((res) => {
          this.chartParam.legendData = res.data.series.map(
            (sery) => sery.displayName
          );
          console.log("let legend", this.chartParam.legendData);

          if (param.timeType == "0") {
            //小时统计
            for (let index in res.data.xAxis) {
              res.data.xAxis[index] =
                res.data.xAxis[index].substring(0, 13) + "时";
            }
          }
          if (param.timeType == "1") {
            //天统计
            for (let index in res.data.xAxis) {
              res.data.xAxis[index] = res.data.xAxis[index].substring(0, 10);
            }
          }
          if (param.timeType == "2") {
            //约统计
            for (let index in res.data.xAxis) {
              res.data.xAxis[index] = res.data.xAxis[index].substring(0, 7);
            }
          }
          this.xAxisdata = res.data.xAxis;
          this.titles= res.data.dataAnalysisStr;
          this.compileData(res.data.series, res.data.dataAnalysisStr);
          var fillRGBA = "";
          console.log(res.data.dataAnalysisNeep);
          if (res.data.dataAnalysisNeep == "0") {
            fillRGBA = "rgba(64,158,255,0.6)";
          } else if (res.data.dataAnalysisNeep == "1") {
            fillRGBA = "rgba(255,211,8,0.6)";
          } else {
            fillRGBA = "rgba(255,24,6,0.6)";
          }
          this.initChart(res.data.dataAnalysisStr, fillRGBA);
        });
    },
    clearChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.series = [];
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
  },
};
</script>
<style scoped lang="scss">
.ml12{
  margin-right: 8px;
  font-size: 20px;
  font-weight: bold;
}
.eqos{
  width: 100%;
  height: 100%;
  .usit{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #FFFAF4;
    font-weight: 500;
    font-size: 14px;
    font-weight: bold;
    color: #FF9D34;
    padding-left: 12px;
    display: flex;
    align-items: center;
  }
}
.chart{
  width: 100%;
  height: calc(100% - 40px);
  padding:0 32px 32px;
}
</style>