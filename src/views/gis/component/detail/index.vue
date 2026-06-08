<template>
  <div>
    <div id="gis-detail">
      <el-tabs tab-position="left" v-model="state.activeTab">

        <el-tab-pane label="综合分析" name="multi_analyse">
          <transition name="fade-transform" mode="out-in">
            <section v-if="state.activeTab == 'multi_analyse'">
              <multiAnalyse></multiAnalyse>
            </section>
          </transition>
        </el-tab-pane>

        <!-- <el-tab-pane label="基本信息" name="basic_info">
          <transition name="fade-transform" mode="out-in">
            <section v-if="activeTab == 'basic_info'">
              <basic-info ref="basicInfo"></basic-info>
            </section>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="监测数据" name="monitor_data">
          <transition name="fade-transform" mode="out-in">
            <section v-if="activeTab == 'monitor_data'">
              <monitor-data ref="monitorData"></monitor-data>
            </section>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="运行数据" name="operation_data">
          <transition name="fade-transform" mode="out-in">
            <section v-if="activeTab == 'operation_data'">
              <operation-data ref="operationData"></operation-data>
            </section>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="卫星数据" name="satellite_data">
          <transition name="fade-transform" mode="out-in">
            <section v-if="activeTab == 'satellite_data'">
              <satellite-data ref="satelliteData"></satellite-data>
            </section>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="数据走势" name="data_tendency">
          <transition name="fade-transform" mode="out-in">
            <section v-if="activeTab == 'data_tendency'">
              <data-tendency ref="dataTendency"></data-tendency>
            </section>
          </transition>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import basicInfo from "./basicInfo/index.vue"
import monitorData from "./monitorData/index.vue"
import operationData from "./operationData/index.vue"
import satelliteData from "./satelliteData/index.vue"
import dataTendency from "./dataTendency/index.vue"
import multiAnalyse from "./multiAnalyse/index.vue"
import { reactive } from 'vue'

const state = reactive({
  activeTab: "multi_analyse",
})


</script>

<style lang="scss">
#gis-detail {
  .el-tabs__nav {
    background: #061e42;
  }

  .el-tabs__item.is-left {
    color: #ffffff;
  }
}
</style>