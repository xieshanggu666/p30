<template>
  <div>
    <div id="gisBoxLayer">
      <div id="buttonBox">
        <div class="form">
          <button @click="draw('Polyline')">绘制线</button>
          <button @click="draw('Polygon', 1)">绘制面(绿)</button>
          <button @click="draw('Polygon', 2)">绘制面(橙)</button>
          <button @click="draw('Polygon', 3)">绘制面(红)</button>
          <button @click="clearAllDrawn()">清除实体</button>
          <button @click="saveKml()">保存kml文件</button>
          <button @click="handleOpenClick()">打开文件</button>
          <button @click="SaveD3Angle()">保存配置</button>
          <input
            type="file"
            ref="fileInput"
            class="file"
            @change="handleFileChange"
            style="display: none"
          />
          <div>
            <span style="width:70px;color:white">经度：</span>
            <el-input
              v-model="receiveData.longitude"
              placeholder="请输入经度"
            ></el-input>
            <el-button @click="searchAngle">搜索视角</el-button>
          </div>
          <div>
            <span style="width:70px;margin-left:10px;color:white"> 纬度：</span>
            <el-input
              v-model="receiveData.latitude"
              placeholder="请输入纬度"
            ></el-input>
          </div>
          
        </div>
      </div>
      <div class="names wrap">
        <span style="font-size:18px;font-weight: bold;color:white"
          >监测组列表：</span
        >
        <div
          v-for="(item, index) in groups"
          :key="index"
          :class="{ active: number == index }"
        >
          <div class="groupName" @click="goPositioning(item, index)">
            {{ item.Group_Name }}
          </div>
        </div>
      </div>
      <!-- 点位Names -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["AngleData", "groups"],
  name: "gisBoxLayer",
  data() {
    return {
      EarthIds: [],
      valueID:"",
      receiveData: {
        latitude: "",
        longitude: "",
      },
      number: -1,
      ObjBindingMap: [],
      tempEntities: [], //存线面
      projectName: null,
      viewer: null,
      receiveData: {
        latitude: "",
        longitude: "",
      },
      handler: {},
      activeShapePoints: [],
      floatingPoint: undefined,
      activeShape: undefined,
      drawingMode: "line",
      Exection: {},
      Points: [],
      linePoints: [],
      editHandler: null,
    };
  },
  mounted() {
    this.gisInit();
    if (this.AngleData.Description) {
      this.drawPolygonLast(this.AngleData.Description);
      //定位到绘制多边形
      // this.goFlytoPolyline(this.AngleData.Description[0]);
      this.initFly();
    }
    if (this.AngleData.DescriptionLine) {
      // this.drawPolygon(this.AngleData.Description);
      this.drawPolyline(this.AngleData.DescriptionLine);
    }
  },
  methods: {
    //定位到绘制多边形
    goFlytoPolyline(e) {
      // 获取多边形所有的点
      var vertices = e;
      var center = new Cesium.Cartesian3();
      for (var i = 0; i < vertices.length; i++) {
        Cesium.Cartesian3.add(center, vertices[i], center);
      }
      // 计算多边形点位均值
      Cesium.Cartesian3.divideByScalar(center, vertices.length, center);

      // 加高度
      var destination = center;
      var heightToAdd = new Cesium.Cartesian3(0, 0, 100000);
      var finalDestination = Cesium.Cartesian3.add(
        destination,
        heightToAdd,
        new Cesium.Cartesian3()
      );

      this.viewer.camera.flyTo({
        destination: finalDestination,
      });
    },
    
    // 定位飞行视角
    initFly() {
      const { viewer } = this;
      viewer.scene.camera.flyTo({
        destination: this.AngleData
          ? this.AngleData.position
          : window.viewer.camera.position, 
        duration: 1, 
        orientation: {
          direction: this.AngleData
            ? this.AngleData.direction
            : window.viewer.camera.direction,
          up: this.AngleData ? this.AngleData.up : window.viewer.camera.up,
          right: this.AngleData
            ? this.AngleData.right
            : window.viewer.camera.right,
        },
      });
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    },

    change(index) {
      this.number = index;
    },
    goPositioning(e, index) {
      this.number = index;
      this.valueID = e.ID
      // console.log("e", e);
      // this.GisLocalPoint(this.groupList, "group");
      this.http
        .post("/api/Mon_Point_Manager/getPageData", {
          order: "asc",
          page: 1,
          rows: 30,
          sort: "ID",
          value: 1,
          wheres: JSON.stringify([{ name: "Group_Id", value: e.ID }]),
        })
        .then((data) => {
          //加载点位
          this.InitPointEntity(data.rows); 
        });
      // 飞行
      const position = Cesium.Cartesian3.fromDegrees(e.Long, e.Lat, 5000);
      this.viewer.camera.setView({
        destination: position,
      });
    },
    gisInit() {
      // 监测组
      // let param = {
      //   order: "asc",
      //   page: 1,
      //   rows: 30,
      //   sort: "ID",
      //   wheres: JSON.stringify([
      //     { name: "Project", value: "", displayType: "like" },
      //   ]),
      // };
      // let url = "/api/Mon_Group_Manager/getPageData";
      // this.http.post(url, param, "正在请求中·····").then((result) => {
      //   this.groupList = result.rows;
      // });

      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZGFjNDYwYy1jZDI5LTQ5OGYtYmIxOS0wZjU0ZmM3YjhiMjMiLCJpZCI6ODYwNTgsImlhdCI6MTY0NzQ4MTM5MH0.yZJqpA0VgfY0Jk3IhRUxHitgA4Oiwy1nnEambPo_qI0";
      this.viewer = new Cesium.Viewer("gisBoxLayer", {
        animation: false,
        baseLayerPicker: false,
        vrButton: false,
        geocoder: false,
        timeline: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        infoBox: false,
        fullscreenButton: false,
        selectionIndicator: false,
        homeButton: false,
        scene3DOnly: false,
        terrainProvider: Cesium.createWorldTerrain({
          requestVertexNormals: false,
          requestWaterMask: false,
        }),
      });

      this.viewer.extend(Cesium.viewerCesiumNavigationMixin);
      this.viewer.scene.globe.showGroundAtmosphere = false;
      this.viewer.scene.skyAtmosphere.show = false;
      this.viewer.scene.sun.show = false;
      this.viewer.scene.moon.show = false;
      this.viewer.scene.skyBox.show = false;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;

      ////加载高清地图
      let hd_dt = new Cesium.ArcGisMapServerImageryProvider({
        url:
          "https:/services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      });
      this.viewer.imageryLayers.addImageryProvider(hd_dt);

      let terrainProvider = new Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      });
      this.viewer.terrainProvider = terrainProvider;
      if (this.AngleData.latitude) {
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
      } else {
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
          orientation: {
            heading: Cesium.Math.toRadians(348.4202942851978),
            pitch: Cesium.Math.toRadians(-89.74026687972041),
            roll: Cesium.Math.toRadians(0),
          },
          complete: function callback() {
            // 定位完成之后的回调函数
          },
        });
      }
    },
    SaveD3Angle() {
      // console.log("this.AngleData.Description", this.AngleData.Description);
      // console.log("point", this.Points);
      // console.log("111", this.Points.concat(this.AngleData.Description));
      if (this.AngleData.Description || this.AngleData.DescriptionLine) {
        let result = {
          direction: this.viewer.camera.direction,
          up: this.viewer.camera.up,
          position: this.viewer.camera.position,
          right: this.viewer.camera.right,
          Description: this.Points.concat(this.AngleData.Description),
          DescriptionLine: this.linePoints.concat(
            this.AngleData.DescriptionLine
          ),
        };
        this.$emit("submitData", result);
      } else {
        let result = {
          direction: this.viewer.camera.direction,
          up: this.viewer.camera.up,
          position: this.viewer.camera.position,
          right: this.viewer.camera.right,
          Description: this.Points,
          DescriptionLine: this.linePoints,
        };
        this.$emit("submitData", result);
      }
    },


    // 点位信息
    InitPointEntity(datas) {
      // console.log(datas,'datas');
      for (var i = 0; i < this.EarthIds.length; i++) {
        var getByEarth = this.viewer.entities.getById(this.EarthIds[i]);
        this.viewer.entities.remove(getByEarth);
      }
    
      for (let item of datas) {
        // console.log(item, "item");
        let billboardObj = new Cesium.BillboardGraphics({
          image: require(`@/assets/gis/gis-entity/icon3d/${item.Type_Id}-${
            item.Status ? "on" : "off"
          }.png`),
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
        this.EarthIds.push(item.ID);
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
            text: item.Point_Name,
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
            disableDepthTestDistance: 50000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, -58), //偏移量
          }),
          billboard: billboardObj,
        });
      }
    },

    drawPoint(position) {
      let viewer = this.viewer;
      // 本质上就是添加一个点的实体
      return viewer.entities.add({
        name: "point",
        position: position,
        point: {
          color: Cesium.Color.WHEAT,
          pixelSize: 5,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 规定贴地
        },
      });
    },

    handleOpenClick() {
      this.$refs.fileInput.click();
    },

    handleFileChange(evt) {
      let viewer = this.viewer;
      let files = evt.target.files;
      if (files.length > 0) {
        let file = evt.target.files[0];
        let fileReader = new FileReader();

        fileReader.onload = () => {
          viewer.dataSources
            .add(
              Cesium.KmlDataSource.load(new Blob([fileReader.result]), {
                camera: viewer.scene.camera,
                canvas: viewer.scene.canvas,
                //开启贴地
                clampToGround: true,
              })
            )
            .then((kmlDataSource) => {
              viewer.dataSources.add(kmlDataSource);
              var entities = kmlDataSource.entities.values;
              for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                // console.log("entity", entity);
                if (entity.position) {
                  var cartographic = Cesium.Cartographic.fromCartesian(
                    entity.position.getValue(Cesium.JulianDate.now())
                  );
                  var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                  var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                  // console.log(
                  //   "Longitude: " + longitude + ", Latitude: " + latitude
                  // );
                  // var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                }
              }
              kmlDataSource.entities.values.forEach(function(entity) {
                if (entity.polygon) {
                  entity.polygon.outline = true;
                  entity.polygon.outlineColor = Cesium.Color.RED;
                  entity.polygon.outlineWidth = 3;
                }
                if (entity._billboard) {
                  entity.billboard.heightReference =
                    Cesium.HeightReference.CLAMP_TO_GROUND;
                  entity._label.pixelOffset = new Cesium.Cartesian2(10, -20);
                }
              });
              viewer.zoomTo(kmlDataSource.entities);
            });
        };
        fileReader.readAsText(file);
      }
      this.$refs.fileInput.value = null;
    },

    saveKml() {
      let viewer = this.viewer;
      let funDownload = function(content, filename) {
        let eleLink = document.createElement("a");
        eleLink.download = filename;
        eleLink.style.display = "none";
        // 字符内容转变成blob地址
        let blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      };
      let entities = new Cesium.EntityCollection();
      let dataSources = viewer.dataSources;

      for (let i = 0, j = dataSources.length; i < j; i++) {
        for (let v of dataSources.get(i).entities.values) {
          entities.add(v);
        }
      }
      for (let v of viewer.entities.values) {
        entities.add(v);
      }

      if (entities.values.length) {
        let promise = Cesium.exportKml({ entities: entities });
        promise.then(function(e) {
          funDownload(e.kml, new Date().getTime() + ".kml");
        });
      } else {
        alert("当前场景没有entities实体");
      }
    },

    // 绘制推演线和面
    draw(type, color) {
      // console.log("color", color);
      let that = this;
      let viewer = this.viewer;
      let tempEntities = this.tempEntities;
      let position = [];
      let tempPoints = [];
      viewer.scene.globe.depthTestAgainstTerrain = true;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      switch (type) {
        case "Point":
          handler.setInputAction(function(movement) {
            let ray = viewer.camera.getPickRay(movement.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            let point = that.drawPoint(position);
            tempEntities.push(point);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          handler.setInputAction(function() {
            handler.destroy();
            handler = null;
          }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
          handler.setInputAction(function() {
            handler.destroy();
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;

        // 绘制线
        case "Polyline":
          handler.setInputAction(function(movement) {},
          Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          handler.setInputAction(function(click) {
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            let point = that.drawPoint(tempPoints[tempPoints.length - 1]);
            tempEntities.push(point);
            if (tempLength > 1) {
              let pointline = that.drawPolyline([
                tempPoints[tempPoints.length - 2],
                tempPoints[tempPoints.length - 1],
              ]);
              tempEntities.push(pointline);
              that.drawPolyline(tempPoints);
            }
            // console.log("绘制线的tempEntities", tempEntities);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          handler.setInputAction(function(click) {
            // 清空点位记录
            tempPoints = [];
            handler.destroy();
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;

        // 绘制面
        case "Polygon":
          handler.setInputAction(function(movement) {},
          Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          handler.setInputAction(function(click) {
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            // 点位
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            let point = that.drawPoint(tempPoints[tempPoints.length - 1]);
            tempEntities.push(point);
            if (tempLength > 1) {


              // let pointline = that.drawPolyline(
              //   [
              //     tempPoints[tempPoints.length - 2],
              //     tempPoints[tempPoints.length - 1],
              //   ],
              //   color
              // );

              // tempEntities.push(pointline);
              that.drawPolygon(tempPoints, color, 1);
            }
            
            // console.log("绘制面的tempEntities", tempEntities);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          handler.setInputAction(function(click) {
            let cartesian = viewer.camera.pickEllipsoid(
              click.position,
              viewer.scene.globe.ellipsoid
            );
            if (cartesian) {
              let tempLength = tempPoints.length;
              if (tempLength < 3) {
                alert("闭合操作需要至少3个点嗷");
              } else {


                // 闭合最后一条线

                // let pointline = that.drawPolyline(
                //   [
                //     tempPoints[tempPoints.length - 2],
                //     tempPoints[tempPoints.length - 1],
                //   ],
                //   color
                // );
                // tempEntities.push(pointline);


                that.drawPolygon(tempPoints, color, 2);
                tempEntities.push(tempPoints);
                handler.destroy();
                handler = null;
              }
            }
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
      }
    },

    drawPolyline(positions, color) {
      // console.log("线几何对象", positions);
      this.linePoints = positions;
      let viewer = this.viewer;
      if (positions.length < 1) return;
      var redCircle = viewer.entities.add({
        name: "line",
        polyline: {
          positions: positions,
          width: 5.0,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.GOLD,
          }),
          depthFailmaterial: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.GOLD,
          }),
          clampToGround: true,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      if (color == 1) {
        redCircle.polyline.material = new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.GREEN,
        });
      }
    },

    loadingPoints(){
      this.http
        .post("/api/Mon_Point_Manager/getPageData", {
          order: "asc",
          page: 1,
          rows: 30,
          sort: "ID",
          value: 1,
          wheres: JSON.stringify([{ name: "Group_Id", value: this.valueID }]),
        })
        .then((data) => {
          //加载点位
          this.InitPointEntity(data.rows); 
        });
    },

    // 用于编辑回显绘制过的图形
    drawPolygonLast(positions) {
      let viewer = this.viewer;
      positions.forEach((x) => {
        // console.log("x", x);
        if (x.length < 2) return;
        var polygons = viewer.entities.add({
          name: "gon",
          polygon: {
            hierarchy: x,
            material: Cesium.Color.GREEN.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });
        if (x[0].color == 1) {
          polygons.polygon.material = Cesium.Color.GREEN.withAlpha(0.5);
        }
        if (x[0].color == 2) {
          polygons.polygon.material = Cesium.Color.ORANGE.withAlpha(0.5);
        }
        if (x[0].color == 3) {
          polygons.polygon.material = Cesium.Color.RED.withAlpha(0.5);
        }
      });
      return;
    },

    drawPolygon(positions, color, point) {
      // 画一根线写入该图形的颜色  1绿 2橙 3红
      positions.map((item) => {
        item["color"] = color;
      });

      // 闭合时 写入this.Points
      if (point == 2) {
        var random = Math.random();
        positions.map((item) => {
          item["id"] = random;
        });
        this.Points.push(positions);
      }

      let viewer = this.viewer;
      if (positions.length < 2) return;
      var polygons = viewer.entities.add({
        name: "gon",
        polygon: {
          hierarchy: positions,
          material: Cesium.Color.YELLOW.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      if (color == 1) {
        polygons.polygon.material = Cesium.Color.GREEN.withAlpha(0.5);
      }
      if (color == 2) {
        polygons.polygon.material = Cesium.Color.ORANGE.withAlpha(0.5);
      }
      if (color == 3) {
        polygons.polygon.material = Cesium.Color.RED.withAlpha(0.5);
      }
      return;
    },


    /* 清除实体 */
    clearAllDrawn() {
      let viewer = this.viewer;
      this.tempEntities = [];
      (this.AngleData.Description = []),
      (this.AngleData.DescriptionLine = []),
      (this.Points = []),
      (this.linePoints = []),
      viewer.entities.removeAll();
      viewer.dataSources.removeAll();
      this.loadingPoints();
       
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
<style lang="less" scoped>
.wrap {
  height: calc(100vh - 112px);
  overflow: auto;
  scrollbar-color: transparent transparent;
  &::-webkit-scrollbar {
    display: none;
  }
}
.active {
  color: #ffffff;
  background: #49c4a9;
}
.form {
  display: flex;
}
.form div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
#gisBoxLayer {
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
.names {
  width: 250px;
  height: 410px;
  position: absolute;
  left: 12px;
  top: 70px;
  z-index: 999;
  background: rgba(6, 30, 66, 0.6);
  overflow-y: auto;
  max-height: 410px;
  padding: 10px 10px;
  line-height: 40px;
}
.groupName {
  color: white;
  font-size: 14px;
  cursor: pointer;
}
</style>
