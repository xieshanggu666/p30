<template>
  <div>
    <view-grid
      ref="grid"
      :columns="columns"
      :detail="detail"
      :editFormFields="editFormFields"
      :editFormOptions="editFormOptions"
      :searchFormFields="searchFormFields"
      :searchFormOptions="searchFormOptions"
      :table="table"
    >
    </view-grid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: {
        key: "ID",
        footer: "Foots",
        cnName: "监测数据管理",
        name: "alainfomation/Ala_Infomation",
        url: "/Ala_Infomation/",
        sortName: "ID",
      },
      searchFormFields: {
        Title: "",
        Group_Id: "",
        Dev_Id: "",
        Point_Num: "",
        CreateDate: [null, null],
      },
      searchFormOptions: [
        [
          {
            dataKey: "groupManager",
            data: [],
            title: "设备选择",
            field: "Group_Id",
            type: "select",
          },
          {
            dataKey: "groupManager",
            data: [],
            title: "设备选择",
            field: "Group_Id",
            type: "select",
          },
        ],
      ],
      columns: [
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
          field: "DisplayName",
          title: "名称",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
          sort: true,
        },
        {
          field: "FieldName",
          title: "字段名",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: "V1", value: "V1" },
              { key: "V2", value: "V2" },
              { key: "V3", value: "V3" },
              { key: "V4", value: "V4" },
              { key: "V5", value: "V5" },
              { key: "V6", value: "V6" },
            ],
          },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "AggregationType",
          title: "聚合方式",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: "Max", value: "Max" },
              { key: "Min", value: "Min" },
              { key: "Avg", value: "Avg" },
              { key: "Sum", value: "Sum" },
            ],
          },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "Precision",
          title: "精度属性",
          type: "int",
          bind: {
            key: "audit",
            data: [
              { key: 0, value: 0 },
              { key: 1, value: 1 },
              { key: 2, value: 2 },
              { key: 3, value: 3 },
              { key: 4, value: 4 },
              { key: 5, value: 5 },
              { key: 6, value: 6 },
            ],
          },
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "UnitCoefficient",
          title: "单位系数",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "MaxValue",
          title: "最大值",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
        {
          field: "MinValue",
          title: "最小值",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        },
      ],
      detail: {
        cnName: "#detailCnName",
        table: "#detailTable",
        columns: [],
        sortName: "",
        key: "",
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
