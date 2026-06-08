<template>
    <div id="gnss">
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
        <chart class="chart-box" :getParam="chartData"></chart>
    </div>
</template>

<script>
import moment from 'moment'
import commen from "./common"
export default {
    mixins: [commen],
    props: ["currentDevice"],
    watch: {
        currentDevice() {
            this.GetDASpageMonitorData();
        }
    },
    components: {
        chart: () => import('./chart-line-gradiograph_2.vue')
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
            form: {
                datePicker: {
                    time: [
                        new Date(new Date().toLocaleDateString()),
                        new Date(),
                    ],
                    defaultTime: [new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)]
                },
                radio: 'HOURS',
                sensorType: null,
                radio_display: 1,
                checkAll: false,
                check_list: ['三维合位移差值']
            },
            showData: {
                displayMode: [
                    { label: "图表统计", value: "1" },
                    { label: "列表统计", value: "2" },
                ],
                radioGroup: [
                    { key: 'HOURS', name: "小时", tips: "*展示时间粒度为1小时的数据,最大查询时间1年,不可跨年" },
                    { key: 'DAY', name: "天", tips: "*展示时间粒度为天的数据,最大查询时间31天,不可跨年" },
                    { key: 'WEEK', name: "周", tips: "*展示时间粒度为周的数据,最大查询时间7天,不可跨年" },
                ],
                ArranchorCableSensor: [],
                checkArr: ["分时增量(mm)", "累计雨量(mm)", "摇摆次数", "累计摇摆次数"],
            },
            isIndeterminate: true,
            chartData: {}
        }
    },
    created() {
        this.PageInit();
    }
    ,
    methods: {
        PageInit() {
            this.GetDASpageMonitorData();
        },
        GetDASpageMonitorData() {
            console.log(this.currentDevice, 'this.currentDevice');
            const getParam = {
                deviceId: this.currentDevice.deviceNo,
                mnId: this.currentDevice.id,
                dataType: this.currentDevice.type,
                sensorType: this.form.sensorType,
                index: this.form.radio,
                startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
                page: 1,
                size: 80000,
            }
            this.chartData = getParam;


        },
        handleDisplayMode() {
            console.log('hello change');
        },
        handleCheckAllChange(val) {
            this.form.check_list = val ? this.showData.checkArr : [];
            this.handleChange(this.form.check_list);
            this.isIndeterminate = false;
        },
        ChartByButton() {
            this.GetDASpageMonitorData();
        }
    }
}
</script>

<style lang="scss">
#gnssC_1 {
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

.el-date-table td {
    color: #666666;
}
</style>