<!--
*Author：jxx
 *Contact：283591387@qq.com
 *代码由框架生成,任何更改都可能导致被代码生成器覆盖
 *业务请在@/extension/system/syspersonalsetting/Sys_Personal_Setting.js此处编写
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
    import extend from "@/extension/system/syspersonalsetting/Sys_Personal_Setting.js";
    import { ref, defineComponent } from "vue";
    export default defineComponent({
        setup() {
            const table = ref({
                key: 'ID',
                footer: "Foots",
                cnName: '我的设置',
                name: 'syspersonalsetting/Sys_Personal_Setting',
                url: "/Sys_Personal_Setting/",
                sortName: "ID"
            });
            const editFormFields = ref({"GIS_Config":"","Default_Home":"","Default_RoleId":"","Alarm_Mode":[],"Concern_Project":"","Report_Mode":[]});
            const editFormOptions = ref([[{"title":"地图视角配置","field":"GIS_Config"}],
                              [{"dataKey":"loginPage","data":[],"title":"默认登录主页","field":"Default_Home","type":"select"}],
                              [{"dataKey":"t_roles","data":[],"title":"默认分组角色","field":"Default_RoleId","type":"select"}],
                              [{"dataKey":"alarmType","data":[],"title":"预警提醒方式","field":"Alarm_Mode","type":"selectList"}],
                              [{"dataKey":"projectManager","data":[],"title":"关注项目","field":"Concern_Project","type":"select"}],
                              [{"dataKey":"reportType","data":[],"title":"简报发送方式","field":"Report_Mode","type":"selectList"}]]);
            const searchFormFields = ref({});
            const searchFormOptions = ref([]);
            const columns = ref([{field:'ID',title:'ID',type:'int',width:110,hidden:true,readonly:true,require:true,align:'left'},
                       {field:'GIS_Config',title:'地图视角配置',type:'string',width:220,align:'left',sort:true},
                       {field:'Default_Home',title:'默认登录主页',type:'string',bind:{ key:'loginPage',data:[]},width:110,align:'left'},
                       {field:'Default_RoleId',title:'默认分组角色',type:'int',bind:{ key:'t_roles',data:[]},width:110,align:'left'},
                       {field:'Alarm_Mode',title:'预警提醒方式',type:'string',bind:{ key:'alarmType',data:[]},width:110,align:'left'},
                       {field:'Concern_Project',title:'关注项目',type:'string',bind:{ key:'projectManager',data:[]},width:110,align:'left'},
                       {field:'Report_Mode',title:'简报发送方式',type:'string',bind:{ key:'reportType',data:[]},width:110,align:'left'},
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
