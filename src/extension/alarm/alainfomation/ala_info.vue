<template>
  <div>
    <MesBox
      v-model="model"
      :lazy="true"
      title="查看预警详情"
      :height="500"
      :width="1000"
      :padding="15"
    >
      <div style="font-size:16px;margin-bottom:10px" class="block">预警信息： 
        <div style="content">{{ data.Content }}</div>
      </div>
      <div>
        <span style="font-size:16px">数据查看：</span>
        <el-button @click="ShowDetailData('record')" type="primary">监测数据</el-button>
        <el-button @click="ShowDetailData('operation')" type="primary">运行数据</el-button>
        <el-button @click="ShowDetailData('satellite')" type="primary">卫星数据</el-button>
        <el-button @click="ShowDetailData('analyse')" type="primary">单相分析</el-button>
      </div>
    </MesBox>
    <Record ref="record"></Record>
    <Operation  ref="operation"></Operation>
    <Satellite  ref="satellite"></Satellite>
    <Analyse    ref="analyse"></Analyse>
  </div>
</template>
<script>
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";
import Record from "../../monitorbusiness/monpointmanager/Mon_Record.vue";
import Operation from "../../monitorbusiness/monpointmanager/Mon_Operation.vue";
import Satellite from "../../monitorbusiness/monpointmanager/Mon_Satellite.vue";
import Analyse from "../../monitorbusiness/monpointmanager/Analyse_Uniphase.vue";

export default {
  components: {
    MesBox: MesBox,
    Record: Record,
    Operation:Operation,
    Satellite:Satellite,
    Analyse:Analyse,
  },
  data() {
    return {
      model: false,
      data: "",
    };
  },
  methods: {
    open(data) {
      this.model = true;
      this.data = data;
    },

    ShowDetailData(type) {
      switch (type) {
        case "record":
          this.$refs.record.openRecord(this.data);
          break;
        case "operation":
          this.$refs.operation.openOperation(this.data);
          break;
        case "satellite":
          this.$refs.satellite.openSatellite(this.data);
          break;
        case "analyse":
          this.$refs.analyse.openAnalyse(this.data);
          break;
      }
    },

    closeVialog(data) {
      this.$emit("parentCall", ($parent) => {
        $parent.getRow(data);
      });
      this.model = false;
    },
  },
};
</script>
<style scoped>
.block {
  line-height: 35px;
}
.content{
  width: 500px;
  padding: 10 10;
}
</style>
