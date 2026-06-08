<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance"
import resize from '@/views/gis/mixin/resize'

export default {
    mixins: [resize],
    computed: {
        seriesData() {
            const valueArr = [0.627, 0.015, 0.017]
            const result = [];
            for (let item of valueArr) {
                const itemArr = [];
                for (let i = 0; i < 12; i++) {
                    let newValue = item + (item / 4 * Math.random()) - (item / 4 * Math.random());
                    itemArr.push(newValue);
                }
                result.push(itemArr);
            }
            return result;
        }
    },
    props: {
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
            default: '400px'
        }
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        this.initChart()
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            const chart = echarts.init(document.getElementById(this.id))

            chart.setOption({
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
                    itemwidth: 34,
                    itemHeight: 5,
                    itemGap: 13,
                    data: ['溶解氧', '高锰酸盐指数', '氨氮'],
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
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                    data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
                }],
                yAxis: [{
                    type: 'value',
                    name: '溶解氧',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                }],
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
                series: [{
                    name: '溶解氧',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    showSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(137, 189, 27, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(137, 189, 27, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(137,189,27)',
                            borderColor: 'rgba(137,189,2,0.27)',
                            borderwidth: 32

                        }
                    },
                    data: this.seriesData[0]
                }, {
                    name: '高锰酸盐指数',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    showSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    data: this.seriesData[1]
                }, {
                    name: '氨氮',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    showSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(219, 50, 51, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(219, 50, 51, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(219,50,51)',
                            borderColor: 'rgba(219,50,51,0.2)',
                            borderwidth: 32
                        }
                    },
                    data: this.seriesData[2]
                }]
            })
        }
    }
}
</script>
