<template>
    <div class="contaniner">
        <div class="pocx" @click.stop="flys">击视角飞行</div>
        <div id="contain"></div>
    </div> 
</template>

<script setup>
import http from "@/api/http.js";
import { onMounted ,onUnmounted,reactive} from 'vue';

let viewer={};
//有效监测组
let effectiveGrounp=reactive([]);
//创建人名称匹配的视角
let viewObj=reactive({});

onMounted( async()=>{
    //初始化地图
    cesiumInit();
    //获取监测组信息
    await queryGrounp();
    //接口获取地图视角
    getViews();
})

//初始化地图
let cesiumInit=()=>{
    const Cesium = window.Cesium;
    //使用默认的影像图层
    const esri = new Cesium.ArcGisMapServerImageryProvider({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", // 图层地址
        enablePickFeatures: false, // 无需与服务器通信
    });
    //使用天地图影像图层
    let key =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNDZiMjYxNi1jODQwLTRjZjgtYmE3NS04YzE3ZTYyNWRhOTciLCJpZCI6MTI5NzgyLCJpYXQiOjE2Nzk0NTQ1NTN9.q1oPL6MPZTy3jtnsQUsgGrIOR5ltQHOf_dTonEInJtA";
    Cesium.Ion.defaultAccessToken = key;
    let option =new Cesium.WebMapTileServiceImageryProvider({
        url: "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=436ce7e50d27eede2f2929307e6b33c0",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        credit: "",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        maximumLevel: 18,
    });
    viewer = new Cesium.Viewer("contain", {
        //imageryProvider:esri, //默认影像图层
        imageryProvider:option, //天地图影像图层
        infoBox: false, // 右侧信息框
        selectionIndicator: false, // 选中状态隐藏
        // 地形特效
        terrainProvider: Cesium.createWorldTerrain({
            requestWaterMask: true, // 水面特效
        }),
        //隐藏控件
        timeline: false, // 时间轴控件
        animation: false, // 动画控件
        geocoder: false, // 搜索按钮
        homeButton: false, // 主页按钮
        sceneModePicker: false, // 投影方式按钮
        baseLayerPicker: false, // 图层选择按钮
        navigationHelpButton: false, // 帮助手势按钮
        fullscreenButton: false, // 全屏按钮
    });

    // 移除默认的版权信息
    viewer.cesiumWidget.creditContainer.style.display = "none"
}


//获取监测组信息
let queryGrounp=async ()=>{
    await http.post('/api/Mon_Group_Manager/getPageData',{page:1,rows:200}).then((res)=>{
        let datas=res.rows;
        console.log('datas',datas);
        //过滤无经纬度 且无视角的数据
        let fterdata=datas.filter(item=>{
            return item.Long && item.Lat && item.GIS_Config;
        })
        effectiveGrounp=fterdata;
    })
}


//接口获取地图视角 如果没有视角 就使用第一个监测站的视角
let getViews=async ()=>{
    let userName=JSON.parse(localStorage.getItem('user')).userName;
    await http.post('/api/Sys_Personal_Setting/getPageData',{}).then((res)=>{
        let datas=res.rows;
        //视觉有数据
        if(datas.length>0){
            datas.forEach(item => {
                //根据当前登录人与视角创建人进行匹配
                if(item.Creator==userName){
                    viewObj=item.GIS_Config;
                }
            });
        }else{
            //没有视角 就使用第一个监测组的视角
            viewObj=effectiveGrounp[0].GIS_Config;
        }
        //设置地图视角
        Defaultperspective();

    })
}


//设置地图默认视角
let Defaultperspective=()=>{
    let apiView=JSON.parse(viewObj);
    console.log('apiView',apiView);
    //const position = Cesium.Cartesian3.fromDegrees(112.335427,28.869371, 2000);
    viewer.camera.setView({
        destination: apiView.position, // 目的地
        // 视角
        orientation: {
            //direction: 
            up:apiView.up,
            right:apiView.right,
            // heading: Cesium.Math.toRadians(0), // 左右
            // pitch: Cesium.Math.toRadians(-90), // 上下
            // roll: Cesium.Math.toRadians(0), // 倾斜
        },
    });
}




//飞行指定视角
const flys=()=>{
    //飞行动画 
    const flyTos = Cesium.Cartesian3.fromDegrees(106.628790, 31.503278, 1000);
    viewer.camera.flyTo({
        destination: flyTos, // 目的地
        duration: 3, // 飞行时长 3 秒
        // 视角
        orientation: {
            heading: Cesium.Math.toRadians(0), // 左右
            pitch: Cesium.Math.toRadians(-90), // 上下
            roll: Cesium.Math.toRadians(0), // 倾斜
            // direction: 
            // up:
            // right:
        },
        //maximumHeight: 10000, //飞行最大高度
        //easingFunction: Cesium.EasingFunction.LINEAR_NONE, // 飞行方式
        complete: function () {
            //持续飞行  继续递归执行函数flys();
            console.log("飞完了");
        },
    });
}


// 组件销毁时清除 地图
onUnmounted(()=>{
    if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
        console.log('Cesium 查看器已销毁');
    }
}) 
</script>

<style scoped  lang="scss">
.contaniner{
    width: 100%;
    height: 100%;
    position: relative;
    .pocx{
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 3;
        cursor: pointer;
        color: #fff;
    }
    #contain{
        width: 100%;
        height: 100%;
    }
}

</style>