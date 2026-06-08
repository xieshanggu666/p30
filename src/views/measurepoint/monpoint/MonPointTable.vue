<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/monpointmanager/Mon_Point_Manager.js此处编写
 -->
<template>

  <view-grid
    ref="grid"
    :columns="columns"
    :detail="detail"
    :editFormFields="editFormFields"
    :editFormOptions="editFormOptions"
    :searchFormFields="searchFormFields"
    :searchFormOptions="searchFormOptions"
    :table="table"
    :extend="extend"
  >
  </view-grid>
</template>
<script>
import extend from "@/extension/monitorbusiness/monpointmanager/Mon_Point_Manager.js";
import { ref, defineComponent, watch } from "vue";
export default defineComponent({
  props: ["nodeName"],
  setup(props) {
    // watch(
    //   () => props.nodeName,
    //   () => {
    //     getNodeName(props.nodeName);
    //   }
    // );
    const table = ref({
      key: "ID",
      footer: "Foots",
      cnName: "监测点位管理",
      name: "monpointmanager/Mon_Point_Manager",
      url: "/Mon_Point_Manager/",
      sortName: "Point_Order",
    });
    // function getNodeName(e) {
    //  console.log("触发了吗", e,table);
    // }
    const editFormFields = ref({
      Point_Name: "",
      Point_Num: "",
      Group_Id: "",
      Dev_Id: "",
      Type_Id: "",
      Dev_Base: " ",
      Sensor_Num: "",
      Initial_V: "",
      Initial_T: "",
      Sim_Num: "",
      Acc_Num: "",
      Point_Order: "",
      Long: "",
      Lat: "",
      Point_Height: "",
      Point_Description: "",
      AddOnline:'',
      Config:'',
    });
    const editFormOptions = ref([
      [
        { title: "点位编号", required: true, field: "Point_Num" },
        { title: "点位名称", required: true, field: "Point_Name" },
      ],
      [
        {
          dataKey: "groupManager",
          data: [],
          title: "所属分组id",
          required: true,
          field: "Group_Id",
          type: "select",
        },
        { title: "设备id", field: "Dev_Id",required: true },
      ],
      [
        {
          dataKey: "typeManager",
          data: [],
          title: "监测类型",
          required: true,
          field: "Type_Id",
          type: "select",
        },
        {
          dataKey: "gnssBaseList",
          data: [],
          title: "共享gnss基站",
          field: "Dev_Base",
          type: "select",
        },
      ],
      [
        { title: "设备卡号", field: "Sim_Num" },
        { title: "排序", field: "Point_Order", type: "number" },
      ],
      [
        { title: "初始值", field: "Initial_V" },
        { title: "初始时间", field: "Initial_T" },
      ],

      [
        { title: "经度", field: "Long", type: "decimal" },
        { title: "纬度", field: "Lat", type: "decimal" },
      ],
      [
        { title: "高程", field: "Point_Height", type: "decimal" },
        { title: "传感器编号", field: "Sensor_Num",required: true,
         },
      ],
      [
        { title: "类型数据配置", field: "Config",disabled:true },
      ],
      [
        {
          title: "点位说明",
          field: "Point_Description",
          type: "textarea",
          min: 1,
          max: 5,
          colSize: 12,
          minRows: 3,
        },
        {
            dataKey: "top",
            title: "是否统计在线率",
            required: true,
            field: "AddOnline",
            data: [],
            type: "switch",
          },
      ],
      [{ title: "附件", field: "Acc_Num", type: "img" }],
      
    ]);
    const searchFormFields = ref({
      Point_Name: "",
    });
    const searchFormOptions = ref([
      [
        { title: "设备编号/点位编号/点位名称", field: "Point_Name" },
      ],
    ]);
    const columns = ref([
      {
        field: "ID",
        title: "ID",
        type: "int",
        width: 110,
        hidden: true,
        readonly: true,
        require: true,
        align: "left",
      },
      {
        field: "Type_Icon",
        title: "类型",
        type: "img",
        width: 80,
        align: "left",
      },
      {
        field: "Point_Num",
        title: "点位编号",
        type: "string",
        width: 110,
        require: true,
        align: "left",
      },
      {
        field: "Point_Name",
        title: "点位名称",
        type: "string",
        width: 110,
        require: true,
        align: "left",
        sort: true,
        showOverflowTooltip:true
      },
       {
        field: "Config",
        title: "类型数据配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },

      {
        field: "Dev_Id",
        title: "设备编号",
        type: "int",
        //bind: { key: "groupManager", data: [] },
        width: 110,
        require: true,
        align: "left",
      },
      // {
      //   field: "Dev_Id",
      //   title: "设备id",
      //   type: "string",
      //   width: 110,
      //   align: "left",
      // },
      // {
      //   field: "Type_Id",
      //   title: "监测类型",
      //   type: "int",
      //   bind: { key: "typeManager", data: [] },
      //   width: 110,
      //   require: true,
      //   align: "left",
      // },
      {
        field: "Sensor_Num",
        title: "传感器编号",
        type: "string",
        width: 60,
        align: "left",
        hidden:true
      },
      // {
      //   field: "Initial_V",
      //   title: "初始值",
      //   type: "string",
      //   width: 110,
      //   align: "left",
      // },
      // {
      //   field: "Initial_T",
      //   title: "初始时间",
      //   type: "date",
      //   width: 110,
      //   align: "left",
      //   sort: true,
      // },
      // {
      //   field: "Sim_Num",
      //   title: "设备卡号",
      //   type: "string",
      //   width: 110,
      //   require: true,
      //   align: "left",
      // },
      {
        field: "State_Run",
        title: "运行状态",
        type: "string",
        width: 110,
        align: "left",
        bind: {
             //如果后面返回的数据为数据源的数据，请配置此bind属性，可以从后台字典数据源加载，也只以直接写上
             key: "State_Run",
             data: [
               { key: "离线", value: "离线" }          
             ]
           },
        showOverflowTooltip:true
      },
      {
        field: "Recent_T",
        title: "最新通信时间",
        type: "string",
        width: 110,
        align: "left",
        sort: true,
      },
      {
        field: "IsInitial",
        title: "初始化",
        type: "int",
        bind: {
          key: "audit",
          data: [
          { key: -1, value: "无" },
            { key: 0, value: "否" },
            { key: 1, value: "是" },
          ],
        },
        width: 80,
        align: "left",
        sort: true,
      },
      {
        field: "AddOnline",
        title: "在线率统计",
        type: "int",
        bind: {
          key: "top",
          data: [
            { key: 0, value: "否" },
            { key: 1, value: "是" },
          ],
        },
        width: 80,
        align: "left",
        sort: true,
      },
      {
        field: "Acc_Num",
        title: "附件",
        type: "img",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Point_Description",
        title: "点位说明",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Point_Order",
        title: "排序",
        type: "int",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Long",
        title: "经度",
        type: "decimal",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Lat",
        title: "纬度",
        type: "decimal",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Point_Height",
        title: "高程",
        type: "decimal",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Status",
        title: "数据状态",
        type: "int",
        width: 110,
        hidden: true,
        require: true,
        align: "left",
      },
      {
        field: "CreateID",
        title: "创建人id",
        type: "int",
        width: 80,
        hidden: true,
        align: "left",
      },
      {
        field: "Creator",
        title: "创建人",
        type: "string",
        width: 130,
        hidden: true,
        align: "left",
      },
      {
        field: "CreateDate",
        title: "创建日期",
        type: "datetime",
        width: 110,
        hidden: true,
        align: "left",
        sort: true,
      },
      {
        field: "ModifyID",
        title: "修改人id",
        type: "int",
        width: 80,
        hidden: true,
        align: "left",
      },
      {
        field: "Modifier",
        title: "修改人",
        type: "string",
        width: 130,
        hidden: true,
        align: "left",
      },
      {
        field: "ModifyDate",
        title: "修改时间",
        type: "datetime",
        width: 110,
        hidden: true,
        align: "left",
        sort: true,
      },
    ]);
    const detail = ref({
      cnName: "#detailCnName",
      table: "#detailTable",
      columns: [],
      sortName: "",
      key: "",
    });
    return {
      table,
      extend,
      editFormFields,
      editFormOptions,
      searchFormFields,
      searchFormOptions,
      columns,
      detail,
      // getNodeName,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .com-tree{
  height: 100%;
}
</style>
