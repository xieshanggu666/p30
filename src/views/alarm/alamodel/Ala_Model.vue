<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/alarm/alamodel/Ala_Model.js此处编写
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
    import extend from "@/extension/alarm/alamodel/Ala_Model.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '预警模型管理',
                name: 'alamodel/Ala_Model',
                url: "/Ala_Model/",
                sortName: "ID"
            });
            const editFormFields = ref({"Model_Name":"","Model_Num":"","Comment":"","Acc_Num":""});
            const editFormOptions = ref([[{"title":"模型名称","required":true,"field":"Model_Name"},
                               {"title":"模型编号","required":true,"field":"Model_Num"}],
                              [{"title":"模型说明","required":true,"field":"Comment","type":"textarea"}],
                              [{"title":"模型附件","field":"Acc_Num","type":"file"}]]);
            const searchFormFields = ref({"Model_Name":""});
            const searchFormOptions = ref([[{"title":"模型名称","field":"Model_Name","type":"like"}]]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Model_Name',title:'模型名称',type:'string',width:110,require:true,align:'left',sort:true},
                       {field:'Model_Num',title:'模型编号',type:'string',width:110,require:true,align:'left'},
                       {field:'Comment',title:'模型说明',type:'string',width:220,require:true,align:'left'},
                       {field:'Acc_Num',title:'模型附件',type:'string',width:220,align:'left',},
                       {field:'Status',title:'数据状态',type:'int',width:110,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
                       {field:'CreateDate',title:'创建日期',type:'datetime',width:110,align:'left',sort:true,showOverflowTooltip:true},
                       {field:'ModifyID',title:'修改人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,align:'left',sort:true,showOverflowTooltip:true}]);
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
