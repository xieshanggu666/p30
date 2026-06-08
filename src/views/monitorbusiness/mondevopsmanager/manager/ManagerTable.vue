<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/mondevopsmanager/Mon_DevOps_Manager.js此处编写
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
import extend from "@/extension/monitorbusiness/mondevopsmanager/Mon_DevOps_Manager.js";
import { fa } from "element-plus/es/locale";
import { ref, defineComponent } from "vue";
export default defineComponent({
  setup() {
    const table = ref({
      key: "ID",
      footer: "Foots",
      cnName: "监测运维管理",
      name: "mondevopsmanager/Mon_DevOps_Manager",
      url: "/Mon_DevOps_Manager/",
      sortName: "ID",
    });
    const editFormFields = ref({
      Ops_Name: "",
      Group_Id: "",
      Ops_Type: "",
      Dev_Id: "",
      User_Name: "",
      Ops_Date: "",
      Comment: "",
      Acc_Num: "",
      Sim_Num: "",
      Change_Comment: "",
      Handle_Method: "",
      Error_Reason: "",
      Error_Type: "",
    });
    const editFormOptions = ref([
      [
        {
          title: "项目名称",
          field: "Project_Name",
          required: true,
        },
        { title: "运维名称", required: true, field: "Ops_Name" },
      ],
      [
        {
          dataKey: "groupManager",
          data: [],
          title: "滑坡点位",
          required: true,
          field: "Group_Id",
          type: "select",
        },
        {
          dataKey: "devopsType",
          data: [],
          title: "运维类型",
          required: true,
          field: "Ops_Type",
          type: "select",
        },
      ],
      [
        {
          dataKey: "typeManager",
          data: [],
          title: "维修设备类型",
          required: true,
          field: "Dev_Id",
          type: "select",
        },

        { title: "操作人", required: true, field: "User_Name" },
      ],
      [
        { title: "设备卡号", required: false, field: "Sim_Num" },
        {
          title: "运维时间",
          required: true,
          field: "Ops_Date",
          type: "datetime",
        },
      ],
      [
        {
          dataKey: "errorType",
          data: [],
          title: "故障分类",
          required: true,
          field: "Error_Type",
          type: "select",
        },
        { title: "故障原因", required: true, field: "Error_Reason" },
      ],
      [
        { title: "处理办法", required: true, field: "Handle_Method" },
        { title: "更换设备备注", required: true, field: "Change_Comment" },
      ],
      [
        { title: "附件", field: "Acc_Num", type: "file" },
        {
          title: "备注",
          field: "Comment",
          type: "textarea",
          min: 1,
          max: 5,
          colSize: 12,
          minRows: 3,
        },
      ],
    ]);
    const searchFormFields = ref({
      Ops_Name: "",
      User_Name: "",
      Group_Id: "",
      Ops_Type: "",
    });
    const searchFormOptions = ref([
      [
        { title: "运维名称", field: "Ops_Name" },
        { title: "维修人", field: "User_Name" },
      ],
      [
        {
          dataKey: "devopsType",
          data: [],
          title: "运维类型",
          field: "Ops_Type",
          type: "select",
        },
      ],
    ]);
    const columns = ref([
      {
        field: "ID",
        title: "ID",
        type: "int",
        width: 120,
        hidden: true,
        readonly: true,
        require: true,
        align: "left",
      },
      {
        field: "Ops_Name",
        title: "运维名称",
        type: "string",
        width: 120,
        require: true,
        align: "left",
        sort: true,
        showOverflowTooltip: true,
      },

      {
        field: "Group_Id",
        title: "点位滑坡",
        type: "int",
        bind: {
          key: "groupManager",
          data: [],
        },
        width: 120,
        require: true,
        align: "left",
      },
      {
        field: "Ops_Type",
        title: "运维类型",
        type: "int",
        bind: {
          key: "devopsType",
          data: [],
        },
        width: 120,
        require: true,
        align: "left",
      },
      {
        field: "Dev_Id",
        title: "维修设备类型",
        type: "string",
        width: 100,
        align: "left",
      },
      {
        field: "Error_Type",
        title: "故障分类",
        type: "string",
        bind: {
          key: "errorType",
          data: [],
        },
        width: 120,
        require: true,
        align: "left",
      },

      {
        field: "Handle_Method",
        title: "处理办法",
        type: "string",
        width: 120,
        require: true,
        align: "left",
        sort: true,
        showOverflowTooltip: true,
      },
      // "Sim_Num":'',
      // "Error_Reason":'',

      {
        field: "User_Name",
        title: "维修人",
        type: "string",
        width: 100,
        require: true,
        align: "left",
      },
      {
        field: "Ops_Date",
        title: "运维时间",
        type: "datetime",
        width: 120,
        require: true,
        align: "left",
        sort: true,
        showOverflowTooltip: true,
      },
      {
        field: "Change_Comment",
        title: "设备更换部件备注",
        type: "string",
        width: 120,
        require: true,
        align: "left",
        sort: true,
        showOverflowTooltip: true,
      },

      {
        field: "Acc_Num",
        title: "照片",
        type: "img",
        width: 100,
        align: "left",
      },
      {
        field: "Status",
        title: "数据状态",
        type: "int",
        width: 120,
        hidden: true,
        require: true,
        align: "left",
      },
      {
        field: "CreateID",
        title: "创建人id",
        type: "int",
        width: 120,
        hidden: true,
        align: "left",
      },
      {
        field: "Creator",
        title: "创建人",
        type: "string",
        width: 120,
        hidden: true,
        align: "left",
      },
      {
        field: "CreateDate",
        title: "创建日期",
        type: "datetime",
        width: 120,
        hidden: true,
        align: "left",
        sort: true,
      },
      {
        field: "ModifyID",
        title: "修改人id",
        type: "int",
        width: 120,
        hidden: true,
        align: "left",
      },
      {
        field: "Modifier",
        title: "修改人",
        type: "string",
        width: 120,
        hidden: true,
        align: "left",
      },
      {
        field: "ModifyDate",
        title: "修改时间",
        type: "datetime",
        width: 120,
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
