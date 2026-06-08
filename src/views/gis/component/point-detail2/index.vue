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
        <span>参考位置：{{ state.result.LOCATION_C }}</span>
      </div>
      <div class="info">
        <span style="color:red;font-weight: bold;">震级：{{ state.result.M }}</span>
      </div>
       <div class="info">
        <span>深度(千米)：{{ state.result.EPI_DEPTH }}</span>
      </div>
      <div class="info">
        <span>经度(°)：{{ state.result.EPI_LON }}</span>
      </div>
      <div class="info">
        <span>纬度(°)：{{ state.result.EPI_LAT }}</span>
      </div>
       <div class="info">
        <span>发震时刻：{{ state.result.O_TIME }}</span>
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
