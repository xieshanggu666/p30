<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/alarm/alastatistic/Ala_Statistic.js此处编写
 -->
<template>
    <view-grid ref="grid"
               :columns="columns"
               :detail="detail"
               :editFormFields="editFormFields"
               :editFormOptions="editFormOptions"
               :searchFormFields="searchFormFields"
               :searchFormOptions="searchFormOptions"
               :table="table"
               :extend="extend">
    </view-grid>
</template>
<script>
    import extend from "@/extension/alarm/alastatistic/Ala_Statistic.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '预警统计',
                name: 'alastatistic/Ala_Statistic',
                url: "/Ala_Statistic/",
                sortName: "ID"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({"Group_Id":"","Alarm_Type":"","Alarm_Date":""});
            const searchFormOptions = ref([[{"dataKey":"groupManager","data":[],"title":"分组id","field":"Group_Id","type":"select"},{"dataKey":"alarmStatiscType","data":[],"title":"预警统计分类","field":"Alarm_Type","type":"select"}],[{"title":"预警日期","field":"Alarm_Date","type":"datetime"}]]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Group_Id',title:'分组id',type:'int',bind:{ key:'groupManager',data:[]},width:110,require:true,align:'left',sort:true},
                       {field:'Alarm_Type',title:'预警统计分类',type:'int',bind:{ key:'alarmStatiscType',data:[]},width:110,require:true,align:'left'},
                       {field:'Alarm_Count',title:'预警条数',type:'int',width:110,require:true,align:'left'},
                       {field:'Alarm_Date',title:'预警日期',type:'datetime',width:110,require:true,align:'left',sort:true},
                       {field:'Alarm_Desc',title:'备注',type:'string',width:120,align:'left'}]);
            const detail = ref({
                cnName: "#detailCnName",
                table: "#detailTable",
                columns: [],
                sortName: "",
                key: ""
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
