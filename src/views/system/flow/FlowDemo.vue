<template>
  <div class="flow-demo">
    <div class="uunx">
        <div class="titcens">发起流程</div>
        <vol-form
        
          ref="form"
          :load-key="true"
          :label-width="60"
          :formRules="options"
          :formFields="fields"
        ></vol-form>
        <div style="text-align:center">
          <el-button @click="submit" type="primary">提交</el-button>
        </div>
    </div>
    
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import http from '@/../src/api/http.js';
import VolForm from '@/components/basic/VolForm.vue';
export default {
  components: {
    VolForm
  },
  setup() {
    const fields = reactive({
      ExpertName: '',
      Enable: '',
      City: '',
      IDNumber: '',
      PhoneNo: '',
      CreateDate: '',
      Resume: '',
      HeadImageUrl: ''
    });
    const options = reactive([
      [{ title: '名称', field: 'ExpertName' }],
      [
        {
          dataKey: 'enable',
          data: [],
          title: '状态',
          required: true,
          field: 'Enable',
          type: 'select'
        }
      ],
      [
        {
          dataKey: 'city',
          data: [],
          title: '地区',
          field: 'City',
          type: 'select'
        }
      ],
      [{ title: '日期', field: 'CreateDate', type:"date" }],
      [{ title: '备注', field: 'Resume', colSize: 12, type: 'textarea' }]
    ]);
    let appContext = getCurrentInstance().appContext;
    let $message = appContext.config.globalProperties.$message;
    const form = ref(null);

    const submit = () => {
      form.value.validate(() => {
        http
          .post('api/App_Expert/add', { mainData: fields }, true)
          .then((result) => {
            if (!result.status) {
              return $message.error(result.message);
            }
            form.value.reset();
            $message.success(result.message);
          });
      });
    };

    return {
      options,
      fields,
      submit,
      form
    };
  }
};
</script>
<style scoped lang="less">
.flow-demo {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  // left: 0;
  // right: 0;
  // margin: 0 auto;
  // margin-top: 20px;
  .uunx{
    width: 500px;
    height: auto;
    .titcens{
      width: 100%;
      text-align: center;
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}

::v-deep .el-divider--horizontal{
  margin: 0 !important;
}
</style>
