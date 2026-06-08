<template>
  <div class="configBox">
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <img class="imstyle" src="@/assets/gis/switch-box/tucall.png"/>
          <!-- <el-icon class="header-icon">
            <MapLocation />
          </el-icon> -->
          <span class="ainiy">
            图层管理
          </span>
          
        </template>
        <div class="item-styel">
          
          <div class="item-box">
            <el-radio-group v-model="state.radio">
              <el-radio label="image" @change="ChangeLayer">影像</el-radio>
              <el-radio label="hd" @change="ChangeLayer">高清</el-radio>
              <el-radio label="map" @change="ChangeLayer">地图</el-radio>
            </el-radio-group>
          </div>
         
          <div class="item-box">
            <el-checkbox
              v-model="state.label.ibo"
              label="地名标注"
              size="large"
              @change="() => ChangeLabel('ibo')"
            />
            <el-checkbox
              v-model="state.label.label"
              label="行政边界"
              size="large"
              @change="() => ChangeLabel('label')"
            />
            <el-checkbox
              v-model="state.label.earthquake"
              label="同震模拟"
              size="large"
              @change="() => simulateNow('earthquake')"
            />
            <el-checkbox
              v-model="state.label.earthquakeNow"
              label="地震图层"
              size="large"
              @change="() => earthquakeNow('earthquakeNow')"
            />

            <!-- <el-checkbox
              v-model="state.label.weatherNow"
              label="天气图层"
              size="large"
              @change="() => weatherNow('weatherNow')"
            /> -->
          </div>
          <div class="importkml">
            <el-button
              type="primary"
              @click="handleOpenClick()"
              >导入KML文件</el-button
            >
            <input
              type="file"
              ref="fileInput"
              class="file"
              @change="handleFileChange"
              style="display: none"
            />
          </div>
          <div class="uxin"></div>
          <div class="ishdops">
              <el-radio
                v-for="(item, index) in state.layerData"
                size="large"
                :key="index"
                v-model="state.radio2"
                :label="item.ID"
                @change="
                  () =>
                    myLayerNow(
                      item.Layer_Res,
                      item.LayerFlag,
                      item.ID,
                      item.Layer_Name
                    )
                "
                >{{ item.Layer_Name }}</el-radio
              >
            </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { InfoFilled, Setting, MapLocation } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import http from "@/api/http.js";

const fileInput = ref(null);

const state = reactive({
  layerData: [],
  swtichFlag: true,
  simulateFlag: false,
  earthquakeFlag: false,
  weatherFlag: false,
  radio: "image",
  radio2: "image",
  label: {
    ibo: false,
    label: false,
    earthquake: false,
    earthquakeNow: false,
    weatherNow: false,
  },
});
const emit = defineEmits(["GisFunctionChangeLayer", "GisFunctionChangeLabel"]);

function ChangeLayer() {
  console.log("ChangeLayer");
  emit("GisFunctionChangeLayer", state.radio);
}
function ChangeLabel(type) {
  emit("GisFunctionChangeLabel", type, state.label);
}

function handleOpenClick() {
  fileInput.value.click();
}
//导入kml
function handleFileChange(evt) {
  emit("GisFunctionhandleFile", evt);
}

// 同震
function simulateNow(type) {
  state.simulateFlag = !state.simulateFlag;
  //   if (state.simulateFlag) {
  //     state.earthquakeFlag = false;
  //     state.levelFlag = false;
  //     state.earthquakeList = [];
  //   }
  emit("changesimulate", type, state.simulateFlag);
}

// 实时地震
function earthquakeNow(type) {
  state.earthquakeFlag = !state.earthquakeFlag;
  emit("emitEarthquakLoadMore", type, state.earthquakeFlag);
}

// 实时天气
function weatherNow(type) {
  state.weatherFlag = !state.weatherFlag;
  emit("emitWeatheLoadMore", type, state.weatherFlag);
}

// 接口获取的图层
function myLayerNow(e, type, ID, Layer_Name) {
  emit("emitMyLayerNow", e, type, ID, Layer_Name);
}

MyLayer();
// 获取推演图层接口
function MyLayer() {
  const params = {
    order: "desc",
    page: 1,
    rows: 30,
    sort: "ID",
    wheres: "[]",
  };
  let url = `/api/Deduce_Layer/getPageData`;
  http.post(url, params, true).then((result) => {
    state.layerData = result.rows;
    state.layerData.map((item) => {
      item["LayerFlag"] = false;
    });
  });
}
</script>
<style scoped lang="scss">
::v-deep .el-collapse *{
    color: #999 !important;
}
::v-deep .el-radio__label{
  font-weight: 500;
  font-size: 14px;
  color: #333333 !important;
}
::v-deep .el-radio__input.is-checked+.el-radio__label{
  color: #3570FC !important;
}
::v-deep .el-radio__inner{
 border: 1px solid #999999;
}
::v-deep .el-checkbox__inner{
  border: 1px solid #999999;
}
::v-deep .el-checkbox__label{
  color: #333333 !important;
  font-weight: 500;
  font-size: 14px;
}
::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #3570FC !important;
}
::v-deep .el-button{
  span{
    color: #fff !important;
  }

}
</style>
<style lang="scss">
.configBox {
  width: 240px;
  .imstyle{
    width: 14px;
    height: 14px;
  }
  .ainiy{
    font-weight: 500;
    font-size: 14px;
    color: #333333 !important;
    margin: 0 6px;
  }
  .box {
    border: 1px red solid;
  }
}
.el-collapse-item__content {
  overflow-y: auto;
  max-height: 443px;
  padding: 0 0 20px 0;
}
.el-collapse {
  border: none;
  color: #ffffff;
  .item-styel {
    .importkml {
      padding-top: 10px;
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
    }
    .uxin{
      width: calc(100% - 30px);
      margin: auto;
      margin-bottom: 10px;
      border-bottom: 1px dashed #DEDEDE;
    }
    .ishdops{
      padding-left: 15px;
      &>label{
        width: 100%;
      }
    }
    .item-box {
      // margin-left: 10px;
      // display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .el-checkbox {
        margin: 0;
        width: 50%;
        padding-left: 15px
      }
    }
    .el-radio {
      margin: 0;
      margin-right: 6px;
    }
    .el-radio-group {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 15px 5px;
    }
  }
  * {
    border: none;
    color: #ffffff;
  }
  .el-collapse-item {
    background-color: black !important;

    .el-collapse-item__header {
      // background-color: #09162d !important;
      // border: 2px #1a70c7 solid;
      border-radius: 4px;
      background: #fff;
      padding:11px 12px;

      font-weight: 500;
      font-size: 14px;
      color: #333333;
    }

    .el-collapse-item__wrap {
      background-color: #fff !important;
      margin-top: -4px;
      border-radius: 4px;
    }
  }
}
</style>
