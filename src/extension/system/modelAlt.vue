<template>
    <el-dialog
        v-model="dialogVisible"
        title="菜单权限"
        width="886px"
        custom-class="xjcdialog"
        :before-close="handleClose"
    >
        <div class="caon">
            <div class="setions">
                <el-tree
                    ref="tree"
                    @check="checks"
                    :data="dataArr"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[]"
                    :default-checked-keys="chechkArr"
                    :props="defaultProps"
                />

            </div>
            <div class="subbtns">
                <el-button type="primary" @click="submits">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
export default{
    data(){
        return{
            roleId:'', //角色id
            dialogVisible: false, //弹窗显示隐藏
            defaultProps :{     //tree配置项
                children: 'children',
                label: 'text',
            },
            dataArr :[],  //tree数据结构数组
            chechkArr:[], //返显选中的节点 
            subData:[],   //选中的菜单
        }
    },
    created(){
        //查询tree菜单数据
        this.seleCidan();
    },
    methods:{
        //查询tree菜单数据
        seleCidan(){
            this.http.post('api/role/getCurrentTreePermission').then((result) => {
                //将一维数组转成tree数据结构
                const tree = this.buildTree(result.data.tree);
                //将按钮挂在到tree上
                this.btnTree(tree);
                this.dataArr=tree;
            });
        },
        //获取勾选的节点
        selectTree(){
            this.chechkArr=[];
            this.http.post('api/role/getUserTreePermission?roleId='+this.roleId,{}).then((result) => {
                let listy=result.data;
                listy.forEach(item=>{
                    if(item.actions){
                        item.actions.forEach(it=>{
                            this.chechkArr.push(item.id+it.value);
                        })
                    }else{
                        this.chechkArr.push(item.id);
                    }
                })
                this.$nextTick(()=>{
                    this.$refs.tree.setCheckedKeys(JSON.parse(JSON.stringify(this.chechkArr)),false);
                })
            });
        },
        
        //将一维数组转成tree数据结构
        buildTree(flatArray) {
            const map = {}; // 用于存储每个节点的引用
            const tree = []; // 最终的树形结构
            // 首先将所有节点存入 map 中
            flatArray.forEach(item => {
                map[item.id] = { ...item, children: [] };
            });
            // 遍历数组，构建树形结构
            flatArray.forEach(item => {
                if (item.pid === null || item.pid === 0) {
                    // 如果 pid 为 null 或 0，说明是根节点
                    tree.push(map[item.id]);
                } else {
                    // 否则，将其添加到父节点的 children 数组中
                    if (map[item.pid]) {
                        map[item.pid].children.push(map[item.id]);
                    }
                }
            });
            return tree;
        },
        //将按钮挂在到tree上
        btnTree(tree){
            tree.forEach(item => {
                if (item.children && item.children.length > 0) {
                    this.btnTree(item.children);
                }else{
                    if(item.actions.length>0){
                        item.actions.forEach((its,inx)=>{
                            let ids=item.id + its.value;
                            let obj={text:its.text,value:its.value, id:ids,pid:item.id,children:[]};
                            item.children.push(obj);
                        })
                    }
                } 
            })
        },
        //复选框逻辑处理 选中节点
        checks(checkedNodes,checkedKeys){
            let arrs=checkedKeys.checkedNodes;
            //处理数据格式为后端需要的格式
            this.pubFn(arrs);
        },
        //共用数据处理
        pubFn(arrs){
            let dataAs=[],issetre=[];
            arrs.forEach(item=>{
                let bool=(item.id.constructor != String);
                if((issetre.indexOf(item.id)==-1)&&bool){
                    //不为按钮情况下
                    let obj={id:item.id,actions:[{text:'查询',value:'Search'}]};
                    dataAs.push(obj);
                    issetre.push(item.id);
                }else{
                    //若为按钮
                    if(issetre.indexOf(item.pid)==-1){
                        issetre.push(item.pid);
                        let obj={id:item.pid,actions:[]};
                        dataAs.push(obj)
                    }
                }
            })
            //处理数据格式
            dataAs.forEach(item=>{
                arrs.forEach(its=>{
                    let bool=(its.id.constructor == String);
                    if(item.id==its.pid&&bool){
                        let obj=JSON.parse(JSON.stringify({text:its.text,value:its.value})) ;
                        item.actions.push(obj);
                    }
                })
            })
            //选中的菜单数据
            this.subData=dataAs;
        },
        //提交菜单
        submits(){
            
            //获取选中的节点
            let arrs= this.$refs.tree.getCheckedNodes();
            //处理数据格式为后端需要的格式
            this.pubFn(arrs);
           
            //获取父节点id集合
            let parentArr=[];
            this.subData.forEach(item=>{
                let parentIds = this.findParents(this.dataArr, item.id);
                parentIds.forEach(its=>{
                    if(parentArr.indexOf(its)==-1){
                        parentArr.push(its);
                    }
                })
            })
            //请求结果处理
            parentArr.forEach(its=>{
                let obj={id:its,actions:[{text:'查询',value:'Search'}]};
                this.subData.push(obj);
            })
            const resulte = this.uniqueByProperty(this.subData, 'id');
            let url = `api/role/SavePermission?roleId=${this.roleId}`;
            this.http.post(url, resulte, true).then((result) => {
                console.log('result',result);
                ElMessage({
                    message: result.message,
                    type: 'success',
                })
                this.dialogVisible=false;
                this.chechkArr=[];
            });
        },
         //数组根据制定属性优先级去重
         uniqueByProperty(arr, prop) {
            const seen = new Map();
            return arr.filter(item => {
                const key = item[prop];
                if (!seen.has(key)) {
                    seen.set(key, item);
                    return true;
                }
                return false;
            });
        },
        //接收表单行数据
        feilopenSate(row){
            this.roleId=row.Role_Id;
            this.dialogVisible=true;
            //查询选择的节点
            this.selectTree();
        },
        //根据子节点id获取所有相关的父级id
        findParents(treeData, childId, parents = []) {
            for (let i = 0; i < treeData.length; i++) {
                const node = treeData[i];
                if (node.id=== childId) {
                // 找到了目标子节点，返回其所有父节点id
                return [...parents, node.id];
                } else if (node.children && node.children.length > 0) {
                // 递归遍历子节点的所有子节点
                const result = this.findParents(node.children, childId, [...parents, node.id]);
                if (result) {
                    // 找到了目标子节点，返回其所有父节点id
                    return result;
                }
                }
            }
            // 没有找到目标子节点
            return null;
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
            .el-tree-node__content{
                height: 36px;
            }
            .el-icon{
                margin-left: 20px;
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
    background: #0486FE !important;
}
.setions::-webkit-scrollbar {
    background: #f5f5f5 !important;
    width: 5px !important;
    height: 5px;
}
.setions::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px #ddd !important;
    border-radius: 5px !important;
    background: transparent !important;
}
</style>