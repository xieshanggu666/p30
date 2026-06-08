// import {
//   GetMonitorGroupList,
//   GetPrAllNum,
//   GetMgDeviceRunList,
//   GetMapMonNodes,
// } from "@/api/page/gis/index";
import imgGisPoint from "@/assets/gis/switch-box/gis-point.png";
import imgGisWarning from "@/assets/gis/switch-box/gis-warning.png";
import imgGisPatrol from "@/assets/gis/switch-box/gis-patrol.png";
import imgGisOnline from "@/assets/gis/switch-box/gis-online.png";
export default {
  data() {
    return {
      dialogVisible: false,
      groupList: [],
      deviceList: [],
      nodeList: [],
      currentGroup: null,
      currentGroupActiveName: null,
      detailBoxConfig: {
        nodes: {
          title: "监测点",
          imgUrl: imgGisPoint,
          value: null,
        },
        warnings: {
          title: "预警数",
          imgUrl: imgGisWarning,
          value: null,
        },
        portals: {
          title: "巡查数",
          imgUrl: imgGisPatrol,
          value: null,
        },
        onlineRate: {
          title: "在线率",
          imgUrl: imgGisOnline,
          value: null,
        },
      },
    };
  },
  computed: {
    StringCurrentGroup() {
      if (this.currentGroup) {
        return JSON.stringify(this.currentGroup)
      } else {
        return "";
      }
    }
  },

  methods: {
    openDialog(group) {
      this.$emit("BrigeChangedialogVisible", true, group);
    },
    async initPage() {
      this.groupList =  (await this.http.post("/api/Mon_Group_Manager/getPageData", {order:"asc",page:1,rows:30,sort:"ID",wheres:JSON.stringify([{"name":"Project","value":"bht","displayType":"like"}])}, "正在请求中·····")).rows;
    },
    GetgroupData(activeNames) {

      if (this.currentGroup && activeNames.length > 0) {
        if (JSON.stringify(this.currentGroup) == activeNames) {
          return;
        } else {
          this.changeCurrentGroup(activeNames);
        }
      } else {
        if (activeNames.length > 0) {
          this.changeCurrentGroup(activeNames);
        }
      }
      this.$emit('ClosePointDetail');

    },
    changeCurrentGroup(activeNames) {
      let parseData = JSON.parse(activeNames);
      if (activeNames.length > 0) {
        this.currentGroup = parseData;
        let mgId = this.currentGroup.ID;
        console.log(parseData,'parseData',JSON.stringify([{name:"Group_Id",value:mgId}]));

        setTimeout(() => {
            this.http.post('/api/Mon_Point_Manager/getPageData',{order: "asc",page: 1,rows: 30,sort: "ID",value: 1,wheres:JSON.stringify([{name:"Group_Id",value:mgId}])}).then((data) => {
            this.nodeList = data.rows;
            this.deviceList = data.rows;
            this.ButtonLocalGroup();
            this.detailBoxConfig.nodes.value =this.nodeList.length;
        });
          this.detailBoxConfig.warnings.value =0;
          this.detailBoxConfig.portals.value = 0;
          this.detailBoxConfig.onlineRate.value =
            "100%"
        }, 500);
      }
    },
    MenuClickGroup(currentGroup) {
      this.activeTab = "monitorGroup";
      const currentGroupStr = JSON.stringify(currentGroup);
      for (let item of this.groupList) {

        if (item.ID == currentGroup.ID) {
          this.currentGroupActiveName = JSON.stringify(item);
        }
      }
      this.GetgroupData(currentGroupStr);
    
      setTimeout(() => {
        let dom = document.getElementsByClassName("monitorGroup")[0];
      dom.scrollTo({
        top: dom.getElementsByClassName("is-active")[0].offsetTop,
        behavior: "smooth"
      });
      }, 500);
   
    },
    ButtonLocalGroup() {
      this.$emit("localGroup", this.currentGroup, this.nodeList);
    },
  },
}
