<template>
  <div>
    <MesBox
      v-model="model"
      :lazy="true"
      title="查看简报"
      :height="600"
      :width="900"
      :padding="15"
    >
      <div class="block" v-for="(item, index) in this.Process"
      :key="index">
      <div style="margin-top:20px">
       <span style="font-size:14px;font-weight:bold;margin-bottom:10px">点位名称：</span>{{item.PointName}}
      </div>
      <div>
       <span style="font-size:14px;font-weight:bold;margin-bottom:10px">点位报告：</span>{{item.PointReport}}
      </div>
      </div>
    </MesBox>
  </div>
</template>
<script>
import MesBox from "@/components/basic/ViewGrid/MesBox.vue";
export default {
  components: {
    MesBox: MesBox,
  },
  data() {
    return {
      model: false,
      Process:'',
    };
  },
  methods: {
   
    open(data) {
      this.model = true;
      let a= data.Content.replace(/[\r|\n|\t]/g,"")
      this.Process=JSON.parse(a);
      // console.log("this.Process",this.Process);
      this.addVisible = true;
      // console.log("简报信息",data);
      
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
<style scoped>
.block{
    line-height: 35px;
     text-indent: 2em
}
</style>
