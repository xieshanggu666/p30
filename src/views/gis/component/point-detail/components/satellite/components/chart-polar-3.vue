<template>
    <div :id="id" :class="className" :style="chartStyle" />
</template>
  
<script>
import * as echarts from 'echarts';
import resize from '@/views/gis/mixin/resize';
import plotBackgroundImage from "@/assets/gis/detail/plotBackgroundImage_change.png";
// import { DASgsvDataSatelliteDistribution } from "@/api/page/gis/detail"
export default {
    mixins: [resize],
    watch: {
        getParam() {
            this.pageInit()
        }
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
            default: '314px'
        },
        height: {
            type: String,
            default: '400px'
        }
    },
    data() {
        return {
            currentSeries: [],
            legend: ['北斗卫星', 'GPS卫星', 'Galileo卫星', 'GLONASS卫星'],
            legendData: {
                outputBDSData: '北斗卫星',
                outputGPSData: 'GPS卫星',
                outputGAGSVData: 'Galileo卫星',
                outputGLGSVata: 'GLONASS卫星',
            },
            radiusAxisArr: [{
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    rotate: 45
                },
                inverse: true,
                min: 0,
                max: 90,
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            }],
            chart: null,
            chartStyle: { height: this.height, width: this.width, background: `url(${plotBackgroundImage}) no-repeat center`, backgroundSize: `${this.width} ${this.width}` },
            color: ['#97dee8', '#3b98ef', '#a0a7e6', '#8368dd', '#6be6c1', '#c4ebad', '#49c9fe']
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
            const option = {
                color: this.color,
                legend: {
                    type: 'scroll',
                    data: this.legend,
                    left: 'center',
                    bottom: 0,
                    textStyle: {
                        color: "#ffffff"
                    },
                    pageTextStyle: {
                        color: "#ffffff"
                    },
                    pageIconInactiveColor: "#ffffff"
                },
                title: {
                    top: 20,
                    text: '卫星分布视图',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 16,
                        color: '#ffffff'
                    },
                    left: 'center'
                },
                polar: {},
                tooltip: {
                    formatter: function (params) {
                        return (
                            `<div>
                                信噪比:${params.value[2]} <br/>
                                编号:${params.value[3]} <br/>
                            </div>
                           `
                        );
                    }
                },
                angleAxis: {
                    type: 'value',
                    boundaryGap: false,
                    data: {
                        textStyle: "#ffffff"
                    },
                    interval: 90,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#fff"
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#fff"
                        }
                    },
                    min: 0,
                    max: 360,
                },
                radiusAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate: 45
                    },
                    interval: 30,
                    inverse: true,
                    min: 0,
                    max: 90,
                    axisLine: {
                        lineStyle: {
                            color: "#fff"
                        }
                    }
                },
                series: this.currentSeries
            };
            chart.setOption(
                option
            )
        },
        pageInit() {
            this.clearChart();
            if (this.getParam) {
                DASgsvDataSatelliteDistribution({
                    devId: this.getParam.deviceNo
                }).then(res => {
                    for (let index in res) {
                        let item = res[index];
                        let data = item.map(v => [v.y, v.x, v.noiseRatio, v.prn]);
                        const noiseRatioArr = item.map(v => v.noiseRatio)
                        let minNoiseVal = Math.min(...noiseRatioArr);
                        let seriesItem = {
                            name: this.legendData[index],
                            type: 'scatter',
                            coordinateSystem: 'polar',
                            symbolSize: function (val) {
                                let actionNum = val[2] - minNoiseVal + 10;
                                let result = actionNum > 80 ? 80 : actionNum;
                                return result;
                            },
                            data,
                            animationDelay: function (idx) {
                                return idx * 300;
                            }
                        }
                        this.currentSeries.push(seriesItem);
                    }

                    this.initChart()

                })
            }
        },
        clearChart() {
            this.currentSeries = [];
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        },

    }
}
</script>
  