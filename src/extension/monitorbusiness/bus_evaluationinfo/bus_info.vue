<template>
  <div>
    <MesBox
      v-model="model"
      :lazy="true"
      title="查看简报"
      :height="500"
      :width="900"
      :padding="15"
    >
      <div style="font-size:16px;font-weight:bold;margin-bottom:10px">简报信息：</div>
      <div class="block" v-for="(item, index) in this.Process"
      :key="index">
       {{item}}
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
      this.Process=JSON.parse(data.Process);
      // console.log("this.Process",this.Process);
    //   this.addVisible = true;
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
