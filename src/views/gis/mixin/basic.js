import store from "@/store/index";
import http from "@/api/http.js";
console.log('xjchlrbaseURL',http.ipAddress)
export default {
  data() {
    return {
      imgUrl:http.ipAddress,
      EarthIds:[],
      LayerIds:[],
      LayerIds2:[],
      LayerNames:[],
      pointIds:[],
      groupIds:[],
      earthquakeList:[],//地震数据
      dataSourceName:'',
      dialogVisible: false,
      viewer: null,
      handler:null,
      tdtUrl: 'https://t{s}.tianditu.gov.cn/',
      token: '1d607a8dea50f6bd7d8d2fb17262a21e',//'436ce7e50d27eede2f2929307e6b33c0',
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      removeHandler: null,
      removeFlag: false, // 是否显示
      currentNodeList: null,
      currentPro: null,
      currentGroup: null,
      groupList: null,
      layers: {
        image: null,
        map: null,
        hd: null,
      },
      labels: {
        ibo: null,
        label: null,
      },
      labelStatus: {
        ibo: {
          title: '边界',
          flag: false,
          type: "ibo"
        },
        label: {
          title: '行政路线',
          flag: false,
          type: 'label'
        },
      },
      simulateList: [{
        "id": "43492",
        "CATA_ID": "CC20220413110055.00",
        "SAVE_TIME": "2022-04-13 11:01:45",
        "O_TIME": "2022-04-13 11:00:55",
        "EPI_LAT": "29.951135284242977",
        "EPI_LON": "98.32493987713103",
        "EPI_DEPTH": 150,
        "AUTO_FLAG": "M",
        "EQ_TYPE": "M",
        "O_TIME_FRA": "0",
        "M": "6.1",
        "LOCATION_C": "\u897f\u85cf\u81ea\u6cbb\u533a\u660c\u90fd\u5e02\u8292\u5eb7\u53bf\u5982\u7f8e\u9547",
        "SYNC_TIME": "2022-04-13 11:20:57",
      }, {
        "id": "43493",
        "CATA_ID": "CC20220413110055.00",
        "SAVE_TIME": "2022-04-13 11:01:45",
        "O_TIME": "2022-04-13 11:00:55",
        "EPI_LAT": "27.55973507462754",
        "EPI_LON": "110.00209443742825",
        "EPI_DEPTH": 30,
        "AUTO_FLAG": "M",
        "EQ_TYPE": "M",
        "O_TIME_FRA": "0",
        "M": "6.1",
        "LOCATION_C": "\u6e56\u5357\u7701\u6000\u5316\u5e02",
        "SYNC_TIME": "2022-04-13 11:20:57",
      }]
    }
  },
  methods: {
    GisLocalPoint(positionData, nodeList, showType = 'point') {
      switch (showType) {
        case 'point':
          this.currentNodeList = nodeList;
          this.MoveLocal(positionData);//平移
          this.InitPointEntity(nodeList);//加载
          // this.leftDownAction()
          break;
        case 'group':
          // this.currentNodeList = nodeList;
          this.MoveLocal(this.currentPro, false);
          this.InitGroupEntity(nodeList);
          break;
          case 'point_ajax':
            this.currentNodeList = nodeList;
            console.log("加载点位",positionData);
            if(positionData.giS_Config.length<10){
              return this.$message.error("未设置飞行坐标giS_Config字段为空");
            }
            this.MoveLocal(positionData);//平移

            this.http.post('/api/Mon_Point_Manager/getPageData', { order: "asc", page: 1, rows: 30, sort: "ID", value: 1, wheres: JSON.stringify([{ name: "Group_Id", value: positionData.id }]) }).then((data) => {
            // console.log("???????????????????????????",data.rows.length);
            if(data.rows.length>0){
              this.InitPointEntity(data.rows);//加载
            }
            });
            // this.leftDownAction()
            break;
      }
    },
   
    InitPointEntity(datas) {
      // console.log(datas,'datas？？？？？？？？？？？？？？？？？？？？？？？？？？？');
      for (var i = 0; i < this.pointIds.length; i++) {
        var getByEarth = window.viewer.entities.getById(this.pointIds[i]);
        window.viewer.entities.remove(getByEarth);
      }
     
      for (let item of datas) {
        // console.log(item,'item');
        let spop=Cesium.Cartesian3.fromDegrees(
          parseFloat(item.Long),
          parseFloat(item.Lat),
        )
        let billboardObj = new Cesium.BillboardGraphics({
          //image: require(`@/assets/gis/gis-entity/icon3d/${item.Type_Id}-${item.Status ? 'on' : 'off'}.png`),
          //image:this.imgUrl+item.Type_Icon,//状态在线不在线 图片样式
          image: require(`@/assets/gis/gis-entity/icon3d/group_blue.png`),
          color: Cesium.Color.WHITE.withAlpha(1),
          height: 42,
          width: 34,
          rotation: 0,
          sizeInMeters: false,
          show: true,
          scale: 1.0,
          disableDepthTestDistance: 50000,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, 
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        });
        const description = JSON.stringify(item);
        this.pointIds.push(item.ID);

        window.viewer.entities.add({
          id: parseInt(item.ID),
          name: "monitorPoint",
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(item.Long?item.Long:0),
            parseFloat(item.Lat?item.Lat:0),
          ),
          description,
          label: new Cesium.LabelGraphics({
            //文字标签
            text: item.Point_Name,
            font: "600 10pt",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
            disableDepthTestDistance: 50000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, -48), //偏移量
          }),
          billboard: billboardObj,
        });
      }
    },
    
    InitGroupEntity(datas) {
      for (var i = 0; i < this.groupIds.length; i++) {
        var getByEarth = window.viewer.entities.getById(this.groupIds[i]);
        window.viewer.entities.remove(getByEarth);
      }

      for (let item of datas) {
        let billboardObj = new Cesium.BillboardGraphics({
          image: require(`@/assets/gis/gis-entity/icon3d/group_blue.png`),
          color: Cesium.Color.WHITE.withAlpha(1),
          height: 42,
          width: 34,
          rotation: 0,
          sizeInMeters: false,
          show: true,
          scale: 1.0,
          disableDepthTestDistance: 50000,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, 
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        });
        const description = JSON.stringify(item);
        this.groupIds.push(item.ID);
        window.viewer.entities.add({
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
            font: "600 10pt",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM + 100, //垂直方向以底部来计算标签的位置
            disableDepthTestDistance: 50000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, -48), //偏移量 -42
          }),
          billboard: billboardObj,
        });
      }
    },

    initEarthquakeEntity(datas) {
      for (let item of datas) {
        let billboardObj = new Cesium.BillboardGraphics({
          image: require(`../../../assets/earthquake_point/${this.quake_level(item.M)}_${this.quake_time(
            item.O_TIME
          )}.png`),
          color: Cesium.Color.WHITE.withAlpha(1),
          height: 42,
          width: 34,
          rotation: 0,
          sizeInMeters: false,
          show: true,
          scale: 1.0,
          disableDepthTestDistance: 50000,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, 
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        });
        const description = JSON.stringify(item);
        this.EarthIds.push(item.id);
        viewer.entities.add({
          id: parseFloat(item.id),
          name: "earthPoint",
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(item.EPI_LON),
            parseFloat(item.EPI_LAT)
          ),
          description,
          label: new Cesium.LabelGraphics({
            //文字标签
            text: item.Group_Name,
            font: "600 10pt",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM + 100, //垂直方向以底部来计算标签的位置
            disableDepthTestDistance: 50000,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelOffset: new Cesium.Cartesian2(0, -48), //偏移量 -42
          }),
          billboard: billboardObj,
        });
      }
    },

    leftDownAction(){
      const handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
      handler.setInputAction(function(movement) {
        const picked = window.viewer.scene.pick(movement.position)
        // document.getElementById('stateShow').style.display = "block";
        // console.log("picked",JSON.parse(picked.id.description._value));
        
        if (picked && picked.id) {
          let data =JSON.parse(picked.id.description._value)
          let gisPosition = Cesium.Cartesian3.fromDegrees(
            data.Long,
            data.Lat,
            0
          );
          document.getElementById('stateShow').style.display = 'block' //弹出信息框
          //实时更新位置
          window.viewer.scene.postRender.addEventListener(() => {
          //转化为屏幕坐标
          var windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.viewer.scene, gisPosition);
          if (windowPosition == undefined) return
            document.getElementById('stateShow').style.left = (windowPosition.x - (220 / 2)) + 'px'
            document.getElementById('stateShow').style.top = (windowPosition.y - 650) + 'px'

          //解决滚动不隐藏问题
          const camerPosition = window.viewer.camera.position;
          let height = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
          height += window.viewer.scene.globe.ellipsoid.maximumRadius;
          if ((!(Cesium.Cartesian3.distance(camerPosition, gisPosition) > height)) && window.viewer.camera.positionCartographic.height < 50000000) {
              document.getElementById('stateShow').style.display = "block"
          } else {
              document.getElementById('stateShow').style.display = "none"
          }
            })
        } else {
          document.getElementById('stateShow').style.display = "none";
        }
          
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    InitLandform() {
      let terrainProvider = new Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      window.viewer.terrainProvider = terrainProvider;

      // var terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
      //   url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
      // });
      // window.viewer.terrainProvider = terrainProvider;
    },
    CancelLandform() {
      var ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
      window.viewer.terrainProvider = ellipsoidProvider;
    },
    MoveLocal(positionData, flyFlag = true) {
      const long = positionData.long |positionData.Long;
      const lat = positionData.lat |positionData.Lat;
      let position;
      if (long && lat) {
        position = Cesium.Cartesian3.fromDegrees(
          long,
          lat,
          3000
        );
      }
      if (positionData.GIS_Config || positionData.giS_Config) {
        let three_object = JSON.parse(positionData.GIS_Config?positionData.GIS_Config:positionData.giS_Config);
        let localPointData = {
          destination: three_object && three_object.position ? three_object.position : position,
          orientation: {
            direction: three_object && three_object.direction ? three_object.direction : window.viewer.camera.direction,
            up: three_object && three_object.up ? three_object.up : window.viewer.camera.up,
            right: three_object && three_object.right ? three_object.right : window.viewer.camera.right
          }
        };
        if (flyFlag) {
          window.viewer.camera.flyTo(localPointData);
        } else {
          window.viewer.camera.setView(localPointData);
        }
      } else {
        window.viewer.camera.setView({
          destination: position,
        });
      }
    },
    async GisChangeLayer(basicLayer) {
      // console.log( this.layers, 'this.layers');
      switch (basicLayer) {
        case "image":
          this.layers.image = window.viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              url: this.tdtUrl + "DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + this.token,
              subdomains: this.subdomains,
              tilingScheme: new Cesium.WebMercatorTilingScheme(),
              maximumLevel: 18,
            })
          );
          break;
        case "map":
          let tdtLayer = new Cesium.UrlTemplateImageryProvider({
            url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            minimumLevel: 3,
            maximumLevel: 18,
          });
          this.layers.map =  window.viewer.imageryLayers.addImageryProvider(tdtLayer);
          break;
        case "hd":
          this.layers.hd =  window.viewer.imageryLayers.addImageryProvider(
            new Cesium.ArcGisMapServerImageryProvider({
              url: "https:/services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            })
          );
          window.viewer.imageryLayers.raiseToTop(this.labels.ibo);

          break;
        default:
          console.log("参数出错了");
      }
      this.CheckLabelIndex();


    },
    GisChangeLabel(type, labels) {
      if (labels[type]) {
        window.viewer.imageryLayers.raiseToTop(this.labels[type]);
      } else {
        window.viewer.imageryLayers.lowerToBottom(this.labels[type]);
      }
    },
    GisChangeLandform(flag) {
      if (flag) {
        this.InitLandform();
      } else {
        this.CancelLandform();
      }
    },
    
    // 同震图层
    changesimulate(type,value){
      if (value) {
        const sourceList = [
          "http://159.75.243.87:9991/TongZhen/luhsan.kmz",
          "http://159.75.243.87:9991/TongZhen/fengxianpingjia.kmz",
        ];
        for (let sourceUrl of sourceList) {
          const kmlPromise = Cesium.KmlDataSource.load(sourceUrl, {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
          });
          kmlPromise.then((dataSource) => {
            // console.log("???????????????",dataSource);
            this.dataSourceName = "earthquake_common";
            viewer.dataSources.add(dataSource);
            viewer.zoomTo(dataSource.entities);
          });
        }
      } else {
        viewer.dataSources.removeAll();
      }
    },

    // 地震图层
    emitEarthquakLoadMore(type,value){
      if(value){
        let url = `api/Layer/GetEarthquakeData`;
        this.http.get(url, {}, true).then((result) => {
        const earthquakeListData = Array.from(new Set(result.data));
        this.earthquakeList = Array.from(new Set([...this.earthquakeList, ...earthquakeListData]));
        this.initEarthquakeEntity(this.earthquakeList);
      });
      }else{
        for (var i = 0; i < this.EarthIds.length; i++) {
          var getByEarth = viewer.entities.getById(this.EarthIds[i]);
          viewer.entities.remove(getByEarth);
        }
      }
    },

    // 天气预报图层
    emitWeatheLoadMore(type,value){
      if(value){
        let url = `api/Layer/GetWeatherData`;
        this.http.get(url, {}, true).then((result) => {
        console.log("天气",result);
      });
      }
    },

    // 接口获取的图层
    // emitMyLayerNow(value,type,ID,names){
    //   console.log(value,type,ID,names);
    //   if(type){
    //     for (var i = 0; i < this.LayerIds.length; i++) {
    //       var getByEarth = window.viewer.entities.getById(this.LayerIds[i]);
    //       viewer.entities.remove(getByEarth);
    //     }
    //     let layer=JSON.parse(value)
    //     if(layer.Description){
    //       this.drawPolygon(layer.Description,ID);
    //       // this.goFlytoPolyline(layer.Description[0]);
    //     }
    //     if(layer.DescriptionLine){
    //       console.log("layer.DescriptionLine",layer.DescriptionLine);
    //       this.drawPolyline(layer.DescriptionLine,names);
    //     }
    //   }else{
    //     // for (var i = 0; i < this.LayerIds.length; i++) {
    //     //   var getByEarth = window.viewer.entities.getById(ID);
    //     //   viewer.entities.remove(getByEarth);
    //     // }
    //       // var getByEarth = window.viewer.entities.getById(ID);
    //       // viewer.entities.remove(getByEarth);
    //       var getByline= window.viewer.entities.getById(names);
    //       viewer.entities.remove(getByline);
    //   }
    // },

    // 接口获取的图层
     emitMyLayerNow(value,type,ID,names){

        for (var i = 0; i < this.LayerIds.length; i++) {
          var getByEarth = window.viewer.entities.getById(this.LayerIds[i]);
          viewer.entities.remove(getByEarth);
        }
        var getByline= window.viewer.entities.getById(names);
          viewer.entities.remove(getByline);

        let layer=JSON.parse(value)
        if(layer.Description){
          this.drawPolygon(layer.Description,ID);
          this.initFly(layer);
          // this.goFlytoPolyline(layer.Description[0]);
        }
        if(layer.DescriptionLine){
          // console.log("layer.DescriptionLine",layer.DescriptionLine);
          this.drawPolyline(layer.DescriptionLine,names);
        }
    
    },

    // 接口获取的图层
    emitMyLayerNow2(value,type,ID,names){
      // console.log("搜索图层",value,type,ID,names);
        for (var i = 0; i < this.LayerIds2.length; i++) {
          var getByEarth = window.viewer.entities.getById(this.LayerIds2[i]);
          viewer.entities.remove(getByEarth);
        }
        var getByline= window.viewer.entities.getById(names);
          viewer.entities.remove(getByline);

        let layer=JSON.parse(value)
        // console.log("layer",layer);
        if(layer.Description){
          this.drawPolygon2(layer.Description,ID);
          // console.log("飞");
          this.initFly(layer);
          // this.goFlytoPolyline(layer.Description[0]);
        }
        if(layer.DescriptionLine){
          // console.log("layer.DescriptionLine",layer.DescriptionLine);
          this.drawPolyline(layer.DescriptionLine,names);
        }
    
    },

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

      window.viewer.camera.flyTo({
        destination: finalDestination,
      });
    },

    //定位到绘制多边形视角
    initFly(layer) {
      window.viewer.scene.camera.setView({
        destination: layer.position,
        duration: 5, //定位的时间间隔
        orientation: {
          direction: layer.direction,
          up: layer.up,
          right:layer.right,
        },
      });
      this.handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);
    },

    // drawPolygon(positions,ID) {
    //   console.log("positions",positions);
    //   // return window.viewer.entities.add({
    //   //   id:parseFloat(ID),
    //   //   name: "gon",
    //   //   polygon: {
    //   //     hierarchy: positions,
    //   //     material: Cesium.Color.YELLOW.withAlpha(0.5),
    //   //     outline: true,
    //   //     outlineColor: Cesium.Color.BLACK,
    //   //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //   //   },
    //   // });
    // },

    drawPolygon(positions,ID) {
      // console.log("drawPolygon",positions);
      positions.forEach((x) => {
        if (x.length < 2) return;
        this.LayerIds.push(x[0].id);
        var polygons = window.viewer.entities.add({
          id:parseFloat(x[0].id),
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

    drawPolygon2(positions,ID) {
      // console.log("drawPolygon",positions);
      positions.forEach((x) => {
        if (x.length < 2) return;
        this.LayerIds2.push(x[0].id);
        var polygons = window.viewer.entities.add({
          id:parseFloat(x[0].id),
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

    drawPolyline(positions,names) {
      this.LayerNames.push(names);
      if (positions.length < 1) return;
      return window.viewer.entities.add({
        id:names,
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
    },

    GisFunctionhandleFile(evt){
      // console.log("evt",evt);
      // let viewer = this.viewer;
      let files = evt.target.files;
      if (files.length > 0) {
        let file = evt.target.files[0];
        let fileReader = new FileReader();

        fileReader.onload = () => {
          window.viewer.dataSources
            .add(
              Cesium.KmlDataSource.load(new Blob([fileReader.result]), {
                camera: window.viewer.scene.camera,
                canvas: window.viewer.scene.canvas,
                //开启贴地
                clampToGround: true,
              })
            )
            .then((kmlDataSource) => {
              window.viewer.dataSources.add(kmlDataSource);
              var entities = window.viewer.entities;
              console.log("entities", entities);

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
              window.viewer.zoomTo(kmlDataSource.entities);
            });
        };
        fileReader.readAsText(file);
      }
      // this.$refs.fileInput.value = null;
    },

    quake_time(time) {
      const quakeTimeCode = new Date(time).getTime();
      const dayTimeCode = new Date().getTime() - 60 * 60 * 24 * 1000;
      const weekTimeCode = new Date().getTime() - 60 * 60 * 24 * 1000 * 7;
      if (quakeTimeCode < weekTimeCode) {
        return 3;
      } else if (dayTimeCode > quakeTimeCode && quakeTimeCode > weekTimeCode) {
        return 2;
      } else {
        return 1;
      }
    },
    quake_level(M) {
      const level = parseFloat(M);
      if (level < 3) {
        return 1;
      } else if (3 <= level && level < 5) {
        return 2;
      } else {
        return 3;
      }
    },

    CallBackGroup() {
      // console.log('显示监测组',this.currentPro);
      this.GisLocalPoint(this.currentPro, this.groupList, 'group');
      this.CloseDetail();
    },
    CloseDetail() {
      this.hide();
      this.hide2();
      this.switchDetailFlag = false;
      this.entitylessen(this.lastEntityId);
      this.lastEntityId = null;
      // console.log(this.switchDetailFlag, 'this.switchDetailFlag');
    },
    CheckLabelIndex() {
      for (let labelType in this.labelStatus) {
        let label = this.labelStatus[labelType];
        console.log(labelType, label.flag, 'labelType');
        if (label.flag) {
          window.viewer.imageryLayers.raiseToTop(this.labels.label);
        } else {
          window.viewer.imageryLayers.lowerToBottom(this.labels.label);
        }
      }
    },
    ChangedialogVisible(flag, group) {
      this.dialogVisible = flag;
      this.currentGroup = group;
      store.dispatch('GisChangeSetting', { key: 'currentGroup', value: group })
    }
  }
}
