<template>
    <div id="left-device">
        <div class="item-box" v-if="deviceList.length != 0">
            <div @click="chooseTab(item)" :class="item.deviceId == choosedItem.deviceId ? 'item item-active' : 'item'"
                v-for="(item, index) in deviceList" :key="index">
                <div class="background-img">
                    <!-- <img :src="require(`@/assets/gis/gis-entity/${item.type}-on.png`)" alt=""> -->
                </div>
                <span>{{ item.deviceNo }}</span>
                <span>{{ item.monName }}</span>
            </div>
        </div>
        <div v-else class="null_data">
            <div class="item"></div>
        </div>
    </div>
</template>

<script>
import common from "@/views/gis/component/detail/mixin/commen";
// import { GisMapGroupDevice } from "@/api/page/gis/detail";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            searchParams: {
                name: "",
                mgId: this.gropId
            },
            choosedItem: {},
            deviceList: [],
        }
    },
    computed: {
        ...mapGetters(["userName"]),
    },
    mixins: [common],
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            GisMapGroupDevice({ mgId: this.GisCurrentGroup.id }).then(res => {
                this.deviceList = res;
                this.chooseTab(res[0]);
                if (this.userName == "罗苑元") {
                    this.testInfo()
                }

            })


        },
        chooseTab(item) {
            this.choosedItem = item;
            this.$emit('choosedTab', item)
        },
        testInfo() {
            const water = {
                "deviceId": "223",
                "deviceNo": "GN2022210077",
                "productType": "ZWSZJC-1",
                "type": 99,
                "monName": "TPWJS03",
                "monId": "1373843382111047682",
                "status": 0,
                "isPush": "1"
            }
            this.deviceList.push(water);
        }
    }

}
</script>

<style lang="scss" scoped>
#left-device {
    width: 300px;
    padding: 15px 15px 15px 0;
    display: flex;
    flex-direction: column;
    background: #0C2751;

    span {
        font-size: 12px;
    }

    .input-search {
        padding-left: 15px;

        .el-input-group__append {
            padding: 0;
            width: 30px;
            height: 30px;
            text-align: center;
            color: #FFFFFF;
            background: #2A60CE;
            border: 1px solid #2A60CE;
            border-radius: 0;
        }

        .el-input__inner {
            border-radius: 0;
            background-color: #0C2751;
            border: 1px solid #2E4975;
            color: #FFFFFF;

            &::placeholder {
                color: rgba(139, 171, 236, 0.5);
                font-size: 12px;
            }
        }
    }

    .el-input {
        margin-bottom: 10px;
        width: 100%;
    }

    .item-box {
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        overflow-y: auto;

        .item {
            // box-sizing: border-box;
            // padding: 0 4px;
            cursor: pointer;
            text-align: center;
            margin-left: 3px;
            margin-top: 3px;
            width: 32%;
            height: 134px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            overflow: hidden;
            white-space: nowrap;
            background: #11305F;
            .background-img {
                height: 81px;
                line-height: 81px;
                margin-bottom: 5px;
            }

            &:hover {
                //background: rgba(152, 181, 255, 0.27);
            }

            img {
                width: 42px;
                vertical-align: middle;
            }

            span {
                display: -webkit-box;
                width: 100%;
                padding: 0 5px;
                box-sizing: border-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                // &:nth-child(2n) {
                //     height: 40px;
                // }
            }
        }

        .item-active {
            background: rgba(152, 181, 255, 0.27);
        }
    }
}
</style>