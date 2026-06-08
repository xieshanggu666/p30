<template>
    <div class="SearchBox">
        <div class="titleBox">
            <el-icon color="#999"><Search /></el-icon>
            <input  autocomplete="off" placeholder="请输入关键字" id="SearchData" type="text" v-model="STATE.SEARCH_DATA"
                @focus="openPanel" @blur="closePanel" @keydown.enter="SearchGroup">
                <div @click="close" class="closed" >{{STATE.showStart?'展开':'收起'}} </div>
            <!-- <Search v-if="STATE.SEARCH_DATA.length < 1" style="cursor: pointer;width: 1.5em; height: 1.5em; color: #3356e9;" />
            <Close v-else style="width: 1.5em; height: 1.5em; color: #3356e9;" @click="SearchClose" /> -->
            <el-button @click="SearchGroup" class="pos_dw" type="primary">查询</el-button>
        </div>
        <!-- <div style="height: 8px;"></div> -->
        <Transition>
            <ul class="PanelBox" :class="{ PanelBoxFlagStlyle: STATE.groupList.length > 1 }" v-if="PANEL_FLAG" >
               <!-- @mouseleave="STATE.FLAG.panel = false;" -->
                <!-- <ul class="PanelBox" :class="{PanelBoxFlagStlyle:STATE.groupList.length > 1}"> -->
                <div v-if="STATE.groupList.length > 0">
                    <div v-if="STATE.groupList.length >= 1">
                        <li class="posLi" v-for="(group, index) of STATE.groupList " :key="index" @mouseenter="() => liMouseEnter(group)"
                            @mouseleave="() => liMouseLeave(group)">
                            <el-icon class="gaibico"
                                v-if="group.collectioned" @click="canncelConnectioned(group)">
                                <StarFilled style="width: 1.5em; height: 1.5em; color: #feb71f;" />
                            </el-icon>

                            <el-icon style="margin-bottom: 4px; margin-left: 5px;margin-top: 2px;font-size: 18px;" v-else
                                @click="DoConnectioned(group)">
                                <Star style="width: 1.5em; height: 1.5em; color: #feb71f;" />
                            </el-icon>

                            <span> {{ group.group_Name }}</span>
                            <Transition>
                                <div class="liBox liBoxSame buisi" :class="`item-${index + 1}`"   v-if="group.showFlag">
                                    <!-- <div class="liBox liBoxSame" :class="`item-${index + 1}`">   -->
                                    <div class="li-item-1" >
                                        <div class="item-text"  @click="ClickGroup(group)">
                                            {{ group.group_Name }}
                                        </div>
                                  
                                        <div></div>
                                        <div class="dinsw" @click="ClickGroup(group)">
                                            <!-- <MapLocation style="width: 1em; height: 1em; margin-right: 8px"
                                                /> -->
                                                <img src="@/assets/gis/switch-box/dinsb.png"/>
                                             定位
                                            <!-- <Memo style="width: 1em; height: 1em; margin-right: 8px" /> -->
                                        </div>
                                    </div>
                                    <!-- <div class="li-item-last">
                                        <div class="golast" style="margin-right:40px"  v-if="group.covering_Config!='1'"  @click="myLayerNow(group.covering_Config,group.showFlag,group.id,group.group_Name)">
                                        <Search style="width: 1em; height: 1em; margin-top: -2px"></Search>
                                        <span style="font-size:14px">查看图层</span>
                                        </div>
                                        <div class="golast" v-if="group.id==63||group.id==64||group.id==65||group.id==66||group.id==67||group.id==68"  @click="goPdfUrl(group)" >
                                        <Search style="width: 1em; height: 1em; margin-top: -2px"></Search>
                                         <span>查看收方图</span>
                                        </div>
                                    </div> -->
                                    
                                    <div class="li-item-2">
                                        <div class="hei115">
                                            <el-image v-if="!group.acc_Num"
                                                :src="require('@/assets/404_images/null_img.png')"
                                                style="width: 160px;height: 115px;"></el-image>

                                            <el-image v-else ref="preview" :src="'http://smp.cnzwjl.com:9991//' + group.acc_Num" :preview-src-list="['http://smp.cnzwjl.com:9991//' + group.acc_Num]" 
                                                style="width: 160px;height: 115px;"></el-image>
                                        </div>
                                        <div class="niz_dao">
                                            <div class="uptop"> {{ group.group_Comment == null ? "暂无信息" : group.group_Comment }}</div>
                                            <div class="isdow">监测点位：{{group.pointCount}}个<img src="@/assets/gis/switch-box/dinsa.png"/> </div>
                                        </div>

                                    </div>
                                    <div class="li-item-4">
                                        <div class="box-li wrap" v-for="(li, index) of STATE.detailBoxConfig" :key="index" @click="GroupInfo(group,li)">
                                            <img class="img-icon" :src="li.imgUrl" alt="404"
                                                style="width: 16px;height: 16px;" />
                                            <div class="nomore"><span>{{ li.title }}</span></div>
                                            <div v-if="groupItemValue(group, li.title) > 0" class="ribbon"><span>{{
                                                groupItemValue(group, li.title)
                                            }}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </li>
                    </div>
                    <div v-else>
                        <Transition>
                            <div class="liBox liBoxSame" v-if="STATE.groupList[0].showFlag">
                                <div class="li-item-1">
                                    <div class="item-text">
                                        {{ STATE.groupList[0].group_Name }}
                                    </div>
                                    <div>
                                        <MapLocation style="width: 1em; height: 1em; margin-right: 8px"
                                            @click="ActionMapLocation" />
                                        <Memo style="width: 1em; height: 1em; margin-right: 8px" />
                                    </div>
                                </div>
                                <div class="li-item-2">
                                    <div>
                                        <el-image v-if="!STATE.groupList[0].Acc_Num"
                                            :src="require('@/assets/404_images/null_img.png')"
                                            style="width: 160px;height: 115px;"></el-image>

                                        <el-image v-else :src="'http://smp.cnzwjl.com:9991//' + STATE.groupList[0].Acc_Num"
                                            style="width: 160px;height: 115px;"></el-image>
                                    </div>
                                    <div style="padding:6px">
                                        {{ STATE.groupList[0].Group_Comment == null ? "暂无信息" :
                                            STATE.groupList[0].Group_Comment }}
                                    </div>

                                </div>
                                <div class="li-item-4">
                                    <div class="box-li wrap" v-for="(li, index) of STATE.detailBoxConfig" :key="index" @click="GroupInfo(group,li)">
                                        <img class="img-icon" :src="li.imgUrl" alt="404"
                                            style="width: 16px;height: 16px;" />
                                        <div><span color="#fff" style="color:white;">{{ li.title }}</span></div>
                                        <div v-if="li.value > 0" class="ribbon"><span>{{ groupItemValue(STATE.groupList[0], li.title)
                                        }}</span></div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
                <div v-if="STATE.groupList.length == 0">
                    <el-empty description="没有对应的监测组" />
                </div>
            </ul>
        </Transition>

        <VolBox
            :lazy="true"
            v-model="STATE.model"
            :title="STATE.title"
            :height="800"
            :width="1400"
            :padding="5"
            :onModelClose="onModelClose"
        >
            <infomation v-if="STATE.groupType==2" :groupInfo="STATE.groupInfo" ></infomation>
            <portals v-if="STATE.groupType==3" :groupInfo="STATE.groupInfo" ></portals>
            <onlineRate v-if="STATE.groupType==4" :groupInfo="STATE.groupInfo" ></onlineRate>
            <template #footer>
                <div>
                    <el-button type="default" size="small" @click="STATE.model = false" >取消</el-button >
                </div>
            </template>
            
        </VolBox>

        

    </div>
</template>
<script setup>
import { reactive, computed,ref } from 'vue'
import VolBox from '@/components/basic/VolBox.vue';
import infomation from './component/infomation.vue';
import portals from './component/portals.vue';
import onlineRate from './component/onlineRate.vue';
import { Search, Star, StarFilled, Close, MapLocation, Memo } from '@element-plus/icons-vue'
import http from "@/api/http"
import _ from "lodash";
import imgGisPoint from "@/assets/gis/switch-box/baojs.png";
import imgGisWarning from "@/assets/gis/switch-box/seduo.png";
import imgGisPatrol from "@/assets/gis/switch-box/jib.png";
import imgGisOnline from "@/assets/gis/switch-box/catr.png";
const emit = defineEmits(['local-group'])

const groupItemValue = computed(() => (group, type) => {
    let result;
    switch (type) {
        case "监测点位":
            result = group.pointCount
            break;
        case "监测预警":
            result = group.alarmCount
            break;
        case "多元分析":
            result = ""
            // result = group.alarmCount
            break;
        case "监测简报":
            result = group.pointCount
            break;
    }
    return result;
 
 })
const preview = ref(null);


const STATE = reactive({
    showStart:true,
    imageList: [],  // 预览图片
    title:'',
    groupType:'',
    groupInfo:'',
    model: false,
    PANEL_FLAG: false,
    FLAG: {
        search: false,
        panel: false
    },
    SEARCH_DATA: "",
    groupList: [],
    detailBoxConfig: {
        nodes: {
            title: "监测点位",
            imgUrl: imgGisPoint,
            value: 30,
        },
        warnings: {
            title: "监测预警",
            imgUrl: imgGisWarning,
            value: 0,
        },
        portals: {
            title: "多元分析",
            imgUrl: imgGisPatrol,
            value: 0,
        },
        onlineRate: {
            title: "监测简报",
            imgUrl: imgGisOnline,
            value: 0,
        },
    },
    currentGroup: {
        group: null,
        rows: null
    }
})
const PANEL_FLAG = computed(() => {
    if (!STATE.FLAG.search && !STATE.FLAG.panel) {
        return false;
    } else {
        return true;
    }
})

function GroupInfo(group,li){
    STATE.title=li.title
    switch (li.title) {
        case "监测点位":
            ClickGroup(group);
            break;
        case "监测预警":
            STATE.model = true;
            STATE.groupType = 2;
            STATE.groupInfo = group;
            break;    
        case "多元分析":
            STATE.model = true;
            STATE.groupType = 3;
            STATE.groupInfo = group;
            break;
        case "监测简报":
            STATE.model = true;
            STATE.groupType = 4;
            STATE.groupInfo = group;
            break;
        default:
            break;
    }
}

function goPdfUrl(e){
    var iWidth = 500;
    var iHeight = 400;
    var iTop = (window.screen.height - 30 - iHeight) / 2;
    var iLeft = window.screen.width;
    
    switch(e.id){
        case 63:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/32/Ctd6BWOHI7GADSWrAAumGGag0hw756.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');
          break;
        case 64:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/32/Ctd6BWOHI8KAaTF6AAr90W-fc-Q096.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');
          break;
        case 65:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/33/Ctd6B2OHI9GARj3-ABBbpxSbHSg907.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');

          break;
        case 66:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/32/Ctd6BWOHI-OAY_RcAAc8fCbkcjk938.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');

          break;
        case 67:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/32/Ctd6BWOHA4eAL6g1AA24yjuF0TE047.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');
          break;
        case 68:
          var pdfurl="https://xl.oss.honggv.cn:19101/group1/M00/00/33/Ctd6B2OHA5SAXp9SAAonZlIfo5Q567.pdf";
          window.open(pdfurl, '_blank','height='+iHeight+',width='+iWidth+',left='+iLeft+',top='+iTop+'');
          break;
          default:
           this.$message.error('暂无收方图！')
          break;  
      }
}
function handlePreview() {
    //   this.$refs.preview.clickHandler();
    //    preview.value.clickHandler();
    }

function ClickGroup(group) {
//    console.log('坐标位',group.lat,group.long);
   // STATE.SEARCH_DATA = group.group_Name;
   // InitData(1);
   emit("local-group", group, group,"point_ajax");
    // http.post('/api/Mon_Point_Manager/getPageData', { order: "asc", page: 1, rows: 30, sort: "ID", value: 1, wheres: JSON.stringify([{ name: "Group_Id", value: group.id }]) }).then((data) => {
    //     STATE.currentGroup.group = group;
    //     STATE.currentGroup.rows = data.rows;
    //     emit("local-group", group, data.rows);
    // });
    setTimeout(() => {
        STATE.PANEL_FLAG = true;
    }, 500);
}

function myLayerNow(e, type, ID, Layer_Name) {
//   console.log("e?????????????",e);
  emit("emitMyLayerNow2", e, type, ID, Layer_Name);
}

function ActionMapLocation() {
    emit("local-group", STATE.currentGroup.group, STATE.currentGroup.rows);
    STATE.PANEL_FLAG = true;
}

function openPanel() {
    InitData(1);
    STATE.FLAG.search = true;
    STATE.FLAG.panel = true;
}

function closePanel() {
    InitData(1);
    STATE.FLAG.search = true;
    STATE.FLAG.panel = true;
}
function close() {
    STATE.showStart=STATE.showStart?false:true;
    if(STATE.showStart){
        STATE.FLAG.search = false;
        STATE.FLAG.panel = false;
    }else{
        openPanel();
    }
}

InitData(0);
function InitData(type) {
    let params;
    switch (type) {
        case 0:
            params = { total: 8, filterKey: STATE.SEARCH_DATA }
            break;
        case 1:
            params = { filterKey: STATE.SEARCH_DATA, total: 8 }
            break;

    }
    console.log(type, params, 'params');
    http.axios({ url: "/api/Mon_Group_Manager/GetGisGroupInfo", params, methods: "get" }).then(res => {
        // console.log(res, 'res');
        STATE.groupList = res.data.data;
        // for (let group of STATE.groupList) {
        //     group.showFlag = false;
        // }
        // console.log(STATE.groupList.length < 2, 'STATE.groupList.length < 2');
        // if (STATE.groupList.length < 2) STATE.groupList[0].showFlag = true;
    })
}

function SearchGroup() {
    InitData(1);
}

function SearchClose() {
    STATE.SEARCH_DATA = "";
    InitData(1);

    setTimeout(() => {
        STATE.PANEL_FLAG = true;
    }, 500);
}

function liMouseEnter(group) {
    group.showFlag = true
    STATE.FLAG.panel = true;

}

function liMouseLeave(group) {
    group.showFlag = false;
}

function canncelConnectioned(group) {
    const groupId = group.id;
    http.post(`/api/Sys_MyCollection/CancelMyCollection?groupId=${groupId}`).then(res => {
        InitData(1)
    })

}

function DoConnectioned(group) {
    const groupId = group.id;
    http.post(`/api/Sys_MyCollection/AddMyCollection?groupId=${groupId}`).then(res => {
        InitData(1)
    })
}

</script>
<style lang="scss" scoped>
.dinsw{
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #3570FC;
    font-size: 14px;
    &>img{
        width: 16px;
        height: 16px;
        margin-right: 5px;
    }
}
.posLi{
    //  position: relative;
    //  .buisi{
    //     position: absolute;
    //     top: 0 !important;
    //     left: 320px;
    // }
}
.closed{
    width: 60px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
}

.gis-box .el-dialog__body {
  height: 655px !important;
}
.wrap {
    /* 设置宽高 */
    // width: 60px;
    // height: 50px;
    width: 102px;
    height: 36px;
    background: #FFFFFF;
    box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);
    border-radius: 4px 4px 4px 4px;

    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 13px;
    /* 父元素相对定位 */
    .nomore{
        font-weight: 500;
        font-size: 14px;
        color: #333333;
        margin-left: 4px;
    }
}
.wrap:hover{
    .nomore{
        color: #3570FC;
    }
}
.ribbon {
    background-color: #FF576E;
    /* 左上角背景颜色 */
    overflow: hidden;
    white-space: nowrap;
    /* 文字不换行*/
    position: absolute;
    /* 绝对定位 */
    right: -8px;
    top: -7px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    color: #fff;
}

.ribbon span {
    font-size: 12px !important;
    display: block;
    // font: bold 100% 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: center;
}

.SearchBox {
    box-sizing: border-box;
    // border: 2px #1a70c7 solid;
    // padding: 9px 0;
    // line-height: 18px;
    font-size: 16px;
    height: 36px;
    color: #333;
    position: relative;
    width: 320px;
    background: #fff;
    border-radius: 4px;
    user-select: none;
    position: relative;

    .titleBox {
        height: 36px;
        display: flex;
        align-items: center;
        // justify-content: space-around;
        padding: 0 12px;
        position: relative;
        .pos_dw{
            position: absolute;
            right: -65px;
        }
    }

    .el-empty {
        --el-empty-fill-color-0: var(--el-color-black);
        --el-empty-fill-color-1: #09099b;
        --el-empty-fill-color-2: #0a3297;
        --el-empty-fill-color-3: #09095e;
        --el-empty-fill-color-4: #040470;
        --el-empty-fill-color-5: #031b64;
        --el-empty-fill-color-6: #022466;
        --el-empty-fill-color-7: #020f36;
        --el-empty-fill-color-8: #041c4c;
        --el-empty-fill-color-9: #010142;
    }
}

.PanelBoxFlagStlyle {
    background: #fff;
    // border: 2px #1a70c7 solid;
    height: 630px;
}

.PanelBox {
    border-radius: 4px;
    box-shadow: 0px 1px 3px #ddd;
    overflow-y: auto;
    font-weight: 500;
    color: #333333;
    background: #fff;
    li {
        // line-height: 58px;
        // padding: 0 2px;
        padding: 0 6px;
        height: 44px;
        cursor:pointer;
        display: flex;
        align-items: center;
        font-size: 14px;
        .el-icon {
            color: #FF9D34;
            margin-right: 6px;
            font-size: 25px;
        }

        .liBox {
            position: absolute;
        }
    }

    li:hover {
        background:#E6EEFF;
        color: #3570FC;
    }

    .liBoxSame {
        padding: 17px 24px 24px;
        width: 492px;
        height: 258px;
        background: #FFFFFF;
        box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);
        border-radius: 8px;

        // width: 345px;
        left: 320px;
        // min-height: 265px;
        // background: #09162d;
        // border: 2px #1a70c7 solid;
        // padding: 1px 12px;
        // line-height: 38px;
        font-size: small;
       
        .li-item-1 {
            display: flex;
            font-size: medium;
            font-weight: 200;
            justify-content: space-between;
            cursor:pointer;
            margin-bottom: 29px;
            .item-text{
                font-weight: bold;
            }
        }

        .li-item-2 {
            // display: grid;
            // grid-template-columns: 50% 50%;
            // line-height: 20px;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            .hei115{
                height: 115px;
                border-radius: 4px;
                overflow: hidden;
            }
            .niz_dao{
                width: calc(100% - 171px );
                margin-left: 11px;
                height: 115px;
                .uptop{
                    width: 100%;
                    height: calc(100% - 32px);
                    font-weight: 500;
                    font-size: 14px;
                    color: #333333;
                    line-height: 22px;

                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 4; /* 限制显示的行数为5 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                }
                .isdow{
                    display: flex;
                    align-items: center;
                    padding-top: 10px;
                    border-top: 1px dashed #DEDEDE;
                    font-weight: 500;
                    font-size: 12px;
                    color: #333333;
                    &>img{
                        width: 16px;
                        height: 16px;
                        margin-left: 2px;
                    }
                }
            }
        }
        .li-item-last{
            display: flex;
            line-height: 20px;
            margin-bottom: 12px;
            .golast{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .li-item-4 {
            display: grid;
            grid-template-columns: 25% 25% 25% 25%;
            line-height: 20px;
            font-size: small;
            cursor:pointer;
            .box-li {
                text-align: center;
            }
        }
    }

    @for $i from 1 through 8 {
        .item-#{$i} {
            top: $i*44px-8px;
        }
    }
}

#SearchData {
    background: none;
    outline: none;
    border: none;
    width: 406px;
    font-weight: 500;
    font-size: 14px;
    color:#000;
    padding-left: 10px;
}

#SearchData:focus {
    border: none;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>