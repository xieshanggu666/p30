<template>
  <div :id="id" :class="className"  />
</template>

<script>
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
    dianValue: {
      type: Boolean,
      default: ()=>{
        return []
      }
    }
  },
  data() {
    return {
      myChart:null,
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
  beforeUnmount() {
    this.clearChart();
  },
  methods: {
    handleResize() {
      this.myChart && this.myChart.resize();
    },
    initChart() {
      let chart = echarts.init(document.getElementById(this.id));
      const option = {
        title: {
          top: '32px',
          text: `数据展示`,
          textStyle: {
            fontWeight: "bold",
            fontSize: 16,
            color: "#333333",
          },
          left: "1%",
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
        toolbox: {},
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
          data: this.chartParam.legendData,
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#999999",
          },
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
            
            axisLabel: {
              formatter: "{value} mm",
            },
        //    max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
            minInterval: 1,
          },
          {
            type: "value",
            name: this.chartParam.legendData[1],
            axisLabel: {
              formatter: "{value} mm",
            },
        //     max: function(value) {
        //   // 以data中最大值+差值的0.2作为y轴最大值，这样会好看点，系数可以按照需要调整
        //   return Math.ceil(value.max + (value.max - value.min) * 0.5);
        // },
            minInterval: 1,
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
        .post("/api/Analysis/SameTypeIndicatorsAnalysis", param, true)
        .then((res) => {
          let arr = res.data.series.map((sery) => sery.pointName)
          this.$emit('getDianList',arr)
          let _chartArr = res.data.series.filter((item) => {
            if(this.dianValue.length == 0) {
              return item
            }
            else {
              return this.dianValue.indexOf(item.pointName)>-1
            }
            
          })
          this.chartParam.legendData = _chartArr.map(
            (sery) => sery.displayName
          );
          this.xAxisdata = res.data.xAxis;
          this.compileData(_chartArr);
          this.initChart();
        });
    },
    clearChart() {
      let chart = echarts.init(document.getElementById(this.id));
      this.myChart=chart;
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
