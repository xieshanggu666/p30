<template>
  <div :id="id" :style="{ height: height, width: width }"></div>
</template>

<script>
// import { DASget3DList } from "@/api/page/gis/detail"
import * as echarts from 'echarts';
import 'echarts-gl'
export default {
  mounted() {
    this.pageInit()
  },
  props: {
    getParam: {
      type: Object,
      default: {}
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '542px'
    }
  },
  data() {
    return {
      chartParam: {
        legendData: [],
      },
      seriesData: [],
      chartData: null
    }
  },
  watch: {
    getParam() {
      this.pageInit()
    }
  },
  methods: {
    pageInit() {
      this.clearChart();
      DASget3DList(this.getParam).then(res => {
        this.chartData = res;
        this.compileData();
      })
    },
    clearChart() {
      this.seriesData = [];
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    compileData() {
      for (let time in this.chartData[0]) {
        for (let seneor in this.chartData[0][time][0]) {
          this.chartParam.legendData.push(seneor);
        }
      }
      console.log(this.chartParam.legendData, 'this.chartParam.legendData');
      for (let legendItem of this.chartParam.legendData) {
        const data = []
        for (let chartItem of this.chartData) {
          for (let time in chartItem) {
            const symbolItem = {
              name: time,
              value: chartItem[time][0][legendItem]
            }
            data.push(symbolItem);
          }
        }
        const seriesItem = {
          type: 'line3D',
          name: legendItem,
          symbolSize: 4.5,
          data
        }
        console.log(seriesItem, 'seriesItem');
        this.seriesData.push(seriesItem);
      }

      this.drewLine()
    },
    drewLine() {
      const chart = echarts.init(document.getElementById(this.id))
      chart.setOption(
        {
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: this.chartParam.legendData,
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },

          grid3D: {},
          xAxis3D: {
            type: 'category',
            min: 'dataMin',
            max: 'dataMax'
          },
          yAxis3D: {
            type: 'category',
            min: 'dataMin',
            max: 'dataMax'
          },
          zAxis3D: {
            type: 'category',
            min: 'dataMin',
            max: 'dataMax'
          },
          series: this.seriesData
        })
      window.addEventListener('resize', function () {
        chart.resize();
      });
    }
  }
}
</script>

<style scoped>
.div {
  background-color: #2c3e50;
}
</style>
