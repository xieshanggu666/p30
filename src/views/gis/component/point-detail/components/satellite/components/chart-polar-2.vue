<template>
    <div :id="id" :class="className" :style="chartStyle" />
</template>
  
<script>
import * as echarts from 'echarts';
import resize from '@/views/gis/mixin/resize';
import plotBackgroundImage from "@/assets/gis/detail/plotBackgroundImage_change.png";
// import { DASgsvInitDataByDevId, DASfindPositionDiscrete, DASgsvDataSatelliteDistribution } from "@/api/page/gis/detail"
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
        },
    },
    data() {
        return {
            currentSeries: {},
            chart: null,
            chartStyle: { height: this.height, width: this.width, background: `url(${plotBackgroundImage}) no-repeat center`, backgroundSize: `${this.width} ${this.width}` },
            color: ['#97dee8', '#c4ebad', '#3b98ef', '#6be6c1', '#8368dd', '#a0a7e6', '#49c9fe']
        }
    },
    mounted() {
        this.pageInit();
    },
    beforeUnmount() {
        this.clearChart()
    },
    methods: {
        initChart() {
            const chart = echarts.init(document.getElementById(this.id))
            // prettier-ignore
            const hours = [
                '12a', '1a', '2a', '3a', '4a', '5a', '6a',
                '7a', '8a', '9a', '10a', '11a',
                '12p', '1p', '2p', '3p', '4p', '5p',
                '6p', '7p', '8p', '9p', '10p', '11p'
            ];
            // prettier-ignore
            // prettier-ignore
            const data = [

            ];
            const option = {
                color: this.color,
                legend: {
                    data: ['当前', '原始'],
                    left: 'center',
                    bottom: 0,
                    textStyle: {
                        color: "#ffffff"
                    }
                },
                title: {
                    top: 20,
                    text: '坐标离散图',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 16,
                        color: '#ffffff'
                    },
                    left: 'center'
                },
                // title: {
                //     text: 'Punch Card of Github'
                // },
                polar: {},
                tooltip: {
                    formatter: function (params) {
                        return (
                            `${params.value[2]}
                           commits in
                           ${hours[params.value[1]]}
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
                    min: 'dataMin',
                    max: 'dataMax',

                },
                radiusAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        rotate: 45
                    },
                    inverse: true,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLine: {
                        lineStyle: {
                            color: "#fff"
                        }
                    }
                },
                series: [
                    {
                        name: '原始',
                        type: 'scatter',
                        coordinateSystem: 'polar',
                        symbolSize: function (val) {
                            return val[2] * 2;
                        },
                        data: data,
                        animationDelay: function (idx) {
                            return idx * 50;
                        }
                    }, {
                        name: '当前',
                        type: 'scatter',
                        coordinateSystem: 'polar',
                        symbolSize: function (val) {
                            return val[2] * 2;
                        },
                        data: data,
                        animationDelay: function (idx) {
                            return idx * 50;
                        }
                    }, {
                        name: '时间点',
                        type: 'scatter',
                        coordinateSystem: 'polar',
                        symbolSize: function (val) {
                            return val[2] * 2;
                        },
                        data: data,
                        animationDelay: function (idx) {
                            return idx * 50;
                        }
                    }
                ]
            };
            chart.setOption(
                option
            )
        },
        pageInit() {
            this.clearChart()
            if (this.getParam) {
                DASfindPositionDiscrete({
                    devId: this.getParam.deviceNo,
                    unitVal: 'METER'
                }).then(res => {
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
        }


    }
}
</script>
  