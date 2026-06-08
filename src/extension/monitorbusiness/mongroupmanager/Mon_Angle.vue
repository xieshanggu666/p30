<template>
  <div>
    <MesBox
      :before-close="addClose"
      v-if="addVisible"
      v-model="model"
      :lazy="true"
      title="绑定视角"
      :height="800"
      :width="1250"
      :padding="15"
    >
      <div class="block">
        <gisSearch
          :AngleData="AngleData"
          @submitData="closeD3Angle"
        ></gisSearch>
      </div>
    </MesBox>
  </div>
</template>
<script>
import gisSearch from "@/components/map/gisAngle.vue";
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";
export default {
  components: {
    MesBox: MesBox,
    gisSearch: gisSearch,
  },
  data() {
    return {
      color: "#409EFF",
      model: false,
      addVisible: "",
      formData: {},
      AngleData: JSON.parse("{}"),
    };
  },
  methods: {
    addClose() {
      this.addVisible = false;
    },
    open(data) {
      this.model = true;
      this.addVisible = true;
      // console.log("data",data);
      if (data) {
        this.AngleData = JSON.parse(data.GIS_Config);
      }
    },
    closeD3Angle(data) {
      this.formData.d3Angle = data;
      this.$emit("parentCall", ($parent) => {
        $parent.getRowAngle(data);
      });
      this.addVisible = false;
      this.model = false;
    },
    // closeVialog(data) {
    //   this.$emit("parentCall", ($parent) => {
    //     $parent.getRow(data);
    //   });
    //   this.model = false;
    // },
  },
};
</script>
