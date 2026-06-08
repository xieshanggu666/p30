<template>
  <div class="com-tree">
    <div class="left-tree">
      <tree :onChange="onChange"></tree>
    </div>
    <div class="right-table">
      <manager-table :nodeValue="parentNodeValue"></manager-table>
    </div>
  </div>
</template>
<script>
import ManagerTable from "./evaluationinfo/evaluationinfoTable.vue";
import tree from "../../monitorbusiness/monpointmanager/monpoint/MonPointTree.vue";
export default {
  components: {
    "tree": tree,
    "manager-table": ManagerTable,
  },
  data(){
    return{
      parentNodeValue:'',
    }
  },
  created() {
    //初始化一个对象全局缓存起来，当点击左边树形菜单时，把点击菜单的treeId存到data里
    this.$store.getters.data().MonPointTreeData = { treeId: undefined };
  },
  methods: {
    onChange(treeId) {
      this.$nextTick(() => {
        //调用table刷新方法
        this.$store.getters.data().viewGridEvaluationInfo.nodeClick(treeId);
        this.parentNodeValue=treeId.nodeValue
      });
    },
  },
};
</script>

<style lang="less" scoped>
.com-tree {
  display: flex;
  height: 100%;
  > .left-tree {
    width: 240px;
    height: 100%;
    background: #fff;
    margin-right: 5px;
  }
  > .right-table {
    width: calc(100% - 245px);
    height: 100%;
    background: #fff;
  }
}
</style>
