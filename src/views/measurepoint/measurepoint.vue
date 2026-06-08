<template>
    <div class="com-tree">
      <div class="left-tree">
        <monpoint-tree :onChange="onChange"></monpoint-tree>
      </div>
      <div class="right-table">
        <monpoint-table :nodeName="nodeName" ref="monpointTable"></monpoint-table>
      </div>
    </div>
  </template>
  <script>
  import MonPointTable from "./monpoint/MonPointTable";
  import MonPointTree from "./monpoint/MonPointTree";
//   import store from '../../../store/index'
  
  export default {
    components: { 
      "monpoint-tree": MonPointTree,
      "monpoint-table": MonPointTable,
    },
    created() {
      //初始化一个对象全局缓存起来，当点击左边树形菜单时，把点击菜单的treeId存到data里
      this.$store.getters.data().MonPointTreeData = { treeId: undefined };
    },
    data(){
      return{
        nodeName:'',
      }
    },
    methods: {
      onChange(treeId) {
        this.$nextTick(() => {
          //调用table刷新方法
          this.$store.getters.data().MonPointManager.nodeClick(treeId);
          this.$store.dispatch("setTreeValue", treeId);
          this.nodeName=treeId.nodeName
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
  