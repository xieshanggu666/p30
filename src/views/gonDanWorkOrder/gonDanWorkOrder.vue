<template>
    <div class="contaen">
        <!-- 表格 -->
        <publicTable 
        :tableConfig="tableConfig" 
        :tableLoading="tableLoading" 
        :templateData="templateData" 
        :searchConfig="searchConfig"
        :searchParams="searchParams"
        :searchData="searchData"
        :pagination="pagination">
        </publicTable>
        <!-- 表单 -->
        <el-dialog
            custom-class="butons"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="oneForm.titles"
            v-model="oneForm.visitDialogVisible"
            width="886px"
            :before-close="oneForm.handleVisitClose">
            <publicForm
                ref="ruleForm"
                :formConfig="oneForm.formConfig"
                :ruleForm="oneForm.ruleForm"
                :rules="oneForm.rules"
                :buttonConfig="oneForm.buttonConfig"
            ></publicForm>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog
            custom-class="butons"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="senheForm.titles"
            v-model="senheForm.visitDialogVisible"
            width="886px"
            :before-close="senheForm.handleVisitClose">
            <publicForm
                ref="ruleForm"
                :formConfig="senheForm.formConfig"
                :ruleForm="senheForm.ruleForm"
                :rules="senheForm.rules"
                :buttonConfig="senheForm.buttonConfig"
            ></publicForm>
        </el-dialog>  
        <!-- 处理流程 -->
        <el-dialog
            custom-class="butons"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="处理日志"
            v-model="liucVisible"
            width="620px"
            >
            <div class="shija">
                    <div class="tit_fs">流程</div>
                    <div class="time_si" v-for="(item,index) in RecordArr" :key="index">
                         <div class="u_left">
                            <div class="nans_s">
                                <el-image style="width: 32px; height: 32px" :src="http.ipAddress+item.Image" fit="cover" />
                                <i class="el-icon-success"></i>
                            </div>
                            <div class="s_xian"></div> 
                         </div>
                         <dvi class="u_right">
                            <div class="cjname">
                                <div>{{item.Status}}</div>
                                <div>{{item.CreateDate}}</div>
                            </div>
                            <div class="sebd">{{item.Name}}</div>
                            <div class="neims">
                                <div v-if="item.Remarks">{{item.Remarks}}</div>
                            </div>
                         </dvi>
                    </div> 
                </div>
        </el-dialog>  
    </div>
</template>
<script>
//表格配置数据
import tableConfig  from "./commit/tableConfig";
//搜索配置数据
import searchConfig  from "./commit/searchConfig";
//表单配置数据
import formConfig  from "./commit/formConfig";
//审核表单配置数据
import formSenhe  from "./commit/formSenhe";

import * as XLSX from 'xlsx';
export default {
    mixins: [tableConfig,searchConfig,formConfig,formSenhe],
    data(){
        return{
            liucVisible:false, //处理流程弹窗显示隐藏
            RecordArr:[], //记录数组
            uuRizis:{}, //日志对象
            shenheObj:{}, //审核对象

        }
    },
    created(){
        //查询列表数据
        this.setSearchParams();
    },
    methods:{
        //码表数据匹配
        codeTable(code){
            let codesArr=JSON.parse(localStorage.getItem('codeTable'))||[];  
            let datas = [];
            codesArr.forEach(item => {   
                if(item.dicNo == code) datas= item.data.map(ite=>({itemName:ite.value,itemValue:ite.key}));
            });
            return datas
        },
        //查询列表数据
        setSearchParams() {
            //匹配监测组
            let group=this.codeTable("groupManager");
            let url="/api/Mon_DevOps_Manager/GetPageData";
            let param=this.searchData;
            this.http.post(url, param, true).then((result) => {
               let list= result.rows;
               //设置表格列表数据
               this.templateData=list;
               this.templateData.forEach(item=>{
                     //工单类型
                    item.Gdstrat=item.ErrorTime?'设备工单':'手动工单';
                    //匹配监测组
                    group.forEach(its=>{
                        if(item.Group_Id==its.itemValue){
                            item.Group_Name=its.itemName;
                        }
                    }) 
               })
               //设置总页码
               this.pagination.total =result.total;
               this.tableLoading=false;
               console.log('list',list);
            });
        },
        //查询流程日志
        seleLiurizi(ids){
            let url="/api/Mon_OpsAuditRecord/GetPageData";
            let param={
                page:1,
                size:100,
                wheres:[{name:'DevOps_Id',value:ids}]
            };
            param.wheres=JSON.stringify(param.wheres);
            this.http.post(url, param, true).then((result) => {
               let list= result.rows;
               if(list.length>0){
                    this.RecordArr=JSON.parse(list[0].Record);
               }
               console.log('日志打印', this.RecordArr);
            });
        },

        //获取当天时间
        selectDay(){
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        exportExcel(list) {
            // 1. 定义表头（中文）
            const headers = ['项目名称', '部位名称', '测点名称', '测点编号','运维名称','工单类型','故障分类','项目负责人','指派人员','故障原因','处理办法','创建时间','工单状态'];
            const _arr = JSON.parse(JSON.stringify(list))
            const auditCon = {'0':"未派发",'1':"已分派",'2':"待审核",'3':"已结束",'-1':"未通过"}
            _arr.forEach(item=>{
                item.auditName = auditCon[item.AuditStatus]
            })
            // 2. 处理数据（和表头对应）
            const data = _arr.map(item => [item.Project_Name, item.Group_Name, item.Point_Name, item.Point_Num, item.Ops_Name, item.Gdstrat, item.Error_Type, item.ParentAuditor,item.DispatchUser, item.Error_Reason,item.Handle_Method,item.CreateDate,item.auditName]);
            const excelData = [headers, ...data];

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);

            XLSX.utils.book_append_sheet(workbook, worksheet, '工单列表');

            XLSX.writeFile(workbook, '工单数据.xlsx');
        }
    }
}
</script>

<style lang="scss" scoped>
.contaen{
    width: 100%;
    height: 100%;
    background: #ddd;
    ::v-deep .butons{
        top: 50%;
        transform: translateY(-50%);
        .el-dialog__header{
            padding: 17px 24px;
            padding-bottom: 0;
            .el-dialog__title{
                font-weight: bold;
                font-size: 16px;
                color: #333333;
            }
            .el-dialog__headerbtn{
                top: 20px;
                right: 24px;
                width: auto;
                height: auto;
            }
        }
        .el-dialog__body{
            max-height: 800px;
            overflow: auto;
            padding: 41px 24px 20px;
        }
        .el-dialog__body::-webkit-scrollbar-thumb {
            border-radius: 5px !important;
            background: #0486FE !important;
        }
        .el-dialog__body::-webkit-scrollbar {
            background: #f5f5f5 !important;
            width: 10px !important;
            height: 5px;
        }
        .el-dialog__body::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px #ddd !important;
            border-radius: 5px !important;
            background: transparent !important;
        }

    }
}
::v-deep .wcl{
    color: #FF576E;
    background: rgba(255,87,110,0.14);
}
::v-deep .ycl{
    color: #3570FC;
    background: #E6EEFF;
}
::v-deep .zxf{
    color:#999999;
    background: rgba(153,153,153,0.14);
}
::v-deep .zfc{
    color: #FF9D34;
    background: rgba(255,157,52,0.16);
}

.shija{
    width: 100%;
    padding: 20px;
    background: #F9F9F9;
    .tit_fs{
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        margin-bottom: 12px;
    }
    .time_si{
        width: 100%;
        display: flex;
        .u_left{
            width: 32px;
            margin-right: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .nans_s{
                width: 32px;
                height: 32px;
                position: relative;
                .el-image{
                    border-radius: 4px;
                    overflow: hidden;
                }
                i{
                    position: absolute;
                    right: -2px;
                    bottom: -2px;
                    border-radius: 50%;
                    background: #fff;
                    color:#3570FC ;
                }
            }
            .s_xian{
                width: 1px;
                height: calc(100% - 32px);
                border-right: 1px dashed #999;
            }
        }
        .u_right{
            width: calc(100% - 44px);
            .cjname{
                width: 100%;
                display: flex;
                align-items: center;
                font-weight: 500;
                font-size: 12px;
                color: #999999;
                margin-bottom: 4px;
                &>div:nth-child(1){
                    width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                &>div:nth-child(2){
                    text-align: right;
                    width: calc(100% - 94px);
                }
            }
            .sebd{
                font-weight: 500;
                font-size: 12px;
                color: #333333;
                margin-bottom: 6px;
            }
            .neims{
                padding-bottom: 32px;
                &>div{
                    padding: 8px 12px;
                    background: #E6E6E6;
                    font-weight: 500;
                    font-size: 12px;
                    color: #333333;
                }
            }
        }
    }
}
</style>
