<template>
    <div :id="props.id" :class="props.className" :style="{ height: props.height, width: props.width }" />
    <img :src="require('@/assets/gis/search/echartsBack3.png')" id="bg_img" style="display:none;" />
</template>
  
<script setup>
import * as echarts from 'echarts'
import { reactive, computed, ref, onMounted, onUnmounted, watch } from 'vue'
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
        default: '358px'
    },
    height: {
        type: String,
        default: '228px'
    },
    type: {
        type: String,
        default: "温度"
    }, max: {
        type: Number,
        default: 40
    },
    val: {
        type: Number,
        default: 10
    }


})

setTimeout(() => {
    pageInit();

}, 500);
onUnmounted(() => {
    clearChart();
})
watch(() => props.getParam, () => {
    pageInit();

})

async function pageInit() {
    clearChart();
    initChart();
    console.log('pageInit')


}

function initChart() {
    console.log("initChart")
    chart = echarts.init(document.getElementById(props.id))
    var value = props.val / props.max;
    console.log(value, 'value');
    var startAngle = 215,
        endAngle = -35,
        splitCount = 60,
        pointerAngle = (startAngle - endAngle) * (1 - value) + endAngle;
    chart.setOption({
        series: [
            {
                type: 'gauge',
                radius: '90%',
                startAngle: pointerAngle,
                endAngle: endAngle,
                splitNumber: 1,
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: 3,
                        opacity: 0
                    }
                },
                title: { show: false },
                detail: { show: false },
                splitLine: { show: false },
                axisTick: {
                    length: 27,
                    splitNumber: Math.ceil((1 - value) * splitCount),
                    lineStyle: {
                        color: '#001242',
                        width: 3
                    }
                },
                axisLabel: { show: false },
                pointer: { show: false },
                itemStyle: {},
                markPoint: {
                    animation: false,
                    silent: false,
                    //   data: [
                    //     {
                    //       symbol: 'image://' + document.getElementById('round1').src,
                    //       x: '50%',
                    //       y: '50%',
                    //       symbolSize: 280,
                    //       itemStyle: {
                    //         borderWidth: 3
                    //       }
                    //     },
                    //     {
                    //       symbol: 'circle',
                    //       symbolSize: 200
                    //     }
                    //   ]
                },
                data: [
                    {
                        value: value,
                        name: 'test gauge'
                    }
                ]
            },
            {
                type: 'gauge',
                radius: '90%',
                startAngle: startAngle,
                endAngle: pointerAngle,
                splitNumber: 1,
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: 3,
                        opacity: 0
                    }
                },
                title: { show: false },
                detail: { show: false },
                splitLine: { show: false },
                axisTick: {
                    length: 27,
                    splitNumber: Math.ceil(value * splitCount),
                    lineStyle: {
                        color: {
                            image: document.getElementById('bg_img'),
                            repeat: 'no-repeat'
                        },
                        width: 3
                    }
                },
                axisLabel: { show: false },
                pointer: { show: false },
                itemStyle: {},
                data: [
                    {
                        value: value,
                        name: 'test gauge'
                    }
                ]
            },
            {
                type: 'gauge',
                radius: '95%',
                startAngle: pointerAngle,
                endAngle: pointerAngle,
                splitNumber: 1,
                axisLine: {
                    show: false,
                    lineStyle: {
                        width: 3,
                        opacity: 0
                    }
                },
                title: {
                    show: true,
                    color: "#ffffff"
                },
                detail: { show: false },
                splitLine: { show: false },
                axisTick: {
                    length: 20,
                    splitNumber: 1,
                    lineStyle: {
                        color: {
                            image: document.getElementById('bg_img'),
                            repeat: 'no-repeat'
                        },
                        width: 3
                    }
                },
                axisLabel: { show: false },
                pointer: { show: false },
                itemStyle: {},
                detail: {
                    fontSize: 20,
                    offsetCenter: [0, '-15%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return props.val + '';
                    },
                    color: 'inherit'
                },
                data: [
                    {
                        value: value,
                        name: props.type
                    }
                ]
            }
        ]


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
  