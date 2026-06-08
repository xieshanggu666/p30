<template>
  <div id="container"></div>
</template>

<script>
import mqtt from "mqtt";
import * as THREE from "three";
export default {
  name: "HelloWorld",
  props: ["params"],
  data() {
    return {
      client: null,
      camera: null,
      scene: null,
      renderer: null,
      points: null,
      countantSize: {
        width: null,
        height: null,
      },
    };
  },
  mounted() {
  },
  methods: {
    initMqtt() {
      let _this = this;
      var options = {
        //mqtt客户端的id
        clientId: "mqttx_549d5d08",
        mTopic:'radar/data/BBD1BF8CB0214333B45EE9A539DF47E2',
        keepAlive: 60,
        cleanSession: true,
      };
      // const clientUrl =`ws://test.caepiot.cn:20084/mqtt#${this.params.subscriptionUrl}`;
      const clientUrl = `ws://railway.iot.caepiot.cn:20084/mqtt`;

      this.client = mqtt.connect(clientUrl, options);
      this.client.on("connect", function () {
        console.log("连接成功D4 container");
        _this.subscribe(_this.params.subscriptionUrl);
      });
      this.client.on("message", function (topic, message) {
        _this.recev(topic, message);
        console.log("D4message！！！！！",message);
      });
      this.client.on("error", function (err) {
        console.log("err=>", err);
      });
    },
    subscribe(topic) {
      this.client.subscribe(topic, { qos: 2 }, function (err) {
        if (!err) {
          console.log("subscribe success! container");
        } else {
          //打印错误
          console.log("err", err);
        }
      });
    },
    recev(topic, message) {
      // if (topic == this.mTopic) {
      //   this.points.geometry.setAttribute(
      //     "position",
      //     new THREE.Uint8BufferAttribute(message, 2)
      //   );
      //   this.points.geometry.attributes.position.needsUpdate = true;
      //   this.render();
      // }
      // new THREE.Float32BufferAttribute(message, 4)
      let vertices = new Float32Array(message.buffer);

      this.points.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 2)
      );

      this.points.geometry.attributes.position.needsUpdate = true;
      this.render();
    },

    //threejs 点云图
    initPoint() {
       this.countantSize.width = document.getElementById("container").offsetWidth;
    this.countantSize.height = parseInt(
      (this.countantSize.width / 1920) * 1080
    );
    console.log(
      this.countantSize.width,
      this.countantSize.height,
      "this.countantSize.width"
    );
      this.camera = new THREE.PerspectiveCamera(
        30,
        this.countantSize.width / this.countantSize.height,
        5,
        3500
      );
      this.camera.position.z = 80;
      // this.camera.position.x = 100;
      // this.camera.position.y = 100;
      // this.camera.lookAt(100, 0, 0);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x050505);

      //坐标轴辅助
      // var axisHelper = new THREE.AxesHelper(10);
      // this.scene.add(axisHelper);

      //
      const geometry = new THREE.BufferGeometry();
      geometry.computeBoundingSphere();
      //
      const material = new THREE.PointsMaterial({
        size: 1,
        color: 0xffffff,
      });
      this.points = new THREE.Points(geometry, material);
      // this.updatepoints();
      this.scene.add(this.points);
      //
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.countantSize.width, this.countantSize.height);
      let container = document.getElementById("container");
      container.appendChild(this.renderer.domElement);
      window.addEventListener("resize", this.onWindowResize);
    },
    onWindowResize() {
      this.camera.aspect = this.countantSize.width / this.countantSize.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.countantSize.width, this.countantSize.height);
    },
    animate() {
      requestAnimationFrame(this.animate);
      // this.updatepoints();
      this.render();
    },
    updatepoints() {
      const particles = 50000;
      const positions = [];
      const colors = [];
      const color = new THREE.Color();
      const n = 1000,
        n2 = n / 2; // particles spread in the cube
      for (let i = 0; i < particles; i++) {
        // positions
        const x = Math.random() * n - n2;
        const y = Math.random() * n - n2;
        const z = Math.random() * n - n2;

        positions.push(x, y);
        // colors
        const vx = x / n + 0.5;
        const vy = y / n + 0.5;
        const vz = z / n + 0.5;

        color.setRGB(vx, vy, vz);
        colors.push(color.r, color.g, color.b);
      }

      this.points.geometry.setAttribute(
        "position",
        new THREE.Uint8BufferAttribute(positions, 2)
      );
      this.points.geometry.setAttribute(
        "color",
        new THREE.Uint8BufferAttribute(colors, 3)
      );
      this.points.geometry.attributes.position.needsUpdate = true;
    },
    render() {
      const time = Date.now() * 0.001;
      this.points.rotation.z = Math.PI/2;
      this.renderer.render(this.scene, this.camera);
    },
  },
  destroyed() {
    if (this.client != null && this.client.end) {
      this.client.end();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
}
</style>
