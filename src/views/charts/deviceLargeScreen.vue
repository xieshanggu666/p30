<template>
  <div class="nier_ye">
    <div class="waic_" :style="{ height: starts ? '159px' : '83px' }">
      <div class="herder_s">
        <div class="he_l">
          <div class="yun_">
            <img src="../../../public/static/bigdata/tianq.png" />24
          </div>
          <!-- <div class="rhk_" @click="starts = !starts">
            点击隐藏图表
          </div> -->
        </div>
        <!-- <img class="tus" src="../../../public/static/bigdata/title_.png" /> -->
        <div class="tus">设备在线一览</div>
        <div class="he_r">
          <div class="rice"></div>

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
    <!-- 中间设备区域 -->
    <div class="center_">
      <el-row :gutter="20" class="el-row" type="flex">
        <el-col
          :span="3"
          v-for="(item, index) in list"
          :key="item.id"
          class="el-col"
        >
          <div
            class="el-card"
            :class="item.Status ? 'online' : 'offline'"
            :key="index"
            onclick=""
          >
            <div>
              <div class="text item">
                <div class="item_tag">
                  <div
                    class="round"
                    :class="item.Status ? 'onround' : 'offround'"
                  ></div>
                  <span>设备名称：</span>
                </div>
                <div class="item_desr">
                  <span> {{ item.tag }}</span>
                </div>
              </div>
              <div class="text item">
                <div class="item_tag">
                  <span>最新通信时间：</span>
                </div>
                <div class="item_desr">
                  {{ item.seatag }}
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import socketApi from "../../uitils/socket";
export default {
  name: "scroll",
  components: {},
  data() {
    return {
      wsUrl: "ws://", //定义socket连接地址
      wsType: "CONNECT",
      starts: false, //显示图表
      listData: [],
      nodeDetailStyle: {
        right: 0,
      },
      // 模拟数据
      list: [
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: false,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
        {
          tag: "测试1",
          seatag: "2021-11-18",
          Status: true,
        },
      ],
      // 高度
      contentStyleObj: {
        height: "",
      },
      Timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
    };
  },
  created() {
    window.addEventListener("resize", this.getHeight);
     //建立socket连接
    // socketApi.initWebSocket(this.wsUrl);
    // const data = {
    //   type: this.wsType,
    //   msg: "测试",
    // };
    // this.websocketSend(data);
  },
  mounted() {
    this.getHeight();
    this.Timer = setInterval(() => {
      this.setNowTimes();
    }, 1000);
  },
  unmounted() {
    window.removeEventListener("resize", this.getHeight);
  },
  //离开销毁
  // beforeRouteLeave(to, from, next) {
  //   socketApi.webSocketClose();
  //   next();
  // },

  methods: {
    // 数据返回
    getConfigResult(res) {
      console.log("返回的数据", res);
    },
    // 发送数据
    websocketSend(data) {
      socketApi.sendSock(data, this.getConfigResult);
    },

    //获取日期时间
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
    // 自适应
    getHeight() {
      if (window.innerHeight < 768 || window.innerHeight < 1080) {
        this.contentStyleObj.height = "135px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 800 + `px`;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./css/index.scss";
.offline {
  border: 2px solid red;
}
.online {
  border: 2px solid green;
}

.item {
  margin: 10px 20px;
}
.item_tag {
  float: left;
  text-align: left;
  display: flex;
  .round {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-top: 2px;
    margin-right: 5px;
    background-color: #fff;
  }
  .onround {
    background-color: green;
  }
  .offround {
    background-color: red;
  }
}
.item_desr {
  margin-left: 40%;
  min-height: 30px;
  text-align: left;
}
.text {
  width: 100%;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: #b9bcc2;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  min-width: 100%;
  height: 100%;
  background-color: rgba(57, 44, 173, 0.7);
  margin-right: 20px;
}
.el-card:hover {
  margin-top: -5px;
}
.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
}
.el-col {
  border-radius: 4px;
  align-items: stretch;
  margin-bottom: 20px;
}

// 中间区域
.center_ {
  height: calc(100vh - 115px);
  width: 100%;
  position: fixed;
  z-index: 999;
  top: 105px;
  left: 0px;
  overflow-y:auto;
  // background: url("../../../public/static/bigdata/letbg.png") no-repeat center;
  // background-size: 100% 100%;
  background-color: rgba(1, 15, 21);
  .centerBox {
    z-index: 1999;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 200px;
      height: 100px;
      z-index: 1999;
      background-color: #fff;
    }
  }
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
