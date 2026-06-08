<template>
  <div class="gis-box" >
    <div class="search-box">
      <searchBtn @local-group="GisLocalPoint" 
        @emitMyLayerNow2="emitMyLayerNow2"
      ></searchBtn>
    </div>

    <div class="configSetBox">
      <configBox
        @GisFunctionChangeLayer="GisChangeLayer"
        @GisFunctionChangeLabel="GisChangeLabel"
        @changesimulate="changesimulate"
        @emitEarthquakLoadMore="emitEarthquakLoadMore"
        @emitWeatheLoadMore="emitWeatheLoadMore"
        @emitMyLayerNow="emitMyLayerNow"
        @GisFunctionhandleFile="GisFunctionhandleFile"
      />
    </div>

    <!-- 监测详情 start  -->
    <div
      id="node-detail-box"
      :style="showPointDetailFlag ? nodeDetailStyle : ''"
    >
      <pointDetail
        v-if="showPointDetailFlag"
        ref="pointDetail"
        @CloseDetail="CloseDetail"
        :data="pointData"
      />
    </div>
    <!-- 监测详情 end -->

    <!-- 地震详情 start -->
     <div
      id="node-detail-box"
      :style="showPointDetailFlag2 ? nodeDetailStyle : ''"
    >
      <pointDetail2
        v-if="showPointDetailFlag2"
        ref="pointDetail2"
        @CloseDetail="CloseDetail"
        :data="pointData"
      />
    </div>
    <!-- 地震详情 end -->

    <!-- fullPageButton start  -->
    <div class="full-page-box">
      <!-- 刷新按钮 -->
      <!-- <el-button type="primary" :icon="Back" circle @click="fullPage"></el-button> -->
      <el-button
        type="primary"
        :icon="Refresh"
        circle
        @click="CallBackGroup"
      ></el-button>
    </div>
    <!-- fullPageButton end  -->

    <div id="gisBox" style="height:100%"></div>

    <!-- 弹出框样式 v-bind:style="gisStyle"-->
    <!-- <div id="stateShow">
      <div>标题：<span id="title"></span></div>
      <div>状态：<span id="state"></span></div>
      <div>信息：<span id="info"></span></div>
    </div> -->

    <!-- dialog start  -->
    <el-dialog
      custom-class="gis-other-dialog"
      v-model="dialogVisible"
      append-to-body
      width="90%"
      top="5vh"
      ref="gisDialog"
      destroy-on-close
    >
      <node-detail ref="nodeDetail"></node-detail>
    </el-dialog>
    <!-- dialog end  -->

    <!-- mouse start -->
    <mouse-box class="mouse-box" :position="mousePosition"></mouse-box>
    <!-- mouse end  -->
     <!-- 预警信息 -->
    <div class="yuxis" v-if="yujobjStart">
        <div class="tit_lsex">预警信息</div>
        <div class="conts" @click="navyj">{{yujobj.title}}</div>
    </div> 

    <!-- 设备郁预警信息 -->
    <el-dialog
      custom-class="xssebeis"
      v-model="sebeisVisible"
      append-to-body
      width="90%"
      destroy-on-close
      :before-close="handleCloses"
    >
      <div class="autowd"><warning v-if="sebeisVisible" ref="warning"></warning></div>
    </el-dialog> 
  </div>
</template>
<script>
//设备预警信息
import warning from "@/views/alarm/alaequipment/Ala_equipment_warning.vue";
import mixinGis from "./mixin/gis";
import mixinBasic from "./mixin/basic";
import monitorGroupBox from "./component/menu/index.vue";
import nodeDetail from "./component/detail/index.vue";
import searchBtn from "./component/search/index";
import pointDetail from "./component/point-detail/index.vue";
import pointDetail2 from "./component/point-detail2/index.vue";
import configBox from "./component/configBox/index.vue";
import mouseBox from "./component/mouse/index";
import store from "@/store/index";
import { FullScreen, Back, Refresh } from "@element-plus/icons-vue";
let times=null;
export default {
  mixins: [mixinGis, mixinBasic],
  components: {
    warning, //预警信息
    monitorGroupBox,
    nodeDetail,
    pointDetail,
    pointDetail2,
    searchBtn,
    configBox,
    mouseBox,
  },
  data() {
    return {
      sebeisVisible:false,//设备预警信息
      yujobjStart:false,
      yujobj:{}, //预警信息
      audio:null, //音频对象
      mousePosition: {
        x: 0,
        y: 0,
      },
      gisStyle: null,
      switchBoxFlag: false,
      switchDetailFlag: false,
      FullScreen,
      Back,
      Refresh,
      menuIndex: "null",
      nodeDetailStyle: {
        right: '124px',
      },
    };
  },
  computed: {
    dynamicHeight() {
      let doms = document.getElementsByClassName("vol-main");
      let domHeight = doms[0].offsetHeight;
      return domHeight + "px";
    },
  },
  activated() {
    // audio.load(); // 重新加载音频
    // audio.muted = true; // 取消静音
    // audio.play(); //播放
    //默认触发一次
    this.yujinfo();
    if(times){
      clearInterval(times);
      times=null;
    }
   times=setInterval(() => {
      this.yujinfo();
   }, 60000);
  },
  mounted() {
    this.pageInit();
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(times);
    times=null;
    next();
  },
  methods: {
    //预警信息
    yujinfo(){
      let audio=document.getElementById('audios');
      let obj={
        order: "desc",
        page: 1,
        rows: 30,
        sort: "ID",
        wheres:""
      };
      
      let arr=[
        {name:'CreateDate',value:this.getseo() ,displayType:'thanorequal'},
        {name:'CreateDate',value:this.getCur(),displayType:'lessorequal'},
        {name:'Level',value:'99'}
      ]
      // let arr=[
      //   {name:'CreateDate',value:'2025-04-08 12:00:00',displayType:'thanorequal'},
      //   {name:'CreateDate',value:'2025-04-08 17:00:00',displayType:'lessorequal'},
      //   {name:'Level',value:'99'}
      // ]
      obj.wheres=JSON.stringify(arr);

      this.http.post('api/Ala_Infomation/getPageData',obj).then(res=>{
          let dataList=res.rows;
          //取前面50条数据进行去重处理 并将设备id存入数组 提供给设备预警界面做下拉值
          const uniqueArray = dataList.reduce((acc, current) => {
            const duplicate = acc.find(item => item.Dev_Id === current.Dev_Id); // 根据id去重
            if (!duplicate) {
              let obj={title:current.Title,Dev_Id:current.Dev_Id};
              acc.push(obj);
            }
            return acc;
          }, []);
          
          if(uniqueArray.length>0){
              this.yujobjStart=true;
              this.yujobj=uniqueArray[0];
              //audio.pause();  // 暂停  
              audio.muted = false; // 取消静音
              audio.play(); //播放
              //存入设备信息 用于设备预警界面下拉值
              localStorage.setItem('warning',JSON.stringify(uniqueArray));
          }else{
            this.yujobjStart=false;
          }
      })
    },
    //预警跳转
    navyj(){
      //js参数随机数
      const timestamp = new Date().getTime();
      store.commit('rouACT',timestamp);
      //打开预警信息界面
      this.sebeisVisible=true;
      //this.$router.push({path:'/Ala_equipment_warning'});
    },
    //关闭组件触发子组件销毁定时器
    handleCloses(){
      this.sebeisVisible=false;
      this.$refs.warning.celfn();
    },
    //js获取当前时间 以及前两分钟的时间
    getCur() {
        const now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
    
        // 格式化后的当前时间字符串
        let formattedCurrentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedCurrentTime;
       
    },
    getseo(){
        const now = new Date();now.setMinutes(now.getMinutes() - 2);
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
    
        // 格式化后的当前时间字符串
        let formattedCurrentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedCurrentTime;
    },
    pageInit() {
      this.gisInit();
    },
  },
};
</script>
<style lang="scss">
.xssebeis{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .autowd{
    width: 100%;
    height: 80vh;
  }
}
.yuxis{
    width: 300px;
    background: #fff;
    position: fixed;
    z-index: 99;
    right: 30px;
    bottom: 55px;
    border-radius: 3px;
    box-shadow: 1px 3px 5px #ddd;
    padding: 20px;
    .tit_lsex{
      color: red;;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .conts{
      font-size: 14px;
    }
    .conts:hover{
      cursor: pointer;
      color: rgb(11, 0, 215);
    }
}
@import "./css/index.scss";
#stateShow {
  width: 200px;
  height: 150px;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  background: #18363ff0;
  color: white;
  font-size: 17px;
  z-index: 9999;
}
#stateShow div {
  padding: 10px;
}
</style>
<style scoped lang="scss">
::v-deep .vol-main{
  padding: 0 !important;
}
.vol-main{
  padding: 0 !important;
}
</style>
