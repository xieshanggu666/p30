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
          <el-button type="primary" size="mini" @click="drawLineRoad"
            >绘制路线</el-button
          ><el-button type="primary" size="mini" @click="drawLineClear"
            >清空路线</el-button
          >
          <!-- <button @click="draw('Polyline')">绘制线</button>
          <button @click="draw('Polygon')">绘制面</button>
          <button @click="clearAllDrawn()">清除实体</button>
          <button @click="saveKml()">保存kml文件</button>
          <button @click="handleOpenClick()">打开文件</button> -->
          <!-- <input
            type="file"
            ref="fileInput"
            class="file"
            @change="handleFileChange"
            style="display: none"
          /> -->
          <!--  -->
          <!-- <el-button type="primary" size="mini" @click="startFly"
            >开始飞行</el-button
          > -->
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
      ObjBindingMap: [],
      tempEntities: [], //存线面
      projectName: null,
      viewer: null,
      receiveData: {
        latitude: "",
        longitude: "",
      },
      marks: [
        {
          lat: 26.745867509177597,
          lng: 102.94382944918667,
          flytime: 50,
          height: 10000,
        },
        {
          lat: 26.667840727760304,
          lng: 102.94953216687483,
          flytime: 50,
          height: 10000,
        },
        {
          lat: 26.62410069929059,
          lng: 102.94928960918534,
          flytime: 50,
          height: 10000,
        },
        {
          lat: 26.54099013956117,
          lng: 102.9852695077025,
          flytime: 50,
          height: 10000,
        },
        {
          lat: 26.481178940610175,
          lng: 103.00876150187422,
          flytime: 50,
          height: 10000,
        },
      ],
      marksIndex: 1,
      pitchValue: -20,
      changeCameraTime: 5,
      flytime: 50,
      Exection: {},
      handler: {},
      activeShapePoints: [],
      floatingPoint: undefined,
      activeShape: undefined,
      drawingMode: "line",
      Exection: {},
      Points: [],
      editHandler: null,
    };
  },
  mounted() {
    if (this.AngleData.latitude) {
      this.receiveData.latitude = this.AngleData.latitude;
      this.receiveData.longitude = this.AngleData.longitude;
    }
    this.gisInit();
    this.initFly();

    this.drawShapeLast(this.AngleData.activeShapePoints);
    // 绘制线
    this.Points = this.AngleData.activeShapePoints;
    // 转换的点位
    this.initFlyPoints = this.AngleData.initFlyPoints;
  },
  methods: {
    startFly() {
      const { Exection } = this;
      if (Object.keys(Exection).length > 0) {
        console.log("结束");
      }
      this.flyExtent();
    },

    flyExtent() {
      const { viewer, marks, pitchValue } = this;
      const self = this;
      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
      const pitch = Cesium.Math.toRadians(pitchValue);
      // 时间间隔2秒钟
      this.setExtentTime(marks[this.marksIndex].flytime);
      this.Exection = function TimeExecution() {
        let preIndex = self.marksIndex - 1;
        if (self.marksIndex == 0) {
          preIndex = marks.length - 1;
        }
        //计算俯仰角
        let heading = self.bearing(
          marks[preIndex].lat,
          marks[preIndex].lng,
          marks[self.marksIndex].lat,
          marks[self.marksIndex].lng
        );
        heading = Cesium.Math.toRadians(heading);
        // 当前已经过去的时间，单位s
        const delTime = Cesium.JulianDate.secondsDifference(
          viewer.clock.currentTime,
          viewer.clock.startTime
        );
        const originLat =
          self.marksIndex == 0
            ? marks[marks.length - 1].lat
            : marks[self.marksIndex - 1].lat;
        const originLng =
          self.marksIndex == 0
            ? marks[marks.length - 1].lng
            : marks[self.marksIndex - 1].lng;
        const endPosition = Cesium.Cartesian3.fromDegrees(
          originLng +
            ((marks[self.marksIndex].lng - originLng) /
              marks[self.marksIndex].flytime) *
              delTime,
          originLat +
            ((marks[self.marksIndex].lat - originLat) /
              marks[self.marksIndex].flytime) *
              delTime,
          3000
        );
        viewer.scene.camera.setView({
          destination: endPosition,
          orientation: {
            heading: heading,
            pitch: pitch,
          },
        });
        if (
          Cesium.JulianDate.compare(
            viewer.clock.currentTime,
            viewer.clock.stopTime
          ) >= 0
        ) {
          viewer.clock.onTick.removeEventListener(self.Exection);
          //有个转向的功能
          self.changeCameraHeading();
        }
      };
      viewer.clock.onTick.addEventListener(self.Exection);
    },

    // 相机原地定点转向
    changeCameraHeading() {
      const { viewer, marks, pitchValue, changeCameraTime } = this;
      const self = this;
      let { marksIndex } = this;

      let nextIndex = this.marksIndex + 1;
      if (marksIndex == marks.length - 1) {
        nextIndex = 0;
      }
      // 计算两点之间的方向
      const heading = this.bearing(
        marks[marksIndex].lat,
        marks[marksIndex].lng,
        marks[nextIndex].lat,
        marks[nextIndex].lng
      );
      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
      const pitch = Cesium.Math.toRadians(pitchValue);
      // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
      const angle =
        (heading - Cesium.Math.toDegrees(viewer.camera.heading)) /
        changeCameraTime;
      console.log("angle", angle);
      // 时间间隔2秒钟
      this.setExtentTime(changeCameraTime);
      // 相机的当前heading
      const initialHeading = viewer.camera.heading;
      this.Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        const delTime = Cesium.JulianDate.secondsDifference(
          viewer.clock.currentTime,
          viewer.clock.startTime
        );
        const heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
          orientation: {
            heading: heading,
            pitch: pitch,
          },
        });
        if (
          Cesium.JulianDate.compare(
            viewer.clock.currentTime,
            viewer.clock.stopTime
          ) >= 0
        ) {
          viewer.clock.onTick.removeEventListener(self.Exection);
          self.marksIndex =
            ++self.marksIndex >= marks.length ? 0 : self.marksIndex;
          if (self.marksIndex != 0) {
            self.flyExtent();
          }
        }
      };
      viewer.clock.onTick.addEventListener(self.Exection);
    },

    setExtentTime(time) {
      const { viewer } = this;
      const startTime = Cesium.JulianDate.fromDate(new Date());
      const stopTime = Cesium.JulianDate.addSeconds(
        startTime,
        time,
        new Cesium.JulianDate()
      );
      viewer.clock.startTime = startTime.clone(); // 开始时间
      viewer.clock.stopTime = stopTime.clone(); // 结速时间
      viewer.clock.currentTime = startTime.clone(); // 当前时间
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式-达到终止时间后停止
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
    },

    // 角度转弧度
    toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    },

    // 弧度转角度
    toDegrees(radians) {
      return (radians * 180) / Math.PI;
    },

    //计算俯仰角
    bearing(startLat, startLng, destLat, destLng) {
      startLat = this.toRadians(startLat);
      startLng = this.toRadians(startLng);
      destLat = this.toRadians(destLat);
      destLng = this.toRadians(destLng);

      let y = Math.sin(destLng - startLng) * Math.cos(destLat);
      let x =
        Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
      let brng = Math.atan2(y, x);
      let brngDgr = this.toDegrees(brng);

      return (brngDgr + 360) % 360;
    },

    drawPoint(position) {
      let viewer = this.viewer;
      // 本质上就是添加一个点的实体
      return viewer.entities.add({
        name: "点几何对象",
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
                clampToGround: true, //开启贴地
              })
            )
            .then((kmlDataSource) => {
              viewer.dataSources.add(kmlDataSource);
              kmlDataSource.entities.values.forEach(function(entity) {
                if (entity.polygon) {
                  // 为面设置边界线样式
                  entity.polygon.outline = true;
                  entity.polygon.outlineColor = Cesium.Color.RED;
                  entity.polygon.outlineWidth = 3;
                }
                if (entity._billboard) {
                  // entity._billboard.disableDepthTestDistance =
                  //   Number.POSITIVE_INFINITY; //去掉地形遮挡
                  entity.billboard.heightReference =
                    Cesium.HeightReference.CLAMP_TO_GROUND; //设置贴地
                  //设置文字标签，没有颜色(白色在cesium中非常不好看)替换成红色
                  entity._label.pixelOffset = new Cesium.Cartesian2(10, -20);
                  if ("undefined" === typeof entity._label.fillColor) {
                    entity._label.fillColor = Cesium.Color.RED;
                  } //if
                } //if
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
    draw(type) {
      let that = this;
      let viewer = this.viewer;
      let tempEntities = this.tempEntities;
      let position = [];
      let tempPoints = [];
      // 开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;
      // 创建场景的HTML canvas元素
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      switch (type) {
        // 绘制点
        case "Point":
          // 监听鼠标左键 左键单击开始绘制
          handler.setInputAction(function(movement) {
            // 从相机位置创建一条射线，这条射线通过世界中movement.position像素所在的坐标
            let ray = viewer.camera.getPickRay(movement.position);
            // 找到射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。
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
            // 点位
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
            console.log("绘制线的tempEntities", tempEntities);
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
              let pointline = that.drawPolyline([
                tempPoints[tempPoints.length - 2],
                tempPoints[tempPoints.length - 1],
              ]);
              tempEntities.push(pointline);
              that.drawPolygon(tempPoints);
            }
            console.log("绘制面的tempEntities", tempEntities);
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
                let pointline = that.drawPolyline([
                  tempPoints[tempPoints.length - 2],
                  tempPoints[tempPoints.length - 1],
                ]);
                tempEntities.push(pointline);
                that.drawPolygon(tempPoints);
                tempEntities.push(tempPoints);
                handler.destroy();
                handler = null;
              }
            }
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
      }
    },

    drawPolyline(positions) {
      console.log("线几何对象", positions);
      let viewer = this.viewer;
      if (positions.length < 1) return;
      return viewer.entities.add({
        name: "线几何对象",
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
    },
    drawPolygon(positions) {
      console.log("绘制面几何对象", positions);
      let viewer = this.viewer;
      if (positions.length < 2) return;
      return viewer.entities.add({
        name: "面几何对象",
        polygon: {
          hierarchy: positions,
          material: Cesium.Color.YELLOW.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    },
    /* 清除实体 */
    clearAllDrawn() {
      let viewer = this.viewer;
      this.tempEntities = [];
      viewer.entities.removeAll();
    },

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
      window.viewer = this.viewer;
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
      const { viewer, marks } = this;
      const self = this;
      viewer.scene.camera.flyTo({
        destination: this.AngleData
          ? this.AngleData.position
          : window.viewer.camera.position, //定位坐标点，建议使用谷歌地球坐标位置无偏差
        duration: 1, //定位的时间间隔
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

    // 初始化线段
    drawShapeLast(positionData) {
      this.viewer.entities.add({
        polyline: {
          positions: positionData,
          show: true,
          clampToGround: true,
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE,
          }),
        },
      });
    },
    // 绘制路线
    drawLineRoad() {
      const { handler, viewer, activeShapePoints } = this;
      const self = this;
      //鼠标左键
      handler.setInputAction(function(event) {
        var earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          if (activeShapePoints.length === 0) {
            self.floatingPoint = self.createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            var dynamicPositions = new Cesium.CallbackProperty(function() {
              return activeShapePoints;
            }, false);
            self.activeShape = self.drawShape(dynamicPositions); //绘制动态图
          }
          activeShapePoints.push(earthPosition);
          self.createPoint(earthPosition);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //鼠标移动
      handler.setInputAction(function(event) {
        if (Cesium.defined(self.floatingPoint)) {
          var newPosition = viewer.scene.pickPosition(event.endPosition);
          if (Cesium.defined(newPosition)) {
            self.floatingPoint.position.setValue(newPosition);
            activeShapePoints.pop();
            activeShapePoints.push(newPosition);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(function() {
        self.terminateShape();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },

    // 清空路线
    drawLineClear() {
      this.$confirm("此操作将清空绘制路线, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.Points = [];
          this.activeShapePoints = [];
          this.shape = "";
          let result = {
            direction: this.viewer.camera.direction,
            up: this.viewer.camera.up,
            position: this.viewer.camera.position,
            right: this.viewer.camera.right,
            latitude: this.receiveData.latitude,
            longitude: this.receiveData.longitude,
            activeShapePoints: this.Points,
            initFlyPoints: this.initFlyPoints,
          };
          this.$emit("submitData", result);
          this.$message({
            type: "success",
            message: "清空成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空",
          });
        });
    },

    // 形状
    terminateShape() {
      const { activeShapePoints, viewer, flytime } = this;
      activeShapePoints.pop(); //去除最后一个动态点
      if (activeShapePoints.length) {
        this.marks = [];
        for (const position of activeShapePoints) {
          const latitude = this.toDegrees(
            Cesium.Cartographic.fromCartesian(position).latitude
          );
          const longitude = this.toDegrees(
            Cesium.Cartographic.fromCartesian(position).longitude
          );
          this.marks.push({
            lat: latitude,
            lng: longitude,
            flytime,
            height: 10000,
          });
        }
        this.initFlyPoints = this.marks;
        this.drawShape(activeShapePoints); //绘制最终图
      }
      viewer.entities.remove(this.floatingPoint); //去除动态点图形（当前鼠标点）
      viewer.entities.remove(this.activeShape); //去除动态图形
      this.floatingPoint = undefined;
      this.activeShape = undefined;
      this.activeShapePoints = [];
    },

    //绘制点
    createPoint(worldPosition) {
      var point = this.viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      return point;
    },

    //画线
    drawShape(positionData) {
      this.Points = positionData;
      const { drawingMode, viewer } = this;
      var shape;
      if (drawingMode === "line") {
        shape = viewer.entities.add({
          polyline: {
            positions: positionData,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            show: true,
            clampToGround: true,
            width: 10,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.2,
              color: Cesium.Color.BLUE,
            }),
          },
        });
      }
      return shape;
    },

    // 弧度转角度
    toDegrees(radians) {
      return (radians * 180) / Math.PI;
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
        activeShapePoints: this.Points,
        initFlyPoints: this.initFlyPoints,
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
