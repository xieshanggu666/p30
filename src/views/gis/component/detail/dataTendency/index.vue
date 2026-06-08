<template>
  <div id="data-tendency-box">
    <div id="data-tendency">
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

        <!-- 显示方式 暂时不要，放在这里布局太小，内容也不够展示还侵占其他内容的空间    之前这么弄  估计是 缺乏设计自信  怕内容不够  start -->
        <!-- <el-form-item label="显示方式">
        <el-radio-group @change="handleDisplayMode" v-model="form.radio_display">
          <el-radio :key="Date.now() + index" v-for="(item, index) in showData.displayMode" :label="item.value">{{
              item.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
        <!-- 显示方式   end -->

        <!-- 数据暂时  功能完全重复  直接点击 图例  即可控制开关 start   -->
        <!-- <el-form-item label="数据展示">
        <el-checkbox style="margin-right: 20px" :indeterminate="isIndeterminate" v-model="form.checkAll"
          @change="handleCheckAllChange">全选
        </el-checkbox>
        <el-checkbox-group @change="handleChange" v-model="form.check_list">
          <el-checkbox v-for="(item, index) in showData.checkArr" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
        <!-- 数据展示  end   -->


      </el-form>
      <div class="chart-box">
        <div class="chart-box-item" v-for="(item, index) in chartDataArr" :key="index">
          <chart-line :getParam="item" :id="`chart-${index}`"></chart-line>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import common from "@/views/gis/component/detail/mixin/commen";
import moment from 'moment'
// import {
//   GetMonNodeList, DASdeviceAnalysisList
// } from "@/api/page/gis/detail";
export default {
  props: ['mgId'],
  mixins: [common],
  components: {
    chartLine: () => import("./components/chart-lline.vue")
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
      chartData: null,
      chartDataArr: [],
      form: {
        datePicker: {
          time: [
            new Date(new Date().toLocaleDateString()),
            new Date(),
          ],
          defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)]
        },
        radio: 'HOURS',
        radio_display: 1,
      },
      showData: {
        displayMode: [
          { label: "图表统计", value: "1" },
          { label: "列表统计", value: "2" },
        ],
        radioGroup: [
          { key: 'REAL_TIME', name: "实时", tips: "展示一天内时间粒度为秒的数据" },
          { key: 'MINUTES', name: "分钟", tips: "展示时间粒度为1分钟的数据,最大查询时间31天,不可跨月" },
          { key: 'MINUTES5', name: "5分钟", tips: "展示时间粒度为5分钟的数据,最大查询时间31天,不可跨月" },
          { key: 'HOURS', name: "小时", tips: "展示时间粒度为1小时的数据,最大查询时间31天,不可跨年" },
          { key: 'HOURS3', name: "3小时", tips: "展示时间粒度为3小时的数据,最大查询时间31天,不可跨年" },
        ],
      },
    }
  },
  mounted() {
    this.pageInit();
  },
  methods: {
    async pageInit() {
      const nodeList = await GetMonNodeList({ mgId: this.GisCurrentGroup.id, page: 1, size: 10000, });
      console.log(nodeList);
      let nodeIdArr = nodeList.pageList.map(v => v.id);
      this.chartData = {};
      this.chartData = await DASdeviceAnalysisList({
        arrayDeviceId: nodeIdArr,
        startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
        index: this.form.radio,
      })
      console.log(this.chartData, 'this.chartData');

      this.chartDataArr = [];

      for (let item in this.chartData) {
        this.chartDataArr.push(this.chartData[item]);
      }
      console.log(this.chartDataArr, 'chartDataArr');
    },
    ChartByButton() {

      this.pageInit();
    }


  }

}
</script>

<style lang="scss">
#data-tendency-box {
  display: flex;
  justify-content: center;
  align-items: center;

  #data-tendency {
    background: #0c2751;
    width: 1439px;
    height: 800px;
    padding: 24px;

    .chart-box {
      height: 600px;
      border: 1px solid #2e4975;
      overflow: auto;

      .chart-box-item {
        width: 90%;
        margin: 20px auto;
      }
    }

    .el-form-item__label {
      color: #ffffff;
    }

    .search-button {
      margin-left: 56px;
      width: 140px;
    }

    .el-range-input {
      background: #11305f;
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
}
</style>