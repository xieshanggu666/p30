import { getBarEmphasis, getZoomDataZoom, getZoomToolbox } from '@/uitils/chartEnhance'

var chart1 = {
    title: {
        text: "框架集成及开发环境",
        left: 'center',
        padding: 15,
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: 'bottom',
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 7,
        padding: [0, 0, 15, 0]
    },
    series: [
        {
            name: '框架',
            type: 'pie',
            radius: ['40%', '65%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '.NetCore' },
                { value: 735, name: 'Dapper' },
             
                { value: 735, name: 'EntityFramework' },
                { value: 735, name: 'Redis' },
                { value: 735, name: 'Vue3.0' },
                { value: 580, name: 'Vuex' },
                { value: 484, name: 'Element plus' }
            ]
        }
    ]
}

var chart2 = {
    title: {
        text: '这里是首页'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['2.0下载量', '3.0下载量'],
        padding: [0, 0, 15, 0]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'13%',
        containLabel: true
    },
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
    xAxis: [
        {
            type: 'category',
            data: [ '2015', '2016', '2017', '2018', '2019', '2020', '2021']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '2.0下载量',
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [4, 4, 0, 0]
                }
            },
            emphasis: getBarEmphasis(),
            data: [ 730, 620, 420, 932, 701, 834, 890]
        },
        {
            name: '3.0下载量',
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            emphasis: getBarEmphasis(),
            data: [230, 210, 120, 132, 101, 134, 90]
        }
    ]
}
var chart3 = {
    title: {
        text: '框架支持功能(Vue2.0、Vue3.0版本)',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: 'bottom',
        icon: "circle",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 7,
        padding: [0, 0, 10, 0]
    },
    series: [
        {

            name: '框架支持功能(Vue2.0、Vue3版本)',
            type: 'pie',
            radius: '55%',
            data: [
                { value: 748, name: '多租户' },
                { value: 435, name: '多角色' },
                { value: 580, name: '多数据库' },
                { value: 280, name: '主从分库' },
                { value: 284, name: '国际化' },
                { value: 300, name: 'App/H5开发' },
                { value: 200, name: 'Redis' },
                { value: 600, name: 'Sqlserver' },
                { value: 400, name: 'Mysql' },
                { value: 100, name: 'Oracle' },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}
var chart4={
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'13%',
        containLabel: true
    },
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [
      {
        name: 'Direct',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.4)', borderColor: '#fff', borderWidth: 2 } },
        data: [320, 302, 301, 334, 390, 330, 320]
      },
      {
        name: 'Mail Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.4)', borderColor: '#fff', borderWidth: 2 } },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Affiliate Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.4)', borderColor: '#fff', borderWidth: 2 } },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ad',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.4)', borderColor: '#fff', borderWidth: 2 } },
        data: [150, 212, 201, 154, 190, 330, 410]
      },
      {
        name: 'Search Engine',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.4)', borderColor: '#fff', borderWidth: 2 } },
        data: [820, 832, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
export { chart1, chart2, chart3,chart4 }