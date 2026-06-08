<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/alarm/alaoperationinfo/Ala_Operationinfo.js此处编写
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
    import extend from "@/extension/alarm/alaoperationinfo/Ala_Operationinfo.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '设备运行预警信息',
                name: 'alaoperationinfo/Ala_Operationinfo',
                url: "/Ala_Operationinfo/",
                sortName: "ID"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({"Deal_State":"","Title":""});
            const searchFormOptions = ref([
                [{"dataKey":"dealState","data":[],"title":"处理状态","field":"Deal_State","type":"select"},{"title":"预警标题","field":"Title"},{"title":"设备ID","field":"Dev_Id"}],[{"title":"预警时间","field":"CreateDate","type":"datetime"}]
            ]);
            const columns = ref([{field:'Level',title:'预警级别',type:'int',width:50,align:'left',sort:true},
                       {field:'CreateDate',title:'预警时间',type:'datetime',sort:true,width:120,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'标题',type:'string',width:180,align:'left',showOverflowTooltip:true},
                       {field:'Content',title:'内容',type:'string',width:220,align:'left',showOverflowTooltip:true},
                       {field:'Dev_Id',title:'设备ID',type:'string',width:110,align:'left'},
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
                            width: 80,
                            align: "left",
                            sort: true,
                        },
                       {field:'Deal_Time',title:'处理时间',type:'datetime',sort:true,width:100,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'Deal_Person',title:'处理人',type:'string',width:80,align:'left'},
                       {field:'Deal_Comment',title:'处理备注',type:'string',width:220,align:'left',showOverflowTooltip:true},
                       {field:'Groud_Id',title:'分组ID',type:'string',width:110,hidden:true,align:'left'},
                       {field:'Status',title:'状态',type:'int',width:110,align:'left',hidden:true},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,align:'left',sort:true},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'left'},
                       {field:'ModiRemark',title:'修改备注',type:'string',width:110,hidden:true,align:'left'},
                    ]);
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
