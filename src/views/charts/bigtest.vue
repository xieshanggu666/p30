<template>
  <div class="nier_ye">
    <div class="waic_" :style="{ height: starts ? '159px' : '83px' }">
      <div class="herder_s">
        <!-- <img class="tus" src="../../../public/static/bigdata/title_.png" /> -->
        <div class="tus">安全监测平台</div>
        <div class="he_r">
          <div class="rice">
            <span @click="ceamFly()" style="margin-left:35px">开始</span>
            <span @click="stopFly()" style="margin-left:35px">暂停</span>
            <span @click="continueFly()" style="margin-left:35px">继续</span>
            <span @click="exitFly()" style="margin-left:35px">停止</span>
            <span @click="callback()" style="margin-left:35px">返回监测组</span>
          </div>
          <!-- <div @click="ceamFly()">
            <span style="margin-left:60px">开始漫游</span>
          </div> -->
          <!-- <div @click="stopFly()">
          </div>
           <div @click="stopFly()">
          </div> -->
        </div>
      </div> 
    </div>

    <!-- 3D地图id -->
    <div id="gisBox" v-bind:style="gisStyle"></div>
    <!-- <div class="cen_top" v-if="starts"></div> -->
    <!-- <Warning ref="warning"></Warning>
    <Device ref="device"></Device> -->

    <div id="dialog" class="dialog">
      <div class="d-heder">
        <span>TPsjg06</span>
        <div class="tool" @click="close">x</div>
      </div>
      <div class="d-content">
        <div class="d-p">
          <p>
            日水平位移-2.4mm;日沉降-13.1mm;日合位移-12.2mm;七日累计水平位移0.7mm;七日累计沉降-4.8mm;七日累计合位移-4.1mm;当前累计水平位移2.3mm;当前累计沉降0.7mm;当前累计合位移2.4mm;
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinGis from "./mixintest/gis";
import chart from "./components/chart.vue";
import mixinBasic from "./mixintest/basic";
import MixinIndex from "./mixintest/index";
import Warning from "./components/Warning.vue";
import Device from "./components/Device.vue";
import pointDetail from "./components/point-detail/index.vue";
export default {
  name: "scroll",
  components: {
    chart: chart,
    Device: Device,
    Warning: Warning,
    pointDetail: pointDetail,
  },
  mixins: [mixinGis, mixinBasic, MixinIndex],
  data() {
    return {
      starts: true, //显示图表
      gisStyle: null,
      chartData: {},
      listData: [],
      nodeDetailStyle: {
        right: 0,
      },
      list: [
        {
          fileName: "测试1",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试2",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试3",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试4",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试5",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试6",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试7",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试8",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试9",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试10",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
      ],
      // 高度
      contentStyleObj: {
        height: "",
      },
      getDevGnss: {}, //设备在线离线
      getDevOther: {}, //设备在线离线
      getAlarmData: [], //预警信息表格
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
    };
  },
  watch: {},
  created() {
    window.addEventListener("resize", this.getHeight);
  },
  mounted() {
    this.pageInit();
    this.getHeight();
    this.GetDevStatus();
    this.GeAlarmInfo();

    this.GetReport();
    this.GetBriefing();
    this.Timer = setInterval(() => {
      this.setNowTimes();
    }, 1000);
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
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
        step: 0.5, // 数值越大速度滚动越快
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
        step: 0.5, // 数值越大速度滚动越快
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
    // 弹框关闭
    close() {
      let dialogElement = document.getElementById("dialog");
      dialogElement.style.display = "none";
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

    getHeight() {
      if (window.innerHeight < 768 || window.innerHeight < 1080) {
        this.contentStyleObj.height = "135px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 800 + `px`;
      }
    },
    pageInit() {
      this.gisInit();
    },

    callback() {
      this.CallBackGroup();
    },

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

    goItem(e) {
      switch (e.name) {
        case "今日预警数":
          let startTime = this.filterTime(this.form.datePicker.time[0]);
          let endTime = this.filterTime(this.form.datePicker.time[1]);
          this.$refs.warning.openWarning(startTime, endTime);
          break;
        case "本月预警数":
          //
          let startMT = this.filterTime(this.form.datePicker.defaultTime[0]);
          let endMT = this.filterTime(this.form.datePicker.defaultTime[1]);
          this.$refs.warning.openWarning(startMT, endMT);
          break;
        default:
          break;
      }
    },
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
    // 预警信息
    GeAlarmInfo() {
      this.http.get("api/BigScreen/GeAlarmInfo").then((result) => {
        this.getAlarmData = result.data;
      });
 
    },

    // 监测简报 GET
    GetBriefing() {
      this.http.get("api/BigScreen/GetSimpleReportInfo").then((result) => {
        this.getBriefingData = result.data;
        console.log("监测简报", result);
      });
    },

    // 获取评估报告
    GetReport() {
      this.http.get("api/BigScreen/GetEvaluationinfo").then((result) => {
        // this.getAlarmData=result.data
        this.getRepoetData = result.data;
        console.log("评估报告", result);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.dialog {
  padding: 0;
  margin: 0;
  width: 310px;
  position: absolute;
  top: 50px;
  left: 50px;
  background-color: white;
  // border: 1px solid rgb(85, 81, 81);
  padding: 10px;
  display: none;

  overflow: hidden;
  padding: 0;
  margin: 0;

  img {
    padding: 5px 5px 0 5px;
  }

  .d-p {
    padding: 5px;

    p {
      width: 300px;
      text-indent: 2em;
      text-align: left;
    }
  }
}

.d-heder {
  width: calc(100% - 10px);
  height: 30px;
  overflow: hidden;
  margin: 0;
  padding: 5px 5px 0 5px;
  display: flex;
  // align-items: center;
  justify-content: space-between;

  color: #fff;
  background-color: #01c6f7;
  display: flex;

  span {
    display: block;
  }

  .tool {
    width: 20px;
    height: 30px;
    color: aliceblue;
  }

  .tool:hover {
    cursor: pointer;
    color: rgb(255, 213, 0);
  }
}
@import "./css/index.scss";
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
  height: 220px;
  overflow: hidden;
  border: 1px solid skyblue;
}
.seamless-warp2 {
  height: 200px;
  overflow: hidden;
}

.page-example3 {
  display: flex;
  width: 980px;
  height: 210px;
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
  height: 229px;
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
        font-size: 30px;
        border-bottom: 1px solid #ffffff;
        padding-bottom: 14px;
      }

      .block-title {
        font-size: 28px;
        padding-top: 12px;
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
  z-index: 9999;
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
  height: 310px;
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

.nimuzi2 {
  width: 100%;
  height: 88px;
  background: url("../../../public/static/bigdata/liut.png") no-repeat center;
  background-size: 100% 100%;
  margin-bottom: 14px;
  padding: 17px 30px;
  box-sizing: border-box;
  // display: flex;
  // align-items: center;
  cursor: pointer;

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
.right_ {
  height: calc(100vh - 115px);
  width: 438px;
  position: fixed;
  z-index: 999;
  top: 105px;
  right: 0px;
  background: url("../../../public/static/bigdata/righ_s.png") no-repeat center;
  background-size: 100% 100%;

  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  // padding: 13px 17px;
  box-sizing: border-box;
}
.right_ > div {
  flex: 1;
}
.zuhaun {
  width: 100%;
  height: calc(100% - 42px);
}
.botts {
  width: 100%;
  height: 160px;
  background: url("../../../public/static/bigdata/bots.png") no-repeat center;
  background-size: 100% 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
}
.bot_cen {
  background: url("../../../public/static/bigdata/bot_cen.png") no-repeat center;
  background-size: 100% 100%;
  width: calc(100vw - 900px);
  height: 317px;
  left: 50%;
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
