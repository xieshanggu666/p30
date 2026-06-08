<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/deduce/deducelayer/Deduce_Layer.js此处编写
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
    import extend from "@/extension/deduce/deducelayer/Deduce_Layer.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '推演图层管理',
                name: 'deducelayer/Deduce_Layer',
                url: "/Deduce_Layer/",
                sortName: "ID"
            });
            const editFormFields = ref({"Layer_Name":"","Layer_Type":"","Layer_Res":"","Layer_Order":"","Description":"","Layer_Comment":""});
            const editFormOptions = ref([[{"title":"图层名称","required":true,"field":"Layer_Name"},
                               {"dataKey":"layerType","data":[],"title":"图层类型","required":true,"field":"Layer_Type","type":"select"}],
                              [{"title":"图层资源","required":true,"field":"Layer_Res"},
                               {"title":"排序","required":true,"field":"Layer_Order","type":"number"}],
                              [{"title":"图层描述","field":"Description","colSize":12,"type":"textarea"}],
                              [{"title":"备注","field":"Layer_Comment","colSize":12,"type":"textarea"}]]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Layer_Name',title:'图层名称',type:'string',width:110,require:true,align:'left',sort:true},
                       {field:'Layer_Type',title:'图层类型',type:'string',bind:{ key:'layerType',data:[]},width:110,require:true,align:'left'},
                       {field:'Description',title:'图层描述',type:'string',width:220,align:'left'},
                       {field:'Role_Id',title:'所属角色',type:'int',width:110,hidden:true,readonly:true,align:'left'},
                       {field:'Layer_Res',title:'图层资源',type:'string',width:110,require:true,align:'left'},
                       {field:'Layer_Order',title:'排序',type:'int',sort:true,width:110,require:true,align:'left'},
                       {field:'Layer_Comment',title:'备注',type:'string',width:220,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,hidden:true,readonly:true,align:'left'},
                       {field:'CreateDate',title:'创建日期',type:'datetime',width:110,hidden:true,readonly:true,align:'left',sort:true},
                       {field:'ModifyID',title:'修改人id',type:'int',width:80,hidden:true,readonly:true,align:'left'},
                       {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,readonly:true,align:'left'},
                       {field:'ModifyDate',title:'修改时间',type:'datetime',width:110,hidden:true,readonly:true,align:'left',sort:true}]);
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
