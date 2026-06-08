<template>
  <div>
    <MesBox
      :before-close="addClose"
      v-if="addVisible"
      v-model="model"
      :lazy="true"
      title="监测组位置绑定"
      :height="700"
      :width="1250"
      :padding="15"
    >
      <div class="block">
        <mapSearch :formData="formData" @CloseVialog="closeVialog"></mapSearch>
      </div>
    </MesBox>
  </div>
</template>
<script>
import mapSearch from "@/components/map/mapSearch.vue";
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";
export default {
  components: {
    MesBox: MesBox,
    mapSearch: mapSearch,
  },
  data() {
    return {
      color: "#409EFF",
      model: false,
      addVisible: "",
      formData: {
        lat: "",
        long: "",
        address: "",
      },
    };
  },
  methods: {
    addClose() {
      this.addVisible = false;
    },
    open(data) {
      this.model = true;
      this.addVisible = true;
      this.formData.lat = data.Group_Lat;
      this.formData.long = data.Group_Long;
      this.formData.address = data.Group_Long;
    },
    closeVialog(data) {
      this.$emit("parentCall", ($parent) => {
        $parent.getRow(data);
      });
      this.model = false;
      this.addVisible = false;
    },
  },
};
</script>
