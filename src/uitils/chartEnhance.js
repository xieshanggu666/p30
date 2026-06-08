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

export function getZoomToolbox() {
  return {
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
        title: {
          zoom: '区域缩放',
          back: ''
        },
        icon: {
          back: 'path://M0,0Z'
        },
        iconStyle: {
          borderColor: '#606266'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#409EFF'
          }
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
  } else if (!option.toolbox.feature || !option.toolbox.feature.dataZoom) {
    option.toolbox.feature = {
      ...(option.toolbox.feature || {}),
      dataZoom: getZoomToolbox().feature.dataZoom,
      restore: getZoomToolbox().feature.restore
    };
  } else if (option.toolbox.feature && option.toolbox.feature.dataZoom) {
    const dz = option.toolbox.feature.dataZoom;
    dz.title = { ...(dz.title || {}), back: '' };
    dz.icon = { ...(dz.icon || {}), back: 'path://M0,0Z' };
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
