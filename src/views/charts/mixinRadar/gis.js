import {
  mapGetters
} from "vuex";
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
      viewItems:'',
       //  视角漫游坐标
       flyToPos: [
        // {
        //   x: -1288170.0073434042,
        //   y: 5564833.497088501,
        //   z: 2830565.6856950675,
        // },
        // {
        //   x: -1300146.9651199759,
        //   y: 5552869.280407293,
        //   z: 2852262.8538043695,
        // },
        // {
        //   x: -1266672.7956463464,
        //   y: 5558726.186242932,
        //   z: 2854378.8018786716,
        // },
      ],
      flyToIndx: 1,
      pitchValue: -20,
      viewer:null,
      changeCameraTime:5,
      marks:[],
      marksIndex: 1,
      flyToIndx: 1,
      pitchValue: -20,
      changeCameraTime: 5,
      flytime: 5,
      Exection: {},
      handler: {},
      activeShapePoints: [],
      floatingPoint: undefined,
      activeShape: undefined,
      drawingMode: "line",
      Exection: {},
      Points: [],
      projectName: null,
      viewer: null,
      AngleData:'',
      pointOne:{
        "ID": 35,
        "Project": "白鹤滩水电站",
        "Group_Type": "水电监测",
        "Province": "云南省",
        "City": "昭通市",
        "Country": "巧家县",
        "GIS_Config": "{\"up\": {\"x\": 0.25098916365064694, \"y\": 0.8711668520513195, \"z\": 0.42198667706095105}, \"right\": {\"x\": 0.049157306837289486, \"y\": -0.44684975144549294, \"z\": 0.8932574426320813}, \"position\": {\"x\": -1288708.3596474635, \"y\": 5563371.230075191, \"z\": 2834624.1538304016}, \"direction\": {\"x\": 0.9667409161271976, \"y\": -0.20345420988540913, \"z\": -0.15497866164556634}}",
        "Covering_Config": "1",
        "Group_Comment": "沈家沟滑坡为白鹤滩水电站库岸再造监测工程二期建设新增监测点\t\n",
        "Group_Order": 9,
        "Group_Height": null,
        "Acc_Num": "Upload/Tables/Mon_Group_Manager/202307121732555656/沈家沟.png",
        "Status": 1,
        "CreateID": 1,
        "Creator": "超级管理员",
        "CreateDate": "2021-10-06 16:02:37",
        "ModifyID": 1,
        "Modifier": "超级管理员",
        "ModifyDate": "2023-07-27 00:25:28",
        "Long": 103.031216,
        "Lat": 26.553851,
        "Collectioned": 1,
        "Alarm_Single": null,
        "Alarm_Combine": null,
        "Alarm_Enable": null,
        "IsEvaluation": "",
        "Group_Name": "SJG滑坡",
        "Group_Num": "JC11"
    },
    timer:null,

    };
  },
   unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    async gisInit() {
      this.currentPro =   (await this.http.post("/api/Sys_Personal_Setting/getPageData", {order:"desc",page:1,rows:30,sort:"ID",wheres:"[]"}, "正在请求中·····")).rows[0];
      this.marks=JSON.parse(this.currentPro.GIS_Config).initFlyPoints
      console.log("this.marks",this.marks);
      this.groupList = (await this.http.post("/api/Mon_Group_Manager/getPageData", {order:"asc",page:1,rows:30,sort:"ID",wheres:JSON.stringify([{"name":"Project","value":"","displayType":"like"}])}, "正在请求中·····")).rows;
      if (window.innerHeight < 768 || window.innerHeight <= 1080) {
        let domHeight = 1080;
        this.gisStyle = {
          height: domHeight - 1 + "px",
        };
      } else {
        let domHeight = window.innerHeight - 200;
        this.gisStyle = {
          height: domHeight - 1 + "px",
        };
      }
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZGFjNDYwYy1jZDI5LTQ5OGYtYmIxOS0wZjU0ZmM3YjhiMjMiLCJpZCI6ODYwNTgsImlhdCI6MTY0NzQ4MTM5MH0.yZJqpA0VgfY0Jk3IhRUxHitgA4Oiwy1nnEambPo_qI0";
      this.viewer = new Cesium.Viewer("gisBox", {
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
          url: this.tdtUrl + "DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + this.token,
          subdomains: this.subdomains,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 18,
        }),
      });
      this.viewer.extend(Cesium.viewerCesiumNavigationMixin);
      this.InitLandform();
      this.viewer.scene.globe.showGroundAtmosphere = false
      this.viewer.scene.skyAtmosphere.show = false
      this.viewer.scene.sun.show = false
      this.viewer.scene.moon.show = false
      this.viewer.scene.skyBox.show = false
      // 判断pcikid 及 点击弹框方法
      this.InitHandlerLablelClick();
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      let iboMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tdtUrl + "DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=" + this.token,
        subdomains: this.subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10,
      });
      this.labels.ibo = this.viewer.imageryLayers.addImageryProvider(iboMap);

      let labelMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tdtUrl + "DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + this.token,
        subdomains: this.subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10,
      });

      this.labels.label = this.viewer.imageryLayers.addImageryProvider(labelMap);
      this.GisLocalPoint(this.currentPro, this.groupList, 'group');
      this.viewer.imageryLayers.lowerToBottom(this.labels.ibo);
      this.viewer.imageryLayers.lowerToBottom(this.labels.label);
      
      // 监听地图移动 绑定移动事件
      this.viewer.camera.moveEnd.addEventListener(this.onMoveendMap);
      
      // let that = this;
      // window.viewer.scene.camera.moveStart.addEventListener(() => {
      //   // 方法实时更新位置
      //   this.removeHandler = window.viewer.scene.postRender.addEventListener(() => {
      //     that.showAt(that.siteInfoPosition,1)
      //   })
      // })
      //相机移动结束事件
      // window.viewer.scene.camera.moveEnd.addEventListener(() => {
      //   this.removeHandler.call();
      //   this.hide();
      // })
      // this.ceamFly()
        
      this.initFly();

    },

    initFly() {
      let that=this
      const { viewer } = this;
      this.AngleData={
        direction:{x: 0.4812627174123127, y: -0.805660586009093, z: -0.34539429204953787},
        position:{x: -1288589.9952890554, y: 5564992.555548238, z: 2835306.4578226577},
        right:{x: -0.19656093070120165, y: -0.4831787876764442, z: 0.8531717644539105},
        up:{x: 0.854254059019209, y: 0.3427087382764066, z: 0.3908973309683752}
      }
      viewer.scene.camera.flyTo({
        destination: this.AngleData
          ? this.AngleData.position
          : window.viewer.camera.position, 
        duration: 10, 
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

      this.timer = setInterval(function () {
        that.http.post('/api/Mon_Point_Manager/getPageData', { order: "asc", page: 1, rows: 30, sort: "ID", value: 1, wheres: JSON.stringify([{ name: "Group_Id", value: that.pointOne.ID }]) }).then((data) => {
          console.log("1111",data.rows);
          that.GisLocalPoint(that.pointOne, data.rows);
        });
        
      }, 10000);
      
    },

    
    //获取地图 标识物视角
    onMoveendMap(){
      let viewer=this.viewer;
      let Cesium=window.Cesium;
      let lng=Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(viewer.camera.position).longitude)
      let lat=Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(viewer.camera.position).latitude)
      let height=Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(viewer.camera.position).height)
      let obj={...viewer.camera.position,
        heading:viewer.camera.heading,pitch:viewer.camera.pitch,roll:viewer.camera.roll
      }
      this.viewItems=obj;
  },
   //计算俯仰角
   bearing(startLat, startLng, destLat, destLng) {
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);
    let y = Math.sin(destLng - startLng) * Math.cos(destLat);
    let x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    let brngDgr = this.toDegrees(brng);
    return (brngDgr + 360) % 360;
  },

  // 角度转弧度
  toRadians(degrees) {
    return degrees * Math.PI / 180;
  },
  // 弧度转角度
  toDegrees(radians) {
    return radians * 180 / Math.PI;
  },
  ceamFly() {
    const { Exection } = this;
    if (Object.keys(Exection).length > 0) {
      this.exitFly();
    }
    this.flyExtent();
  },
   //停止飞行
   stopFly() {
    this.viewer.clock.shouldAnimate = false;
  },

  //继续飞行
  continueFly() {
    this.viewer.clock.shouldAnimate = true;
  },

  // 停止漫游 stopFly
  exitFly(){
    const { Exection, viewer, marks, pitchValue } = this
    const self = this;
    viewer.clock.onTick.removeEventListener(Exection);
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
    const pitch = Cesium.Math.toRadians(pitchValue);
    let preIndex = self.marksIndex - 1;
    //计算俯仰角
    let heading = self.bearing(marks[preIndex].lat, marks[preIndex].lng, marks[self.marksIndex].lat, marks[self.marksIndex].lng);
    heading = Cesium.Math.toRadians(heading);
    
    const endPosition = Cesium.Cartesian3.fromDegrees(
      marks[0].lng,
      marks[0].lat,
      marks[0].height
    );
    viewer.scene.camera.setView({
      destination: endPosition,
      orientation: {
        heading: heading,
        pitch: pitch,
      }
    });
  },

  continueFly() {
    // console.log("2");
    const { viewer,marks, pitchValue } = this
    viewer.clock.shouldAnimate = true;
  },

  flyExtent() {
    const { viewer,marks, pitchValue } = this
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
      let heading = self.bearing(marks[preIndex].lat, marks[preIndex].lng, marks[self.marksIndex].lat, marks[self.marksIndex].lng);
      heading = Cesium.Math.toRadians(heading);
      // 当前已经过去的时间，单位s
      const delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
      const originLat = self.marksIndex == 0 ? marks[marks.length - 1].lat : marks[self.marksIndex - 1].lat;
      const originLng = self.marksIndex == 0 ? marks[marks.length - 1].lng : marks[self.marksIndex - 1].lng;
      const endPosition = Cesium.Cartesian3.fromDegrees(
        (originLng + (marks[self.marksIndex].lng - originLng) / marks[self.marksIndex].flytime * delTime),
        (originLat + (marks[self.marksIndex].lat - originLat) / marks[self.marksIndex].flytime * delTime),
        3000
      );
      viewer.scene.camera.setView({
        destination: endPosition,
        orientation: {
          heading: heading,
          pitch: pitch,
        }
      });
      if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
        viewer.clock.onTick.removeEventListener(self.Exection);
        //有个转向的功能
        self.changeCameraHeading();
      }
    };
    viewer.clock.onTick.addEventListener(self.Exection);
  },

  changeCameraHeading() {
    const { viewer ,marks, pitchValue, changeCameraTime } = this
    const self = this;
    let { marksIndex } = this
    let nextIndex = this.marksIndex + 1;
    if (marksIndex == marks.length - 1) {
      nextIndex = 0;
    }
    // 计算两点之间的方向
    const heading = this.bearing(marks[marksIndex].lat, marks[marksIndex].lng, marks[nextIndex].lat, marks[nextIndex].lng);
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
    const pitch = Cesium.Math.toRadians(pitchValue);
    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
    const angle = (heading - Cesium.Math.toDegrees(viewer.camera.heading)) / changeCameraTime;
    // 时间间隔2秒钟
    this.setExtentTime(changeCameraTime);
    // 相机的当前heading
    const initialHeading = viewer.camera.heading;
    this.Exection = function TimeExecution() {
      // 当前已经过去的时间，单位s
      const delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
      const heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
      viewer.scene.camera.setView({
        orientation: {
          heading: heading,
          pitch: pitch,
        }
      });
      if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
        // 停止时移时移事件监听器
        viewer.clock.onTick.removeEventListener(self.Exection);
        // 如果当前时间大于等于停止时间，则将标记索引设置为0，否则保持当前索引
        self.marksIndex = ++self.marksIndex >= marks.length ? 0 : self.marksIndex;
        // 如果当前标记索引不等于0，则执行时移
        if (self.marksIndex != 0) {
          self.flyExtent();
        }
      }
    };
    viewer.clock.onTick.addEventListener(self.Exection);
  },

  // 设置飞行的时间到viewer的时钟里
  setExtentTime(time) {
    let viewer=this.viewer
    const startTime = Cesium.JulianDate.fromDate(new Date());
    const stopTime = Cesium.JulianDate.addSeconds(startTime, time, new Cesium.JulianDate());
    viewer.clock.startTime = startTime.clone();  // 开始时间
    viewer.clock.stopTime = stopTime.clone();     // 结速时间
    viewer.clock.currentTime = startTime.clone(); // 当前时间
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式-达到终止时间后停止
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
  },

  showAt(position,type){
    this.siteInfoDom = document.getElementById('node-detail-box');
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
        }
      }else{
          that.siteInfoDom.style.left = (position.x - 400 / 2).toFixed(0) + 'px';
          that.siteInfoDom.style.top = (position.y - 500).toFixed(0) + 'px';
      }
        
    }
  },
  InitHandlerLablelClick() {
    let dialogElement = document.getElementById("dialog");
 
    //拿到句柄设置 事件
    let trackPop = undefined; //记录鼠标捕获实体的坐标
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    let that = this;
    handler.setInputAction((click) => {
      const pick = this.viewer.scene.pick(click.position);
      if (pick && pick.id) {
        let pointData = JSON.parse(pick.id.description._value);
        this.pointData = JSON.parse(pick.id.description._value);
        that.siteInfoPosition = pick.id.position._value;
        console.log('pick', pick.id._id)
      //获取该店的三维坐标
      let cartesians = pick.primitive.position
      trackPop = cartesians
      //获取 世界坐标 转为 屏幕坐标
      let winpos = that.viewer.scene.cartesianToCanvasCoordinates(cartesians);
      //弹窗位置
      dialogElement.style.left = winpos.x + 20 + "px";
      dialogElement.style.top = winpos.y + 50 + "px";
      if (pick.id._id) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesians);
        dialogElement.style.display = "block";
    } else {
        dialogElement.style.display = "none";
    }
      }else{
        this.hide();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((click) => {
      this.mousePosition = this.GetWGS84FromDKR(click);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    that.viewer.scene.postRender.addEventListener(function (e) {
      if (trackPop) {
          let winpos = that.viewer.scene.cartesianToCanvasCoordinates(
              trackPop
          );
          let bubble = document.getElementById("dialog");
          let poph = bubble.offsetHeight;
          bubble.style.left = winpos.x + 40 + "px";
          bubble.style.top = winpos.y + 90 - poph + "px";
      }
  });
  },
  GetWGS84FromDKR(click)
  {
    let ray = this.viewer.camera.getPickRay(click.endPosition);
    var cartesian = this.viewer.scene.globe.pick(ray,this.viewer.scene);
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4); 
    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);    
    let wgs84={
      lon,
      lat,
    };
    return wgs84;
  },

  //监测点变小
  entitylessen(id) {
    const lastEntity = this.viewer.entities.getById(id);
    if(lastEntity){
      lastEntity.billboard.scale = 1.0;
      lastEntity.label.font = "14pt monospace";
      lastEntity.label.pixelOffset = new Cesium.Cartesian2(0, -58);
    }
  },
  entitylargen(id) {
    const entity = this.viewer.entities.getById(id);
    entity.billboard.scale = 1.2;
    entity.label.font = "18pt monospace";
    entity.label.pixelOffset = new Cesium.Cartesian2(0, -66);
  },
    //点击监测组位置
  // ClickGroup(group) {
  //   console.log("group",group);
  //   this.switchBoxFlag = true;
  //   //先注释掉 响应menu的
  //   // this.$refs.menu.MenuClickGroup(data);
  //   this.http.post('/api/Mon_Point_Manager/getPageData', { order: "asc", page: 1, rows: 30, sort: "ID", value: 1, wheres: JSON.stringify([{ name: "Group_Id", value: group.ID }]) }).then((data) => {
  //     this.GisLocalPoint(group, data.rows);
  //   });
  // },
  //点击监测点位置
  ClickPoint(data) {
    this.switchBoxFlag = false;
    this.switchDetailFlag = true;
  },
  show() {
    this.showPointDetailFlag = true;
  },
  hide() {
    this.showPointDetailFlag = false;
      // this.siteInfoDom.style.display = 'none';
  },
  },
};
