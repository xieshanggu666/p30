<template>
  <div id="operation-data">
    <device-menu @choosedTab="choosedDeviceItem"></device-menu>
    <div class="right-box">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="日期范围">
          <el-date-picker ref="timeBox" v-model="form.datePicker.time" :picker-options="pickerOptions"
            type="datetimerange" range-separator="至" :start-placeholder="'开始时间'" :end-placeholder="'结束时间'"
            :clearable="true" :default-time="form.datePicker.defaultTime">
          </el-date-picker>
          <el-button class="search-button" type="primary" icon="el-icon-data-analysis" @click="ChartByButton">
            生成图表
          </el-button>
        </el-form-item>
        <el-form-item label="显示方式">
          <el-radio-group v-model="form.radio">
            <el-radio :key="item.key + index" v-for="(item, index) in showData.radioGroup" :label="item.key">{{
                item.name
            }}</el-radio>
          </el-radio-group>
          <span class="tips" v-if="form.radio == 'REAL_TIME'">*展示一天内时间粒度为秒的数据</span>
          <span class="tips" v-if="form.radio == 'MINUTES'">*展示时间粒度为1分钟的数据,最大查询时间31天,不可跨月</span>
          <span class="tips" v-if="form.radio == 'MINUTES5'">*展示时间粒度为5分钟的数据,最大查询时间31天,不可跨月</span>
          <span class="tips" v-if="form.radio == 'HOURS'">*展示时间粒度为1小时的数据,最大查询时间1年,不可跨年</span>
          <span class="tips" v-if="form.radio == 'HOURS3'">*展示时间粒度为1小时的数据,最大查询时间1年,不可跨年</span>
          <span class="tips" v-if="form.radio == 'DAY'">*展示时间粒度为1小时的数据,最大查询时间1年,不可跨年</span>
        </el-form-item>
      </el-form>



      <chart class="chart-box" :getparam="chartData"></chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  components: {
    deviceMenu: () => import('../components/device-menu.vue'),
    chart: () => import('./components/chart-line.vue')
  },
  computed: {
    startTime: function () {
      return this.form.datePicker.time[0]
    },
    endTime: function () {
      return this.form.datePicker.time[1]
    }
  },
  data() {
    return {
      choosedDeviceItemInfo: null,
      form: {
        datePicker: {
          time: [
            new Date(new Date().toLocaleDateString()),
            new Date(),
          ],
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)]
        },
        radio: 'REAL_TIME',
        radio_display: 1,
        checkAll: false,
      },
      showData: {
        displayMode: [
          { label: "图表统计", value: "1" },
          { label: "列表统计", value: "2" },
        ],
        radioGroup: [
          { key: 'REAL_TIME', name: "实时", tips: "展示一天内时间粒度为秒的数据" },
          { key: 'HOURS', name: "小时", tips: "展示时间粒度为1小时的数据,最大查询时间31天,不可跨年" },
          { key: 'DAY', name: "自然日", tips: "展示时间粒度为天的数据,最大查询时间15天,不展示今日数据,不可跨年" },
        ],

      },
      isIndeterminate: true,
      chartData: {}
    }
  },
  methods: {
    choosedDeviceItem(item) {
      this.choosedDeviceItemInfo = item;
      this.deviceType = this.choosedDeviceItemInfo.type
      this.ChartInit();
    },
    ChartByButton() {
      this.ChartInit();
    },
    ChartInit() {
      console.log(this.choosedDeviceItemInfo, 'choosedDeviceItemInfo');
      const getParam = {
        deviceId: this.choosedDeviceItemInfo.deviceNo,
        mnId: this.choosedDeviceItemInfo.monId,
        index: this.form.radio,
        startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
        showType:1,
        radioDisplay:1,
      }
      this.chartData = getParam;
    }

  }
}
</script>

<style lang="scss" scoped>
#operation-data {
  display: flex;
  justify-content: space-around;

  .right-box {
    background: #0c2751;
    width: 1178px;
    height: 800px;
    padding: 6px 24px;

  }

  .is-top {
    color: #ffffff;
  }

  .el-tabs__item {
    background: #0c2751;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

  .el-form-item__label {
    color: #ffffff;
  }

  .search-button {
    margin-left: 56px;
    width: 140px;
  }

  ::v-deep .el-range-input {
    background: #11305f;
    color: #fff;
  }

  ::v-deep .el-form-item__label {
    color: #fff;


  }

  .el-input__inner {
    background: #11305f;
    border: 1px solid #2e4975;
    color: #ffffff;
  }

  .tips {
    display: block;
    margin: 10px 0 0 60px;
    color: red;
    font-size: 12px;
  }


}
</style>
