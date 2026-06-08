<template>
  <div>
    <div id="gisBox">
      <div id="buttonBox">
        <div class="form">
           <div>
            <span style="width:70px;color:white">经度：</span>
            <el-input
              v-model="receiveData.longitude"
              placeholder="请输入经度"
            ></el-input>
          </div>
          <div>
            <span style="width:70px;color:white"> 纬度：</span>
            <el-input
              v-model="receiveData.latitude"
              placeholder="请输入纬度"
            ></el-input>
          </div>
         
          <el-button @click="searchAngle">搜索视角</el-button>
          <el-button @click="SaveD3Angle">保存配置</el-button>
       
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["AngleData"],
  name: "gisBox",
  data() {
    return {
      viewer: null,
      receiveData: {
        latitude: "",
        longitude: "",
      },
      handler: {},
    };
  },
  mounted() {
    if (this.AngleData.latitude) {
      this.receiveData.latitude = this.AngleData.latitude;
      this.receiveData.longitude = this.AngleData.longitude;
    }
    this.gisInit();
    console.log("this.AngleData",this.AngleData);
    this.initFly();
  },
  methods: {
    // 初始化cesium
    gisInit() {
      let param = {
        order: "asc",
        page: 1,
        rows: 30,
        sort: "ID",
        wheres: JSON.stringify([
          { name: "Project", value: "", displayType: "like" },
        ]),
      };
      let url = "/api/Mon_Group_Manager/getPageData";
      this.http.post(url, param, "正在请求中·····").then((result) => {
        this.groupList = result.rows;
        this.GisLocalPoint(this.groupList, "group");
      });

      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZGFjNDYwYy1jZDI5LTQ5OGYtYmIxOS0wZjU0ZmM3YjhiMjMiLCJpZCI6ODYwNTgsImlhdCI6MTY0NzQ4MTM5MH0.yZJqpA0VgfY0Jk3IhRUxHitgA4Oiwy1nnEambPo_qI0";
      this.viewer = new Cesium.Viewer("gisBox", {
        animation: false,
        baseLayerPicker: true,
        vrButton: false,
        geocoder: true,
        timeline: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        infoBox: false,
        fullscreenButton: false,
        selectionIndicator: true,
        homeButton: true,
        scene3DOnly: false,
        terrainProvider: Cesium.createWorldTerrain({
          requestVertexNormals: true,
          requestWaterMask: true,
        }),
      });

      //双击鼠标左键清除默认事件
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );

      this.viewer.extend(Cesium.viewerCesiumNavigationMixin);
      this.viewer.scene.globe.showGroundAtmosphere = false;
      this.viewer.scene.skyAtmosphere.show = false;
      this.viewer.scene.sun.show = false;
      this.viewer.scene.moon.show = false;
      this.viewer.scene.skyBox.show = false;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;

      let highDefinition = new Cesium.ArcGisMapServerImageryProvider({
        url:
          "https:/services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      });
      this.viewer.imageryLayers.addImageryProvider(highDefinition);

      let terrainProvider = new Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      });
      this.viewer.terrainProvider = terrainProvider;

      // if (this.AngleData.latitude) {
      //   const position = Cesium.Cartesian3.fromDegrees(
      //     this.receiveData.longitude,
      //     this.receiveData.latitude,
      //     3000
      //   );

      //   if (this.receiveData.d3Angle) {
      //     this.viewer.camera.setView({
      //       destination: position,
      //     });
      //   } else {
      //     this.viewer.camera.setView({
      //       destination: position,
      //     });
      //   }
      // } else {
      //   this.viewer.camera.flyTo({
      //     destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      //     orientation: {
      //       heading: Cesium.Math.toRadians(348.4202942851978),
      //       pitch: Cesium.Math.toRadians(-89.74026687972041),
      //       roll: Cesium.Math.toRadians(0),
      //     },
      //     complete: function callback() {
      //       // 定位完成之后的回调函数
      //     },
      //   });
      // }
    },

    // 加载点位
    GisLocalPoint(e) {
      this.InitGroupEntity(e);
    },

    // 点位信息
    InitGroupEntity(datas) {
      // this.viewer.entities.removeAll();
      for (let item of datas) {
        let billboardObj = new Cesium.BillboardGraphics({
          image: require(`@/assets/gis/gis-entity/icon3d/group_blue.png`),
          color: Cesium.Color.WHITE.withAlpha(1),
          height: 52,
          width: 44,
          rotation: 0,
          sizeInMeters: false,
          show: true,
          scale: 1.0,
          disableDepthTestDistance: 50000,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        });
        const description = JSON.stringify(item);
        this.viewer.entities.add({
          id: parseInt(item.ID),
          name: "monitorPoint",
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(item.Long),
            parseFloat(item.Lat)
          ),
          description,
          label: new Cesium.LabelGraphics({
            //文字标签
            text: item.Group_Name,
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM + 100, //垂直方向以底部来计算标签的位置
            disableDepthTestDistance: 50000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, -58), //偏移量 -42
          }),
          billboard: billboardObj,
        });
      }
    },

    //初始加载飞行
     initFly() {
      this.viewer.scene.camera.flyTo({
        destination: this.AngleData
          ? this.AngleData.position
          : this.viewer.camera.position, 
        duration: 1, 
        orientation: {
          direction: this.AngleData
            ? this.AngleData.direction
            : this.viewer.camera.direction,
          up: this.AngleData ? this.AngleData.up : this.viewer.camera.up,
          right: this.AngleData
            ? this.AngleData.right
            : this.viewer.camera.right,
        },
      });
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    },

    // 保存3D视角
    SaveD3Angle() {
      let result = {
        direction: this.viewer.camera.direction,
        up: this.viewer.camera.up,
        position: this.viewer.camera.position,
        right: this.viewer.camera.right,
        latitude: this.receiveData.latitude,
        longitude: this.receiveData.longitude,
      };
      this.$emit("submitData", result);
    },

    // 搜索视角
    searchAngle() {
      const position = Cesium.Cartesian3.fromDegrees(
        this.receiveData.longitude,
        this.receiveData.latitude,
        3000
      );

      if (this.receiveData.d3Angle) {
        this.viewer.camera.setView({
          destination: position,
        });
      } else {
        this.viewer.camera.setView({
          destination: position,
        });
      }
    },
  },
};
</script>
<style scoped>
.form {
  display: flex;
}
.form div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
#gisBox {
  height: 886px;
  position: relative;
}
#buttonBox {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 999;
}

.cesium-this.viewer .cesium-widget-credits {
  display: none;
}
</style>
