<template>
  <div class="consyt">
      <!-- 头部 -->
      <!-- <div class="contops" >
          <div class="an_sic">
              <div class="logs"></div>
              <div class="tebcheck ">
                  <div class="tablist actck">安全监测</div>
                  <div class="tablist">监测运维</div>
                  <div class="tablist">后台系统</div>
              </div>
          </div>
          <div class="nofens">
              <div class="timew">{{ nowTime }}</div>
              <div class="xin_qi">{{ nowDate }}  <span>{{ nowWeek }}</span> </div>
              <div class="sugang"></div>
              <img src="@/assets/home/tiqis.png"/>
              <div class="tianq">16-24℃</div>
          </div>
      </div> -->
      <!-- 黑色叠加色彩块 -->
      <!-- <div class="topbok"></div>
      <div class="letbok"></div>
      <div class="rit letbok"></div>
      <div class="botbok"></div> -->

      <div class="uslef pubdiv" v-if="starts">
          <!-- 监测数据 -->
          <div class="istia">
              <div class="tit_s"><img class="sizi" src="@/assets/home/jcsj.png"/> </div>
              <div class="celue">
                  <div class="dvlo">
                      <img src="@/assets/home/tj1.png"/>
                      <div class="jinc">监测组数量</div>
                      <div class="fotpu co1">
                       {{grounpzonshu}}
                      </div>
                  </div>
                  <div class="dvlo">
                      <img src="@/assets/home/tj2.png"/>
                      <div class="jinc">监测点位数量</div>
                      <div class="fotpu co2">
                       {{Pointzonshu}}
                      </div>
                  </div>
                  <div class="dvlo">
                      <img src="@/assets/home/tj3.png"/>
                      <div class="jinc">预警总数</div>
                      <div class="fotpu co3">
                        {{wringzszonshu}}
                      </div>
                  </div>
              </div>
          </div>
          <!-- 监测简报 -->
          <div class="poba">
              <div class="tit_s"><img class="sizi" src="@/assets/home/jcjb.png"/></div>
              <div class="uumeiy">
                  <div class="youbg"></div>
                  <div class="yaonle peubdiv">
                    <vue-seamless-scroll
                      :data="jiarrLet"
                      :class-option="optionCustomer1"
                      class="seamless-warp"
                    >
                      <div class="litop gondiv" v-for="(item,index) in jiarrLet" :key="index">
                        <div class="isname">{{item.pointName}}</div>
                        <div class="contus">{{item.reportInfo}}</div>
                      </div>
                    </vue-seamless-scroll>
                  </div>
                  <div class="yaoer peubdiv">
                    <vue-seamless-scroll
                      :data="jiarrRight"
                      :class-option="optionCustomer"
                      class="seamless-warp"
                    >
                        <div class="lriop gondiv" v-for="(item,index) in jiarrRight" :key="index">
                          <div class="isname">{{item.pointName}}</div>
                          <div class="contus">{{item.reportInfo}}</div>
                        </div>
                    </vue-seamless-scroll>

                  </div>
              </div>
          </div>
      </div>
      <div class="usright pubdiv" v-if="starts">
        <!-- 运行数据 -->
        <div class="yunMeth">
          <div class="tit_s"><img class="sizi" src="@/assets/home/yxshuju.png"/> </div>
          <div class="nuks">
              <div class="yaomaps">
                  <div class="sezons">
                      <div>{{totalCount}}</div>
                      <div>设备总数量</div>
                  </div>
                  <div class="pubdivs yao1 ">
                    <div>{{onlineCount}}</div>
                    <div>设备在线数量</div>
                  </div>
                  <div class="pubdivs yao2 ">
                    <div>{{offlineCount}}</div>
                    <div>设备离线数量</div>
                  </div>
                  <div class="pubdivs yao3 ">
                    <div>{{faultDeviceRate}}</div>
                    <div>平均故障率</div>
                  </div>
              </div>
              <!-- <div class="leimg">
                  <img src="@/assets/home/donnib.webp"/>
                  <div class="yuxday">安全运行天数</div>
                  <div class="yxnum">
                    {{numDay}}
                  </div>
              </div>
              <div class="ritdiv">
                  <div class="minggh">
                    <div class="milab">
                        <div @click="Device('gnss', true)"><div class="zaix" ></div> 在线数量 <span>{{ this.getDevGnss.onlineCount }}</span>  个</div>
                        <div  @click="Device('gnss', false)"><div class="lixin"></div> 离线数量 <span>{{ this.getDevGnss.offlineCount }}</span> 个</div>
                    </div>
                    <div class="henimg"><img src="@/assets/home/sansu.png"/><div>GNSS监测点  <span>{{this.getDevGnss.onlineCount+this.getDevGnss.offlineCount}} </span> 个</div>  </div>
                  </div>

                  <div class="minggh">
                    <div class="milab">
                        <div @click="Device('other', true)"><div class="zaix"></div> 在线数量 <span>{{ this.getDevOther.onlineCount }}</span>  个</div>
                        <div @click="Device('other', false)"><div class="lixin"></div> 离线数量 <span>{{ this.getDevOther.offlineCount }} </span> 个</div>
                    </div>
                    <div class="henimg"><img src="@/assets/home/lishanlaomu.png"/><div> 其他监测点 <span>{{this.getDevOther.onlineCount+this.getDevOther.offlineCount}} </span> 个</div> </div>
                  </div>
              </div> -->
          </div>
        </div>
        <!-- 监测评估报告 -->
        <div class="jpgu">
            <div class="tit_s"><img class="erbaiba" src="@/assets/home/sebis.png"/> </div>
            <div class="suini">
              <el-table
                  :data="newData"
                  style="width: 100%;"
                  class="miyao"
                >
                  <el-table-column
                    prop="typeName"
                    label="监测类型"
                    width="198px"
                    align="left"
                  />
                  <el-table-column
                    prop="totalCount"
                    label="设备数量"
                    align="left"
                    width="158px"
                  />
                  <el-table-column
                    prop="rate"
                    label="在线率"
                    align="center"
                  />
              </el-table>
              <div class="sect_body">
                <vue-seamless-scroll
                :data="newData"
                :class-option="classOption"
                style="width: 100%"
                class="seamless-warp"
              >
                  <el-table
                    :data="newData"
                    style="width: 100%;"
                    :highlight-current-row="false"
                    class="tuyaobtn"
                  >
                    <el-table-column
                      prop="typeName"
                      label="监测类型"
                      width="198px"
                      align="left"
                    ></el-table-column>
                    <el-table-column
                      prop="totalCount"
                      label="设备数量"
                       align="left"
                      width="158px"
                    ></el-table-column>
                    <el-table-column
                      label="在线率"
                       align="center"
                        prop="rate"
                    >
                        <template #default="scope">
                          <div class="lanse">{{scope.row.rate}}</div>
                        </template>
                   </el-table-column>
                  </el-table>
                </vue-seamless-scroll>
              </div>
              
            </div>
        </div>
      </div>
      <div class="footes" v-if="starts">
        <div class="folet godiv">
          <div class="tit_s bghen"><img class="sizi " src="@/assets/home/yjtj.png"/> </div>
          <div class="uucont">
            <!-- <chart class="chart-box" :id="'speed-chart'"></chart> -->
            <chartL :id="'line'" ></chartL>
          </div>
        </div>
        <div class="forit godiv">
          <div class="tit_s bghen"><img class="sizi " src="@/assets/home/yjxx.png"/> </div>
          <div class="uucont">
              <el-table
                :data="getAlarmData"
                style="width: calc(100vw - 940px);"
                class="yujtab"
              >
                  <el-table-column width="300px" prop="title" label="预警标题" align="left"/>
                  <el-table-column  width="305px" prop="content" label="预警内容" align="left" />
                  <!-- <el-table-column prop="Dev_Id" width="165px" label="设备id" align="left" /> -->
                  <el-table-column prop="Deal_State"  label="处理状态" align="left" />
                  <el-table-column prop="level" label="预警等级" align="left" />
                  <el-table-column
                    width="160px"
                    prop="alarmTime"
                    label="预警时间"
                    align="left"
                  />
              </el-table>
              <div class="hestab">
                <vue-seamless-scroll
                    :data="getAlarmData"
                    :class-option="classOptionInfo"
                    class="seamless-warp"
                    style="width: 100%"
                  >
                    <el-table
                    :show-header="false"
                      :data="getAlarmData"
                      style="width: 100%;"
                      class="buyisty"
                    >
                      <el-table-column prop="title" width="300px" label="预警标题" align="left">
                        <template #default="scope">
                            <div class="nidas">
                              <div class="yneis">{{scope.row.Title}}</div>
                            </div>
                        </template>
                      </el-table-column>
                      <el-table-column  width="305px" prop="content" label="预警内容" align="left">
                        <template #default="scope">
                          <div class="nidas">
                            <div class="yneis">{{scope.row.Content}}</div>
                          </div>
                         
                        </template>
                      </el-table-column>
                      <!-- <el-table-column  width="165px" prop="content" label="设备id" align="left">
                        <template #default="scope">
                          <div class="nidas">
                            <div class="yneis">{{scope.row.Dev_Id}}</div>
                          </div>
                         
                        </template>
                      </el-table-column> -->
                      <el-table-column  prop="Deal_State" label="处理状态" align="left">
                        <template #default="scope">
                          <div class="nidas">
                            <div class="yneis lanse">{{scope.row.Status==1?'已处理':'未处理'}}</div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="level" label="预警等级" align="left">
                        <template #default="scope">
                          <div class="nidas">
                            <div class="yneis"><div :class="yudenj[scope.row.Level]">{{scope.row.Level}}</div> </div>
                          </div>
                        </template>
                      </el-table-column>
                      
                      <el-table-column prop="alarmTime" width="160px" label="预警时间" align="left">
                        <template #default="scope">
                          <div class="nidas">
                            <div class="yneis">{{scope.row.CreateDate}}</div>
                          </div>
                         
                        </template>
                      </el-table-column>
                    </el-table>
                  </vue-seamless-scroll>
              </div>
              
          </div>
        </div>
      </div>
      <!-- 显示隐藏图表 返回监测组 初始 暂停 继续 -->
      <div class="filcs">
          <div class="shoxs" @click="starts = !starts">
            <img :src="starts?require('@/assets/home/yinmai.png'):require('@/assets/home/yank.png')"/>{{starts?'隐藏图表':'显示图表'}} 
          </div>
          <div class="shoxs iscz" @click="callback()">
            <img src="@/assets/home/fanjz.png"/>返回监测组
          </div>
          <div class="liobut">
            <div v-for="(item,index) in btnzus" :key="index" @click="buittan(index)" :class="index==actbtn?'actvs':''" class="mobsdiv ">
                <img :src="item.url"/>{{item.name}}
            </div>
          </div>
      </div> 
      <!-- 监测数据-- 预警信息查看 -->
      <Warning ref="warning"></Warning>
      <!-- 3D地图id -->
      <div id="gisBox"  v-if="mapstart"></div>
       <!-- 设备在线离线详情弹窗 -->
      <Device ref="device"></Device>
      <div class="infoowk" v-if="showweiz" :style="{left:xjcpostion.x+'px',top:(xjcpostion.y-30)+'px'}">
          <div class="titues"><div class="uel">{{pointData.Point_Name}}<img src="@/assets/home/mtbots.png"/> </div><img class="mafns" @click="showweiz=false" src="@/assets/home/mfans.png"/> </div>
          <div class="sepun"><span>点位名称:</span>{{pointData.Point_Name}} </div>
          <div class="sepun"><span>点位编号:</span>{{pointData.Point_Num}} </div>
          <div class="sepun"><span>设备编号:</span>{{pointData.Sim_Num}} </div>
          <div class="dshx"></div>
          <div class="sepun"><span>运行状态: </span>{{pointData.State_Run}} </div>
          <div class="sepun"><span>最新通信时间：</span>{{pointData.Recent_T}} </div>
          <div class="sepun"><span>点位描述：</span>{{pointData.Description}}</div>
      </div> 
  </div>
</template>

<script>
  import moment from "moment";
 import mixinGis from "./mixin/gis";
// import chart from "./components/chart.vue";
import chart from "./components/waveChart.vue";
import chartL from "./components/chart.vue";
 import mixinBasic from "./mixin/basic";
// import MixinIndex from "./mixin/index";
import Warning from "./components/Warning.vue";
import Device from "./components/Device.vue";
import pointDetail from "./components/point-detail/index.vue";

export default {
  name: "scroll",
  components: {
    chart: chart,
    chartL: chartL,
    Device: Device,
    Warning: Warning,
    pointDetail: pointDetail,
  },
  mixins: [mixinGis, mixinBasic],
  data() {
    return {
      totalCount:'',//设备总数
      onlineCount:'',//在线设备数
      onlineRate:'',//在线率
      offlineCount:'',//离线设备数
      OfflineRate:'',//离线率
      faultDeviceRate:'',//平均故障率
      grounpzonshu:'', //监测组数量
      Pointzonshu:'', //点位数量
      wringzszonshu:'', //预警信息数量
      newData:[], //设备在线率
      mapstart:false,  //地图线上加载黑屏问题
      //评估数据 运行天数
      numDay:'',
      //今日监测数据
      CenterData:[],
      //监测简报
      jiarrLet:[],
      jiarrRight:[],
      optionCustomer1: {
        step: .7, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: false, // 开启数据实时监控刷新dom
      },
      optionCustomer: {
        step: .8, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: false, // 开启数据实时监控刷新dom
      },
      // 监测数据
      // jianceData:[
      //   {
      //     url:require('@/assets/home/tj1.png'),
      //     className:'co1',
      //   },
      //   {
      //     url:require('@/assets/home/tj2.png'),
      //     className:'co2',
      //   },
      //   {
      //     url:require('@/assets/home/tj3.png'),
      //     className:'co3',
      //   }
      // ],
      //监测评估报告
      cegubao:[
        {className:'wx1',value:'Ⅰ'},
        {className:'wx1',value:'Ⅰ'},
        {className:'wx2',value:'Ⅱ'},
        {className:'wx3',value:'Ⅲ'},
        {className:'wx4',value:'Ⅳ'},
        {className:'wx5',value:'Ⅴ'},
      ],
      //预警信息标签匹配
      yudenj:{"蓝色预警":'buisij1',"橙色预警":'buisij2',"黄色预警":'buisij3',"红色预警":'buisij4'},
      //预览 初始暂停继续按钮
      actbtn:0,
      btnzus:[
        {
          url:require('@/assets/home/cshih.png'),
          name:'初始',
        },
        {
          url:require('@/assets/home/zantin.png'),
          name:'暂停',
        },
        {
          url:require('@/assets/home/jiuxs.png'),
          name:'继续',
        },
      ],  
      starts: true, //显示图表
      gisStyle: null,
      chartData: {},
      listData: [],
      nodeDetailStyle: {
        right: 0,
      },
      list: [
        {
          fileName: "测试1",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试2",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试3",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试4",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试5",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试6",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试7",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试8",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试9",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
        {
          fileName: "测试10",
          uploadDate: "2021-11-18",
          fileSize: "8",
          uploadMan: "165",
          visitNum: "112",
        },
      ],
      // 高度
      contentStyleObj: {
        height: "",
      },
      getDevGnss: {}, //设备在线离线
      getDevOther: {}, //设备在线离线
      getAlarmData: [], //预警信息表格
      getBriefingData: [],
      getRepoetData: [],
      Timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
      form: {
        datePicker: {
          time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          defaultTime: [
            new Date(new Date() - 720 * 60 * 60 * 1000),
            new Date(),
          ],
        },
      },
    };
  },
  watch: {},
  created() {
    window.addEventListener("resize", this.getHeight);
    //今日监测数据
    //this.ChangeCenter();
  },
  mounted() {
    this.$nextTick(()=>{
      this.mapstart=true; //地图线上不加载问题
      setTimeout(() => {
        this.pageInit();
      }, 1000);
     
    })
  
    this.getHeight();
    this.GetDevStatus();
    //this.GeAlarmInfo();
    this.GeAlarmInfopy();
    //获取监测组总数
    this.grounphe();
    //获取点位总数
    this.Pointhe();
    //获取预警总数
    this.wringzs();
    //设备在线率
    this.typeOnlineStatistic();
    //设备实时情况
    this.sihisqik();
    //this.GetReport();
    this.GetBriefing();
    this.Timer = setInterval(() => {
      this.setNowTimes();
    }, 1000);
  },
  unmounted() {
    window.removeEventListener("resize", this.getHeight);
  },
  computed: {
    classOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    classOption1() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    classOptionInfo() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 10, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },

  methods: {
    // ChangeCenter() {
    //   this.http.get("api/BigScreen/GetMonitorData").then((result) => {
    //     let obj=result.data
    //     //评估数据 运行天数
    //     this.numDay=obj.safeDays;
    //     this.CenterData=[
    //       { name: '今日监测数据',  value: obj.totayDataCount },
    //       { name: '今日预警数',  value: obj.totayAlarmCount },
    //       { name: '本月预警数',  value: obj.monthAlarmCount },
    //     ]
    //   });
    // },
    //预览 播放 暂停操作
    buittan(index){
      this.actbtn=index;
      switch (index) {
        case 0:
          this.ceamFly(); //开始
          break;
        case 1:
          this.stopFly(); //暂停
          break;
        case 2:
          this.continueFly(); //继续
          break;  
      }
    },
    setNowTimes() {
      //获取当前时间
      let myDate = new Date();
      let wk = myDate.getDay();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      );
      let hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      let sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let week = weeks[wk];
      this.nowDate = yy + "-" + mm + "-" + dd;
      this.nowTime = hou + ":" + min + ":" + sec;
      this.nowWeek = week;
    },

    getHeight() {
      if (window.innerHeight < 768 || window.innerHeight < 1080) {
        this.contentStyleObj.height = "135px";
      } else {
        this.contentStyleObj.height = window.innerHeight - 800 + `px`;
      }
    },
    pageInit() {
      this.gisInit();
    },

    async callback () {
      await this.exitFly();
      this.CallBackGroup();
    },

    filterTime(time) {
      var date = new Date(time);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
    },

    // goItem(e) {
    //   console.log(":eeee", e);
    //   switch (e.name) {
    //     case "今日预警数":
    //       let startTime = this.filterTime(this.form.datePicker.time[0]);
    //       let endTime = this.filterTime(this.form.datePicker.time[1]);
    //       this.$refs.warning.openWarning(startTime, endTime);
    //       break;
    //     case "本月预警数":
    //       //
    //       let startMT = this.filterTime(this.form.datePicker.defaultTime[0]);
    //       let endMT = this.filterTime(this.form.datePicker.defaultTime[1]);
    //       this.$refs.warning.openWarning(startMT, endMT);
    //       break;
    //     default:
    //       break;
    //   }
    // },
    Device(type, e) {
      switch (type) {
        case "gnss":
          this.$refs.device.openGnssDevice(type, e);
          break;
        case "other":
          this.$refs.device.openGnssDevice(type, e);
          break;
        default:
          break;
      }
    },

    //监测设备状态
    GetDevStatus() {
      this.http.get("api/BigScreen/GetDevStatus").then((result) => {
        console.log('设备状态',result);
        this.getDevGnss = result.data.gnss;
        this.getDevOther = result.data.other;
      });
    },
    // 预警信息
    // GeAlarmInfo() {
    //   this.http.get("api/BigScreen/GeAlarmInfo").then((result) => {
    //     this.getAlarmData = result.data;
    //   });
    // },

    // 监测简报 GET
    GetBriefing() {
      this.http.get("api/BigScreen/GetSimpleReportInfo").then((result) => {
        this.getBriefingData = result.data;
        let lefe=[],rights=[];
        this.getBriefingData.forEach((item,index) => {
            index%2==0?lefe.push(item):rights.push(item);
        });
        this.jiarrLet=lefe;
        this.jiarrRight=rights;
        console.log("监测简报", result);
      });
    },

    // 获取评估报告
    // GetReport() {
    //   this.http.get("api/BigScreen/GetEvaluationinfo").then((result) => {
    //     // this.getAlarmData=result.data
    //     this.getRepoetData = result.data;
    //     console.log("评估报告", result);
    //   });
    // },
    gogogo(){
      this.$router.replace("/bigdataF") 

    },
    gogogo2(){
      this.$router.replace("/Mon_Point_Manager") 
    },
    // 实时预警信息
    GeAlarmInfopy() {
        const today = moment();
        const threeDaysAgo = moment().subtract(2, "days");
        const formattedToday = today.format("YYYY-MM-DD HH:mm:ss");
        const formattedThreeDaysAgo = threeDaysAgo.format("YYYY-MM-DD HH:mm:ss");
        var param = {
          order: "desc",
          page: 1,
          rows: 100,
          sort: "ID",
        };
        param.wheres = `[{"name":"Deal_State","value":"1","displayType":"select"}]`;
        this.http
          .post("/api/Ala_Infomation/getPageData", param, true)
          .then((result) => {
            console.log('数据打印123',result);
            this.getAlarmData = result.rows;
            this.getAlarmData.forEach((item) => {
              if (item.Level === 0) {
                item.Level = "蓝色预警";
              } else if (item.Level === 1) {
                item.Level = "黄色预警";
              } else if (item.Level === 2) {
                item.Level = "橙色预警";
              }else if (item.Level === 99) {
                item.Level =  item.Level;
              }else {
                item.Level = "红色预警";
              }
            });
          
            //  this.total = result.total;
          });
      },
    // 项目设备在线率
    typeOnlineStatistic() {
        this.http
          .get("/api/Mon_DevOps_Manager/GetTypeOnlineStatistic", {}, true)
          .then((result) => {
            this.newData = result.data;
          });
    },
    //监测组总数
    grounphe(){
      let obj={
              order: "asc",
              page: 1,
              rows: 30,
              sort: "Group_Order",
              wheres: ``
        };
      this.http.post("/api/Mon_Group_Manager/getPageData", obj, true) .then((result) => {
        this.grounpzonshu=result.total;
      });
    },
     //监测组总数
     Pointhe(){
      let obj={
              order: "asc",
              page: 1,
              rows: 30,
              sort: "Group_Order",
              wheres: ``
        };
      this.http.post("/api/Mon_Point_Manager/getPageData", obj, true) .then((result) => {
        this.Pointzonshu=result.total;
      });
    },
    //预警总数
    wringzs(){
      let obj={
              order: "asc",
              page: 1,
              rows: 30,
              sort: "Group_Order",
              wheres: ``
        };
      this.http.post("/api/Ala_Infomation/getPageData", obj, true) .then((result) => {
        this.wringzszonshu=result.total;
      });
    },
    //设备实时情况
    sihisqik(){
        // 设备总数
        let url = "/api/Mon_DevOps_Manager/GetProjectOnlineStatistic";
        this.http.get(url, {}, true).then((result) => {
          //设备总数
          this.totalCount = result.data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.totalCount;
          }, 0);
          this.onlineCount = result.data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.onlineCount;
          }, 0);
          this.offlineCount = this.totalCount - this.onlineCount;
          //设备在线率
          let processRate1=this.moneySwitch('/',this.onlineCount,this.totalCount);  //计算2/3的百分比
          this.onlineRate=(processRate1*100).toFixed(2)+'%';
          
          //设备离线率
          let processRate2=this.moneySwitch('/',this.offlineCount,this.totalCount);  //计算2/3的百分比
          this.OfflineRate=(processRate2*100).toFixed(2)+'%';
        });
        // 平均故障率
        this.http
          .get("/api/Mon_DevOps_Manager/GetFaultDeviceRate", {}, true)
          .then((result) => {
            this.faultDeviceRate = (result.data * 100).toFixed(2) + "%";
          });
    }
    
  },
};
</script>

<style scoped lang="scss">
.lanse{
  color: #37E1FF !important;
}
.bghen{
  background:url(../../assets/home/bghyj.png) no-repeat !important;
  background-size: 100% 100% !important;
}
.tit_s{
  width: 100%;
  height: 36px;
  background:url(../../assets/home/titlk.png) no-repeat;
  background-size: 100% 100%;
  padding-left: 37px;
  padding-top: 6px;
  .sizi{
      width: 80px;
      height: 21px;
  }
  .liuzi{
      width: 118px;
      height: 21px;
  }
  .erbaiba{
    width: 140px;
    height: 21px;
  }
}
  .consyt{
      width: 100%;
      height: 100vh;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .contops{
          width: 100%;
          height: 72px;
          position: absolute;
          top: 0;
          z-index: 3;
          background: url('../../assets/home/hetop.png') no-repeat;
          background-size: 100% 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 15px 0 35px;
          .an_sic{
              padding-top: 4px;
              display: flex;
              align-items: center;
              .logs{
                  margin-right: 116px;
                  background: url('../../assets/home/titse.png') no-repeat;
                  background-size: 100% 100%;
                  width: 331px;
                  height: 32px;
              }
              .tebcheck{
                  display: flex;
                  align-items: center;
                  .tablist{
                      cursor: pointer;
                      font-weight: 500;
                      font-size: 18px;
                      color: #B5C4ED;
                      text-align: center;
                      line-height: 42px;
                      width: 172px;
                      height: 42px;
                      background: url('../../assets/home/noact.png') no-repeat;
                      background-size: 100% 100%;
                      margin-left: -20px;
                  }
                   .actck{
                      background: url('../../assets/home/actes.png') no-repeat !important;
                      background-size: 100% 100% !important;
                      color: #fff !important;
                  }
              }
             
          }
          .nofens{
              padding-top: 6px;
              display: flex;
              align-items: center;
              .timew{
                  font-size: 18px;
                  color: #7FD9FE;
                  margin-right: 14px;
                  font-weight: bold;
              }
              .xin_qi{
                  font-size: 14px;
                  color: #7FD9FE;
                  span{
                      margin-left: 10px;
                  }
              }
              .sugang{
                  width: 1px;
                  height: 15px;
                  background: #80DAFF;
                  opacity: 0.35;
                  margin: 0 18px;
              }
              &>img{
                  width: 20px;
                  height: 20px;
                  margin-right: 5px;
              }
              .tianq{
                  font-size: 18px;
                  font-weight: bold;
                  color: #7FD9FE;
              }
          }
      }
      .topbok{
          width: 100%;
          height: 123px;
          position: absolute;
          top: 0;
          z-index: 2;
          background: linear-gradient(0deg, rgba(7,15,27,0) 0%, #07112D 100%);
      }
      .letbok{
          width: 83px;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          background: linear-gradient(270deg, rgba(7,15,27,0) 0%, #07112D 100%);
      }
      .rit{
          left: auto;
          right: 0;
          background: linear-gradient(90deg, rgba(7,15,27,0) 0%, #07112D 100%);
      }
      .botbok{
          width: 100%;
          height: 120px;
          position: absolute;
          bottom: 0;
          z-index: 2;
          background: linear-gradient(180deg, rgba(7,15,27,0) 0%, #07112D 100%);
      }
      .pubdiv{
          width: 23.43%;
          height: 60.18%;
          z-index: 2;
          background: rgba(13,38,84,0.45);
      }
      .uslef{
          position: absolute;
          left: 15px;
          top: 7.4%;
          .istia{
              width: 100%;
              height: 30.615%;
              .celue{
                  width: 100%;
                  height: calc(100% - 36px);
                  display: flex;
                  justify-content: space-between;
                  padding:10px  35px 0 35px;
                  .dvlo{
                  // cursor: pointer;
                      &>img{
                          width: 70px;
                          height: 70px;
                          display: block;
                          margin: auto;
                      }
                      .jinc{
                          text-align: center;
                          font-size: 14px;
                          color: #FFFFFF;
                          margin-bottom: 5px;
                      }
                      .fotpu{
                          text-align: center;
                          font-size: 24px;
                          color: #FFFFFF;
                          font-weight: bold;
                      }
                      .co1{
                          background: linear-gradient(0deg, #71A9F0 0%, #53E9FF 100%);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                      }
                      .co2{
                          background: linear-gradient(0deg, #F07171 0%, #FFB053 100%);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                      }
                      .co3{
                          background: linear-gradient(0deg, #71A9F0 0%, #53E9FF 100%);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                      }
                  }
            
              }
          }
          .poba{
              width: 100%;
              height: 69.385%;
              .uumeiy{
                width: 100%;
                height: calc(100% - 36px);
                display: flex;
                position: relative;
                justify-content: space-between;
                padding: 14px  10px 0px;
                box-sizing: border-box;
                .youbg{
                  width: 100%;
                  height: 324px;
                  bottom: 0;
                  left: 11px;
                  position: absolute;
                  background: url('../../assets/home/jianbg.png') no-repeat;
                  background-size: 100% 100%;
                }
                .peubdiv{
                  width: calc((100% - 5px) / 2);
                  height: 100%;
                  overflow: hidden;
                  overflow-y: auto;
                }
                .gondiv{
                  width: 100%;
                  height: 181px;
                  .isname{
                        font-size: 14px;
                        color: #FFFFFF;
                        padding:20px 0  0 18px;
                    }
                    .contus{
                        height: calc(100% - 50px);
                        text-align: justify;
                        font-size: 14px;
                        color: #fff;
                        padding: 14px;
                        box-sizing: border-box;
                        display: -webkit-box;
                        -webkit-line-clamp: 6; /* 限制行数为3 */
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                }
                .yaonle{
                  scrollbar-width: none; /* Firefox 64+ */
                  .litop{
                    background: url('../../assets/home/jbaos.png') no-repeat;
                    background-size: 100% 100%;
                  }
                }
                .yaoer{
                  scrollbar-width: none; /* Firefox 64+ */
                  .lriop{
                    background: url('../../assets/home/lehou.png') no-repeat !important;
                    background-size: 100% 100% !important;
                  }
                }
              }
          }
      }
      .usright{
          position: absolute;
          right: 15px;
          top: 7.4%;
          .yunMeth{
            width: 100%;
            height: 33.84%;
            .nuks{
              width: 100%;
              height: calc(100% - 36px);
              padding: 0 13px 0 11px;
              display: flex;
              justify-content: center;
              .yaomaps{
                  width: 310px;
                  height: 146px;
                  position: relative;
                  background:url('../../assets/home/yubs.png') no-repeat;
                  background-size: 100% 100%;
                  .sezons{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 11px;
                    &>div:nth-child(1){
                        font-weight: 600;
                        font-size: 24px;
                        text-align: center;
                        color: #FFFFFF;
                        background: linear-gradient(0deg, #71A9F0 0%, #53E9FF 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    &>div:nth-child(2){
                        font-size: 14px;
                        text-align: center;
                        color: #FFFFFF;
                    }
                  }
                  .pubdivs{
                      font-size: 14px;
                      color: #FFFFFF;
                      &>div{
                        text-align: center;
                      }
                      &>div:nth-child(1){
                        margin-bottom: 56px;
                      }
                  }
                  .yao1{
                    position: absolute;
                    left: 0;
                    top: 56px;
                  }
                  .yao2{
                    position: absolute;
                    left: 113px;
                    top: 76px;
                  }
                  .yao3{
                    position: absolute;
                    right: 0;
                    top: 56px;
                  }
              }
              .leimg{
                width: 34.82%;
                height: 120px;
                position: relative;
                &>img{
                  width: 100%;
                  height: auto;
                }
                .yuxday{
                  font-size: 14px;
                  color: #FFFFFF;
                  width: 100%;
                  text-align: center;
                  position: absolute;
                  bottom: -5px;
                }
                .yxnum{
                  width: 100%;
                  font-weight: bold;
                  text-align: center;
                  position: absolute;
                  bottom: -35px;
                  font-size: 24px;
                  color: #FFFFFF;
                  background: linear-gradient(0deg, #71A9F0 0%, #53E9FF 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
              .ritdiv{
                  width: 62.82%;
                  .minggh{
                    width: 100%;
                    padding-top: 15px;
                    .milab{
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      margin-bottom: 3px;
                      cursor: pointer;
                      &>div{
                        font-size: 14px;
                        color: #53E1FA;
                        display: flex;
                        align-items: center;
                        .zaix{
                          width: 6px;
                          height: 6px;
                          background: #52FF9B;
                          margin-right: 3px;
                        }
                        .lixin{
                          width: 6px;
                          height: 6px;
                          margin-right: 3px;
                          background: #FB6B6B;
                        }
                        span{
                          font-size: 18px;
                          margin: 0 5px;
                        }
                      }
                    }
                    .henimg{
                      width: 100%;
                      height: 38px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: url('../../assets/home/uukk.png') no-repeat;
                      background-size: 100% 100%;
             
                      font-size: 14px;
                      color: #FFFFFF;
                      span{
                        font-size: 20px;
                        font-weight: bold;
                        margin: 0 6px;
                      }
                      &>img{
                        width: 24px;
                        height: 24px;
                        margin-right: 6px;
                      }
                    }
                  }
              }
            }
          }
          .jpgu{
            width: 100%;
            height: 66.16%;
            .suini{
              width: 100%;
              height: calc(100% - 36px);
              
              .sect_body{
                width: 100%;
                height: calc(100% - 36px);
                overflow: hidden;
              }
              .miyao{
                --el-table-border-color:none !important;
                 ::v-deep .el-table__body-wrapper{
                  display: none;
                 }
              }
              .tuyaobtn{
                ::v-deep .el-table__header-wrapper{
                  display: none;
                }
                .wx1{
                  color: #FB6B6B;
                }
                .wx2{
                  color: #FF7D2F;
                }
                .wx3{
                  color: #F3C13D;
                }
                .wx4{
                  color: #51E1FB;
                }
                .wx5{
                  color: #fff;
                }
              }
            }
          }
      }
      .footes{
          width:calc(100% - 30px);
          height: 30.09%;
          position: absolute;
          overflow: hidden;
          z-index: 2;
          left: 15px;
          bottom: 1.3%;
          display: flex;
          justify-content: space-between;

          .godiv{
            width: calc((100% - 10px) / 2);
            height: 100%;
            background: rgba(13,38,84,0.45);
            .uucont{
              width: 100%;
              height: calc(100% - 36px);
              .yujtab{
                --el-table-border-color:none !important;
                 ::v-deep .el-table__body-wrapper{
                  display: none;
                }
              }
              .hestab{
                width: 100%;
                height: calc(100% - 36px);
                overflow: hidden;
                .nidas{
                  height: 76px;
                  padding: 10px 0;
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  .yneis{
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 20px;
                    .buisij1{
                      width: 72px;
                      height: 28px;
                      background:rgba(101, 228, 251, .25);
                      border-radius: 6px;
                      line-height: 28px;
                      font-size: 14px;
                      text-align: center;
                      color: #37E1FF;
                    }
                    .buisij2{
                      width: 72px;
                      height: 28px;
                      background: rgba(255,134,61,0.25);
                      border-radius: 6px;
                      line-height: 28px;
                      font-size: 14px;
                      text-align: center;
                      color: #FF863D;
                    }
                    .buisij3{
                      width: 72px;
                      height: 28px;
                      background: rgba(243,193,61,0.25);
                      border-radius: 6px;
                      line-height: 28px;
                      font-size: 14px;
                      text-align: center;
                      color: #F3C13D;
                    }
                    .buisij4{
                      width: 72px;
                      height: 28px;
                      background: rgba(255,0,0,0.25);
                      border-radius: 6px;
                      line-height: 28px;
                      font-size: 14px;
                      text-align: center;
                      color: #ff0000;
                    }
                  }
            
                }

              }
            }
          }
      }
      .filcs{
        position: absolute;
        display: flex;
        align-items: center;
        z-index: 2;
        top: 79px;
        right: 485px;
        .shoxs{
          margin-left: 12px;
          padding: 7px 17px;
          border-radius: 17px;
          background: rgba(11, 27, 56, .51);
          font-size: 14px;
          color: #53E1FA;
          display: flex;
          align-items: center;
          cursor: pointer;


          &>img{
            width: 20px;
            height: 20px;
            margin-right: 2px;
          }
        }
        .shoxs:hover{
          background: url(../../assets/home/bghov.png) no-repeat;
          background-size: 100% 100%;
        }
        .iscz:hover{
          background: url(../../assets/home/xixizu.png) no-repeat !important;
          background-size: 100% 100% !important;
        }
        .liobut{
          display: flex;
          width: 247px;
          height: 34px;
          border-radius: 17px;
          margin-left: 12px;
          background: rgba(11, 27, 56, .6);
          overflow: hidden;
          .mobsdiv{
            cursor: pointer;
            width: calc(100% / 3);
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #53E1FA;
            &>img{
              width: 20px;
              height: 20px;
              margin-right: 2px;
            }
          }
          .actvs{
            background: url(../../assets/home/minbgs.png) no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      #gisBox{
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
      }
  }
.yaoer::-webkit-scrollbar {
  background: #f5f5f5 !important;
  width: 0px !important;
  height: 5px;
}
.yaonle::-webkit-scrollbar {
  background: #f5f5f5 !important;
  width: 0px !important;
  height: 5px;
}
::v-deep .miyao .el-table__cell{
  padding: 6px 0 !important;
}
::v-deep .miyao th{
background: rgba(11, 27, 56, .5) !important;
}
::v-deep .miyao  tr{
font-size: 14px;
color: #78BFFF;
}
::v-deep .tuyaobtn .el-table__cell{
padding: 6px 0 !important;
}
::v-deep .tuyaobtn tr:nth-child(2n){
background: rgba(11, 27, 56, .5) !important;
}
::v-deep .tuyaobtn tr{
background: rgba(188, 212, 255, .1) !important;
}
.infoowk{
width: 397px;
min-height: 342px;
position: absolute;
z-index: 9;
background: url(../../assets/home/infoes.png) no-repeat;
background-size: 100% 100%;
padding: 42px 35px 31px 37px;
box-sizing: border-box;
.titues{
  font-size: 16px;
  color: #53E1FA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  .uel{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &>img{
      margin-left: 4px;
      width: 20px;
      height: 20px;
    }
  }
  .mafns{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.sepun{
  font-size: 14px;
  color: #fff;
  margin-bottom: 13px;
  &>span{
    color: #53E1FA;
  }
}
.dshx{
  width: 100%;
  border-bottom: 1px dashed #9ED9FF;
  margin-bottom: 14px;
}
}

::v-deep .el-table tbody tr:hover>td {
background-color:transparent!important;
}

::v-deep .yujtab .el-table__cell{
  padding: 6px 0 !important;
}
::v-deep .yujtab th{
background: rgba(11, 27, 56, .5) !important;
}
::v-deep .yujtab  tr{
font-size: 14px;
color: #78BFFF;
}
::v-deep .buyisty .el-table__cell{
padding: 0px 0 !important;
}
::v-deep .buyisty tr:nth-child(2n){
background: rgba(11, 27, 56, .5) !important;
}
::v-deep .buyisty tr{
background: rgba(188, 212, 255, .1) !important;
}



::v-deep .el-table {
  background-color: rgba(9, 84, 177, 0.1);
}
::v-deep .el-table tr {
  background-color: transparent;
  color: white;
}

::v-deep.el-table th {
  background-color: rgba(91, 100, 228, 0.3);
}

::v-deep .el-table th > .cell {
  color: white;
}

::v-deep.el-table td.el-table__cell {
  border-bottom: 0.5px solid rgb(108, 110, 119);
}


</style>
