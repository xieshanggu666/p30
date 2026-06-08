<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/monitorbusiness/bus_expertevaluation/bus_expertevaluation.js此处编写
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
    import extend from "@/extension/monitorbusiness/bus_expertevaluation/bus_expertevaluation.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '专家评估管理', 
                name: 'bus_expertevaluation/bus_expertevaluation',
                url: "/bus_expertevaluation/",
                sortName: "ID"
            });
            const editFormFields = ref({"GroupID":"","Level":"","Stime":"","Etime":"","Wtime":"","MavenName":"","MethodName":"","Conclusion":""});
            const editFormOptions = ref([
                [{"dataKey":"groupManager","data":[],"title":"所属分组","required":true,"field":"GroupID","type":"select"},
                               {"title":"危险级别","field":"Level","type":"number"}],
                              [{"title":"开始时间","field":"Stime","type":"datetime"},
                               {"title":"结束时间","field":"Etime","type":"datetime"}],
                              [{"title":"评估时间","field":"Wtime","type":"datetime"},
                               {"dataKey":"PGZJ","data":[],"title":"评估专家","field":"MavenName","type":"select"}],
                              [{"title":"评估方法","field":"MethodName"},
                               {"title":"评估结论","field":"Conclusion","type":"textarea"}]]);
            const searchFormFields = ref({"GroupID":"","Wtime":""});
            const searchFormOptions = ref([[
            //     {"dataKey":"groupManager","data":[],
            // "title":"所属分组","field":"GroupID","type":"select"
            // },
            {"title":"评估时间","field":"Wtime","type":"datetime"}]]);
            const columns = ref([{field:'ID',title:'ID主键',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                    //    {field:'GroupID',title:'所属分组',type:'string',bind:{ key:'groupManager',data:[]},width:110,require:true,align:'left',sort:true},
                       {field:'Stime',title:'开始时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Etime',title:'结束时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Wtime',title:'评估时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'MavenName',title:'评估专家',type:'string',bind:{ key:'PGZJ',data:[]},width:110,align:'left'},
                       {field:'MethodName',title:'评估方法',type:'string',width:120,align:'left'},
                       {field:'Level',title:'危险级别',type:'int',width:110,align:'left'},
                       {field:'Conclusion',title:'评估结论',type:'string',width:220,align:'left'}]);
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
