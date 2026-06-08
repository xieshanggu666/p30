<template>
  <div class="com-tree">
    <div class="left-tree">
      <manager-tree :onChange="onChange"></manager-tree>
    </div>
    <div class="right-table">
      <manager-table :nodeValue="parentNodeValue" ref="managerTable"></manager-table>
    </div>
  </div>
</template>
<script>
import ManagerTable from "./manager/ManagerTable";
import ManagerTree from "./manager/ManagerTree";
export default {
  components: {
    "manager-tree": ManagerTree,
    "manager-table": ManagerTable,
  },
  data(){
    return{
      parentNodeValue:'',
    }
  },
  created() {
    //初始化一个对象全局缓存起来，当点击左边树形菜单时，把点击菜单的treeId存到data里
    this.$store.getters.data().treeData = { treeId: undefined };
  },
  methods: {
    onChange(treeId) {
      this.$nextTick(() => {
        //调用table刷新方法
        this.$store.getters.data().viewGridManager.nodeClick(treeId);
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
    // flex: 1;
  }
}
</style>
