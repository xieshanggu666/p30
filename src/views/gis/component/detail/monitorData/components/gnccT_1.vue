<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="createGmt" label="时间" width="180px"></el-table-column>
        <el-table-column prop="v1" label="N相对坐标(m)"></el-table-column>
        <el-table-column prop="v2" label="E相对坐标(m)"></el-table-column>
        <el-table-column prop="v3" label="U相对坐标(m)"></el-table-column>
        <el-table-column prop="levelDifference" label="N相差值(m)"></el-table-column>
        <el-table-column prop="v2Difference" label="E相差值(m)"></el-table-column>
        <el-table-column prop="verticalDifference" label="U相差值(m)"></el-table-column>
        <el-table-column prop="horizontal" label="水平合位移差值(m)"></el-table-column>
        <el-table-column prop="threeDimensional" label="三维合位移差值(m)"></el-table-column>
    </el-table>
</template>
<script>
// import { DASpageMonitorData } from "@/api/page/gis/detail"
export default {
    watch: {
        getParam() {
            this.pageInit()
        }
    },
    props: {
        getParam: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            tableData: []
        }
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            DASpageMonitorData(this.getParam).then(res => {
               
                this.tableData = res.pageList;
            })
        }
    }
}
</script>

<style>

</style>