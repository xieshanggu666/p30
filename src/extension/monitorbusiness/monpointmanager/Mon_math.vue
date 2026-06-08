<template>
  <div class="weiyis">
    <vol-box
      :lazy="true"
      v-model="model.box"
      title="查看计算数据"
      :height="800"
      :width="1500"
      :padding="15"
      :before-close="handleClose"
    >
      <div class="right-table">
        <div class="search-info">
          <div>
            <VolHeader :text="text" icon="md-podium"> </VolHeader>
          </div>
          <div class="r-info" style="margin-top: 5px">
            <div class="headerView">
              <el-form-item label="当前点位：">
                <el-input v-model="options_id" :disabled="true"></el-input>
              </el-form-item>

              <el-form ref="form" :model="form" label-width="100px">
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
              </el-form>
              <el-button type="primary" @click="click" style="margin-left: 15px"
                >查询</el-button
              >
              <el-button
                type="success"
                @click="report"
                style="margin-left: 15px"
                >导出</el-button
              >
              <el-tabs
                v-model="activeName"
                type="card"
                @tab-click="handleClick"
              >
                <el-tab-pane label="列表管理" name="second"></el-tab-pane>
                <el-tab-pane label="图表管理" name="first"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="intab" v-if="view == 1">
          <vol-table
            :style="contentStyleObj"
            ref="table"
            :columns="columns"
            :max-height="620"
            :index="true"
            :tableData="monitorTableData"
            :paginationHide="true"
            :single="false"
            :ck="false"
          ></vol-table>
          <div class="pagination">
            <el-pagination
              style="margin-top: 3px"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[30, 60, 100, 120]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        <!-- 图表 -->
        <div class="tuEcharts" v-if="view == 2 && Type_Id != 10">
          <div id="operation-data" class="dark">
            <div class="right-box">
              <div>图表</div>
              <chart
                class="chart-box"
                :getParam="chartData"
                :unit="false"
                :height="600"
                :id="'point-gnssC-1'"
              ></chart>
            </div>
          </div>
        </div>
        <div class="tuEcharts" v-if="view == 2 && Type_Id === 10">
          <div id="operation-data" class="dark">
            <div class="right-box">
              <div>图表</div>
              <chartN
                class="chart-box"
                :getParam="chartData"
                :unit="false"
                :height="600"
                :id="'point-gnssC-5'"
              ></chartN>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <el-button type="default" size="mini" @click="close">取消</el-button>
        </div></template
      >
    </vol-box>
  </div>
</template>
<script>
import { resolveComponent } from "vue";
import VolBox from "@/components/basic/VolBox.vue";
import VolForm from "@/components/basic/VolForm.vue";
import VolTable from "@/components/basic/VolTable.vue";
import VolHeader from "@/components/basic/VolHeader.vue";
import shortcuts from "@/uitils/shortcuts";
import chart from "../../../views/monitor/monitorRecord/components/chart-line.vue";
import chartN from "../../../views/monitor/monitorRecord/components/chart-line2.vue";
import { evaluate, format } from 'mathjs'
import * as XLSX from 'xlsx';
import { el } from 'element-plus/es/locale';
export default {
  components: {
    "vol-box": VolBox,
    VolTable: VolTable,
    VolForm: VolForm,
    VolHeader: VolHeader,
    chart: chart,
    chartN: chartN,
  },
  computed: {
    startTime: function () {
      return this.form.datePicker.time[0];
    },
    endTime: function () {
      return this.form.datePicker.time[1];
    },
  },
  created() {},
  data() {
    return {
      selectRows:[],
      model: {
        box: false,
      },
      Type_Id: "",
      contentStyleObj: {
        // height: "640px",
        // overflow: "auto",
        padding: "0 15px",
      },
      activeName: "second",
      shortcuts,
      form: {
        datePicker: {
          time: [
            new Date(new Date().toLocaleDateString()),
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),
          ],
          defaultTime: [
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ],
        },
        radio: 0,
        radio_display: 1,
        checkAll: false,
        check_list: ["三维合位移差值"],
      },
      startTime: "",
      endTime: "",
      isIndeterminate: true,
      chartData: {},
      allList: [],
      view: 1,
      nodeName: "",
      options_id: "",
      options: [], //接收监测点位
      value: "",
      text: "计算数据管理",
      currentPage: 1,
      pageSize: 30,
      total: 0,
      monitorTableData: [],
      tableData: [],
      columns:[],
      detail: {
        cnName: "#detailCnName",
        table: "#detailTable",
        columns: [],
        sortName: "",
        key: "",
      },
      formulaConfig:[],
      xdata:'',
      ydata:'',
      xkey:'',
      ykey:'',
    };
  },
  created() {},
  methods: {
    handleClose() {
      this.model.box = false;
      this.monitorTableData = [];
    },
    close() {
      this.model.box = false;
      this.monitorTableData = [];
    },
    openRecord(treeId) {
      this.activeName = "second";
      this.view = 1;
      this.model.box = true;
      this.Type_Id = treeId.Type_Id;
      this.options_id = treeId.Point_Num
      const arr = [
        {
          field: "Status",
          title: "状态",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
          bind: {
            //如果后面返回的数据为数据源的数据，请配置此bind属性，可以从后台字典数据源加载，也只以直接写上
            key: "audit",
            data: [
              { key: "0", value: "异常" },
              { key: "1", value: "正常" },
            ],
          },
        },
        {
          field: "DataTime",
          title: "数据时间",
          type: "string",
          width: 110,
          readonly: true,
          require: true,
          align: "left",
        }
      ]
      this.formulaConfig = JSON.parse(treeId.Formula_Config).configList;
      this.xdata = JSON.parse(treeId.Formula_Config).xdata;
      this.xkey = JSON.parse(treeId.Formula_Config).xkey;
      this.ydata = JSON.parse(treeId.Formula_Config).ydata;
      this.ykey = JSON.parse(treeId.Formula_Config).ykey;
      const _forList = this.formulaConfig.map((item,index)=>{
        return {field:'r'+index,title:`${item.name}`,type:'string',width: 110,readonly: true,require: true,align: "left"}
      })
      this.tableData = this.formulaConfig.map((item,index)=>{
        return {FieldName:'r'+index,DisplayName:item.name}
      })
      this.columns = _forList.concat(arr)
      this.$nextTick(()=>{
        this.getMonitorData()
      })
    },
    // 获取监测数据
    getMonitorData() {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      // 数据源是同一个点位
      if(this.xdata == this.ydata){
        let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
        this.http.get(url, {}, true).then((result) => {
          this.monitorTableData = result.rows;
          this.monitorTableData.forEach(item=>{
            const scope = {x:item[this.xkey],y:item[this.ykey]}
            const results = this.formulaConfig.map(ele => ({
              ...ele,
              result: evaluate(ele.expression, scope)
            }));
            for(let i in results) {
              const items = results[i];
              item['r'+i] = format(items.result, { notation: 'fixed', precision: 2 })
            }
          })
          this.total = result.total;
        })
      }
      else {
        let url1 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
        let url2 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.ydata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`;
        const req1 = this.http.get(url1,{},true)
        const req2 = this.http.get(url2,{},true)
        Promise.all([req1, req2]).then(([res1, res2])=>{
          res1.rows.forEach((item,index)=>{
            // 取对应数据源的数据
            const scope = {x:res1.rows[index][this.xkey],y:res2.rows[index][this.ykey]}
            const results = this.formulaConfig.map(ele => ({
              ...ele,
              result: evaluate(ele.expression, scope)
            }));
            for(let i in results) {
              const items = results[i];
              item['r'+i] = format(items.result, { notation: 'fixed', precision: 2 })
            }
          })
          this.monitorTableData = res1.rows;
          this.total = res1.total;
        })
      }
    },
    // 获取图表信息  超出30000条取最新的30000条
    getAllMonitorData() {
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      if(this.xdata == this.ydata){
        let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        this.http.get(url, {}, true).then((result) => {
          this.allList = result.rows;
          this.allList.forEach(item=>{
            const scope = {x:item[this.xkey],y:item[this.ykey]}
            const results = this.formulaConfig.map(ele => ({
              ...ele,
              result: evaluate(ele.expression, scope)
            }));
            for(let i in results) {
              const items = results[i];
              item['r'+i] =format(items.result, { notation: 'fixed', precision: 2 })
            }
          })
        }).then(()=>{
          this.ChartInit()
        });
      }
      else {
        let url1 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        let url2 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.ydata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        const req1 = this.http.get(url1,{},true)
        const req2 = this.http.get(url2,{},true)
        Promise.all([req1, req2]).then(([res1, res2])=>{
          if(res1.rows.length != res2.rows.length) {
            this.$message({
              message: '点位数据源有误，请确认',
              type: 'warning'
            });
            return
          }
          res1.rows.forEach((item,index)=>{
            const scope = {x:res1.rows[index][this.xkey],y:res2.rows[index][this.ykey]}
            const results = this.formulaConfig.map(ele => ({
              ...ele,
              result: evaluate(ele.expression, scope)
            }));
            for(let i in results) {
              const items = results[i];
              item['r'+i] = format(items.result, { notation: 'fixed', precision: 2 })
            }
          })
          this.allList = res1.rows;
          
        }).then(()=>{
          this.ChartInit()
        })
      }
    }, 

    // 给图表传输的信息
    ChartInit(e) {
      const getParam = {
        pointNum: this.xdata,
        timeType: this.form.radio,
        total: 5000,
        startTime: this.startTime,
        endTime: this.endTime,
        list: this.allList,
        chartLengdList:this.tableData,
      };
      this.chartData = getParam;
    },

    // 导出数据
    report() {
      // 1. 定义表头（中文）
      const headers = this.columns.map(item=>{
          return item.title
      });
      const auditCon = {'0':"异常",'1':"正常"}
      this.startTime = this.filterTime(this.form.datePicker.time[0]);
      this.endTime = this.filterTime(this.form.datePicker.time[1]);
      const datakey = this.formulaConfig.map((ele,index)=>{
        return `r${index}`
      });
      if(this.xdata == this.ydata){
        let url = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        this.http.get(url, {}, true).then((result) => {
          result.rows.forEach(item=>{
              item.auditName = auditCon[item.Status]
              const scope = {x:res1.rows[index][this.xkey],y:res2.rows[index][this.ykey]}
              const results = this.formulaConfig.map(ele => ({
                  ...ele,
                  result: evaluate(ele.expression, scope)
              }));
              for(let i in results) {
                  const items = results[i];
                  item['r'+i] = format(items.result, { notation: 'fixed', precision: 2 })
                  
              }
          })
          const _arr = JSON.parse(JSON.stringify(result.rows))
          datakey.push('auditName')
          datakey.push('DataTime')
          const data = _arr.map(item => {
              const arr = [];
              for(let i in datakey){
                  arr.push(item[datakey[i]])
              }
              return arr;
          });
          const excelData = [headers, ...data];
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet(excelData);

          XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表');

          XLSX.writeFile(workbook, `${this.startTime}-${this.endTime}计算数据.xlsx`);
        })
      }
      else {
        let url1 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.xdata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        let url2 = `/api/Mon_Point_Manager/GetMonitorData?pointNum=${this.ydata}&startTime=${this.startTime}&endTime=${this.endTime}&pageIndex=1&pageSize=${this.total>30000?30000:this.total}`;
        const req1 = this.http.get(url1,{},true)
        const req2 = this.http.get(url2,{},true)
        Promise.all([req1, req2]).then(([res1, res2])=>{
          if(res1.rows.length != res2.rows.length) {
            this.$message({
              message: '点位数据源有误，请确认',
              type: 'warning'
            });
            return
          }
          res1.rows.forEach((item,index)=>{
              item.auditName = auditCon[item.Status]
              const scope = {x:res1.rows[index][this.xkey],y:res2.rows[index][this.ykey]}
              const results = this.formulaConfig.map(ele => ({
                  ...ele,
                  result: evaluate(ele.expression, scope)
              }));
              for(let i in results) {
                  const items = results[i];
                  item['r'+i] = format(items.result, { notation: 'fixed', precision: 2 })
              }
          })
          const _arr = JSON.parse(JSON.stringify(res1.rows))
          datakey.push('auditName')
          datakey.push('DataTime')
          const data = _arr.map(item => {
              const arr = [];
              for(let i in datakey){
                  arr.push(item[datakey[i]])
              }
              return arr;
          });
          const excelData = [headers, ...data];
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet(excelData);

          XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表');

          XLSX.writeFile(workbook, `${this.startTime}-${this.endTime}计算数据.xlsx`);
          
        })
      }
    },

    // 查询图表方法
    click() {
      if (this.view == 1) {
        this.getMonitorData();
      } else {
        this.getAllMonitorData()
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
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMonitorData();
    },

    ChangeOne(e) {
      this.view = e;
      if (this.view == 2) {
        this.getAllMonitorData()
      } else {
        this.getMonitorData();
      }
    },

    // 点击tabs
    handleClick(tab, event) {
      if (tab.props.name == "first") {
        this.ChangeOne(2);
      } else {
        this.ChangeOne(1);
      }
    },
  },
};
</script>
<style lang="less">
.time {
  display: flex;
  .timeout {
    margin-top: 5px;
    margin-left: -2px;
  }
}
</style>

<style lang="less" scoped>
.weiyis {
  ::v-deep .dia-content .dia-footer {
    padding: 0 24px 19px 0;
  }
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
.right-table {
  height: 100%;
  .search-info {
    height: 66px;
  }
  .intab {
    height: calc(100% - 106px);
  }
  .tuEcharts {
    height: calc(100% - 66px);
    ::v-deep #operation-data .right-box {
      height: 100%;
      padding: 0 24px;
    }
  }
  ::v-deep .v-table {
    height: 100% !important;
  }
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
.pagination {
  display: flex;
  justify-content: flex-end;
}
.btns {
  background-color: #fff;
}
#operation-data {
  padding: 0 15px;

  .right-box {
    height: 800px;
    padding: 24px;
    border: 1px solid #f8f8f9;
  }

  .is-top {
    color: black;
  }

  ::v-deep .el-tabs__nav-scroll .el-tabs__item {
    // background: #0c2751;
    padding: 0 6px !important;
  }

  .el-tabs__nav-wrap::after {
    background: none;
  }

  .el-form-item__label {
    color: black;
  }

  .search-button {
    margin-left: 56px;
    width: 140px;
  }

  ::v-deep .el-range-input {
    // background: #11305f;
    color: black;
  }

  ::v-deep .el-form-item__label {
    color: black;
    margin-top: 5px;
  }

  .el-input__inner {
    // background: #11305f;
    // border: 1px solid #2e4975;
    color: black;
  }

  ::v-deep .el-date-editor {
    // background: #11305f;
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
}
</style>
