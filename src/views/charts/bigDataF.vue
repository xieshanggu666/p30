<template>
    <div class="contaners" >
      <div class="miulet">
         <!-- 设备实时情况 -->
         <div class="shebqink">
            <div class="tit_s"><img class="liuzi" src="../../assets/home/sbssqk.png"/> </div>
            <div class="nemsse">
              <div class="lechar">
                <pieChart  :echartsConfig="pieChartConfig"></pieChart>
              </div>
              <div class="hensc">
                <div class="liya">
                  <img src="../../assets/home/noey1.png"/>
                  <div class="uxfas">
                      <div class="sbedv">设备在线数量</div>
                      <div class="numvs lvs">{{onlineCount}}</div>
                      <div class="ubff">{{onlineRate}}</div>
                  </div>
                </div>
                <div class="liya">
                  <img src="../../assets/home/noey2.png"/>
                  <div class="uxfas">
                      <div class="sbedv">设备离线数量</div>
                      <div class="numvs reds">{{offlineCount}}</div>
                      <div class="ubff">{{OfflineRate}}</div>
                  </div>
                </div>
                <div class="liya">
                  <img src="../../assets/home/noey3.png"/>
                  <div class="uxfas">
                      <div class="sbedv">平均故障率</div>
                      <div class="numvs reds">-</div>
                      <div class="ubff">{{faultDeviceRate}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         <!-- 运行预警情况 -->
         <div class="yunx">
          <div class="tit_s"><img class="liuzi" src="../../assets/home/yxyjqk.png"/> </div>
          <div class="yunxul">
              <vue-seamless-scroll
                  :data="getOperationData"
                 :class-option="classOption1"
                  style="width: 100%"
                  class="seamless-warp"
                >
                  <div class="jkli" v-for="(item,index) in getOperationData" :key="index">
                    <div class="uuops">
                      <div class="uuntit"> <img src="../../assets/home/gajs.png"/> {{item.Title}}</div>
                      <div class="lokj">{{item.CreateDate}}</div>
                    </div>
                    <div class="mehs">监测设备：{{item.Content}}</div>
                  </div>
              </vue-seamless-scroll>
          </div>
        </div>
         <!-- 项目设备在线率 -->
         <div class="prict" >
          <div class="tit_s"><img class="qizi" src="../../assets/home/xmsbzxl.png"/> </div>
          <div class="jindu" @mouseover="mouseover" @mouseleave="mouseleave">
            <div id="tabse">
                <div class="gaocli" v-for="(item, index) in newData" :key="index"><span>{{ item.typeName }}</span>
                  <dv-percent-pond  :config="item.configes" style="width:235px;height:16px;" />
                  <div class="mmise" :data-row="JSON.stringify(item)">{{item.rate}}%</div> 
                </div>
            </div>
            <!-- <vue-seamless-scroll
                  :data="newData"
                  :class-option="classOption1"
                  style="width: 100%"
                  :key="newData.length"
                  class="seamless-warp"
                > -->
               
            <!-- </vue-seamless-scroll> -->
          </div>
         </div>
      </div>
      <div class="miuright">
         <!-- 设备实时故障-->
         <div class="sigus" v-if="faultData.length!=0">
            <div class="tit_s ishebg"><img class="liuzi" src="../../assets/home/sebsx.png"/> </div>
            <div class="uuon" @click="actios">
                  <div class="uulist" v-if="faultData.length<=6"  v-for="(item, index) in faultData" :key="index">
                      <div class="titok">
                          <div>{{ item.pointNum }}</div>
                          <div class=" btnpb" :class="item.type=='处理中'?'cr2':item.type=='已处理'?'cr1':'cr3'"> {{ item.type }}</div>
                      </div>
                      <div class="loopd"><img src="@/assets/home/mdact1.png"/><div>项目名称：{{ item.project }}</div>  </div>
                      <div class="loopd"><img src="@/assets/home/mdact12.png"/><div>分组名称：{{ item.group_Name }}</div>  </div>
                      <div class="loopd"><img src="@/assets/home/mdact13.png"/><div>最新预警：{{ item.title }}</div>  </div>
                      <div class="loopd"><img src="@/assets/home/mdact14.png"/><div>故障时间：{{ item.lastDataTime }}</div>  </div>
                      <div class="btnGrop" >
                          <div :data-row="JSON.stringify(item)" data-type="1" >监测数据</div>
                          <div :data-row="JSON.stringify(item)" data-type="2" >运行数据</div>
                          <div :data-row="JSON.stringify(item)" data-type="3" >单相分析</div>
                          <div :data-row="JSON.stringify(item)" data-type="4" >运行预警</div>
                      </div>
                  </div>
                <vue-seamless-scroll
                    v-else
                    :data="faultData"
                    :class-option="classOptionInfo"
                    class="seamless-warp"
                    style="width: 100%"
                  >
                  <div class="uulist"  v-for="(item, index) in faultData" :key="index">
                        <div class="titok">
                            <div>{{ item.pointNum }}</div>
                            <div class=" btnpb" :class="item.type=='处理中'?'cr2':item.type=='已处理'?'cr1':'cr3'"> {{ item.type }}</div>
                        </div>
                        <div class="loopd"><img src="@/assets/home/mdact1.png"/><div>项目名称：{{ item.project }}</div>  </div>
                        <div class="loopd"><img src="@/assets/home/mdact12.png"/><div>分组名称：{{ item.group_Name }}</div>  </div>
                        <div class="loopd"><img src="@/assets/home/mdact13.png"/><div>最新预警：{{ item.title }}</div>  </div>
                        <div class="loopd"><img src="@/assets/home/mdact14.png"/><div>故障时间：{{ item.lastDataTime }}</div>  </div>
                        <div class="btnGrop" >
                            <div :data-row="JSON.stringify(item)" data-type="1" >监测数据</div>
                            <div :data-row="JSON.stringify(item)" data-type="2" >运行数据</div>
                            <div :data-row="JSON.stringify(item)" data-type="3" >单相分析</div>
                            <div :data-row="JSON.stringify(item)" data-type="4" >运行预警</div>
                        </div>
                    </div>
                </vue-seamless-scroll>
            </div>
        </div>
         <!-- 实时预警信息 -->
         <div class="siyuj">
            <div class="tit_s ishebg"><img class="liuzi" src="../../assets/home/sisiyx.png"/> </div>
            <div class="uotos">
                <div class="letab">
                    <div v-for="(item,index) in sitab" :key="index" @click="actab(index)" :class="sitabindex==index?'actsd':''">{{item}}</div>
                </div>
                <div class="ribns" @click="gobtn()">近30天预警信息</div>
            </div>
            <div class="mimtabs">
                <div class="tablist" v-if="sitabindex==0">
                      <el-table
                      :data="getAlarmData"
                      class="yujtab"
                    >
                      <el-table-column
                        prop="Title"
                        label="预警标题"
                        align="left"
                        width="350px"
                      />
                      <el-table-column
                        prop="Content"
                        label="预警内容"
                        align="left"
                        width="556px"
                      />
                      <el-table-column
                        prop="Level"
                        label="预警等级"
                        align="left"
                        width="160px"
                      />
                      <el-table-column
                        prop="CreateDate"
                        label="预警时间"
                        align="left"
                        width=""
                      />
                      <el-table-column label="操作"  align="center">
                        <template #default="scope">
                          <el-button
                            size="mini"
                            type="primary"
                            >监测数据</el-button
                          >
                          <el-button
                            size="mini"
                            type="danger"
                            >运行数据</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <div class="hestab" @click="metabs">
                      <vue-seamless-scroll
                        :data="getAlarmData"
                        :class-option="classOptionInfo"
                        class="seamless-warp"
                        style="width: 100%"
                      >
                          <el-table
                          :data="getAlarmData"
                          class="buyisty"
                          :show-header="false">
                              <el-table-column
                                prop="Title"
                                label="预警标题"
                                align="left"
                                width="350px"
                              >
                                <template #default="scope">
                                  <div class="contenty">
                                    {{scope.row.Title}}
                                  </div>
                                </template>
                              </el-table-column>  
                              <el-table-column
                                prop="Content"
                                label="预警内容"
                                align="left"
                                width="556px"
                              >
                                  <template #default="scope">
                                    <div class="contenty">
                                      {{scope.row.Content}}
                                    </div>
                                  </template>
                              </el-table-column>  
                              <el-table-column
                                prop="Level"
                                label="预警等级"
                                align="left"
                                width="160px"
                              >
                                <template #default="scope">
                                  <div class="nidas">
                                    <div class="yneis"><div :class="yudenj[scope.row.Level]">{{scope.row.Level}}</div> </div>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="CreateDate"
                                label="预警时间"
                                align="left"
                                width=""
                              />
                              <el-table-column label="操作"  align="center">
                                <template #default="scope">
                                  <div class="ufelx">
                                    <div :data-row="JSON.stringify(scope.row)" data-type="1" class="cots mr10" >监测数据</div>
                                    <div :data-row="JSON.stringify(scope.row)" data-type="2" class="cots" @click="handleO(scope.row)">运行数据</div>
                                  </div>
                                </template>
                              </el-table-column>
                        </el-table>
                    </vue-seamless-scroll>
                    </div>
                </div>
                <div class="tablist"  v-if="sitabindex==1"> 
                  <chartL
                    :id="'line'"
                  ></chartL>
                </div>
            </div>
         </div>
      </div>
    </div>
    <Device ref="device"></Device>
    <DeviceW ref="devicew"></DeviceW>
    <Record ref="record"></Record>
    <RecordW ref="recordw"></RecordW>
    <Analyse ref="analyse"></Analyse>
    <Warning ref="warning"></Warning>
    <OperationWarning ref="opw"></OperationWarning>
  </template>
  
  <script>
  import pieChart from "./components/pieChart.vue";
  import moment from "moment";
  import mixinGis from "./mixinData/gis";
  import chart from "./components/chartbar.vue";
  import chartline from "./components/chartline.vue";
  import chartL from "./components/chart.vue";
  import mixinBasic from "./mixinData/basic";
  import MixinIndex from "./mixinData/index";
  import Record from "./components/Mon_Record.vue";
  import RecordW from "./components/Mon_RecordW.vue";
  import Device from "./components/Mon_Operation.vue";
  import DeviceW from "./components/Mon_OperationW.vue";
  import Analyse from "./components/Analyse_Uniphase.vue";
  import pointDetail from "./components/point-detail/index.vue";
  import Warning from "./components/Warning.vue";
  import OperationWarning from "./components/OperationWarning.vue";
  let scrollTime=null;
  export default {
    name: "scroll",
    components: {
      pieChart,
      chart: chart,
      chartL: chartL,
      Device: Device,
      DeviceW: DeviceW,
      Record: Record,
      RecordW: RecordW,
      Analyse: Analyse,
      Warning: Warning,
      pointDetail: pointDetail,
      chartline: chartline,
      OperationWarning: OperationWarning,
    },
    // mixins: [mixinGis, mixinBasic, MixinIndex],
    data() {
      return {
        //无缝滚动
			  scrollPosition:0, 
        //预警信息标签匹配
        yudenj:{"蓝色预警":'buisij1',"橙色预警":'buisij2',"黄色预警":'buisij3',"红色预警":'buisij4'},
        pieChartConfig:{
            seriesData:{
                name:'',total:'0', data:[
                    {name:'在线',value:'0',color:'#37E1FF'},
                    {name:'离线',value:'0',color:'#F3C13D'},
                ]
            }
        },
        //实时预警信息
        sitabindex:0,
        sitab:["列表","图表"],
        //项目设备在线
        configes1:{
          value:24.5,
          colors:['#37E1FF', '#37E1FF'],
          borderWidth:0,
          borderGap:0,
          lineDash:[3, 1]
        },
        starts: true, //显示图表
        gisStyle: null,
        activeName: "first",
        chartData: {},
        listData: [],
        nodeDetailStyle: {
          right: 0,
        },
  
        // 高度
        contentStyleObj: {
          width: "1200px",
          height: "",
        },
        contentStyleObj3: {
          width: "1200px",
          height: "",
        },
        contentStyleObj2: {
          height: "",
        },
        getDevGnss: {}, //设备在线离线
        getDevOther: {}, //设备在线离线
        getAlarmData: [], //预警信息表格
        getOperationData: [], //运行预警表格
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
        // 实时设备运行情况
        OnlineStatistic: "",
        totalCount: "",
        onlineCount: "",
        offlineCount: "",
        onlineRate:'',  //设备在线率
        OfflineRate:'',  //设备离线率
        faultDeviceRate: "",
        newData: [],
        newDatas:[1,2,3,4,5],
        faultData: [
          // {
          //   project: "1",
          //   group_Name: "11",
          //   title: "11",
          //   lastDataTime: "11",
          // },
          //  {
          //   project: "1",
          //   group_Name: "11",
          //   title: "11",
          //   lastDataTime: "11",
          // }, {
          //   project: "1",
          //   group_Name: "11",
          //   title: "11",
          //   lastDataTime: "11",
          // }, {
          //   project: "1",
          //   group_Name: "11",
          //   title: "11",
          //   lastDataTime: "11",
          // }, {
          //   project: "1",
          //   group_Name: "11",
          //   title: "11",
          //   lastDataTime: "11",
          // },
        ],
        timer1Active: false,
        timer2Active: false,
        intervalId1: null,
        intervalId2: null,
      };
    },
    watch: {},
    created () {
    //   window.addEventListener("resize", this.onWindowResize);
    },
    mounted() {
      this.pageInit();
      this.getHeight();
      this.getHeight2();
      this.GeAlarmInfo();
      this.getOpData();
  
      this.Timer = setInterval(() => {
        this.setNowTimes();
      }, 1000);
  
    //   this.onWindowResize();
    //   setTimeout(() => {
    //     this.onWindowResize();
    //   }, 100);
    },
    destroyed() {
    //   window.removeEventListener("resize", this.onWindowResize);
      this.stopTimer();
    },
    beforeUnmount(){
      clearInterval(scrollTime);
      scrollTime=null;
    },
    beforeDestroy() {
      this.stopTimer();
    },
    computed: {
      classOption() {
        return {
          step: 0.5, // 数值越大速度滚动越快
          limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 0, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          // singleHeight: 200, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          // singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          // waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
        };
      },
      classOption1() {
        return {
          step: 0.3, // 数值越大速度滚动越快
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
          step: 0.3, // 数值越大速度滚动越快
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
      //鼠标移上事件
			mouseover(){
				if(scrollTime){
					clearInterval(scrollTime);
				}
			},
			//鼠标移开事件
			mouseleave(){
				if(this.newData.length>3){ this.startScrolling();}
			},
			//无缝自动无限滚
			startScrolling() {
        try {
          scrollTime=setInterval(() => {
            const table = document.getElementById('tabse');
            this.scrollPosition -= 1; // 每次滚动位置减少1
            if(!table){return false}
            if(table.clientHeight/2==Math.abs(this.scrollPosition)){
              this.scrollPosition=0;
            }
            table.style.transform = `translateY(${this.scrollPosition}px)`;
          }, 50); // 50毫秒滚动一次
        } catch (error) {
          
        }
			},
      //设备实时故障点击事件
      actios(e){
        try {
          const row = JSON.parse(e.target.dataset?.row); // 使用dataset获取当前点击行的数据
          const type=e.target.dataset?.type;
          switch (type) {
            case '1'://监测数据
              this.goteerR(row);
              break;
            case '2'://运行数据
              this.goteerO(row);
              break;
            case '3'://单向分析
              this.goteerW(row);
              break;
            case '4'://运行数据
              this.goteerS(row);
              break;  
          }
        }catch (error) {}
      },
      //实时预警信息点击事件
      metabs(e){
        try {
          const row = JSON.parse(e.target.dataset?.row); // 使用dataset获取当前点击行的数据
          const type=e.target.dataset?.type;
          if(type=='1'){
            this.handleR(row);
          }
          if(type=='2'){
            this.handleO(row);
          }
        }catch (error) {}
      },
      
      //实时预警信息 tab切换
      actab(index){
        this.sitabindex=index;
      },
      // 预警信息跳转数据按钮
      handleR(e) {
        let str = e.CreateDate;
        // var newStr = str.replace(/\//g, "-");
        this.$refs.recordw.openRecordw(e, str);
      },
      handleO(e) {
        let str = e.CreateDate;
        // var newStr = str.replace(/\//g, "-");
        this.$refs.devicew.openOperationW(e, str);
      },
  
      // tab切换
      handleClick(tab, event) {
        console.log(tab, event);
      },
  
      // 开始定时器
      startTimer() {
        if (!this.timer1Active) {
          this.intervalId1 = setInterval(() => {
            // 执行第一个定时器任务
            this.pageInit();
          }, 300000);
          this.timer1Active = true;
        }
      },
      // 清除定时器
      stopTimer() {
        if (this.intervalId1) {
          clearInterval(this.intervalId1);
          this.intervalId1 = null;
          this.timer1Active = false;
        }
      },
      // 屏幕
      onWindowResize() {
        // const w = 1920;
        // const h = 1080;
        // const scaleW = document.body.clientWidth / w;
        // const scaleH = document.body.clientHeight / h;
        // const appDom = document.querySelector(".nier_ye") || null;
        // appDom.style.cssText = `transform: scale(${scaleW})`;
        // appDom.style.cssText = `transform: scale(${scaleW}, ${scaleH})`;
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
  
      // 适应屏幕
      getHeight() {
        this.startTimer();
        if (window.innerHeight < 768 || window.innerHeight < 1080) {
          this.contentStyleObj.height = "290px";
          this.contentStyleObj3.height = "290px";
        } else {
          this.contentStyleObj.height = window.innerHeight - 630 + `px`;
          this.contentStyleObj3.height = window.innerHeight - 630 + `px`;
        }
      },
  
      getHeight2() {
        if (
          window.innerHeight < 768 ||
          window.innerHeight < 1080 ||
          window.innerHeight <= 1980
        ) {
          this.contentStyleObj2.height = "240px";
        } else {
          this.contentStyleObj.height = window.innerHeight - 550 + `px`;
        }
      },
  
      // 设备故障跳转按钮
      goteerR(item) {
        this.$refs.record.openRecord(item);
      },
      goteerO(item) {
        this.$refs.device.openOperation(item);
      },
      goteerW(item) {
        this.$refs.analyse.openAnalyse(item);
      },
      goteerS(item) {
        this.$refs.opw.openAnalyse(item);
      },
  
      pageInit() {
        // 设备总数
        let url = "/api/Mon_DevOps_Manager/GetProjectOnlineStatistic";
        this.http.get(url, {}, true).then((result) => {
          this.OnlineStatistic = result.data;
          this.totalCount = result.data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.totalCount;
          }, 0);
          this.onlineCount = result.data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.onlineCount;
          }, 0);
          this.offlineCount = this.totalCount - this.onlineCount;

          this.pieChartConfig.seriesData.total= this.totalCount;
          this.pieChartConfig.seriesData.data=[
              {name:'在线',value:this.onlineCount,color:'#37E1FF'},
              {name:'离线',value:this.offlineCount,color:'#F3C13D'},
          ]
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
        // 项目设备在线率
        this.typeOnlineStatistic();
        // 设备故障率
        this.faultDevice();
      },
      


      //小数精确
      moneySwitch:(symbol, number1, number2, ...args) =>{
            if(!['+','-','*','/'].includes(symbol)){
                throw new Error('第一个参数请传+ - * /计算符');
            }
            const num1 = Number(number1);
            const num2 = Number(number2);
            if(isNaN(num1) || isNaN(num2)){
                throw new Error('第二，三个参数必须传入可计算数字或字符');
            }
            let result = 0;
            // 把浮点数跟整数部分拆解
            const [num1BeforeInt, num1Float] = num1.toString().split('.');
            const [num2BeforeInt, num2Float] = num2.toString().split('.');
        
            const num1FloatLen = num1Float?.length || 0;
            const num2FloatLen = num2Float?.length || 0;
        
            // 乘除法直接去掉浮点
            const num1Int = Number(num1.toString().replace('.',''));
            const num2Int = Number(num2.toString().replace('.',''));
        
            if(symbol === '+' || symbol === '-'){
                // 以最长浮点数长度补0
                let m = Math.max(num1FloatLen, num2FloatLen);
                // 使用字符串补0方式得到最后计算数值（不能直接数字升幂，部分数字升幂就会缺精度）
                const resNum1 = Number(`${num1BeforeInt}${num1Float.padEnd(m,'0')}`);
                const resNum2 = Number(`${num2BeforeInt}${num2Float.padEnd(m,'0')}`);
                if(symbol === '+'){
                    result = (resNum1 + resNum2) / Math.pow(10, m);
                }else{
                    result = (resNum1 - resNum2) / Math.pow(10, m);
                }
        
            }else if(symbol === '*'){
                // 两个数的浮点长度加和为幂值
                let m = Math.pow(10, num1FloatLen + num2FloatLen);
                result = (num1Int * num2Int ) / m;
            }else if(symbol === '/'){
                // 被除数的浮点长度减除数浮点长为幂值
                let m = Math.pow(10, num2FloatLen - num1FloatLen)
                result = (num1Int  / num2Int ) * m;
            }
            // 有第三位计算数字
            const nextNum = args[0];
            if(nextNum){
            args.shift()
            result =  _Calc(symbol, result, nextNum, ...args);
        }
        return result;
    },

      // 故障率
      faultDevice() {
        this.http
          .get("/api/Mon_DevOps_Manager/GetFaultDevice", {}, true)
          .then((result) => {
            this.faultData = result.data;
            this.faultData.forEach((item) => {
              item.type = "处理中"; // 将typeName作为type属性的值
            });
          });
      },
      // 项目设备在线率
      typeOnlineStatistic() {
  
        this.http
          .get("/api/Mon_DevOps_Manager/GetTypeOnlineStatistic", {}, true)
          .then((result) => {
              this.newData = result.data.map((item) => ({
              typeName: item.typeName,
              rate: Number(item.rate.slice(0, -1)), // 截取到位置-1，去掉%
              onlineCount: item.onlineCount,
              totalCount: item.totalCount,
              configes:{
                value:Number(item.rate.slice(0, -1)),
                colors:['#37E1FF', '#37E1FF'],
                borderWidth:0,
                borderGap:0,
                lineDash:[3, 1]
              }
            }));
            this.newData = this.newData.filter((device) => device.rate !== 0);
            if(scrollTime){clearInterval(scrollTime);}
            if(this.newData.length>3){  //限制几条内容才开始滚动
              this.newData=[...this.newData,... this.newData] ;
              this.startScrolling();
            }
          });
      },
      // 返回组
      callback() {
        this.CallBackGroup();
      },
  
      // 时间过滤
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
  
      // 
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
          this.getDevGnss = result.data.gnss;
          this.getDevOther = result.data.other;
        });
      },
  
      // 查询预警信息详情
      gobtn() {
        let startMT = this.filterTime(this.form.datePicker.defaultTime[0]);
        let endMT = this.filterTime(this.form.datePicker.defaultTime[1]);
        this.$refs.warning.openWarning(
          this.filterTime(startMT),
          this.filterTime(endMT)
        );
      },
  
      // 用于顶部跳转系统
      gogogo() {
        this.$router.replace("/bigdata");
      },
      gogogoItem() {
        this.$router.replace("/Mon_Point_Manager");
        // this.$router.replace("/Gomoku");
      },
  
      // 预警信息
      GeAlarmInfo() {
        // this.http.get("api/BigScreen/GeAlarmInfo").then((result) => {
        //   this.getAlarmData = result.data;
        // });
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
        param.wheres = `[{"name":"CreateDate","value":"${formattedThreeDaysAgo}","displayType":"thanorequal"},{"name":"CreateDate","value":"${formattedToday}","displayType":"lessorequal"},{"name":"Deal_State","value":"0","displayType":"select"}]`;
        this.http
          .post("/api/Ala_Infomation/getPageData", param, true)
          .then((result) => {
            this.getAlarmData = result.rows;
            this.getAlarmData.forEach((item) => {
              if (item.Level === 0) {
                item.Level = "蓝色预警";
              } else if (item.Level === 1) {
                item.Level = "黄色预警";
              } else if (item.Level === 2) {
                item.Level = "橙色预警";
              } else {
                item.Level = "红色预警";
              }
            });
          
            //  this.total = result.total;
          });
      },
  
      // 运行预警
      getOpData(){
        // getOperationData
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
        // param.wheres = `[{\'name\':\ 'CreateDate', \'value\':\' ${treeId}\'}]`;
        param.wheres = `[{"name":"CreateDate","value":"${formattedThreeDaysAgo}","displayType":"thanorequal"},{"name":"CreateDate","value":"${formattedToday}","displayType":"lessorequal"}]`;
        this.http
          .post("/api/Ala_Operationinfo/getPageData", param, true)
          .then((result) => {
            this.getOperationData = result.rows;
            this.getAlarmData.forEach((item) => {
              if (item.Level === 0) {
                item.Level = "蓝色预警";
              } else if (item.Level === 1) {
                item.Level = "黄色预警";
              } else if (item.Level === 2) {
                item.Level = "橙色预警";
              } else {
                item.Level = "红色预警";
              }
            });
            //  this.total = result.total;
          });
      },
    },
  };
  </script>
  
<style scoped lang="scss">
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
    .qizi{
        width: 140px;
        height: 21px;
    }
}
.ishebg{
    background:url(../../assets/home/hesdbg.png) no-repeat !important;
    background-size: 100% 100% !important;
}
.contaners{
    width: 100%;
    height: 100%;
    padding: 72px 15px 15px;
    display: flex;
    position: absolute;
    z-index: 2;
    justify-content: space-between;
    background: url(../../assets/home/jiybg.png) no-repeat;
    background-size: 100% 100%;

    .miulet{
        width: 23.8%;
        height: 100%;
        background: rgba(13,38,84,0.4);
        .shebqink{
            width: 100%;
            height: 21.19%;
            .nemsse{
              width: 100%;
              height: calc(100% - 36px);
              display: flex;
              align-items: center;
              padding: 0 23px 0 34px;
              box-sizing: border-box;
              .lechar{
                width: 137px;
                height: 137px;
                background: url(../../assets/home/donmao.png) no-repeat;
                background-size: 100% 100%;
                margin-right: 21px;
              }
              .hensc{ 
                width: calc(100% - 158px);
                .liya{
                  width: 100%;
                  display: flex;
                  align-items: center;
                  &>img{
                    width: 36px;
                    height: 36px;
                    margin-right: 4px;
                  }
                  .uxfas{
                    width: calc(100% - 40px);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #fff;
                    .sbedv{
                      width: 84px;
                    }
                    .numvs{
                      text-align: center;
                      width: 23px;
                    }
                    .lvs{
                        color: #52FF9B;
                    }
                    .reds{
                        color:#FB6B6B,
                    }
                    .ubff{
                      width: 40px;
                    }
                  }
                }
              }
            }
        }
        .yunx{
            width: 100%;
            height:41.99%;
            .yunxul{
              width: 100%;
              height: calc(100% - 68px);
              padding-top: 11px;
              overflow: hidden;
              .jkli{
                width: 100%;
                height: 83px;
                margin-bottom: 3px;
                background: url(../../assets/home/qinborder.png) no-repeat;
                background-size: 100% 100%;
                padding: 17px 0 21px 0px;
                .uuops{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding:0  21px 0 15px;
                  margin-bottom: 9px;
                  img{
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                  }
                  .uuntit{
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #53E1FA;
                  }
                  .lokj{
                    font-size: 14px;
                    color: #FFFFFF;
                  }
                }
                .mehs{
                  width:calc(100% - 61px);
                  margin-left: 40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-size: 14px;
                  color: #FFFFFF;
                  white-space: nowrap;
                }
              }
            }
        }
        .prict{
            width: 100%;
            height:36.71%;

            .jindu{
                    width: 100%;
                    height: calc(100% - 36px);
                    padding-top: 15px;
                    overflow: hidden;
                    position: relative;
                    .gaocli{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        color: #fff;
                        margin-bottom: 23px;
                        &>span{
                          width: 137px;
                          white-space: nowrap;
                          display: inline-block;
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          text-align: right;
                          margin-right: 7px;
                        }
                        .mmise{
                          width: 48px;
                          text-align: left;
                          margin-left: 8px;
                        }
                    }
                    .dv-percent-pond{
                        background: rgba(108, 177, 241, .15);
                    }
                    ::v-deep .dv-percent-pond text{
                        display: none !important;
                    }
                    #tabse{
                      width: 100%;
                      height: auto;
                      position: absolute;
                    }
	
                }
        } 
    }
    .miuright{
        width: 75.555%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .sigus{
            width: 100%;
            max-height: 57.09%;
            height: auto;
            background: rgba(13,38,84,0.5);
            margin-bottom: 35px;
            .uuon{
                width: 100%;
                height: auto;
                max-height:45.5vh;
                padding-top: 13px;
                overflow: hidden;
                display: flex;
                flex-wrap: wrap;
                .uulist{
                    float: left;
                    width: calc((100% - 36px)  / 4);
                    height: 233px;
                    margin: 0 12px 11px 0;
                    background: url(../../assets/home/divhe.png) no-repeat;
                    background-size: 100% 100%;
                    padding-top: 5px;
                    cursor: pointer;
                    .titok{
                        width: 100%;
                        height: 33px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 14px 0 18px;
                        font-size: 14px;
                        color: #FFFFFF;
                        margin-bottom: 15px;
                        .btnpb{
                            padding: 7px 10px 6px 11px ;
                            box-sizing: border-box;
                            cursor: pointer;
                            border-radius: 6px;
                            font-size: 12px;
                        }
                        .cr1{
                            background: rgba(255, 134, 61, .25);
                            color: #FF863D;
                        }
                        .cr2{
                            background: rgba(82, 255, 155, .25);
                            color: #52FF9B;
                        }
                        .cr3{
                            background: rgba(255,255,255,0.25);
                            color: #fff;
                        }
                    }
                    .loopd{
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: #FFFFFF;
                        line-height: 24px;
                        display: flex;
                        align-items: center;
                        padding: 0 14px 0 16px;
                        &>img{
                            width: 24px;
                            height: 24px;
                            margin-right: 6px;
                        }
                        &>div{
                            width: calc(100% - 31px);
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .btnGrop{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 6px 19px 0;
                        &>div{
                            width: calc((100% - 34px) / 4);
                            height: 28px;
                            line-height: 28px;
                            text-align: center;
                            border: 1px solid rgba(101,228,251,0.25);
                            background: rgba(101,228,251,0.25);
                            font-size: 14px;
                            color: #37E1FF;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        &>div:hover{
                            border: 1px solid #65E4FB;
                        }
                    }
                }
                .uulist:nth-child(4n){
                    margin-right: 0;
                }
                .uulist:hover{
                    background: url('../../assets/home/hover.png') no-repeat !important;
                    background-size: 100% 100% !important;
                }
            }
        }
        .siyuj{
           flex: 1;
           display: flex;
           flex-direction: column;
           background: rgba(13,38,84,0.7);
           .uotos{
                padding: 11px 14px;
                display: flex;
                justify-content: space-between;
                .letab{
                    width: 164px;
                    height: 31px;
                    background: rgba(11, 27, 56, .51);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    &>div{
                        width: 50%;
                        height: 100%;
                        line-height: 31px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 14px;
                        color: #FFFFFF;
                        cursor: pointer;
                    }
                    .actsd{
                        color: #53E1FA;
                        background: url(../../assets/home/els.png) no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .ribns{
                    padding: 7px 18px 7px;
                    box-sizing: border-box;
                    border-radius: 16px;
                    font-size: 14px;
                    color: #53E1FA;
                    cursor: pointer;
                    background: rgba(101, 228, 251, .25);
                }
           }
           .mimtabs{
                flex:1;
                .tablist{
                  width: 100%;
                  height: 100%;
                }
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
                  .ufelx{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
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
                        background: rgba(255,255,255,0.15);
                        border-radius: 6px;
                        line-height: 28px;
                        font-size: 14px;
                        text-align: center;
                        color: #ff0000;
                      }
                    }
                  }
                  .cots{
                    font-size: 14px;
                    color: #53E1FA;
                    cursor: pointer;
                  }
                  .mr10{
                    margin-right: 10px;
                  }
                }
           }
        }
    }
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

.buyisty{
  .contenty{
    width: 100%;
    min-height: 57px;
    padding: 10px 0;
    text-align: justify;
    display: flex;
    align-items: center;
    line-height: 20px !important;
  }
}

::v-deep .buyisty{
  .cell{
    // padding-top:10px;
    // padding-bottom: 10px;
    // display: flex;
    // align-items: center;
    // min-height: 57px !important;
    // line-height: 20px !important;
  }
  td.el-table__cell{
    border-bottom: none !important;

  }
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
::v-deep .el-table tbody tr:hover>td {
  background-color:transparent!important;
}
::v-deep .el-table{
  --el-table-border-color: none !important;
}








  @import "./css/index.scss";
  
  ::v-deep .el-tabs__nav-wrap::after {
    width: 0px !important;
  }
  ::v-deep .el-tabs__item {
    color: rgb(219, 211, 211);
  }
  
  ::v-deep .gradient-progress .el-progress-bar__inner {
    background: linear-gradient(to right, #ffc107, #ff5722);
  }
  
  ::v-deep .el-progress__text {
    color: #ffffff;
  }
  //
  ::v-deep .buit_ .el-table__header-wrapper .el-table__header {
    width: 390px !important;
  }
  ::v-deep .buit_ .el-table__body {
    width: 390px !important;
  }
  
  ::v-deep .bot_cen .el-table__header-wrapper .el-table__header {
    width: 980px !important;
  }
  ::v-deep .bot_cen .el-table__body {
    width: 980px !important;
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
  ::v-deep.el-table td {
    // background-color: rgba(19, 70, 131, 0.7) !important;
  }
  
  ::v-deep .el-table th > .cell {
    color: white;
  }
  ::v-deep .el-table td.el-table__cell {
    // background-color: rgba(39, 115, 207, 0.3) !important;
  }
  
  ::v-deep.el-table td.el-table__cell {
    border-bottom: 0.5px solid rgb(108, 110, 119);
  }
  
  ::v-deep
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell {
    background-color: rgba(91, 100, 228, 0.3);
  }
  
  .min {
    padding: 20px 88px;
  }
  .min2 {
    padding: 30px 20px;
  }
  .min3 {
    padding: 22px 20px;
  }
  .page-example {
    display: flex;
    width: 390px;
    overflow: hidden;
    border: 1px solid skyblue;
  }
  .page-example2 {
    display: flex;
    width: 390px;
    height: 210px;
    overflow: hidden;
    border: 1px solid skyblue;
  }
  .seamless-warp2 {
    height: 300px;
    overflow: hidden;
  }
  
  .page-example3 {
    display: flex;
    width: calc(100vw - 540px);
    overflow: hidden;
    border: 1px solid skyblue;
    margin-top: 20px;
  }
  ::v-deep .top .el-table__body-wrapper {
    display: none;
  }
  ::v-deep .bottom .el-table__header-wrapper {
    display: none;
    width: 100%;
  }
  .seamless-warp {
    height: 400; //预警表格
    overflow: hidden;
  }
  .middle {
    .middle-top {
      .content {
        position: absolute;
        top: 100px;
        left: 80px;
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
        display: block;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
  
        #content-block {
          span {
            margin: 0;
            width: auto;
          }
        }
  
        .block-font {
          font-size: 20px;
          border-bottom: 1px solid #ab3fcc;
          padding-bottom: 5px;
        }
  
        .block-title {
          font-size: 20px;
          padding-top: 5px;
        }
  
        .block-0 {
          height: 142px;
          width: 300px;
          background-position: center;
          background-repeat: no-repeat;
          display: inline-block;
          padding: 20px 28px;
          box-sizing: border-box;
        }
  
        span {
          margin-top: 140px;
          width: 89px;
          margin-right: 10px;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  
    .middle-bottom {
      // .echarts-box {
      //   height: 320px;
      // }
    }
  }
  
  .nier_ye {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: #000;
  }
  .botcenInfo {
      width: 100px;
      position: absolute;
      top: 66px;
      left: 210px;
      color: black;
      cursor: pointer;
      z-index: 99999;
    }
  .waic_ {
    width: 100%;
    height: 159px;
    background: url("../../../public/static/bigdata/head_.png") no-repeat center;
    background-size: 100% 100%;
  }
  .herder_s {
    width: 100%;
    height: 105px;
    position: fixed;
    // z-index: 9999;
    background: url("../../../public/static/bigdata/herder.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
  }
  .he_l {
    width: calc((100% - 890px) / 2);
    height: 50px;
    position: absolute;
    left: 0;
  }
  .yun_ {
    display: flex;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    color: #37abf5;
    line-height: 34px;
    position: absolute;
    left: 28px;
    top: 35px;
  }
  .yun_ > img {
    width: 34px;
    height: 34px;
    margin-right: 8px;
  }
  .he_r {
    width: calc((100% - 890px) / 2);
    height: 100px;
    position: absolute;
    right: 0;
  }
  .rice {
    width: 304px;
    height: 34px;
    line-height: 34px;
    position: absolute;
    left: 15px;
    font-size: 16px;
    top: 36px;
    cursor: pointer;
    color: #39b1fe;
    background: url("../../../public/static/bigdata/righ_y.png") no-repeat center;
    background-size: 100% 100%;
  }
  .rig_ce {
    right: 17px;
    top: 37px;
    position: absolute;
    display: flex;
    align-items: center;
  }
  .ce_time {
    font-size: 28px;
    color: #39b1fe;
    margin-right: 16px;
  }
  .gh_fls {
    font-size: 15px;
    color: #39b1fe;
    margin-bottom: 5px;
  }
  .rhk_ {
    width: 304px;
    height: 34px;
    line-height: 34px;
    position: absolute;
    right: 15px;
    top: 36px;
    background: url("../../../public/static/bigdata/lef_y.png") no-repeat center;
    background-size: 100% 100%;
    font-size: 16px;
    color: #39b1fe;
    text-align: left;
    padding-left: 77px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .tus {
    // width: 890px;
    // height: 56px;
    font-size: 38px;
    position: absolute;
    color: #ffffff;
    top: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
  .left_ {
    height: calc(100vh - 115px);
    width: 438px;
    position: fixed;
    z-index: 999;
    top: 105px;
    left: 0px;
    background: url("../../../public/static/bigdata/letbg.png") no-repeat center;
    background-size: 100% 100%;
  }
  .le_yi {
    padding: 13px 10px;
    box-sizing: border-box;
  }
  .le_yi2 {
    padding: 13px 22px;
    box-sizing: border-box;
  }
  .buit_ {
    width: 219px;
    height: 42px;
    font-size: 16px;
    line-height: 42px;
    color: #fff;
    background: url("../../../public/static/bigdata/titbg.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
  }
  .tab_ {
    width: 100%;
    margin-top: 17px;
    border: none;
  }
  .tab_ thead {
    width: 100%;
    height: 34px;
    color: #fff;
  
    background: linear-gradient(
      to bottom,
      rgba(0, 144, 255, 0.1),
      rgba(51, 147, 255, 0.2)
    );
    box-shadow: 0px -1px 0px 0px rgba(51, 147, 255, 0.6);
  }
  .tab_ tr {
    height: 38px;
    border: none;
    background: rgba(0, 222, 255, 0.04);
  }
  .tab_ th {
    border: none;
    font-size: 13px;
    font-weight: 400 !important;
    text-align: center;
  }
  .tab_ td {
    font-size: 12px;
    color: #95bdff;
    text-align: center;
    border: none;
  }
  .niiu_he {
    margin-top: 19px;
    width: 100%;
    height: 320px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .niiu_he::-webkit-scrollbar {
    width: 0;
  }
  
  .niiu_he3 {
    width: 100%;
    height: 220px;
  }
  .niiu_he3 ::-webkit-scrollbar {
    width: 0;
  }
  
  .niiu_he2 {
    margin-top: 19px;
    width: 100%;
    height: 220px;
    overflow: hidden;
    overflow-y: scroll;
    .onlineItem {
      display: flex;
      margin-top: 4px;
    }
  }
  .sdsdd {
    overflow: hidden;
    overflow-y: scroll;
    .onlineItem {
      display: flex;
      margin-top: 4px;
    }
  }
  .sdsdd::-webkit-scrollbar {
    width: 0;
  }
  .niiu_he2::-webkit-scrollbar {
    width: 0;
  }
  
  .niiu_he4 {
    margin-top: 19px;
    width: 100%;
    height: 260px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .niiu_he4::-webkit-scrollbar {
    width: 0;
  }
  .nimuzi {
    width: 100%;
    height: 88px;
    background: url("../../../public/static/bigdata/liut.png") no-repeat center;
    background-size: 100% 100%;
    margin-bottom: 14px;
    padding: 17px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  
  .nimuzi3 {
    width: 100%;
    height: 40px;
    background: url("../../../public/static/bigdata/liut.png") no-repeat center;
    background-size: 100% 100%;
    margin-bottom: 14px;
    padding: 17px 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // align-items: center;
    cursor: pointer;
    color: #ffffff;
  
    .item1 {
      font-size: 18px;
      color: #ffffff;
    }
    .item2 {
      display: flex;
      justify-content: flex-end;
      font-size: 24px;
      color: #ffffff;
    }
  }
  
  .nimuzi2 {
    width: 100%;
    height: 60px;
    background: url("../../../public/static/bigdata/liut.png") no-repeat center;
    background-size: 100% 100%;
    margin-bottom: 14px;
    padding: 17px 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // align-items: center;
    cursor: pointer;
    color: #ffffff;
  
    .item1 {
      font-size: 18px;
      color: #ffffff;
    }
    .item2 {
      display: flex;
      justify-content: flex-end;
      font-size: 24px;
      color: #ffffff;
    }
  }
  .sui_img {
    width: 54px;
    height: 54px;
    margin-right: 25px;
  }
  .liu_l {
    text-align: left;
    font-size: 18px;
    color: #ffffff;
    margin-bottom: 4px;
  }
  .sid_z {
    display: flex;
    font-size: 18px;
  }
  .zaixian {
    color: #41ff5c;
    cursor: pointer;
  }
  .zaixian > label {
    color: #fff;
    margin-left: 10px;
  }
  .zaixian2 {
    color: #fff;
    // float: right;
    display: flex;
    justify-content: flex-end;
  }
  .lixin {
    color: #ffef40;
    margin-left: 49px;
    cursor: pointer;
  }
  .lixin > label {
    color: #fff;
    margin-left: 10px;
  }
  
  .zuhaun {
    width: 100%;
    height: calc(100% - 42px);
  }
  .botts {
    width: 100%;
    // height: 160px;
    background: url("../../../public/static/bigdata/bots.png") no-repeat center;
    background-size: 100% 100%;
    position: fixed;
    bottom: 0;
    z-index: 99;
  }
  .bot_cen2 {
    background: url("../../../public/static/bigdata/bot_cen.png") no-repeat center;
    background-size: 100% 100%;
    width: calc(100vw - 480px);
    height: 355px;
    left: 62%;
    top: 105px;
    transform: translateX(-50%);
    position: fixed;
    z-index: 99;
    padding: 18px 22px;
    box-sizing: border-box;
    .home-content {
      width: calc(100vw - 400px);
      height: 280px;
      position: absolute;
      box-sizing: border-box;
  
      .home-list {
        margin: 20px;
        // display: grid;
        display: flex;
        // flex-wrap: wrap;
        flex-wrap: nowrap;
        -moz-column-gap: 12px;
        column-gap: 12px;
        grid-template-columns: repeat(5, auto);
      }
  
      .list-item {
        width: 335px;
        position: relative;
        cursor: pointer;
        margin-bottom: 12px;
        transition: transform 0.8s;
        .content2 {
          position: relative;
          height: 360px; //每个框的宽度
          // padding-left: 40px;
          background: rgba(51, 147, 255, 0.8);
          display: flex;
          align-items: center;
          transition: all 1.5s;
          border-radius: 5px;
          overflow: hidden;
  
          .content-right {
            color: #1d252f;
            padding: 0px 10px;
  
            .el-icon-warning-outline {
              margin-right: 5px;
            }
          }
  
          .name {
            transition: transform 0.5s;
            color: white;
            font-size: 18px;
            font-weight: 500;
            padding-top: 5px;
          }
  
          .data {
            font-size: 12px;
            font-family: Source Han Sans CN, sans-serif;
            color: #e7dede;
            margin-top: -10px;
          }
          .btn {
            width: 330px;
            margin-top: 15px;
            display: flex;
            font-size: 12px;
            color: #000;
            position: relative;
            z-index: 9999;
            .item {
              margin-right: 20px;
              width: 110px;
              height: 30px;
              border-radius: 15px;
              background-color: rgba(190, 205, 218, 0.6);
            }
          }
        }
        .content {
          position: relative;
          height: 220px; //每个框的宽度
          // padding-left: 40px;
          background: rgba(51, 147, 255, 0.8);
          display: flex;
          align-items: center;
          transition: all 1.5s;
          border-radius: 5px;
          overflow: hidden;
  
          .content-right {
            color: #1d252f;
            padding: 0px 10px;
  
            .el-icon-warning-outline {
              margin-right: 5px;
            }
          }
  
          .name {
            transition: transform 0.5s;
            color: white;
            font-size: 16px;
            font-weight: 500;
            padding-top: 5px;
          }
  
          .data {
            font-size: 12px;
            font-family: Source Han Sans CN, sans-serif;
            color: #e7dede;
            margin-top: -10px;
          }
          .btn {
            width: 330px;
            display: flex;
            font-size: 12px;
            color: #000;
            position: relative;
            z-index: 9999;
            .item {
              margin-right: 20px;
              width: 110px;
              height: 30px;
              border-radius: 15px;
              background-color: rgba(190, 205, 218, 0.6);
            }
          }
        }
  
        .mouse-enter-class {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 40px;
          border-bottom: 3px #0763ee solid;
          transition: 1s;
        }
      }
    }
  
    .list-item:hover {
      transform: scale(1.04);
      .content {
        background: #ecf5f9;
  
        .mouse-enter-class {
          width: 100%;
        }
        .name {
          transition: transform 0.5s;
          color: rgb(87, 85, 85);
          font-size: 16px;
          font-weight: 500;
          padding-top: 5px;
        }
  
        .data {
          font-size: 12px;
          font-family: Source Han Sans CN, sans-serif;
          color: #535050;
          margin-top: -10px;
        }
      }
    }
  
    .home-list-content {
      margin: -12px 12px;
      background: #ffff;
      padding: 20px;
      display: flex;
      margin-bottom: 12px;
    }
  
    .contact {
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      margin-left: 24px;
      color: #8e8888;
  
      img {
        height: 15px;
        margin-bottom: -3px;
        margin-right: 5px;
      }
    }
  
    .item-strengthen,
    .item-new,
    .item-other {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      padding: 2px 10px;
      background: #daf3ff;
      border-bottom-left-radius: 6px;
      color: #339aed;
      border-top-right-radius: 5px;
    }
  
    .item-new {
      background: #ffebe9;
      color: #f94638;
    }
  
    .item-other {
      background: #e1fae2;
      color: #2ad431;
    }
  }
  .bot_cen {
    background: url("../../../public/static/bigdata/bot_cen.png") no-repeat center;
    background-size: 100% 100%;
    width: calc(100vw - 480px);
    height: calc(100vh - 480px);
    left: 62%;
    bottom: 10px;
    transform: translateX(-50%);
    position: fixed;
    z-index: 99;
    padding: 18px 22px;
    box-sizing: border-box;
    
  }
  .heihei_ {
    width: 100%;
    height: 180px;
    margin-top: 20px;
    display: flex;
  }
  .nidt {
    width: 116px;
    padding: 7px;
    box-sizing: border-box;
    margin-right: 16px;
  }
  .nidt > img {
    width: 100px;
    height: 100px;
  }
  .nidt > div {
    text-align: center;
  }
  .name_y {
    font-size: 14px;
    color: #ffffff;
  }
  .bumen_s {
    font-size: 18px;
    color: #37abf5;
    margin-top: 10px;
  }
  .ech_bui {
    width: 100%;
    height: calc(100vh - 710px);
  }
  .cen_top {
    display: flex;
    align-items: center;
    position: absolute;
    top: 107px;
    left: 50%;
    transform: translateX(-50%);
    height: 49px;
    width: 1016px;
  }
  .cen_top > div {
    width: 147px;
    height: 49px;
    line-height: 49px;
    text-align: center;
    color: #ffffff;
    position: relative;
  }
  .act_s {
    color: #fff !important;
  }
  .cen_top > div > img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .cen_top > div > label {
    position: absolute;
    left: 30px;
    top: -10px;
    cursor: pointer;
    color: #73bfff;
  }
  
  .sp_w {
    position: fixed;
    z-index: 9999;
    top: 200px;
    left: 500px;
    color: #fff;
  }
  .geClassmodel {
    position: fixed;
    z-index: 9999;
    left: 900px;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .geClassmodel > div {
    width: fit-content;
    padding: 2px 10px;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 10px;
    background: #95bdff;
  }
  .modelAddress {
    display: flex;
    flex-direction: column;
    position: absolute;
    max-height: 100vh;
    overflow: auto;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    z-index: 1;
    span {
      margin: 10px;
      cursor: pointer;
    }
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
      background: #78b4b4;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
      border-radius: 10px;
      background: #ededed;
    }
  }
  </style>
  