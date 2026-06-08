<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/system/sysmynotice/Sys_My_Notice.js此处编写
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
    import extend from "@/extension/system/sysmynotice/Sys_My_Notice.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '我的通知',
                name: 'sysmynotice/Sys_My_Notice',
                url: "/Sys_My_Notice/",
                sortName: "ID"
            });
            const editFormFields = ref({"Title":"","Notice_Type":"","Content":"","Icon":""});
            const editFormOptions = ref([[{"title":"标题","required":true,"field":"Title"},
                               {"title":"类型","field":"Notice_Type"}],
                              [{"title":"内容","required":true,"field":"Content","type":"textarea"}],
                              [{"title":"图标","field":"Icon","type":"img"}]]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'Title',title:'标题',type:'string',width:110,require:true,align:'left',sort:true},
                       {field:'Content',title:'内容',type:'string',width:220,require:true,align:'left'},
                       {field:'Notice_Type',title:'类型',type:'string',width:110,align:'left'},
                       {field:'Icon',title:'图标',type:'string',width:110,align:'left'},
                       {field:'User_Id',title:'用户ID',type:'int',width:110,align:'left'},
                       {field:'Url',title:'资源链接地址',type:'string',width:180,align:'left'},
                       {field:'Status',title:'数据状态',type:'int',width:110,hidden:true,require:true,align:'left'},
                       {field:'CreateID',title:'创建人id',type:'int',width:80,hidden:true,align:'left'}]);
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
