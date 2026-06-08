<template>
  <div class="d4-box">
    <div class="d4-box-content">
      <div class="d4-box-info">
        <span>监测点编号：{{ params.name }}</span>
        <span>设备编号：{{ params.deviceNo }}</span>
        <span>地址：{{ params.address }}</span>
        <span>经纬度：{{ params.longitude }}，{{ params.latitude }}</span>
      </div>
      <ul class="view-box">
        <li @click="handleShowContent('movie')">
          <movieClose ref="movie" :params="params" />
        </li>
        <li @click="handleShowContent('d4')">
          <d4close :params="params" ref="d4close" />
        </li>
        <li @click="handleShowContent('shake')">
          <shake :params="params" class="shake" />
        </li>
        <li @click="handleShowContent('voice')">
          <voice class="voice" :params="params" typeName="shake_1" />
        </li>
      </ul>
    </div>
    <!-- 右侧报警 -->
    <div class="earlyWarn-box" v-if="this.$store.state.eventDisplay == 1">
      <div class="warn-box">
        <div class="warn-status-box">
          <div v-for="itemStatus of warnStatusList" :key="itemStatus" class="outDiv">
            <div :class="
              !itemStatus.type
                ? 'icon-warning blingbling'
                : 'icon-success alarmDevice2'
            "></div>
            <span class="warn-status-label">{{ itemStatus.label }}</span>
          </div>
          <!-- 2 -->
          <div class="warn-message-box">
            <div class="warn-message-header">报警事件</div>
            <div class="warn-message-list">
              <div v-for="(item, index) of this.$store.state.warnMessageList" :key="index"
                style="display:flex;margin-left:40px">
                <div style="font-size: 8px;margin-right:5px">{{ item.createGmt }}</div>
                <!-- <div :style="item.type ? 'color:#F56C6C' : 'color:#67C23A'">
                  {{ item.title }}
                </div> -->
                <div v-if="item.title === '开启报警' || item.title === '关闭报警'">{{ item.title }}</div>
                <div v-if="item.title === '入侵报警'" style="color:#F56C6C">{{ item.title }}</div>
                <div v-if="item.title === '报警解除'" style="color:#67C23A">{{ item.title }}</div>
                <el-image v-if="item.img" fit="fill" class="preImg" :src="require('@/assets/dataMonitor/preViewer.png')"
                  :preview-src-list="item.img">
                </el-image>
              </div>
            </div>
          </div>
          <div class="button-box">
            <el-button type="primary" @click="handlePicture">手动拍照</el-button>
            <el-button v-if="flagList" type="primary" @click="stopWarn('false')">停用报警</el-button>
            <el-button v-if="!flagList" type="primary" @click="stopWarn('true')">启用报警</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="80%" custom-class="d4dialog" append-to-body
      destroy-on-close>
      <component :is="componentsType" ref="d4Component" :params="params" :flag="videoFlag" :myVideoSrc="videoSrc" />
    </el-dialog>
  </div>
</template>

<script>
import movieClose from "./components/movie";
import movie from "./components/movie_open_view";
import d4 from "./components/d4";
import d4close from "./components/d4_close";
import shake from "./components/shake";
import voice from "./components/voice";
import earlyWarn from "./components/earlyWarn";
// import { GetDeviceCmdInstruct, SwitchWarningRadarOnAlarm } from "@/api/page/dataMonitor/d4";
export default {
  components: { movie, d4, voice, shake, movieClose, d4close, earlyWarn },
  props: ["params", "flagList"],
  data() {
    return {
      dialogVisible: false,
      componentsType: "movie",
      dialogTitle: null,
      equipmentPointInfo: null,
      videoFlag: false,
      videoSrc: null,
      warnStatusList: [
        {
          label: "雷达状态",
          type: 0,
        },
        {
          label: "声呐状态",
          type: 0,
        },
        {
          label: "振动状态",
          type: 1,
        },
      ],
      flag: '',

    };
  },
  filters: {
    d4Filter: (value) => {
      switch (value) {
        case "movie":
          return "监控视频";
        case "d4":
          return "点云图";
        case "voice":
          return "声呐";
        case "shake":
          return "震动";
        default:
      }
    },
  },
  mounted() {
  },
  methods: {
    handlePicture() {
      this.$message.success("请构建手动拍照");
    },
    stopWarn(e) {
      this.onAlarm(e)
    },

    // 报警开关
    async onAlarm(e) {
      let params = {
        balarm: e,
        mnId: this.params.id,
      };
      let res = await SwitchWarningRadarOnAlarm(params);
      console.log("res报警结果", res);
      this.$message.success("报警开关操作成功");
      this.$emit('fatherMethod');
    },
    // 视频接口数据推流
    async getHls(state) {
      console.log("open index");
      let paramsType = state == "open" ? "VIDEO_START" : "VIDEO_STOP";
      let params = {
        cmdType: paramsType,
        nodeId: this.params.mnId ? this.params.mnId : this.params.id,
      };
      let res = await GetDeviceCmdInstruct(params);
      if (state == "open") {
        console.log("open index this.videoSrc!!!!!!", res.result);
        this.videoSrc = res.result;
        this.$refs.d4Component.initVideo(this.params.videoUrl);
      }
    },
    async initD4() {
      let paramsType = "RADAR_START";
      let params = {
        cmdType: paramsType,
        nodeId: this.params.mnId ? this.params.mnId : this.params.id,
      };
      let res = await GetDeviceCmdInstruct(params);
      this.params.subscriptionUrl = res.result;
      console.log("this.params.subscriptionUrl!!!!!!!!!!", res.result);

      this.$refs.d4close.initMqtt(this.params.videoUrl);
      console.log("this.params.videoUrl!!!!!!!!!!", this.params.videoUrl);
    },

    IndexGetInitVideo() {
      console.log(this.params, "this.params indexGet");
      this.$refs.movie.initVideo(this.params.videoUrl);
    },
    async shakeD4() {
      let paramsType = "IMU_START";
      let params = {
        cmdType: paramsType,
        nodeId: this.params.mnId ? this.params.mnId : this.params.id,
      };
      let res = await GetDeviceCmdInstruct(params);
      this.params.subscriptionUrl = res.result;
      console.log("shakeD4!!!!!!!!!!!!!!!!!!!!!!!!!!", res.result);
      this.$refs.d4shake.initMqttD4(this.params.videoUrl);
    },
    // 声呐
    async voice() {
      let paramsType = "PLAY_START";
      let params = {
        cmdType: paramsType,
        nodeId: this.params.mnId ? this.params.mnId : this.params.id,
      };
      let res = await GetDeviceCmdInstruct(params);
      this.params.subscriptionUrl = res.result;
      console.log("voice!!!!!!!!!!!!!!!!!!!!!!!!!!", res.result);
      this.$refs.voice.voiceMqtt(this.params.videoUrl);
    },
    handleShowContent(type) {
      this.componentsType = type;
      this.dialogVisible = true;
      this.dialogTitle = this.d4Filter(type);
      if (type == "movie") {
        this.getHls("open");
      }
      if (type == "d4") {
        setTimeout(() => {
          this.$refs.d4Component.initPoint();
          this.$refs.d4Component.animate();
          this.$refs.d4Component.initMqtt();
        }, 200);
      }
    },
    handleClose(done) {
      if (this.componentsType == "movie") {
        this.videoFlag = false;
        done();
      } else {
        done();
      }
    },
    d4Filter: (value) => {
      switch (value) {
        case "movie":
          return "监控视频";
        case "d4":
          return "点云图";
        case "voice":
          return "声呐";
        case "shake":
          return "震动";
        default:
          return "没有对应类型";
      }
    },
  },
  beforeUnmount() {
    this.indexFlag = false;
    console.log(this.indexFlag, "destroy");
    console.log("destroy");
    this.getHls("close");
  },
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  /* height: 719px; */
  /* margin-top: 85px; */
}

li {
  width: 48%;
  height: 300px;
  line-height: 300px;
  text-align: center;
  font-size: 26px;
  margin: 46px 10px;
  overflow: hidden;
}

.shake {
  height: 100%;
}

.voice {
  width: 100%;
  height: 100% !important;
  display: flex;
  align-items: center;
}

.button-box {
  display: flex;
  justify-content: space-around;
  height: 100px;
  align-items: center;
}

.d4-box {
  display: flex;
}

.d4-box-info {
  color: #ffffff;
  padding-left: 24px;
  margin-top: 12px;
}

.d4-box-info span {
  margin-right: 40px;
}

.d4-box-content {
  flex: 7;
}

.view-box {
  min-width: 1064px;
  margin-top: -20px;
}

.earlyWarn-box {
  flex: 2;
}

.warn-box {
  border-left: 1px rgba(33, 92, 182, 1) solid;
}

.warn-box ul {
  list-style: none;
}

.warn-status-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 144px;
  margin: 13px 0;
  letter-spacing: 4px;
  width: 100%;
  height: 100%;
  line-height: 40px;
}

.warn-status-box i {
  font-size: 20px;
}

.warn-status-label {
  font-size: 20px;
  margin-top: -2px;
  color: white;
}

.icon-warning {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #f56c6c;
  margin-right: 10px;
}

.icon-success {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #67c23a;
  margin-right: 10px;
}

.warn-message-box {
  border: 1px rgba(33, 92, 182, 1) solid;
  /* margin-top: 60px; */
  height: 472px;
  overflow-y: scroll;
  width: 90%;
  margin: auto;
}

.warn-message-header {
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  height: 58px;
  line-height: 58px;
  border-bottom: 1px rgba(33, 92, 182, 1) solid;
  width: 78%;
  margin: auto;
  font-weight: bold;
}

.warn-message-list {
  font-size: 14px;
  /* text-align: center; */
  color: #ffffff;
  cursor: help;
  width: 100%;
  margin: auto;
  /* flex-wrap: wrap; */
}

.warn-message-list i {
  font-size: 18px;
  margin-left: 6px;
  color: #ffffff;
  cursor: pointer;
}

.preImg {
  width: 23px;
  height: 23px;
  float: right;
  margin-top: 13px;
}

/* 整个滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #215cb6;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: hotpink;
}

/* 滚动条没有滑块的轨道部分 */
::-webkit-scrollbar-track-piece {
  background-color: #17407f;
}
</style>

<style>
.outDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.outDiv .blingbling {
  border-radius: 50%;
  -webkit-animation: scaleout 2.5s infinite ease-in-out;
  animation: scaleout 2.5s infinite ease-in-out;
}

@-webkit-keyframes scaleout {
  0% {
    -webkit-transform: scale(1.1);
    opacity: 0;
  }

  100% {
    -webkit-transform: scale(1);
  }
}

@keyframes scaleout {
  0% {
    transform: scale(1.1);
    -webkit-transform: scale(1.1);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
