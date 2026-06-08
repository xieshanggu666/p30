<template>
  <div id="monitor-data">
    <div class="right-box">
      <el-tabs v-model="activeName">
        <!-- GNSS start -->
        <el-tab-pane label="位移数据" name="gnssC_1" v-if="currentPoint.Type_Id == 1">
          <div v-if="activeName == 'gnssC_1'">
            <gnssc-first :currentDevice="currentPoint" :flag="flag">
            </gnssc-first>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="静态解算" name="gnssC_2" v-if="currentPoint.Type_Id == 1">
          <div v-if="activeName == 'gnssC_2'">
            {{ activeName == 'gnssC_2' }}gnssC_2
            <gnssc-second :currentDevice="currentPoint" :flag="flag">
            </gnssc-second>
          </div>

        </el-tab-pane>
        <el-tab-pane label="手动解算" name="gnssC_3" v-if="currentPoint.Type_Id == 1">
          <div v-if="activeName == 'gnssC_3'">
            <gnssc-third :currentDevice="currentPoint" :flag="flag">
            </gnssc-third>
          </div>

        </el-tab-pane>
        <el-tab-pane label="导航数据" name="gnssC_4" v-if="currentPoint.Type_Id == 1">
          <div v-if="activeName == 'gnssC_4'">
            <gnssc-fourth :flag="flag"></gnssc-fourth>
          </div>

        </el-tab-pane> -->
        <!-- GNSS end -->
        <!-- 雨量 start  -->
        <el-tab-pane label="雨量数据" name="rainfall" v-if="currentPoint.Type_Id == 3">
          <rainfall :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'rainfall'"></rainfall>
        </el-tab-pane>
        <!-- 雨量  end -->
        <!-- 倾斜 start -->
        <!-- <el-tab-pane label="倾斜数据" name="clinometer" v-if="currentPoint.Type_Id == 16">
          <clinometer :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'clinometer'"></clinometer>
        </el-tab-pane> -->
        <!-- 倾斜 end -->
        <!-- 裂缝 start -->
        <!-- <el-tab-pane label="裂缝数据" name="fissure" v-if="currentPoint.Type_Id == 14">
          <fissure :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'fissure'"></fissure>
        </el-tab-pane> -->
        <!-- 裂缝 end -->
        <!--测斜1  start -->
        <!-- <el-tab-pane label="倾斜数据" name="gradiograph_1" v-if="currentPoint.Type_Id == 18">
          <gradiograph_1 :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'gradiograph_1'">
          </gradiograph_1>
        </el-tab-pane> -->
        <!-- 测斜1 end -->
        <!--测斜2  start -->
        <!-- <el-tab-pane label="深度形变" name="gradiograph_2" v-if="currentPoint.Type_Id == 18">
          <gradiograph_2 :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'gradiograph_2'">
          </gradiograph_2>
        </el-tab-pane> -->
        <!-- 测斜2 end -->
        <!--基准站  start -->
        <!-- <el-tab-pane label="导航数据" name="gnssB_1" v-if="currentPoint.Type_Id == 5">
          <gnssB_1 :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'gnssB_1'">
          </gnssB_1>
        </el-tab-pane>
        <el-tab-pane label="原始数据" name="gnssB_2" v-if="currentPoint.Type_Id == 5">
          <gnssB_2 :currentDevice="currentPoint" :flag="flag" v-if="activeName == 'gnssB_2'">
          </gnssB_2>
        </el-tab-pane> -->
        <!-- 基准站 end -->
      </el-tabs>

      <!-- 4维 start  -->
      <!-- <d4 :params="currentPoint" :flag="flag" v-if="activeName == 'd4'"></d4> -->
      <!-- 4维 end  -->
    </div>
  </div>
</template>

<script>
import gnsscFirst from './components/gnssC_1.vue';
import gnsscSecond from './components/gnssC_2.vue';
import gnsscThird from './components/gnssC_3.vue';
import gnsscFourth from './components/gnssC_1.vue';
import rainfall from './components/rainfall.vue';
import clinometer from './components/clinometer.vue';
import fissure from './components/fissure.vue';
import gradiograph_1 from './components/gradiograph_1.vue';
import gradiograph_2 from './components/gradiograph_2.vue';
import d4 from './components/gisD4/index.vue';
import gnssB_1 from './components/gnssB_1.vue';
import gnssB_2 from './components/gnssB_2.vue';
export default {
  props: ['currentPoint', "flag"],
  watch: {
    flag(newVal, oldVal) {
      if (newVal) {
        this.activeName = this.InitActiveName()
      }
    }
  },
  components: {
    gnsscFirst, gnsscSecond, gnsscThird, gnsscFourth, rainfall, clinometer,
    fissure, gradiograph_1,
    gradiograph_2,
    d4,
    gnssB_1, gnssB_2
  },
  data() {
    return {
      activeName: this.InitActiveName(),
    }
  },
  methods: {
    CheckType(type) {
      if (this.currentPoint) {
        return this.currentPoint.Type_Id == type ? true : false;
      } else {
        return false;
      }
    },
    InitActiveName() {
      if (this.currentPoint) {
        switch (this.currentPoint.Type_Id) {
          case 1:
            return "gnssC_1";
          case 3:
            return "rainfall";
        }
      } else {
        return "gnssC_1"
      }
    },
    ChangeActiveName() {
      switch (parseInt(this.choosedDeviceItemInfo.Type_Id)) {
        case 1:
          return "gnssC_1";
        case 2:
          return "rainfall";
        case 3:
          return "gnssB_1";
        case 16:
          return "clinometer";
        case 17:
          return "d4";
        case 18:
          return "gradiograph_1";
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-date-editor {
  background: #11305f;
  color: #fff !important;

  * {
    border: none;
  }
}
</style>
<style lang="scss">
#monitor-data {
  // display: flex;
  // justify-content: space-around;

  .right-box {
    background: #0c2751;
    // width: 1178px;
    height: 800px;
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