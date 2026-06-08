import {
  mapGetters
} from "vuex";
import  url from '../../../../public/static/img/tie7.png'
import  proJSON from '../../../assets/gis/json/Production_2.json'
import projectData from "./data.js"
export default {
  name: "gisBox",
  computed: {
    ...mapGetters(["proId"]),
  },
  data() {
    return {
      click_point: null,
      c: null,
      target_position: null,
      isVisible: null,
      cartesian_2: null,
      isInit: null,
      addtitle: null,
      addDiv: null,
      addcontent: null,
      lastEntityId: null,
      removeHandler:null,
      changedC:null,
      c:null,
      siteInfoDom:null,
      siteInfoPosition:null,
      pointData:null,
      showPointDetailFlag:false,
      showPointDetailFlag2:false,
      imageUrl:url,
      // layerUrl:layerUrl
    };
  },
  methods: {
    async gisInit() {
      // this.currentPro =  (await this.http.post()).pageList;
      this.currentPro =  projectData.result;
      this.groupList = (await this.http.post("/api/Mon_Group_Manager/getPageData", {order:"asc",page:1,rows:30,sort:"ID",wheres:JSON.stringify([{"name":"Project","value":"bht","displayType":"like"}])}, "正在请求中·····")).rows;
      let doms = document.getElementsByClassName("vol-main");
      let domHeight = doms[0].offsetHeight;
      this.gisStyle = {
        height: domHeight - 1 + "px",
      };
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZGFjNDYwYy1jZDI5LTQ5OGYtYmIxOS0wZjU0ZmM3YjhiMjMiLCJpZCI6ODYwNTgsImlhdCI6MTY0NzQ4MTM5MH0.yZJqpA0VgfY0Jk3IhRUxHitgA4Oiwy1nnEambPo_qI0";
      window.viewer = new Cesium.Viewer("gisBox", {
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: this.tdtUrl + `DataServer?T=img_w&x={x}&y={y}&l={z}&tk=` + this.token,
          subdomains: this.subdomains,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 18,
        }),
      });
      viewer.camera.setView({
            destination: {
              x: -3418266.0925008287,
              y: 8425030.46717486,
              z: 5166115.080501804
            }, // 目的地
            // 视角
            orientation: {
              heading: 6.0886597798738284, // 左右
              pitch: -1.4504409628610038, // 上下
              roll: 6.282194973752511, // 倾斜
            },
      });

      window.viewer.extend(Cesium.viewerCesiumNavigationMixin);
      this.InitLandform();
      window.viewer.scene.globe.showGroundAtmosphere = false
      window.viewer.scene.skyAtmosphere.show = false
      window.viewer.scene.sun.show = false
      window.viewer.scene.moon.show = false
      window.viewer.scene.skyBox.show = false
      this.InitHandlerLablelClick();
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
      let iboMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tdtUrl + "DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=" + this.token,
        subdomains: this.subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10,
      });
      this.labels.ibo = window.viewer.imageryLayers.addImageryProvider(iboMap);

      let labelMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tdtUrl + "DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + this.token,
        subdomains: this.subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10,
      });

      this.labels.label = window.viewer.imageryLayers.addImageryProvider(labelMap);
      //this.GisLocalPoint(this.currentPro, this.groupList, 'group');
      window.viewer.imageryLayers.lowerToBottom(this.labels.ibo);
      window.viewer.imageryLayers.lowerToBottom(this.labels.label);
      let that = this;
      // window.viewer.scene.camera.moveStart.addEventListener(() => {
      //         this.removeHandler = window.viewer.scene.postRender.addEventListener(() => {
      //           that.showAt(that.siteInfoPosition,1)
      //         })
      //       })
      //相机移动结束事件
      // window.viewer.scene.camera.moveEnd.addEventListener(() => {
      //   this.removeHandler.call();
      //   this.hide();
      // })


      // 贴图tif
      // this.LayerManagement()
      // 贴图
      this.pin()
      //加载3Dtiles

      // var tileset = new Cesium.Cesium3DTileset({ url: 'http://159.75.243.87:9991/TongZhen/Production_2.json'});
      // window.viewer.scene.primitives.add(tileset);
      // window.viewer.flyTo(tileset);

    },

    // 贴图
     pin(){
      var cby_bg_data=[
        101.7750,36.6811, 0,
        101.7750,36.6781, 0,
        101.7702,36.6772, 0,
        101.7699,36.6822, 0,
      
      ];
      const rotateZ =90
      var cby_bg= window.viewer.entities.add({
        id:"fixed_bg",
        name: "bj",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(cby_bg_data),
          // perPositionHeight: true,
          material: new Cesium.ImageMaterialProperty({
            image:this.imageUrl,
            // transparent:true,
             repeat: new Cesium.Cartesian2(1, 1)

          }),
          rotation: Cesium.Math.toRadians(rotateZ),
          stRotation: Cesium.Math.toRadians(rotateZ),
          zIndex: 2,
          outlineWidth: 2, 
        }
      });
      // this.rotateMaterial(cby_bg.ellipse, 0, 1);
    },

    // 默认加载tif图层
    LayerManagement(){
      // let LayerUrl="http://159.75.243.87:9991/Layer/Landslide001.tif";
      // const layer=window.viewer.imageryLayers.addImageryProvider( new Cesium.SingleTileImageryProvider({
      //   url:"http://159.75.243.87:9991/Layer/Landslide001.tif",
      // }));      
      const du = 'http://159.75.243.87:9991/Layer/Landslide001.tif';

      // window.viewer.imageryLayers.addImageryProvider(
      //   new Cesium.SingleTileImageryProvider({
      //     url: du,
      //   })
      // );
      
      // var provider = new Cesium.WebMapServiceImageryProvider({        
      //   url:'http://159.75.243.87:9991/Layer/Landslide001.tif',         
      //   layers: 'test:img05',                               
      //     parameters: {
      //     service : 'WMS',
      //         format: 'image/png',
      //         srs: 'EPSG:4326',                                 
      //         transparent: true,
      //     }
          
      //   });
    },


    showAt(position,type){
      this.siteInfoDom = document.getElementById('node-detail-box');
      // console.log(this.siteInfoDom,'this.siteInfoDom');
      if(this.showPointDetailFlag){
        this.siteInfoDom.style.display = 'block';
      }else{
        this.siteInfoDom.style.display = 'none';
      }
      let that = this;
      if (that.siteInfoPosition && that.siteInfoDom.style.display == 'block') {
        if(type){
          var winpos = viewer.scene.cartesianToCanvasCoordinates(position);
          if (winpos) {
              that.siteInfoDom.style.left = (winpos.x - 300 / 2).toFixed(0) + 'px';
              that.siteInfoDom.style.top = (winpos.y - 1200).toFixed(0) + 'px';
              console.log(position,that.siteInfoDom.style.left,'进入了', that.siteInfoDom.style.top);
          }
        }else{
            that.siteInfoDom.style.left = (position.x - 400 / 2).toFixed(0) + 'px';
            that.siteInfoDom.style.top = (position.y - 500).toFixed(0) + 'px';
        }
    }

    },
    InitHandlerLablelClick() {
      const handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
      let that = this;
      handler.setInputAction((click) => {
        const pick = window.viewer.scene.pick(click.position);
        if (pick && pick.id) {
          let pointData = JSON.parse(pick.id.description._value);
          // console.log("pointData",pointData);
          this.pointData = JSON.parse(pick.id.description._value);
          that.siteInfoPosition = pick.id.position._value;
          if (pointData.Group_Num) {
            //可以进行监测组操作
            this.ClickGroup(pointData);
          }
          else if(pointData.M){
            this.hide();
            that.show2();
          }
          else {  
            //进行监测点操作
            if (this.lastEntityId) {
              this.entitylessen(this.lastEntityId)
            }
            this.lastEntityId = pick.id.id;
            this.entitylargen(this.lastEntityId);
            this.ClickPoint(pointData);
            this.hide2();
            that.show();
            // console.log(click.position,'click.position');
            // setTimeout(() => {
            // this.showAt(click.position,0)
            // }, 300);

          }
        }else{
          this.hide();
          this.hide2();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


      handler.setInputAction((click) => {
        this.mousePosition = this.GetWGS84FromDKR(click);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    GetWGS84FromDKR(click)
    {
      // let ray = window.viewer.camera.getPickRay(click.endPosition);
      // var cartesian = window.viewer.scene.globe.pick(ray,window.viewer.scene);
      // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      // var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5); 
      // var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);    
      // let wgs84={
      //   lon,
      //   lat,
      // };
      // return wgs84;
      // 获取射线（注意：MOUSE_MOVE事件的位置是click.endPosition）
      let ray = window.viewer.camera.getPickRay(click.endPosition);
      if (!ray) return null; // 射线获取失败时直接返回

      // 尝试获取地球表面交点
      var cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
      if (!cartesian) return null; // 未命中地球表面时返回null

      // 转换坐标（此时cartesian一定有效）
      var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5); 
      var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);    
      return { lon, lat };
    },

    //监测点变小
    entitylessen(id) {
      const lastEntity = viewer.entities.getById(id);
      if(lastEntity){
        lastEntity.billboard.scale = 1.0;
        lastEntity.label.font = "600 10pt";
        lastEntity.label.pixelOffset = new Cesium.Cartesian2(0, -58);
      }
    },

    entitylargen(id) {
      const entity = viewer.entities.getById(id);
      entity.billboard.scale = 1.2;
      entity.label.font = "600 16pt";
      entity.label.pixelOffset = new Cesium.Cartesian2(0, -66);
    },

    //点击监测组位置
    ClickGroup(group) {
      this.switchBoxFlag = true;
      //先注释掉 响应menu的
      // this.$refs.menu.MenuClickGroup(data);
      this.GisLocalPoint(group,group,"point_ajax");
    //   this.http.post('/api/Mon_Point_Manager/getPageData', { order: "asc", page: 1, rows: 30, sort: "ID", value: 1, wheres: JSON.stringify([{ name: "Group_Id", value: group.ID }]) }).then((data) => {
    //     this.GisLocalPoint(group, data.rows);
    // });
    },
    
    //点击监测点位置
    ClickPoint(data) {
      this.switchBoxFlag = false;
      this.switchDetailFlag = true;
       
    },
    show() {
      this.showPointDetailFlag = true;
      
  },
  show2() {
    this.showPointDetailFlag2 = true;
    
},
  hide() {
    this.showPointDetailFlag = false;
      // this.siteInfoDom.style.display = 'none';
  },
  hide2() {
    this.showPointDetailFlag2 = false;
      // this.siteInfoDom.style.display = 'none';
  },
  },
};
