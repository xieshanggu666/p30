<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitordata/datasimplereport/Data_Simple_Report.js此处编写
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
    import extend from "@/extension/monitordata/datasimplereport/Data_Simple_Report.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '监测简报',
                name: 'datasimplereport/Data_Simple_Report',
                url: "/Data_Simple_Report/",
                sortName: "ID"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({"Title":""});
            const searchFormOptions = ref([[{"title":"简报标题","field":"Title","type":"like"}]]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Group_Id',title:'简报项目分组',type:'int',bind:{ key:'groupManager',data:[]},width:110,require:true,align:'left',sort:true},
                       {field:'Title',title:'简报标题',type:'string',width:110,require:true,align:'left',showOverflowTooltip:true},
                       {field:'Content',title:'简报内容',type:'string',hidden:true,width:220,require:true,align:'left',showOverflowTooltip:true},
                       {field:'Report_Type',title:'简报类型',type:'string',width:110,align:'left'},
                       {field:'Url',title:'资源地址',type:'string',width:180,hidden:true,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateDate',title:'创建日期',type:'datetime',width:110,align:'left',sort:true}]);
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
