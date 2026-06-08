<template>
  <div>
    <div v-show="!isError">
      <video
        id="videobox2"
        class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
        controls
        muted 
        webkit-playsinline="true"
        playsinline="true"
        type="application/x-mpegURL"
        allowsInlineMediaPlayback="YES"
        width="100%"
        ref="videoRef"
        x5-video-player-fullscreen="true"
      >
        <p class="vjs-no-js">不支持播放</p>
      </video>
    </div>
    <div v-show="isError" class="errorTip"><p>视频出错了！</p></div>
  </div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
// import { GetDeviceCmdInstruct } from "@/api/page/dataMonitor/d4";

// http://chengdu.jianyang.rtmp.xl02.cn:19080/live/1409765877104041985/hls.m3u8?Session=1fEWW66MDmCoBMwGmFmYwdi9sQYVrV1pVGChm3eEWp2X7xrbf4NVPPOwesuiFt9J092LZ
// https://www.huoshanren.club:5000/assets/2021/07/16/3cb3b56c-7984-4fad-ad76-4f749df508a9.m3u8
export default {
  props: ["params", "flag", "myVideoSrc"],
  data() {
    return {
      isError: false,
    };
  },
  methods: {
    async getHls(state) {
      let paramsType = state == "open" ? "VIDEO_START" : "VIDEO_STOP";
      let params = {
        cmdType: paramsType,
        nodeId: this.params.mnId ? this.params.mnId : this.params.id,
      };
      let res = await GetDeviceCmdInstruct(params);
      if (state == "open") {
        this.initVideo();
      }
    },
    initVideo(url) {
      console.log("init myVideoSrc url",this.myVideoSrc,url);
      var player = videojs(
        "videobox2",
        {
          bigPlayButton: true,
          textTrackDisplay: true,
          posterImage: true,
          errorDisplay: false,
          controlBar: false,
          playbackRates: [0.5, 1, 1.5, 2],
          ControlBar: {
            customControlSpacer: false,
          },
          sources: [
            // 注意，如果是以option方式设置的src,是不能实现 换台的 (即使监听了nowPlayVideoUrl也没实现)
            {
              //play_result[0].url
              src: url,
              type: "application/x-mpegURL", // 告诉videojs,这是一个hls流
            },
          ],
        },
        function onPlayerReady() {
          this.play();
          //延时确保能监听到视频源错误
          var mediaError = this.error();
          if (mediaError != null && mediaError.code) {
            _this.isError = true;
          }
        }
      );
    },
  },
  beforeDestroy() {
    this.indexFlag = false;
    console.log(this.indexFlag, "destroy movie");
    // this.getHls("close");
    const videoDom = this.$refs.videoRef; //不能用document 获取节点
    videojs(videoDom).dispose();
  },
};
</script>

<style>
</style>