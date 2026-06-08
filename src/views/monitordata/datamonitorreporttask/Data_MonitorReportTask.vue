<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitordata/datamonitorreporttask/Data_MonitorReportTask.js此处编写
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
    import extend from "@/extension/monitordata/datamonitorreporttask/Data_MonitorReportTask.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '监测报告生成器',
                name: 'datamonitorreporttask/Data_MonitorReportTask',
                url: "/Data_MonitorReportTask/",
                sortName: "ID"
            });
            const editFormFields = ref({"Task_Name":"","Group_Id":"","Start_Time":"","End_Time":"","Task_Desc":""});
            const editFormOptions = ref([[{"title":"任务名称","required":true,"field":"Task_Name"},
                               {"dataKey":"groupManager","data":[],"title":"分组id","required":true,"field":"Group_Id","type":"select"}],
                              [{"title":"报告开始时间","required":true,"field":"Start_Time","type":"date"},
                               {"title":"报告结束时间","required":true,"field":"End_Time","type":"date"}],
                              [{"title":"任务描述","field":"Task_Desc","type":"textarea"}]]); 
            const searchFormFields = ref({"Task_Name":""});
            const searchFormOptions = ref([[{"title":"任务名称","field":"Task_Name","type":"like"}]]);
            const columns = ref([{field:'ID',title:'任务id',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Task_Name',title:'任务名称',type:'string',width:120,require:true,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Group_Id',title:'分组id',type:'int',bind:{ key:'groupManager',data:[]},width:110,require:true,align:'left'},
                       {field:'Start_Time',title:'报告开始时间',type:'datetime',width:110,require:true,align:'left',sort:true},
                       {field:'End_Time',title:'报告结束时间',type:'datetime',width:110,require:true,align:'left',sort:true},
                       {field:'Run_Status',title:'执行状态',type:'int',bind:{ key:'executeStatus',data:[]},width:110,readonly:true,require:true,align:'left'},
                       {field:'Report_Url',title:'监测报告',type:'string',width:220,readonly:true,align:'left'},
                       {field:'Task_Desc',title:'任务描述',type:'string',width:220,align:'left'},
                       {field:'ExecuteNum',title:'任务执行码',type:'string',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateDate',title:'创建日期',type:'datetime',width:110,readonly:true,align:'left',sort:true}]);
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
