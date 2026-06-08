<template>
  <div>
    <div v-show="!isError">
      <video
        id="videobox"
        class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
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
        "videobox",
        {
          bigPlayButton: true,
          textTrackDisplay: true,
          posterImage: true,
          errorDisplay: false,
          controlBar: false,
          playbackRates: [0.5, 1, 1.5, 2],
          sources: [
            {
              src: url,
              type: "application/x-mpegURL",
            },
          ],
        },
        function onPlayerReady() {
          this.play();
          var mediaError = this.error();
          if (mediaError != null && mediaError.code) {
            _this.isError = true;
          }
        }
      );
    },
  },
  beforeDestroy() {
    console.log("destroy");
    const videoDom = this.$refs.videoRef; 
    videojs(videoDom).dispose();
  },
};
</script>

<style>
</style>