<template>
    <el-dialog
        v-model="dialogVisible"
        title="项目权限"
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
                    default-expand-all
                    :default-expanded-keys="[]"
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
                label: 'nodeName',
                id:'nodeValue'
            },
            dataArr :[],  //tree数据结构数组
            subData:[],   //选中的数据权限
        }
    },
    created(){
        //查询tree菜单数据
        this.seleCidan();
    },
    methods:{
        //查询tree功能权限数据
        seleCidan(){
            this.http.post('api/Sys_Group_Auth/GetCurrentTreePermission').then((result) => {
                console.log('result',result);
                //将一维数组转成tree数据结构
                const tree = this.buildTree(result.data.tree);
                //将按钮挂在到tree上
                //this.btnTree(tree);
                this.dataArr=tree;

                console.log(' this.dataArr', this.dataArr);
            });
        },
        //返显获取勾选的节点
        selectTree(){
            this.http.post('/api/Sys_Group_Auth/GetUserGroupPermission?groupRoleId='+this.roleId,{}).then((result) => {
                let listy=result.data;
                
                //查找对应tree的节点id 用于返显
                const items = this.findItemsByIds(this.dataArr, listy);
                let idsArr=items.map(item=>item.id);
                this.$nextTick(()=>{
                    this.$refs.tree.setCheckedKeys(idsArr,false);
                })
            });
        },
        //查找对应tree的节点id 用于返显
        findItemsByIds(tree, ids) {
            let result = [];
            function search(nodes) {
                nodes.forEach(node => {
                    if (ids.includes(node.nodeValue*1)) {
                        result.push(node); // 如果当前节点的ID在数组中，则添加到结果中
                    }
                    if (node.children && node.children.length > 0) {
                        search(node.children); // 递归搜索子节点
                    }
                });
            }
            search(tree); // 从树的根节点开始搜索
            return result; // 返回找到的所有项的数组
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
                if (item.parentId === null || item.parentId === 0) {
                    // 如果 parentId 为 null 或 0，说明是根节点
                    tree.push(map[item.id]);
                } else {
                    // 否则，将其添加到父节点的 children 数组中
                    if (map[item.parentId]) {
                        map[item.parentId].children.push(map[item.id]);
                    }
                }
            });
            return tree;
        },
        //复选框逻辑处理 选中节点
        checks(checkedNodes,checkedKeys){
            let arrs=checkedKeys.checkedNodes;

        },
 
        //提交菜单
        submits(){
            
            //获取选中的节点
            let arrs= this.$refs.tree.getCheckedNodes(true);

            //处理数据格式为后端需要的格式
            let resulte=arrs.map(item=>item.nodeValue*1);
            let obj={
                groupIds:resulte,
                groupRoleId:this.roleId
            }
            let url = `api/Sys_Group_Auth/SaveGroupPermission`;
            this.http.post(url, obj, true).then((result) => {
                console.log('result',result);
                ElMessage({
                    message: result.message,
                    type: 'success',
                })
                this.dialogVisible=false;
            });
        },

        //接收表单行数据
        feilopenSate(row){
            this.roleId=row.Role_Id;
            this.dialogVisible=true;
            //查询选择的节点
            this.selectTree();
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