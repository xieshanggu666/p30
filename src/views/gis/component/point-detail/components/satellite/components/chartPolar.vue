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
        chartIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            currentSeries:{},
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
            legendArr: [['时间点', '原始'], ['当前', '原始'], ['北斗卫星', 'GPS卫星', 'Galileo卫星', 'GLONASS卫星']],
            chartTitle: ['监测点位移视图', '坐标离散图', '卫星分布视图'],
            chart: null,
            chartStyle: { height: this.height, width: this.width, background: `url(${plotBackgroundImage}) no-repeat center`, backgroundSize: `${this.width} ${this.width}` },
            color: ['#97dee8', '#c4ebad', '#3b98ef', '#6be6c1', '#8368dd', '#a0a7e6', '#49c9fe']
        }
    },
    mounted() {
        // this.pageInit();
        this.initChart()
    },
    beforeUnmount() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            console.log(this.getParam, 'getParam');
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
            const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];
            const option = {
                color: this.color,
                legend: {
                    data: this.legendArr[this.chartIndex],
                    left: 'center',
                    bottom: 0,
                    textStyle: {
                        color: "#ffffff"
                    }
                },
                title: {
                    top: 20,
                    text: this.chartTitle[this.chartIndex],
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
            switch (this.chartIndex) {
                case 0:
                    this.Fn1()
                    break;
                case 1:
                    this.Fn2()
                    break;
                case 2:
                    this.Fn3()
                    break;

            }
        },
        Fn1() {
            if (this.getParam.toString().length > 3) {
                DASgsvInitDataByDevId({
                    devId: this.getParam.deviceNo,
                    unitVal: 'METER'
                }).then(res => {
                    console.log(res, this.chartIndex);


                    
                })
            }
        },
        Fn2() {
            if (this.getParam.toString().length > 3) {
                DASfindPositionDiscrete({
                    devId: this.getParam.deviceNo,
                    unitVal: 'METER'
                }).then(res => {
                    console.log(res, this.chartIndex);
                })
            }
        },
        Fn3() {
            if (this.getParam.toString().length > 3) {
                DASgsvDataSatelliteDistribution({
                    devId: this.getParam.deviceNo
                }).then(res => {
                    console.log(res, this.chartIndex);
                })
            }

        }
    }
}
</script>
  