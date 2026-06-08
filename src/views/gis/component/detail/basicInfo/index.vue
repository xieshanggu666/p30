<template>
  <div class="basic-info" id="basic-info" style="width: 1229px; margin: auto">
    <!-- <span>currentgroup：{{ currentGoup }}</span> -->
    <ul class="ul-list info-box">
      <li class="b2" v-bind:style="infoBoxStyle.b2">
        <div class="left"></div>
        <div class="info">
          <p class="number red">
            {{ basicInfo.warnings  }}
          </p>
          <p class="font">预警次数</p>
        </div>
        <!-- <i class="el-icon-more more" @click="getWarnList(infomations)"></i> -->
      </li>
      <li class="b1" v-bind:style="infoBoxStyle.b1">
        <div class="left"></div>
        <div class="info">
          <p class="number orange">
            {{ basicInfoDevice }}
          </p>
          <p class="font">设备异常</p>
        </div>
        <i class="el-icon-more more"></i>
      </li>
      <li class="b4" v-bind:style="infoBoxStyle.b4">
        <div class="left"></div>
        <div class="info">
          <p class="number green">
            {{
                Number(
                  ((basicInfo && basicInfo.device.onlineNum
                    ? basicInfo.device.onlineNum
                    : 0) /
                    (basicInfo && basicInfo.device.total
                      ? basicInfo.device.total
                      : 1)) *
                  100
                ).toFixed(0)
            }}%
          </p>
          <p class="font">设备在线率</p>
        </div>
        <!-- <i class="el-icon-more more"></i> -->
      </li>
      <li class="b3" v-bind:style="infoBoxStyle.b3">
        <div class="left"></div>
        <div class="info">
          <p class="number purple">
            {{ basicInfo.portals }}
          </p>
          <p class="font">巡查次数</p>
        </div>
        <!-- <i class="el-icon-more more" @click="getInspectionList(infomations)"></i> -->
      </li>
    </ul>
    <div class="middle">
      <div class="group-info">
        <span class="title title-left" :style="titleBack">监测组信息</span>
        <div class="group-box">
          <p>
            <span>监测组编号</span>
            <el-tooltip v-if="
              basicInfo.info.groupCoder &&
              basicInfo.info.groupCoder.length > 13
            " effect="light" :content="basicInfo.info.groupCoder" placement="right-start">
              <span>{{
                  basicInfo.info ? basicInfo.info.groupCoder : "暂无"
              }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.groupCoder : "暂无"
            }}</span>
          </p>
          <p>
            <span>监测组名称</span>
            <el-tooltip v-if="
              basicInfo.info.groupName && basicInfo.info.groupName.length > 8
            " effect="light" :content="basicInfo.info.groupName" placement="right-start">
              <span>{{
                  basicInfo.info ? basicInfo.info.groupName : "暂无"
              }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.groupName : "暂无"
            }}</span>
          </p>
          <p>
            <span>负责人</span>
            <el-tooltip v-if="
              basicInfo.info.userName && basicInfo.info.userName.length > 8
            " effect="light" :content="basicInfo.info.userName" placement="right-start">
              <span>{{
                  basicInfo.info ? basicInfo.info.userName : "暂无"
              }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.userName : "暂无"
            }}</span>
          </p>
          <p>
            <span>联系电话</span>
            <el-tooltip v-if="basicInfo.info.phone && basicInfo.info.phone.length > 11" effect="light"
              :content="basicInfo.info.phone" placement="right-start">
              <span>{{ basicInfo.info ? basicInfo.info.phone : "暂无" }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.phone : "暂无"
            }}</span>
          </p>
          <p>
            <span>关联隐患点</span>
            <el-tooltip v-if="
              basicInfo.info.dangerName &&
              basicInfo.info.dangerName.length > 8
            " effect="light" :content="basicInfo.info.dangerName" placement="right-start">
              <span>{{
                  basicInfo.info ? basicInfo.info.dangerName : "暂无"
              }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.dangerName : "暂无"
            }}</span>
          </p>
          <p>
            <span>监测组位置</span>
            <el-tooltip v-if="basicInfo.info.address && basicInfo.info.address.length > 8" effect="light"
              :content="basicInfo.info.address" placement="right-start">
              <span>{{
                  basicInfo.info ? basicInfo.info.address : "暂无"
              }}</span>
            </el-tooltip>
            <span v-else>{{
                basicInfo.info ? basicInfo.info.address : "暂无"
            }}</span>
          </p>
        </div>
      </div>
      <div class="point-table">

        <table-point  :mgId="GisCurrentGroup.id"></table-point>
        <!-- <Table
          :tableLoadingColor="'#0C2751'"
          :width="'100%'"
          class="cell-row-point"
          :tableLoading="tableLoading"
          :templateData="tableTemplateData"
          :tableConfig="tableConfig"
          :rowClassName="'monitoringPoint'"
          :pagination="pagination"
        >
        </Table> -->
      </div>
    </div>
    <div class="middle">
      <div class="group-info">
        <span class="title title-left" :style="titleBack">附件</span>
        <div class="group-box group-m-box">
          <!-- <CheckFile :fileList="basicInfo.info.files" /> -->
          附件
        </div>
      </div>
      <div class="point-table">
        <table-camera :mgId="GisCurrentGroup.id"></table-camera>
      </div>
    </div>
  </div>
</template>

<script>
import index from "./index";

export default {
  name: "basic-info",
  components: {
    tablePoint: () => import("./table-point.vue"),
    tableCamera: () => import("./table-camera.vue")
  },
  mixins: [index],
  data() {
    return {
      pagination: {
        show: true,
        total: 0,
        page: 1,
        size: 15,
        sizeChange: (size) => {
          this.pagination.size = size;
          this.searchParams.size = size;
          this.startSearch();
        },
        pageChange: (page) => {
          this.pagination.page = page;
          this.searchParams.page = page;
          this.startSearch();
        },
      },
      tableLoading2: false,
      tableTemplateData2: [],
      tableConfig2: {
        checkbox: false,
        rows: [
          {
            label: "摄像头名称",
            prop: "name",
          },
          {
            label: "摄像头地址",
            prop: "address",
          },
          {
            label: "备注",
            prop: "remark",
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
