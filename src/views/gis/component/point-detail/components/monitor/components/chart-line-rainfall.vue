<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
  
<script setup>
import * as echarts from 'echarts'
import { watch,reactive,onUnmounted   } from 'vue'
import http from "@/api/http.js"


let chart;
const props = defineProps({
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
});
watch(() => props.getParam, () => {
    pageInit();

})
const state = reactive({
    series: [],
    chartData: {},
    chartParam: {
        legendData: [],
        selected: {
            "TPdwt05_X方向": true,
            "TPdwt05_Y方向": false,
            "TPdwt05_Z方向": false,
        },
        colorArr: [[73, 201, 254], [131, 104, 221], [107, 230, 193], [55, 230, 252], [59, 152, 239], [196, 235, 173], [150, 222, 232], [160, 167, 230]]
    },
    xAxis: {
        data: null
    }
})

pageInit();



onUnmounted(() => {
    clearChart();
})

function initChart() {
    chart = echarts.init(document.getElementById(props.id))
    chart.setOption({
        title: {
            top: 20,
            text: `位移数据${state.xAxis.data.length}条`,
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
            data: state.chartParam.legendData,
            selected: {
                "TPdwt05_X方向": true,
                "TPdwt05_Y方向": true,
                "TPdwt05_Z方向": true,
            },
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
            // type: 'time',
            // boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            data: state.xAxis.data
        }],
        yAxis: [{
            min: 'dataMin',
            max: 'dataMax',
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
        series: state.series
    })
}
function compileData(data) {
    for (let index in state.chartParam.legendData) {
        let legend = state.chartParam.legendData[index];
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
                        color: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0.3)`
                    }, {
                        offset: 0.8,
                        color: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0)`
                    }], false),
                    shadowColor: `rgba(${state.chartParam.colorArr[index][0]}, ${state.chartParam.colorArr[index][1]}, ${state.chartParam.colorArr[index][2]}, 0.1)`,
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: `rgb(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]})`,
                    borderColor: `rgba(${state.chartParam.colorArr[index][0]},${state.chartParam.colorArr[index][1]},${state.chartParam.colorArr[index][2]},0.27)`,
                    borderWidth: 12
                }
            },
            data: data[index].valueList
        }
        state.series.push(singlelineConfig);
    }
    console.log(state.series, 'state.series');
    initChart()

}
function pageInit() {
    clearChart();

    const param = JSON.parse(JSON.stringify(props.getParam));
    console.log(param, 'param');
    http.post('/api/Analysis/SingleIndicatorsAnalysis', param, true).then(res => {
        console.log(res, 'res');
        state.chartParam.legendData = res.data.series.map(sery => sery.displayName)
        state.xAxis.data = res.data.xAxis;
        // state.chartData = res;
        compileData(res.data.series);
    })

}

function clearChart() {
    state.series = [];
    if (!chart) {
        return
    }
    chart.dispose()
    chart = null
}







</script>
  