<template>
    <div id="component-table">
        <div class="title" :style="titleBack">
            <span>摄像头</span>
        </div>
        <el-table :data="tableData" style="width: 100%; background: none" :row-style="tableRowStyle" :border="false"
            height="240px">
            <el-table-column prop="name" label="摄像头名称"> </el-table-column>
            <el-table-column prop="address" label="摄像头地址"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
        </el-table>
    </div>
</template>
  
<script>

import diagonalLine from "@/assets/gis/state/diagonalLine.png";

export default {
    props: ['mgId'],
    watch: {
        mgId() {
            this.pageInit();
        }
    },
    data() {
        return {
            titleBack: {
                background: `url(${diagonalLine}) no-repeat left`,
            },
            tableData: [],
        };
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        tableRowStyle({ row, rowIndex }) {
            let styleJson = {
                color: "#ffffff",
                background: "none",
            };

            return styleJson;
        },
        pageInit() {
            // GisMapCameras({ page: 1, size: 10000, mgId: this.mgId }).then(res => {
            //     this.tableData = res;

            // })
        }
    },
};
</script>
  
<style lang="scss">
@import "./table.scss"
</style>