<template>
    <el-dialog
        v-model="dialogVisible"
        title="数据配置"
        width="750px"
        custom-class="xjcdialog"
        :before-close="handleClose"
    >
       <div class="caon">
            <div class="setions">
                <div class="inpusc">
                   <div class="labels"> L参数：</div> <el-input v-model="subOnj.L" placeholder="请输入"></el-input>
                </div>
                <el-table class="xintab" :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="Pointnum" label="测斜点位编号" >
                        <!-- <template  #default="scope">
                            <el-input v-model="scope.row.Pointnum" placeholder="请输入"></el-input>
                        </template>     -->
                    </el-table-column>
                    <!-- <el-table-column prop="PointName" label="点位名称" /> -->
                    <el-table-column prop="Deep" label="深度" >
                        <template  #default="scope">
                            <el-input v-model="scope.row.Deep" placeholder="请输入"></el-input>
                        </template>    
                    </el-table-column>
                </el-table>
            </div>
            <div class="subbtns">
                <el-button type="primary" @click="submits">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
       </div>
    </el-dialog>
</template>

<script>
export default{
    data(){
        return{
            inputes:'',
            dialogVisible:false,
            subOnj:{
                L:'',
                Points:[
                    {Pointnum:'',Deep:''}
                ]
            },
            tableData:[],
            forms:{},
        }
    },
    methods:{
        handleClose(){
            this.dialogVisible = false;
        },
        open(form){
            this.forms=form;
            this.dialogVisible = true;
            //根据设备id查询对应的点位信息  类型为测线仪1020
            const typeId = form.Type_Id == 29 ? '23' : '43'
            let obj=JSON.stringify([{name:'Dev_Id',value:form.Dev_Id},{name:'Type_Id',value:typeId}]);
            if(form.Config){
                if(JSON.parse(form.Config).Points){
                    //匹配数据
                    let Points=JSON.parse(form.Config).Points;
                    this.seleDwei(obj,Points);
                    this.subOnj=JSON.parse(form.Config);
                }else{
                    this.seleDwei(obj);
                }
            }else{
                this.seleDwei(obj);
            }
            
        },
        //根据设备id查询对应的点位信息
        seleDwei(wheresy,Points=[]){
            let obj={order: "asc",page: 1,rows: 120,sort: "Point_Order",wheres:wheresy};
            this.http.post('api/Mon_Point_Manager/getPageData',obj).then(res=>{
               let listy=res.rows;
               this.tableData=listy.map(item=>{
                    return {Pointnum:item.Point_Num,Deep:''}
                })
                //匹配数据
                Points.forEach(item=>{
                    let index=this.tableData.findIndex(item1=>{
                        return item1.Pointnum==item.Pointnum
                    })
                    if(index>-1){
                        this.tableData[index].Deep=item.Deep;
                    }
                });
            })
        },
        //提交配置数据
        submits(){
            this.subOnj.Points=this.tableData.map(item=>{
                return {Pointnum:item.Pointnum,Deep:item.Deep}
            });
            this.forms.Config=JSON.stringify(this.subOnj);
            this.dialogVisible = false;
        }
    }
}
</script>

<style  lang="scss">
 .xjcdialog{
    top: 50% !important;
    transform: translateY(-50%) !important;
    height: 700px;
   .el-dialog__header{
        margin-right: 0px;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        padding: 0 0 0 24px;
        padding-bottom: 0;
        height: 56px;
        line-height: 56px;
        .el-dialog__headerbtn{
            width: 56px;
            height: 56px;
            top: 0;
            font-size: 20px;
        }
    } 
    .el-dialog__body{
        width: 100%;
        height: calc(100% - 56px);
        padding: 0;
    }
    .caon{
        height: 100%;
        .setions{
            padding-top: 24px;
            height: calc(100% - 84px);
            overflow: hidden;
            overflow-y: auto;
            padding: 0 24px;
            .inpusc{
                display: flex;
                align-items: center;
                padding: 24px 0 24px;
                .labels{
                    width: 55px;
                }
                .el-input{
                    height: 36px;
                }
            }
            .xintab {
                th{
                    background: #F8FAFF;
                    height: 44px;
                    .cell{
                        font-weight: bold;
                        font-size: 14px;
                        color: #333333;
                        padding: 0 50px;
                    }
                }
                td{
                    .cell{
                        font-size: 14px;
                        color: #333333;
                        padding: 0 50px;
                    }
                }
            }
        }
        .subbtns{
            padding: 29px 24px 19px 0;
            height: 84px;
            display: flex;
            align-items: center;
            justify-content: right;
            .el-button{
                width: 86px;
                height: 36px;
                border-radius: 4px;
                font-weight: 500;
                font-size: 14px;
            }
            .el-button--primary{
                background: #3570FC;
            }
        }
    }
}

.setions::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: rgba(162, 172, 194, 0.3) !important;
}
.setions::-webkit-scrollbar {
    background: #EFEFEF !important;
    width: 5px !important;
    height: 5px;
}
.setions::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #EFEFEF !important;
    border-radius: 5px !important;
    background: transparent !important;
}
</style>