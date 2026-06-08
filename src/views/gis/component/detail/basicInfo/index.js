// import {
//     GetMonNodeList,
//     GetPrAllNum,
//     GisMapCameras,
// } from "@/api/page/gis/detail";

import b1 from "@/assets/gis/detail/b1.png";
import b2 from "@/assets/gis/detail/b2.png";
import b3 from "@/assets/gis/detail/b3.png";
import b4 from "@/assets/gis/detail/b4.png";
import diagonalLine from "@/assets/gis/state/diagonalLine.png";
import common from "@/views/gis/component/detail/mixin/commen"
export default {
    mixins:[common],
    computed: {
        basicInfoDevice() {
            return this.basicInfo.device
                ? this.basicInfo.device.scrapNum
                : 0 < 100
                    ? this.basicInfo.device
                        ? this.basicInfo.device.scrapNum
                        : 0
                    : "99+";
        },
    },
    filters: {
        filterBasicInfo(value) {
            return value < 100 ? value : "99+";
        },
    },
    data() {
        return {
            tableConfig: {
                checkbox: false,
                rows: [
                    {
                        label: "监测点名称",
                        prop: "name",
                    },
                    {
                        label: "监测点类型",
                        prop: "typeName",
                    },
                    {
                        label: "经度",
                        prop: "longitude",
                    },
                    {
                        label: "纬度",
                        prop: "latitude",
                    },
                    {
                        label: "设备状态",
                        type: "equStatus",
                        prop: "status",
                    },
                ],
            },
            infoBoxStyle: {
                b1: {
                    background: `url(${b1}) no-repeat left`,
                },
                b2: {
                    background: `url(${b2}) no-repeat left`,
                },
                b3: {
                    background: `url(${b3}) no-repeat left`,
                },
                b4: {
                    background: `url(${b4}) no-repeat left`,
                },
            },
            titleBack: {
                background: `url(${diagonalLine}) no-repeat left`,
            },
            rowClass: {
                background: "#f0f9eb",
            },
            basicInfo: {
                device: "",
                info: {},
            },
            tableLoading: false,
            tableTemplateData: [],
            searchParams: {
                page: 1,
                size: 15,
            },

        }
    },
    created(){
       this.pageInit();
    },
    methods: {
        pageInit() {
            this.searchParams.mgId = this.GisCurrentGroup.id;
            this.startSearch();
            this.getGroupDetailInfo();
            this.getCameraList();
        },
        tableRowClassName({ row, rowIndex }) {
            if ((rowIndex + 1) % 2 === 0) {
                return "success-row";
            }
            return "";
        },
        //监测组下各个数据
        getGroupDetailInfo() {
            // GetPrAllNum({ mgId: this.GisCurrentGroup.id }).then((res) => {
            //     this.basicInfo = res;
            // });
        },
        // 监测点列表
        startSearch() {
            this.tableLoading = true;
            GetMonNodeList(this.searchParams).then((res) => {
                this.pagination.total = res.total;
                this.tableLoading = false;
                this.tableTemplateData = res.pageList;
            });
        },
        //摄像头列表
        getCameraList() {
            this.tableLoading2 = true;
        },
    },
}