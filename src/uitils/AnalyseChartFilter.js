import * as echarts from 'echarts'
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from './chartEnhance'

const    chartParam = {
    colorArr: [[73, 201, 254], [131, 104, 221], [55, 230, 252], [59, 152, 239], [196, 235, 173], [150, 222, 232], [107, 230, 193], [160, 167, 230]]
}
export default function(chartData,filterDataStr){
    let result = {};
    const filterData = JSON.parse(filterDataStr);
    result.legend = filterData.map(item =>item.DisplayName);
    result.series = [];
    result.dataZoom = getZoomDataZoom();
    result.toolbox = getZoomToolbox();
    for(const [index, filter] of filterData.entries() ){
        console.log("filter",filter);
        let data = chartData.map(item => [item.DataTime, item[filter.FieldName]]);
        let singlelineConfig = {
            name: filter.DisplayName,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: true,
            yAxisIndex: index > 1 ? 0 : 1,
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            coordinateSystem: "cartesian2d",
            effect: {
                show: true,
                smooth: true,
                period: 6,
                symbolSize: 4,
              },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 0.3)`
                    }, {
                        offset: 0.8,
                        color: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 0)`
                    }], false),
                    shadowColor: `rgba(${chartParam.colorArr[index][0]}, ${chartParam.colorArr[index][1]}, ${chartParam.colorArr[index][2]}, 0.1)`,
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: `rgb(${chartParam.colorArr[index][0]},${chartParam.colorArr[index][1]},${chartParam.colorArr[index][2]})`,
                    borderColor: `rgba(${chartParam.colorArr[index][0]},${chartParam.colorArr[index][1]},${chartParam.colorArr[index][2]},0.27)`,
                    borderWidth: 12
                }
            },
            data
        }
        enhanceSeriesItem(singlelineConfig, chartParam.colorArr[index]);
        result.series.push(singlelineConfig);
    }
    console.log(result,'result');
    return result;
}