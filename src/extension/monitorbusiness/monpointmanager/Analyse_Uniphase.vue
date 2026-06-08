<template>
  <div>
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看单相分析"
      :height="870"
      :width="1500"
      :padding="15"
      :before-close="handleClose"
    >
      <div class="com-tree">
        <div class="right-table">
          <div class="search-info">
            <div>
              <VolHeader :text="text" icon="md-podium"> </VolHeader>
            </div>
          </div>

          <!-- 图表 -->
          <div class="xjctop57">
            <div id="operation-data" class="dark">
              <div class="right-box">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="点位选择：">
                        <el-input
                          v-model="this.Point_Name"
                          :disabled="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="日期范围："  v-if="Type_text == 'default'">
                        <el-date-picker
                          ref="timeBox"
                          v-model="form.datePicker.time"
                          :shortcuts="shortcuts"
                          type="datetimerange"
                          range-separator="至"
                          :start-placeholder="'开始时间'"
                          :end-placeholder="'结束时间'"
                          :clearable="true"
                          :default-time="form.datePicker.defaultTime"
                        >
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item v-else label="选择时间：">
                        <el-date-picker
                          v-model="form.datePicker.time"
                          type="datetime"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6" v-if="Type_text == 'default'">
                      <el-form-item label="分析方式：" >
                        <el-radio-group v-model="form.radio">
                          <el-radio
                            :key="item.key + index"
                            v-for="(item, index) in showData.radioGroup"
                            :label="item.key"
                            >{{ item.name }}</el-radio
                          >
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3" v-if="formula_Config.xdata">
                      <el-form-item label="显示计算数据：" label-width="120px">
                        <el-switch
                          v-model="formula_Config.isShow"
                          active-color="#409eff"
                          inactive-color="#ff4949"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="是否滤波：">
                        <el-switch
                          v-model="form.value"
                          active-color="#409eff"
                          inactive-color="#ff4949"
                        >
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-rol :span="6">
                      <el-form-item label="显示切线角：">
                        <el-switch
                          v-model="showAngle"
                          active-color="#409eff"
                          inactive-color="#ff4949"
                        >
                        </el-switch>
                        <el-button
                          class="search-button"
                          type="primary"
                          @click="click"
                        >
                          生成图表
                        </el-button>
                        <el-button
                          class="search-button"
                          type="primary"
                          @click="report"
                        >
                          导出
                        </el-button>
                      </el-form-item>
                    </el-rol>
                  </el-row>
                </el-form>
                <!-- 深度位移 -->
                <div
                  class="tuxing"
                  v-if="analyseId==2&&(Type_Id===15||Type_Id===19||Type_Id===29||Type_Id===44)"
                >
                  <div class="box1">
                    <chartdeep
                      @setDeepList="setDeepList"
                      @getkongshen="showDetail"
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chart-deep'"
                    ></chartdeep>
                  </div>
                  <div class="box2">
                    <chartdeepB
                      @getkongshen="showDetail"
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chart-deep2'"
                    ></chartdeepB>
                  </div>
                </div>
                <!-- 1折柱混合 2折 3柱 -->

                <div
                  v-if="
                    this.analyseId == 2 &&
                      this.Type_Id != 15 &&
                      this.Type_Id != 17 &&
                      this.Type_Id != 19 &&
                      this.Type_Id != 10 &&
                      this.Type_Id != 29 && 
                      this.Type_Id != 44
                  "
                  class="speed"
                >
                  <div class="aas1">
                    <chart
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-charta'"
                    ></chart>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div class="postay" v-if="!formula_Config.xdata">
                    <div class="fold" v-if="downStow">
                      <span @click="hanldeDownStow" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>

                    <div class="foldStow" v-if="downFold">
                      <span @click="hanldeDownFold" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>
                    <el-card class="box-card" v-if="downFold">
                      <h4>结论分析</h4>
                      <div class="text item">
                        <div>今日位移：1.51mm</div>
                        <div>本周位移：1.51mm</div>
                        <div>累计位移：1.51mm</div>
                        <div :span="24">今日变形速率：1.51mm</div>
                      </div>
                    </el-card>
                  </div>
                </div>

                <!-- 倾斜 -->
                <div
                  v-if="this.analyseId == 2 && this.Type_Id === 17"
                  class="speed"
                >
                  <div class="aas1">
                    <chartqx
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-chartb'"
                    ></chartqx>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div class="postay">
                    <div class="fold" v-if="downStow">
                      <span @click="hanldeDownStow" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>

                    <div class="foldStow" v-if="downFold">
                      <span @click="hanldeDownFold" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>
                    <el-card class="box-card" v-if="downFold">
                      <h4>结论分析</h4>
                      <div class="text item">
                        <div>今日位移：1.51mm</div>
                        <div>本周位移：1.51mm</div>
                        <div>累计位移：1.51mm</div>
                        <div :span="24">今日变形速率：1.51mm</div>
                      </div>
                    </el-card>
                  </div>
                </div>

                <!-- 渗压 -->
                <div
                  v-if="this.analyseId == 2 && this.Type_Id === 10"
                  class="speed"
                >
                  <div class="aas1">
                    <chartsy
                      class="chart-box"
                      :getParam="chartData"
                      :id="'point-chartsy'"
                    ></chartsy>
                    <chartspeedsy
                      class="chart-box"
                      :getParam="chartData"

                      
                      :id="'speed-chartsy'"
                    ></chartspeedsy>
                  </div>
                  <div class="postay">
                    <div class="fold" v-if="downStow">
                      <span @click="hanldeDownStow" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>

                    <div class="foldStow" v-if="downFold">
                      <span @click="hanldeDownFold" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>
                    <el-card class="box-card" v-if="downFold">
                      <h4>结论分析</h4>
                      <div class="text item">
                        <!-- <div>今日位移：1.51mm</div>
                    <div>本周位移：1.51mm</div>
                    <div>累计位移：1.51mm</div>
                    <div :span="24">今日变形速率：1.51mm</div> -->
                      </div>
                    </el-card>
                  </div>
                </div>

                <div class="aas1" v-if="this.analyseId == 1">
                  <chartlinebar
                    class="chart-box"
                    :getParam="chartData"
                    :id="'chartlinebar'"
                  ></chartlinebar>
                </div>
                <div v-if="this.analyseId == 3" class="speed">
                  <div class="aas1">
                    <chartbar
                      class="chart-box"
                      :getParam="chartData"
                      :id="'chartbar'"
                    ></chartbar>
                    <chartspeed
                      class="chart-box"
                      :getParam="chartData"
                      :id="'speed-chart'"
                    ></chartspeed>
                  </div>
                  <div class="postay">
                    <div class="fold" v-if="downStow">
                      <span @click="hanldeDownStow" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>

                    <div class="foldStow" v-if="downFold">
                      <span @click="hanldeDownFold" class="foldMsg">{{
                        foldMsg
                      }}</span>
                    </div>
                    <el-card class="box-card" v-if="downFold">
                      <h4>结论分析</h4>
                      <div class="text item">
                        <div>今日位移：1.51mm</div>
                        <div>本周位移：1.51mm</div>
                        <div>累计位移：1.51mm</div>
                        <div :span="24">今日变形速率：1.51mm</div>
                      </div>
                    </el-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <el-button type="default" size="mini" @click="clear()"
            >取消</el-button
          >
        </div></template
      >
    </vol-box>
    <!-- 深度位移历史数据 -->
    <vol-box
      id="detailBox"
      :lazy="true"
      v-model="detail.detailVisble"
      :title="Point_Name+'_深部位移详情'"
      :height="700"
      :width="1400"
      :padding="0"
    >
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="日期范围：" >
            <el-date-picker
              ref="timeBox"
              v-model="detail.time"
              :shortcuts="shortcuts"
              type="datetimerange"
              range-separator="至"
              :start-placeholder="'开始时间'"
              :end-placeholder="'结束时间'"
              :clearable="true"
              :default-time="form.datePicker.defaultTime"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="分析方式：" >
            <el-select v-model="detail.radio" style="width: 120px">
              <el-option :value="item.key"
                v-for="(item, index) in showData.radioGroup"
                :label="item.name" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="孔深(m)：" >
            <el-select v-model="detail.deep" style="width: 120px">
              <el-option :value="item.value"
                v-for="(item, index) in detail.deepList"
                :label="item.label" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-rol :span="4">
          <el-form-item>
            <el-button
              class="search-button"
              type="primary"
              @click="ChartInitdetail()"
            >
              生成图表
            </el-button>
          </el-form-item>
        </el-rol>
      </el-row>
    </el-form>
    <div class="speed">
        <div class="zidongAutpo">
          <chart
            class="chart-box"
            :getParam="detail.chartData"
            :id="'point-chart'"
            style="height: 570px;padding:0"
          ></chart>
        </div>
      </div>
  </vol-box>
  </div>
</template>
<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "../../../views/analyse/analyseuniphase/components/chart-line.vue";
import chartspeed from "../../../views/analyse/analyseuniphase/components/chart-speed.vue";
import chartlinebar from "../../../views/analyse/analyseuniphase/components/chart-linebar.vue";
import chartbar from "../../../views/analyse/analyseuniphase/components/chart-bar.vue";
// 深部位移
import chartdeep from "../../../views/analyse/analyseuniphase/components/chart-deep.vue";
import chartdeepB from "../../../views/analyse/analyseuniphase/components/chart-deepB.vue";
// 倾斜
import chartqx from "../../../views/analyse/analyseuniphase/components/chart-qx.vue";
// 渗压
import chartsy from "../../../views/analyse/analyseuniphase/components/chart-sy.vue";
import chartspeedsy from "../../../views/analyse/analyseuniphase/components/chart-speedsy.vue";
import { fa } from "element-plus/es/locale/index.mjs";
import { evaluate,format } from 'mathjs'
import * as XLSX from 'xlsx';
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    chart: chart,
    chartlinebar: chartlinebar,
    chartbar: chartbar,
    chartspeed: chartspeed,
    chartdeep: chartdeep,
    chartdeepB: chartdeepB,
    chartqx: chartqx,
    chartsy: chartsy,
    chartspeedsy: chartspeedsy,
  },
  // computed: {
  //   startTime: function() {
  //     return this.form.datePicker.time[0];
  //   },
  //   endTime: function() {
  //     return this.form.datePicker.time[1];
  //   },
  // },
  data() {
    return {
      model: {
        box: false,
      },
      Point_Name: "",
      downStow: true,
      downFold: false,
      foldMsg: "收起",
      activeName: "second",
      shortcuts,
      showAngle: false,
      form: {
        datePicker: {
          time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          // time: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
          defaultTime: [
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ],
        },
        radio: "1",
        checkAll: false,
        value: true,
      },
      startTime: "",
      endTime: "",
      showData: {
        radioGroup: [
          {
            key: "0",
            name: "小时",
          },
          {
            key: "1",
            name: "天",
          },
          {
            key: "2",
            name: "月",
          },
        ],
      },
      isIndeterminate: true,
      chartData: {},
      options_id: "",
      options: [], //接收监测点位
      icon: "el-icon-s-grid",
      text: "单相分析",
      monitorTableData: [],
      Type_Id: "", //用于展示点位图表类型
      analyseId: "",
      Type_text: 'default', //用于区别深部位移 与 其他状态参数
      detail: {
        detailVisble: false,
        time: null,
        radio: '0',
        deep: '1',
        chartData: {},
        deepList: [],
      },
      formula_Config: {
        isShow:false,
      }
    };
  },
  created() {},
  methods: {
    setDeepList (arr) {
      this.detail.deepList = arr?.map(item=>{
        return {label:item+'m',value:item}
      }).reverse();
    },
    ChartInitdetail(e) {
      this.detail.startTime = this.filterTime(this.detail.time[0]);
      this.detail.endTime = this.filterTime(this.detail.time[1]);
      if (this.showAngle) {
        const getParam = {
          pointNum: this.options_id,
          startTime: this.detail.startTime,
          endTime: this.detail.endTime,
          total: 5000,
          timeType: this.detail.radio,
          showAngle: 0,
          type:'deepDetail',
          deep: this.detail.deep
        };
        this.detail.chartData = getParam;
      } else {
        const getParam = {
          pointNum:  this.options_id,
          startTime: this.detail.startTime,
          endTime: this.detail.endTime,
          total: 5000,
          timeType: this.detail.radio,
          type:'deepDetail',
          deep: this.detail.deep,
        };
        this.detail.chartData = getParam;
      }
      this.detail.chartData.Point_Name = this.Point_Name
    },

    showDetail(val){
      const {dayStart, dayEnd} = this.getHourStartAndEnd(this.form.datePicker.time);
      this.detail.time = [dayStart,dayEnd]
      this.detail.startTime = this.filterTime(dayStart)
      this.detail.endTime = this.filterTime(dayEnd)
      this.detail.timeType = this.form.timeType
      this.detail.value = this.form.value
      this.detail.deep = val
      this.ChartInitdetail()
      this.detail.detailVisble = true;
    },
    hanldeDownStow() {
      this.foldMsg = "展开";
      this.downStow = !this.downStow;
      this.downFold = true;
      // setTimeout(()=>{
      // }, 1000);
    },
    hanldeDownFold() {
      this.foldMsg = "收起";
      this.downFold = !this.downFold;
      this.downStow = true;
    },

    handleClose() {
      this.model.box = false;
    },
    clear() {
      this.model.box = false;
    },

    // 图表传输信息
    ChartInit(e) {
      if (this.showAngle) {
        const getParam = {
          pointNum: e ? e : this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
          showAngle: 0,
          typeText: this.Type_text,
          formula_Config: this.formula_Config.isShow?this.formula_Config:{}
        };
        this.chartData = getParam;
      } else {
        const getParam = {
          pointNum: e ? e : this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
          typeText: this.Type_text,
          formula_Config: this.formula_Config.isShow?this.formula_Config:{}
        };
        this.chartData = getParam;
      }
    },

    // 导出方法
    report() {
      // 计算数据导出
      if(this.formula_Config.isShow) {
        const { configList,xdata,xkey,ydata,ykey } = this.formula_Config;
        let titleArr = configList.map(item=>{
            return item.name
        });
        const headers = ['时间'].concat(titleArr)
        const param = {
          pointNum:'',
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
          typeText: this.Type_text,
        }
        if(xdata == ydata) {
          this.http.post("/api/Analysis/SingleIndicatorsAnalysis", {...param,pointNum:xdata}, true).then(res=>{
            const timeList = res.data.xAxis;
            const xNumList = res.data.series.filter(item=>{
              return item.fieldName == xkey
            })[0]?.valueList
            const yNumList = res.data.series.filter(item=>{
              return item.fieldName == ykey
            })[0]?.valueList
            const arr = []
            xNumList.forEach((xnum,index)=>{
              let _arr = [timeList[index]]
              configList.forEach((item,i)=>{
                const scope = {x:xnum,y:yNumList[index]}
                const result = evaluate(item.expression,scope)
                _arr.push(format(result, { notation: 'fixed', precision: 2 }))
              })
              arr.push(_arr)
            })
            const excelData = [headers, ...arr];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);

            XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表');

            XLSX.writeFile(workbook, `${xdata}单相分析计算数据.xlsx`);
          })
        }
        else {
          
          const req1 =  this.http.post("/api/Analysis/SingleIndicatorsAnalysis", {...param,pointNum:xdata}, true)
          const req2 =  this.http.post("/api/Analysis/SingleIndicatorsAnalysis", {...param,pointNum:ydata}, true)
          Promise.all([req1, req2]).then(([res1, res2])=>{
            const timeList = res1.data.xAxis;
            const xNumList = res1.data.series.filter(item=>{
              return item.fieldName == xkey
            })[0]?.valueList
            const yNumList = res2.data.series.filter(item=>{
              return item.fieldName == ykey
            })[0]?.valueList
            const arr = []
            xNumList.forEach((xnum,index)=>{
              let _arr = [timeList[index]]
              configList.forEach((item,i)=>{
                const scope = {x:xnum,y:yNumList[index]}
                const result = evaluate(item.expression,scope)
                _arr.push(format(result, { notation: 'fixed', precision: 2 }))
              })
              arr.push(_arr)
            })
            const excelData = [headers, ...arr];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);

            XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表');

            XLSX.writeFile(workbook, `${xdata}单相分析计算数据.xlsx`);
          })
        }
      }
      else {
        let url = `/api/Analysis/ExportSingleAnalysisData`;
        const parems = {
          pointNum: this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
        };
        this.http
          .post(url, parems, true, { responseType: "blob" })
          .then((result) => {
            this.$message.success("导出成功！");
            var eleLink = document.createElement("a");
            let filename = this.options_id + "单相分析.xls";
            eleLink.download = filename;
            eleLink.style.display = "none";
            // 字符转blob
            var blob = new Blob([result]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
          });
        }
      
    },

    filterTime(time, type) {
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
      if(type == 'year'){
        return y + "-" + m + "-" + d
      }
      else {
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
      }
    },

    // 点击查询条件
    click() {
      this.getMonitorData(this.options_id);
      this.ChartInit(this.options_id);
    },

    openAnalyse(value, type) {
      this.Type_text = type?type : 'default'
      if (type == 'shenbu') {
        this.form.radio = "0";
        this.form.datePicker.time = new Date()
      }
      else if (value.ID === 276||value.ID === 282 ||value.ID === 283||value.ID === 297) {
        this.$nextTick(() => {
          this.form.radio = "0";
          this.form.datePicker.time=[new Date(new Date().toLocaleDateString()),new Date(),]
        });
        this.form.radio = "0";
        this.form.datePicker.time=[new Date(new Date().toLocaleDateString()),new Date(),]
      }else{
        this.$nextTick(() => {
          this.form.radio = "1";
          this.form.datePicker.time=[new Date(new Date() - 168 * 60 * 60 * 1000), new Date()]
        });
        this.form.radio = "1";
        this.form.datePicker.time=[new Date(new Date() - 168 * 60 * 60 * 1000), new Date()]

      }

      this.model.box = true;
      this.pointPosition(value);
    },

    // 点击查询监测点位
    pointPosition(treeId) {
      // 276 282 283 297
      this.formula_Config = treeId.Formula_Config?JSON.parse(treeId.Formula_Config):{};
      this.formula_Config.isShow = false;
      this.options_id = treeId.Point_Num;
      this.Point_Name = treeId.Point_Name;
      this.Type_Id = treeId.Type_Id;
      this.getAnalyseId(this.Type_Id);
      this.getMonitorData(this.options_id);
      this.ChartInit(this.options_id);
    },

    // 选择点位编号的逻辑
    getOptionsId(data) {
      this.options_id = data;
      let run = this.options.filter((item) => {
        return item.Point_Num === this.options_id;
      });
      this.Type_Id = run[0].Type_Id;
      this.getAnalyseId(this.Type_Id);
      this.ChartInit();
    },

    // 匹配接口
    getAnalyseId(e) {
      var param = {
        order: "desc",
        page: 1,
        rows: 1000,
        sort: "Type_Order",
      };
      param.wheres = `[]`;
      this.http
        .post("/api/Mon_Type_Manager/getPageData", param, true)
        .then((result) => {
          let data = result.rows.filter((item) => {
            return item.ID === e;
          });
          this.analyseId = data[0].Display_Config;
        });
    },
    getHourStartAndEnd(date) {
      const hourStart = new Date(date);
      hourStart.setMinutes(0);
      hourStart.setSeconds(0);
      hourStart.setMilliseconds(0);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() - 1);
      // 针对与这个编号深部数据 查询两小时的内容
      if(this.Type_Id == 44) {
         hourStart.setHours(hourStart.getHours() + 1);
      }
      const dayStart = new Date(date);
      dayStart.setHours(0);
      dayStart.setMinutes(0);
      dayStart.setSeconds(0);
      dayStart.setMilliseconds(0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23);
      dayEnd.setMinutes(59);
      dayEnd.setSeconds(59);
      dayEnd.setMilliseconds(999);

      return { dayStart, dayEnd, hourStart, hourEnd };
    },
    getMonitorData(data) {
      if(Array.isArray(this.form.datePicker.time)) {
        this.startTime = this.filterTime(this.form.datePicker.time[0]);
        this.endTime = this.filterTime(this.form.datePicker.time[1]);
      }
      else {
        const { hourStart, hourEnd } = this.getHourStartAndEnd(this.form.datePicker.time);
        this.startTime = this.filterTime(hourEnd);
        this.endTime = this.filterTime(hourStart);
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .v-header {
  background: white;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  .v-left-text {
    font-size: 14px;
  }
}
::v-deep .v-header {
  border-bottom: 0px solid #dcdee2;
}
::v-deep .el-input__wrapper {
  width: 140px;
  height: 33px;
}
::v-deep .el-tabs__header {
  height: 33px;
}
::v-deep .el-tabs {
  --el-tabs-header-height: 33px;
  margin-left: 15px;
}
::v-deep .el-date-editor {
  width: 400px;
}

.search-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
  .living {
    display: flex;
  }
}
::v-deep .headerView {
  display: flex;
  margin-top: 10px;
}

.com-tree {
  display: flex;
  > .left-tree {
    width: 215px;
  }
  > .right-table {
    flex: 1;
  }
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;
  height: 100%;

  .right-box {
    min-height: 500px;
    height: 100%;
    padding: 0px;
    border: 1px solid #f8f8f9;
    .tuxing {
      display: flex;
      // justify-content: space-between;
      .box1 {
        margin-left: 30px;
      }
    }
  }

  .is-top {
    color: black;
  }

  ::v-deep .el-tabs__nav-scroll .el-tabs__item {
    padding: 0 6px !important;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

  .el-form-item__label {
    color: black;
  }

  .search-button {
    margin-left: 50px;
    width: 100px;
  }

  ::v-deep .el-range-input {
    color: black;
  }

  ::v-deep .el-form-item__label {
    color: black;
    margin-top: 5px;
  }

  .el-input__inner {
    color: black;
  }

  ::v-deep .el-date-editor {
    color: black !important;

    * {
      border: none;
    }
  }

  .tips {
    display: block;
    margin: 10px 0 0 60px;
    color: red;
    font-size: 12px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 15px;
    div {
      font-size: 14px;
      line-height: 30px;
      color: #999;
    }
  }
  .speed {
    // display: flex;
    width: 100%;
    height: calc(100% - 110px);
    position: relative;
  }

  .box-card {
    width: 320px;
    position: absolute;
    right: 10px;
    // z-index: 999;
  }
  .foldMsg {
    cursor: pointer;
    color: #999;
    margin-top: -5px;
  }
}
.xjctop57{
  height: calc(100% - 57px);
}
.aas1{
  width: 100%;
  height: 100%;
}
.postay{
  position: absolute;
  top: 0;
  right: 0;
}
#detailBox {
  .speed {
    width: 100%;
    height: 570px;
    position: relative;
  }
  .zidongAutpo{
    width: 100%;
    height: 100%;
  }
  .box-card {
    width: 320px;
    position: absolute;
    right: 10px;
    // z-index: 999;
  }
  .foldMsg {
    cursor: pointer;
    color: #999;
    margin-top: -5px;
  }
}
</style>
