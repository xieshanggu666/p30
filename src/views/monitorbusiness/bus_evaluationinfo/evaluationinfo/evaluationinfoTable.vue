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
    import extend from "@/extension/monitorbusiness/bus_evaluationinfo/bus_evaluationinfo.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '分组评估信息',
                name: 'bus_evaluationinfo/bus_evaluationinfo',
                url: "/bus_evaluationinfo/",
                sortName: "ID"
            });
            const editFormFields = ref({});
            const editFormOptions = ref([]);
            const searchFormFields = ref({"Wtime":""});
            const searchFormOptions = ref([[{"title":"评估时间","field":"Wtime","type":"datetime"}]]);
            const columns = ref([{field:'ID',title:'ID主键',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Stime',title:'开始时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Etime',title:'结束时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Wtime',title:'评估时间',type:'datetime',width:110,align:'left',sort:true},
                       {field:'Level',title:'危险级别',type:'int',width:110,align:'left'},
                       {field:'Conclusion',title:'评估结论',type:'string',width:220,align:'left'},
                       {field:'Process',title:'评估过程',type:'string',width:220,hidden:true,align:'left'}]);
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
