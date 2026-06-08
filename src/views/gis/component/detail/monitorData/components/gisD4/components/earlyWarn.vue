<template>
  <div class="warn-box">
    <ul class="warn-status-box">
      <li v-for="itemStatus of warnStatusList" :key="itemStatus" class="outDiv">
        <div  :class="
            !itemStatus.type
              ? 'icon-warning blingbling'
              : 'icon-success alarmDevice2'
          ">
        </div>
        <span class="warn-status-label">{{ itemStatus.label }}</span>
      </li>
    </ul>
    <div class="warn-message-box">
      <div class="warn-message-header">报警事件</div>
      <ul class="warn-message-list">
        <li v-for="item of warnMessageList" :key="item">
          <span>{{ item.time }}</span>
          <span :style="item.type ? 'color:#F56C6C' : 'color:#67C23A'">{{
            item.typeMessage
          }}</span>
          <el-image
            v-if="item.img.length"
            fit="fill"
            class="preImg"
            :src="require('@/assets/dataMonitor/preViewer.png')"
            :preview-src-list="item.img"
          >
          </el-image>
        </li>
      </ul>
    </div>
    <div class="button-box">
      <el-button type="primary" @click="handlePicture">手动拍照</el-button>
      <el-button type="primary" @click="stopWarn">停用报警</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handlePicture() {
      this.$message.success("请构建手动拍照");
    },
    stopWarn() {
      this.$message.success("请构建停用报警");
    },
  },
  data() {
    return {
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
      warnMessageList: [
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 0,
          img: [
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/ba8dc785-3d39-4d5a-b855-8b8793bcdc4f.png",
            "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a41a7e2-7c15-4948-8503-c6bc2e09573e/c1b9254e-af07-4419-b6ed-7c41d4d65ab1.png",
          ],
        },
        {
          time: "2022.07.21 09:31:24",
          typeMessage: " 报警解除",
          type: 1,
          img: [],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>


.warn-box {
  border-left: 1px rgba(33, 92, 182, 1) solid;
  .button-box {
  display: flex;
  justify-content: space-around;
  height: 100px;
  align-items: center;
}
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
  border-radius:10px;
  background-color: #f56c6c;
  margin-right: 10px;
  
}
.icon-success {
  width: 20px;
  height: 20px;
  border-radius:10px;
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
  width: 70%;
  margin: auto;
  font-weight: bold;
}
.warn-message-list {
  font-size: 14px;
  /* text-align: center; */
  line-height: 46px;
  color: #ffffff;
  cursor: help;
  width: 72%;
  margin: auto;
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
.outDiv{
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
