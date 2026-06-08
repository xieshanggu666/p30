<template>
    <div class="contaen">
        <div class="biganzs">岸坡再造监测</div>
        <div class="tablc">
            <!-- 表格 -->
            <publicTable 
            :tableConfig="tableConfig" 
            :tableLoading="tableLoading" 
            :templateData="templateData" 
            :searchConfig="searchConfig"
            :searchParams="searchParams"
            :searchData="searchData"
            :pagination="pagination">
            <template v-slot:xjcbottons>
                <el-button class="ml15" type="primary" size="mini" @click="RestoreOriginal">还原最初状态</el-button>
                <div class="yuasval">
                    <!-- <el-checkbox @change="chanVal" v-model="checked">表格减去原始值</el-checkbox> -->
                </div>
            </template>
            </publicTable>
        </div>
        <div class="tablc ers" v-if="templateData.length>0">
            <lineChartData :echartsConfig="linConfig" :echrasx="echrasx" :namels="namels"></lineChartData>
        </div>
        <!-- 表单 -->
        <!-- <el-dialog
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
        </el-dialog> -->
    </div>
</template>
<script>
//表格配置数据
import tableConfig  from "./commit/tableConfig";
//搜索配置数据
import searchConfig  from "./commit/searchConfig";
//表单配置数据
import formConfig  from "./commit/formConfig";
//折线图数据
import lineChartData  from "./component/lineChartData";
import { mapState } from 'vuex';
// let timefel=null; //定时器
export default {
    components:{lineChartData},
    mixins: [tableConfig,searchConfig,formConfig],
    data(){
        return{
            timefel:null, //定时器
            namels:'', //图表名称
            echrasx:'', //刷新图表
            devId:'',//设备id
            checked:false, //false解算后的值  true减去原始值
            linConfig:{
                max:null,//最大值
                min:null,//最小值
                seriesData:[
                    {name:'x方向', data: []},
                    {name:'y方向', data: []},
                    {name:'z方向',data: []},
                ],
                xAxisData:[]
            },
        }
    },
    computed:{
        ...mapState(["isrouter"])
    },
    watch:{
        isrouter(val){
            this.echrasx=val;
            //搜索下拉赋值
            this.secharse();
            //查询列表数据
            this.setSearchParams();
        }
    },
    created(){
        //搜索下拉赋值
        this.secharse();
        //获取前两个小时数据
        this.searchParams.startTime =this.getseo(); 
        this.searchParams.endTime =this.getCur();
        //查询列表数据
        this.setSearchParams();
        if(this.timefel){
            clearInterval(this.timefel);
            this.timefel=null;
        }
        this.timefel=setInterval(() => {
            //获取前两个小时数据
            this.searchParams.startTime =this.getseo(); 
            this.searchParams.endTime =this.getCur();
            this.setSearchParams();
        }, 60000);
    },
    methods:{
        //销毁定时器
        celfn(){
            clearInterval(this.timefel);
            this.timefel=null;
            console.log('组件销毁前执行操作22...');
        },
        //搜索下拉赋值
        secharse(){
            let warning=localStorage.getItem('warning');
            if(warning){
                let seleData=JSON.parse(warning);
                let resdata=seleData.map(item=>{return {itemName:item.title,itemValue:item.Dev_Id}})
                //设置搜索下拉
                this.searchConfig.items[0].data=resdata;
                //默认取第一个
                this.searchParams.devId=resdata[0].itemValue; //"device001";  
                this.namels=resdata[0].itemName;
                //赋值设备id
                this.devId= resdata[0].itemValue;// "device001";
            }
        },
        //查询列表数据
        setSearchParams() {
            let url="/api/Mon_Point_Manager/GetDemoGNSSMonitorData";
            let param=this.searchParams;
            this.http.get(url, param, true).then((result) => {
               if(!result.status){this.$message.error(result.message); this.tableLoading=false; return; }
               let list= result.data.data;
               this.tableLoading=false;


                //减去初始值
                let initial_V=JSON.parse(result.data.initial_V); //原始值
                let listys=JSON.parse(JSON.stringify(list));
                listys.forEach(item=>{
                    //将米转换成毫米 减去初始值 并保留6位小数
                    if( item.v1){
                        item.v1=((item.v1*1000)-(initial_V.filter(its=>its.FieldName=='V1')[0].Value)*1000).toFixed(4);
                    }
                    if( item.v2){
                        //item.v2=(item.v2-initial_V.filter(its=>its.FieldName=='V2')[0].Value).toFixed(6)*1000;
                        item.v2=((item.v2*1000)-(initial_V.filter(its=>its.FieldName=='V2')[0].Value)*1000).toFixed(4);
                    }
                    if( item.v3){
                        //item.v3=(item.v3-initial_V.filter(its=>its.FieldName=='V3')[0].Value).toFixed(6)*1000;
                        item.v3=((item.v3*1000)-(initial_V.filter(its=>its.FieldName=='V3')[0].Value)*1000).toFixed(4);
                    } 
                })

                
               //设置表格列表数据
               this.templateData=listys;
               //折线图倒序
               let melist=JSON.parse(JSON.stringify(listys)).reverse();
               //设置折线图数据
               this.linConfig.xAxisData=melist.map(item=>item.dataTime);
               this.linConfig.seriesData[0].data=melist.map(item=>item.v1);
               this.linConfig.seriesData[1].data=melist.map(item=>item.v2);
               this.linConfig.seriesData[2].data=melist.map(item=>item.v3);
                //获取最大最小值
                let numsArr=[];
                melist.forEach(item=>{
                    numsArr.push(item.v1*1,item.v2*1,item.v3*1);
                })
                this.linConfig.max=Math.max(...numsArr);
                this.linConfig.min=Math.min(...numsArr);

            });
        },
        //还原最初状态
        RestoreOriginal(){
            let url='/api/Mon_Point_Manager/ResetStage?devId='+this.devId;
            this.http.post(url, {}, true).then((result) => {
                if(result.status){
                    this.$message.success(result.message);
                }
            });
        },

    //js获取当前时间 
    getCur() {
        const now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
    
        // 格式化后的当前时间字符串
        let formattedCurrentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedCurrentTime;
       
    },
    //js获取前两个小时数据
    getseo(){
        const now = new Date();now.setHours(now.getHours() - 2);
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
    
        // 格式化后的当前时间字符串
        let formattedCurrentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedCurrentTime;
    },
    }
}
</script>

<style lang="scss" scoped>
::v-deep .container_s .cont_tab{
    border-bottom: none !important;
    height:calc(100% - 63px) !important;
}
.contaen{
    width: 100%;
    height: 100%;
    .biganzs{
        position: absolute;
        top: 15px;
        left: 50%;
        font-size: 28px;
        font-weight: bold;
        transform: translateX(-50%);
    }
    .tablc{
        width: 100%;
        height: 50%;
        background: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ers{
        box-sizing: border-box;
    }
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
.ml15{
    margin-left: 15px;
}
.yuasval{
    padding-left: 10px;
}
</style>
