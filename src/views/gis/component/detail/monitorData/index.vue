<template>
  <div id="monitor-data">
    <device-menu @choosedTab="choosedDeviceItem"></device-menu>
    <div class="right-box">
      <el-tabs v-model="activeName">
        <!-- GNSS start -->
        <el-tab-pane label="位移数据" name="gnssC_1" v-if="CheckType(4)">
          <gnssc-first :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'gnssC_1'">
          </gnssc-first>
        </el-tab-pane>
        <!-- <el-tab-pane label="静态解算" name="gnssC_2" v-if="CheckType(4)">
          <gnssc-second :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'gnssC_2'">
          </gnssc-second>
        </el-tab-pane>
        <el-tab-pane label="手动解算" name="gnssC_3" v-if="CheckType(4)">
          <gnssc-third :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'gnssC_3'">
          </gnssc-third>
        </el-tab-pane>
        <el-tab-pane label="导航数据" name="gnssC_4" v-if="CheckType(4)">
          <gnssc-fourth :currentDevice="choosedDeviceItemInfo" :activeName="activeName"
            v-if="activeName == 'gnssC_4'"></gnssc-fourth>
        </el-tab-pane> -->
        <!-- GNSS end -->
        <!-- 雨量 start  -->
        <!-- <el-tab-pane label="雨量数据" name="rainfall" v-if="CheckType(2)">
          <rainfall :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'rainfall'"></rainfall>
        </el-tab-pane> -->
        <!-- 雨量  end -->
        <!-- 水质 start  -->
        <!-- <el-tab-pane label="水质" name="water" v-if="CheckType(99)">
          <water :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'water'"></water>
        </el-tab-pane> -->
        <!-- 水质  end -->
        <!-- 倾斜 start -->
        <!-- <el-tab-pane label="倾斜数据" name="clinometer" v-if="CheckType(16)">
          <clinometer :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'clinometer'"></clinometer>
        </el-tab-pane> -->
        <!-- 倾斜 end -->
        <!-- 裂缝 start -->
        <!-- <el-tab-pane label="裂缝数据" name="fissure" v-if="CheckType(3)">
          <fissure :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'fissure'"></fissure>
        </el-tab-pane> -->
        <!-- 裂缝 end -->

        <!--测斜1  start -->
        <!-- <el-tab-pane label="倾斜数据" name="gradiograph_1" v-if="CheckType(18)">
          <gradiograph_1 :currentDevice="choosedDeviceItemInfo" :activeName="activeName"
            v-if="activeName == 'gradiograph_1'"></gradiograph_1>
        </el-tab-pane> -->
        <!-- 测斜1 end -->
        <!--测斜2  start -->
        <!-- <el-tab-pane label="深度形变" name="gradiograph_2" v-if="CheckType(18)">
          <gradiograph_2 :currentDevice="choosedDeviceItemInfo" :activeName="activeName"
            v-if="activeName == 'gradiograph_2'"></gradiograph_2>
        </el-tab-pane> -->
        <!-- 测斜2 end -->

        <!--基准站  start -->
        <!-- <el-tab-pane label="导航数据" name="gnssB_1" v-if="CheckType(5)">
          <gnssB_1 :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'gnssB_1'">
          </gnssB_1>
        </el-tab-pane>
        <el-tab-pane label="原始数据" name="gnssB_2" v-if="CheckType(5)">
          <gnssB_2 :currentDevice="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'gnssB_2'">
          </gnssB_2>
        </el-tab-pane> -->
        <!-- 基准站 end -->

      </el-tabs>
      <!-- 4维 start  -->
      <d4 :params="choosedDeviceItemInfo" :activeName="activeName" v-if="activeName == 'd4'"></d4>
      <!-- 4维 end  -->

    </div>
  </div>
</template>

<script>

export default {
  watch: {
    choosedDeviceItemInfo() {
      switch (this.choosedDeviceItemInfo.type) {
        case 2:
          this.activeName = "rainfall";
          break;
        case 3:
          this.activeName = "fissure";
          break;
        case 4:
          this.activeName = "gnssC_1";
          break;
        case 5:
          this.activeName = "gnssB_1";
          break;
        case 16:
          this.activeName = "clinometer";
          break;
        case 17:
          this.activeName = "d4";
          break;
        case 18:
          this.activeName = "gradiograph_1";
          break;

        case 99:
          this.activeName = "water";
          break;
      }
    }
  },
  components: {
    deviceMenu: () => import('../components/device-menu.vue'),
    gnsscFirst: () => import('./components/gnssC_1.vue'),
    gnsscSecond: () => import('./components/gnssC_2.vue'),
    gnsscThird: () => import('./components/gnssC_3.vue'),
    gnsscFourth: () => import('./components/gnssC_4.vue'),
    rainfall: () => import('./components/rainfall.vue'),
    water: () => import('./components/test-water.vue'),
    clinometer: () => import('./components/clinometer.vue'),
    fissure: () => import('./components/fissure.vue'),
    gradiograph_1: () => import('./components/gradiograph_1.vue'),
    gradiograph_2: () => import('./components/gradiograph_2.vue'),
    d4: () => import('./components/gisD4/index.vue'),
    gnssB_1: () => import("./components/gnssB_1.vue"),
    gnssB_2: () => import("./components/gnssB_2.vue"),
  },
  data() {
    return {
      choosedDeviceItemInfo: null,
      activeName: 'gnssC_1'
    }
  },
  methods: {
    choosedDeviceItem(item) {
      this.choosedDeviceItemInfo = item;
      this.deviceType = this.choosedDeviceItemInfo.type
    },
    CheckType(type) {
      if (this.choosedDeviceItemInfo) {
        return this.choosedDeviceItemInfo.type == type ? true : false;
      } else {
        return false;
      }
    }
  }
}
</script>

<style lang="scss">
#monitor-data {
  display: flex;
  justify-content: space-around;

  .right-box {
    background: #0c2751;
    width: 1178px;
    height: 766px;
    padding: 6px 24px;

    ::v-deep .el-date-range-picker__header {
      color: #666666;
    }
  }

  .is-top {
    color: #ffffff;
  }

  .el-tabs__item {
    background: #0c2751;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

}
</style>