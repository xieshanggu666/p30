<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/alarm/alainfomation/Ala_Infomation.js此处编写
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
    import extend from "@/extension/alarm/alainfomation/Ala_Infomation.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '预警信息管理',
                name: 'alainfomation/Ala_Infomation',
                url: "/Ala_Infomation/",
                sortName: "ID"
            });
            const editFormFields = ref({"Title":"","Content":"","Group_Id":"","Dev_Id":"","Point_Num":"","Type_Id":"","Level":"","CreateDate":""});
            const editFormOptions = ref([[{"title":"预警标题","required":true,"field":"Title","disabled":true},
                               {"title":"预警内容","required":true,"field":"Content","disabled":true},
                               {"dataKey":"groupManager","data":[],"title":"预警分组","required":true,"field":"Group_Id","disabled":true,"type":"number"}],
                              [{"title":"预警设备","required":true,"field":"Dev_Id","disabled":true},
                               {"title":"预警点位","required":true,"field":"Point_Num","disabled":true}],
                              [{"dataKey":"alarmInfoType","data":[],"title":"预警类型","required":true,"field":"Type_Id","disabled":true,"type":"number"},
                               {"dataKey":"alarmLevel","data":[],"title":"预警等级","required":true,"field":"Level","disabled":true,"type":"number"}],
                              [{"title":"预警时间","field":"CreateDate","disabled":true}]]);
            const searchFormFields = ref({"Title":"","Group_Id":"","Dev_Id":"","Point_Num":"","CreateDate":[null,null],"Deal_State":''});
            const searchFormOptions = ref([[{"title":"预警标题","field":"Title"},{"dataKey":"groupManager","data":[],"title":"预警分组","field":"Group_Id","type":"select"}],[{"title":"预警设备","field":"Dev_Id"},{"title":"预警点位","field":"Point_Num"}],[{"title":"预警时间","field":"CreateDate","type":"datetime"},{"dataKey":"dealState","data":[],"title":"处理状态","field":"Deal_State","type":"select"}],]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'预警标题',type:'string',width:300,readonly:true,require:true,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Content',title:'预警内容',type:'string',width:200,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                       {field:'Group_Id',title:'预警分组',type:'int',bind:{ key:'groupManager',data:[]},width:110,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                       {field:'Dev_Id',title:'预警设备',type:'string',width:110,readonly:true,require:true,hidden:true,align:'left'},
                       {field:'Point_Num',title:'预警点位',type:'string',width:110,readonly:true,require:true,align:'left',showOverflowTooltip:true},
                       {field:'Type_Id',title:'预警类型',type:'int',bind:{ key:'alarmInfoType',data:[]},width:110,readonly:true,require:true,align:'left'},
                       {field:'Level',title:'预警等级',type:'int',bind:{ key:'alarmLevel',data:[]},width:110,readonly:true,require:true,align:'left'},
                       {field:'Code',title:'预警编码',type:'string',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'CreateDate',title:'预警时间',type:'datetime',width:100,readonly:true,align:'left',sort:true,showOverflowTooltip:true},
                       {
                            field: "Deal_State",
                            title: "处理状态",
                            type: "int",
                            bind: {
                            key: "audit",
                            data: [
                                { key: -1, value: "忽略" },
                                { key: 0, value: "未处理" },
                                { key: 1, value: "已处理" },
                            ],
                            },
                            width: 100,
                            align: "left",
                            sort: true,
                        },
                       {field:'Deal_Time',title:'处理时间',type:'datetime',sort:true,width:100,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Deal_Person',title:'处理人',type:'string',width:80,align:'left',showOverflowTooltip:true},
                       {field:'Deal_Comment',title:'处理备注',type:'string',width:220,align:'left',showOverflowTooltip:true},


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
