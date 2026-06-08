<template>
    <div id="multiAnalyse">
        <el-form ref="form" :model="state.form" label-width="80px">
            <el-form-item label="日期范围">
                <el-date-picker :id="'multiAnalyse-picker'" :shortcuts="state.shortcuts"
                    v-model="state.form.datePicker.time" type="datetimerange" range-separator="至" start-placeholder="开始时间"
                    end-placeholder="结束时间" :default-time="state.form.datePicker.defaultTime" />

                <el-button class="search-button" type="primary" icon="el-icon-data-analysis" @click="GetDASpageMonitorData">
                    生成图表
                </el-button>
            </el-form-item>
            <el-form-item label="显示方式">
                <el-radio-group v-model="state.form.radio">
                    <el-radio :key="item.key + index" v-for="(item, index) in state.showData.radioGroup"
                        :label="item.key">{{
                            item.name
                        }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <chart class="chart-box" :getParam="state.chartData" :id="'Chart_multiAnalyse'"></chart>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import moment from 'moment'
import shortcuts from "@/uitils/shortcuts"
import { useStore } from 'vuex'
import chart from './chart.vue'


const $store = useStore();
const currentGroup = $store.state.currentGroup;
console.log(currentGroup, 'currentGroup');
const state = reactive({
    shortcuts,
    form: {
        datePicker: {
            time: [
                new Date(new Date().toLocaleDateString()), new Date()
            ],
            defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]
        },
        radio: 0,
    },
    showData: {
        displayMode: [
            { label: "图表统计", value: "1" },
            { label: "列表统计", value: "2" },
        ],
        radioGroup: [
            { key: 0, name: "时" },
            { key: 1, name: "天" },
            { key: 2, name: "月" },
        ],
    },
    chartData: {}
})
GetDASpageMonitorData();


function GetDASpageMonitorData() {
    const getParam = {
        groupId: currentGroup.ID,
        total: 50000,
        timeType: state.form.radio,
        startTime: moment(state.form.datePicker.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(state.form.datePicker.time[1]).format("YYYY-MM-DD HH:mm:ss"),
    }
    console.log(getParam, 'getParam');
    state.chartData = getParam;

}

</script>
<style  lang="scss" >
#multiAnalyse {
    .el-form-item__label {
        color: #ffffff;
    }

    .search-button {
        margin-left: 56px;
        width: 140px;
    }


    .el-date-editor {
        background: #11305f;
        color: #fff;

        * {
            color: #fff;
        }
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