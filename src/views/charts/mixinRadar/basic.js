import store from "@/store/index";


export default {
  data() {
    return {
      dialogVisible: false,
      viewer: null,
      tdtUrl: 'https://t{s}.tianditu.gov.cn/',
      token: '1d607a8dea50f6bd7d8d2fb17262a21e',
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
    }
  },
  methods: {
    GisLocalPoint(positionData, nodeList, showType = 'point') {
      switch (showType) {
        case 'point':
          this.currentNodeList = nodeList;
          this.MoveLocal(positionData);//平移
          this.InitPointEntity(nodeList);//加载
          break;
        case 'group':
          // this.currentNodeList = nodeList;
          this.MoveLocal(this.currentPro, false);
          this.InitGroupEntity(nodeList);
          break;
      }
    },
    
    // 点位加载
    InitPointEntity(datas) {
      this.viewer.entities.removeAll();
      for (let item of datas) {
        let billboardObj = new Cesium.BillboardGraphics({
          image: require(`@/assets/gis/gis-entity/icon3d/${item.Type_Id}-${item.Status ? 'on' : 'off'}.png`),
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
        // 添加标记点位 加载点
        this.viewer.entities.add({
          id: parseInt(item.ID),
          name: "monitorPoint",
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(item.Long),
            parseFloat(item.Lat),
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

    // 组加载
    InitGroupEntity(datas) {
      this.viewer.entities.removeAll();
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

    InitLandform() {
      let terrainProvider = new Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      this.viewer.terrainProvider = terrainProvider;

      // var terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
      //   url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
      // });
      // window.viewer.terrainProvider = terrainProvider;
    },
    CancelLandform() {
      var ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();
      this.viewer.terrainProvider = ellipsoidProvider;
    },
    MoveLocal(positionData, flyFlag = true) {
      // 获取的视角配置
      // console.log(positionData.lang,positionData.lat,positionData.Long,positionData.Lat,'positionData');
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
      // console.log(positionData.GIS_Config , positionData.giS_Config);
        let three_object = JSON.parse(positionData.GIS_Config?positionData.GIS_Config:positionData.giS_Config);
        // console.log("three_object",three_object);
        let localPointData = {
          destination: three_object && three_object.position ? three_object.position : position,
          orientation: {
            direction: three_object && three_object.direction ? three_object.direction : this.viewer.camera.direction,
            up: three_object && three_object.up ? three_object.up : this.viewer.camera.up,
            right: three_object && three_object.right ? three_object.right : this.viewer.camera.right
          }
        };
        if (flyFlag) {
          this.viewer.camera.flyTo(localPointData);
        } else {
          this.viewer.camera.setView(localPointData);
        }
      } else {
        this.viewer.camera.setView({
          destination: position,
        });
      }

    },
    async GisChangeLayer(basicLayer) {
      switch (basicLayer) {
        case "image":
          this.layers.image = this.viewer.imageryLayers.addImageryProvider(
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
          this.layers.map =  this.viewer.imageryLayers.addImageryProvider(tdtLayer);
          break;
        case "hd":
          this.layers.hd =  this.viewer.imageryLayers.addImageryProvider(
            new Cesium.ArcGisMapServerImageryProvider({
              url: "https:/services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            })
          );
          this.viewer.imageryLayers.raiseToTop(this.labels.ibo);

          break;
        default:
      }
      this.CheckLabelIndex();


    },
    GisChangeLabel(type, labels) {   
      if (labels[type]) {
        this.viewer.imageryLayers.raiseToTop(this.labels[type]);
      } else {
        this.viewer.imageryLayers.lowerToBottom(this.labels[type]);
      }
    },
    GisChangeLandform(flag) {
      if (flag) {
        this.InitLandform();
      } else {
        this.CancelLandform();
      }
    },
    CallBackGroup() {
      this.GisLocalPoint(this.currentPro, this.groupList, 'group');
      this.CloseDetail();
    },
    CloseDetail() {
      this.hide();
      this.switchDetailFlag = false;
      this.entitylessen(this.lastEntityId);
      this.lastEntityId = null;
    },
    CheckLabelIndex() {
     for (let labelType in this.labelStatus) {
        // 遍历labelStatus对象，获取每个类型的标签
        let label = this.labelStatus[labelType];
        // 如果该标签的flag属性为true，则将标签提升到视图的顶部，否则将标签降低到视图的底部
        if (label.flag) {
          // 提升标签到顶部
          this.viewer.imageryLayers.raiseToTop(this.labels.label);
        } else {
          // 降低标签到底部
          this.viewer.imageryLayers.lowerToBottom(this.labels.label);
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
