<template>
  <div
    id="detail-box"
    v-loading="state.loading"
    element-loading-text="Loading..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(9, 22, 45, 0.7)"
  >
    <Close
      class="chasex"
      id="close-button"
      style="width: 1em; height: 1em; color:#ffffff;font-size: 24px;"
      @click="closeDetail"
    />
    <div class="point-map-box">
      <div class="title" >
        <span>{{ state.result.Point_Num }}</span>
      </div>

      <div class="opsdk">
        <div class="leimg" v-if="state.result">
            <el-image
                v-if="!state.result.Acc_Num"
                :src="require('@/assets/404_images/null_img.png')"
                style="width: 160px;height: 115px;"
              ></el-image>

            <el-image
              v-else
              :src="'http://smp.cnzwjl.com:9991//' + state.result.Acc_Num"
              :preview-src-list="['http://smp.cnzwjl.com:9991//' + state.result.Acc_Num]"
              style="width: 160px;height: 115px;"
              
            ></el-image>
        </div>
        <div class="ridiv">
            <div class="risilist"><label>点位编号：</label>{{ state.result.Point_Num }} </div>
            <div class="risilist"><label>点位名称：</label>{{ state.result.Point_Name}} </div>
            <div class="risilist"><label>设备编号：</label>{{ state.result.Sim_Num }} </div>
            <div class="risilist mb0"><label>最新通信时间：</label>{{ state.result.Recent_T }} </div>
        </div>
      </div>
      <div class="yunx_Start">
          <div class="eimes" @click="ShowDetailData('operation')">运行数据</div>
          <div class="eimes" @click="ShowDetailData('monitor')">监测数据</div>
          <div class="eimes" @click="ShowDetailData('satellite')">卫星数据</div>
          <div class="eimes" @click="ShowDetailData('analyse')">单相分析</div>
          <div class="eimes" @click="ShowDetailData('warning')">预警数据</div>
          <!-- <div class="eimes"  @click="ShowDetailData('patrol')">巡检记录</div> -->
      </div>

      <div class="yunxsf">
          <div class="sfs_tit">运行状态<img src="@/assets/gis/switch-box/nexia.png"/> </div>
          <div class="se_cont">{{ state.result.State_Run }}</div>
      </div>


      <div class="yunxsf mb0">
          <div class="sfs_tit">点位描述<img src="@/assets/gis/switch-box/nexia.png"/> </div>
          <div class="se_cont">{{ state.result.Description?state.result.Description:'暂无' }}</div>
      </div>
      <!-- <div class="middleBox">
        <div class="middle" style="width: 160px;height: 115px;">
          <div class="nihaos" v-if="state.result" >
            <el-image
              v-if="!state.result.Acc_Num"
              :src="require('@/assets/404_images/null_img.png')"
              style="width: 160px;height: 115px;"
            ></el-image>

            <el-image
              v-else
              :src="'http://smp.cnzwjl.com:9991//' + state.result.Acc_Num"
              :preview-src-list="['http://smp.cnzwjl.com:9991//' + state.result.Acc_Num]"
              style="width: 160px;height: 115px;"
              
            ></el-image>
          </div>
        </div>
        <div class="middleBoxF">
        <div class="panel">
          <span>点位编号：</span>
          <span>{{ state.result.Point_Num }}</span>
        </div>
        <div class="panel">
          <span>点位名称：</span>
          <span>{{ state.result.Point_Name }}</span>
        </div>
        <div class="panel">
          <span>设备编号：</span>
          <span>{{ state.result.Sim_Num }}</span>
        </div>
       
        <div class="panel">
          <span>最新通信时间：</span>
          <span>{{ state.result.Recent_T }}</span>
        </div>

        <div class="panel">
          <span>点位描述：</span>
          <span>{{ state.result.Description }}</span>
        </div>
      </div>

      </div> -->


      <!-- <div class="middle-nav">
        <div class="btn" style="" @click="ShowDetailData('operation')">
          运行数据
        </div>
        <div class="btn" style="" @click="ShowDetailData('monitor')">
          监测数据
        </div>
        <div class="btn" style="" @click="ShowDetailData('satellite')">
          卫星数据
        </div>
        <div class="btn" style="" @click="ShowDetailData('analyse')">
          单相分析
        </div>
        <div class="btn" style="" @click="ShowDetailData('warning')">
          预警信息
        </div>
      </div> -->
  
      <!-- <div class="panel">
          <span>运行状态：</span>
          <span>{{ state.result.State_Run }}</span>
        </div> -->
      <!-- <div :class="find_video ? 'video-box' : 'null-video'" class="video-box" @click="showBool()">
          <div class="title" :style="style.title"><span>视频信息</span></div>
          <video style="width: 100%; height: 207px;border:1px solid #307bed;" src="find_video"
          controls="controls"></video>
      </div> -->
    </div>
    <Record ref="record"></Record>
    <Operation ref="operation"></Operation>
    <Satellite ref="satellite"></Satellite>
    <Analyse ref="analyse"></Analyse>
    <Warning ref="warning"></Warning>
    <!-- <Patrol     ref="patrol"></Patrol> -->
    <!-- patrol  -->
    <!-- <com_device :currentPoint="state.result" :flag="state.dialogVisible"></com_device> -->
  </div>
</template>
<script setup>
import titleImage from "@/assets/gis/detail/point-detail-title.png";
import { Close } from "@element-plus/icons-vue";
import Record from "../../../../extension/monitorbusiness/monpointmanager/Mon_Record.vue";
import Operation from "../../../../extension/monitorbusiness/monpointmanager/Mon_Operation.vue";
import Satellite from "../../../../extension/monitorbusiness/monpointmanager/Mon_Satellite.vue";
import Analyse from "../../../../extension/monitorbusiness/monpointmanager/Analyse_Uniphase.vue";
import Warning from "../../../../extension/monitorbusiness/monpointmanager/Mon_Warning.vue";
// import Patrol from "../../../../extension/monitorbusiness/monpointmanager/Mon_Patrol.vue";
import com_device from "./components/device/index.vue";
import panel from "./components/panel/index.vue";
import { computed, reactive, watch, ref } from "vue";
import triangle from "@/assets/gis/point-detail-triangle.png";
import http from "@/api/http";

const props = defineProps(["data"]);
const emit = defineEmits(["CloseDetail"]);

const record = ref(null);
const operation = ref(null);
const satellite = ref(null);
const analyse = ref(null);
const warning = ref(null);
const patrol = ref(null);

const state = reactive({
  loading: false,
  style: {
    title: {
      backgroundImage: `url(${titleImage})`,
    },
  },
  result: {},
  find_video: "",
  dialogVisible: false,
  dialogType: null,
  srcList: [],
});
watch(
  () => props.data,
  (newVal, oldVal) => {
    InitNodeDetail(newVal);
  }
);

const dialogTitle = computed({
  get() {
    let str = null;
    switch (state.dialogType) {
      case "operation":
        str = "运行数据";
        break;
      case "satellite":
        str = "卫星数据";
        break;
      case "analyse":
        str = "单相分析";
        break;
      case "monitor":
        str = "监测数据";
        break;
      case "warning":
        str = "预警信息";
        break;
      case "patrol":
        str = "巡检信息";
        break;
    }
    return `${str}(${state.result.Point_Name || state.result.Point_Num || ""})`;
  },
});

InitNodeDetail(props.data);
function InitNodeDetail(data) {
  console.log(data, "data");
  state.loading = true;
  http
    .post("/api/Mon_Point_Manager/getPageData", {
      order: "asc",
      page: 1,
      rows: 30,
      sort: "ID",
      value: 1,
      wheres: JSON.stringify([{ name: "ID", value: data.ID }]),
    })
    .then((res) => {
      state.loading = false;
      state.result = res.rows[0];
    });
  http
    .axios({
      url: "/api/Mon_Point_Manager/GetLastRunData",
      params: { pointNum: data.Point_Num },
      method: "get",
    })
    .then((res) => {
      // console.log("res", res);
    });
}
function ShowDetailData(type) {
  switch (type) {
    case "operation":
      operation.value.openOperation(state.result);
      break;
    case "satellite":
      satellite.value.openSatellite(state.result);
      break;
    case "monitor":
      record.value.openRecord(state.result);
      break;
    case "analyse":
      analyse.value.openAnalyse(state.result);
      break;
    case "warning":
      warning.value.openWarning(state.result);
      break;
    case "patrol":
      patrol.value.openPatrol(state.result);
      break;
  }
}
//先留下，看看是不是重启已经有了
function showGroupInfo() {
  const that = state,
    data = state.currentGroupInfo;
  that.isHomeGroup = false;
  that.groupId = data.id;
  that.markerUpData();
  that.$emit("viewTestGroup", { groupId: data.id });
  that.moveToCenter(data.longitude, data.latitude, "group", data.d3Angle);
  that.$emit("showOrHideLeftBox", false);
}

//关闭
function closeDetail() {
  emit("CloseDetail");
}
</script>
<style lang="scss">
@import "./css/point-detail.scss";
</style>

<style scoped lang="scss">
.mb0{
  margin-bottom: 0 !important;
}
.chasex{
  color: #999 !important;
  cursor: pointer;
}
.opsdk{
  display: flex;
  width: 100%;
  margin-bottom: 25px;
  .leimg{
    width: 160px;
    height: 115px;
    background: #ECDDDD;
    border-radius: 4px;
    overflow: hidden;
  }
  .ridiv{
    width: calc(100% - 172px);
    margin-left: 12px;
    font-size: 14px;
    color: #333;
    .risilist{
      margin-bottom: 12px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &>label{
        margin-right: 5px;
        font-weight: normal;
      }
    }
  }
}
.yunx_Start{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .eimes{
    width: calc((100% - 32px) / 5);
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: rgba(53, 112, 252, 0.07);
    border: 1px solid rgba(53, 112, 252, 0.07);
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    border-radius: 4px;
    cursor: pointer;
  }
  .eimes:hover{
      color: #3570FC !important;
      border: 1px solid rgba(53, 112, 252, 0.45) !important;
  }
}
.yunxsf{
   margin-bottom: 18px;
  .sfs_tit{
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    margin-bottom: 6px;
    &>img{
      width: 14px;
      height: 10px;
      margin-left: 4px;
    }
  }
  .se_cont{
     width: 100%;
     padding: 16px;
     border: 1px dashed #ddd;
     font-weight: 500;
     font-size: 14px;
     color: #333333;
     border-radius: 4px;
     line-height: 22px;
  }
}
.nihaos{
  width: 160px;
  height: 115px;
  border-radius: 4px;
  overflow: hidden;
}
</style>