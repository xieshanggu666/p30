<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "TiandituMap",
  data() {
    return {
      map: null, // 地图实例
      markers: [], // 存储所有标记点
      lnglats: [],
      _CloudCollection: null,
      wmsLayer: null,
    };
  },
  created() {
    this.queryData();
  },
  mounted() {
    // 初始化地图（确保 DOM 已加载）
    this.initMap();
  },
  methods: {
    // 查询数据
    queryData() {
      axios
        .get("http://127.0.0.1:8088/info")
        .then((response) => {
          console.log(response.data);
          // 处理获取的数据并添加到地图上
          this.addMassPoints(response.data.data);
        })
        .catch((error) => {
          console.error("数据请求失败:", error);
        });
    },
    initMap() {
      // 创建地图实例（中心点经纬度：北京为例， zoom：缩放级别）
      this.map = new T.Map("map", {
        projection: "EPSG:4326", // 使用 WGS84 坐标系
      });

      // 设置地图中心点和缩放级别
      this.map.centerAndZoom(new T.LngLat(116.404, 39.915), 12);

      // 添加控件（缩放、比例尺等）
      this.map.addControl(new T.Control.Zoom()); // 缩放控件
      this.map.addControl(new T.Control.Scale()); // 比例尺控件

      // 启用鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true);

      // 新增：叠加 WMS 图层
      //   this.wmsLayer = new T.tileLayer.wms(
      //     "http://192.168.1.243:8080/geoserver/gwc/demo",
      //     {
      //       layers: "yanmen:yanmen",
      //       format: "image/png",
      //       transparent: true,
      //       version: "1.1.1",
      //       srs: "EPSG:4326",
      //     }
      //   );
      //   this.wmsLayer.addTo(this.map);
      let wmsLayer = new T.TileLayer.WMS(
        "http://192.168.1.243:8080/geoserver/gwc/service/wms",
        {
          layers: "yanmen:yanmen",
          format: "image/png",
          transparent: true,
          version: "1.1.1",
          srs: "EPSG:4326",
        }
      );
      this.map.addLayer(wmsLayer);
    },
    // 添加海量点
    addMassPoints(data) {
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          this.map.centerAndZoom(new T.LngLat(data[i].Lon, data[i].Lat), 21);
        }
        var ll = new T.LngLat(data[i].Lon, data[i].Lat);
        this.lnglats.push(ll);
      }
      if (document.createElement("canvas").getContext) {
        // 判断当前浏览器是否支持绘制海量点
        this._CloudCollection = new T.CloudMarkerCollection(this.lnglats, {
          color: "blue",
          Size: 0.001,
          SizeType: TDT_POINT_SIZE_SMALL,
        });
        this.map.addOverLay(this._CloudCollection);
      } else {
        alert("此示例目前只有在IE9及以上浏览器打开");
      }
    },
  },
  beforeUnmount() {
    // 销毁地图实例（可选，释放资源）
    if (this.map) {
      // 清除所有标记点
      if (this.markers && this.markers.length > 0) {
        this.markers.forEach((marker) => {
          this.map.removeOverlay(marker);
        });
      }
      this.map.destroy();
    }
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
