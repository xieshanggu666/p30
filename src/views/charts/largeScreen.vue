<template>
  <div class="consyt">
    <!-- 头部 -->
    <div class="contops">
      <div class="an_sic">
        <div class="logs"></div>
        <div class="tebcheck">
          <div
            v-for="(item, index) in tabetsArr"
            :key="index"
            @click="actClick(index)"
            :class="index == tabetIndex ? 'actck' : ''"
            class="tablist"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="nofens">
        <div class="timew">{{ nowTime }}</div>
        <div class="xin_qi">
          {{ nowDate }} <span>{{ nowWeek }}</span>
        </div>
        <div class="sugang"></div>
        <img src="@/assets/home/tiqis.png" />
        <div class="tianq">16-24℃</div>
      </div>
    </div>

    <!-- 黑色叠加色彩块 -->
    <div class="topbok"></div>
    <div class="letbok"></div>
    <div class="rit letbok"></div>
    <div class="botbok"></div>
    <!-- 安全检测 -->
    <bigdata v-if="tabetIndex == 0"></bigdata>
    <!-- 监测运维 -->
    <bigDataF v-if="tabetIndex == 1"></bigDataF>
  </div>
</template>

<script>
import bigdata from "./bigdata.vue";
import bigDataF from "./bigDataF.vue";
export default {
  components: {
    bigdata,
    bigDataF,
  },
  data() {
    return {
      tabetIndex: 1, //选中索引
      tabetsArr: ["安全监测", "监测运维", "后台系统"], //表头切换
    };
  },
  mounted() {
    //获取状态 并根据状态显示安全监测 运维监测
    try {
      console.log(this.$route.query.id);
      this.tabetIndex = Number(this.$route.query.id);
    } catch (e) {}
  },
  methods: {
    actClick(index) {
      let largeScreen = JSON.parse(localStorage.getItem("largeScreen")) || null;
      let str = "";
      if (largeScreen) {
        largeScreen.forEach((item) => {
          str += item.url + ",";
        });
      }
      if (str.indexOf(index) == -1 && index != 2) {
        return this.$message.error("暂无权限访问");
      }
      this.tabetIndex = index;
      switch (index) {
        case 0:
          console.log("安全监测");
          break;
        case 1:
          console.log("监测运维");
          break;
        case 2:
          this.$router.push("/gis");
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.consyt {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #000;
  .contops {
    width: 100%;
    height: 72px;
    position: absolute;
    top: 0;
    z-index: 3;
    background: url("../../assets/home/hetop.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 15px 0 35px;
    .an_sic {
      padding-top: 4px;
      display: flex;
      align-items: center;
      .logs {
        margin-right: 116px;
        background: url("../../assets/home/titse.png") no-repeat;
        background-size: 100% 100%;
        width: 331px;
        height: 32px;
      }
      .tebcheck {
        display: flex;
        align-items: center;
        .tablist {
          cursor: pointer;
          font-weight: 500;
          font-size: 18px;
          color: #b5c4ed;
          text-align: center;
          line-height: 42px;
          width: 172px;
          height: 42px;
          background: url("../../assets/home/noact.png") no-repeat;
          background-size: 100% 100%;
          margin-left: -20px;
        }
        .actck {
          background: url("../../assets/home/actes.png") no-repeat !important;
          background-size: 100% 100% !important;
          color: #fff !important;
        }
      }
    }
    .nofens {
      padding-top: 6px;
      display: flex;
      align-items: center;
      .timew {
        font-size: 18px;
        color: #7fd9fe;
        margin-right: 14px;
        font-weight: bold;
      }
      .xin_qi {
        font-size: 14px;
        color: #7fd9fe;
        span {
          margin-left: 10px;
        }
      }
      .sugang {
        width: 1px;
        height: 15px;
        background: #80daff;
        opacity: 0.35;
        margin: 0 18px;
      }
      & > img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .tianq {
        font-size: 18px;
        font-weight: bold;
        color: #7fd9fe;
      }
    }
  }
  .contops {
    width: 100%;
    height: 72px;
    position: absolute;
    top: 0;
    z-index: 3;
    background: url("../../assets/home/hetop.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 15px 0 35px;
    .an_sic {
      padding-top: 4px;
      display: flex;
      align-items: center;
      .logs {
        margin-right: 116px;
        background: url("../../assets/home/titse.png") no-repeat;
        background-size: 100% 100%;
        width: 331px;
        height: 32px;
      }
      .tebcheck {
        display: flex;
        align-items: center;
        .tablist {
          cursor: pointer;
          font-weight: 500;
          font-size: 18px;
          color: #b5c4ed;
          text-align: center;
          line-height: 42px;
          width: 172px;
          height: 42px;
          background: url("../../assets/home/noact.png") no-repeat;
          background-size: 100% 100%;
          margin-left: -20px;
        }
        .actck {
          background: url("../../assets/home/actes.png") no-repeat !important;
          background-size: 100% 100% !important;
          color: #fff !important;
        }
      }
    }
    .nofens {
      padding-top: 6px;
      display: flex;
      align-items: center;
      .timew {
        font-size: 18px;
        color: #7fd9fe;
        margin-right: 14px;
        font-weight: bold;
      }
      .xin_qi {
        font-size: 14px;
        color: #7fd9fe;
        span {
          margin-left: 10px;
        }
      }
      .sugang {
        width: 1px;
        height: 15px;
        background: #80daff;
        opacity: 0.35;
        margin: 0 18px;
      }
      & > img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .tianq {
        font-size: 18px;
        font-weight: bold;
        color: #7fd9fe;
      }
    }
  }
  .topbok {
    width: 100%;
    height: 123px;
    position: absolute;
    top: 0;
    z-index: 2;
    background: linear-gradient(0deg, rgba(7, 15, 27, 0) 0%, #07112d 100%);
  }
  .letbok {
    width: 83px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    background: linear-gradient(270deg, rgba(7, 15, 27, 0) 0%, #07112d 100%);
  }
  .rit {
    left: auto;
    right: 0;
    background: linear-gradient(90deg, rgba(7, 15, 27, 0) 0%, #07112d 100%);
  }
  .botbok {
    width: 100%;
    height: 120px;
    position: absolute;
    bottom: 0;
    z-index: 2;
    background: linear-gradient(180deg, rgba(7, 15, 27, 0) 0%, #07112d 100%);
  }
}
</style>
