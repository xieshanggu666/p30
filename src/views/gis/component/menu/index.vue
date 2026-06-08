<template>
  <div id="menu-box">
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="功能菜单" name="menu">
        <transition name="fade-transform" mode="out-in">
          <section v-if="activeTab == 'menu'">
            <!-- 功能区 start -->
            <el-collapse class="partFuntion" accordion>
              <el-collapse-item>
                <template #title> 底图 </template>
                <div class="bar">
                  <el-radio v-model="gisFunction.basicLayer" @change="ChangeLayer" label="image" border>影像</el-radio>
                </div>
                <div class="bar">
                  <el-radio v-model="gisFunction.basicLayer" @change="ChangeLayer" label="map" border>地图</el-radio>
                </div>
                <div class="bar">
                  <el-radio v-model="gisFunction.basicLayer" @change="ChangeLayer" label="hd" border>高清</el-radio>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template #title>标注开关 </template>
                <div class="bar">
                  <el-row v-for="(item, type) in gisFunction.labels" :key="type">
                    <el-col :span="8">{{ item.title }}</el-col>
                    <el-col :span="16">
                      <el-switch style="display: block" v-model="item.flag" @change="ChangeLaber(item)">
                      </el-switch>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template #title> 地形开关 </template>
                <div class="bar">
                  <el-switch style="display: block" v-model="gisFunction.landform" active-text="VR地形" inactive-text="平面地形"
                    @change="ChangeLandForm">
                  </el-switch>
                </div>
              </el-collapse-item>
              <el-collapse-item>
                <template #title>业务显示</template>
                <div>
                  <el-row class="bar">
                    <el-button icon="el-icon-back" @click="CallBackGroup">
                      项目概览
                    </el-button>
                  </el-row> 
                  
                  <el-row class="bar">
                    <el-button icon="el-icon-refresh" @click="$router.go(0)">
                      重启
                    </el-button>
                  </el-row>

                </div>
              </el-collapse-item>
              <!-- 备用 start -->
              <!-- <el-collapse-item>
                <template #title>标题 </template>
                <div>底图内容</div>
              </el-collapse-item> -->
              <!-- 备用 end -->
            </el-collapse>
            <!-- 功能区 end -->
          </section>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="监测组" name="monitorGroup">
        <!-- 监测组 start       -->
        <el-collapse class="monitorGroup" accordion v-model="currentGroupActiveName" @change="GetgroupData">
          <el-collapse-item v-for="(group, index) of groupList" :key="index" :name="JSON.stringify(group)">
            <template #title>
              <div class="title-box">
                <span class="title">
                  {{ group.Group_Name }}
                </span>
                <div class="device-box">
                  <span>
                    <!-- <svg-icon icon-class="dashboard" />监测点数量: -->
                  </span>
                  <span class="num-box">
                    <!-- {{ group.deviceCount }} -->
                  </span>
                </div>
              </div>
            </template>
            <div class="button-box">
              <el-button type="primary" :icon="Location" @click="ButtonLocalGroup">定位</el-button>
              <el-button type="primary" :icon="Memo" @click="openDialog(group)">详情</el-button>
            </div>
            <div class="device-detail-box">
              <div class="box-li" v-for="(li, index) of detailBoxConfig" :key="index">
                <img class="img-icon" :src="li.imgUrl" alt="404" />
                <div>{{ li.title }}({{ li.value }})</div>
              </div>
            </div>
            <ul>
              <li v-for="(li, index) of deviceList" :key="index">
                <div> <span>{{ li.Acc_Num }}</span> <span v-if="li.Sim_Num">:{{ li.Sim_Num }}</span> </div>
                <span style="font-size:22px">
                  <svg-icon icon-class="online-1" />
                </span>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
        <!-- 监测组 end       -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Location, Memo } from '@element-plus/icons-vue'
import MixinMonitorGroup from "./monitorGroup.js";
import MixinGisFunction from "./gisFunction.js";
export default {
  data() {
    return {
      activeTab: "menu",
      Location,
      Memo
    };
  },
  filters: {
    FilterGroupName(str) {
      if (str) {
        if (str.length > 19) {
          let result = str.match(/\p{sc=Han}/gu)
          let strCode = ""
          for (let code of result) {
            strCode += code;
          }
          return strCode;
        } else {
          return str;
        }
      }

    }
  },
  mixins: [MixinMonitorGroup, MixinGisFunction],
  mounted() {
    this.initPage();
  },
  methods: {

  },
};
</script>
<style lang="scss" >
@import "./css/monitorGroup.scss";
</style>
