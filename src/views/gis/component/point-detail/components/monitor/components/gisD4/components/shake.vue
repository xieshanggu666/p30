<template>
  <div class="IndexBox">
    <div id="mainBox" class="mainBox" ref="seller_ref_one"></div>
  </div>
</template>

<script>
//  模拟震动数据
import * as echarts from 'echarts'

let now = new Date();
let oneDay = 24 * 3600 * 1000;
let value = Math.random() * 1000;
let data = [];
let data1 = [];
let data2 = [];
import mqtt from "mqtt";
export default {
  props: ["params"],
  data() {
    return {
      timer: null,
      client: null,
      mTopic: "radar/data",
      camera: null,
      scene: null,
      renderer: null,
      points: null,
      msg: [],
    };
  },
  created() {
    this.setEchartsData();
    // this.connect();
  },
  mounted() {
    this.myEchartsFun();
  },
  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    initMqttD4() {
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
        console.log("连接成功SHAKE close....", _this.params.subscriptionUrl);
        _this.subscribe(_this.params.subscriptionUrl);
      });
      this.client.on("message", function (topic, message) {
        console.log("接受获取消息SHAKE", topic);
        console.log("接受获取消息SHAKE", message);
      });
      this.client.on("error", function (err) {
        console.log("err=>", err);
      });
    },

    subscribe(topic) {
      this.client.subscribe(topic, { qos: 2 }, function (err) {
        if (!err) {
          console.log("shake subscribe success!");
        } else {
          //打印错误
          console.log("err", err);
        }
      });
    },

    //连接服务器
    connect() {
      let options = {
        cleanSession: true,
        keepAlive: 60,
        clientId: "BBD1BF8CB0214333B45EE9A539DF47E2",
        connectTimeout: 4000,
      };
      this.client = mqtt.connect(`ws://test.caepiot.cn:20084/mqtt#${this.params.subscriptionUrl}`, options);
      this.client.on("connect", (e) => {
        console.log("成功连接服务器:", e);
        this.client.subscribe(["imu/data/BBD1BF8CB0214333B45EE9A539DF47E2"], { qos: 1 }, (err) => {
          if (!err) {
            console.log("订阅成功");
            // this.publish("imu/data/BBD1BF8CB0214333B45EE9A539DF47E2", "hello");
          } else {
            console.log("消息订阅失败！");
          }
        });
      });
      //重新连接
      this.reconnect();
      //是否已经断开连接
      this.mqttError();
      //监听获取信息
      this.getMessage();
    },

    //发布消息@topic主题  @message发布内容
    publish(topic, message) {
      if (!this.client.connected) {
        console.log("客户端未连接");
        return;
      }
      this.client.publish(topic, message, { qos: 1 }, (err) => {
        if (!err) {
          console.log("主题为" + topic + "发布成功");
        }
      });
    },

    //监听接收消息
    getMessage() {
      this.client.on("message", (topic, message) => {
        console.log("message", message);
        if (message) {
          console.log("收到来着", topic, "的信息", message.toString());
          console.log("收到来着1", topic, "的信息1", message);
          const res = JSON.parse(message);
          //console.log(res, 'res')
          switch (topic) {
            case "imu/data/BBD1BF8CB0214333B45EE9A539DF47E2":
              this.msg = res;
              break;
            default:
              return;
              this.msg = res;
          }
          this.msg = message;
        }
      });
    },
    //监听服务器是否连接失败
    mqttError() {
      this.client.on("error", (error) => {
        console.log("连接失败：", error);
        this.client.end();
      });
    },
    //取消订阅
    unsubscribe() {
      this.client.unsubscribe(this.mtopic, (error) => {
        console.log("主题为" + this.mtopic + "取消订阅成功", error);
      });
    },

    //断开连接
    unconnect() {
      this.client.end();
      this.client = null;
      console.log("服务器已断开连接！");
    },

    //监听服务器重新连接
    reconnect() {
      this.client.on("reconnect", (error) => {
        // console.log("正在重连:", error);
      });
    },

    randomData() {
      now = new Date(+now + 1000);
      value = Math.random() * 5 - 5;
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },
    randomData1() {
      now = new Date(+now + 1000);
      value = Math.random() * +5;
      // console.log("value1111111",value);
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },
    randomData2() {
      now = new Date(+now + 1000);
      value = Math.random() * 5 - 10;
      // console.log("value333333",value);
      return {
        name: now.toString(),
        value: [now, Math.round(value)],
      };
    },
    // 给每个折线放入数据
    setEchartsData() {
      let that = this;
      for (var i = 0; i < 5; i++) {
        data.push(that.randomData());
        data1.push(that.randomData1());
        data2.push(that.randomData2());
      }
    },
    myEchartsFun() {
      let myChart = echarts.init(document.getElementById('mainBox'));
      let that = this;
      var option = {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: "倾斜角度",
          type: "value",
          splitNumber: 6,
          boundaryGap: [0, "100%"],
          splitLine: {
            show: true,
          },
        },
        series: [
          {
            name: "X轴倾斜",
            type: "line",
            smooth: true,
            data: data,
          },
          {
            name: "Y轴倾斜",
            type: "line",
            smooth: true,
            data: data1,
          },
          {
            name: "Z轴倾斜",
            type: "line",
            smooth: true,
            data: data2,
          },
        ],
      };
      this.timer = setInterval(function () {
        data.shift();
        data.push(that.randomData());
        data1.shift();
        data1.push(that.randomData1());
        data2.shift();
        data2.push(that.randomData2());
        myChart.setOption(option);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.IndexBox {
  width: 100%;
  height: 80vh;

  .mainBox {
    width: 100%;
    height: 326px;
  }
}
</style>
