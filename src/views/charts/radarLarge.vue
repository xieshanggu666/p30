<template>
  <div class="map-container">
    <div id="gisBox" style="width: 100%; height: 100%"></div>
    <!-- 修改canvas配置 -->
    <div
      id="heatmapContainer"
      style="
        width: 1000px;
        height: 1000px;
        position: absolute;
        top: -2000px;
        visibility: hidden;
      "
    >
      <canvas id="heatmapCanvas" width="1000" height="1000"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import h337 from "heatmap.js";

export default {
  name: "GisView",
  data() {
    return {
      myCesium: null,
      points: [],
      heatmapInstance: null,
    };
  },
  created() {
    this.fetchLocationData();
  },
  mounted() {
    this.gisInit();
  },
  methods: {
    fetchLocationData() {
      return axios
        .get("http://127.0.0.1:8088/info")
        .then((response) => {
          console.log("res", response);
          this.points = response.data.data;
        })
        .catch((error) => {
          console.error("数据请求失败:", error);
        });
    },

    gisInit() {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZGFjNDYwYy1jZDI5LTQ5OGYtYmIxOS0wZjU0ZmM3YjhiMjMiLCJpZCI6ODYwNTgsImlhdCI6MTY0NzQ4MTM5MH0.yZJqpA0VgfY0Jk3IhRUxHitgA4Oiwy1nnEambPo_qI0";

      this.myCesium = new Cesium.Viewer("gisBox", {
        terrainProvider: Cesium.createWorldTerrain(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        animation: false,
      });

      // 添加WMS图层
      const wmsProvider = new Cesium.WebMapServiceImageryProvider({
        url: "http://192.168.1.243:8080/geoserver/gwc/service/wms",
        layers: "yanmen:yanmen",
        parameters: {
          service: "WMS",
          format: "image/png",
          transparent: true,
        },
        enablePickFeatures: false,
      });
      this.myCesium.imageryLayers.addImageryProvider(wmsProvider);
    },
  },
  watch: {
    points: {
      handler(newValue) {
        if (newValue.length === 0) return;

        console.log("检测到新数据，准备生成热力图");

        // 清除现有实体
        this.myCesium.entities.removeAll();

        // 添加原始点标记
        newValue.forEach((point) => {
          this.myCesium.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point.Lon, point.Lat, 0),
            point: {
              pixelSize: 5,
              color: Cesium.Color.RED,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
          });
        });
        this.myCesium.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            newValue[0].Lon,
            newValue[0].Lat,
            5000
          ),
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
