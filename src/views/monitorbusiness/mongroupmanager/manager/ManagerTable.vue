<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/mongroupmanager/Mon_Group_Manager.js此处编写
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
import extend from "@/extension/monitorbusiness/mongroupmanager/Mon_Group_Manager.js";
import { ref, defineComponent } from "vue";
export default defineComponent({
  setup() {
    const table = ref({
      key: "ID",
      footer: "Foots",
      cnName: `监测分组管理`,
      name: "mongroupmanager/Mon_Group_Manager",
      url: "/Mon_Group_Manager/",
      sortName: "Group_Order",
    });
    const editFormFields = ref({
      Project: "",
      Group_Name: "",
      Group_Num: "",
      Group_Type: "",
      Province: "",
      City: "",
      Country: "",
      Group_Order: "",
      GIS_Config: "",
      Covering_Config: "",
      Alarm_Single: "",
      Alarm_Combine: "",
      Alarm_Enable: 0,
      Group_Comment: "",
      Long: "",
      Lat: "",
      Acc_Num: "",
    });
    const editFormOptions = ref([
      [
        {
          dataKey: "projectManager",
          data: [],
          title: "所属项目",
          required: true,
          field: "Project",
          type: "select",
        },
        { title: "分组编号", field: "Group_Num" },
      ],
      [
        { title: "分组名称", field: "Group_Name" },
        {
          dataKey: "projectManager",
          data: [],
          title: "分组类型",
          field: "Group_Type",
          type: "select",
        },
      ],
      [
        { title: "省", field: "Province" },
        { title: "市", field: "City" },
      ],
      [
        { title: "区县", field: "Country" },
        { title: "分组排序", field: "Group_Order", type: "number" },
      ],
      [
        { title: "GIS配置", field: "GIS_Config" },
        { title: "覆盖物配置", field: "Covering_Config" },
      ],
      [
        { title: "经度", field: "Long", type: "decimal" },
        { title: "纬度", field: "Lat", type: "decimal" },
      ],
      [
        { title: "简单预警配置", field: "Alarm_Single", disabled: true },
        { title: "组合预警配置", field: "Alarm_Combine", disabled: true },
      ],
      [
        { title: "是否启用预警", field: "Alarm_Enable", type: "switch" },
        {
          title: "分组备注",
          field: "Group_Comment",
          min: 1,
          max: 5,
          type: "textarea",
          colSize: 12,
          minRows: 3,
        },
      ],
      [
        {
          title: "附件",
          field: "Acc_Num",
          type: "file",
        },
      ],
    ]);
    const searchFormFields = ref({ Project: "" });
    const searchFormOptions = ref([
      [
        {
          dataKey: "projectManager",
          data: [],
          title: "分组名称/分组编号",
          field: "Project",
          type: "like",
        },
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
        field: "Collectioned",
        title: "收藏",
        bind: { key: "enable", data: [] },
        type: "int",
        width: 40,
        align: "left",
      },
      {
        field: "Province",
        title: "省",
        type: "string",
        width: 80,
        align: "left",
      },
      {
        field: "City",
        title: "市",
        type: "string",
        width: 80,
        align: "left",
      },
      {
        field: "Country",
        title: "区域",
        type: "string",
        width: 80,
        align: "left",
      },

      {
        field: "Project",
        title: "项目",
        type: "string",
        bind: { key: "projectManager", data: [] },
        width: 80,
        require: true,
        align: "left",
        sort: true,
      },
      {
        field: "Group_Num",
        title: "编号",
        type: "string",
        width: 80,
        align: "left",
      },
      {
        field: "Group_Name",
        title: "名称",
        type: "string",
        width: 180,
        align: "left",
        showOverflowTooltip: true,
      },
      {
        field: "Group_Comment",
        title: "备注",
        type: "string",
        width: 180,
        align: "left",
        showOverflowTooltip: true,
      },

      // {
      //   field: "Group_Type",
      //   title: "分组类型",
      //   type: "string",
      //   bind: { key: "projectManager", data: [] },
      //   width: 110,
      //   align: "left",
      // },
      // {
      //   field: "Province",
      //   title: "省",
      //   type: "string",
      //   width: 110,
      //   align: "left",
      // },
      // { field: "City", title: "市", type: "string", width: 110, align: "left" },
      // {
      //   field: "Country",
      //   title: "区县",
      //   type: "string",
      //   width: 110,
      //   align: "left",
      // },
      {
        field: "GIS_Config",
        title: "GIS配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Covering_Config",
        title: "覆盖物配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Alarm_Single",
        title: "简单预警配置",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Alarm_Combine",
        title: "组合预警配置",
        type: "string",
        width: 180,
        hidden: true,
        align: "left",
      },
      {
        field: "Alarm_Enable",
        title: "是否预警",
        type: "switch",
        width: 180,
        hidden: true,
        align: "left",
      },
      {
        field: "Group_Comment",
        title: "分组备注",
        type: "string",
        width: 220,
        hidden: true,
        align: "left",
      },
      {
        field: "Group_Order",
        title: "分组排序",
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
        field: "Group_Height",
        title: "高程",
        type: "decimal",
        width: 110,
        hidden: true,
        align: "left",
      },
      {
        field: "Acc_Num",
        title: "附件",
        type: "string",
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
        sort: true,
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
