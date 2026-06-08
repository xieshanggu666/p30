<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/montypemanager/Mon_Type_Manager.js此处编写
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
import extend from "@/extension/monitorbusiness/montypemanager/Mon_Type_Manager.js";
import { ref, defineComponent } from "vue";
export default defineComponent({
  setup() {
    const table = ref({
      key: "ID",
      footer: "Foots",
      cnName: "监测类型管理",
      name: "montypemanager/Mon_Type_Manager",
      url: "/Mon_Type_Manager/",
      sortName: "ID",
    });
    const editFormFields = ref({
      Type_Name: "",
      Type_Code: "",
      Type_Order: "",
      Type_Icon: "",
      Data_Config: "",
      Run_Config: "",
      Display_Config: "",
      Type_Description: "",
    });
    const editFormOptions = ref([
      [
        { title: "类型编号", required: true, field: "Type_Code" },
        { title: "类型名称", required: true, field: "Type_Name" },
      ],
      [
        {
          title: "类型展示配置",
          required: true,
          data: [
            { key: "1", value: "折柱混合" },
            { key: "2", value: "折线图" },
            { key: "3", value: "柱状图" },
          ],
          min: 2,
          max: 4,
          field: "Display_Config",
          type: "radio",
        },
        { title: "排序", field: "Type_Order", type: "number" },
      ],
      [
        { title: "类型监测数据配置", field: "Data_Config" },
        { title: "类型状态数据配置", field: "Run_Config" },
      ],
      [
        {
          title: "类型说明",
          field: "Type_Description",
          min: 1,
          max: 5,
          type: "textarea",
          colSize: 12,
          minRows: 3,
        },
      ],
      [{ title: "类型图标", field: "Type_Icon", type: "img" }],
    ]);
    const searchFormFields = ref({ Type_Name: "", Type_Code: "" });
    const searchFormOptions = ref([
      [
        { title: "类型名称", field: "Type_Name", type: "like" },
        { title: "类型编号", field: "Type_Code", type: "like" },
      ],
    ]);
    const columns = ref([
      {
        field: "ID",
        title: "ID",
        type: "int",
        width: 20,
        hidden: true,
        readonly: true,
        require: true,
        align: "left",
      },
      {
        field: "Type_Icon",
        title: "类型图标",
        type: "img",
        width: 80,
        align: "left",
      },
      {
        field: "Type_Code",
        title: "类型编号",
        type: "string",
        width: 110,
        require: true,
        align: "left",
      },
      {
        field: "Type_Name",
        title: "类型名称",
        type: "string",
        width: 180,
        require: true,
        align: "left",
        sort: true,
        link: true,
        sortable: true,
      },
      {
        field: "Type_Order",
        title: "排序",
        type: "int",
        width: 110,
        align: "left",
      },
      {
        field: "Data_Config",
        title: "类型监测数据配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Run_Config",
        title: "类型状态数据配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Display_Config",
        title: "类型展示配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },

      {
        field: "Type_Description",
        title: "类型说明",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
        showOverflowTooltip:true
      },
      {
        field: "Comment",
        title: "备注",
        type: "string",
        width: 220,
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
        field: "Type_Description",
        title: "类型说明",
        type: "string",
        width: 130,
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
    };
  },
});
</script>
