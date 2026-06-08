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
    <div class="header">
      <div style="font-size:16px;margin-bottom:5px">
        当前采集时间：{{ this.radarTime }}
      </div>

      <div class="btn" @click="refresh()">
        <el-button type="primary" size="small">刷新</el-button>
      </div>
    </div>
    <div id="container" ref="container"></div>
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
      matLine2: "",
    };
  },
  methods: {
    openTimeRadar(treeId) {
      this.model.box = true;
      this.Point_Num = treeId.Point_Num;
      this.countantSize.width = 1170;
      this.countantSize.height = 580;
      this.initPoint();
      this.getRadarInfo();
      // this.timer = setInterval(() => {
      //   this.getRadarInfo();
      // }, 60000);
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
      var container = document.getElementById("container");
      container.removeChild(this.renderer.domElement);
      clearInterval(this.timer);
    },

    // 获取数据
    getRadarInfo() {
      let url = `/api/Mon_Point_Manager/GetCurrentPointCloudData?pointNum=${this.Point_Num}`;
      this.http.get(url, {}, true).then((res) => {
        this.radarTime = res.data.time;
        // var data = [1, 2, 3, 1, 2, 3, 1, 2, 3, 8, 7, 6];
        var resultArray = this.transformArrays(res.data.data);
        console.log("resultArray",resultArray);
        this.points.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(resultArray, 2)
        );
        this.points.geometry.attributes.position.needsUpdate = true;
        var container = document.getElementById("container");
        container.appendChild(this.renderer.domElement);
        this.$refs.container.addEventListener("click", this.onMouseClick);
        this.render();
      });
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
        size: 0.2,
        color: 0xffffff,
      });
      this.points = new THREE.Points(geometry, material);
      this.points.rotation.x = Math.PI;
      this.points.rotation.y = Math.PI / 2;
      this.points.rotation.z = Math.PI;
      this.scene.add(this.points);

      // 画线
      const geometry1 = new LineGeometry();
      // [0.850001,1.800001],[4.730001,2.070001],[16.240001,3.920001],
      // [13.450001,6.710001],[4.70001,5.32001],[2.70001,4.90001],
      // [-12.640001,2.610001],[-25.930001,-0.310001],[-26.160001,-4.40001],
      // [-15.860001,-3.560001],[-12.870001,-0.570001],[-6.10001,-1.730001],[-0.260001,0.530001]
      geometry1.setPositions([
        0.850001,1.800001,0, 
        4.730001,2.070001,0,
        16.240001,3.920001,0, 
        13.450001,6.710001,0,
        4.70001,5.32001,0, 
        2.70001,4.90001,0,
        -12.640001,2.610001,0,
        -25.930001,-0.310001,0,
        -26.160001,-4.40001,0, 
        -15.860001,-3.560001,0, 
        -12.870001,-0.570001,0,
        -6.10001,-1.730001,0, 
        -0.260001,0.530001,0,
        0.850001,1.800001,0, 
      ]);

      this.matLine = new LineMaterial({
        color: 0xee0000,
        linewidth: 1,
        dashed: false,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        alphaToCoverage: true,
        // alphaToCoverage: true // 通道印射：该属性继承于基类Material，默认为false；如果为true的话曲线的每一段边缘会有白的的线条，曲线会看起来一节一节的
      });
      const line = new Line2(geometry1, this.matLine);
      line.computeLineDistances();
      line.scale.set(1, 1, 1);
      this.scene.add(line);
      line.rotation.x = Math.PI;
      line.rotation.y = Math.PI / 2;
      line.rotation.z = Math.PI ;


      // const geometry2 = new LineGeometry();
      // geometry2.setPositions([
      //         -1,-1,0,1,-1,0,0,1,0
      //       ]);

      // this.matLine2 = new LineMaterial({
      //   color: 0xee0000,
      //   linewidth: 1,
      //   dashed: false,
      //   resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      // });

      // const line2 = new Line2(geometry2, this.matLine2);
      // line2.computeLineDistances();
      // line2.scale.set(1, 1, 1);
      // this.scene.add(line2);
      // line2.rotation.x = Math.PI;
      // line2.rotation.y = Math.PI / 2;
      // line2.rotation.z = Math.PI ;


      // const geometry2 = new LineGeometry();
      // geometry2.setPositions([
      //   0.85,1.80,0, 4.73,2.07,0, 16.24,3.92,0, 11.55,8.99,0, 1.14,6.45,0, -1.88,4.29,0,
      //   -5.05,4.14,0, -8.91,2.89,0, -25.93,-0.31,0, -26.16,-4.4,0, -15.86,-3.56,0, -12.87,-0.57,0,
      //   -6.1,-1.73,0, -0.26,0.53,0, 0.85,1.80,0
      // ]);

      // this.matLine2 = new LineMaterial({
      //   color: 0xee0000,
      //   linewidth: 1,
      //   dashed: false,
      //   resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      //   // alphaToCoverage: true // 通道印射：该属性继承于基类Material，默认为false；如果为true的话曲线的每一段边缘会有白的的线条，曲线会看起来一节一节的
      // });
      // const line2 = new Line2(geometry2, this.matLine2);
      // line2.computeLineDistances();
      // line2.scale.set(1, 1, 1);
      // this.scene.add(line2);


      // 用已知的xy坐标画图形
      // var shape = new THREE.Shape();
      // shape.lineTo(4.59,2.81);
      // shape.lineTo(-1.25,1.27);
      // shape.lineTo(-10.19,8.29);
      // shape.lineTo(21.10,17.19);
      // shape.lineTo(22.94,6.42);
      // var geometry2 = new THREE.ShapeGeometry(shape);
      // var material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      // var mesh = new THREE.Mesh(geometry2, material2);
      // this.scene.add(mesh);
      // line.rotation.x = Math.PI;
      // line.rotation.y = Math.PI / 2;
      // line.rotation.z = Math.PI ;

      //创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.countantSize.width, this.countantSize.height);

      // 缩放
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.addEventListener("change", this.render);


      // const raycaster = new THREE.Raycaster();
      // const pointer = new THREE.Vector2();/

      // 监听鼠标点击事件
    },

    onMouseClick(event) {
      // 获取鼠标点击点的屏幕坐标
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      console.log("mouse.x",mouse.x);
      console.log("mouse.y",mouse.y);

      // 创建射线对象
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      // 获取射线与物体的交点
      const intersects = raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        // 获取第一个交点的世界坐标
        const point = intersects[0].point;
        console.log("点点点",point);
      }
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
