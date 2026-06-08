<template>
  <div class="nier_ye">
    <div class="waic_" :style="{ height: starts ? '159px' : '83px' }">
      <div class="herder_s">
        <div class="he_l">
          <div class="yun_">
            <img src="../../../public/static/bigdata/tianq.png" />24
          </div>
          <div class="rhk_" @click="gogogo()">
            安全监测平台
          </div>
        </div>
        <!-- <img class="tus" src="../../../public/static/bigdata/title_.png" /> -->
        <div class="tus">中物设备运行监测中心</div>
        <div class="he_r">
          <div class="rice">
            <span @click="gogogoItem()" style="margin-left:35px"
              >智慧安全系统</span
            >
          </div>
          <!-- <div @click="ceamFly()">
            <span style="margin-left:60px">开始漫游</span>
          </div> -->
          <!-- <div @click="stopFly()">
          </div>
           <div @click="stopFly()">
          </div> -->
          <div class="rig_ce">
            <div class="ce_time">{{ nowTime }}</div>
            <div class="gh_fls">
              <div>{{ nowWeek }}</div>
              <div>{{ nowDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="starts" class="left_">
      <div class="le_yi2">
        <div class="buit_">
          <span style="margin-left:60px">设备实时运行情况</span>
        </div>
        <div class="niiu_he">
          <div class="nimuzi2">
            <div>设备总数：</div>
            <div>{{ totalCount }}</div>
          </div>
          <div class="nimuzi2">
            <div>在线数：</div>
            <div>{{ onlineCount }}</div>
          </div>
          <div class="nimuzi2">
            <div>平均故障率：</div>
            <div>{{ faultDeviceRate }}</div>
          </div>
          <div class="nimuzi2">
            <div>实时离线数：</div>
            <div>{{ offlineCount }}</div>
          </div>
        </div>
        <!-- <div class="niiu_he">

          <div
            v-for="(item, index) in CenterData"
            :key="index"
            class="nimuzi2"
            @click="goItem(item)"
          >
            <div class="item1">{{ item.name }}</div>
            <div class="item2">
              <count-to
                :start-val="item.value"
                :end-val="item.inValue"
                :duration="item.duration"
              />
            </div>
          </div>
        </div> -->
        <div class="buit_">
          <span style="margin-left:60px;">实时运行预警状况</span>
        </div>
        <div class="niiu_he2">
          <!-- <chart
            class="chart-box"
            :id="'bing'"
            style="width:400px;height:230px;margin-top:-30px"
          ></chart> -->
          <div
              class="page-example2"
            >
              <div
                style="display: inline-block;width:100%"
                
              >
                <el-table
                  :data="getOperationData"
                  style="width:100%"
                  class="top"
                >
                  <el-table-column
                    prop="Title"
                    label="预警标题"
                    align="center"
                  />
                  <el-table-column
                    prop="Content"
                    label="预警内容"
                    align="center"
                  />
                  <el-table-column
                    prop="CreateDate"
                    label="预警时间"
                    align="center"
                  />
                </el-table>

                <vue-seamless-scroll
                  :data="getOperationData"
                 :class-option="classOption1"
                  style="width: 100%"
                  class="seamless-warp"
                >
                  <el-table
                    :data="getOperationData"
                    style="width: 100%;"
                    class="bottom"
                  >
                    <el-table-column
                      prop="Title"
                      label="预警标题"
                      align="center"
                    />
                    <el-table-column
                      prop="Content"
                      label="预警内容"
                      align="center"
                    />
                    <el-table-column
                      prop="CreateDate"
                      label="预警时间"
                      align="center"
                    />
                  </el-table>
                </vue-seamless-scroll>
              </div>
            </div>
        </div>
        <div class="buit_">
          <span style="margin-left:60px;margin-top:-20px">项目设备在线率</span>
        </div>
        <div
          :style="{ height: this.contentStyleObj2.height }"
          style="width:400px;"
          class="sdsdd"
        >
          <div v-for="(item, index) in newData" :key="index">
            <div class="onlineItem">
              <div style="color:#ffffff;font-size:14px">
                {{ item.typeName }}：
              </div>
              <el-progress
                class="gradient-progress"
                :percentage="item.rate"
                style="flex:1"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="botts" v-if="starts"></div>

    <div v-if="starts" class="bot_cen2">
      <div class="buit_">
        <!-- 向下滚动table -->
        <span style="margin-left:60px;">设备实时故障情况</span>
        <div class="home-content">
          <el-scrollbar style="height: 100%;width:1410px">
            <div class="home-list">
              <div
                class="list-item"
                v-for="(item, index) in faultData"
                :key="index"
              >
                <!-- <div v-if="faultData.length <= 4" class="content2">
                  <div class="content-right">
                    <div class="name">{{ item.pointNum }}</div>
                    <div class="data" data-v-7f2e9c68="">
                      项目名称：{{ item.project }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      分组名称：{{ item.group_Name }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      故障时间：{{ item.lastDataTime }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      最新预警：{{ item.title }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      预警时间：{{ item.alarmTime }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      设备编号：{{ item.devID }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      设备类型：{{ item.typeName }}
                    </div>
                    <div class="btn">
                      <div class="item" @click="goteerR(item)">监测数据</div>
                      <div class="item" @click="goteerO(item)">运行数据</div>
                      <div class="item" @click="goteerW(item)">单相分析</div>
                    </div>
                  </div>
                  <div class="mouse-enter-class"></div>
                </div> -->

                <div class="content">
                  <div class="content-right">
                    <div class="name">{{ item.pointNum }}</div>
                    <div class="data" data-v-7f2e9c68="">
                      项目名称：{{ item.project }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      分组名称：{{ item.group_Name }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      最新预警：{{ item.title }}
                    </div>
                    <div class="data" data-v-7f2e9c68="">
                      故障时间：{{ item.lastDataTime }}
                    </div>

                    <div class="btn">
                      <div class="item" @click="goteerR(item)">监测数据</div>
                      <div class="item" @click="goteerO(item)">运行数据</div>
                      <div class="item" @click="goteerW(item)">单相分析</div>
                      <div class="item" @click="goteerS(item)">运行预警</div>
                    </div>
                  </div>
                  <div class="mouse-enter-class"></div>
                </div>
                <div
                  :class="[
                    item.type == '审批'
                      ? 'item-strengthen'
                      : item.type == '新增'
                      ? 'item-new'
                      : 'item-other',
                  ]"
                >
                  {{ item.type }}
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <!-- 中间 底部层 -->
    <div v-if="starts" class="bot_cen">
      <div class="buit_">
        <!-- 向下滚动table -->
        <span style="margin-left:60px;">实时预警信息情况</span>
      </div>
      <!-- <chartline class="chart-box" :id="'line'" style="width:400px;height:230px;margin-top:-30px"></chartline> -->
      <div>
        <div class="botcenInfo" @click="gobtn()">
          <el-button type="primary" size="mini">查询近30天预警信息</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="列表管理" name="first">
            <div
              class="page-example3"
              :style="{ height: this.contentStyleObj3.height }"
            >
              <div
                style="display: inline-block;width:calc(100vw - 540px)"
                :style="{ height: this.contentStyleObj3.height }"
              >
                <el-table
                  :data="getAlarmData"
                  style="width:calc(100vw - 540px)"
                  class="top"
                >
                  <el-table-column
                    prop="Title"
                    label="预警标题"
                    align="center"
                    width="320px"
                  />
                  <el-table-column
                    prop="Content"
                    label="预警内容"
                    align="center"
                    width="520px"
                  />
                  <el-table-column
                    prop="Level"
                    label="预警等级"
                    align="center"
                    width="120px"
                  />
                  <el-table-column
                    prop="CreateDate"
                    label="预警时间"
                    align="center"
                    width="160px"
                  />
                  <el-table-column label="操作" width="320px" align="center">
                    <template #default="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="handleR(scope.row)"
                        >监测数据</el-button
                      >
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleO(scope.row)"
                        >运行数据</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>

                <vue-seamless-scroll
                  :data="getAlarmData"
                  :class-option="classOptionInfo"
                  class="seamless-warp"
                  style="width: 100%"
                >
                  <el-table
                    :data="getAlarmData"
                    style="width: 100%;"
                    class="bottom"
                  >
                    <el-table-column
                      prop="Title"
                      label="预警标题"
                      align="center"
                      width="320px"
                    />
                    <el-table-column
                      prop="Content"
                      label="预警内容"
                      align="center"
                      width="520px"
                    />
                    <el-table-column
                      prop="Level"
                      label="预警等级"
                      align="center"
                      width="120px"
                    />
                    <el-table-column
                      prop="CreateDate"
                      label="预警时间"
                      align="center"
                      width="160px"
                    />
                    <el-table-column label="操作" width="320px" align="center">
                      <template #default="scope">
                        <el-button
                          size="mini"
                          type="primary"
                          @click="handleR(scope.row)"
                          >监测数据</el-button
                        >
                        <el-button
                          size="mini"
                          type="danger"
                          @click="handleO(scope.row)"
                          >运行数据</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </vue-seamless-scroll>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图表管理" name="second">
            <chartL
              class="chart"
              :id="'line'"
              :style="{ height: this.contentStyleObj.height }"
              style="width:calc(100vw - 540px);"
            ></chartL>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 中间 头部 -->

    <!-- 地震详情 start -->
    <!-- <div
      id="node-detail-box"
      :style="showPointDetailFlag ? nodeDetailStyle : ''"
    >
      <pointDetail
        v-if="showPointDetailFlag"
        ref="pointDetail"
        @CloseDetail="CloseDetail"
        :data="pointData"
      />
    </div> -->

    <!-- <div class="cen_top" v-if="starts"></div> -->

    <Device ref="device"></Device>
    <DeviceW ref="devicew"></DeviceW>

    <Record ref="record"></Record>
    <RecordW ref="recordw"></RecordW>
    <Analyse ref="analyse"></Analyse>
    <Warning ref="warning"></Warning>
    <OperationWarning ref="opw"></OperationWarning>
  </div>
</template>

<script>
import moment from "moment";
import mixinGis from "./mixinData/gis";
import chart from "./components/chartbar.vue";
import chartline from "./components/chartline.vue";
import chartL from "./components/chart.vue";
import mixinBasic from "./mixinData/basic";
import MixinIndex from "./mixinData/index";
import Record from "./components/Mon_Record.vue";
import RecordW from "./components/Mon_RecordW.vue";
import Device from "./components/Mon_Operation.vue";
import DeviceW from "./components/Mon_OperationW.vue";
import Analyse from "./components/Analyse_Uniphase.vue";
import pointDetail from "./components/point-detail/index.vue";
import Warning from "./components/Warning.vue";
import OperationWarning from "./components/OperationWarning.vue";

export default {
  name: "scroll",
  components: {
    chart: chart,
    chartL: chartL,
    Device: Device,
    DeviceW: DeviceW,
    Record: Record,
    RecordW: RecordW,
    Analyse: Analyse,
    Warning: Warning,
    pointDetail: pointDetail,
    chartline: chartline,
    OperationWarning: OperationWarning,
  },
  // mixins: [mixinGis, mixinBasic, MixinIndex],
  data() {
    return {
      starts: true, //显示图表
      gisStyle: null,
      activeName: "first",
      chartData: {},
      listData: [],
      nodeDetailStyle: {
        right: 0,
      },

      // 高度
      contentStyleObj: {
        width: "1200px",
        height: "",
      },
      contentStyleObj3: {
        width: "1200px",
        height: "",
      },
      contentStyleObj2: {
        height: "",
      },
      getDevGnss: {}, //设备在线离线
      getDevOther: {}, //设备在线离线
      getAlarmData: [], //预警信息表格
      getOperationData: [], //运行预警表格
      getBriefingData: [],
      getRepoetData: [],
      Timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
      form: {
        datePicker: {
          time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          defaultTime: [
            new Date(new Date() - 720 * 60 * 60 * 1000),
            new Date(),
          ],
        },
      },
      // 实时设备运行情况
      OnlineStatistic: "",
      totalCount: "",
      onlineCount: "",
      offlineCount: "",
      faultDeviceRate: "",
      newData: [],
      faultData: [
        // {
        //   project: "1",
        //   group_Name: "11",
        //   title: "11",
        //   lastDataTime: "11",
        // },
        //  {
        //   project: "1",
        //   group_Name: "11",
        //   title: "11",
        //   lastDataTime: "11",
        // }, {
        //   project: "1",
        //   group_Name: "11",
        //   title: "11",
        //   lastDataTime: "11",
        // }, {
        //   project: "1",
        //   group_Name: "11",
        //   title: "11",
        //   lastDataTime: "11",
        // }, {
        //   project: "1",
        //   group_Name: "11",
        //   title: "11",
        //   lastDataTime: "11",
        // },
      ],
      timer1Active: false,
      timer2Active: false,
      intervalId1: null,
      intervalId2: null,
    };
  },
  watch: {},
  created() {
    window.addEventListener("resize", this.onWindowResize);
  },
  mounted() {
    this.pageInit();
    this.getHeight();
    this.getHeight2();
    this.GeAlarmInfo();
    this.getOpData();

    this.Timer = setInterval(() => {
      this.setNowTimes();
    }, 1000);

    this.onWindowResize();
    setTimeout(() => {
      this.onWindowResize();
    }, 100);
  },
  destroyed() {
    window.removeEventListener("resize", this.onWindowResize);
    this.stopTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  computed: {
    classOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 0, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    classOption1() {
      return {
        step: 0.3, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    classOptionInfo() {
      return {
        step: 0.3, // 数值越大速度滚动越快
        limitMoveNum: 10, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },

  methods: {
    // 预警信息跳转数据按钮
    handleR(e) {
      let str = e.CreateDate;
      // var newStr = str.replace(/\//g, "-");
      this.$refs.recordw.openRecordw(e, str);
    },
    handleO(e) {
      let str = e.CreateDate;
      // var newStr = str.replace(/\//g, "-");
      this.$refs.devicew.openOperationW(e, str);
    },

    // tab切换
    handleClick(tab, event) {
      console.log(tab, event);
    },

    // 开始定时器
    startTimer() {
      if (!this.timer1Active) {
        this.intervalId1 = setInterval(() => {
          // 执行第一个定时器任务
          this.pageInit();
        }, 300000);
        this.timer1Active = true;
      }
    },
    // 清除定时器
    stopTimer() {
      if (this.intervalId1) {
        clearInterval(this.intervalId1);
        this.intervalId1 = null;
        this.timer1Active = false;
      }
    },
    // 屏幕
    onWindowResize() {
      const w = 1920;
      const h = 1080;
      const scaleW = document.body.clientWidth / w;
      const scaleH = document.body.clientHeight / h;
      const appDom = document.querySelector(".nier_ye") || null;
      appDom.style.cssText = `transform: scale(${scaleW})`;
      // appDom.style.cssText = `transform: scale(${scaleW}, ${scaleH})`;
    },
    setNowTimes() {
      //获取当前时间
      let myDate = new Date();
      let wk = myDate.getDay();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      );
      let hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      let sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let week = weeks[wk];
      this.nowDate = yy + "-" + mm + "-" + dd;
      this.nowTime = hou + ":" + min + ":" + sec;
      this.nowWeek = week;
    },

    // 适应屏幕
    getHeight() {
      this.startTimer();
      if (window.innerHeight < 768 || window.innerHeight < 1080) {
        this.contentStyleObj.height = "290px";
        this.contentStyleObj3.height = "290px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 630 + `px`;
        this.contentStyleObj3.height = window.innerHeight - 630 + `px`;
      }
    },

    getHeight2() {
      if (
        window.innerHeight < 768 ||
        window.innerHeight < 1080 ||
        window.innerHeight <= 1980
      ) {
        this.contentStyleObj2.height = "240px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 550 + `px`;
      }
    },

    // 设备故障跳转按钮
    goteerR(item) {
      this.$refs.record.openRecord(item);
    },
    goteerO(item) {
      this.$refs.device.openOperation(item);
    },
    goteerW(item) {
      this.$refs.analyse.openAnalyse(item);
    },
    goteerS(item) {
      this.$refs.opw.openAnalyse(item);
    },

    pageInit() {
      // 设备总数
      let url = "/api/Mon_DevOps_Manager/GetProjectOnlineStatistic";
      this.http.get(url, {}, true).then((result) => {
        this.OnlineStatistic = result.data;
        this.totalCount = result.data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.totalCount;
        }, 0);
        this.onlineCount = result.data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.onlineCount;
        }, 0);
        this.offlineCount = this.totalCount - this.onlineCount;
      });
      // 平均故障率
      this.http
        .get("/api/Mon_DevOps_Manager/GetFaultDeviceRate", {}, true)
        .then((result) => {
          this.faultDeviceRate = (result.data * 100).toFixed(2) + "%";
        });
      // 项目设备在线率
      this.typeOnlineStatistic();
      // 设备故障率
      this.faultDevice();
    },

    // 故障率
    faultDevice() {
      this.http
        .get("/api/Mon_DevOps_Manager/GetFaultDevice", {}, true)
        .then((result) => {
          this.faultData = result.data;
          this.faultData.forEach((item) => {
            item.type = "处理中"; // 将typeName作为type属性的值
          });
        });
    },
    // 项目设备在线率
    typeOnlineStatistic() {
      this.http
        .get("/api/Mon_DevOps_Manager/GetTypeOnlineStatistic", {}, true)
        .then((result) => {
          this.newData = result.data.map((item) => ({
            typeName: item.typeName,
            rate: Number(item.rate.slice(0, -1)), // 截取到位置-1，去掉%
            onlineCount: item.onlineCount,
            totalCount: item.totalCount,
          }));
          this.newData = this.newData.filter((device) => device.rate !== 0);
        });
    },
    // 返回组
    callback() {
      this.CallBackGroup();
    },

    // 时间过滤
    filterTime(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
    },

    // 
    Device(type, e) {
      switch (type) {
        case "gnss":
          this.$refs.device.openGnssDevice(type, e);
          break;
        case "other":
          this.$refs.device.openGnssDevice(type, e);
          break;
        default:
          break;
      }
    },

    //监测设备状态
    GetDevStatus() {
      this.http.get("api/BigScreen/GetDevStatus").then((result) => {
        this.getDevGnss = result.data.gnss;
        this.getDevOther = result.data.other;
      });
    },

    // 查询预警信息详情
    gobtn() {
      let startMT = this.filterTime(this.form.datePicker.defaultTime[0]);
      let endMT = this.filterTime(this.form.datePicker.defaultTime[1]);
      this.$refs.warning.openWarning(
        this.filterTime(startMT),
        this.filterTime(endMT)
      );
    },

    // 用于顶部跳转系统
    gogogo() {
      this.$router.replace("/bigdata");
    },
    gogogoItem() {
      this.$router.replace("/Mon_Point_Manager");
      // this.$router.replace("/Gomoku");
    },

    // 预警信息
    GeAlarmInfo() {
      // this.http.get("api/BigScreen/GeAlarmInfo").then((result) => {
      //   this.getAlarmData = result.data;
      // });
      const today = moment();
      const threeDaysAgo = moment().subtract(2, "days");
      const formattedToday = today.format("YYYY-MM-DD HH:mm:ss");
      const formattedThreeDaysAgo = threeDaysAgo.format("YYYY-MM-DD HH:mm:ss");
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      param.wheres = `[{"name":"CreateDate","value":"${formattedThreeDaysAgo}","displayType":"thanorequal"},{"name":"CreateDate","value":"${formattedToday}","displayType":"lessorequal"},{"name":"Deal_State","value":"0","displayType":"select"}]`;
      this.http
        .post("/api/Ala_Infomation/getPageData", param, true)
        .then((result) => {
          this.getAlarmData = result.rows;
          this.getAlarmData.forEach((item) => {
            if (item.Level === 0) {
              item.Level = "蓝色预警";
            } else if (item.Level === 1) {
              item.Level = "黄色预警";
            } else if (item.Level === 2) {
              item.Level = "橙色预警";
            } else {
              item.Level = "红色预警";
            }
          });

          //  this.total = result.total;
        });
    },

    // 运行预警
    getOpData(){
      // getOperationData
      const today = moment();
      const threeDaysAgo = moment().subtract(2, "days");
      const formattedToday = today.format("YYYY-MM-DD HH:mm:ss");
      const formattedThreeDaysAgo = threeDaysAgo.format("YYYY-MM-DD HH:mm:ss");
      var param = {
        order: "desc",
        page: 1,
        rows: 100,
        sort: "ID",
      };
      // param.wheres = `[{\'name\':\ 'CreateDate', \'value\':\' ${treeId}\'}]`;
      param.wheres = `[{"name":"CreateDate","value":"${formattedThreeDaysAgo}","displayType":"thanorequal"},{"name":"CreateDate","value":"${formattedToday}","displayType":"lessorequal"}]`;
      this.http
        .post("/api/Ala_Operationinfo/getPageData", param, true)
        .then((result) => {
          this.getOperationData = result.rows;
          this.getAlarmData.forEach((item) => {
            if (item.Level === 0) {
              item.Level = "蓝色预警";
            } else if (item.Level === 1) {
              item.Level = "黄色预警";
            } else if (item.Level === 2) {
              item.Level = "橙色预警";
            } else {
              item.Level = "红色预警";
            }
          });

          //  this.total = result.total;
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./css/index.scss";

::v-deep .el-tabs__nav-wrap::after {
  width: 0px !important;
}
::v-deep .el-tabs__item {
  color: rgb(219, 211, 211);
}

::v-deep .gradient-progress .el-progress-bar__inner {
  background: linear-gradient(to right, #ffc107, #ff5722);
}

::v-deep .el-progress__text {
  color: #ffffff;
}
//
::v-deep .buit_ .el-table__header-wrapper .el-table__header {
  width: 390px !important;
}
::v-deep .buit_ .el-table__body {
  width: 390px !important;
}

::v-deep .bot_cen .el-table__header-wrapper .el-table__header {
  width: 980px !important;
}
::v-deep .bot_cen .el-table__body {
  width: 980px !important;
}
::v-deep .el-table {
  background-color: rgba(9, 84, 177, 0.1);
}
::v-deep .el-table tr {
  background-color: transparent;
  color: white;
}

::v-deep.el-table th {
  background-color: rgba(91, 100, 228, 0.3);
}
::v-deep.el-table td {
  // background-color: rgba(19, 70, 131, 0.7) !important;
}

::v-deep .el-table th > .cell {
  color: white;
}
::v-deep .el-table td.el-table__cell {
  // background-color: rgba(39, 115, 207, 0.3) !important;
}

::v-deep.el-table td.el-table__cell {
  border-bottom: 0.5px solid rgb(108, 110, 119);
}

::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: rgba(91, 100, 228, 0.3);
}

.min {
  padding: 20px 88px;
}
.min2 {
  padding: 30px 20px;
}
.min3 {
  padding: 22px 20px;
}
.page-example {
  display: flex;
  width: 390px;
  overflow: hidden;
  border: 1px solid skyblue;
}
.page-example2 {
  display: flex;
  width: 390px;
  height: 210px;
  overflow: hidden;
  border: 1px solid skyblue;
}
.seamless-warp2 {
  height: 300px;
  overflow: hidden;
}

.page-example3 {
  display: flex;
  width: calc(100vw - 540px);
  overflow: hidden;
  border: 1px solid skyblue;
  margin-top: 20px;
}
::v-deep .top .el-table__body-wrapper {
  display: none;
}
::v-deep .bottom .el-table__header-wrapper {
  display: none;
  width: 100%;
}
.seamless-warp {
  height: 400; //预警表格
  overflow: hidden;
}
.middle {
  .middle-top {
    .content {
      position: absolute;
      top: 100px;
      left: 80px;
      background-position: center;
      background-repeat: no-repeat;
      text-align: center;
      display: block;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;

      #content-block {
        span {
          margin: 0;
          width: auto;
        }
      }

      .block-font {
        font-size: 20px;
        border-bottom: 1px solid #ab3fcc;
        padding-bottom: 5px;
      }

      .block-title {
        font-size: 20px;
        padding-top: 5px;
      }

      .block-0 {
        height: 142px;
        width: 300px;
        background-position: center;
        background-repeat: no-repeat;
        display: inline-block;
        padding: 20px 28px;
        box-sizing: border-box;
      }

      span {
        margin-top: 140px;
        width: 89px;
        margin-right: 10px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .middle-bottom {
    // .echarts-box {
    //   height: 320px;
    // }
  }
}

.nier_ye {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #000;
}
.botcenInfo {
    width: 100px;
    position: absolute;
    top: 66px;
    left: 210px;
    color: black;
    cursor: pointer;
    z-index: 99999;
  }
.waic_ {
  width: 100%;
  height: 159px;
  background: url("../../../public/static/bigdata/head_.png") no-repeat center;
  background-size: 100% 100%;
}
.herder_s {
  width: 100%;
  height: 105px;
  position: fixed;
  // z-index: 9999;
  background: url("../../../public/static/bigdata/herder.png") no-repeat center;
  background-size: 100% 100%;
  display: flex;
}
.he_l {
  width: calc((100% - 890px) / 2);
  height: 50px;
  position: absolute;
  left: 0;
}
.yun_ {
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: #37abf5;
  line-height: 34px;
  position: absolute;
  left: 28px;
  top: 35px;
}
.yun_ > img {
  width: 34px;
  height: 34px;
  margin-right: 8px;
}
.he_r {
  width: calc((100% - 890px) / 2);
  height: 100px;
  position: absolute;
  right: 0;
}
.rice {
  width: 304px;
  height: 34px;
  line-height: 34px;
  position: absolute;
  left: 15px;
  font-size: 16px;
  top: 36px;
  cursor: pointer;
  color: #39b1fe;
  background: url("../../../public/static/bigdata/righ_y.png") no-repeat center;
  background-size: 100% 100%;
}
.rig_ce {
  right: 17px;
  top: 37px;
  position: absolute;
  display: flex;
  align-items: center;
}
.ce_time {
  font-size: 28px;
  color: #39b1fe;
  margin-right: 16px;
}
.gh_fls {
  font-size: 15px;
  color: #39b1fe;
  margin-bottom: 5px;
}
.rhk_ {
  width: 304px;
  height: 34px;
  line-height: 34px;
  position: absolute;
  right: 15px;
  top: 36px;
  background: url("../../../public/static/bigdata/lef_y.png") no-repeat center;
  background-size: 100% 100%;
  font-size: 16px;
  color: #39b1fe;
  text-align: left;
  padding-left: 77px;
  cursor: pointer;
  box-sizing: border-box;
}
.tus {
  // width: 890px;
  // height: 56px;
  font-size: 38px;
  position: absolute;
  color: #ffffff;
  top: 13px;
  left: 50%;
  transform: translateX(-50%);
}
.left_ {
  height: calc(100vh - 115px);
  width: 438px;
  position: fixed;
  z-index: 999;
  top: 105px;
  left: 0px;
  background: url("../../../public/static/bigdata/letbg.png") no-repeat center;
  background-size: 100% 100%;
}
.le_yi {
  padding: 13px 10px;
  box-sizing: border-box;
}
.le_yi2 {
  padding: 13px 22px;
  box-sizing: border-box;
}
.buit_ {
  width: 219px;
  height: 42px;
  font-size: 16px;
  line-height: 42px;
  color: #fff;
  background: url("../../../public/static/bigdata/titbg.png") no-repeat center;
  background-size: 100% 100%;
  position: relative;
}
.tab_ {
  width: 100%;
  margin-top: 17px;
  border: none;
}
.tab_ thead {
  width: 100%;
  height: 34px;
  color: #fff;

  background: linear-gradient(
    to bottom,
    rgba(0, 144, 255, 0.1),
    rgba(51, 147, 255, 0.2)
  );
  box-shadow: 0px -1px 0px 0px rgba(51, 147, 255, 0.6);
}
.tab_ tr {
  height: 38px;
  border: none;
  background: rgba(0, 222, 255, 0.04);
}
.tab_ th {
  border: none;
  font-size: 13px;
  font-weight: 400 !important;
  text-align: center;
}
.tab_ td {
  font-size: 12px;
  color: #95bdff;
  text-align: center;
  border: none;
}
.niiu_he {
  margin-top: 19px;
  width: 100%;
  height: 320px;
  overflow: hidden;
  overflow-y: scroll;
}
.niiu_he::-webkit-scrollbar {
  width: 0;
}

.niiu_he3 {
  width: 100%;
  height: 220px;
}
.niiu_he3 ::-webkit-scrollbar {
  width: 0;
}

.niiu_he2 {
  margin-top: 19px;
  width: 100%;
  height: 220px;
  overflow: hidden;
  overflow-y: scroll;
  .onlineItem {
    display: flex;
    margin-top: 4px;
  }
}
.sdsdd {
  overflow: hidden;
  overflow-y: scroll;
  .onlineItem {
    display: flex;
    margin-top: 4px;
  }
}
.sdsdd::-webkit-scrollbar {
  width: 0;
}
.niiu_he2::-webkit-scrollbar {
  width: 0;
}

.niiu_he4 {
  margin-top: 19px;
  width: 100%;
  height: 260px;
  overflow: hidden;
  overflow-y: scroll;
}
.niiu_he4::-webkit-scrollbar {
  width: 0;
}
.nimuzi {
  width: 100%;
  height: 88px;
  background: url("../../../public/static/bigdata/liut.png") no-repeat center;
  background-size: 100% 100%;
  margin-bottom: 14px;
  padding: 17px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.nimuzi3 {
  width: 100%;
  height: 40px;
  background: url("../../../public/static/bigdata/liut.png") no-repeat center;
  background-size: 100% 100%;
  margin-bottom: 14px;
  padding: 17px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // align-items: center;
  cursor: pointer;
  color: #ffffff;

  .item1 {
    font-size: 18px;
    color: #ffffff;
  }
  .item2 {
    display: flex;
    justify-content: flex-end;
    font-size: 24px;
    color: #ffffff;
  }
}

.nimuzi2 {
  width: 100%;
  height: 60px;
  background: url("../../../public/static/bigdata/liut.png") no-repeat center;
  background-size: 100% 100%;
  margin-bottom: 14px;
  padding: 17px 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // align-items: center;
  cursor: pointer;
  color: #ffffff;

  .item1 {
    font-size: 18px;
    color: #ffffff;
  }
  .item2 {
    display: flex;
    justify-content: flex-end;
    font-size: 24px;
    color: #ffffff;
  }
}
.sui_img {
  width: 54px;
  height: 54px;
  margin-right: 25px;
}
.liu_l {
  text-align: left;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 4px;
}
.sid_z {
  display: flex;
  font-size: 18px;
}
.zaixian {
  color: #41ff5c;
  cursor: pointer;
}
.zaixian > label {
  color: #fff;
  margin-left: 10px;
}
.zaixian2 {
  color: #fff;
  // float: right;
  display: flex;
  justify-content: flex-end;
}
.lixin {
  color: #ffef40;
  margin-left: 49px;
  cursor: pointer;
}
.lixin > label {
  color: #fff;
  margin-left: 10px;
}

.zuhaun {
  width: 100%;
  height: calc(100% - 42px);
}
.botts {
  width: 100%;
  // height: 160px;
  background: url("../../../public/static/bigdata/bots.png") no-repeat center;
  background-size: 100% 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
}
.bot_cen2 {
  background: url("../../../public/static/bigdata/bot_cen.png") no-repeat center;
  background-size: 100% 100%;
  width: calc(100vw - 480px);
  height: 355px;
  left: 62%;
  top: 105px;
  transform: translateX(-50%);
  position: fixed;
  z-index: 99;
  padding: 18px 22px;
  box-sizing: border-box;
  .home-content {
    width: calc(100vw - 400px);
    height: 280px;
    position: absolute;
    box-sizing: border-box;

    .home-list {
      margin: 20px;
      // display: grid;
      display: flex;
      // flex-wrap: wrap;
      flex-wrap: nowrap;
      -moz-column-gap: 12px;
      column-gap: 12px;
      grid-template-columns: repeat(5, auto);
    }

    .list-item {
      width: 335px;
      position: relative;
      cursor: pointer;
      margin-bottom: 12px;
      transition: transform 0.8s;
      .content2 {
        position: relative;
        height: 360px; //每个框的宽度
        // padding-left: 40px;
        background: rgba(51, 147, 255, 0.8);
        display: flex;
        align-items: center;
        transition: all 1.5s;
        border-radius: 5px;
        overflow: hidden;

        .content-right {
          color: #1d252f;
          padding: 0px 10px;

          .el-icon-warning-outline {
            margin-right: 5px;
          }
        }

        .name {
          transition: transform 0.5s;
          color: white;
          font-size: 18px;
          font-weight: 500;
          padding-top: 5px;
        }

        .data {
          font-size: 12px;
          font-family: Source Han Sans CN, sans-serif;
          color: #e7dede;
          margin-top: -10px;
        }
        .btn {
          width: 330px;
          margin-top: 15px;
          display: flex;
          font-size: 12px;
          color: #000;
          position: relative;
          z-index: 9999;
          .item {
            margin-right: 20px;
            width: 110px;
            height: 30px;
            border-radius: 15px;
            background-color: rgba(190, 205, 218, 0.6);
          }
        }
      }
      .content {
        position: relative;
        height: 220px; //每个框的宽度
        // padding-left: 40px;
        background: rgba(51, 147, 255, 0.8);
        display: flex;
        align-items: center;
        transition: all 1.5s;
        border-radius: 5px;
        overflow: hidden;

        .content-right {
          color: #1d252f;
          padding: 0px 10px;

          .el-icon-warning-outline {
            margin-right: 5px;
          }
        }

        .name {
          transition: transform 0.5s;
          color: white;
          font-size: 16px;
          font-weight: 500;
          padding-top: 5px;
        }

        .data {
          font-size: 12px;
          font-family: Source Han Sans CN, sans-serif;
          color: #e7dede;
          margin-top: -10px;
        }
        .btn {
          width: 330px;
          display: flex;
          font-size: 12px;
          color: #000;
          position: relative;
          z-index: 9999;
          .item {
            margin-right: 20px;
            width: 110px;
            height: 30px;
            border-radius: 15px;
            background-color: rgba(190, 205, 218, 0.6);
          }
        }
      }

      .mouse-enter-class {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 40px;
        border-bottom: 3px #0763ee solid;
        transition: 1s;
      }
    }
  }

  .list-item:hover {
    transform: scale(1.04);
    .content {
      background: #ecf5f9;

      .mouse-enter-class {
        width: 100%;
      }
      .name {
        transition: transform 0.5s;
        color: rgb(87, 85, 85);
        font-size: 16px;
        font-weight: 500;
        padding-top: 5px;
      }

      .data {
        font-size: 12px;
        font-family: Source Han Sans CN, sans-serif;
        color: #535050;
        margin-top: -10px;
      }
    }
  }

  .home-list-content {
    margin: -12px 12px;
    background: #ffff;
    padding: 20px;
    display: flex;
    margin-bottom: 12px;
  }

  .contact {
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    margin-left: 24px;
    color: #8e8888;

    img {
      height: 15px;
      margin-bottom: -3px;
      margin-right: 5px;
    }
  }

  .item-strengthen,
  .item-new,
  .item-other {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    padding: 2px 10px;
    background: #daf3ff;
    border-bottom-left-radius: 6px;
    color: #339aed;
    border-top-right-radius: 5px;
  }

  .item-new {
    background: #ffebe9;
    color: #f94638;
  }

  .item-other {
    background: #e1fae2;
    color: #2ad431;
  }
}
.bot_cen {
  background: url("../../../public/static/bigdata/bot_cen.png") no-repeat center;
  background-size: 100% 100%;
  width: calc(100vw - 480px);
  height: calc(100vh - 480px);
  left: 62%;
  bottom: 10px;
  transform: translateX(-50%);
  position: fixed;
  z-index: 99;
  padding: 18px 22px;
  box-sizing: border-box;
  
}
.heihei_ {
  width: 100%;
  height: 180px;
  margin-top: 20px;
  display: flex;
}
.nidt {
  width: 116px;
  padding: 7px;
  box-sizing: border-box;
  margin-right: 16px;
}
.nidt > img {
  width: 100px;
  height: 100px;
}
.nidt > div {
  text-align: center;
}
.name_y {
  font-size: 14px;
  color: #ffffff;
}
.bumen_s {
  font-size: 18px;
  color: #37abf5;
  margin-top: 10px;
}
.ech_bui {
  width: 100%;
  height: calc(100vh - 710px);
}
.cen_top {
  display: flex;
  align-items: center;
  position: absolute;
  top: 107px;
  left: 50%;
  transform: translateX(-50%);
  height: 49px;
  width: 1016px;
}
.cen_top > div {
  width: 147px;
  height: 49px;
  line-height: 49px;
  text-align: center;
  color: #ffffff;
  position: relative;
}
.act_s {
  color: #fff !important;
}
.cen_top > div > img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.cen_top > div > label {
  position: absolute;
  left: 30px;
  top: -10px;
  cursor: pointer;
  color: #73bfff;
}

.sp_w {
  position: fixed;
  z-index: 9999;
  top: 200px;
  left: 500px;
  color: #fff;
}
.geClassmodel {
  position: fixed;
  z-index: 9999;
  left: 900px;
  color: #fff;
  display: flex;
  align-items: center;
}
.geClassmodel > div {
  width: fit-content;
  padding: 2px 10px;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 10px;
  background: #95bdff;
}
.modelAddress {
  display: flex;
  flex-direction: column;
  position: absolute;
  max-height: 100vh;
  overflow: auto;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  z-index: 1;
  span {
    margin: 10px;
    cursor: pointer;
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #78b4b4;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: #ededed;
  }
}
</style>
