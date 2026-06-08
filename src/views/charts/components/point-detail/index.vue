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
      id="close-button"
      style="width: 1em; height: 1em; color:#ffffff;font-size: 24px;"
      @click="closeDetail"
    />
    <div class="point-map-box">
      <div class="title" :style="state.style.title">
        <span>{{ state.result.Point_Name }}</span>
      </div>
      <div class="info">
        <span>点位名称：{{ state.result.Point_Name }}</span>
      </div>
       <div class="info">
        <span>点位编号：{{ state.result.Point_Num }}</span>
      </div>
      <div class="info">
        <span>设备编号：{{ state.result.Sim_Num }}</span>
      </div>
      <div class="info">
        <span>运行状态：{{ state.result.State_Run }}</span>
      </div>
      <div class="info">
        <span>最新通信时间：{{ state.result.Recent_T }}</span>
      </div>
       <div class="info">
        <span>点位描述：{{ state.result.Description }}</span>
      </div>

    </div>
  </div>
</template>
<script setup>
import titleImage from "@/assets/gis/detail/point-detail-title.png";
import { Close } from "@element-plus/icons-vue";
import { computed, reactive, watch, ref } from "vue";
import triangle from "@/assets/gis/point-detail-triangle.png";
import http from "@/api/http";

const props = defineProps(["data"]);
const emit = defineEmits(["CloseDetail"]);
const record = ref(null);
const operation = ref(null);
const satellite = ref(null);

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


InitNodeDetail(props.data);
function InitNodeDetail(data) {
  console.log("点位");
  console.log(data, "data");
  state.result=data
}

//关闭
function closeDetail() {
  emit("CloseDetail");
}
</script>
<style lang="scss">
@import "./css/point-detail.scss";
.info{
  background-repeat: no-repeat;
  line-height: 30px;
  margin-bottom: 22px;
  height: 33px;
  padding-left: 16px;
  color: #ffffff;
  font-size: 16px;
  
}
</style>
