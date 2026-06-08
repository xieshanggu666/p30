<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/system/sysentmanager/Sys_Ent_Manager.js此处编写
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
    import extend from "@/extension/system/sysentmanager/Sys_Ent_Manager.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '机构管理',
                name: 'sysentmanager/Sys_Ent_Manager',
                url: "/Sys_Ent_Manager/",
                sortName: "ID"
            });
            const editFormFields = ref({"Ent_Name":"","Ent_Num":"","Parent_ID":[],"Director":"","Address":"","Phone":"","Description":"","Acc_Num":""});
            const editFormOptions = ref([[{"title":"机构名称","required":true,"field":"Ent_Name"},
                               {"title":"机构编号","required":true,"field":"Ent_Num"}],
                              [{"dataKey":"entManager","data":[],"title":"上级机构","field":"Parent_ID","type":"cascader"},
                               {"title":"负责人","field":"Director"}],
                              [{"title":"联系电话","field":"Phone"},
                               {"title":"地址","field":"Address"}],
                              [{"title":"说明","field":"Description"},
                               {"title":"附件","field":"Acc_Num"}]]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Ent_Name',title:'机构名称',type:'string',width:110,require:true,align:'left',sort:true},
                       {field:'Ent_Num',title:'机构编号',type:'string',width:110,require:true,align:'left'},
                       {field:'Parent_ID',title:'上级机构',type:'int',bind:{ key:'entManager',data:[]},width:110,align:'left'},
                       {field:'Description',title:'说明',type:'string',width:220,align:'left'},
                       {field:'Address',title:'地址',type:'string',width:220,align:'left'},
                       {field:'Phone',title:'联系电话',type:'string',width:110,align:'left'},
                       {field:'Director',title:'负责人',type:'string',width:110,align:'left'},
                       {field:'Acc_Num',title:'附件',type:'string',width:220,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'},
                       {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
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
