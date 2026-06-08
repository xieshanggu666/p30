export function getLineEmphasis(colorRgb) {
  const emphasis = {
    focus: 'series',
    itemStyle: {
      borderWidth: 3,
      borderColor: colorRgb ? `rgb(${colorRgb[0]},${colorRgb[1]},${colorRgb[2]})` : '#fff',
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.3)'
    },
    lineStyle: {
      width: 5
    },
    symbolSize: 12
  };
  return emphasis;
}

export function getBarEmphasis(colorRgb) {
  const emphasis = {
    focus: 'series',
    itemStyle: {
      opacity: 1,
      shadowBlur: 15,
      shadowColor: 'rgba(0,0,0,0.4)',
      borderColor: '#fff',
      borderWidth: 2
    }
  };
  return emphasis;
}

export function enhanceSeriesItem(item, colorRgb) {
  if (item.type === 'line') {
    item.emphasis = { ...getLineEmphasis(colorRgb), ...(item.emphasis || {}) };
    if (!item.showSymbol) {
      item.showSymbol = true;
      item.symbolSize = item.symbolSize || 5;
    }
  } else if (item.type === 'bar') {
    item.emphasis = { ...getBarEmphasis(colorRgb), ...(item.emphasis || {}) };
  }
  return item;
}

export function getZoomDataZoom(xAxisIndex = 0) {
  return [
    {
      id: 'dataZoomX',
      type: 'inside',
      xAxisIndex: [xAxisIndex],
      filterMode: 'filter'
    }
  ];
}

const ZOOM_ICON_SVG = 'path://M618.496 128H480c-17.664 0-32 14.336-32 32s14.336 32 32 32h60.8l-89.6 89.6c-45.824-33.152-101.76-52.8-162.048-52.8C233.6 228.8 112 350.4 112 500.8s121.6 272 271.552 272c149.952 0 271.552-121.6 271.552-272 0-60.288-19.68-116.224-52.8-162.048l89.6-89.6V308c0 17.664 14.336 32 32 32s32-14.336 32-32V160c0-17.664-14.336-32-32-32h-4.8zM383.552 708.8c-114.688 0-208-93.312-208-208s93.312-208 208-208 208 93.312 208 208-93.312 208-208 208z';

export function getZoomToolbox() {
  return {
    feature: {
      myDataZoom: {
        show: true,
        title: '区域缩放',
        icon: ZOOM_ICON_SVG,
        iconStyle: {
          borderColor: '#606266'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#409EFF'
          }
        },
        onclick: function(event, ecInstance) {
          ecInstance.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'dataZoomSelect',
            dataZoomSelectActive: true
          });
        }
      },
      restore: {
        title: '还原',
        iconStyle: {
          borderColor: '#606266'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#409EFF'
          }
        }
      }
    },
    left: 80,
    top: 0,
    itemSize: 16,
    itemGap: 12,
    iconStyle: {
      borderColor: '#606266'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#409EFF'
      }
    }
  };
}

export function bindToolboxZoom(chartInstance) {
  chartInstance.on('click', function(params) {
    if (params.componentType === 'toolbox' && params.name === 'myDataZoom') {
      chartInstance.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: true
      });
    }
  });
}

export function enhanceChartOption(option, existingToolbox) {
  const hasLineOrBar = option.series && option.series.some(
    s => s.type === 'line' || s.type === 'bar'
  );
  if (!hasLineOrBar) return option;

  option.dataZoom = option.dataZoom
    ? mergeDataZoom(option.dataZoom)
    : getZoomDataZoom();

  if (!option.toolbox) {
    option.toolbox = getZoomToolbox();
  } else if (!option.toolbox.feature) {
    option.toolbox.feature = getZoomToolbox().feature;
  } else {
    const ft = option.toolbox.feature;
    if (ft.dataZoom) {
      delete ft.dataZoom;
    }
    if (!ft.myDataZoom) {
      ft.myDataZoom = getZoomToolbox().feature.myDataZoom;
    }
    if (!ft.restore) {
      ft.restore = getZoomToolbox().feature.restore;
    }
  }

  if (option.series) {
    option.series.forEach((s, i) => {
      if (s.type === 'line' || s.type === 'bar') {
        enhanceSeriesItem(s);
      }
    });
  }

  return option;
}

function mergeDataZoom(existing) {
  const hasInside = existing.some(z => z.type === 'inside');
  if (hasInside) return existing;

  const hasSlider = existing.some(z => z.type === 'slider');
  if (hasSlider) {
    return existing.map(z => z.type === 'slider' ? getZoomDataZoom()[0] : z);
  }

  return getZoomDataZoom();
}
