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
            currentSeries: [],
            legendData: [],
            chart: null,
            chartStyle: { height: this.height, width: this.width, background: `url(${plotBackgroundImage}) no-repeat center`, backgroundSize: `${this.width} ${this.width}` },
            color: ['#97dee8', '#c4ebad', '#3b98ef', '#6be6c1', '#8368dd', '#a0a7e6', '#49c9fe']
        }
    },
    mounted() {
        this.pageInit();
    },
    beforeDestroy() {
        this.clearChart()
    },
    methods: {
        initChart() {
            const chart = echarts.init(document.getElementById(this.id))
            const option = {
                color: this.color,
                legend: {
                    type: 'scroll',
                    data: this.legendData,
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
                    text: '监测点位移视图',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 16,
                        color: '#ffffff'
                    },
                    left: 'center'
                },
                polar: {},
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    formatter: function (params) {
                        return (
                            `<div style="color:#000000">
                            X偏移方向:${params.value[0]} <br>
                            Y偏移方向:${params.value[1]} <br>
                            Z偏移方向:${params.value[2]} <br>
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
                    min: 'dataMin',
                    max: 'dataMax',
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
            this.clearChart()
            if (this.getParam) {
                console.log(this.getParam.deviceNo,'this.getParam.deviceNo');
                DASgsvInitDataByDevId({
                    devId: this.getParam.deviceNo,
                    unitVal: 'METER'
                }).then(res => {
                    let sizeObj = this.AnchorValue(res.baseData.zbz, res.nowData.map(v => v.zbz));
                    for (let [index, item] of res.nowData.entries()) {
                        let seriesItem = {
                            name: `时间点-${index + 1}`,
                            type: 'scatter',
                            coordinateSystem: 'polar',
                            symbolSize: (val) => {
                                let result = this.FilterZbz(Math.abs(Math.abs(val[2]) - sizeObj.average) * sizeObj.time);
                                return result;
                            },
                            data: [[res.baseData.zbx - item.zbx, res.baseData.zby - item.zby, res.baseData.zbz - item.zbz,]],
                            animationDelay: function (idx) {
                                return index * 50;
                            }
                        }
                        this.legendData.push(`时间点-${index + 1}`);
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
        FilterZbz(val) {
            let result;
            switch (true) {
                case val > 50:
                    result = 50;
                    break;
                case val < 10:
                    result = 10;
                    break;
                default:
                    result = val;

            }
            return result;

        },

        AnchorValue(base, zbzArr) {
            let result = {};
            let total = 0;
            let valArr = [];
            for (let item of zbzArr) {
                valArr.push(Math.abs(Math.abs(base) - Math.abs(item)));
                total += Math.abs(Math.abs(base) - Math.abs(item));
            }
            result.average = total / zbzArr.length;
            let difValArr = valArr.map(v => Math.abs(result.average - Math.abs(v)));
            let difTotal = 0;
            for (let dif of difValArr) {
                difTotal += dif;
            }
            result.difAverage = difTotal / difValArr.length;
            switch (true) {
                case result.difAverage > 0.01:
                    result.time = 1000;
                    break;
                case result.difAverage > 0.001:
                    result.time = 10000;
                    break;
                case result.difAverage > 0.0001:
                    result.time = 100000;
                    break;
                default:
                    result.time = 100000;

            }
            return result
        },









    }
}
</script>
  