<template>
    <div id="gnssC-4">
        <el-row>
            <el-col>
                <el-date-picker ref="timeBox" v-model="form.datePicker.time" :picker-options="pickerOptions"
                    type="datetimerange" range-separator="至" :start-placeholder="'开始时间'" :end-placeholder="'结束时间'"
                    :clearable="true" :default-time="form.datePicker.defaultTime">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="pageInit"  :disabled="tableLoading">搜索</el-button>
            </el-col>
        </el-row>
        <el-row id="component-table">
            <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
                <el-table-column prop="createGmt" label="系统时间">
                </el-table-column>
                <el-table-column prop="lng" label="经度">
                </el-table-column>
                <el-table-column prop="lat" label="纬度">
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
  
<script>
// import { DASnavigationData } from "@/api/page/gis/detail";
import moment from 'moment';

export default {
    props: ["currentDevice"],
    watch: {
        currentDevice() {
            this.pageInit();
        }
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
            },
            tableLoading: false,
            tableData: [],
        };
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            this.tableLoading = true;
            DASnavigationData({
                deviceId: this.currentDevice.deviceNo,
                mnId: this.currentDevice.id,
                index: 'REAL_TIME',
                startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
                endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
                page: 1,
                size: 15
            }).then(res => {
                
                this.tableData = res.pageList;
                this.tableLoading = false;
            }).catch(res => {
                this.tableLoading = false;

            })
        }
    }

}

</script>
  
<style lang="scss">
// @import "@/styles/table.scss";

#gnssC-4 {
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
</style>