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
            width="480px"
            :before-close="oneForm.handleVisitClose">
            <publicForm
                v-if="oneForm.visitDialogVisible"
                ref="ruleForm"
                :formConfig="oneForm.formConfig"
                :ruleForm="oneForm.ruleForm"
                :rules="oneForm.rules"
                :buttonConfig="oneForm.buttonConfig"
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
export default {
    mixins: [tableConfig,searchConfig,formConfig],
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
            let url="/api/Mon_Contactlist/GetPageData";
            let param=this.searchData;
            this.http.post(url, param, true).then((result) => {
               let list= result.rows;
               //设置表格列表数据
               this.templateData=list;
            //    this.templateData[0].types=1;
            //    this.templateData[1].types=0;
               //设置总页码
               this.pagination.total =result.total;
               this.tableLoading=false; 
               console.log('list',list);
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.contaen{
    width: 100%;
    height: 100%;
    background: #ddd;
    ::v-deep .leiClass{
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
</style>
