<template>
  <vol-box
    :lazy="true"
    v-model="model.box"
    title="点云数据"
    :height="675"
    :width="1200"
    :padding="15"
    :on-model-close="closeCustomModel"
  >
    <div id="container2" ref="container2"></div>
  </vol-box>
</template>
<script>
import VolBox from "@/components/basic/VolBox.vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import * as THREE from "three";
export default {
  components: { "vol-box": VolBox },
  methods: {},
  data() {
    return {
      model: {
        box: false,
      },
      client: null,
      camera: null,
      scene: null,
      renderer: null,
      points: null,
      countantSize: {
        width: null,
        height: null,
      },
      radarTime: "",
      timer: null,
      matLine: "",
      LineData: [],
    };
  },
  methods: {
    openTimeRadar(row) {
      this.model.box = true;
      this.countantSize.width = 1170;
      this.countantSize.height = 580;
      this.initPoint();
      this.$nextTick(() => {
        this.getRadarInfo(row);
        this.getLine();
      });
      this.animate();
    },

    refresh() {
      this.getRadarInfo();
    },

    transformArrays(arrays) {
      var resultArray = arrays.flatMap(function(item) {
        return Object.values(item);
      });
      return resultArray;
    },

    closeCustomModel() {
      this.model.box = false;
      var container = document.getElementById("container2");
      container.removeChild(this.renderer.domElement);
      clearInterval(this.timer);
    },

    // 获取数据
    getRadarInfo(row) {
      this.LineData = row.Region_Config;
      const IN = JSON.parse(row.PointCloud_In);
      const ON = JSON.parse(row.PointCloud_Out);
      const result = IN.concat(ON).flatMap((obj) => Object.values(obj));
      this.points.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(result, 2)
      );
      this.points.geometry.attributes.position.needsUpdate = true;
      this.$nextTick(() => {
        var container = document.getElementById("container2");
        container.appendChild(this.renderer.domElement);
      });
      this.render();
    },

    // 初始化
    initPoint() {
      // 创建相机/三维场景显示范围控制系数
      this.camera = new THREE.PerspectiveCamera(
        30,
        this.countantSize.width / this.countantSize.height,
        5,
        3500
      );
      this.camera.position.z = 30;
      this.camera.position.x = 80;
      this.camera.position.y = 10;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x050505);

      //坐标轴辅助
      var axisHelper = new THREE.AxesHelper(10);
      this.scene.add(axisHelper);

      //控件辅助
      // var controls = new THREE.OrbitControls(camera, renderer.domElement);//创建控件对象
      // controls.addEventListener('change', render);//监听鼠标、键盘事件

      //创建图形对象
      const geometry = new THREE.BufferGeometry();
      geometry.computeBoundingSphere();
      const material = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xffffff,
      });
      this.points = new THREE.Points(geometry, material);
      this.points.rotation.x = Math.PI;
      this.points.rotation.y = Math.PI / 2;
      this.points.rotation.z = Math.PI;
      this.scene.add(this.points);

      //创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.countantSize.width, this.countantSize.height);

      // 缩放
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.addEventListener("change", this.render);

    },

    getLine() {
      var resultArray = this.transformArrays(
        JSON.parse(this.LineData).map((subArr) => subArr.concat(0))
      );

      const geometry1 = new LineGeometry();
      geometry1.setPositions(resultArray);

      this.matLine = new LineMaterial({
        color: 0xee0000,
        linewidth: 1,
        dashed: false,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      });
      const line = new Line2(geometry1, this.matLine);
      line.computeLineDistances();
      line.scale.set(1, 1, 1);
      this.scene.add(line);
      line.rotation.x = Math.PI;
      line.rotation.y = Math.PI / 2;
      line.rotation.z = Math.PI;
    },

    animate() {
      this.points.rotation.x = Math.PI;
      this.points.rotation.y = Math.PI / 2;
      this.points.rotation.z = Math.PI;
      requestAnimationFrame(this.animate);
      this.render();
    },
    // 渲染
    render() {
      this.points.rotation.x = Math.PI;
      this.points.rotation.y = Math.PI / 2;
      this.points.rotation.z = Math.PI;
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>
<style lang="less">
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
.header {
  display: flex;
  align-items: center;
}
.btn {
  margin-left: 5px;
  margin-top: -11px;
}
</style>
