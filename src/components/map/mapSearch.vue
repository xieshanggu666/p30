<template>
  <div>
    <div>
      <div class="header">
        <el-select
          v-model="input"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="changeMapPoint"
          value-key="id"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-switch
          class="switch"
          v-model="pickFlag"
          active-text="正在选点"
          inactive-text="没有选点"
        >
        </el-switch>
        <div class="address">
          <span> 当前位置：{{ this.address }} </span>
          <span>当前经度：{{ this.lnglat[0] }}</span>
          <span>当前纬度：{{ this.lnglat[1] }}</span>
          <el-button @click="OverChoose">确认选择</el-button>
        </div>
      </div>
      <div id="mapSearch"></div>
    </div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  securityJsCode: "2a6a6fc688061bf411e452fd1538c7f6",
};
export default {
  props: ["iptId", "formData"],
  data() {
    return {
      map: null,
      mouseTool: null,
      lnglat: [],
      auto: null,
      placeSearch: null,
      input: null,
      options: [],
      loading: false,
      pickFlag: false,
      marker: null,
      geocoder: null,
      address: null,
    };
  },
  methods: {
    OverChoose() {
      const params = {
        address: this.address,
        latitude: this.lnglat[0],
        longitude: this.lnglat[1],
      };
      if (params.address && params.latitude && params.longitude) {
        this.$emit("CloseVialog", params);
      } else {
        this.$message.info("请先完成选点");
      }
    },
    MapClick(point) {
      if (this.pickFlag) {
        if (this.marker) {
          this.map.remove(this.marker);
          // this.map.setFitView();
        }
        // 构造点标记
        this.lnglat = [point.lnglat.getLng(), point.lnglat.getLat()];
        this.marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: this.lnglat,
          anchor: "bottom-center",
        });
        this.map.add(this.marker);
        // this.map.setFitView();

        this.geocoder.getAddress(this.lnglat, (status, result) => {
          // console.log("result", result);
          // console.log("status", status);
          if (status === "complete" && result.regeocode) {
            this.address = result.regeocode.formattedAddress;
          } else {
            log.error("根据经纬度查询地址失败");
          }
        });
      }
    },
    changeMapPoint() {
      if (this.input.location) {
        this.map.setZoom(20);
        this.map.panTo([this.input.location.lng, this.input.location.lat]);
        // this.map.setFitView();
      }
    },
    remoteMethod(query) {
      this.loading = true;
      this.auto.search(query, (status, result) => {
        this.loading = false;
        this.options = result.tips;
      });
    },
    initMap() {
      AMapLoader.load({
        key: "fbe6a5672ee059c5be9844ec82a0a42a",
        version: "2.0",
        plugins: ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Geocoder"],
      })
        .then((AMap) => {
          this.map = new AMap.Map("mapSearch", {
            viewMode: "2D", //  是否为3D地图模式
            zoom: 6, // 初始化地图级别
            center: [112.65553, 34.748764], //中心点坐标  郑州
            resizeEnable: true,
          });
          this.auto = new AMap.AutoComplete({
            input: "inputId", // 搜索框的id
          });
          // 实例化Autocomplete
          var autoOptions = {
            city: "全国",
          };
          this.auto = new AMap.Autocomplete(autoOptions);
          this.auto.search(this.input, function(status, result) {
            // 搜索成功时，result即是对应的匹配数据
          });

          this.geocoder = new AMap.Geocoder({
            radius: 20, //范围，默认：500
          });
          //为地图注册click事件获取鼠标点击出的经纬度坐标
          this.map.on("click", (e) => {
            this.MapClick(e);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.initMap();
    if (this.formData) {
      this.lnglat[0] = this.formData.lat;
      this.lnglat[1] = this.formData.long;
      this.address = "";
    }
  },
};

// map.panTo([116.405467, 39.907761]);
</script>
<style>
#mapSearch {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 600px;
  margin: 30px 0;
  font-family: "微软雅黑";
}
#mapSearch .amap-logo {
  display: none !important;
}
#mapSearch .amap-copyright {
  display: none !important;
}
.header {
  display: flex;
}
.header .address {
  display: flex;
  align-items: center;
  margin-left: 40px;
}
.header .address span {
  margin-right: 10px;
  font-weight: 700;
}
.switch {
  margin-left: 20px;
}
</style>
