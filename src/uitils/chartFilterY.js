import * as _ from 'lodash'
export default function(data){
    const legendData = data.series.map(sery => sery.displayName)
    const result  ={
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
            data: legendData,
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
            // boundaryGap: false1,
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            data:data.xAxis
        }],
        yAxis: [{
            name:"位移",
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
                fontSize: 14
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        },{
            name:"雨量(mm)",
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
                fontSize: 14
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }],
        series: []
    };

    for (let index in legendData) {
        let legend = legendData[index];
        let yAxisIndex;
        if(legend.indexOf("方向") !=-1){
            yAxisIndex = 0;
        }else if(legend.indexOf("雨量") !=-1){
            yAxisIndex = 1;
        }
        let singlelineConfig = {
            name: legend,
            yAxisIndex,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                width: 3
            },
            itemStyle: {
                borderWidth: 12
            },
            data: data.series[index].valueList
        }
        result.series.push(singlelineConfig);
    }
    console.log(result,"result");
    return result;
}