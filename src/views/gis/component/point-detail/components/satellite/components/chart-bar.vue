<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
  
<script>
import * as echarts from 'echarts'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance"
// import { DASpageMonitorData } from "@/api/page/gis/detail"
import { tsImportEqualsDeclaration } from '@babel/types';

export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        id: {
            type: String,
            default: 'chart'
        },
        title: {
            type: String,
            default: ""
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
            dataAxis: [],
            chartData: {},
            titleObj: {}
        }
    },
    beforeDestroy() {
        this.clearChart();
    },
    methods: {
        initChart() {
            const chart = echarts.init(document.getElementById(this.id));
            let yMax = 500;
            let dataShadow = [];
            for (let i = 0; i < this.dataAxis.length; i++) {
                dataShadow.push(yMax);
            }
            chart.setOption({
                title: {
                    text: this.title,
                    left: "center",
                    top: 10,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 14
                    },
                },
                legend: {
                    data: ["参与解算", "未参与解算"],
                    icon: 'circle',
                    bottom: 0,
                    left: "center",
                    textStyle: {
                        color: "#ffffff"
                    }
                },
                xAxis: {
                    data: this.dataAxis,
                    axisLabel: {
                        inside: true,
                        color: '#fff'
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    min:'dataMin',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999'
                    }
                },
                dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),,
                series: this.series
            })

            const zoomSize = 3;
            this.chart.on('click', (params) => {
                console.log(parseInt(this.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]));
                this.chart.dispatchAction({
                    type: 'dataZoom',
                    startValue: this.dataAxis[parseInt(Math.max(params.dataIndex - zoomSize / 2, 0))],
                    endValue:
                        this.dataAxis[parseInt(Math.min(params.dataIndex + zoomSize / 2, this.dataAxis.length - 1))]
                });
            });


        },
        pageInit(data) {
            this.clearChart();
            for (let index in data[0]) {
                this.dataAxis.push(index);
            }

            for (let [index, item] of data.entries()) {
                let seriesData = [];
                for (let itemIndex in item) {
                    seriesData.push(item[itemIndex]);
                }

                let styleArr = [{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#2378f7' },
                        { offset: 0.5, color: '#2378f7' },
                        { offset: 1, color: '#83bff6' }
                    ])
                }, {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#FB3765' },
                        { offset: 0.5, color: '#FA9FAE' },
                        { offset: 1, color: '#FA9FAE' }
                    ])
                },]
                let seriesAtom = {
                    type: 'bar',
                    name: index ? "未参与解算" : "参与解算",
                    showBackground: false,
                    itemStyle: styleArr[index],
                    emphasis: {
                        focus: "self",
                    },
                    data: seriesData
                }
                this.series.push(seriesAtom)
            }

            this.initChart();
        },
        clearChart() {
            this.series = [];
            this.dataAxis = [];
            this.chartData = {};
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        }
    }
}
</script>
  