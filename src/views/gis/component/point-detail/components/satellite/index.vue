<template>
  <div id="satellite-data">
    <div class="right-box">
      <div class="flex-box">
        <chart-polar-1 class="polar" :getParam="choosedDeviceItemInfo" :id="'point-polar-1'"></chart-polar-1>
        <chart-polar-2 class="polar" :getParam="choosedDeviceItemInfo" :id="'point-polar-2'"></chart-polar-2>
        <chart-polar-3 class="polar" :getParam="choosedDeviceItemInfo" :id="'point-polar-3'"></chart-polar-3>
      </div>
      <div class="flex-box" style="margin-top:30px;" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <chart-bar ref="point-bar1" :getParam="choosedDeviceItemInfo" :id="'point-bar-1'"
          :title="'北斗卫星信噪比'"></chart-bar>
        <chart-bar ref="point-bar2" :getParam="choosedDeviceItemInfo" :id="'point-bar-2'"
          :title="'GPS卫星信噪比'"></chart-bar>
        <chart-bar ref="point-bar3" :getParam="choosedDeviceItemInfo" :id="'point-bar-3'"
          :title="'Galileo卫星信噪比'"></chart-bar>
        <chart-bar ref="point-bar4" :getParam="choosedDeviceItemInfo" :id="'point-bar-4'"
          :title="'GLONASS卫星信噪比'"></chart-bar>
      </div>
    </div>
  </div>
</template>

<script>
// import { DASgsvDataByDevId } from "@/api/page/gis/detail"

export default {
  props: ["currentPoint"],
  components: {
    chartPolar1: () => import("./components/chart-polar-1.vue"),
    chartPolar2: () => import("./components/chart-polar-2.vue"),
    chartPolar3: () => import("./components/chart-polar-3.vue"),
    chartBar: () => import("./components/chart-bar.vue"),
  },
  data() {
    return {
      choosedDeviceItemInfo: null,
      ChartBarData: [],
      loading: false
    }
  },
  created() {
    this.choosedDeviceItem(this.currentPoint)
 
  },
  methods: {
    choosedDeviceItem(item) {
      console.log('choosedDeviceItem satellite');
      this.choosedDeviceItemInfo = item;
      this.BarInit();
    },
    BarInit() {
      if (this.choosedDeviceItemInfo) {
        this.loading = true;
        DASgsvDataByDevId({
          devId: this.choosedDeviceItemInfo.deviceNo,
        }).then(res => {
          
          this.ChartBarData = [[res.gagsvDataMap, res.noGagsvDataMap], [res.gbgsvCalcMap, res.noGbgsvCalcMap], [res.glgsvDataMap, res.noGlgsvDataMap], [res.gpgsvCalcMap, res.noGpgsvCalcMap]]
          this.$refs.bar1.pageInit(this.ChartBarData[0]);
          this.$refs.bar2.pageInit(this.ChartBarData[1]);
          this.$refs.bar3.pageInit(this.ChartBarData[2]);
          this.$refs.bar4.pageInit(this.ChartBarData[3]);
          this.loading = false;

        })
      }

    }
  }

};
</script>

<style lang="scss" scoped>
#satellite-data {
  display: flex;
  justify-content: space-around;

  .right-box {
    background: #0c2751;
    width: 1178px;
    height: 800px;
    padding: 12px 24px;
    overflow: scroll;

    .flex-box {
      display: flex;
      justify-content: space-between;
      border: 1px solid #2e4975;
      padding: 12px;

      .polar {}
    }
  }
}
</style>