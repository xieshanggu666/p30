<template>
  <div class="IndexBox">
    <div class="pd waveBox">
      <div :class="typeName"></div>
    </div>
  </div>
</template>

<script>
import Recorder from "recorder-core";
import PCMPlayer from "pcm-player";
import jsonData from "@/views/gis/mixin/voice.json";
import mqtt from "mqtt";
//需要使用到的音频格式编码引擎的js文件统统加载进来
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";

//以上三个也可以合并使用压缩好的recorder.xxx.min.js
//比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

//可选的扩展支持项
import "recorder-core/src/extensions/wavesurfer.view";

export default {
  props: {
    typeName: {
      type: String,
      default: "recwave",
    },
    params: {
      type: Object,
      default: '',
    }
  },
  data() {
    return {
      ws: null,
      player: null,
      timer: null,
      num: '',
      DB: '',
      recorder: null,
      interval: "",
      audioFileList: [],
      startTime: "",
      endTime: "",
      recorderTime: 0,
      voice: 0
    };
  },
  mounted() {
    this.play();
    // this.$nextTick(() => {
    //   console.log(WaveSurfer)
    //   this.wavesurfer = WaveSurfer.create({
    //     container: this.$refs.waveform,
    //     cursorColor:'red',
    //     backgroundColor:'gray',
    //     waveColor: 'violet',
    //     progressColor: 'purple',
    //     backend: 'MediaElement',
    //     mediaControls: false,
    //     audioRate: '1',
    //     plugins: [
    //       CursorPlugin.create({
    //         showTime: true,
    //         opacity: 1,
    //         customShowTimeStyle: {
    //           'background-color': '#000',
    //           color: '#fff',
    //           padding: '2px',
    //           'font-size': '10px'
    //         }
    //       }),
    //       Timeline.create({
    //         container: '#wave-timeline'
    //       }),
    //     ]
    //   });
    //   this.wavesurfer.on('error', function(e) {
    //     console.warn(e);
    //   });
    //   this.wavesurfer.load();
    //   // this.value = this.wavesurfer.getVolume() * 100
    // })
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    subscribe(topic) {
      this.client.subscribe(topic, { qos: 2 }, function (err) {
        if (!err) {
          console.log("voice subscribe success!");
        } else {
          //打印错误
          console.log("err", err);
        }
      });
    },

    randomSort(arr) {
      let newArr = arr.sort(function () {
        return Math.random() - 0.5;
      });
      return newArr;
    },
    voiceMqtt() {
      let _this = this;
      var options = {
        //mqtt客户端的id
        clientId: "mqttx_549d5d08",
        mTopic: 'radar/data/BBD1BF8CB0214333B45EE9A539DF47E2',
        keepAlive: 60,
        cleanSession: true,
      };
      // const clientUrl =`ws://test.caepiot.cn:20084/mqtt#${this.params.subscriptionUrl}`;
      const clientUrl = `ws://railway.iot.caepiot.cn:20084/mqtt`;

      this.client = mqtt.connect(clientUrl, options);
      this.client.on("connect", function () {
        console.log("连接成功voice close....", _this.params.subscriptionUrl);
        _this.subscribe(_this.params.subscriptionUrl);
      });
      this.client.on("message", function (topic, message) {
        console.log("接受获取消息voice", topic);
        console.log("接受获取消息voice", message);
        // _this.recev(topic, message);
      });
      this.client.on("error", function (err) {
        console.log("err=>", err);
      });
    },

    subscribe(topic) {
      this.client.subscribe(topic, { qos: 2 }, function (err) {
        if (!err) {
          console.log("voice subscribe success!");
        } else {
          //打印错误
          console.log("err", err);
        }
      });
    },

    play() {
      console.log(this.typeName);
      this.player = new PCMPlayer({
        encoding: "16bitInt",
        channels: 1,
        sampleRate: 32000,
        flushTime: 2000,
      });
      
      // Now feed PCM data into player getting from websocket or ajax whatever the transport you are using.
      // player.feed(pcm_data); websocket获取的数据
      // volume
      // destroy

      var wave;
      var set = {
        elem: `.${this.typeName}`,
        scale: 2, //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
        fps: 50, //绘制帧率，不可过高，50-60fps运动性质动画明显会流畅舒适，实际显示帧率达不到这个值也并无太大影响
        duration: 2500, //当前视图窗口内最大绘制的波形的持续时间，此处决定了移动速率
        direction: 1, //波形前进方向，取值：1由左往右，-1由右往左
        position: 0, //绘制位置，取值-1到1，-1为最底下，0为中间，1为最顶上，小数为百分比
        centerHeight: 1, //中线基础粗细，如果为0不绘制中线，position=±1时应当设为0

        //波形颜色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
        linear: [
          0,
          "rgba(76,249,239,1)",
          0.7,
          "rgba(255,215,0,1)",
          1,
          "rgba(255,102,0,1)",
        ],
        //中线css颜色，留空取波形第一个渐变颜色
        centerColor: "",
      };
      wave = Recorder.WaveSurferView(set);

      // var url = "ws://10.10.10.93:8888"; 
      // this.ws = new WebSocket(url);
      // this.ws.binaryType = "arraybuffer";

      // this.ws.addEventListener("open", function() {
      //   let jsonData = { state: "start", channel: "1" };
      // });
      // this.ws.addEventListener("message", function(event) {
      //   var dataAudio = new Uint8Array(event.data);
      //   that.player.feed(dataAudio)
      //   var data = new Uint16Array(event.data);
      // });

      var that = this;
      let dataA = jsonData.aerr[Math.floor(Math.random() * 3) + 0];
      this.timer = setInterval(() => {
        dataA = that.randomSort(dataA);
        var data = new Uint16Array(dataA);
        // console.log("data",data);
        wave.input(data, 20, 32000);
      }, 1000);
    },

    clearTimer() {
      if (this.interval) {
        this.num = 60;
        clearInterval(this.interval);
      }
    },
    beginOrStopRecorder() {
      if (this.interval) {
        this.stop();
      } else {
        this.clearTimer();
        this.startTime = new Date().getTime()
        var that = this;
        recording.get(rec => {
          if (rec) {
            if (this.flag) {
              this.mouseEnd();
              this.flag = false;
            } else {
              this.recorder = rec;
              this.interval = setInterval(() => {
                if (this.num <= 0) {
                  this.recorder.stop();
                  this.num = 60;
                  this.clearTimer();
                } else {
                  this.num--;
                  this.time = this.num;
                  this.recorder.start();
                  recording.recorder.onaudioprocess = function (e) {
                    var buffer = e.inputBuffer.getChannelData(0); //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
                    // 创建变量并迭代来获取最大的buffer中的音量值
                    var maxVal = 0;
                    for (var i = 0; i < buffer.length; i++) {
                      if (maxVal < buffer[i]) {
                        maxVal = buffer[i];
                      }
                    }
                    let DB = parseInt(maxVal * 10000);
                    console.log("dDB", DB);
                  };
                }
              }, 1000);
            }
          }
        });
      }

    },
    stop() {
      this.clearTimer();
      this.endTime = new Date().getTime();
      this.recorderTime = Math.round((this.endTime - this.startTime) / 1000);
      if (this.recorderTime < 1) {
        return;
      }
      if (this.recorder) {
        this.recorder.stop();
        this.num = 60;
        this.time = this.num;
        // 获取语音二进制文件
        let blob = this.recorder.getBlob();
        let url = URL.createObjectURL(blob);
        this.form.audioUrl = url;
        this.voice = 0;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.IndexBox {
  .waveBox {
    width: 90%;
    height: 80vh;
    display: flex;
    justify-content: center;
    margin: 0 auto;

    .recwave,
    .shake_1 {
      width: 100%;
      height: 98%;
    }
  }
}

.waves-ripple {
  position: absolute;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  background-clip: padding-box;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
  opacity: 1;
}

.waves-ripple.z-active {
  opacity: 0;
  -webkit-transform: scale(2);
  -ms-transform: scale(2);
  transform: scale(2);
  -webkit-transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out, -webkit-transform 0.6s ease-out;
}
</style>
