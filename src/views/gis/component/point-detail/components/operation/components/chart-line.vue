<template>
    <div :id="props.id" :class="props.className" :style="{ height: props.height, width: props.width }" />
</template>
  
<script setup>
import * as echarts from 'echarts'
import http from "@/api/http.js"
import ChartFilter from "@/uitils/chartFilter.js"
import { reactive, computed, ref, onMounted, onUnmounted,watch } from 'vue'
let chart = null;
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
})
pageInit();
onUnmounted(() => {
    clearChart();
})
watch(() => props.getParam, () => {
    pageInit();

})

async function pageInit() {
    clearChart();
    if (props.getParam.pointNum) {
        const chartData = (await http.axios({ url: '/api/Mon_Point_Manager/GetRunData', params: props.getParam, method: "get" })).data.rows;
        const filterData = (await http.axios({ url: '/api/Mon_Point_Manager/GetRunDataConfig', params: { pointNum: props.getParam.pointNum }, method: "get" })).data.data;
        const compileData = ChartFilter(chartData, filterData);
        initChart(compileData)
    }

}

function initChart(compileData) {
    chart = echarts.init(document.getElementById(props.id))
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
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: compileData.legend,
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
            name: '温度',
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
            name: '电压/信号',
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
        series: compileData.series
    })
}
function clearChart() {

    if (!chart) {
        return
    }
    chart.dispose()
    chart = null
}
</script>
  