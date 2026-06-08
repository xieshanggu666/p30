<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/monabnormalinput/Mon_Abnormal_Input.js此处编写
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
    import extend from "@/extension/monitorbusiness/monabnormalinput/Mon_Abnormal_Input.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '监测异常录入',
                name: 'monabnormalinput/Mon_Abnormal_Input',
                url: "/Mon_Abnormal_Input/",
                sortName: "ID"
            });
            const editFormFields = ref({"Title":"","Group_Id":"","Start_Time":"","End_Time":"","Reason":"","Acc_Num":""});
            const editFormOptions = ref([[{"title":"标题","required":true,"field":"Title"},
                               {"dataKey":"groupManager","data":[],"title":"分组id","required":true,"field":"Group_Id","type":"number"}],
                              [{"title":"异常起始时间","required":true,"field":"Start_Time","type":"datetime"},
                               {"title":"异常结束时间","field":"End_Time","type":"datetime"}],
                              [{"title":"异常原因","required":true,"field":"Reason","type":"textarea"}],
                              [{"title":"附件","field":"Acc_Num","type":"file"}]]);
            const searchFormFields = ref({"Title":"","Group_Id":"","Start_Time":"","End_Time":""});
            const searchFormOptions = ref([[{"title":"标题","field":"Title","type":"like"},{"dataKey":"groupManager","data":[],"title":"分组id","field":"Group_Id","type":"number"}],[{"title":"异常起始时间","field":"Start_Time","type":"datetime"},{"title":"异常结束时间","field":"End_Time","type":"datetime"}]]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'标题',type:'string',width:110,require:true,align:'left',sort:true},
                       {field:'Group_Id',title:'分组id',type:'int',bind:{ key:'groupManager',data:[]},width:110,require:true,align:'left'},
                       {field:'Start_Time',title:'异常起始时间',type:'datetime',width:110,require:true,align:'left',sort:true},
                       {field:'End_Time',title:'异常结束时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Reason',title:'异常原因',type:'string',width:110,require:true,align:'left'},
                       {field:'Acc_Num',title:'附件',type:'string',width:130,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
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
