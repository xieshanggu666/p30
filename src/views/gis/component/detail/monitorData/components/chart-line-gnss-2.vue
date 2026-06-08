<template>
    <div>
        <div :id="id" :class="className" :style="{ height: height, width: width }" />
    </div>
</template>
  
<script>
import * as echarts from 'echarts'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance"
// import { DASpageMonitorData } from "@/api/page/gis/detail"

export default {
    watch: {
        getParam() {
            this.pageInit()
        },
        activeName() {
            console.log(this.activeName, 'hello static');
            if (this.activeName == "gnssC_2") {
                console.log(this.activeName, 'hello static');
                this.pageInit()
            }
        }
    },
    props: {
        getParam: {
            type: Object,
            default: {}
        },
        activeName: {
            type: String,
            default: "321"
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
            default: '406px'
        }
    },
    data() {
        return {
            chart: null,
            series: [],
            chartData: {},
            chartParam: {
                xTimeArr: [],
                legendData: ['N相对坐标', 'E相对坐标', 'U相对坐标', 'N相差值', 'E相差值', 'U相差值'],
                colorArr: [[73, 201, 254], [131, 104, 221], [107, 230, 193], [55, 230, 252], [59, 152, 239], [196, 235, 173], [150, 222, 232], [160, 167, 230]]
            }
        }
    },
    mounted() {
        this.pageInit();
    },
    beforeUnmount() {
        this.clearChart();
    },
    methods: {
        initChart() {
            console.log('hello 2');

            const chart = echarts.init(document.getElementById(this.id))
            chart.setOption({
                title: {
                    top: 20,
                    text: `位移数据${this.chartData.total}条`,
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
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    },
                    data: this.chartParam.xTimeArr
                }],
                yAxis: [{
                    type: 'value',
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
    
                series: this.series
            })
        },
        compileData() {
            let rootData = this.chartData.pageList;
            this.chartParam.xTimeArr = rootData.map(item => item.createGmt);
            for (let index in this.chartParam.legendData) {
                let legend = this.chartParam.legendData[index];
                let singlelineConfig = {
                    name: legend,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 3
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
                    data: rootData.map(item => item[this.CompilechartsData(legend)])
                }
                enhanceSeriesItem(singlelineConfig, this.chartParam.colorArr[index]);
          this.series.push(singlelineConfig);
            }

            this.initChart()

        },
        CompilechartsData(value) {
            switch (value) {
                case "N相对坐标":
                    return "v1";
                    break;
                case "E相对坐标":
                    return "v2";
                    break;
                case "U相对坐标":
                    return "v3";
                    break;
                case "N相差值":
                    return "levelDifference";
                    break;
                case "E相差值":
                    return "v2Difference";
                    break;
                case "U相差值":
                    return "verticalDifference";
                    break;
                case "水平合位移差值":
                    return "horizontal";
                    break;
                case "三维合位移差值":
                    return "threeDimensional";
                    break;
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
  