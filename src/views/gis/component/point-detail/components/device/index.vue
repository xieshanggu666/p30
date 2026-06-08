<template>
      <div id="device-control">
            <el-form label-width="148px">
                  <el-form-item label="同步经纬度">
                        <el-button type="primary">
                              同步经纬度
                        </el-button>
                  </el-form-item>
                  <el-form-item label="数据控制">
                        <el-button type="primary">
                              刷新
                        </el-button>
                  </el-form-item>
                  <el-form-item label="开关控制">
                        <el-button type="primary">
                              打开报警1
                        </el-button>
                        <el-button type="primary">
                              打开报警2
                        </el-button>
                        <el-button type="primary">
                              开启蓝牙
                        </el-button>
                  </el-form-item>

                  <el-form-item label="配置控制">
                        <el-button type="primary">
                              设备配置
                        </el-button>
                        <el-button type="primary">
                              获取配置
                        </el-button>
                        <el-button type="primary">
                              设备重启
                        </el-button>
                        <el-button type="primary">
                              获取IMEI
                        </el-button>
                        <el-button type="primary">
                              获取SIM
                        </el-button>
                  </el-form-item>
            </el-form>

            <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="wTime" label="发送命令时间">
                  </el-table-column>
                  <el-table-column prop="rTime" label="接受命令时间">
                  </el-table-column>
                  <el-table-column prop="cmdName" label="命令名称">
                  </el-table-column>
                  <el-table-column prop="status" label="状态">
                  </el-table-column>
                  <el-table-column label="操作">
                        <template #default="scope">
                              <el-button @click="handleClick(scope.row)" type="text" size="small">查看命令</el-button>
                        </template>
                  </el-table-column>
            </el-table>

      </div>
</template>

<script>
// import { GetCmdLogPage } from "@/api/page/gis/point"
export default {
      props: ['currentPoint'],
      watch: {
            currentPoint() {
                  this.PageInit();
            }
      },
      computed: {
            dialogTitle() {
                  let str = null
                  switch (this.dialogType) {
                        case 'operation':
                              str = "运行数据"
                              break;
                        case 'satellite':
                              str = "卫星数据"
                              break;
                        case 'device':
                              str = "设备控制"
                              break;
                        case 'monitor':
                              str = "监测数据"
                              break;
                  }
                  return `${str}(${this.currentPoint.name}-${this.currentPoint.rtuDeviceNO || this.currentPoint.deviceNo || ''})`
            }
      },
      mounted() {
            this.PageInit();
      },
      data() {
            return {
                  dialogVisible: false,
                  dialogType: 'operation',
                  tableData: [{
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                  }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1517 弄'
                  }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                  }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                  }]
            }
      },
      methods: {
            ChartInit(type) {
                  if (type) {
                        this.dialogType = type;
                  }
                  this.dialogVisible = true;
            },
            handleClick(data) {
                  this.$alert(`发送命令为:${data.sendData}`, '查看命令', {
                        confirmButtonText: '确定'
                  });
            },
            PageInit() {
                  GetCmdLogPage({
                        deviceId: this.currentPoint.deviceId,
                        page: 1,
                        size: 15,
                  }).then(res => {
                        
                        this.tableData = res.pageList;

                  })
            }

      }

}
</script>

<style lang="scss">
#device-control {
      .el-form-item__label {
            color: #ffffff;
      }

      .el-table tr {
            background: #0c2751;
            color: #ffffff;
      }

      .el-table th {
            background: #0c2751;
            color: #ffffff;
      }

      .el-table {
            td {
                  border-bottom: 1px solid #123874;
            }

            th.is-leaf {
                  border-bottom: 1px solid #123874;
            }

            tbody tr:hover>td {
                  background-color: initial !important;
            }

            .el-table__body-wrapper {
                  background: #0c2751;
            }
      }
}
</style>