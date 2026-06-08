<template>
   <div class="container_s">
      <!-- 搜索 -->
      <div class="search_for">
          <div class="typelos">{{tableConfig.name}}<slot name="xjcbottons"></slot> </div>
          <div class="risouse">
            <div v-for="(i,index) in searchConfig.items" :key="index">
                <div class="input_s" :style="i.width?'width:'+i.width:''"  v-if="i.homeShow">
                  <el-input
                    clearable
                    v-if="!i.valueType || i.valueType === 'text'&&i.homeShow"
                    :placeholder="i.placeholder || '请输入名称'"
                    v-model="searchParams[i.key]"
                    :maxlength="i.maxlength || 30"
                  ></el-input>
                  <el-select
                    clearable
                    v-model="searchParams[i.key]"
                    v-if="i.valueType === 'select'&&i.homeShow"
                    :filterable="i.filterable || false"
                    :placeholder="i.placeholder || '请选择'"
                    @change="i.fn ? i.fn(searchParams[i.key]) : ''"
                  >
                    <el-option
                      v-for="its in i.data"
                      :key="its.value"
                      :label="its.itemName"
                      :value="its.itemValue"
                    >
                    </el-option>
                  </el-select>
                  <!--日期 或 日期时间 选择器-->
                  <el-date-picker
                    v-if="(i.valueType === 'datetime' ||
                      i.valueType === 'date' ||
                      i.valueType === 'month')&&i.homeShow"
                      v-model="searchParams[i.key]"
                      :type="i.valueType === 'datetime'? 'datetime'
                      :i.valueType === 'date'? 'date': 'month'"
                      :value-format="i.valueType === 'datetime'? 'YYYY-MM-DD HH:mm:ss': i.valueType === 'date'? 'YYYY-MM-DD': 'month'"
                      :placeholder="i.placeholder || '请选择'"
                  >
                  </el-date-picker>
                  <!--时间日期范围选择器-->
                  <el-date-picker
                    @change="i.fn ? i.fn(searchParams[i.key], searchParams) : ''"
                    v-if="i.valueType === 'datetimerange'&&i.homeShow"
                    v-model="searchParams[i.key]"
                    type="datetimerange"
                    :value-format="i.timestamp ? i.timestamp : 'YYYY-MM-DD HH:mm:ss'"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="isbent">
                  <el-button :type="i.type=='search'?'primary':''" v-for="(i,index) in searchConfig.bttomArr" @click="queryS(i)">{{i.text}}</el-button>
                  <el-button type="primary" @click="()=>{seniorStart=seniorStart==false?true:false}" v-if="!searchConfig.hasOwnProperty('seniorClose')">高级查询</el-button>
                  <!-- 新增 编辑 删除 导入 导出 按钮设置 -->
                  <el-button v-for="(i,index) in searchConfig.operationArr" :key="index" :type="i.key=='Add'?'primary':''" @click="pubBtn(i)"><i :class="i.icon"></i>{{i.label}}</el-button>
                  <!-- <el-button type=""><i class="el-icon-setting"></i>设置</el-button> -->
              </div>
          </div>
          <!-- 高级查询 -->
          <div class="senior" v-if="seniorStart">
            <el-row :gutter="20">
              <el-col  :span="12" v-for="(i,index) in searchConfig.items" :key="index">
                <div class="grid-content">
                  <div class="uowidth" :style="{width:searchConfig.labelWtdth}">{{i.label}}：</div>
                  <el-input
                    clearable
                    v-if="!i.valueType || i.valueType === 'text'"
                    :placeholder="i.placeholder || '请输入名称'"
                    v-model="searchParams[i.key]"
                    :maxlength="i.maxlength || 30"
                  ></el-input>
                  <el-select
                    clearable
                    v-model="searchParams[i.key]"
                    v-if="i.valueType === 'select'"
                    :filterable="i.filterable || false"
                    :placeholder="i.placeholder || '请选择'"
                    @change="i.fn ? i.fn(searchParams[i.key]) : ''"
                  >
                    <el-option
                      v-for="its in i.data"
                      :key="its.value"
                      :label="its.itemName"
                      :value="its.itemValue"
                    >
                    </el-option>
                  </el-select>
                  <!--日期 或 日期时间 选择器-->
                  <el-date-picker
                    v-if="i.valueType === 'datetime' ||
                      i.valueType === 'date' ||
                      i.valueType === 'month'"
                      v-model="searchParams[i.key]"
                      :type="i.valueType === 'datetime'? 'datetime'
                      :i.valueType === 'date'? 'date': 'month'"
                      :value-format="i.valueType === 'datetime'? 'YYYY-MM-DD HH:mm:ss': i.valueType === 'date'? 'YYYY-MM-DD': 'month'"
                      :placeholder="i.placeholder || '请选择'"
                  >
                  </el-date-picker>
                   <!--时间日期范围选择器-->
                  <el-date-picker
                    @change="i.fn ? i.fn(searchParams[i.key], searchParams) : ''"
                    v-if="i.valueType === 'datetimerange'&&i.homeShow"
                    v-model="searchParams[i.key]"
                    type="datetimerange"
                    :value-format="i.timestamp ? i.timestamp : 'timestamp'"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  >
                  </el-date-picker>
                </div>
              </el-col>

              
            </el-row>
            <div class="btnrows"> 
              <el-button :type="i.type=='search'?'primary':''" v-for="(i,index) in searchConfig.bttomArr" @click="queryS(i)">{{i.text}}</el-button>
              <el-button @click="seniorStart=false">关闭</el-button>
            </div>
          </div>
      </div>
      <!-- 表格 -->
      <div class="cont_tab"  v-loading="tableLoading" element-loading-text="加载中...">
        <el-table 
        stripe tooltip-effect="dark"  :data="templateData" 
        @selection-change="(val)=>{tableConfig.checkboxFn(val)} "
        style="width: 100%" height="100%">
            <el-table-column  v-if="tableConfig.checkbox" type="selection"  width="55" />
            <el-table-column v-if="tableConfig.index" label="序号" type="index" width="70px" />
            <el-table-column show-overflow-tooltip  v-for="(i,index) in tableConfig.rows" :key="index" :prop="i.prop" :label="i.label" :width="i.width">
              <template #default="scope">
                  <div  v-if="i.type=='img'">
                    <el-image class="cusp" preview-teleported  :preview-src-list="[http.ipAddress+scope.row[i.prop]]" style="width: 30px; height: 30px" :src="http.ipAddress+scope.row[i.prop]" fit="cover" />
                  </div>
                  <div class="tags" :class="i.style[scope.row[i.prop]]" v-else-if="i.type=='tag'">
                    {{i.data[scope.row[i.prop]]}}
                  </div>
                  <div class="font_nowrap"  v-else>
                    {{ scope.row[i.prop] }}
                  </div>
              </template>
            </el-table-column>  
            <el-table-column 
             :width="tableConfig.rowButtons.width?tableConfig.rowButtons.width:170"
             v-if="tableConfig.rowButtons &&tableConfig.rowButtons.items && tableConfig.rowButtons.items.length > 0"
             fixed="right" label="操作" align="center" width="200">
              <template #default="scope">
                <div class="tab_botms">
                  <template   v-for="(i, index) in tableConfig.rowButtons.items" :key="index">
                    <el-button
                    v-if="i.hidden?(!i.hidden(scope.row)):true"
                    @click="i.fn(scope.row)" 
                    link type="primary"  size="small"> {{i.label}}</el-button>
                  </template>
                </div>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page_fenye" v-if="pagination.show">
        <el-pagination
          v-if="pagination && pagination.show"
          :small="pagination.small || false"
          @size-change="pagination.sizeChange"
          @current-change="pagination.pageChange"
          :current-page="searchData.page || 1"
          :page-sizes="pagination.pageSizes || [30, 60, 100,120]"
          :page-size="searchData.rows || 30"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total || 0"
        >
        </el-pagination>
      </div>
   </div>
</template>

<script>
import {useStore} from "vuex"
import { defineComponent } from "vue";
export default defineComponent({
  props:{
    searchConfig:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    searchParams:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    searchData:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    tableLoading:{
      type:Boolean,
      default:true
    },
    tableConfig:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    templateData:{
      type:Array,
      default:()=>{
        return []
      }
    },
    pagination:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data(){
    return{
      seniorStart:false, //高级查询是否展开

    }
  },
  created(){
      //操作按钮权限匹配
      this.buttonPermissions();
  },
  methods:{
      //操作按钮权限匹配
      buttonPermissions(){
          const path = this.$route.path; //根据当前路由与接口 筛选 匹配按钮数据
          //获取账号所有菜单按钮权限
          let permission = useStore().state.permission;
          //根据路由匹配菜单以及按钮权限
          let menuList= permission.filter(item=>item.url==path)[0];
          let btonArr=Array.from(new Set(menuList.permission));//数组去重
          //表格操作按钮权限匹配
          let newRowBottonConfig = [];
          if (JSON.stringify(this.tableConfig.rowButtons) != "{}") {
            if (this.tableConfig.rowButtons.hasOwnProperty("items")) {
              this.tableConfig.rowButtons.items.forEach((item, index) => {
                btonArr.forEach(its=>{
                  if(item.key==its){
                    newRowBottonConfig.push(item);
                  }
                })
              });
              this.tableConfig.rowButtons.items = newRowBottonConfig;
            }
          }
          //查询按钮权限匹配
          let searchForBottonConfig = [];
          if (JSON.stringify(this.searchConfig.operationArr) != "{}") {
            this.searchConfig.operationArr.forEach((item, index) => {
                btonArr.forEach(its=>{
                  if(item.key==its){
                    searchForBottonConfig.push(item);
                  }
                })
              });
              this.searchConfig.operationArr=searchForBottonConfig;
          }
      },
      //点击搜索操作  
      queryS(i){
          //模糊查询匹配
          let vague=this.searchConfig.items.filter(item=>item.vague);
          //用于处理特殊的查询条件 比如时间范围选择器 等
          let objInputType={};
          this.searchConfig.items.forEach(item=>{
            objInputType[item.key]=item.valueType;
          })
          let maps=vague.map(item=>item.key);
          let arrlist=[]; //查询条件
          for(let key in this.searchParams){
              //特殊处理时间范围选择
              if(objInputType[key]=='datetimerange'&&(this.searchParams[key]!=''&&this.searchParams[key]!=null)){
                 let arr=this.searchParams[key];
                 arr.forEach((item,index)=>{
                    let obj={name:key,value:arr[index],displayType:index==0?'thanorequal':'lessorequal'};
                    arrlist.push(obj);
                 })
                 continue
              }
              //正常查询条件
              if(this.searchParams[key]!=''&&this.searchParams[key]!=null){
                  let obj={name:'',value:''};
                  obj.name=key;
                  obj.value=this.searchParams[key];
                  if(maps.indexOf(key)>-1){obj.displayType='like'}
                  arrlist.push(obj);
              }
          }
          this.searchData.wheres=JSON.stringify(arrlist);
          //回调
          i.fn(this.searchParams);
      },
      //搜索栏 新建 编辑 删除 操作按钮
      pubBtn(i){
        //导出操作
        if(i.key=='Export'){
          this.derive(i.path);
        }else{
          i.fn()
        }
      },
      //导出
      derive(path, fileTitle) {
          this.http.get(path, {
              params: this.searchParams ? this.searchParams : {},
              responseType: "blob",
              headers: {
                satoken: localStorage.getItem("token"),
                "X-Requested-With": "XMLHttpRequest",
              },
            }).then((res) => {
                this.$message.success("导出成功！");
                // 下载文件方法
                var eleLink = document.createElement("a");
                let filename = (fileTitle ? fileTitle : "文件") + ".xls";
                eleLink.download = filename;
                eleLink.style.display = "none";
                // 字符内容转变成blob地址
                var blob = new Blob([res]);
                eleLink.href = URL.createObjectURL(blob);
                // 自动触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            });
      },
  }
})
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'pingFang';
  src: url('../assets/font/pingFang.ttf') format('truetype'), /* Safari, Android, iOS */
}
.container_s{
  width: 100%;
  height: 100%;
  background: #fff;
  .search_for{
    width: 100%;
    height: 62px;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    .typelos{
      font-weight: bold;
      display: flex;
      align-items: center;

      font-size: 16px;
      color: #333333;
    }
    .risouse{
      display: flex;
      align-items: center;
      .input_s{
          width: 240px;
          height: 32px;
          margin-right: 12px;
          .el-select{
            width: 240px;
          }
      }
      .isbent{
        .el-button--primary{
          background: #3570FC;
        }
        i{
          margin-right: 4px;
        }
      }
    }
    .senior{
      width:calc(100% - 48px);
      height: auto;
      position: absolute;
      z-index: 99;
      top: 62px;
      left: 24px;
      padding: 24px 30px;
      background: #fff;
      box-shadow: 1px 3px 5px #ddd;
      .grid-content{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .el-select{
          width: 100%;
        }
        ::v-deep .el-date-editor{
          width: 100% !important;
        }
        .uowidth{
          text-align: right;
          min-width: 80px;
          margin-right: 10px;
          font-size: 14px;
          color: #333;
        }
      }
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .btnrows{
        text-align: right;
      }
    }
  }
  .cont_tab{
    width:calc(100% - 46px);
    margin: auto;
    height: calc(100% - 138px);
    padding: 24px 0 0;
    border-bottom: 1px solid #ccc;
    .cusp{
      cursor: pointer;
    }
    .font_nowrap{
      width: 100%;
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
      font-size: 14px;
      color: #333333;
    }
    ::v-deep .el-table tr th{
      width: 1602px;
      height: 44px;
      background: #F8FAFF;
      font-weight: bold;
      font-size: 14px;
      font-family: pingFang !important;
      color: #333333;
    }
    ::v-deep .el-table td.el-table__cell{
      border-bottom: none;
    }
    ::v-deep .el-table th.el-table__cell.is-leaf{
      border-bottom: none;
    }
    .tab_botms{
      display: flex;
      justify-content: center;
      align-items: center;
      ::v-deep .el-button{
        font-weight: 500;
        font-size: 14px !important;
        color: #3570FC;
        padding: 0 8px !important;
        border-right: 1px solid #3570FC;
        margin-left: 0;
        &:last-child{
          border: none;
        }
      }
    }
  }
  .page_fenye{
    width: 100%;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 24px;
  }
}
.tags{
  width: fit-content;
  width: -moz-fit-content;
  font-weight: 500;
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 4px ;
}
</style>