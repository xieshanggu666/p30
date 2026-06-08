<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance"
import resize from '@/views/gis/mixin/resize'
// import { DASpageMonitorData } from "@/api/page/gis/detail"

export default {
    watch: {
        getParam() {
            this.pageInit()
        }
    },
    mixins: [resize],
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
            chart: null,
            series: [],
            chartData: {},
            chartParam: {
                legendData: ["裂缝"],
                colorArr: [[73, 201, 254], [131, 104, 221], [55, 230, 252], [59, 152, 239], [196, 235, 173], [150, 222, 232], [107, 230, 193], [160, 167, 230]]
            }
        }
    },
    mounted() {
        this.pageInit();
    },
    beforeDestroy() {
        this.clearChart();
    },
    methods: {
        initChart() {
            const chart = echarts.init(document.getElementById(this.id))
            chart.setOption({
                title: {
                    top: 20,
                    text: `共计数据${this.chartData.total}条`,
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 16,
                        color: '#F1F1F3'
                    },
                    left: '1%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
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
                grid: {
                    top: 100,
                    left: '2%',
                    right: '2%',
                    bottom: '2%',
                    containLabel: true
                },
                dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
                xAxis: [{
                    type: 'time',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    name: '角度/°',
                    axisTick: {
                        show: false
                    },
                    min:'dataMin',
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14
                        }
                    },


                }],
                series: this.series
            })
        },
        compileData() {
            let rootData = this.chartData.pageList;
            for (let index in this.chartParam.legendData) {
                let legend = this.chartParam.legendData[index];
                let data = rootData.map(item => [item.createGmt, item[this.CompilechartsData(legend)]]);
                let singlelineConfig;
                singlelineConfig = {
                    name: legend,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    data
                }

                enhanceSeriesItem(singlelineConfig, this.chartParam.colorArr[index]);
          this.series.push(singlelineConfig);
            }

            this.initChart()

        },
        CompilechartsData(value) {
            switch (value) {
                case "裂缝":
                    return "v1";
                default:
                    break;
            }
        }
        ,
        pageInit() {
            this.clearChart();
            DASpageMonitorData(this.getParam).then(res => {
                console.log(res, 'res');
                this.chartData = res;
                this.compileData();
            })
        },
        clearChart() {
            this.series = [];

            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        }
    }
}
</script>
