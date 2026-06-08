<template>
    <div class="columnar" ref="radarChart"></div>
  </template>
  
  <script setup>
  import * as echarts from "echarts";
  import { onMounted,onUnmounted,ref,watch } from "vue";

  let myChart = null;
  let radarChart=ref(null);

  //接收参数  限制参数类型  并设置默认值 
  let props=defineProps(['echartsConfig','namels','echrasx'])
//   let props =defineProps  withDefaults(defineProps<>(),{
//       echartsConfig:()=>{return {seriesData:[]}},
//   })
  onMounted(() => {
      myChart =echarts.init(radarChart.value);
      initColumnar();
      window.addEventListener("resize", handleResize);
  });
  //销毁
  onUnmounted(()=>{
      window.removeEventListener("resize", handleResize);
      myChart && myChart.dispose();
  })
  //监听数据改变触发
  watch(
      () =>props.echartsConfig.seriesData,  //监听reactive属性 必须是方法形式
      (newValue,oldValue)=>{ initColumnar();},
      { deep:true}
      // { immediate: true }
  )
  watch(
      () =>props.echrasx,  //监听reactive属性 必须是方法形式
      (newValue,oldValue)=>{ initColumnar()},
      { deep:true}
      // { immediate: true }
  )
  const data = props.echartsConfig;
  //设置name值
  const dateName = data.seriesData.map(function (item) {
    return item.name;
  });
  //跟随屏幕缩放
  function handleResize() {
    myChart && myChart.resize();
  }
  //配置文件
  const initColumnar=()=>{
        let myChart = echarts.init(radarChart.value);
        let option;
        option = {
         //鼠标经过 提示框颜色
         tooltip: {
            trigger: 'axis'
         },
         title:{
            top: '7%',
            left: 'center',
            text: props.namels
         },
         legend: {
            textStyle: { color: "#000" },
            top: "30px",
            right: "60px",
            data:dateName
         },
        //  legend: {
        //     textStyle: { color: "#000" },
        //     bottom: "0px",
        //     data:dateList //['今日', '本周', '本月']
        //  },
         grid: {
            top: '20%',
            left: '2%',
            right: '2%',
            bottom: '10%',
            containLabel: true
         },
         xAxis: {
            type: 'category',
            // boundaryGap: true,
            //设置x轴文字颜色
            axisLabel: {
                textStyle: {color: "rgba(0,0,0,1)",margin: 15},
            },  
            data:props.echartsConfig.xAxisData,//props.echartsConfig.xAxisData 
         },
         yAxis: {
            name: "（mm）",
            min: props.echartsConfig.min, // 最小值
            max: props.echartsConfig.max, // 最大值
            type: 'value',
            //Y轴线的颜色
            splitLine: {
                show: true,
                lineStyle:{ color: ['rgba(0,0,0,.8)'], type: 'solid', opacity: 0.3 }
            },
            //y轴文字的配置
            axisLabel: {
                textStyle: {color: "rgba(0,0,0,.8)",margin: 15},
            },    
         },
         dataZoom: {  //设置可滑动 缩放百分之95的数据
            type: 'inside',
            start: 30,
            end: 100 // 结束位置
         },
         series:  data.seriesData.map(item=>{
           return {
            type: 'line',
                name:item.name,
                // showSymbol: false,
                data: item.data,
                symbolSize: 8,   //设定实心点的大小
                smooth: true,    //折线是否圆润
           }
         })
        };
        option && myChart.setOption(option,true);
    }

  
  </script>
  <style scoped lang="scss">
  .columnar {
    width: 100%;
    height: 100%;
  }
  </style>
  