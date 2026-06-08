<template>
  <div>
    <MesBox
      :before-close="addClose"
      v-if="addVisible"
      v-model="model"
      :lazy="true"
      title="图层管理"
      :height="800"
      :width="1400"
      :padding="15"
    >
      <div class="block">
        <gisSearch
          :AngleData="AngleData"
          :groups="groups"
          @submitData="closeD3Angle"
        ></gisSearch>
      </div>
    </MesBox>
  </div>
</template>
<script>
import gisSearch from "@/components/map/mapLayer";
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
      groupList: [],
    };
  },
  methods: {
    addClose() {
      this.addVisible = false;
    },
    open(data) {
      if (data.Layer_Res) {
        this.AngleData = JSON.parse(data.Layer_Res);
        // console.log("this.AngleData",this.AngleData);
      }
      let param = {
        order: "asc",
        page: 1,
        rows: 30,
        sort: "ID",
        wheres: JSON.stringify([
          { name: "Project", value: "", displayType: "like" },
        ]),
      };
      let url = "/api/Mon_Group_Manager/getPageData";
      this.http.post(url, param, "正在请求中·····").then((result) => {
        this.groups = result.rows;
        this.model = true;
        this.addVisible = true;
        // console.log("this.groupList", this.groups);
      });
    },
    closeD3Angle(data) {
      this.formData.d3Angle = data;
      this.$emit("parentCall", ($parent) => {
        $parent.getRow(data);
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
