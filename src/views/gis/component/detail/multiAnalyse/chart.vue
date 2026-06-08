<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
  
<script setup>
import * as echarts from 'echarts'
import { watch, reactive, onUnmounted } from 'vue'
import http from "@/api/http.js"
import chartFilter from "@/uitils/chartFilterY"
import { bindToolboxZoom } from "@/uitils/chartEnhance"

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
    console.log(props.getParam);
    pageInit();

})
pageInit();
onUnmounted(() => {
    clearChart();
})

function initChart(config) {
    chart = echarts.init(document.getElementById(props.id))
    chart.setOption(config);
    bindToolboxZoom(chart);
}

function pageInit() {
    clearChart();
    http.post('/api/Analysis/MultiIndicatorsAnalysis', props.getParam, true).then(res => {
        console.log(res, 'res');
        const ChartConfig = chartFilter(res.data);
        initChart(ChartConfig);
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
  