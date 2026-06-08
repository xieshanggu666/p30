<template>
  <div class="com-tree">
    <div class="left-tree">
      <AnalyseUniphaseTree :onChange="onChange"></AnalyseUniphaseTree>
    </div>
    <div class="right-table">
      <div class="search-info">
        <div>
          <VolHeader :text="text" icon="md-podium"> </VolHeader>
        </div>
        <el-form class="usform" ref="form" :model="form" label-width="100px">
                  <el-form-item label="点位选择：">
                    <el-select
                      style="width: 140px;"
                      v-model="options_id"
                      placeholder="请选择点位"
                      @change="getOptionsId"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.Point_Num"
                        :label="item.pointName"
                        :value="item.Point_Num"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="Type_Id == 44 || Type_Id == 29" label="选择时间：">
                        <el-date-picker
                          v-model="form.datePicker.time"
                          type="datetime"
                          style="width: 240px;"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                  <el-form-item label="日期范围：" v-else>
                    
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

                  <el-form-item label="分析方式：" v-if="Type_Id != 44 && Type_Id != 29">
                    <el-select v-model="form.radio" placeholder="请选择分析方式" style="width: 80px;">
                      <el-option
                        :key="item.key + index"
                        v-for="(item, index) in showData.radioGroup"
                        :label="item.name"
                        :value="item.key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div class="flex_btn_box">
                      <el-button
                      class="search-button ml12"
                      type="primary"
                      @click="click"
                    >
                      查询
                    </el-button>
                    <!-- 只有类型为	渗压计（RTU）的才能导入 id为34 -->
                    <el-button
                    v-if="Type_Id==34"
                      class="ml12"
                      @click="triggerFileInput"
                    >
                      导入
                      <input 
                        type="file" 
                        ref="fileInput" 
                        accept=".txt" 
                        @change="handleFileImport" 
                        style="display: none"
                      />
                    </el-button>
                    <el-button
                      class="ml12"
                      @click="report"
                    >
                      导出
                    </el-button>
                    </div>
          </el-form>
      </div>
      <div class="ismofk">
        <div class="methzs">数据展示</div> 
        <div class="bodo">
          <el-form class="bodo" ref="form" :model="form" label-width="100px">
              <el-form-item class="mr36" label="是否滤波：">
                    <el-switch
                      v-model="form.value"
                      active-color="#409eff"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="显示切线角：">
                    <el-switch
                      v-model="showAngle"
                      active-color="#409eff"
                      inactive-color="#ff4949"
                    >
                    </el-switch>
                    
                  </el-form-item>
              </el-form>
        </div>  
      </div>
      <!-- 图表 -->
      <div class="bsmaps">
        <div id="operation-data" class="dark">
          <div class="right-box">
            <!-- <el-form ref="form" :model="form" label-width="100px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="点位选择：">
                    <el-select
                      v-model="options_id"
                      placeholder="请选择点位"
                      @change="getOptionsId"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.Point_Num"
                        :label="item.pointName"
                        :value="item.Point_Num"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="日期范围：">
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
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item label="分析方式：">
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
            </el-form> -->
              <div class="tuxing" v-if="this.analyseId == 2 && (this.Type_Id===15 || this.Type_Id===19 ||  this.Type_Id===29 ||  this.Type_Id===44)">
              <div class="box1" style="margin-right:50px">
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
            <!-- 1折柱混合 2折 3柱   -->

            <div v-if="this.analyseId == 2 && this.Type_Id!=15&& this.Type_Id!=17 && this.Type_Id!=19 && this.Type_Id!=10 && this.Type_Id!=29 && this.Type_Id!=44" class="speed">
              <div class="zidongAutpo">
                <chart
                  class="chart-box"
                  :getParam="chartData"
                  :id="'point-chart'"
                ></chart>
                <chartspeed
                  class="chart-box"
                  :getParam="chartData"
                  :id="'speed-chart'"
                ></chartspeed>
              </div>
              <div class="nidayed">
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

            <!-- 展示深部位移的数据 -->
            <!-- <div
              v-if="this.analyseId == 2 && this.Type_Id === 15"
              class="speed"
            >
              <div>
                <chartdeep
                  class="chart-box"
                  :getParam="chartData"
                  :id="'chart-deep'"
                ></chartdeep>
                <chartdeepB
                  class="chart-box"
                  :getParam="chartData"
                  :id="'chart-deep2'"
                ></chartdeepB>
              </div>
            </div> -->

            <!-- 倾斜 -->
            <div
              v-if="this.analyseId == 2 && this.Type_Id === 17"
              class="speed"
            >
              <div>
                <chartqx
                  class="chart-box"
                  :getParam="chartData"
                  :id="'point-chart'"
                ></chartqx>
                <chartspeed
                  class="chart-box"
                  :getParam="chartData"
                  :id="'speed-chart'"
                ></chartspeed>
              </div>
              <div>
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
            <div v-if="this.analyseId == 2 && this.Type_Id===10" class="speed">
              <div class="zidongAutpo">
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
              <div class="nidayed">
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

            <div v-if="this.analyseId == 1" class="speed">
              <chartlinebar
                class="chart-box"
                :getParam="chartData"
                :id="'chartlinebar'"
              ></chartlinebar>
            </div>
            <div v-if="this.analyseId == 3" class="speed">
              <div class="zidongAutpo">
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
              <div>
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
import AnalyseUniphaseTree from "../../monitor/monitorRecord/monitor/MonitorRecordTree.vue";
import moment from "moment";
import shortcuts from "@/uitils/shortcuts";
import chart from "./components/chart-line.vue";
import chartspeed from "./components/chart-speed.vue";
import chartlinebar from "./components/chart-linebar.vue";
import chartbar from "./components/chart-bar.vue";
// 深部位移
import chartdeep from "./components/chart-deep.vue";
import chartdeepB from "./components/chart-deepB.vue";
//倾斜
import chartqx from "./components/chart-qx.vue";
// 渗压
import chartsy from "./components/chart-sy.vue";
import chartspeedsy from "./components/chart-speedsy.vue";
import { toHandlers } from "vue";



export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    AnalyseUniphaseTree: AnalyseUniphaseTree,
    chart: chart,
    chartlinebar: chartlinebar,
    chartbar: chartbar,
    chartspeed: chartspeed,
    chartdeep: chartdeep,
    chartdeepB: chartdeepB,
    chartqx: chartqx,
    chartsy:chartsy,
    chartspeedsy:chartspeedsy,
  },
  computed: {
    startTime: function() {
      return this.form.datePicker.time[0];
    },
    endTime: function() {
      return this.form.datePicker.time[1];
    },
  },
  data() {
    return {
      detail: {
        detailVisble: false,
        time: null,
        radio: '0',
        deep: '1',
        chartData: {},
        deepList: [],
      },
      Point_Name: '',
      downStow: true,
      downFold: false,
      foldMsg: "收起",
      activeName: "second",
      shortcuts,
      form: {
        datePicker: {
          time: [new Date(new Date() - 168 * 60 * 60 * 1000), new Date()],
          defaultTime: [
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ],
        },
        radio: "1",
        checkAll: false,
        value: true,
      },
      showAngle: false,
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
      /**导入相关 */
      maxFileSize:10 * 1024 * 1024, //默认10M
      fileContent: '',
      isLoading: false,
      error: '',
    };
  },
  created() {},
  methods: {
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
          deep: this.detail.deep
        };
        this.detail.chartData = getParam;
      }
      this.detail.chartData.Point_Name = this.Point_Name
    },
    setDeepList (arr) {
      this.detail.deepList = arr?.map(item=>{
        return {label:item+'m',value:item}
      }).reverse();
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
          Type_Id:this.Type_Id,
          typeText: this.Type_Id == 44 || this.Type_Id == 29 ? 'shenbu' : 'default',
          formula_Config: {}
        };
        this.chartData = getParam;
      } else {
        const getParam = {
          pointNum: e ? e : this.options_id,
          startTime: this.startTime,
          endTime: this.endTime,
          total: 5000,
          timeType: this.form.radio,
          Type_Id:this.Type_Id,
          typeText: this.Type_Id == 44 || this.Type_Id == 29 ? 'shenbu' : 'default',
          formula_Config: {}
        };
        this.chartData = getParam;
      }
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

    // 点击查询条件
    click() {
      this.getMonitorData(this.options_id);
      this.ChartInit(this.options_id);
    },

    // 导出方法
    report() {
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
          let filename = this.options_id+"单相分析.xls";
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
    },

    //导入功能
    triggerFileInput() {
      console.log('this.$refs.fileInput',this.$refs.fileInput);
      this.$refs.fileInput.value = '' // 清除之前的选择
      this.$refs.fileInput.click()
    },
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      this.resetState()
      // 验证文件类型
      if (!this.validateFileType(file)) {
        this.error = '请选择TXT格式的文件'
        return
      }
      // 验证文件大小
      if (file.size > this.maxFileSize) {
        this.error = `文件大小超过限制 (最大 ${this.maxFileSize / 1024 / 1024}MB)`
        return
      }
      this.isLoading = true
      let formData = new FormData()
      formData.append('file', file);
      this.http.post('/api/Mon_Point_Manager/UploadSyData',formData).then(res => {
          if (res.status) {
            this.$message({ type: 'success', message: res.message});
          }
      });
    },
    //导入类型判断
    validateFileType(file) {
      const validTypes = ['text/plain']
      const validExtensions = ['.txt']
      const fileName = file.name.toLowerCase()
      return validTypes.includes(file.type) || 
             validExtensions.some(ext => fileName.endsWith(ext))
    },
    resetState() {
      this.fileContent = ''
      this.error = ''
      this.isLoading = false
    },
    // 点击树的方法
    onChange(treeId, type) {
      // console.log("treeId",treeId);
      this.$nextTick(() => {
        this.text = treeId.nodeName + "—单相分析";
        this.pointPosition(treeId);
      });
    },

    // 点击查询监测点位
    pointPosition(treeId) {
      var param = {
        order: "asc",
        page: 1,
        rows: 100,
        sort: "Point_Order",
      };
      param.wheres = `[{\'name\':\ '${treeId.nodeType}', \'value\':\' ${treeId.nodeValue}\'}]`;
      this.http
        .post("/api/Mon_Point_Manager/getPageData", param, true)
        .then((result) => {
          if(result.rows.length == 0) {
            return
          }
          this.options = result.rows;
          this.Type_Id = result.rows[0]?.Type_Id || null
          this.Point_Name = result.rows[0]?.Point_Name || null
          this.options.map((item) => {
            item.pointName = item.Point_Name + `(${item.Point_Num})`;
          });
          if (this.Type_Id == 44 || this.Type_Id == 29) {
            this.form.radio = "0";
            this.form.datePicker.time = new Date()
          }
          else if (result.rows[0]?.ID === 276||result.rows[0]?.ID === 282 ||result.rows[0]?.ID === 283||result.rows[0]?.ID === 297) {
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
          this.options_id = result.rows[0]?.Point_Num;
          this.Type_Id = result.rows[0]?.Type_Id;
          // console.log("this.Type_Id", this.Type_Id);
          this.getAnalyseId(this.Type_Id);
          this.getMonitorData(this.options_id);
          this.ChartInit(this.options_id);
        });
    },

    // 选择点位编号的逻辑
    getOptionsId(data) {
      this.options_id = data;
      let run = this.options.filter((item) => {
        return item.Point_Num === this.options_id;
      });
      this.Type_Id = run[0].Type_Id;
      this.Point_Name = run[0].Point_Name;
      if(run[0].Group_Id == 135) {
        this.form.radio = "1";
        this.form.datePicker.time=[new Date(new Date() - 168 * 60 * 60 * 1000), new Date()]
      }
      if(this.Type_Id == 44 && run[0].Group_Id == 135) {
        this.form.radio = "0";
        this.form.datePicker.time = new Date()
        this.getMonitorData(this.options_id);
      }
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
          // console.log("图类型", data[0].Display_Config);
        });
    },
    getHourStartAndEnd(date) {
      const hourStart = new Date(date);
      hourStart.setMinutes(0);
      hourStart.setSeconds(0);
      hourStart.setMilliseconds(0);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() - 1);
      // 针对与摩托的 查询2个小时内的深部位移数据
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
    getMonitorData() {
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
.flex_btn_box {
  display: flex;
  justify-content: flex-end;
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
.ismofk{
  width: 100%;
  height: 64px;
  padding: 15px 36px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .methzs{
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }
  .bodo{
    display: flex;
    align-items: center;
    padding-right: 45px;
  }
}
.bsmaps{
  width: 100%;
  height: calc(100% - 126px);
}
.ml12{
  margin-left: 12px !important;
}
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
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 62px;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f5;
  .living {
    display: flex;
  }
  .usform{
    width:calc(100% - 121px);
    display: flex;
    justify-content:right;
    align-items: center;
    ::v-deep .el-form-item--default{
      margin-bottom: 0 !important;
    }
  }
}
::v-deep .headerView {
  display: flex;
  margin-top: 10px;
}

.com-tree {
  display: flex;
  height: 100%;
  > .left-tree {
    width: 240px;
    height: 100%;
    background: #fff;
    margin-right: 5px;
  }
  > .right-table {
    width: calc(100% - 245px);
    height: 100%;
    background: #fff;
  }
}
.btns {
  background-color: #fff;
}
#operation-data {
  width: 100%;
  height: 100%;
  .right-box {
    height: 100%;
    padding: 0px;
    .tuxing{
      display: flex;
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
    width: 100%;
    height:100%;
    display: flex;
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
.nidayed{
  position: absolute;
  top:-55px;
  right: 32px;
  width: 76px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background: rgba(53, 112, 252, .1);
  border-radius: 16px ;

  .foldMsg{
    font-size: 14px !important;
    color: #3570FC !important;
  }
}
.mr36{
  margin-right: 36px;
}
</style>
