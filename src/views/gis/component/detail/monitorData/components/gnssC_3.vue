<template>
    <div class="sdjs">
        <!-- <div class="device-name">
        <span class="el-icon-location-information"></span>
        <span>{{ deviceInfo.productType }}</span>
        <span>{{ deviceInfo.monName }}</span>
      </div> -->
        <div class="charts-box">
            <div class="item">
                <div class="title">初始位置</div>
                <div class="time-box">
                    <div class="time-item">
                        <span>日期：</span>
                        <el-date-picker @change="chooseDate1" v-model="chooseDate" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="echarts echarts1">
                    <chartLineGnss3 :id="'chart_3_1'"    :activeName="activeName"> </chartLineGnss3>
                </div>
                <div class="btn-box">
                    <div class="range">
                        <!-- <span>时间范围：</span> -->
                        <el-time-picker @change="changeTimeRange" is-range v-model="timeRange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                        </el-time-picker>
                    </div>
                    <el-button type="primary" @click="handleResolve">解算</el-button>
                </div>
                <!-- <div class="average-item">
                    <div class="title">初始均值</div>
                    <div class="content">
                        <span>N相对坐标：12.12345677（m）</span>
                        <span>E相对坐标：12.12345677（m）</span>
                    </div>
                    <div class="content">
                        <span>U相对坐标：12.12349478（m）</span>
                        <span>水平距离：12.12349478（m）</span>
                    </div>
                </div> -->
            </div>
            <div class="item">
                <div class="title">解算位置</div>
                <div class="time-box">
                    <div class="time-item">
                        <div class="time-item">
                            <span>日期：</span>
                            <el-date-picker v-model="chooseDate2" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="echarts echarts2">
                    <chartLineGnss3 :id="'chart_3_2'" :activeName="activeName"> </chartLineGnss3>
                </div>
                <div class="btn-box">
                    <div class="range">
                        <!-- <span>时间范围：</span> -->
                        <el-time-picker is-range v-model="timeRange2" range-separator="至" start-placeholder="开始时间"
                            end-placeholder="结束时间" placeholder="选择时间范围">
                        </el-time-picker>
                    </div>
                    <el-button type="primary" @click="handleResolve2">解算</el-button>
                </div>
                <!-- <div class="average-item">
                    <div class="title">解算均值</div>
                    <div class="content">
                        <span>N相对坐标：12.12345677（m）</span>
                        <span>E相对坐标：12.12345677（m）</span>
                    </div>
                    <div class="content">
                        <span>U相对坐标：12.12349478（m）</span>
                        <span>水平距离：12.12349478（m）</span>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- <div class="average-item">
            <div class="title">差值</div>
            <div class="content">
                <span>N相对坐标：12.12345677（m）</span>
                <span>E相对坐标：12.12345677（m）</span>
            </div>
            <div class="content">
                <span>U相对坐标：12.12349478（m）</span>
                <span>水平距离：12.12349478（m）</span>
            </div>
        </div> -->
    </div>
</template>
  
<script>
export default {
    name: "sdjs",
    props: ["deviceInfo", 'active','activeName'],
    components: {
        chartLineGnss3: () => import("./chart-line-gnss-3.vue")
    },
    data() {
        return {
            chooseDate: new Date(),
            timeRange: [new Date(2016, 9, 10, 0, 0, 0), new Date(2016, 9, 10, 23, 59, 59)],
        }
    },
    watch: {
        active(newVal, oldVal) {
            if (newVal) {
                this.getData()
            }
        }
    },
    created() {
    },
    mounted() {
        //   this.changeData(this.chooseDate)

        //   this.initCharts1(this.chooseDate);
        // this.initCharts2();
    },
    methods: {
    }

};
</script>
  
<style lang="scss" scoped>
.sdjs {
    height: 100%;

    .charts-box {
        .item {
            .title {
                color: #FFFFFF;
            }

            .time-box {
                margin-bottom: 10px;
            }

            .time-item {
                span {
                    color: #FFFFFF;
                }

                ::v-deep .el-input__inner {
                    background: #11305F;
                    border: 1px solid #3081FF;
                    color: #FFFFFF;
                }
            }

            .btn-box {
                .range {
                    span {
                        color: #FFFFFF;
                    }
                }
            }
        }
    }

    .device-name {
        margin: 10px 0;
        color: #1272fd;
    }

    .charts-box {
        display: flex;

        .item {
            flex: 1;

            .title {
                display: flex;
                justify-content: center;
                margin-bottom: 10px;
            }

            .time-box {
                display: flex;
                justify-content: center;
                height: 34px;
            }

            .echarts {
                height: 400px;
                position: relative;

                .detailContainer1,
                .detailContainer2 {
                    height: 400px;
                }

                .masterContainer1,
                .masterContainer2 {
                    height: 100px;
                    position: absolute;
                    top: 300px;
                }
            }
        }
    }

    .btn-box {
        display: flex;
        padding-left: 100px;

        .range {
            margin-right: 20px;
        }
    }

    .average-item {
        margin: 20px 0 20px 100px;

        .title {
            display: flex;
            font-weight: bold;
            margin-bottom: 10px;
            justify-content: flex-start !important;
        }

        .content {
            font-size: 16px;
            font-weight: 500;
        }
    }
}
</style>
  