<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/alarm/singletemplate/Ala_SingleTemp.js此处编写
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
    import extend from "@/extension/alarm/singletemplate/Ala_SingleTemp.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '预警设置模板',
                name: 'singletemplate/Ala_SingleTemp',
                url: "/Ala_SingleTemp/",
                sortName: "ID"
            });
            const editFormFields = ref({"Title":"","Type_Id":"","FieldName":"","CalType":"","TimeMinute":"","Method":"","ThresholdValue":"","Level":''});
            const editFormOptions = ref([[{"title":"标题","required":true,"field":"Title"},
                               {"dataKey":"typeManager","data":[],"title":"监测类型","required":true,"field":"Type_Id","type":"select"}],
                              [{"title":"指标字段","required":true,"field":"FieldName"},
                               {"dataKey":"calType","data":[],"title":"数据计算类型","required":true,"field":"CalType","type":"select"}],
                              [{"dataKey":"alarmTime","data":[],"title":"预警时间范围","required":true,"field":"TimeMinute","type":"select"},
                               {"dataKey":"alarmMethod","data":[],"title":"数据比对方式","required":true,"field":"Method","type":"select"}],
                              [{"dataKey":"alarmLevel","data":[],"title":"预警等级","required":true,"field":"Level","type":"select"},{"title":"预警阈值标准","required":true,"field":"ThresholdValue"}]]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'标题',type:'string',width:150,require:true,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Type_Id',title:'监测类型',type:'int',bind:{ key:'typeManager',data:[]},width:110,require:true,align:'left'},

                       {field:'Level',title:'预警等级',type:'int',bind:{ key:'alarmLevel',data:[]},width:70,require:true,align:'left'},

                       {field:'FieldName',title:'指标字段',type:'string',width:70,require:true,align:'left'},
                       {field:'CalType',title:'数据计算类型',type:'int',bind:{ key:'calType',data:[]},width:70,require:true,align:'left'},
                       {field:'TimeMinute',title:'预警时间范围',type:'bigint',bind:{ key:'alarmTime',data:[]},width:70,require:true,align:'left'},
                       {field:'ThresholdValue',title:'预警阈值标准',type:'string',width:70,require:true,align:'left'},
                       {field:'Method',title:'数据比对方式',type:'string',bind:{ key:'alarmMethod',data:[]},width:70,require:true,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:70,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'CreateDate',title:'创建日期',type:'datetime',width:110,hidden:true,align:'left',sort:true},
                       {field:'ModifyID',title:'修改人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,align:'left',sort:true}]);
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
