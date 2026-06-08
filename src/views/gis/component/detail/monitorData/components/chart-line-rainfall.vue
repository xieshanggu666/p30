<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
  
<script>
import * as echarts from 'echarts'
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
                legendData: ['分时增量(mm)', '累计雨量(mm)', '摇摆次数', '累计摇摆次数'],
                barArr: ['分时增量(mm)', '摇摆次数'],
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
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: 'inside',
                        xAxisIndex: [0],
                        filterMode: 'filter'
                    }
                ],
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
                    name: '累计摇摆次数',
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
                }, {
                    type: 'value',
                    name: '分时增量(mm)',
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
                series: this.series
            })
        },
        compileData() {
            let rootData = this.chartData.pageList;
            for (let index in this.chartParam.legendData) {
                let legend = this.chartParam.legendData[index];
                let data = rootData.map(item => [item.createGmt, item[this.CompilechartsData(legend)]]);
                let singlelineConfig;
                if (this.chartParam.barArr.includes(legend)) {
                    let color = parseInt(this.chartParam.colorArr.length * Math.random())
                    singlelineConfig = {
                        name: legend,
                        type: 'bar',
                        showBackground: false,
                        yAxisIndex: index > 1 ? 0 : 1,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: `rgba(${this.chartParam.colorArr[color][0]},${this.chartParam.colorArr[color][1]}, ${this.chartParam.colorArr[color][2]})` },
                                { offset: 1, color: `rgba(${this.chartParam.colorArr[color][0]},${this.chartParam.colorArr[color][1]}, ${this.chartParam.colorArr[color][2]})` }
                            ])
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: `rgba(${this.chartParam.colorArr[color][0]},${this.chartParam.colorArr[color][1]}, ${this.chartParam.colorArr[color][2]})` },
                                    { offset: 0.4, color: `rgba(${this.chartParam.colorArr[color][0]},${this.chartParam.colorArr[color][1]}, ${this.chartParam.colorArr[color][2]})` },
                                    { offset: 1, color: '#83bff6' }
                                ])
                            }
                        },
                        data
                    }

                } else {
                    singlelineConfig = {
                        name: legend,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        yAxisIndex: index > 1 ? 0 : 1,
                        lineStyle: {
                            normal: {
                                width: 2
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: `rgba(${this.chartParam.colorArr[index][0]}, ${this.chartParam.colorArr[index][1]}, ${this.chartParam.colorArr[index][2]}, 0.3)`
                                }, {
                                    offset: 0.8,
                                    color: `rgba(${this.chartParam.colorArr[index][0]}, ${this.chartParam.colorArr[index][1]}, ${this.chartParam.colorArr[index][2]}, 0)`
                                }], false),
                                shadowColor: `rgba(${this.chartParam.colorArr[index][0]}, ${this.chartParam.colorArr[index][1]}, ${this.chartParam.colorArr[index][2]}, 0.1)`,
                                shadowBlur: 10
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: `rgb(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]})`,
                                borderColor: `rgba(${this.chartParam.colorArr[index][0]},${this.chartParam.colorArr[index][1]},${this.chartParam.colorArr[index][2]},0.27)`,
                                borderWidth: 12
                            }
                        },
                        data
                    }
                }

                this.series.push(singlelineConfig);
            }

            this.initChart()

        },
        CompilechartsData(value) {
            switch (value) {
                case "摇摆次数":
                    return "v1";
                case "累计摇摆次数":
                    return "v2";
                case "分时增量(mm)":
                    return "v3";
                case "累计雨量(mm)":
                    return "v5";
                default:
                    break;
            }
        }
        ,
        pageInit() {
            this.clearChart();
            DASpageMonitorData(this.getParam).then(res => {
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
  