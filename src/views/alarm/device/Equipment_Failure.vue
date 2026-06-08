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
            custom-class="leiClass"
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
        <!-- 已处理查看 -->
        <el-dialog
            custom-class="leiClass"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="yclForm.titles"
            v-model="yclForm.visitDialogVisible"
            width="1230px"
            :before-close="yclForm.handleVisitClose">
            <div class="yichulicss">
                <div class="biaodan">
                     <publicForm
                        ref="ruleForm"
                        :formConfig="yclForm.formConfig"
                        :ruleForm="yclForm.ruleForm"
                        :rules="yclForm.rules"
                        :buttonConfig="yclForm.buttonConfig"
                    ></publicForm>
                </div>
                <div class="shija">
                    <div class="tit_fs">流程</div>
                    <div class="time_si">
                         <div class="u_left">
                            <div class="nans_s">
                                <el-image style="width: 32px; height: 32px" src="http://159.75.243.87:29991/Upload/Tables/Sys_User/202505151015277612/cpg.png" fit="cover" />
                                <i class="el-icon-success"></i>
                            </div>
                            <div class="s_xian"></div> 
                         </div>
                         <dvi class="u_right">
                            <div class="cjname">
                                <div>创建工单</div>
                                <div>2025-01-12 12:20:12</div>
                            </div>
                            <div class="sebd">王雨辰</div>
                            <div class="neims">
                                <div>备注，有就显示，没有就不显示有就显示，没有就不显示有就显示，没有就不显示有就显示，没有就不显示有就显示，没有就不显示</div>
                            </div>
                         </dvi>
                    </div> 
                    <div class="time_si">
                         <div class="u_left">
                            <div class="nans_s">
                                <el-image style="width: 32px; height: 32px" src="http://159.75.243.87:29991/Upload/Tables/Sys_User/202505151015277612/cpg.png" fit="cover" />
                                <i class="el-icon-success"></i>
                            </div>
                            <div class="s_xian"></div> 
                         </div>
                         <dvi class="u_right">
                            <div class="cjname">
                                <div>创建工单</div>
                                <div>2025-01-12 12:20:12</div>
                            </div>
                            <div class="sebd">王雨辰</div>
                            <div class="neims">
                                
                            </div>
                         </dvi>
                    </div> 
                    <div class="time_si">
                         <div class="u_left">
                            <div class="nans_s">
                                <el-image style="width: 32px; height: 32px" src="http://159.75.243.87:29991/Upload/Tables/Sys_User/202505151015277612/cpg.png" fit="cover" />
                                <i class="el-icon-success"></i>
                            </div>
                            <div class="s_xian"></div> 
                         </div>
                         <dvi class="u_right">
                            <div class="cjname">
                                <div>创建工单</div>
                                <div>2025-01-12 12:20:12</div>
                            </div>
                            <div class="sebd">王雨辰</div>
                            <div class="neims">
                                
                            </div>
                         </dvi>
                    </div> 
                </div>
            </div>
        </el-dialog>
        <!-- 自修复 -->
        <el-dialog
            custom-class="leiClass"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="zxfForm.titles"
            v-model="zxfForm.visitDialogVisible"
            width="886px"
            :before-close="zxfForm.handleVisitClose">
            <publicForm
                ref="ruleForm"
                :formConfig="zxfForm.formConfig"
                :ruleForm="zxfForm.ruleForm"
                :rules="zxfForm.rules"
                :buttonConfig="zxfForm.buttonConfig"
            ></publicForm>
            <div class="timezou">
                <div class="ti_list" v-for="item in 10">
                    <div class="divsan">
                        <div><div class="huise"></div> 08RT2024120007（GNSS监测站(Ublox)</div>
                        <div><div class="reds "></div>2025-01-12 12:01:52（故障）</div>
                        <div><div class="lvse"></div>2025-01-12 12:02:22（修复）</div>
                    </div>
                    <div class="yuand">

                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 暂封存 -->
        <el-dialog
            custom-class="leiClass"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="zfcForm.titles"
            v-model="zfcForm.visitDialogVisible"
            width="886px"
            :before-close="zfcForm.handleVisitClose">
            <publicForm
                ref="ruleForm"
                :formConfig="zfcForm.formConfig"
                :ruleForm="zfcForm.ruleForm"
                :rules="zfcForm.rules"
                :buttonConfig="zfcForm.buttonConfig"
            ></publicForm>
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
//已处理查看表单配置数据
import yichuliformConfig  from "./commit/yichuliformConfig";
//自修复查看表单配置数据
import zxfformConfig  from "./commit/zxfformConfig";
//自修复查看表单配置数据
import zfcformConfig  from "./commit/zfcformConfig";
export default {
    mixins: [tableConfig,searchConfig,formConfig,yichuliformConfig,zxfformConfig,zfcformConfig],
    data(){
        return{
            name:'785'
        }
    }, 
    created(){ 
        //查询列表数据
        this.setSearchParams();
    },
    methods:{
        //查询列表数据
        setSearchParams() {
            let url="/api/Mon_FaultDevice_History/GetPageData";
            let param=this.searchData;
            this.http.post(url, param, true).then((result) => {
               let list= result.rows;
               //设置表格列表数据
               this.templateData=list;
               this.templateData[0].types=1;
               this.templateData[1].types=0;
               //设置总页码
               this.pagination.total =result.total;
               this.tableLoading=false;
               console.log('list',list);
            });
        },
    }
}
</script>
<style>

</style>
<style lang="scss" scoped>
::v-deep .leiClass::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: #3570FC !important;
}
::v-deep .leiClass::-webkit-scrollbar {
    background: #f5f5f5 !important;
    width: 10px !important;
    height: 5px;
}
::v-deep .leiClass::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #ddd !important;
    border-radius: 5px !important;
    background: transparent !important;
}
.contaen{
    width: 100%;
    height: 100%;
    background: #ddd;
    ::v-deep .el-overlay-dialog{
        display: flex;
    }
    ::v-deep .leiClass{
        max-height: 95%;
        overflow: auto;
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
            padding: 41px 24px 20px;
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
.yichulicss{
    display: flex;
    justify-content: space-between;
    .biaodan{
        width: calc(100% - 344px);
    }
    .shija{
        width: 320px;
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
                        width: 84px;
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
}
.timezou{
    padding: 20px 0;
    max-height: 241px;
    overflow: auto;
    background: #F9F9F9;
    .ti_list{
        padding: 0 30px  0 7px;
        .divsan{
            display: flex;
            align-items: center;
            justify-content: space-between;
            &>div{
                font-size: 14px;
                color: #333333;
                font-weight: 500; 
                display: flex;
                align-items: center;
                &>div{
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    margin-right: 6px;
                }
                .huise{
                    background: #DCDFE6;
                }
                .reds{
                    background: #FF576E;
                }
                .lvse{
                    background: #3BA272;
                }
            }
            &>div:nth-child(1){
                font-weight: bold;
            }
        }
        .yuand{
            height: 38px;
            margin-left: 3px;
            border-left: 1px dashed #999999;
        }
    }
}

.timezou::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: #3570FC !important;
}
.timezou::-webkit-scrollbar {
    background: #f5f5f5 !important;
    width: 10px !important;
    height: 5px;
}
.timezou::-webkit-scrollbar-track { 
    -webkit-box-shadow: inset 0 0 5px #ddd !important;
    border-radius: 5px !important;
    background: transparent !important;
}

</style>
