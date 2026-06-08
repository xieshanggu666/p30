<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看震动数据"
      :height="700"
      :width="1200"
      :padding="15"
      :on-model-close="closeCustomModel"
    >
      <div class="IndexBox">
        <div id="mianBox" class="mainBox" ref="seller_ref_one"></div>
      </div>
    </vol-box>
  </div>
</template>
<script>
//  模拟震动数据
let now = new Date();
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
let data = [];
let data1 = [];
let data2 = [];
let chart;
import VolBox from "@/components/basic/VolBox.vue";
import * as echarts from "echarts"
import { enhanceSeriesItem, getZoomDataZoom, getZoomToolbox } from "@/uitils/chartEnhance";
export default {
  components: { "vol-box": VolBox },
  methods: {},
  data() {
    return {
      model: {
        box: false,
      },
      timer: null,
      series: [],
    };
  },
  methods: {
    closeCustomModel() {
      chart = echarts.init(this.$refs.seller_ref_one);
      this.series = [];
      if (!chart) {
        return;
      }
      chart.dispose();
      chart = null;
      clearInterval(this.timer);
    },
    openShake(row) {
      this.model.box = true;
      this.series=[
        {
          name: "X轴倾斜",
          type: "line",
          smooth: true,
          data: data,
        },
        {
          name: "Y轴倾斜",
          type: "line",
          smooth: true,
          data: data1,
        },
        {
          name: "Z轴倾斜",
          type: "line",
          smooth: true,
          data: data2,
        },
      ],
      this.setEchartsData();

      this.$nextTick(() => {
        this.myEchartsFun();
      });
    },

    randomData() {
      now = new Date(+now + 1000);
      value = Math.random() * 5 - 5;
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },
    randomData1() {
      now = new Date(+now + 1000);
      value = Math.random() * +5;
      // console.log("value1111111",value);
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },
    randomData2() {
      now = new Date(+now + 1000);
      value = Math.random() * 5 - 10;
      // console.log("value333333",value);
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },

    // 给每个折线放入数据
    setEchartsData() {
      let that = this;
      for (var i = 0; i < 5; i++) {
        data.push(that.randomData());
        data1.push(that.randomData1());
        data2.push(that.randomData2());
      }
    },

    myEchartsFun() {
      chart = echarts.init(this.$refs.seller_ref_one);
      let that = this;
      var option = {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear()
            );
          },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
          axisLabel: {
      //  X 坐标轴标签相关设置
      interval: 0,
      rotate: '45'
    }
        },
        yAxis: {
          name: "倾斜角度",
          type: "value",
          splitNumber: 6,
          boundaryGap: [0, "100%"],
          splitLine: {
            show: true,
          },
        },
    dataZoom: getZoomDataZoom(),
    toolbox: getZoomToolbox(),
    
        series: this.series,
      };
      this.timer = setInterval(function() {
        data.shift();
        data.push(that.randomData());
        data1.shift();
        data1.push(that.randomData1());
        data2.shift();
        data2.push(that.randomData2());
        chart.setOption(option);
      }, 1000);
    },
  },
};
</script>
<style lang="less">
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}

.IndexBox {
  width: 1180px;
  height: 600px;
  .mainBox {
    width: 1180px;
    height: 600px;
  }
}
</style>
