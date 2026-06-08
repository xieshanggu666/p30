<template>
     <!-- 设备郁预警信息 -->
     <el-dialog
      custom-class="sebeis"
      v-model="sebeisVisible"
      append-to-body
      width="90%"
      destroy-on-close
      :before-close="handleCloses"
    > 
      <div class="autowd"><warning  v-if="sebeisVisible" ref="warning"></warning></div>
    </el-dialog> 
</template>

<script>
import warning from "@/views/alarm/alaequipment/Ala_equipment_warning.vue";
import store from "@/store/index";
export default {
    name: 'Xjcyis',
    components:{warning},
    data(){
        return {
            sebeisVisible:false
        }
    },
    methods:{
        opense(row){
             //js参数随机数
            const timestamp = new Date().getTime();
            store.commit('rouACT',timestamp);
            //打开预警信息界面
            this.sebeisVisible=true;
        },
        //关闭组件触发子组件销毁定时器
        handleCloses(){
            this.sebeisVisible=false;
            this.$refs.warning.celfn();
        },
    }
}
</script>
<style  lang="scss">
.sebeis{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .isbent button:nth-child(4){
    display: none;
  }
  .isbent button:nth-child(5){
    display: none;
  }
  .isbent button:nth-child(6){
    display: none;
  }
  .isbent button:nth-child(7){
    display: none;
  }
  .isbent button:nth-child(8){
    display: none;
  }
}
.autowd{
  width: 100%;
  height: 80vh;
}
</style>