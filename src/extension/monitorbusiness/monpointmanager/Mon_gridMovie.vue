<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看监控视频"
      :height="625"
      :width="1210"
      :padding="15"
      :on-model-close="closeCustomModel"
    >
      <div style="position:relative;" v-html="videohtml"></div>
    </vol-box>
  </div>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import videojs from "video.js";
import "videojs-contrib-hls";
import "@videojs/http-streaming";
export default {
  components: { "vol-box": VolBox },
  methods: {},
  data() {
    return {
      model: {
        box: false,
        hls: "",
      },
      player: null,
      url: "",
    };
  },
  methods: {
    openMovie(row) {
      this.model.box = true;
      this.url = JSON.parse(row.Config).url;
      this.videohtml = `<video id="video" class="video-js vjs-default-skin" style="width: 1180px;height: 550px;"preload="auto"> <source src="${this.url}" type="application/x-mpegURL"/> </video>`;
      setTimeout(() => {
        this.$nextTick(() => {
          this.player = videojs(
            "video",
            {
              bigPlayButton: false,
              textTrackDisplay: false,
              posterImage: true,
              errorDisplay: false,
              controlBar: false,
              muted: true, //静音模式 、、 解决首次页面加载播放。
            },
            function() {
              this.play(); // 自动播放
            }
          );
        });
      }, 300);
    },

    closeCustomModel() {
      this.model.box = false;
      if (this.player != null) {
        this.player.dispose();
        this.videohtml = "";
      }
    },
  },
};
</script>
<style lang="less">
.video-js {
  width: 1170px;
  height: 530px;
}
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
</style>
